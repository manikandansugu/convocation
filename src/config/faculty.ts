import type { FacultyMember } from '../types/faculty'

export const DEFAULT_FACULTY: FacultyMember = {
  id: 'fac-1',
  employeeId: 'EMP-FAC-401',
  name: 'Dr. Meena Krishnan',
  designation: 'Professor & Head',
  department: 'School of Management',
  email: 'meena.krishnan@srmist.edu.in',
  mobile: '+91 94440 12345',
  assignedRows: ['A', 'B'],
  assignedBlock: 'Front Block',
  status: 'Approved',
  registeredAt: '25 September 2026',
}

export const INITIAL_FACULTY_LIST: FacultyMember[] = [
  DEFAULT_FACULTY,
  {
    id: 'fac-2',
    employeeId: 'EMP-FAC-402',
    name: 'Dr. S. Prakash',
    designation: 'Associate Professor',
    department: 'Computer Applications',
    email: 'prakash.s@srmist.edu.in',
    mobile: '+91 94441 54321',
    assignedRows: ['B'],
    assignedBlock: 'Front Block',
    status: 'Approved',
    registeredAt: '26 September 2026',
  },
  {
    id: 'fac-3',
    employeeId: 'EMP-FAC-403',
    name: 'Dr. Vivek Nair',
    designation: 'Associate Professor',
    department: 'School of Management',
    email: 'vivek.nair@srmist.edu.in',
    mobile: '+91 98840 88776',
    assignedRows: ['C'],
    assignedBlock: 'Front Block',
    status: 'Approved',
    registeredAt: '27 September 2026',
  },
  {
    id: 'fac-4',
    employeeId: 'EMP-FAC-404',
    name: 'Dr. Lakshmi Rao',
    designation: 'Professor',
    department: 'Commerce',
    email: 'lakshmi.rao@srmist.edu.in',
    mobile: '+91 97900 11223',
    assignedRows: ['D'],
    assignedBlock: 'Front Block',
    status: 'Approved',
    registeredAt: '28 September 2026',
  },
]

