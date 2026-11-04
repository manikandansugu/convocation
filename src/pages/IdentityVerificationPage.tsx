import { useState } from 'react'
import { Icon } from '../components/ui/Icon'
import studentPhoto from '../assets/student-verification.png'

interface IdentityVerificationPageProps {
  onBack: () => void
  onContinue: () => void
  onPhotoCaptured?: (photoUrl: string) => void
}

export function IdentityVerificationPage({ onBack, onContinue, onPhotoCaptured }: IdentityVerificationPageProps) {
  const [captured, setCaptured] = useState(false)

  const handleCapture = () => {
    const nextState = !captured
    setCaptured(nextState)
    if (nextState) {
      onPhotoCaptured?.(studentPhoto)
    }
  }

  return (
    <div className="page prototype-page identity-page">
      <div className="five-step-progress"><span className="done"><Icon name="check" size={13}/></span><i className="done"/><span className="active">2</span><i/><span>3</span><i/><span>4</span><i/><span>5</span></div>
      <section className="panel identity-card">
        <div className={'camera-preview ' + (captured ? 'captured' : '')}>
          <div className="face-guide-wrap">
            <div className="face-guide">
              <img src={studentPhoto} alt="Student face captured for identity verification" />
            </div>
            {captured && <span className="capture-success-mark"><Icon name="check" size={24}/></span>}
          </div>
          <div className="camera-status"><span className={captured ? 'success' : ''}/>{captured ? 'Live photo captured & registered for Face Recognition' : 'Position your face inside the guide'}</div>
        </div>
        <div className="capture-instructions">
          <p className="eyebrow">CAPTURE GUIDELINES</p><h2>Capture your live photo</h2>
          <ul>
            <li><Icon name="check" size={15}/> This photo is required for event day campus check-in face recognition.</li>
            <li><Icon name="check" size={15}/> Also used for auditorium entrance gate verification.</li>
            <li><Icon name="check" size={15}/> Will be embossed directly on your official Graduation Day Pass.</li>
            <li><Icon name="check" size={15}/> Ensure a well-lit area with a plain background.</li>
          </ul>
          <button className="capture-button" onClick={handleCapture}>
            <Icon name="camera" size={18}/>{captured ? 'Retake live photo' : 'Capture live photo'}
          </button>
          <div className="privacy-note">Secure facial recognition data is retained only for Graduation Day verification access.</div>
        </div>
      </section>
      <div className="standalone-actions">
        <button className="secondary-button" onClick={onBack}>Back</button>
        <button className="flow-primary" onClick={onContinue} disabled={!captured}>
          Continue to payment <Icon name="arrow" size={18}/>
        </button>
      </div>
    </div>
  )
}
