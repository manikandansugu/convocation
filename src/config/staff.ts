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
  program: string
  academicYear: string
  aadhaarNumber: string
  mobileNumber: string
  officialEmail: string
  personalEmail: string
  graduationType: string
  degreeMode: string
  convocationName: string
  convocationDate: string
  venueName: string
  venueAddress: string
  guestCount: number
  registered: boolean
  registeredAt?: string
  gownPaidAt?: string
  tagIssuedAt?: string
  gownReceivedAt?: string
  refreshmentReceivedAt?: string
  tokens: number
  bundleId: string
  facultyName: string
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

const CONVOCATION_DETAILS = {
  academicYear: '2025–2026',
  graduationType: 'Regular',
  degreeMode: 'Full Time',
  convocationName: 'Annual Convocation 2026',
  convocationDate: '07 October 2026',
  venueName: 'Dr. T. P. Ganesan Auditorium',
  venueAddress: 'SRM Institute of Science and Technology, Kattankulathur, Chennai — 603203',
  registered: true,
  registeredAt: '18 September 2026, 10:30 AM',
  gownPaidAt: '18 September 2026, 10:34 AM',
} as const

export const INITIAL_ROSTER: StudentRosterRecord[] = [
  {
    id: 'student-1',
    registrationId: 'CONV-2026-10245',
    registerNumber: 'RA2011003010245',
    name: 'Arun Menon',
    degree: 'B.Tech',
    program: 'Computer Science and Engineering',
    aadhaarNumber: 'XXXX XXXX 4242',
    mobileNumber: '+91 98765 43210',
    officialEmail: 'arun.menon@srmist.edu.in',
    personalEmail: 'arun.menon@gmail.com',
    guestCount: 2,
    tagIssuedAt: '07 October 2026, 08:18 AM',
    gownReceivedAt: '07 October 2026, 08:25 AM',
    refreshmentReceivedAt: '07 October 2026, 11:45 AM',
    tokens: 2,
    bundleId: 'BND-2026-10245',
    facultyName: 'Dr. Meena Krishnan',
    ...CONVOCATION_DETAILS,
    department: 'Computing Technologies',
    block: 'Front',
    row: 'A',
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
    degree: 'B.Tech',
    program: 'Electronics and Communication Engineering',
    aadhaarNumber: 'XXXX XXXX 6118',
    mobileNumber: '+91 98401 22334',
    officialEmail: 'priya.sharma@srmist.edu.in',
    personalEmail: 'priyasharma@gmail.com',
    guestCount: 1,
    tagIssuedAt: '07 October 2026, 08:22 AM',
    gownReceivedAt: '07 October 2026, 08:31 AM',
    refreshmentReceivedAt: '07 October 2026, 11:52 AM',
    tokens: 2,
    bundleId: 'BND-2026-10112',
    facultyName: 'Dr. S. Prakash',
    ...CONVOCATION_DETAILS,
    department: 'Electronics & Communication',
    block: 'Front',
    row: 'B',
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
    degree: 'B.Tech',
    program: 'Mechanical Engineering',
    aadhaarNumber: 'XXXX XXXX 9087',
    mobileNumber: '+91 98842 77109',
    officialEmail: 'rohan.verma@srmist.edu.in',
    personalEmail: 'rohanv@gmail.com',
    guestCount: 2,
    tokens: 0,
    bundleId: 'BND-2026-10489',
    facultyName: 'Dr. Vivek Nair',
    ...CONVOCATION_DETAILS,
    department: 'Mechanical Engineering',
    block: 'Front',
    row: 'C',
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
    degree: 'B.Tech',
    program: 'Biotechnology',
    aadhaarNumber: 'XXXX XXXX 1733',
    mobileNumber: '+91 97910 88221',
    officialEmail: 'ananya.iyer@srmist.edu.in',
    personalEmail: 'ananya.iyer@gmail.com',
    guestCount: 1,
    tagIssuedAt: '07 October 2026, 08:28 AM',
    refreshmentReceivedAt: '07 October 2026, 12:05 PM',
    tokens: 1,
    bundleId: 'BND-2026-10733',
    facultyName: 'Dr. Lakshmi Rao',
    ...CONVOCATION_DETAILS,
    department: 'Biotechnology',
    block: 'Front',
    row: 'D',
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
    degree: 'M.Tech',
    program: 'Artificial Intelligence',
    aadhaarNumber: 'XXXX XXXX 3901',
    mobileNumber: '+91 99620 11448',
    officialEmail: 'karthik.raman@srmist.edu.in',
    personalEmail: 'karthik.raman@gmail.com',
    guestCount: 2,
    tagIssuedAt: '07 October 2026, 08:12 AM',
    gownReceivedAt: '07 October 2026, 08:19 AM',
    refreshmentReceivedAt: '07 October 2026, 11:38 AM',
    tokens: 2,
    bundleId: 'BND-2026-10901',
    facultyName: 'Dr. Meena Krishnan',
    ...CONVOCATION_DETAILS,
    department: 'Computing Technologies',
    block: 'Front',
    row: 'E',
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
