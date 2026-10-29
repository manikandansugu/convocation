import { useState } from 'react'
import { Icon } from '../components/ui/Icon'
import type { ConvocationNotification, NotificationCategory } from '../types/notifications'

interface NotificationsPageProps {
  notifications: ConvocationNotification[]
  onMarkRead: (id: string) => void
  onMarkAllRead: () => void
}

type NotificationFilter = 'All' | NotificationCategory

const FILTERS: NotificationFilter[] = ['All', 'Announcement', 'Alert', 'Reminder']

export function NotificationsPage({ notifications, onMarkRead, onMarkAllRead }: NotificationsPageProps) {
  const [filter, setFilter] = useState<NotificationFilter>('All')
  const visibleNotifications = filter === 'All'
    ? notifications
    : notifications.filter((notification) => notification.category === filter)
  const unreadCount = notifications.filter((notification) => !notification.read).length

  return (
    <div className="page notifications-page prototype-page">
      <div className="prototype-heading notifications-heading">
        <div className="college-title">
          <div className="college-logo"><Icon name="bell" size={27} /></div>
          <div>
            <p className="eyebrow">CONVOCATION 2026</p>
            <h1>Notifications</h1>
            <p className="page-subtitle">Announcements, alerts and reminders specifically shared for your convocation journey.</p>
          </div>
        </div>
        <span className="notifications-unread"><i /> {unreadCount} unread</span>
      </div>

      <section className="notifications-summary panel">
        <div className="notifications-summary-icon"><Icon name="bell" size={23} /></div>
        <div>
          <p className="eyebrow">STAY INFORMED</p>
          <h2>Important convocation updates</h2>
          <p>Check this page regularly for time-sensitive venue, registration and ceremony information.</p>
        </div>
        {unreadCount > 0 && <button type="button" onClick={onMarkAllRead}><Icon name="check" size={15} /> Mark all as read</button>}
      </section>

      <div className="notifications-toolbar">
        <div className="notification-filters" aria-label="Filter notifications">
          {FILTERS.map((item) => (
            <button key={item} type="button" className={filter === item ? 'active' : ''} onClick={() => setFilter(item)}>{item}</button>
          ))}
        </div>
        <span>{visibleNotifications.length} notifications</span>
      </div>

      <div className="notification-list">
        {visibleNotifications.map((notification) => (
          <article key={notification.id} className={`notification-card panel ${notification.category.toLowerCase()} ${notification.read ? 'read' : 'unread'}`}>
            <div className="notification-card-icon">
              <Icon name={notification.category === 'Reminder' ? 'clock' : notification.category === 'Alert' ? 'bell' : 'file'} size={21} />
            </div>
            <div className="notification-card-body">
              <div className="notification-card-meta">
                <span className="notification-category">{notification.category}</span>
                {notification.important && <span className="notification-important">Important</span>}
                <time>{notification.sentAt}</time>
              </div>
              <h2>{notification.title}</h2>
              <p>{notification.message}</p>
              <span className="notification-audience"><Icon name="user" size={13} /> Sent to {notification.audience}</span>
            </div>
            {!notification.read && <button type="button" className="notification-read-button" onClick={() => onMarkRead(notification.id)}>Mark as read</button>}
          </article>
        ))}
      </div>
    </div>
  )
}
