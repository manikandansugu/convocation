import type { Student } from '../types/registration'

export const STUDENT: Student = {
  name: 'Arun Menon',
  registerNumber: 'RA2011003010245',
  department: 'Computing Technologies',
  degree: 'B.Tech — Computer Science',
  graduationYear: '2026',
  email: 'arun.menon@gmail.com',
  mobile: '+91 98765 43210',
  postalAddress: '14, Lake View Road, Anna Nagar, Chennai, Tamil Nadu — 600040',
  communicationAddress: 'SRM Student Residence, Potheri, Kattankulathur, Tamil Nadu — 603203',
}

export const REGISTRATION_ID = 'CONV-2026-10245'
export const CERTIFICATE_REGISTRATION_AMOUNT = 1000
export const GRADUATION_REGALIA_AMOUNT = 50
export const REGISTRATION_AMOUNT = CERTIFICATE_REGISTRATION_AMOUNT + GRADUATION_REGALIA_AMOUNT
