import { Icon, type IconName } from '../components/ui/Icon'
import { REGISTRATION_ID, STUDENT } from '../config/student'
import studentPhoto from '../assets/aadhithya-raj.jpg'
import type { Student } from '../types/registration'

interface KitDetailsPageProps {
  student?: Student
  photoUrl?: string
  guestEnabled?: boolean
}

interface IssuedKitItem {
  title: string
  status: string
  description: string
  icon: IconName
}

const ISSUED_KIT_ITEMS: IssuedKitItem[] = [
  {
    title: 'In-Person Face ID & Attendance',
    status: 'Recorded 08:15 AM',
    description: 'Campus entrance facial recognition check · No paper registration needed',
    icon: 'shield',
  },
  {
    title: 'Academic Gown',
    status: 'Gown Issued',
    description: 'Academic regalia gown (Size 40 / L) for ceremony procession',
    icon: 'cap',
  },
  {
    title: 'Breakfast Token',
    status: 'Token Issued',
    description: 'Token #BF-12001 · Valid for student and registered guest at Food Court 02',
    icon: 'ticket',
  },
  {
    title: 'Lunch Token',
    status: 'Token Issued',
    description: 'Token #LN-12001 · Valid after the ceremony and photo session at Food Court 02',
    icon: 'ticket',
  },
]

export function KitDetailsPage({ student = STUDENT, photoUrl, guestEnabled = true }: KitDetailsPageProps) {
  const [row = 'A', seat = '1'] = (student.seatNumber || 'A-1').split('-')

  return (
    <div className="page prototype-page kit-details-page">
      <section className="panel student-kit-panel">
        <div className="student-kit-profile">
          <div className="student-kit-photo">
            <img src={photoUrl || student.photoUrl || studentPhoto} alt={student.name} />
            <span><Icon name="check" size={13} /> Verified</span>
          </div>

          <div className="student-kit-identity">
            <div className="student-kit-title-row">
              <h2>{student.name}</h2>
              <span>{REGISTRATION_ID}</span>
            </div>
            <p>{student.degree} · {student.program || student.department}</p>
            <div className="student-kit-seat-details">
              <span><strong>BLOCK</strong> Front</span>
              <span><strong>ROW</strong> {row}</span>
              <span><strong>SEAT</strong> {seat}</span>
              <span><strong>GATE</strong> Gate 01</span>
            </div>
          </div>
        </div>

        <div className="student-kit-status-heading">
          <h3>Attendance & Graduation Kit Status (4/4 Completed)</h3>
          <span><Icon name="check" size={14} /> Clearance Complete</span>
        </div>

        <div className="student-kit-items">
          {ISSUED_KIT_ITEMS.map((item) => (
            <article className="student-kit-item" key={item.title}>
              <span className="student-kit-item-icon"><Icon name="check" size={18} /></span>
              <div>
                <div className="student-kit-item-title">
                  <h4>{item.title}</h4>
                  <span><Icon name={item.icon} size={13} /> {item.status}</span>
                </div>
                <p>{!guestEnabled && item.title === 'Breakfast Token' ? 'Token #BF-12001 · Valid for student at Food Court 02' : item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
