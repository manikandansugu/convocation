import type { SeatAllocation } from '../components/seating/SeatingLayout'

export const FACULTY_STAFF_ALLOCATIONS: SeatAllocation[] = [
  {
    id: 'staff-meena',
    name: 'Dr. Meena Krishnan',
    registerNumber: 'EMP-FAC-401',
    block: 'Front',
    row: 'A',
    seat: 5,
    type: 'staff',
    role: 'Faculty Seating Coordinator',
    department: 'School of Management',
    email: 'meena.krishnan@srmist.edu.in',
    assignedStudentCount: 13,
    studentCapacity: 13,
  },
]
