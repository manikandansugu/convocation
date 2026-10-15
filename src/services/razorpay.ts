import { REGISTRATION_AMOUNT, REGISTRATION_ID, STUDENT } from '../config/student'

export type PaymentMethod = 'upi' | 'card' | 'bank'

interface OrderResponse {
  keyId: string
  orderId: string
  amount: number
  currency: string
}

interface RazorpayResponse {
  razorpay_payment_id: string
  razorpay_order_id: string
  razorpay_signature: string
}

interface RazorpayOptions {
  key: string
  amount: number
  currency: string
  name: string
  description: string
  order_id: string
  handler: (response: RazorpayResponse) => void
  prefill: { name: string; email: string; contact: string }
  notes: { registration_id: string; preferred_method: PaymentMethod }
  theme: { color: string }
  modal: { ondismiss: () => void }
  retry: { enabled: boolean; max_count: number }
}

interface RazorpayInstance {
  open: () => void
  on: (event: 'payment.failed', handler: (response: { error?: { description?: string } }) => void) => void
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance
  }
}

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')

const requestJson = async <T>(path: string, options: RequestInit): Promise<T> => {
  let response: Response
  try {
    response = await fetch(`${apiBaseUrl}${path}`, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...options.headers },
    })
  } catch {
    throw new Error('The payment API is not reachable. Start the app with npm run dev and try again.')
  }
  const body = await response.json().catch(() => null)

  if (!response.ok) {
    const fallback = response.status === 404
      ? 'The payment API is not deployed at the configured URL.'
      : 'The payment service could not complete the request.'
    throw new Error(body?.error || fallback)
  }

  return body as T
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
  const order = await requestJson<OrderResponse>('/api/payments/order', {
    method: 'POST',
    body: JSON.stringify({ registrationId: REGISTRATION_ID, preferredMethod }),
  })

  if (order.amount !== REGISTRATION_AMOUNT * 100 || order.currency !== 'INR') {
    throw new Error('The payment amount returned by the server does not match the order summary.')
  }
  const RazorpayCheckout = window.Razorpay
  if (!RazorpayCheckout) throw new Error('Razorpay Checkout is unavailable.')

  const payment = await new Promise<RazorpayResponse>((resolve, reject) => {
    let settled = false
    const checkout = new RazorpayCheckout({
      key: order.keyId,
      amount: order.amount,
      currency: order.currency,
      name: 'Campus Trust',
      description: 'Graduation Regalia',
      order_id: order.orderId,
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

  return requestJson<{ verified: true; paymentId: string; orderId: string; status: string }>('/api/payments/verify', {
    method: 'POST',
    body: JSON.stringify(payment),
  })
}
