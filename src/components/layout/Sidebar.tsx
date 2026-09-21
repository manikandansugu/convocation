import { navigationItems, type PageId } from '../../config/navigation'
import { Icon } from '../ui/Icon'

interface SidebarProps {
  activePage: PageId
  isOpen: boolean
  onClose: () => void
  onNavigate: (page: PageId) => void
}

export function Sidebar({ activePage, isOpen, onClose, onNavigate }: SidebarProps) {
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
        <p className="nav-label">MAIN MENU</p>
        {navigationItems.map((item) => <button key={item.label} className={activePage === item.label ? 'active' : ''} onClick={() => onNavigate(item.label)}><Icon name={item.icon} /><span>{item.label}</span>{activePage === item.label && <span className="active-dot" />}</button>)}
      </nav>
      <div className="sidebar-footer">
        <div className="student-card"><div className="avatar">AM</div><div><strong>Arun Menon</strong><span>RA2011003010245</span></div><Icon name="chevron" size={17} /></div>
      </div>
    </aside>
  </>
}
