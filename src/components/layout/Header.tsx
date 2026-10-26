import type { PageId } from '../../config/navigation'
import { Icon } from '../ui/Icon'

interface HeaderProps {
  activePage: PageId
  onOpenNavigation: () => void
}

export function Header({ activePage, onOpenNavigation }: HeaderProps) {
  return <header className="topbar">
    <button className="mobile-menu" onClick={onOpenNavigation} aria-label="Open navigation"><Icon name="menu" /></button>
    <div className="topbar-title">{activePage}</div>
    <div className="topbar-actions">
      <div className="status-pill"><span /> Convocation 2026</div>
    </div>
  </header>
}
