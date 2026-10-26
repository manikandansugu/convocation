export interface StaffMember {
  name: string
  employeeId: string
  role: string
  department: string
  counter: string
  gate: string
}

export const DEFAULT_STAFF: StaffMember = {
  name: 'Dr. Rajesh Kumar',
  employeeId: 'EMP9041',
  role: 'Convocation Desk Lead',
  department: 'Academic Operations & Convocation Board',
  counter: 'Counter 04 (Ground Floor)',
  gate: 'Gate 02',
}

export interface StudentRosterRecord {
  id: string
  registrationId: string
  registerNumber: string
  name: string
  degree: string
  department: string
  block: string
  row: string
  seat: number
  gate: string
  paymentStatus: 'Paid' | 'Pending'
  verificationStatus: 'Verified' | 'Pending'
  tagIssued: boolean
  gownReceived: boolean
  capIssued: boolean
  refreshmentReady: boolean
  kitIssued: boolean
  gownReturned: boolean
  admittedAtGate: boolean
  admittedTime?: string
  gownReturnTime?: string
}

export const INITIAL_ROSTER: StudentRosterRecord[] = [
  {
    id: 'student-1',
    registrationId: 'CONV-2026-10245',
    registerNumber: 'RA2011003010245',
    name: 'Arun Menon',
    degree: 'B.Tech — Computer Science',
    department: 'Computing Technologies',
    block: 'A',
    row: 'A12',
    seat: 25,
    gate: 'Gate 02',
    paymentStatus: 'Paid',
    verificationStatus: 'Verified',
    tagIssued: true,
    gownReceived: true,
    capIssued: true,
    refreshmentReady: true,
    kitIssued: true,
    gownReturned: false,
    admittedAtGate: true,
    admittedTime: '08:42 AM',
  },
  {
    id: 'student-2',
    registrationId: 'CONV-2026-10112',
    registerNumber: 'RA2011003010112',
    name: 'Priya Sharma',
    degree: 'B.Tech — Electronics & Comm.',
    department: 'Electronics & Communication',
    block: 'A',
    row: 'A10',
    seat: 14,
    gate: 'Gate 02',
    paymentStatus: 'Paid',
    verificationStatus: 'Verified',
    tagIssued: true,
    gownReceived: true,
    capIssued: true,
    refreshmentReady: true,
    kitIssued: true,
    gownReturned: true,
    gownReturnTime: '03:15 PM',
    admittedAtGate: true,
    admittedTime: '08:50 AM',
  },
  {
    id: 'student-3',
    registrationId: 'CONV-2026-10489',
    registerNumber: 'RA2011003010489',
    name: 'Rohan Verma',
    degree: 'B.Tech — Mechanical Eng.',
    department: 'Mechanical Engineering',
    block: 'B',
    row: 'B04',
    seat: 8,
    gate: 'Gate 01',
    paymentStatus: 'Paid',
    verificationStatus: 'Verified',
    tagIssued: false,
    gownReceived: false,
    capIssued: false,
    refreshmentReady: false,
    kitIssued: false,
    gownReturned: false,
    admittedAtGate: false,
  },
  {
    id: 'student-4',
    registrationId: 'CONV-2026-10733',
    registerNumber: 'RA2011003010733',
    name: 'Ananya Iyer',
    degree: 'B.Tech — Biotechnology',
    department: 'Biotechnology',
    block: 'A',
    row: 'A15',
    seat: 32,
    gate: 'Gate 02',
    paymentStatus: 'Paid',
    verificationStatus: 'Verified',
    tagIssued: true,
    gownReceived: false,
    capIssued: false,
    refreshmentReady: true,
    kitIssued: false,
    gownReturned: false,
    admittedAtGate: false,
  },
  {
    id: 'student-5',
    registrationId: 'CONV-2026-10901',
    registerNumber: 'RA2011003010901',
    name: 'Karthik Raman',
    degree: 'M.Tech — Artificial Intelligence',
    department: 'Computing Technologies',
    block: 'C',
    row: 'C02',
    seat: 5,
    gate: 'Gate 03',
    paymentStatus: 'Paid',
    verificationStatus: 'Verified',
    tagIssued: true,
    gownReceived: true,
    capIssued: true,
    refreshmentReady: true,
    kitIssued: true,
    gownReturned: false,
    admittedAtGate: true,
    admittedTime: '08:35 AM',
  },
]
