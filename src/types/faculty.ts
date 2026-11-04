export interface FacultyMember {
  id: string
  employeeId: string
  name: string
  designation: string
  department: string
  email: string
  mobile: string
  assignedRows: string[]
  assignedBlock: string
  status: 'Approved' | 'Pending Verification'
  registeredAt: string
}

