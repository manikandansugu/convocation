import { useState } from 'react'
import { Icon } from '../components/ui/Icon'
import type { ConvocationNotification, NotificationCategory } from '../types/notifications'
import type { StudentQuery } from '../types/queries'

interface NotificationsPageProps {
  notifications: ConvocationNotification[]
  queries: StudentQuery[]
  onMarkRead: (id: string) => void
  onMarkAllRead: () => void
  onOpenQueries: () => void
}

type NotificationFilter = 'All' | NotificationCategory | 'Queries'

const FILTERS: NotificationFilter[] = ['All', 'Announcement', 'Alert', 'Reminder', 'Queries']

export function NotificationsPage({ notifications, queries, onMarkRead, onMarkAllRead, onOpenQueries }: NotificationsPageProps) {
  const [filter, setFilter] = useState<NotificationFilter>('All')
  const announcementFirstNotifications = [...notifications].sort((a, b) => {
    const aPriority = a.category === 'Announcement' ? 0 : 1
    const bPriority = b.category === 'Announcement' ? 0 : 1
    return aPriority - bPriority
  })
  const visibleNotifications = filter === 'All'
    ? announcementFirstNotifications
    : filter === 'Queries'
      ? []
      : notifications.filter((notification) => notification.category === filter)
  const visibleQueries = filter === 'All' || filter === 'Queries' ? queries : []
  const visibleItemCount = visibleNotifications.length + visibleQueries.length
  const unreadCount = notifications.filter((notification) => !notification.read).length

  return (
    <div className="page notifications-page prototype-page">
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
        <span>{visibleItemCount} updates</span>
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
        {visibleQueries.map((query) => {
          const latestMessage = query.messages[query.messages.length - 1]
          return (
            <article key={query.id} className="notification-card query panel">
              <div className="notification-card-icon"><Icon name="help" size={21} /></div>
              <div className="notification-card-body">
                <div className="notification-card-meta">
                  <span className="notification-category">Query</span>
                  <span className={`notification-query-status ${query.status.toLowerCase()}`}>{query.status}</span>
                  <time>{query.createdAt}</time>
                </div>
                <h2>{query.subject}</h2>
                <p>{latestMessage?.body || 'No reply has been added yet.'}</p>
                <span className="notification-audience"><Icon name="file" size={13} /> {query.id} · {query.messages.length} {query.messages.length === 1 ? 'message' : 'messages'}</span>
              </div>
              <button type="button" className="notification-read-button" onClick={onOpenQueries}>View query</button>
            </article>
          )
        })}
      </div>
    </div>
  )
}
