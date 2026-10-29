export type NotificationCategory = 'Announcement' | 'Alert' | 'Reminder'

export interface ConvocationNotification {
  id: string
  category: NotificationCategory
  title: string
  message: string
  audience: string
  sentAt: string
  important: boolean
  read: boolean
}

export const INITIAL_NOTIFICATIONS: ConvocationNotification[] = [
  {
    id: 'notice-1',
    category: 'Alert',
    title: 'Reporting gate updated',
    message: 'Students assigned to Block A must enter through Gate 02 and complete security verification before 09:15 AM.',
    audience: 'Block A Students',
    sentAt: 'Today, 08:15 AM',
    important: true,
    read: false,
  },
  {
    id: 'notice-2',
    category: 'Reminder',
    title: 'Keep your digital pass ready',
    message: 'Please download your convocation pass and keep the QR code ready for scanning at the entrance.',
    audience: 'All Students',
    sentAt: 'Yesterday, 05:30 PM',
    important: false,
    read: false,
  },
  {
    id: 'notice-3',
    category: 'Announcement',
    title: 'Graduation regalia collection',
    message: 'Gown, cap and ceremony kit distribution will begin at Counter 04 from 08:30 AM.',
    audience: 'All Students',
    sentAt: '25 Oct 2026, 11:00 AM',
    important: false,
    read: true,
  },
]
