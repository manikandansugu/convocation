import { SeatingLayout, type SeatAllocation } from '../components/seating/SeatingLayout'
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
      <SeatingLayout allocations={STUDENT_ALLOCATION} selectedId="student-current" />
    </div>
  )
}
