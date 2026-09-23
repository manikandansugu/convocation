import { useState, type FormEvent } from 'react'
import { Icon } from '../components/ui/Icon'
import {
  CERTIFICATE_REGISTRATION_AMOUNT,
  GRADUATION_REGALIA_AMOUNT,
  REGISTRATION_AMOUNT,
  REGISTRATION_ID,
  STUDENT,
} from '../config/student'

type PaymentMethod = 'upi' | 'card' | 'bank'

interface PaymentPageProps {
  onBack: () => void
  onSuccess: () => void
}

export function PaymentPage({ onBack, onSuccess }: PaymentPageProps) {
  const [method, setMethod] = useState<PaymentMethod>('upi')
  const [isProcessing, setIsProcessing] = useState(false)

  const simulatePayment = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsProcessing(true)
    window.setTimeout(onSuccess, 900)
  }

  return (
    <div className="page payment-page prototype-page">
      <div className="prototype-heading">
        <div className="college-title"><div className="college-logo"><Icon name="wallet" size={29}/></div><div><p className="eyebrow">SECURE CHECKOUT</p><h1>Payment Gateway</h1><p className="page-subtitle">Complete your payment to confirm your convocation registration.</p></div></div>
        <div className="step-badge">Step 3 of 5</div>
      </div>
      <div className="five-step-progress"><span className="done"><Icon name="check" size={13}/></span><i className="done"/><span className="done"><Icon name="check" size={13}/></span><i className="done"/><span className="active">3</span><i/><span>4</span><i/><span>5</span></div>

      <div className="payment-layout">
        <form className="panel payment-card" onSubmit={simulatePayment}>
          <div className="payment-card-header"><div><p className="eyebrow">PAYMENT METHOD</p><h2>Choose how you want to pay</h2></div><span className="secure-payment">Secure payment</span></div>
          <div className="payment-methods">
            <button type="button" className={method === 'upi' ? 'selected' : ''} onClick={() => setMethod('upi')}><span><Icon name="phone"/></span><strong>UPI</strong><small>GPay, PhonePe, Paytm</small></button>
            <button type="button" className={method === 'card' ? 'selected' : ''} onClick={() => setMethod('card')}><span><Icon name="card"/></span><strong>Card</strong><small>Credit or debit card</small></button>
            <button type="button" className={method === 'bank' ? 'selected' : ''} onClick={() => setMethod('bank')}><span><Icon name="bank"/></span><strong>Net Banking</strong><small>All major banks</small></button>
          </div>

          <div className="payment-fields">
            {method === 'upi' && <label><span>UPI ID <b>*</b></span><div className="payment-input"><input placeholder="yourname@bank" defaultValue="arunmenon@okaxis" required/><span>UPI</span></div><small>A payment request will be sent to your UPI app.</small></label>}
            {method === 'card' && <><label className="full-field"><span>Card number <b>*</b></span><input inputMode="numeric" placeholder="1234 5678 9012 3456" required/></label><label><span>Expiry date <b>*</b></span><input placeholder="MM / YY" required/></label><label><span>CVV <b>*</b></span><input type="password" inputMode="numeric" maxLength={3} placeholder="•••" required/></label><label className="full-field"><span>Name on card <b>*</b></span><input placeholder="Name as shown on card" required/></label></>}
            {method === 'bank' && <label><span>Select your bank <b>*</b></span><select required defaultValue=""><option value="" disabled>Choose a bank</option><option>State Bank of India</option><option>HDFC Bank</option><option>ICICI Bank</option><option>Axis Bank</option><option>Indian Bank</option></select><small>You will be redirected to your bank’s secure page.</small></label>}
          </div>

          <div className="payment-actions"><button type="button" className="secondary-button" onClick={onBack}>Back</button><button className="pay-now-button" type="submit" disabled={isProcessing}>{isProcessing ? <><span className="spinner"/> Processing payment…</> : <>Pay ₹{REGISTRATION_AMOUNT.toLocaleString('en-IN')} now <Icon name="arrow" size={18}/></>}</button></div>
        </form>

        <aside className="panel order-summary">
          <p className="eyebrow">ORDER SUMMARY</p><h2>Certificate Registration</h2>
          <div className="student-summary"><div className="mini-avatar">AM</div><div><strong>{STUDENT.name}</strong><span>{STUDENT.registerNumber}</span></div></div>
          <dl><div><dt>Registration ID</dt><dd>{REGISTRATION_ID}</dd></div><div><dt>Certificate Registration</dt><dd>₹{CERTIFICATE_REGISTRATION_AMOUNT.toLocaleString('en-IN')}</dd></div><div><dt>Graduation Regalia</dt><dd>₹{GRADUATION_REGALIA_AMOUNT.toLocaleString('en-IN')}</dd></div></dl>
          <div className="order-total"><span>Total amount</span><strong>₹{REGISTRATION_AMOUNT.toLocaleString('en-IN')}</strong></div>
          <div className="refreshment-note"><strong>Note</strong><span>Please use this for refreshment.</span></div>
          <p className="payment-note"><Icon name="check" size={16}/> Payment is simulated for this prototype. No real transaction will occur.</p>
        </aside>
      </div>
    </div>
  )
}
