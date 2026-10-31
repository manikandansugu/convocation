import { useState } from 'react'
import { Icon } from '../components/ui/Icon'
import studentPhoto from '../assets/student-verification.png'

interface IdentityVerificationPageProps {
  onBack: () => void
  onContinue: () => void
}

export function IdentityVerificationPage({ onBack, onContinue }: IdentityVerificationPageProps) {
  const [captured, setCaptured] = useState(false)

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
          <div className="camera-status"><span className={captured ? 'success' : ''}/>{captured ? 'Photo captured successfully' : 'Position your face inside the guide'}</div>
        </div>
        <div className="capture-instructions">
          <p className="eyebrow">CAPTURE GUIDELINES</p><h2>Take a clear front-facing photo</h2>
          <ul><li><Icon name="check" size={15}/> Make sure your face is clearly visible</li><li><Icon name="check" size={15}/> Use a well-lit area with a plain background</li><li><Icon name="check" size={15}/> Remove sunglasses, masks, or head coverings</li><li><Icon name="check" size={15}/> Only one person should appear in the frame</li></ul>
          <button className="capture-button" onClick={() => setCaptured(true)}><Icon name="camera" size={18}/>{captured ? 'Retake photo' : 'Capture photo'}</button>
          <div className="privacy-note">Your photo is used only for convocation entry identity verification.</div>
        </div>
      </section>
      <div className="standalone-actions"><button className="secondary-button" onClick={onBack}>Back</button><button className="flow-primary" onClick={onContinue} disabled={!captured}>Continue to payment <Icon name="arrow" size={18}/></button></div>
    </div>
  )
}
