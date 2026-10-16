import { useState, type FormEvent } from 'react'
import { Icon } from '../components/ui/Icon'
import {
  GRADUATION_REGALIA_AMOUNT,
  REGISTRATION_AMOUNT,
  REGISTRATION_ID,
  STUDENT,
} from '../config/student'
import { processRazorpayPayment, type PaymentMethod } from '../services/razorpay'

interface PaymentPageProps {
  onBack: () => void
  onSuccess: () => void
}

export function PaymentPage({ onBack, onSuccess }: PaymentPageProps) {
  const [method, setMethod] = useState<PaymentMethod>('upi')
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentError, setPaymentError] = useState('')

  const startPayment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setPaymentError('')
    setIsProcessing(true)
    try {
      await processRazorpayPayment(method)
      onSuccess()
    } catch (error) {
      setPaymentError(error instanceof Error ? error.message : 'Payment could not be completed.')
      setIsProcessing(false)
    }
  }

  return (
    <div className="page payment-page prototype-page">
      <div className="prototype-heading">
        <div className="college-title"><div className="college-logo"><Icon name="wallet" size={29}/></div><div><p className="eyebrow">SECURE CHECKOUT</p><h1>Payment Gateway</h1><p className="page-subtitle">Complete your payment to confirm your convocation registration.</p></div></div>
        <div className="step-badge">Step 3 of 5</div>
      </div>
      <div className="five-step-progress"><span className="done"><Icon name="check" size={13}/></span><i className="done"/><span className="done"><Icon name="check" size={13}/></span><i className="done"/><span className="active">3</span><i/><span>4</span><i/><span>5</span></div>

      <div className="payment-layout">
        <form className="panel payment-card" onSubmit={startPayment}>
          <div className="payment-card-header"><div><p className="eyebrow">PAYMENT METHOD</p><h2>Choose how you want to pay</h2></div><span className="secure-payment">Secure payment</span></div>
          <div className="payment-methods">
            <button type="button" className={method === 'upi' ? 'selected' : ''} onClick={() => setMethod('upi')}><span><Icon name="phone"/></span><strong>UPI</strong><small>GPay, PhonePe, Paytm</small></button>
            <button type="button" className={method === 'card' ? 'selected' : ''} onClick={() => setMethod('card')}><span><Icon name="card"/></span><strong>Card</strong><small>Credit or debit card</small></button>
            <button type="button" className={method === 'bank' ? 'selected' : ''} onClick={() => setMethod('bank')}><span><Icon name="bank"/></span><strong>Net Banking</strong><small>All major banks</small></button>
          </div>

          <div className="payment-fields">
            <div className="razorpay-method-note">
              <span><Icon name={method === 'upi' ? 'phone' : method === 'card' ? 'card' : 'bank'} size={22}/></span>
              <div><strong>{method === 'upi' ? 'Pay with UPI' : method === 'card' ? 'Pay with card' : 'Pay with net banking'}</strong><small>Razorpay test payment will be completed automatically. No manual success or failure selection is required.</small></div>
            </div>
          </div>

          {paymentError && <p className="payment-error" role="alert">{paymentError}</p>}
          <div className="payment-actions"><button type="button" className="secondary-button" onClick={onBack} disabled={isProcessing}>Back</button><button className="pay-now-button" type="submit" disabled={isProcessing}>{isProcessing ? <><span className="spinner"/> Processing test payment…</> : <>Pay ₹{REGISTRATION_AMOUNT.toLocaleString('en-IN')} now <Icon name="arrow" size={18}/></>}</button></div>
        </form>

        <aside className="panel order-summary">
          <p className="eyebrow">ORDER SUMMARY</p><h2>Graduation Regalia</h2>
          <div className="student-summary"><div className="mini-avatar">AM</div><div><strong>{STUDENT.name}</strong><span>{STUDENT.registerNumber}</span></div></div>
          <dl><div><dt>Registration ID</dt><dd>{REGISTRATION_ID}</dd></div><div><dt>Graduation Regalia</dt><dd>₹{GRADUATION_REGALIA_AMOUNT.toLocaleString('en-IN')}</dd></div></dl>
          <div className="order-total"><span>Total amount</span><strong>₹{REGISTRATION_AMOUNT.toLocaleString('en-IN')}</strong></div>
          <div className="refreshment-note"><strong>Note</strong><span>Please use this for refreshment.</span></div>
          <p className="payment-note"><Icon name="check" size={16}/> Razorpay test mode is enabled. Payment succeeds automatically in this frontend-only demonstration.</p>
        </aside>
      </div>
    </div>
  )
}
