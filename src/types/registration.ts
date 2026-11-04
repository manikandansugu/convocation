export interface Guest {
  name: string
  relationship: string
  aadhaarNumber: string
}

export interface Student {
  name: string
  registerNumber: string
  netId?: string
  department: string
  degree: string
  program?: string
  graduationYear: string
  email: string
  mobile: string
  postalAddress: string
  communicationAddress: string
  seatNumber?: string
  venue?: string
  kitCounter?: string
  graduationDate?: string
  attendanceMode?: 'in_person' | 'in_absentia'
  coeApproved?: boolean
  photoUrl?: string
}

export interface COEStudent {
  netId: string
  registerNumber: string
  name: string
  degree: string
  program: string
  department: string
  graduationYear: string
  email: string
  mobile: string
  coeApproved: boolean
  attendanceMode: 'in_person' | 'in_absentia' | 'pending'
  dodeLinkSent: boolean
}
