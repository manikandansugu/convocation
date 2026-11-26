import { useState } from 'react'
import { navigationItems, type PageId } from '../../config/navigation'
import { STUDENT } from '../../config/student'
import type { Student } from '../../types/registration'
import { Icon } from '../ui/Icon'

interface SidebarProps {
  activePage: PageId
  isOpen: boolean
  isCollapsed: boolean
  student?: Student
  onClose: () => void
  onToggleCollapse: () => void
  onNavigate: (page: PageId) => void
  onLogout: () => void
  guestEnabled: boolean
  onGuestEnabledChange: (enabled: boolean) => void
}

export function Sidebar({ activePage, isOpen, isCollapsed, student = STUDENT, onClose, onToggleCollapse, onNavigate, onLogout, guestEnabled, onGuestEnabledChange }: SidebarProps) {
  const [profileOpen, setProfileOpen] = useState(false)

  const logout = () => {
    setProfileOpen(false)
    onLogout()
  }

  const initials = student.name
    .split(' ')
    .filter(Boolean)
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return <>
    <button className={`sidebar-scrim ${isOpen ? 'visible' : ''}`} aria-label="Close navigation" onClick={onClose} />
    <aside className={`sidebar ${isOpen ? 'open' : ''} ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="brand">
        <div className="brand-mark"><img src={import.meta.env.BASE_URL + 'campus-trust-logo.png'} alt="Campus Trust" /></div>
        <div className="brand-copy">
          <strong>Campus<span className="brand-highlight">Trust</span></strong>
          <small className="brand-subtitle">Convocation</small>
        </div>
      </div>
      <button
        type="button"
        className="sidebar-collapse-button"
        onClick={() => {
          setProfileOpen(false)
          onToggleCollapse()
        }}
        aria-label={isCollapsed ? 'Expand navigation' : 'Collapse navigation'}
        title={isCollapsed ? 'Expand navigation' : 'Collapse navigation'}
      >
        <Icon name="chevron" size={16} />
      </button>
      <nav className="main-nav" aria-label="Main navigation">
        {/* <p className="nav-label">MAIN MENU</p> */}
        {navigationItems.filter((item) => guestEnabled || item.label !== 'Guest Addition').map((item) => <button key={item.label} className={activePage === item.label ? 'active' : ''} onClick={() => onNavigate(item.label)} title={isCollapsed ? item.label : undefined}><Icon name={item.icon} /><span>{item.label}</span></button>)}
      </nav>
      <div className="sidebar-footer">
        {profileOpen && <div className="profile-popup" role="dialog" aria-label="Student profile">
          <div className="profile-popup-heading">
            <span>Student profile</span>
            <button type="button" onClick={() => setProfileOpen(false)} aria-label="Close profile"><Icon name="x" size={16} /></button>
          </div>
          <div className="profile-popup-user">
            <div className="avatar">{student.photoUrl ? <img src={student.photoUrl} alt={student.name} /> : initials}</div>
            <div><strong>{student.name}</strong><span>{student.registerNumber}</span></div>
          </div>
          <div className="profile-popup-detail"><span>Programme</span><strong>{student.degree} — {student.program}</strong></div>
          <div className="profile-guest-toggle">
            <div><strong>Guest access</strong><span>{guestEnabled ? 'Guest features are visible' : 'Guest features are hidden'}</span></div>
            <button type="button" role="switch" aria-checked={guestEnabled} className={guestEnabled ? 'enabled' : ''} onClick={() => onGuestEnabledChange(!guestEnabled)}>
              <span className="profile-toggle-track"><i /></span>
              <span className="profile-toggle-state">{guestEnabled ? 'On' : 'Off'}</span>
            </button>
          </div>
          <button type="button" className="profile-signout" onClick={logout}><Icon name="logout" size={17} /><span>Sign out</span></button>
        </div>}
        <button type="button" className="student-card profile-trigger" onClick={() => setProfileOpen((open) => !open)} aria-expanded={profileOpen} aria-haspopup="dialog">
          <div className="avatar">{student.photoUrl ? <img src={student.photoUrl} alt={student.name} /> : initials}</div><div><strong>{student.name}</strong><span>{student.registerNumber}</span></div><Icon name="chevron" size={17} />
        </button>
      </div>
    </aside>
  </>
}
