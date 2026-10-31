export type QueryStatus = 'Open' | 'Responded' | 'Resolved'

export interface QueryMessage {
  id: string
  sender: 'Student' | 'Administrator'
  body: string
  sentAt: string
  channel: 'Portal' | 'Email'
}

export interface StudentQuery {
  id: string
  category: string
  subject: string
  email: string
  status: QueryStatus
  createdAt: string
  messages: QueryMessage[]
}

export const INITIAL_QUERIES: StudentQuery[] = [
  {
    id: 'QRY-2026-0151',
    category: 'Seating',
    subject: 'Seat number is not visible in my pass',
    email: 'arun.menon@gmail.com',
    status: 'Responded',
    createdAt: '27 Oct 2026, 02:15 PM',
    messages: [
      {
        id: 'query-message-5',
        sender: 'Student',
        body: 'My convocation pass shows the auditorium block, but the row and seat number are missing. Please check my allocation.',
        sentAt: '27 Oct 2026, 02:15 PM',
        channel: 'Portal',
      },
      {
        id: 'query-message-6',
        sender: 'Administrator',
        body: 'Your seat has been allocated as Block A, Row A12, Seat 25. Please refresh the Seating Layout page to view it.',
        sentAt: '27 Oct 2026, 03:05 PM',
        channel: 'Email',
      },
    ],
  },
  {
    id: 'QRY-2026-0148',
    category: 'Payment',
    subject: 'Payment completed but status is still pending',
    email: 'arun.menon@gmail.com',
    status: 'Resolved',
    createdAt: '25 Oct 2026, 09:40 AM',
    messages: [
      {
        id: 'query-message-3',
        sender: 'Student',
        body: 'I completed the ₹1,050 payment successfully, but the registration page still shows payment pending.',
        sentAt: '25 Oct 2026, 09:40 AM',
        channel: 'Portal',
      },
      {
        id: 'query-message-4',
        sender: 'Administrator',
        body: 'We verified the transaction and updated your payment status. Your certificate registration is now confirmed.',
        sentAt: '25 Oct 2026, 10:20 AM',
        channel: 'Email',
      },
    ],
  },
  {
    id: 'QRY-2026-0142',
    category: 'Convocation Pass',
    subject: 'Unable to download my convocation pass',
    email: 'arun.menon@gmail.com',
    status: 'Responded',
    createdAt: '24 Oct 2026, 10:25 AM',
    messages: [
      {
        id: 'query-message-1',
        sender: 'Student',
        body: 'The download button is not generating the pass. Please help me before the ceremony.',
        sentAt: '24 Oct 2026, 10:25 AM',
        channel: 'Portal',
      },
      {
        id: 'query-message-2',
        sender: 'Administrator',
        body: 'Your pass has been regenerated. Please sign in again and download it from the Convocation Pass menu.',
        sentAt: '24 Oct 2026, 11:10 AM',
        channel: 'Email',
      },
    ],
  },
]
