export type PaymentMethod = 'upi' | 'card' | 'bank'

export interface RazorpayTestResponse {
  razorpay_payment_id: string
  payment_method: PaymentMethod
  status: 'success'
}

const TEST_PAYMENT_DELAY_MS = 1200

export function processRazorpayPayment(preferredMethod: PaymentMethod) {
  return new Promise<RazorpayTestResponse>((resolve) => {
    window.setTimeout(() => {
      resolve({
        razorpay_payment_id: `pay_test_${Date.now()}`,
        payment_method: preferredMethod,
        status: 'success',
      })
    }, TEST_PAYMENT_DELAY_MS)
  })
}
