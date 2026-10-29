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
