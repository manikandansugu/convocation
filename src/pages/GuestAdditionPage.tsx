import { useRef, useState } from 'react'
import { Icon } from '../components/ui/Icon'
import { REGISTRATION_AMOUNT, REGISTRATION_ID } from '../config/student'
import type { Guest } from '../types/registration'

const MAX_GUESTS = 1

interface GuestAdditionPageProps {
  initialGuests: Guest[]
  onBack: () => void
  onContinue: (guests: Guest[]) => void
}

export function GuestAdditionPage({ initialGuests, onBack, onContinue }: GuestAdditionPageProps) {
  const [guests, setGuests] = useState<Guest[]>(initialGuests.slice(0, MAX_GUESTS))
  const [documentPreviews, setDocumentPreviews] = useState<Record<number, { front?: string; back?: string }>>({})
  const [extractingGuest, setExtractingGuest] = useState<number | null>(null)
  const [couponShareStatus, setCouponShareStatus] = useState('')
  const extractionTimers = useRef<Record<number, number>>({})
  const guestCouponCode = `${REGISTRATION_ID}-GUEST-01`
  const guestCouponLink = `${window.location.origin}${import.meta.env.BASE_URL}?guestCoupon=${encodeURIComponent(guestCouponCode)}`

  const updateGuestCount = (count: number) => {
    setGuests((current) =>
      Array.from({ length: count }, (_, index) =>
        current[index] ?? { name: '', relationship: '', aadhaarNumber: '' },
      ),
    )
  }

  const updateGuest = (index: number, field: keyof Guest, value: string) => {
    setGuests((current) =>
      current.map((guest, guestIndex) =>
        guestIndex === index ? { ...guest, [field]: value } : guest,
      ),
    )
  }

  const uploadAadhaar = (guestIndex: number, side: 'front' | 'back', file?: File) => {
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      setDocumentPreviews((current) => ({
        ...current,
        [guestIndex]: { ...current[guestIndex], [side]: String(reader.result) },
      }))

      const otherSide = side === 'front' ? 'back' : 'front'
      if (documentPreviews[guestIndex]?.[otherSide]) {
        window.clearTimeout(extractionTimers.current[guestIndex])
        setExtractingGuest(guestIndex)
        extractionTimers.current[guestIndex] = window.setTimeout(() => {
          updateGuest(guestIndex, 'aadhaarNumber', '0000 1111 2222')
          setExtractingGuest(null)
        }, 700)
      } else {
        updateGuest(guestIndex, 'aadhaarNumber', '')
      }
    }
    reader.readAsDataURL(file)
  }

  const removeAadhaar = (guestIndex: number, side: 'front' | 'back') => {
    window.clearTimeout(extractionTimers.current[guestIndex])
    setDocumentPreviews((current) => ({
      ...current,
      [guestIndex]: { ...current[guestIndex], [side]: undefined },
    }))
    setExtractingGuest((current) => current === guestIndex ? null : current)
    updateGuest(guestIndex, 'aadhaarNumber', '')
  }

  const copyGuestCouponLink = async () => {
    await navigator.clipboard.writeText(guestCouponLink)
    setCouponShareStatus('Guest coupon link copied')
    window.setTimeout(() => setCouponShareStatus(''), 2500)
  }

  const shareGuestCouponLink = async () => {
    if (navigator.share) {
      await navigator.share({
        title: 'Convocation guest coupon',
        text: 'Use this one-time coupon link to generate your convocation guest pass.',
        url: guestCouponLink,
      })
      setCouponShareStatus('Guest coupon link shared')
      window.setTimeout(() => setCouponShareStatus(''), 2500)
      return
    }
    await copyGuestCouponLink()
  }

  return (
    <div className="page prototype-page guest-addition-page">
      <div className="five-step-progress"><span className="done"><Icon name="check" size={13}/></span><i className="done"/><span className="done"><Icon name="check" size={13}/></span><i className="done"/><span className="done"><Icon name="check" size={13}/></span><i className="done"/><span className="active">4</span><i/><span>5</span></div>

      <form className="panel guest-addition-card" onSubmit={(event) => { event.preventDefault(); onContinue(guests) }}>
        <header><div><p className="eyebrow">GUEST INFORMATION</p><h2>Who is joining you?</h2></div><div className="guest-options">{Array.from({ length: MAX_GUESTS + 1 }, (_, count) => <button type="button" className={guests.length === count ? 'selected' : ''} key={count} onClick={() => updateGuestCount(count)}>{count}</button>)}</div></header>
        <div className="guest-payment-note"><Icon name="check" size={17}/><div><strong>Payment completed — ₹{REGISTRATION_AMOUNT.toLocaleString('en-IN')}</strong><span>One guest pass is included in your registration. No additional payment is required.</span></div></div>
        {guests.length === 0 ? <div className="empty-guest-state"><Icon name="user" size={32}/><strong>No guests added</strong><span>You can continue and generate only your student pass.</span></div> :
          <div className="guest-form-list">
            {guests.map((guest, index) => <section className="guest-person-card" key={index}>
              <div className="guest-number">{index + 1}</div>
              <div className="guest-person-content">
                <div className="guest-fields two-fields">
                  <label><span>Guest name <b>*</b></span><input value={guest.name} onChange={(event) => updateGuest(index, 'name', event.target.value)} placeholder="Enter full name" required/></label>
                  <label><span>Relationship <b>*</b></span><select value={guest.relationship} onChange={(event) => updateGuest(index, 'relationship', event.target.value)} required><option value="">Select relationship</option><option>Father</option><option>Mother</option><option>Spouse</option><option>Sibling</option><option>Guardian</option><option>Other</option></select></label>
                </div>
                <div className="aadhaar-section">
                  <div className="aadhaar-heading"><div><strong>Aadhaar upload</strong><span>Upload the front and back of the guest’s Aadhaar card</span></div><span className="prototype-ocr">Prototype OCR</span></div>
                  <div className="aadhaar-upload-grid">
                    <div className="aadhaar-upload">
                      <input id={`aadhaar-front-${index}`} type="file" accept="image/png,image/jpeg,image/webp,image/avif" onChange={(event) => uploadAadhaar(index, 'front', event.target.files?.[0])}/>
                      <label className="aadhaar-upload-trigger" htmlFor={`aadhaar-front-${index}`}>
                        {documentPreviews[index]?.front ? <span className="aadhaar-preview"><img src={documentPreviews[index].front} alt="Aadhaar card front preview"/></span> : <span className="aadhaar-empty-preview"><Icon name="file" size={25}/><small>No front image uploaded</small></span>}
                        <strong><Icon name="file" size={15}/> {documentPreviews[index]?.front ? 'Replace Aadhaar front' : 'Upload Aadhaar front'}</strong>
                        <small>{documentPreviews[index]?.front ? 'Front uploaded' : 'PNG, JPG, WEBP or AVIF'}</small>
                      </label>
                      {documentPreviews[index]?.front && <button type="button" className="remove-aadhaar" onClick={() => removeAadhaar(index, 'front')}>Remove</button>}
                    </div>
                    <div className="aadhaar-upload">
                      <input id={`aadhaar-back-${index}`} type="file" accept="image/png,image/jpeg,image/webp,image/avif" onChange={(event) => uploadAadhaar(index, 'back', event.target.files?.[0])}/>
                      <label className="aadhaar-upload-trigger" htmlFor={`aadhaar-back-${index}`}>
                        {documentPreviews[index]?.back ? <span className="aadhaar-preview"><img src={documentPreviews[index].back} alt="Aadhaar card back preview"/></span> : <span className="aadhaar-empty-preview"><Icon name="file" size={25}/><small>No back image uploaded</small></span>}
                        <strong><Icon name="file" size={15}/> {documentPreviews[index]?.back ? 'Replace Aadhaar back' : 'Upload Aadhaar back'}</strong>
                        <small>{documentPreviews[index]?.back ? 'Back uploaded' : 'PNG, JPG, WEBP or AVIF'}</small>
                      </label>
                      {documentPreviews[index]?.back && <button type="button" className="remove-aadhaar" onClick={() => removeAadhaar(index, 'back')}>Remove</button>}
                    </div>
                  </div>
                  <label className="aadhaar-number-field"><span>Aadhaar number <b>*</b></span><div><input value={guest.aadhaarNumber} onChange={(event) => updateGuest(index, 'aadhaarNumber', event.target.value)} placeholder="Upload both sides to extract the number" inputMode="numeric" readOnly required/><span className={extractingGuest === index ? 'extracting' : ''}>{extractingGuest === index ? 'Reading…' : guest.aadhaarNumber ? <><Icon name="check" size={13}/> Extracted</> : 'Awaiting both sides'}</span></div><small>The number is populated only after both front and back uploads are complete.</small></label>
                  <p className="aadhaar-privacy">Aadhaar images stay in this browser preview and are not uploaded to a server.</p>
                </div>
              </div>
            </section>)}
          </div>
        }
        {guests.length === 1 && (
          <section className="guest-coupon-panel">
            <div className="guest-coupon-heading">
              <span><Icon name="ticket" size={20}/></span>
              <div><p className="eyebrow">GUEST COUPON</p><h3>Share the one-time guest pass link</h3><small>This coupon can be redeemed once and generates only one guest pass.</small></div>
            </div>
            <div className="guest-coupon-link">
              <div><small>Coupon link</small><strong>{guestCouponLink}</strong></div>
              <span>{guestCouponCode}</span>
            </div>
            <div className="guest-coupon-actions">
              <button type="button" className="secondary-button" onClick={copyGuestCouponLink}><Icon name="file" size={15}/> Copy link</button>
              <button type="button" className="flow-primary" onClick={shareGuestCouponLink}><Icon name="arrow" size={15}/> Share link</button>
              {couponShareStatus && <p><Icon name="check" size={14}/> {couponShareStatus}</p>}
            </div>
          </section>
        )}
        <div className="screen-actions"><button type="button" className="secondary-button" onClick={onBack}>Back</button><button className="flow-primary" type="submit">Generate Passes <Icon name="arrow" size={18}/></button></div>
      </form>
    </div>
  )
}
