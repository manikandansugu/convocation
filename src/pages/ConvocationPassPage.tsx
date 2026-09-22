import { useState } from 'react'
import { toPng } from 'html-to-image'
import JSZip from 'jszip'
import { QRCodeSVG } from 'qrcode.react'
import { Icon } from '../components/ui/Icon'
import { REGISTRATION_AMOUNT, REGISTRATION_ID, STUDENT } from '../config/student'
import type { Guest } from '../types/registration'

const QR_TARGET_URL = 'https://neccampus.srmtech.com/'

interface ConvocationPassPageProps {
  guests: Guest[]
}

interface PersonPassProps {
  name: string
  label: string
  relationship?: string
  index: number
  onDownload: (elementId: string, personName: string) => Promise<void>
}

function PersonPass({ name, label, relationship, index, onDownload }: PersonPassProps) {
  const passId = index === 0 ? REGISTRATION_ID : REGISTRATION_ID + '-G' + index
  const elementId = 'convocation-pass-' + index
  const initials = index === 0
    ? 'AM'
    : name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()

  return (
    <div className="pass-card-wrapper">
      <article className="person-pass" id={elementId}>
        <header>
          <div className="pass-mini-brand"><img src={import.meta.env.BASE_URL + 'campus-trust-logo.png'} alt=""/><div><strong>Campus<span>Trust</span></strong><small>CONVOCATION 2026</small></div></div>
          <span className="pass-type">{label}</span>
        </header>
        <div className="person-pass-body">
          <div className="pass-person">
            <div className="pass-avatar">{initials}</div>
            <div><span>{label}</span><h2>{name}</h2><p>{index === 0 ? STUDENT.registerNumber : relationship + ' · Guest of ' + STUDENT.name}</p></div>
          </div>
          <div className="pass-event-info"><div><span>DATE & TIME</span><strong>07 October 2026 · 09:30 AM</strong></div><div><span>VENUE</span><strong>Dr. T. P. Ganesan Auditorium</strong></div></div>
          {index === 0 && <div className="pass-contact-info"><span><Icon name="mail" size={14}/>{STUDENT.email}</span><span><Icon name="phone" size={14}/>{STUDENT.mobile}</span></div>}
          <div className="person-seat"><div><span>BLOCK</span><strong>A</strong></div><div><span>ROW</span><strong>R12</strong></div><div><span>SEAT</span><strong>{25 + index}</strong></div><div><span>GATE</span><strong>02</strong></div></div>
          <div className="pass-confirmation"><span><Icon name="check" size={14}/> Confirmed</span><span><Icon name="check" size={14}/> Paid</span><span><Icon name="check" size={14}/> IDVS verified</span></div>
          <div className="refreshment-pass-note"><strong>REFRESHMENT</strong><span>Please use this for refreshment.</span></div>
        </div>
        <aside className="person-pass-qr">
          <a href={QR_TARGET_URL} target="_blank" rel="noreferrer" aria-label={'Open Campus Trust portal for ' + name}>
            <QRCodeSVG value={QR_TARGET_URL} size={100} level="H" includeMargin title={'Campus Trust entry QR for ' + name}/>
          </a>
          <strong>{passId}</strong><span>Scan at entry</span>
        </aside>
      </article>
      <button className="single-pass-download" onClick={() => onDownload(elementId, name)}><Icon name="download" size={16}/> Download {label.toLowerCase()}</button>
    </div>
  )
}

export function ConvocationPassPage({ guests }: ConvocationPassPageProps) {
  const [downloadStatus, setDownloadStatus] = useState<'idle' | 'working' | 'error'>('idle')

  const filenameFor = (personName: string) =>
    personName.replace(/[^a-z0-9]+/gi, '-').toLowerCase() + '-convocation-pass.png'

  const waitForImages = async (element: HTMLElement) => {
    const images = Array.from(element.querySelectorAll('img'))
    await Promise.all(images.map((image) => {
      if (image.complete) return Promise.resolve()
      return new Promise<void>((resolve) => {
        image.addEventListener('load', () => resolve(), { once: true })
        image.addEventListener('error', () => resolve(), { once: true })
      })
    }))
  }

  const renderPass = async (elementId: string) => {
    const passElement = document.getElementById(elementId)
    if (!passElement) throw new Error('Pass element was not found')
    await document.fonts.ready
    await waitForImages(passElement)
    return toPng(passElement, {
      cacheBust: true,
      pixelRatio: 2,
      backgroundColor: '#ffffff',
      skipFonts: true,
    })
  }

  const triggerDownload = (blob: Blob, filename: string) => {
    const objectUrl = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.download = filename
    link.href = objectUrl
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000)
  }

  const downloadPass = async (elementId: string, personName: string) => {
    try {
      setDownloadStatus('working')
      const image = await renderPass(elementId)
      const response = await fetch(image)
      triggerDownload(await response.blob(), filenameFor(personName))
      setDownloadStatus('idle')
    } catch {
      setDownloadStatus('error')
    }
  }

  const downloadAllPasses = async () => {
    try {
      setDownloadStatus('working')
      const archive = new JSZip()
      const people = [{ name: STUDENT.name, elementId: 'convocation-pass-0' }].concat(
        guests.map((guest, index) => ({ name: guest.name, elementId: 'convocation-pass-' + (index + 1) })),
      )
      for (const person of people) {
        const image = await renderPass(person.elementId)
        archive.file(filenameFor(person.name), image.split(',')[1], { base64: true })
      }
      const zipBlob = await archive.generateAsync({ type: 'blob' })
      triggerDownload(zipBlob, 'campus-trust-convocation-passes.zip')
      setDownloadStatus('idle')
    } catch {
      setDownloadStatus('error')
    }
  }

  return (
    <div className="page passes-page prototype-page">
      <div className="prototype-heading">
        <div className="college-title"><div className="college-logo"><Icon name="ticket" size={26}/></div><div><p className="eyebrow">REGISTRATION COMPLETE</p><h1>Convocation Passes</h1><p className="page-subtitle">{guests.length + 1} individual QR pass{guests.length ? 'es' : ''} generated successfully.</p></div></div>
        <div className="step-badge">Step 5 of 5</div>
      </div>
      <div className="five-step-progress"><span className="done"><Icon name="check" size={13}/></span><i className="done"/><span className="done"><Icon name="check" size={13}/></span><i className="done"/><span className="done"><Icon name="check" size={13}/></span><i className="done"/><span className="done"><Icon name="check" size={13}/></span><i className="done"/><span className="active">5</span></div>
      <div className="pass-success"><span><Icon name="check" size={22}/></span><div><strong>Registration and payment confirmed</strong><p>₹{REGISTRATION_AMOUNT} paid successfully. Each attendee has a unique pass with a scannable QR code.</p></div></div>

      <section className="pass-group student-pass-group">
        <div className="pass-group-heading"><div><p className="eyebrow">STUDENT ROW</p><h2>Student Pass</h2></div><span>Primary attendee</span></div>
        <div className="passes-row student-pass-row">
          <PersonPass name={STUDENT.name} label="STUDENT PASS" index={0} onDownload={downloadPass}/>
        </div>
      </section>

      <section className="pass-group guest-pass-group">
        <div className="pass-group-heading"><div><p className="eyebrow">GUEST ROW</p><h2>Guest Passes</h2></div><span>{guests.length} guest{guests.length === 1 ? '' : 's'}</span></div>
        {guests.length ? <div className="passes-row guest-pass-row">
          {guests.map((guest, index) => <PersonPass key={index} name={guest.name} relationship={guest.relationship} label={'GUEST ' + (index + 1)} index={index + 1} onDownload={downloadPass}/>)}
        </div> : <div className="no-guest-passes">No guest passes were requested.</div>}
      </section>

      <div className="pass-download-options">
        <button className="download-pass-button" onClick={downloadAllPasses} disabled={downloadStatus === 'working'}><Icon name="download" size={19}/> {downloadStatus === 'working' ? 'Preparing Download…' : 'Download All Passes'}</button>
        <button className="print-pass-button" onClick={() => window.print()}><Icon name="file" size={18}/> Print / Save as PDF</button>
      </div>
      {downloadStatus === 'error' && <p className="download-error">The download could not be prepared. Please try Print / Save as PDF.</p>}
      <p className="download-hint">Each pass downloads as a high-resolution PNG. Use Print / Save as PDF for a combined document.</p>
    </div>
  )
}
