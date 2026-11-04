import { useState } from 'react'
import { toPng } from 'html-to-image'
import JSZip from 'jszip'
import { QRCodeSVG } from 'qrcode.react'
import { Icon } from '../components/ui/Icon'
import { REGISTRATION_ID, STUDENT } from '../config/student'
import type { Guest, Student } from '../types/registration'
import studentPhoto from '../assets/student-verification.png'

const QR_TARGET_URL = 'https://neccampus.srmtech.com/'

interface ConvocationPassPageProps {
  guests: Guest[]
  photoUrl?: string
  student?: Student
  onNavigateToSeating?: () => void
}

interface PersonPassProps {
  name: string
  label: string
  relationship?: string
  index: number
  photoUrl?: string
  student: Student
  guests: Guest[]
  onDownload: (elementId: string, personName: string) => Promise<void>
}

function PersonPass({ name, label, relationship, index, photoUrl, student, guests, onDownload }: PersonPassProps) {
  const passId = index === 0 ? REGISTRATION_ID : REGISTRATION_ID + '-G' + index
  const elementId = 'convocation-pass-' + index
  const isPrimaryStudent = index === 0

  const activePhoto = photoUrl || studentPhoto
  const seatId = isPrimaryStudent ? (student.seatNumber || 'A-25') : `R-${25 + index}`
  const attendeeRegistration = isPrimaryStudent ? student.registerNumber : passId
  const attendeeProgram = isPrimaryStudent
    ? `${student.degree} — ${student.program || 'Computer Science and Engineering'}`
    : `${relationship || 'Guest'} of ${student.name}`

  return (
    <div className="pass-card-wrapper">
      <article className="person-pass ceremonial-pass" id={elementId}>
        <div className="ceremonial-pass-inner">
          <header className="ceremonial-pass-heading">
            <div className="ceremonial-emblem" aria-label="CampusTrust Convocation 2026">
              <span><img src={import.meta.env.BASE_URL + 'campus-trust-logo.png'} alt="CampusTrust" /></span>
              <small>CONVOCATION 2026</small>
            </div>
            <h2>Graduation Day Pass</h2>
            <div className="entry-pass-title"><i /><strong>ENTRY PASS</strong><i /></div>
          </header>

          <div className="ceremonial-pass-content">
            <div className="ceremonial-photo-frame">
              {isPrimaryStudent ? (
                <img src={activePhoto} alt={name} />
              ) : (
                <div className="ceremonial-guest-avatar">
                  {name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()}
                </div>
              )}
            </div>

            <div className="ceremonial-pass-details">
              <div className="ceremonial-detail ceremonial-detail-wide">
                <span>FULL NAME</span>
                <strong>{name}</strong>
              </div>
              <div className="ceremonial-detail">
                <span>REGISTRATION ID</span>
                <strong>{attendeeRegistration}</strong>
              </div>
              <div className="ceremonial-detail">
                <span>PROGRAM</span>
                <strong>{attendeeProgram}</strong>
              </div>
              <div className="ceremonial-detail">
                <span>ACCOMPANYING GUEST(S)</span>
                <strong>{isPrimaryStudent ? guests.length : '—'}</strong>
              </div>
              <div className="ceremonial-detail">
                <span>DATE</span>
                <strong>{student.graduationDate || '07 October 2026'}</strong>
              </div>
              <div className="ceremonial-detail ceremonial-detail-wide">
                <span>VENUE</span>
                <strong>{student.venue || 'Dr. T. P. Ganesan Auditorium'}</strong>
              </div>
            </div>

            <aside className="ceremonial-pass-qr person-pass-qr">
              <a href={QR_TARGET_URL} target="_blank" rel="noreferrer" aria-label={'Open entry QR for ' + name}>
                <QRCodeSVG value={`${QR_TARGET_URL}?pass=${encodeURIComponent(passId)}`} size={150} level="H" includeMargin title={'Entry QR for ' + name}/>
              </a>
              <span>SCAN AT ENTRY</span>
            </aside>
          </div>

          <footer className="ceremonial-pass-footer">
            <div>
              <span>SEAT NUMBER</span>
              <strong>{seatId}</strong>
            </div>
            <div>
              <span>KIT COUNTER</span>
              <strong>{student.kitCounter || 'Counter 04 (Ground Floor)'}</strong>
            </div>
          </footer>
        </div>
      </article>

      <button className="single-pass-download" onClick={() => onDownload(elementId, name)}>
        <Icon name="download" size={16}/> Download {label.toLowerCase()}
      </button>
    </div>
  )
}

interface KitItemConfig {
  id: string
  title: string
  subtitle: string
  stepNumber: string
}

const GRADUATION_KIT_ITEMS: KitItemConfig[] = [
  {
    id: 'gown',
    title: 'Academic Gown',
    subtitle: 'Ceremonial convocation gown (Size 40 / L) · Counter 04',
    stepNumber: 'Kit Item 1',
  },
  {
    id: 'robe',
    title: 'Ceremony Robe & Stole',
    subtitle: 'Computing Technologies academic stole & ceremonial hood',
    stepNumber: 'Kit Item 2',
  },
  {
    id: 'breakfast_token',
    title: 'Breakfast Token',
    subtitle: 'Token #BF-10245 · Valid for student & registered guests at Food Court 02',
    stepNumber: 'Token 1',
  },
  {
    id: 'lunch_token',
    title: 'Lunch Token',
    subtitle: 'Token #LN-10245 · Valid post ceremony & photo session at Food Court 02',
    stepNumber: 'Token 2',
  },
]

interface GraduationDayFlowProps {
  onNavigateToSeating?: () => void
}

function GraduationDayLifecyclePanel({ onNavigateToSeating }: GraduationDayFlowProps) {
  // Graduation Day lifecycle stages state
  const [faceCheckinDone] = useState(true)
  const [kitReceived] = useState(true)
  const [breakfastRedeemed, setBreakfastRedeemed] = useState(false)
  const [auditoriumGateAdmitted] = useState(true)
  const [degreeDistributed, setDegreeDistributed] = useState(false)
  const [photoSessionDone, setPhotoSessionDone] = useState(false)
  const [lunchRedeemed, setLunchRedeemed] = useState(false)

  return (
    <div className="graduation-lifecycle-wrapper">
      <aside className="panel graduation-lifecycle-card">
        <header className="kit-card-header">
          <div className="kit-header-info">
            <span className="eyebrow">GRADUATION DAY PROCESS FLOW</span>
            <h3>Event Day Milestones & Clearance</h3>
          </div>
          <div className="kit-header-badges">
            <span className="kit-verified-badge success">
              <Icon name="check" size={13} />
              Registration Completed Online
            </span>
          </div>
        </header>

        <p className="lifecycle-lead-note">
          No separate registration is needed on campus. Present your pass for face recognition attendance, kit collection, and token redemption.
        </p>

        <div className="lifecycle-timeline">
          {/* 3. In-Person Check & Kit Distribution */}
          <div className={`lifecycle-milestone ${faceCheckinDone ? 'completed' : 'pending'}`}>
            <div className="milestone-indicator">
              <Icon name={faceCheckinDone ? 'check' : 'clock'} size={14} />
            </div>
            <div className="milestone-content">
              <div className="milestone-title-row">
                <strong>Step 3: Campus Arrival & In-Person Face Check</strong>
                <span className={`status-pill ${faceCheckinDone ? 'success' : 'pending'}`}>
                  {faceCheckinDone ? 'Face Verified & Attendance Recorded' : 'Pending Campus Arrival'}
                </span>
              </div>
              <p>Face recognition performed at campus entrance. No manual desk registration required.</p>
            </div>
          </div>

          {/* Kit Distribution items */}
          <div className={`lifecycle-milestone ${kitReceived ? 'completed' : 'pending'}`}>
            <div className="milestone-indicator">
              <Icon name={kitReceived ? 'check' : 'tag'} size={14} />
            </div>
            <div className="milestone-content">
              <div className="milestone-title-row">
                <strong>Graduation Kit Distribution</strong>
                <span className={`status-pill ${kitReceived ? 'success' : 'pending'}`}>
                  {kitReceived ? 'Kit Issued (Counter 04)' : 'Pending Collection'}
                </span>
              </div>
              <div className="kit-items-subgrid">
                {GRADUATION_KIT_ITEMS.map((item) => (
                  <div key={item.id} className="kit-subitem">
                    <Icon name="check" size={12} />
                    <div>
                      <strong>{item.title}</strong>
                      <small>{item.subtitle}</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 4. Breakfast */}
          <div className={`lifecycle-milestone ${breakfastRedeemed ? 'completed' : 'active'}`}>
            <div className="milestone-indicator">
              <Icon name={breakfastRedeemed ? 'check' : 'clock'} size={14} />
            </div>
            <div className="milestone-content">
              <div className="milestone-title-row">
                <strong>Step 4: Breakfast (Token Validation)</strong>
                <span className={`status-pill ${breakfastRedeemed ? 'success' : 'info'}`}>
                  {breakfastRedeemed ? 'Breakfast Token Validated · Food Court 02' : 'Token Ready to Redeem'}
                </span>
              </div>
              <p>Present breakfast token from Graduation Kit at Food Court 02 counter between 08:15 AM and 09:15 AM.</p>
              {!breakfastRedeemed && (
                <button
                  type="button"
                  className="token-validate-btn"
                  onClick={() => setBreakfastRedeemed(true)}
                >
                  <Icon name="check" size={14} /> Validate Breakfast Token (Demonstration)
                </button>
              )}
            </div>
          </div>

          {/* 5. Auditorium Entry */}
          <div className={`lifecycle-milestone ${auditoriumGateAdmitted ? 'completed' : 'pending'}`}>
            <div className="milestone-indicator">
              <Icon name={auditoriumGateAdmitted ? 'check' : 'shield'} size={14} />
            </div>
            <div className="milestone-content">
              <div className="milestone-title-row">
                <strong>Step 5: Auditorium Entry Face Recognition</strong>
                <span className={`status-pill ${auditoriumGateAdmitted ? 'success' : 'pending'}`}>
                  {auditoriumGateAdmitted ? 'Gate 02 Face ID Verified · Entry Allowed' : 'Pending Gate Scan'}
                </span>
              </div>
              <p>Scanned and verified via facial recognition at Gate 02. Admitted to Dr. T. P. Ganesan Auditorium.</p>
            </div>
          </div>

          {/* 6. Seat Identification */}
          <div className="lifecycle-milestone completed">
            <div className="milestone-indicator">
              <Icon name="grid" size={14} />
            </div>
            <div className="milestone-content">
              <div className="milestone-title-row">
                <strong>Step 6: Seat Identification</strong>
                <span className="status-pill success">Allotted Seat: A-25</span>
              </div>
              <p>Front Block, Row A, Seat 25. Clearly displayed with aisle navigation.</p>
              {onNavigateToSeating && (
                <button
                  type="button"
                  className="seat-lookup-btn"
                  onClick={onNavigateToSeating}
                >
                  <Icon name="grid" size={14} /> View Auditorium Seating Map
                </button>
              )}
            </div>
          </div>

          {/* 7 & 8. Degree Certificate Distribution by Registered Faculty */}
          <div className={`lifecycle-milestone ${degreeDistributed ? 'completed' : 'active'}`}>
            <div className="milestone-indicator">
              <Icon name={degreeDistributed ? 'check' : 'award'} size={14} />
            </div>
            <div className="milestone-content">
              <div className="milestone-title-row">
                <strong>Steps 7 & 8: Degree Certificate Distribution</strong>
                <span className={`status-pill ${degreeDistributed ? 'success' : 'info'}`}>
                  {degreeDistributed ? 'Certificate Distributed by Faculty' : 'Faculty Distribution in Progress'}
                </span>
              </div>
              <p>
                Supporting Faculty: <strong>Dr. Meena Krishnan</strong> (Computing Technologies · Assigned to Row A).
                Faculty verifies graduate seat A-25 and distributes certificate inside auditorium.
              </p>
              {!degreeDistributed && (
                <button
                  type="button"
                  className="token-validate-btn"
                  onClick={() => {
                    setDegreeDistributed(true)
                  }}
                >
                  <Icon name="award" size={14} /> Acknowledge Degree Certificate Received
                </button>
              )}
            </div>
          </div>

          {/* 9. Photo Session */}
          <div className={`lifecycle-milestone ${photoSessionDone ? 'completed' : degreeDistributed ? 'active' : 'pending'}`}>
            <div className="milestone-indicator">
              <Icon name={photoSessionDone ? 'check' : 'camera'} size={14} />
            </div>
            <div className="milestone-content">
              <div className="milestone-title-row">
                <strong>Step 9: Official Photo Session</strong>
                <span className={`status-pill ${photoSessionDone ? 'success' : degreeDistributed ? 'info' : 'pending'}`}>
                  {photoSessionDone ? 'Photo Session Completed' : degreeDistributed ? 'Proceed to Photo Studio' : 'Awaiting Certificate Handover'}
                </span>
              </div>
              <p>Graduates proceed to the stage right studio for the official degree portrait session.</p>
              {degreeDistributed && !photoSessionDone && (
                <button
                  type="button"
                  className="token-validate-btn"
                  onClick={() => setPhotoSessionDone(true)}
                >
                  <Icon name="camera" size={14} /> Complete Photo Session
                </button>
              )}
            </div>
          </div>

          {/* 10. Lunch */}
          <div className={`lifecycle-milestone ${lunchRedeemed ? 'completed' : photoSessionDone ? 'active' : 'pending'}`}>
            <div className="milestone-indicator">
              <Icon name={lunchRedeemed ? 'check' : 'clock'} size={14} />
            </div>
            <div className="milestone-content">
              <div className="milestone-title-row">
                <strong>Step 10: Lunch (Token Validation)</strong>
                <span className={`status-pill ${lunchRedeemed ? 'success' : photoSessionDone ? 'info' : 'pending'}`}>
                  {lunchRedeemed ? 'Lunch Token Validated · Food Court 02' : 'Present Lunch Token Post-Ceremony'}
                </span>
              </div>
              <p>After photo session, present the lunch token from your Graduation Kit at Food Court 02.</p>
              {photoSessionDone && !lunchRedeemed && (
                <button
                  type="button"
                  className="token-validate-btn"
                  onClick={() => setLunchRedeemed(true)}
                >
                  <Icon name="check" size={14} /> Validate Lunch Token (Demonstration)
                </button>
              )}
            </div>
          </div>
        </div>
      </aside>
    </div>
  )
}

export function ConvocationPassPage({ guests, photoUrl, student = STUDENT, onNavigateToSeating }: ConvocationPassPageProps) {
  const [downloadStatus, setDownloadStatus] = useState<'idle' | 'working' | 'error'>('idle')

  const filenameFor = (personName: string) =>
    personName.replace(/[^a-z0-9]+/gi, '-').toLowerCase() + '-graduation-pass.png'

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
      const people = [{ name: student.name, elementId: 'convocation-pass-0' }].concat(
        guests.map((guest, index) => ({ name: guest.name, elementId: 'convocation-pass-' + (index + 1) })),
      )
      for (const person of people) {
        const image = await renderPass(person.elementId)
        archive.file(filenameFor(person.name), image.split(',')[1], { base64: true })
      }
      const zipBlob = await archive.generateAsync({ type: 'blob' })
      triggerDownload(zipBlob, 'campus-trust-graduation-passes.zip')
      setDownloadStatus('idle')
    } catch {
      setDownloadStatus('error')
    }
  }

  return (
    <div className="page passes-page prototype-page">
      <div className="prototype-heading">
        <div className="college-title">
          <div className="college-logo"><Icon name="ticket" size={26}/></div>
          <div>
            <p className="eyebrow">ONLINE REGISTRATION COMPLETE</p>
            <h1>Graduation Day Passes</h1>
            <p className="page-subtitle">
              Generated for COE-approved in-person attendee {student.name} and {guests.length} guest{guests.length === 1 ? '' : 's'}.
            </p>
          </div>
        </div>
        <div className="step-badge">Step 5 of 5</div>
      </div>

      <div className="five-step-progress">
        <span className="done"><Icon name="check" size={13}/></span><i className="done"/>
        <span className="done"><Icon name="check" size={13}/></span><i className="done"/>
        <span className="done"><Icon name="check" size={13}/></span><i className="done"/>
        <span className="done"><Icon name="check" size={13}/></span><i className="done"/>
        <span className="active">5</span>
      </div>

      <div className="pass-success">
        <span><Icon name="check" size={22}/></span>
        <div>
          <strong>Online Registration & Pass Generation Complete</strong>
          <p>
            Attendance confirmed, live photo registered, and regalia fee paid.
            Present this pass on Graduation Day for face recognition check-in, Graduation Kit collection (Gown, Robe, Breakfast and Lunch tokens), and auditorium entry.
          </p>
        </div>
      </div>

      <section className="pass-group student-pass-group">
        <div className="pass-group-heading">
          <div><h2>Official Graduation Day Pass</h2></div>
          <span>Primary Attendee</span>
        </div>
        <div className="passes-row student-pass-row">
          <PersonPass
            name={student.name}
            label="GRADUATE PASS"
            index={0}
            photoUrl={photoUrl}
            student={student}
            guests={guests}
            onDownload={downloadPass}
          />
        </div>
      </section>

      {/* Graduation Day Lifecycle & Clearance Panel */}
      <section className="pass-group event-day-flow-group">
        <div className="pass-group-heading">
          <div><h2>Event Day Process Flow & Token Clearance</h2></div>
          <span>Campus Check-in to Lunch</span>
        </div>
        <GraduationDayLifecyclePanel onNavigateToSeating={onNavigateToSeating} />
      </section>

      <section className="pass-group guest-pass-group">
        <div className="pass-group-heading">
          <div><h2>Accompanying Guest Passes</h2></div>
          <span>{guests.length} guest{guests.length === 1 ? '' : 's'}</span>
        </div>
        {guests.length ? (
          <div className="passes-row guest-pass-row">
            {guests.map((guest, index) => (
              <PersonPass
                key={index}
                name={guest.name}
                relationship={guest.relationship}
                label={'GUEST ' + (index + 1)}
                index={index + 1}
                student={student}
                guests={guests}
                onDownload={downloadPass}
              />
            ))}
          </div>
        ) : (
          <div className="no-guest-passes">No accompanying guest passes were requested.</div>
        )}
      </section>

      <div className="pass-download-options">
        <button className="download-pass-button" onClick={downloadAllPasses} disabled={downloadStatus === 'working'}>
          <Icon name="download" size={19}/> {downloadStatus === 'working' ? 'Preparing Download…' : 'Download All Passes'}
        </button>
        <button className="print-pass-button" onClick={() => window.print()}>
          <Icon name="file" size={18}/> Print / Save as PDF
        </button>
      </div>

      {downloadStatus === 'error' && (
        <p className="download-error">The download could not be prepared. Please try Print / Save as PDF.</p>
      )}
      <p className="download-hint">
        Each pass contains all 10 verified fields: Photo, Name, Register Number, Program, Accompanying Guest details, Graduation Date, Venue, Seat Number, Kit Counter, and QR code.
      </p>
    </div>
  )
}
