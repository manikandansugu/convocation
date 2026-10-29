import type { IconName } from '../components/ui/Icon'

export type PageId = 'Instructions' | 'Notifications' | 'Queries & Support' | 'Seating Layout' | 'Student Information' | 'ID Verification' | 'Payment' | 'Guest Addition' | 'Convocation Pass'

export interface NavigationItem {
  label: PageId
  icon: IconName
}

export const navigationItems: NavigationItem[] = [
  { label: 'Student Information', icon: 'user' },
  { label: 'ID Verification', icon: 'camera' },
  { label: 'Payment', icon: 'wallet' },
  { label: 'Guest Addition', icon: 'user' },
  { label: 'Convocation Pass', icon: 'ticket' },
  { label: 'Instructions', icon: 'file' },
  { label: 'Notifications', icon: 'bell' },
  { label: 'Queries & Support', icon: 'help' },
  { label: 'Seating Layout', icon: 'grid' },
]
