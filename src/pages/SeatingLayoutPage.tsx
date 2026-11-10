import { SeatingLayout, type SeatAllocation } from '../components/seating/SeatingLayout'
import { FACULTY_STAFF_ALLOCATIONS } from '../config/seating'
import { STUDENT } from '../config/student'
import type { Guest } from '../types/registration'

interface SeatingLayoutPageProps {
  guests?: Guest[]
}

export function SeatingLayoutPage({ guests = [] }: SeatingLayoutPageProps) {
  const guestAllocations: SeatAllocation[] = guests.map((guest, index) => ({
    id: `guest-${index + 1}`,
    name: guest.name.trim() || `Guest ${index + 1}`,
    registerNumber: `CONV-2026-10245-G${index + 1}`,
    block: 'Guest Gallery',
    row: 'K',
    seat: index + 1,
    type: 'guest',
    role: guest.relationship || 'Registered Guest',
    department: STUDENT.name,
  }))
  const seatingAllocations: SeatAllocation[] = [{
    id: 'student-current',
    name: STUDENT.name,
    registerNumber: STUDENT.registerNumber,
    block: 'Front',
    row: 'A',
    seat: 6,
    type: 'student',
  }, ...guestAllocations, ...FACULTY_STAFF_ALLOCATIONS]

  return (
    <div className="page seating-page prototype-page">
      <SeatingLayout allocations={seatingAllocations} selectedId="student-current" showRoster />
    </div>
  )
}
