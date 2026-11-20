import type { FacultyMember } from '../types/faculty'

export interface FacultyLoginCredential {
  netId: string
  password: string
  facultyId: string
}

export const DEFAULT_FACULTY: FacultyMember = {
  id: 'fac-mca',
  employeeId: 'FACMCA01',
  name: 'Dr. Kavitha Raman',
  designation: 'Associate Professor',
  department: 'MCA',
  email: 'kavitha.raman@srmist.edu.in',
  mobile: '+91 94440 12001',
  assignedRows: ['A', 'B'],
  assignedBlock: 'Front Block',
  status: 'Approved',
  registeredAt: '25 September 2026',
}

export const INITIAL_FACULTY_LIST: FacultyMember[] = [
  DEFAULT_FACULTY,
  {
    id: 'fac-mcom',
    employeeId: 'FACMCOM01',
    name: 'Dr. Arvind Narayanan',
    designation: 'Associate Professor',
    department: 'M.Com',
    email: 'arvind.narayanan@srmist.edu.in',
    mobile: '+91 94440 12002',
    assignedRows: ['C', 'D'],
    assignedBlock: 'Front Block',
    status: 'Approved',
    registeredAt: '26 September 2026',
  },
  {
    id: 'fac-bca',
    employeeId: 'FACBCA01',
    name: 'Dr. Nandhini Iyer',
    designation: 'Assistant Professor',
    department: 'BCA',
    email: 'nandhini.iyer@srmist.edu.in',
    mobile: '+91 94440 12003',
    assignedRows: ['E', 'F'],
    assignedBlock: 'Front Block',
    status: 'Approved',
    registeredAt: '27 September 2026',
  },
]

// Fixed prototype credentials requested for the three faculty desks.
export const FACULTY_LOGIN_CREDENTIALS: FacultyLoginCredential[] = [
  { netId: 'FACMCA01', password: 'Mca@2026', facultyId: 'fac-mca' },
  { netId: 'FACMCOM01', password: 'Mcom@2026', facultyId: 'fac-mcom' },
  { netId: 'FACBCA01', password: 'Bca@2026', facultyId: 'fac-bca' },
]

