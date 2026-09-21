import { useState } from 'react'
import { Icon } from '../components/ui/Icon'
import type { Guest } from '../types/registration'

const MAX_GUESTS = 3

interface GuestAdditionPageProps {
  initialGuests: Guest[]
  onBack: () => void
  onContinue: (guests: Guest[]) => void
}

export function GuestAdditionPage({ initialGuests, onBack, onContinue }: GuestAdditionPageProps) {
  const [guests, setGuests] = useState<Guest[]>(initialGuests)

  const updateGuestCount = (count: number) => {
    setGuests((current) =>
      Array.from({ length: count }, (_, index) =>
        current[index] ?? { name: '', relationship: '' },
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

  return (
    <div className="page prototype-page guest-addition-page">
      <div className="prototype-heading">
        <div className="college-title"><div className="college-logo"><Icon name="user" size={26}/></div><div><p className="eyebrow">ACCOMPANYING GUESTS</p><h1>Guest Addition</h1><p className="page-subtitle">Add up to three people attending the convocation with you.</p></div></div>
        <div className="step-badge">Step 4 of 5</div>
      </div>
      <div className="five-step-progress"><span className="done"><Icon name="check" size={13}/></span><i className="done"/><span className="done"><Icon name="check" size={13}/></span><i className="done"/><span className="done"><Icon name="check" size={13}/></span><i className="done"/><span className="active">4</span><i/><span>5</span></div>

      <form className="panel guest-addition-card" onSubmit={(event) => { event.preventDefault(); onContinue(guests) }}>
        <header><div><p className="eyebrow">GUEST INFORMATION</p><h2>Who is joining you?</h2></div><div className="guest-options">{Array.from({ length: MAX_GUESTS + 1 }, (_, count) => <button type="button" className={guests.length === count ? 'selected' : ''} key={count} onClick={() => updateGuestCount(count)}>{count}</button>)}</div></header>
        <div className="guest-payment-note"><Icon name="check" size={17}/><div><strong>Payment completed — ₹1,000</strong><span>Guest passes are included in your registration. No additional payment is required.</span></div></div>
        {guests.length === 0 ? <div className="empty-guest-state"><Icon name="user" size={32}/><strong>No guests added</strong><span>You can continue and generate only your student pass.</span></div> :
          <div className="guest-form-list">
            {guests.map((guest, index) => <section className="guest-person-card" key={index}><div className="guest-number">{index + 1}</div><div className="guest-fields two-fields"><label><span>Guest name <b>*</b></span><input value={guest.name} onChange={(event) => updateGuest(index, 'name', event.target.value)} placeholder="Enter full name" required/></label><label><span>Relationship <b>*</b></span><select value={guest.relationship} onChange={(event) => updateGuest(index, 'relationship', event.target.value)} required><option value="">Select relationship</option><option>Father</option><option>Mother</option><option>Spouse</option><option>Sibling</option><option>Guardian</option><option>Other</option></select></label></div></section>)}
          </div>
        }
        <div className="screen-actions"><button type="button" className="secondary-button" onClick={onBack}>Back</button><button className="flow-primary" type="submit">Generate {guests.length + 1} pass{guests.length ? 'es' : ''} <Icon name="arrow" size={18}/></button></div>
      </form>
    </div>
  )
}
