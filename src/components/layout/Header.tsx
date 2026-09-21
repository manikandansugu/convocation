import { useState } from 'react'
import type { PageId } from '../../config/navigation'
import { Icon } from '../ui/Icon'

interface HeaderProps {
  activePage: PageId
  onOpenNavigation: () => void
}

export function Header({ activePage, onOpenNavigation }: HeaderProps) {
  const [notificationsOpen, setNotificationsOpen] = useState(false)

  return <header className="topbar">
    <button className="mobile-menu" onClick={onOpenNavigation} aria-label="Open navigation"><Icon name="menu" /></button>
    <div className="topbar-title">{activePage}</div>
    <div className="topbar-actions">
      <div className="status-pill"><span /> Convocation 2026</div>
      <button className="notification" onClick={() => setNotificationsOpen((open) => !open)} aria-label="Notifications"><Icon name="bell" /><span className="notification-dot" /></button>
      {notificationsOpen && <div className="notification-popover"><strong>You’re all caught up</strong><span>There are no new notifications.</span></div>}
    </div>
  </header>
}
