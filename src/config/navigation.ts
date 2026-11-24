import type { IconName } from '../components/ui/Icon'

export type PageId =
  | 'Instructions'
  | 'Notifications'
  | 'Queries & Support'
  | 'Seating'
  | 'Seating Layout'
  | 'Map'
  | 'Student Information'
  | 'Graduation Kit Status'
  | 'ID Verification'
  | 'Payment'
  | 'Guest Addition'
  | 'Convocation Pass'
  | 'Photo Gallery'

export interface NavigationItem {
  label: PageId
  icon: IconName
}

export const navigationItems: NavigationItem[] = [
  { label: 'Instructions', icon: 'file' },
  { label: 'Notifications', icon: 'bell' },
  { label: 'Student Information', icon: 'user' },
  { label: 'Graduation Kit Status', icon: 'tag' },
  { label: 'ID Verification', icon: 'camera' },
  { label: 'Payment', icon: 'wallet' },
  { label: 'Guest Addition', icon: 'user' },
  { label: 'Convocation Pass', icon: 'ticket' },
  { label: 'Photo Gallery', icon: 'camera' },
  { label: 'Seating', icon: 'grid' },
  { label: 'Map', icon: 'map' },
  { label: 'Queries & Support', icon: 'help' },
]
