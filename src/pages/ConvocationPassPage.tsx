import { Icon } from '../components/ui/Icon'
import { REGISTRATION_AMOUNT, REGISTRATION_ID, STUDENT } from '../config/student'
import type { Guest } from '../types/registration'

interface ConvocationPassPageProps {
  guests: Guest[]
}

function QrPlaceholder({ variant }: { variant: number }) {
  const baseCells = [
    0,1,2,3,4,6,8,9,10,11,12,14,16,18,20,22,24,26,28,30,32,33,34,36,38,39,
    40,42,43,44,45,46,47,48,50,52,54,56,57,58,60,61,62,64,66,68,70,72,73,74,
    76,78,79,80,82,84,86,88,89,90,92,94,95,96,98,100,102,104,106,107,108,109,
    110,112,114,116,118,120,
  ]
  const cells = variant === 0 ? baseCells : baseCells.filter((_, index) => index % (variant + 2) !== 0)
  return <svg className="person-qr" viewBox="0 0 11 11" aria-label="QR code placeholder">{cells.map((cell) => <rect key={cell} x={cell % 11} y={Math.floor(cell / 11)} width="1" height="1"/>)}</svg>
}

interface PersonPassProps {
  name: string
  label: string
  relationship?: string
  index: number
}

function PersonPass({ name, label, relationship, index }: PersonPassProps) {
  const passId = index === 0 ? REGISTRATION_ID : REGISTRATION_ID + '-G' + index
  return (
    <article className="person-pass">
      <header><div className="pass-mini-brand"><img src="/campus-trust-logo.png" alt=""/><div><strong>Campus<span>Trust</span></strong><small>CONVOCATION 2026</small></div></div><span className="pass-type">{label}</span></header>
      <div className="person-pass-body">
        <div className="pass-person">
          <div className="pass-avatar">{index === 0 ? 'AM' : name.split(' ').map((part) => part[0]).join('').slice(0,2).toUpperCase()}</div>
          <div><span>{label}</span><h2>{name}</h2><p>{index === 0 ? STUDENT.registerNumber : relationship + ' · Guest of ' + STUDENT.name}</p></div>
        </div>
        <div className="pass-event-info"><div><span>DATE & TIME</span><strong>07 October 2026 · 09:30 AM</strong></div><div><span>VENUE</span><strong>Dr. T. P. Ganesan Auditorium</strong></div></div>
        {index === 0 && <div className="pass-contact-info"><span><Icon name="mail" size={14}/>{STUDENT.email}</span><span><Icon name="phone" size={14}/>{STUDENT.mobile}</span></div>}
        <div className="person-seat"><div><span>BLOCK</span><strong>A</strong></div><div><span>ROW</span><strong>R12</strong></div><div><span>SEAT</span><strong>{25 + index}</strong></div><div><span>GATE</span><strong>02</strong></div></div>
        <div className="pass-confirmation"><span><Icon name="check" size={14}/> Confirmed</span><span><Icon name="check" size={14}/> Paid</span><span><Icon name="check" size={14}/> IDVS verified</span></div>
        <div className="refreshment-pass-note"><strong>REFRESHMENT</strong><span>Please use this for refreshment.</span></div>
      </div>
      <aside className="person-pass-qr"><QrPlaceholder variant={index}/><strong>{passId}</strong><span>Scan at entry</span></aside>
    </article>
  )
}

export function ConvocationPassPage({ guests }: ConvocationPassPageProps) {
  return (
    <div className="page passes-page prototype-page">
      <div className="prototype-heading">
        <div className="college-title"><div className="college-logo"><Icon name="ticket" size={26}/></div><div><p className="eyebrow">REGISTRATION COMPLETE</p><h1>Convocation Passes</h1><p className="page-subtitle">{guests.length + 1} individual QR pass{guests.length ? 'es' : ''} generated successfully.</p></div></div>
        <div className="step-badge">Step 5 of 5</div>
      </div>
      <div className="five-step-progress"><span className="done"><Icon name="check" size={13}/></span><i className="done"/><span className="done"><Icon name="check" size={13}/></span><i className="done"/><span className="done"><Icon name="check" size={13}/></span><i className="done"/><span className="done"><Icon name="check" size={13}/></span><i className="done"/><span className="active">5</span></div>
      <div className="pass-success"><span><Icon name="check" size={22}/></span><div><strong>Registration and payment confirmed</strong><p>₹{REGISTRATION_AMOUNT} paid successfully. Each attendee has a unique entry QR code.</p></div></div>
      <div className="passes-grid">
        <PersonPass name={STUDENT.name} label="STUDENT PASS" index={0}/>
        {guests.map((guest, index) => <PersonPass key={index} name={guest.name} relationship={guest.relationship} label={'GUEST ' + (index + 1)} index={index + 1}/>)}
      </div>
      <button className="download-pass-button" onClick={() => window.print()}><Icon name="download" size={19}/> Download All Passes</button>
      <p className="download-hint">Opens your print dialog—choose “Save as PDF” to download.</p>
    </div>
  )
}
