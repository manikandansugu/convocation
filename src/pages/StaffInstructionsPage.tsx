import { Icon } from '../components/ui/Icon'

const STAFF_STEPS = [
  {
    time: '08:00 AM',
    title: 'In-person check and graduation kit',
    owner: 'Graduation Kit Distribution Committee',
    detail: 'Scan the graduate’s face, record attendance, and issue the gown, robe, breakfast token and lunch token.',
    icon: 'tag' as const,
  },
  {
    time: '09:00 AM',
    title: 'Breakfast token validation',
    owner: 'Breakfast Counter',
    detail: 'Validate and redeem the breakfast token before serving the graduate.',
    icon: 'ticket' as const,
  },
  {
    time: '10:00 AM',
    title: 'Auditorium entry',
    owner: 'Auditorium Entrance Team',
    detail: 'Run the second face-recognition check and admit the graduate only after successful recognition.',
    icon: 'shield' as const,
  },
  {
    time: '11:00 AM',
    title: 'Seat identification',
    owner: 'Seating Support Team',
    detail: 'Use the application to direct graduates and registered faculty to their allotted rows and seats.',
    icon: 'grid' as const,
  },
  {
    time: '12:00 PM',
    title: 'Degree certificate distribution',
    owner: 'Registered Faculty',
    detail: 'Identify assigned graduates by seat and record each degree certificate handover.',
    icon: 'award' as const,
  },
  {
    time: '02:00 PM',
    title: 'Lunch token validation',
    owner: 'Lunch Counter',
    detail: 'After the photo session, validate and redeem the lunch token before serving the graduate.',
    icon: 'ticket' as const,
  },
]

export function StaffInstructionsPage() {
  return (
    <div className="staff-process-page">
      <section className="staff-process-summary panel">
        <div>
          <p className="eyebrow">GRADUATION DAY OPERATIONS</p>
          <h2>Staff process and counter responsibilities</h2>
          <p>No Registration Committee is required on the event day because student registration is completed online.</p>
        </div>
        <div className="staff-shift-note">
          <Icon name="clock" size={20} />
          <div><strong>09:00 AM staff movement</strong><span>All members remain at kit counters until 9:00 AM; afterwards, 80% move to the auditorium for seating support.</span></div>
        </div>
      </section>

      <div className="staff-process-grid">
        {STAFF_STEPS.map((step) => (
          <article className="panel staff-process-step" key={step.time}>
            <span className="staff-process-number">{step.time}</span>
            <span className="staff-process-icon"><Icon name={step.icon} size={20} /></span>
            <div>
              <h3>{step.title}</h3>
              <strong>{step.owner}</strong>
              <p>{step.detail}</p>
            </div>
          </article>
        ))}
      </div>

      <section className="panel staff-process-rules">
        <h3><Icon name="check" size={17} /> Operating rules</h3>
        <ul>
          <li>Only graduates on the COE-approved presentee list may be processed.</li>
          <li>Face recognition is mandatory at attendance and kit collection, and again at auditorium entry.</li>
          <li>Faculty distributing degree certificates must be registered in the application.</li>
          <li>Use the allotted row and seat to identify each graduate before certificate handover.</li>
        </ul>
      </section>
    </div>
  )
}
