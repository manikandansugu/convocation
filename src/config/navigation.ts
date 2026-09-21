import type { IconName } from '../components/ui/Icon'

export type PageId = 'Student Information' | 'ID Verification' | 'Payment' | 'Guest Addition' | 'Convocation Pass'

export interface NavigationItem {
  label: PageId
  icon: IconName
}

export const navigationItems: NavigationItem[] = [
  { label: 'Student Information', icon: 'user' },
  { label: 'ID Verification', icon: 'camera' },
  { label: 'Payment', icon: 'card' },
  { label: 'Guest Addition', icon: 'user' },
  { label: 'Convocation Pass', icon: 'ticket' },
]
