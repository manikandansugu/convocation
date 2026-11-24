import { SeatingLayout, type SeatAllocation } from '../components/seating/SeatingLayout'
import { FACULTY_STAFF_ALLOCATIONS } from '../config/seating'
import { STUDENT } from '../config/student'

export function SeatingLayoutPage() {
  const [studentRow = 'A', studentSeat = '1'] = (STUDENT.seatNumber || 'A-1').split('-')
  const seatingAllocations: SeatAllocation[] = [
    {
      id: 'student-current',
      name: STUDENT.name,
      registerNumber: STUDENT.registerNumber,
      block: 'Front',
      row: studentRow,
      seat: Number(studentSeat),
      type: 'student',
      department: STUDENT.department,
      role: `${STUDENT.degree} Graduate`,
      email: STUDENT.email,
      photoIndex: 0,
    },
    ...FACULTY_STAFF_ALLOCATIONS,
  ]

  return (
    <div className="page seating-page">
      <SeatingLayout allocations={seatingAllocations} selectedId="student-current" showRoster />
    </div>
  )
}
