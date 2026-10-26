import { useState } from 'react'
import { navigationItems, type PageId } from '../../config/navigation'
import { Icon } from '../ui/Icon'

interface SidebarProps {
  activePage: PageId
  isOpen: boolean
  onClose: () => void
  onNavigate: (page: PageId) => void
  onLogout: () => void
}

export function Sidebar({ activePage, isOpen, onClose, onNavigate, onLogout }: SidebarProps) {
  const [profileOpen, setProfileOpen] = useState(false)

  const logout = () => {
    setProfileOpen(false)
    onLogout()
  }

  return <>
    <button className={`sidebar-scrim ${isOpen ? 'visible' : ''}`} aria-label="Close navigation" onClick={onClose} />
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="brand">
        <div className="brand-mark"><img src={import.meta.env.BASE_URL + 'campus-trust-logo.png'} alt="Campus Trust" /></div>
        <div className="brand-copy">
          <strong>Campus<span className="brand-highlight">Trust</span></strong>
          <small className="brand-subtitle">Convocation</small>
        </div>
      </div>
      <nav className="main-nav" aria-label="Main navigation">
        {/* <p className="nav-label">MAIN MENU</p> */}
        {navigationItems.map((item) => <button key={item.label} className={activePage === item.label ? 'active' : ''} onClick={() => onNavigate(item.label)}><Icon name={item.icon} /><span>{item.label}</span></button>)}
      </nav>
      <div className="sidebar-footer">
        {profileOpen && <div className="profile-popup" role="dialog" aria-label="Student profile">
          <div className="profile-popup-heading">
            <span>Student profile</span>
            <button type="button" onClick={() => setProfileOpen(false)} aria-label="Close profile"><Icon name="x" size={16} /></button>
          </div>
          <div className="profile-popup-user">
            <div className="avatar">AM</div>
            <div><strong>Arun Menon</strong><span>RA2011003010245</span></div>
          </div>
          <div className="profile-popup-detail"><span>Programme</span><strong>B.Tech — Computer Science</strong></div>
          <button type="button" className="profile-signout" onClick={logout}><Icon name="logout" size={17} /><span>Sign out</span></button>
        </div>}
        <button type="button" className="student-card profile-trigger" onClick={() => setProfileOpen((open) => !open)} aria-expanded={profileOpen} aria-haspopup="dialog">
          <div className="avatar">AM</div><div><strong>Arun Menon</strong><span>RA2011003010245</span></div><Icon name="chevron" size={17} />
        </button>
      </div>
    </aside>
  </>
}
