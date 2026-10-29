import { SeatingLayout, type SeatAllocation } from '../components/seating/SeatingLayout'
import { Icon } from '../components/ui/Icon'
import { STUDENT } from '../config/student'

const STUDENT_ALLOCATION: SeatAllocation[] = [{
  id: 'student-current',
  name: STUDENT.name,
  registerNumber: STUDENT.registerNumber,
  block: 'Front',
  row: 'A',
  seat: 25,
  type: 'student',
}]

export function SeatingLayoutPage() {
  return (
    <div className="page seating-page prototype-page">
      <div className="prototype-heading seating-page-heading">
        <div className="college-title">
          <div className="college-logo"><Icon name="grid" size={27} /></div>
          <div><p className="eyebrow">CONVOCATION 2026</p><h1>Seating Layout</h1><p className="page-subtitle">View your allocated auditorium block, row and seat before arriving at the venue.</p></div>
        </div>
        <span className="seating-confirmed"><Icon name="check" size={15} /> Seat allocated</span>
      </div>
      <SeatingLayout allocations={STUDENT_ALLOCATION} selectedId="student-current" />
    </div>
  )
}
