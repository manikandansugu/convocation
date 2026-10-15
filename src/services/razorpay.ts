import { REGISTRATION_AMOUNT, REGISTRATION_ID, STUDENT } from '../config/student'

export type PaymentMethod = 'upi' | 'card' | 'bank'

interface RazorpayResponse {
  razorpay_payment_id: string
}

interface RazorpayOptions {
  key: string
  amount: number
  currency: string
  name: string
  description: string
  handler: (response: RazorpayResponse) => void
  prefill: { name: string; email: string; contact: string }
  notes: { registration_id: string; preferred_method: PaymentMethod }
  theme: { color: string }
  modal: { ondismiss: () => void }
  retry: { enabled: boolean; max_count: number }
}

const RAZORPAY_TEST_KEY_ID = 'rzp_test_TnqBb60FkGVEoV'

interface RazorpayInstance {
  open: () => void
  on: (event: 'payment.failed', handler: (response: { error?: { description?: string } }) => void) => void
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance
  }
}

const loadCheckout = () => new Promise<void>((resolve, reject) => {
  if (window.Razorpay) {
    resolve()
    return
  }

  const existingScript = document.querySelector<HTMLScriptElement>('script[data-razorpay-checkout]')
  if (existingScript) {
    existingScript.addEventListener('load', () => resolve(), { once: true })
    existingScript.addEventListener('error', () => reject(new Error('Razorpay Checkout could not be loaded.')), { once: true })
    return
  }

  const script = document.createElement('script')
  script.src = 'https://checkout.razorpay.com/v1/checkout.js'
  script.async = true
  script.dataset.razorpayCheckout = 'true'
  script.onload = () => resolve()
  script.onerror = () => reject(new Error('Razorpay Checkout could not be loaded.'))
  document.head.appendChild(script)
})

export async function processRazorpayPayment(preferredMethod: PaymentMethod) {
  await loadCheckout()
  const RazorpayCheckout = window.Razorpay
  if (!RazorpayCheckout) throw new Error('Razorpay Checkout is unavailable.')

  return new Promise<RazorpayResponse>((resolve, reject) => {
    let settled = false
    const checkout = new RazorpayCheckout({
      key: RAZORPAY_TEST_KEY_ID,
      amount: REGISTRATION_AMOUNT * 100,
      currency: 'INR',
      name: 'Campus Trust',
      description: 'Graduation Regalia',
      handler: (response) => {
        settled = true
        resolve(response)
      },
      prefill: {
        name: STUDENT.name,
        email: STUDENT.email,
        contact: STUDENT.mobile.replace(/\s/g, ''),
      },
      notes: { registration_id: REGISTRATION_ID, preferred_method: preferredMethod },
      theme: { color: '#1769e8' },
      retry: { enabled: true, max_count: 2 },
      modal: {
        ondismiss: () => {
          if (!settled) reject(new Error('Payment was cancelled.'))
        },
      },
    })

    checkout.on('payment.failed', (response) => {
      if (!settled) reject(new Error(response.error?.description || 'Payment failed. Please try again.'))
    })
    checkout.open()
  })
}
