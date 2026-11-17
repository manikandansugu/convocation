import { SeatingLayout, type SeatAllocation } from '../components/seating/SeatingLayout'
import { FACULTY_STAFF_ALLOCATIONS } from '../config/seating'
import { STUDENT } from '../config/student'

export function SeatingLayoutPage() {
  const seatingAllocations: SeatAllocation[] = [
    {
      id: 'student-current',
      name: STUDENT.name,
      registerNumber: STUDENT.registerNumber,
      block: 'Left Block',
      row: 'A',
      seat: 6,
      type: 'student',
    },
    ...FACULTY_STAFF_ALLOCATIONS,
  ]

  return (
    <div className="page seating-page prototype-page">
      <SeatingLayout allocations={seatingAllocations} selectedId="student-current" showRoster />
    </div>
  )
}
