import { SeatingLayout, type SeatAllocation } from '../components/seating/SeatingLayout'
import { FACULTY_STAFF_ALLOCATIONS } from '../config/seating'
import { STUDENT } from '../config/student'

const SEATING_ALLOCATIONS: SeatAllocation[] = [{
  id: 'student-current',
  name: STUDENT.name,
  registerNumber: STUDENT.registerNumber,
  block: 'Front',
  row: 'A',
  seat: 6,
  type: 'student',
}, ...FACULTY_STAFF_ALLOCATIONS]

export function SeatingLayoutPage() {
  return (
    <div className="page seating-page prototype-page">
      <SeatingLayout allocations={SEATING_ALLOCATIONS} selectedId="student-current" showRoster />
    </div>
  )
}
