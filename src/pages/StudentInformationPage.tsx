import { useState } from 'react'
import { Icon } from '../components/ui/Icon'
import { REGISTRATION_ID, STUDENT } from '../config/student'
import type { Student } from '../types/registration'

interface StudentInformationPageProps {
  student?: Student
  onContinue: () => void
  onUpdateMobile?: (mobile: string) => void
}

export function StudentInformationPage({ student = STUDENT, onContinue, onUpdateMobile }: StudentInformationPageProps) {
  const [mobile, setMobile] = useState(student.mobile)
  const [isEditingMobile, setIsEditingMobile] = useState(false)
  const [mobileSaved, setMobileSaved] = useState(true)

  const handleSaveMobile = () => {
    setIsEditingMobile(false)
    setMobileSaved(true)
    onUpdateMobile?.(mobile)
  }

  return (
    <div className="page prototype-page student-info-page">
      <div className="five-step-progress" aria-label="Registration progress">
        <span className="active">1</span><i/><span>2</span><i/><span>3</span><i/><span>4</span><i/><span>5</span>
      </div>
      <section className="panel student-information-card">
        <header>
          <div>
            <p className="eyebrow">COE APPROVED GRADUATE RECORD</p>
            <h2>Review & Confirm Student Details</h2>
          </div>
          <div className="header-status-group">
            <span className="verified-label"><Icon name="check" size={14}/> COE Approved</span>
            <span className="verified-label in-person-badge"><Icon name="check" size={14}/> In-Person Attendee</span>
          </div>
        </header>

        <div className="student-record-banner">
          <div className="large-avatar">{student.name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase()}</div>
          <div>
            <h3>{student.name}</h3>
            <span>{student.registerNumber} · NetID: {student.netId || 'C10001'}</span>
          </div>
          <div className="registration-reference">
            <small>REGISTRATION ID</small>
            <strong>{REGISTRATION_ID}</strong>
          </div>
        </div>

        <div className="student-info-grid">
          <div><span>Department</span><strong>{student.department}</strong></div>
          <div><span>Degree</span><strong>{student.degree}</strong></div>
          <div><span>Program</span><strong>{student.program || 'Business Administration'}</strong></div>
          <div><span>Graduation year</span><strong>{student.graduationYear}</strong></div>

          <div className="readable-contact">
            <span><Icon name="mail" size={16}/> Email address</span>
            <strong>{student.email}</strong>
            <small>DODE registration confirmation sent here</small>
          </div>

          <div className="readable-contact mobile-confirm-box">
            <div className="mobile-header-row">
              <span><Icon name="phone" size={16}/> Mobile number (Confirm / Update)</span>
              {!isEditingMobile && (
                <button
                  type="button"
                  className="inline-edit-btn"
                  onClick={() => setIsEditingMobile(true)}
                >
                  Update
                </button>
              )}
            </div>
            {isEditingMobile ? (
              <div className="mobile-edit-input-group">
                <input
                  type="tel"
                  value={mobile}
                  onChange={(e) => { setMobile(e.target.value); setMobileSaved(false) }}
                  placeholder="+91 98765 43210"
                  aria-label="Update mobile number"
                />
                <button type="button" className="inline-save-btn" onClick={handleSaveMobile}>
                  Save & Confirm
                </button>
              </div>
            ) : (
              <div className="mobile-confirmed-row">
                <strong>{mobile}</strong>
                {mobileSaved && <span className="confirmed-pill"><Icon name="check" size={12}/> Confirmed for Event Day SMS</span>}
              </div>
            )}
            <small>Event day notifications, seat reminder, and token alert updates will be sent to this number.</small>
          </div>
        </div>

        <div className="student-address-grid">
          <div><span><Icon name="location" size={16}/> Postal address</span><strong>{student.postalAddress}</strong></div>
          <div><span><Icon name="location" size={16}/> Communication address</span><strong>{student.communicationAddress}</strong></div>
        </div>

        <div className="information-note">
          <Icon name="check" size={17}/>
          <span>Eligibility verified from Controller of Examinations (COE) Office. Attendance confirmed as In-Person Graduate on the DODE Presentee Roster.</span>
        </div>

        <div className="screen-actions">
          <span/>
          <button className="flow-primary" onClick={onContinue}>
            Continue to Live Photo Capture <Icon name="arrow" size={18}/>
          </button>
        </div>
      </section>
    </div>
  )
}
