import { createServer } from 'node:http'
import { createOrder, fetchPayment, isValidPaymentSignature } from './razorpay-service.mjs'

const port = Number(process.env.PORT || 8787)
const keyId = process.env.RAZORPAY_KEY_ID || ''
const keySecret = process.env.RAZORPAY_KEY_SECRET || ''
const amountInPaise = Number(process.env.PAYMENT_AMOUNT_IN_PAISE || 10000)
const currency = 'INR'
const paymentMethods = new Set(['upi', 'card', 'bank'])
const issuedOrders = new Map()
const allowedOrigins = new Set(
  (process.env.ALLOWED_ORIGINS || 'http://localhost:5173,https://manikandansugu.github.io')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
)

const sendJson = (response, statusCode, body, origin) => {
  if (origin && allowedOrigins.has(origin)) {
    response.setHeader('Access-Control-Allow-Origin', origin)
    response.setHeader('Vary', 'Origin')
  }
  response.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' })
  response.end(JSON.stringify(body))
}

const readJson = (request) => new Promise((resolve, reject) => {
  let body = ''

  request.on('data', (chunk) => {
    body += chunk
    if (body.length > 32_768) {
      reject(Object.assign(new Error('Request body is too large.'), { statusCode: 413 }))
      request.destroy()
    }
  })
  request.on('end', () => {
    try {
      resolve(body ? JSON.parse(body) : {})
    } catch {
      reject(Object.assign(new Error('Request body must be valid JSON.'), { statusCode: 400 }))
    }
  })
  request.on('error', reject)
})

const requireConfiguration = () => {
  if (!keyId || !keySecret) {
    throw Object.assign(new Error('Razorpay is not configured on the server.'), { statusCode: 503 })
  }
  if (!Number.isInteger(amountInPaise) || amountInPaise <= 0) {
    throw Object.assign(new Error('The server payment amount is invalid.'), { statusCode: 500 })
  }
}

const server = createServer(async (request, response) => {
  const origin = request.headers.origin
  const url = new URL(request.url || '/', `http://${request.headers.host || 'localhost'}`)

  if (request.method === 'OPTIONS') {
    if (origin && allowedOrigins.has(origin)) {
      response.setHeader('Access-Control-Allow-Origin', origin)
      response.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
      response.setHeader('Access-Control-Allow-Headers', 'Content-Type')
      response.setHeader('Vary', 'Origin')
    }
    response.writeHead(204)
    response.end()
    return
  }

  try {
    if (request.method === 'GET' && url.pathname === '/api/health') {
      sendJson(response, keyId && keySecret ? 200 : 503, {
        service: 'convocation-payments',
        status: keyId && keySecret ? 'ready' : 'configuration_required',
      }, origin)
      return
    }

    if (request.method === 'POST' && url.pathname === '/api/payments/order') {
      requireConfiguration()
      const body = await readJson(request)
      if (body.registrationId !== 'CONV-2026-10245') {
        throw Object.assign(new Error('Registration ID is invalid.'), { statusCode: 422 })
      }
      if (!paymentMethods.has(body.preferredMethod)) {
        throw Object.assign(new Error('Payment method is invalid.'), { statusCode: 422 })
      }

      const order = await createOrder({
        keyId,
        keySecret,
        amount: amountInPaise,
        currency,
        receipt: `${body.registrationId}-${Date.now()}`.slice(0, 40),
        notes: {
          registration_id: body.registrationId,
          preferred_method: String(body.preferredMethod || ''),
        },
      })
      if (!order?.id || order.amount !== amountInPaise || order.currency !== currency) {
        throw Object.assign(new Error('Razorpay returned an invalid order.'), { statusCode: 502 })
      }

      issuedOrders.set(order.id, {
        amount: order.amount,
        currency: order.currency,
        registrationId: body.registrationId,
      })

      sendJson(response, 201, {
        keyId,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
      }, origin)
      return
    }

    if (request.method === 'POST' && url.pathname === '/api/payments/verify') {
      requireConfiguration()
      const body = await readJson(request)
      const issuedOrder = issuedOrders.get(body.razorpay_order_id)
      if (!issuedOrder) {
        throw Object.assign(new Error('Payment order was not issued by this server.'), { statusCode: 400 })
      }
      const validSignature = isValidPaymentSignature({
        orderId: body.razorpay_order_id,
        paymentId: body.razorpay_payment_id,
        signature: body.razorpay_signature,
        keySecret,
      })

      if (!validSignature) {
        throw Object.assign(new Error('Payment signature verification failed.'), { statusCode: 400 })
      }

      const payment = await fetchPayment({
        keyId,
        keySecret,
        paymentId: body.razorpay_payment_id,
      })

      const paymentIsValid =
        payment.order_id === body.razorpay_order_id &&
        payment.amount === issuedOrder.amount &&
        payment.currency === issuedOrder.currency &&
        payment.status === 'captured'

      if (!paymentIsValid) {
        throw Object.assign(new Error('Payment details did not match the order.'), { statusCode: 409 })
      }

      issuedOrders.delete(body.razorpay_order_id)

      sendJson(response, 200, {
        verified: true,
        paymentId: payment.id,
        orderId: payment.order_id,
        status: payment.status,
      }, origin)
      return
    }

    sendJson(response, 404, { error: 'Route not found.' }, origin)
  } catch (error) {
    const statusCode = Number(error?.statusCode) || 500
    sendJson(response, statusCode, {
      error: statusCode >= 500 ? 'Payment service is unavailable.' : error.message,
    }, origin)
  }
})

server.listen(port, '127.0.0.1', () => {
  console.log(`Payment API listening on http://127.0.0.1:${port}`)
})
