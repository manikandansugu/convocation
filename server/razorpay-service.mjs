import { createHmac, timingSafeEqual } from 'node:crypto'

const RAZORPAY_API_BASE = 'https://api.razorpay.com/v1'

const authorizationHeader = (keyId, keySecret) =>
  `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString('base64')}`

const parseProviderResponse = async (response) => {
  const text = await response.text()
  let body = null

  try {
    body = text ? JSON.parse(text) : null
  } catch {
    body = null
  }

  if (!response.ok) {
    const description = body?.error?.description || 'Razorpay request failed.'
    const error = new Error(description)
    error.statusCode = response.status
    throw error
  }

  return body
}

export async function createOrder({
  keyId,
  keySecret,
  amount,
  currency,
  receipt,
  notes,
  fetchImpl = fetch,
}) {
  const response = await fetchImpl(`${RAZORPAY_API_BASE}/orders`, {
    method: 'POST',
    headers: {
      Authorization: authorizationHeader(keyId, keySecret),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ amount, currency, receipt, notes }),
  })

  return parseProviderResponse(response)
}

export function isValidPaymentSignature({ orderId, paymentId, signature, keySecret }) {
  if (!orderId || !paymentId || !signature || !keySecret) return false

  const expected = createHmac('sha256', keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex')

  if (!/^[a-f0-9]{64}$/i.test(signature)) return false

  const expectedBuffer = Buffer.from(expected, 'hex')
  const actualBuffer = Buffer.from(signature, 'hex')
  return expectedBuffer.length === actualBuffer.length && timingSafeEqual(expectedBuffer, actualBuffer)
}

export async function fetchPayment({ keyId, keySecret, paymentId, fetchImpl = fetch }) {
  const response = await fetchImpl(`${RAZORPAY_API_BASE}/payments/${encodeURIComponent(paymentId)}`, {
    headers: { Authorization: authorizationHeader(keyId, keySecret) },
  })

  return parseProviderResponse(response)
}
