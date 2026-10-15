import assert from 'node:assert/strict'
import { createHmac } from 'node:crypto'
import test from 'node:test'
import { createOrder, isValidPaymentSignature } from './razorpay-service.mjs'

test('validates the Razorpay signature using order ID and payment ID', () => {
  const keySecret = 'test-secret'
  const orderId = 'order_test'
  const paymentId = 'pay_test'
  const signature = createHmac('sha256', keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex')

  assert.equal(isValidPaymentSignature({ orderId, paymentId, signature, keySecret }), true)
  assert.equal(isValidPaymentSignature({ orderId, paymentId, signature: '0'.repeat(64), keySecret }), false)
})

test('creates an order with Basic authentication and server-owned amount', async () => {
  const fetchImpl = async (url, options) => {
    assert.equal(url, 'https://api.razorpay.com/v1/orders')
    assert.match(options.headers.Authorization, /^Basic /)
    assert.deepEqual(JSON.parse(options.body), {
      amount: 10000,
      currency: 'INR',
      receipt: 'CONV-2026-10245-test',
      notes: { registration_id: 'CONV-2026-10245' },
    })

    return new Response(JSON.stringify({ id: 'order_123', amount: 10000, currency: 'INR' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const order = await createOrder({
    keyId: 'rzp_test_key',
    keySecret: 'test-secret',
    amount: 10000,
    currency: 'INR',
    receipt: 'CONV-2026-10245-test',
    notes: { registration_id: 'CONV-2026-10245' },
    fetchImpl,
  })

  assert.equal(order.id, 'order_123')
})
