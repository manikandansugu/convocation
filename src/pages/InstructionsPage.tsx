import { Icon, type IconName } from '../components/ui/Icon'

interface InstructionsPageProps {
  onStartRegistration: () => void
}

interface InstructionSection {
  title: string
  description: string
  icon: IconName
  items: string[]
}

const INSTRUCTION_SECTIONS: InstructionSection[] = [
  {
    title: 'Before you arrive',
    description: 'Complete these requirements before travelling to the venue.',
    icon: 'check',
    items: [
      'Finish student information, identity verification and payment in this portal.',
      'Download or keep your digital convocation pass ready on your phone.',
      'Carry your original college ID and one valid government-issued photo ID.',
      'Ensure every accompanying guest has an individual guest pass.',
    ],
  },
  {
    title: 'Venue procedure',
    description: 'Follow this sequence on the day of the ceremony.',
    icon: 'location',
    items: [
      'Report at the designated counter between 08:30 AM and 09:15 AM.',
      'Show the QR pass at the entrance for scanning and security verification.',
      'Collect your RFID tag, academic gown, graduation cap and ceremony kit.',
      'Proceed to the allotted block, row and seat shown on your pass.',
    ],
  },
  {
    title: 'Dress code & conduct',
    description: 'Help us maintain the dignity and order of the ceremony.',
    icon: 'cap',
    items: [
      'Wear formal attire suitable for the academic ceremony.',
      'Keep mobile phones on silent mode inside the auditorium.',
      'Remain seated during the procession and follow staff announcements.',
      'Photography is permitted only from the designated areas.',
    ],
  },
]

export function InstructionsPage({ onStartRegistration }: InstructionsPageProps) {
  return (
    <div className="page instructions-page prototype-page">
      <div className="prototype-heading instructions-heading">
        <div className="college-title">
          <div className="college-logo"><Icon name="file" size={27} /></div>
          <div>
            <p className="eyebrow">CONVOCATION 2026</p>
            <h1>Instructions & Guidelines</h1>
            <p className="page-subtitle">Read the essential procedures and important information before completing your registration.</p>
          </div>
        </div>
        <span className="instructions-updated"><Icon name="check" size={15} /> Important information</span>
      </div>

      <section className="instructions-event-banner">
        <div className="instructions-event-lead">
          <span><Icon name="calendar" size={22} /></span>
          <div><small>CEREMONY DATE</small><strong>07 October 2026</strong></div>
        </div>
        <div><small>TIME</small><strong>09:30 AM</strong></div>
        <div><small>VENUE</small><strong>Dr. T. P. Ganesan Auditorium</strong></div>
        <div><small>REPORTING WINDOW</small><strong>08:30 AM – 09:15 AM</strong></div>
      </section>

      <div className="instructions-grid">
        {INSTRUCTION_SECTIONS.map((section, sectionIndex) => (
          <section className="panel instruction-card" key={section.title}>
            <div className="instruction-card-heading">
              <span><Icon name={section.icon} size={21} /></span>
              <div><p>0{sectionIndex + 1}</p><h2>{section.title}</h2></div>
            </div>
            <p className="instruction-card-description">{section.description}</p>
            <ol>
              {section.items.map((item, itemIndex) => (
                <li key={item}><span>{itemIndex + 1}</span><p>{item}</p></li>
              ))}
            </ol>
          </section>
        ))}
      </div>

      <section className="instructions-important">
        <div className="instructions-important-icon"><Icon name="shield" size={23} /></div>
        <div>
          <p className="eyebrow">IMPORTANT INFORMATION</p>
          <h2>Please note before entering the venue</h2>
          <ul>
            <li>Entry is permitted only with a valid QR pass; screenshots that cannot be scanned may be rejected.</li>
            <li>Children and additional guests without registered passes cannot be admitted.</li>
            <li>Return the academic gown at Counter 04 by 04:00 PM and collect the clearance acknowledgement.</li>
          </ul>
        </div>
      </section>

      <div className="instructions-actions">
        <p><Icon name="help" size={17} /> Need assistance? Contact the student administration office before the ceremony date.</p>
        <button type="button" className="flow-primary" onClick={onStartRegistration}>Start registration <Icon name="arrow" size={18} /></button>
      </div>
    </div>
  )
}
