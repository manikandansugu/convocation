import { Icon } from '../components/ui/Icon'
import { REGISTRATION_ID, STUDENT } from '../config/student'

interface StudentInformationPageProps {
  onContinue: () => void
}

export function StudentInformationPage({ onContinue }: StudentInformationPageProps) {
  return (
    <div className="page prototype-page student-info-page">
      <div className="prototype-heading">
        <div className="college-title">
          <div className="college-logo"><Icon name="user" size={26}/></div>
          <div><p className="eyebrow">CAMPUS TRUST · CONVOCATION 2026</p><h1>Student Information</h1><p className="page-subtitle">Review the prefilled details provided by your college.</p></div>
        </div>
        <div className="step-badge">Step 1 of 5</div>
      </div>
      <div className="five-step-progress" aria-label="Registration progress">
        <span className="active">1</span><i/><span>2</span><i/><span>3</span><i/><span>4</span><i/><span>5</span>
      </div>
      <section className="panel student-information-card">
        <header><div><p className="eyebrow">PREFILLED COLLEGE RECORD</p><h2>Verify your information</h2></div><span className="verified-label"><Icon name="check" size={14}/> College verified</span></header>
        <div className="student-record-banner">
          <div className="large-avatar">AM</div>
          <div><h3>{STUDENT.name}</h3><span>{STUDENT.registerNumber}</span></div>
          <div className="registration-reference"><small>REGISTRATION ID</small><strong>{REGISTRATION_ID}</strong></div>
        </div>
        <div className="student-info-grid">
          <div><span>Department</span><strong>{STUDENT.department}</strong></div>
          <div><span>Degree</span><strong>{STUDENT.degree}</strong></div>
          <div><span>Graduation year</span><strong>{STUDENT.graduationYear}</strong></div>
          <div className="readable-contact"><span><Icon name="mail" size={16}/> Email address</span><strong>{STUDENT.email}</strong><small>Visible for confirmation communication</small></div>
          <div className="readable-contact"><span><Icon name="phone" size={16}/> Mobile number</span><strong>{STUDENT.mobile}</strong><small>Visible for event updates</small></div>
        </div>
        <div className="information-note"><Icon name="check" size={17}/><span>These details are prefilled from the college database. Please contact the administration if any information is incorrect.</span></div>
        <div className="screen-actions"><span/><button className="flow-primary" onClick={onContinue}>Continue to ID verification <Icon name="arrow" size={18}/></button></div>
      </section>
    </div>
  )
}
