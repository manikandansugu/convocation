import type { PageId } from '../../config/navigation'
import { Icon, type IconName } from '../ui/Icon'

export interface HeaderProps {
  activePage: PageId
  onOpenNavigation: () => void
  title?: string
  subtitle?: string
  eyebrow?: string
  icon?: IconName
  action?: {
    label: string
    icon: IconName
    onClick: () => void
  }
  status?: {
    label: string
    icon?: IconName
    tone?: 'success' | 'info' | 'neutral'
  }
}

export function Header({ activePage, onOpenNavigation, title, subtitle, eyebrow, icon, action, status }: HeaderProps) {
  const detailed = Boolean(subtitle || eyebrow || icon)

  return <header className={`topbar ${detailed ? 'topbar-detailed' : ''}`}>
    <button className="mobile-menu" onClick={onOpenNavigation} aria-label="Open navigation"><Icon name="menu" /></button>
    <div className="topbar-page-heading">
      {icon && <span className="topbar-page-icon"><Icon name={icon} size={22} /></span>}
      <div>
        {eyebrow && <p>{eyebrow}</p>}
        <div className="topbar-title">{title || activePage}</div>
        {subtitle && <span>{subtitle}</span>}
      </div>
    </div>
    <div className="topbar-actions">
      {action ? (
        <button type="button" className="topbar-primary-action" onClick={action.onClick}>
          <Icon name={action.icon} size={16} /> {action.label}
        </button>
      ) : status ? (
        <span className={`topbar-success-status ${status.tone || 'success'}`}>
          {status.icon && <Icon name={status.icon} size={15} />} {status.label}
        </span>
      ) : (
        <div className="status-pill"><span /> Convocation 2026</div>
      )}
    </div>
  </header>
}
