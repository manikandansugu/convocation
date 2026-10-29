import { useState } from 'react'
import { Icon } from '../components/ui/Icon'
import { DEFAULT_STAFF, INITIAL_ROSTER, type StaffMember, type StudentRosterRecord } from '../config/staff'
import studentPhoto from '../assets/student-verification.png'
import { SeatingLayout, type SeatAllocation } from '../components/seating/SeatingLayout'
import type { ConvocationNotification, NotificationCategory } from '../types/notifications'

interface StaffPortalPageProps {
  staff?: StaffMember
  onLogout: () => void
  notifications: ConvocationNotification[]
  onSendNotification: (notification: ConvocationNotification) => void
}

type StaffTab = 'counter' | 'roster' | 'seating' | 'notifications'

export function StaffPortalPage({ staff = DEFAULT_STAFF, onLogout, notifications, onSendNotification }: StaffPortalPageProps) {
  const [activeTab, setActiveTab] = useState<StaffTab>('counter')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [roster, setRoster] = useState<StudentRosterRecord[]>(INITIAL_ROSTER)
  const [selectedStudentId, setSelectedStudentId] = useState<string>('student-1')
  const [searchQuery, setSearchQuery] = useState('')
  const [notificationCategory, setNotificationCategory] = useState<NotificationCategory>('Announcement')
  const [notificationAudience, setNotificationAudience] = useState('All Students')
  const [notificationTitle, setNotificationTitle] = useState('')
  const [notificationMessage, setNotificationMessage] = useState('')
  const [notificationImportant, setNotificationImportant] = useState(false)
  const [notificationSent, setNotificationSent] = useState(false)

  const staffInitials = staff.name
    .split(' ')
    .filter(Boolean)
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const STAFF_NAV_ITEMS = [
    { id: 'counter' as const, label: 'Kit & Gown Desk', icon: 'tag' as const },
    { id: 'roster' as const, label: 'Student List', icon: 'user' as const },
    { id: 'seating' as const, label: 'Seating Layout', icon: 'grid' as const },
    { id: 'notifications' as const, label: 'Notifications', icon: 'bell' as const },
  ]

  const TAB_TITLES: Record<StaffTab, string> = {
    counter: 'Kit & Gown Desk',
    roster: 'Student List',
    seating: 'Seating Layout',
    notifications: 'Notifications',
  }

  const sendNotification = () => {
    if (!notificationTitle.trim() || !notificationMessage.trim()) return
    onSendNotification({
      id: `notice-${Date.now()}`,
      category: notificationCategory,
      title: notificationTitle.trim(),
      message: notificationMessage.trim(),
      audience: notificationAudience,
      sentAt: 'Just now',
      important: notificationImportant,
      read: false,
    })
    setNotificationTitle('')
    setNotificationMessage('')
    setNotificationImportant(false)
    setNotificationSent(true)
    window.setTimeout(() => setNotificationSent(false), 3000)
  }

  const selectedStudent = roster.find((s) => s.id === selectedStudentId) || roster[0]
  const seatingAllocations: SeatAllocation[] = roster.map((student) => ({
    id: student.id,
    name: student.name,
    registerNumber: student.registerNumber,
    block: student.block,
    row: student.row,
    seat: student.seat,
    type: 'student',
  }))

  const updateStudentKit = (studentId: string, field: keyof StudentRosterRecord, value: boolean) => {
    setRoster((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, [field]: value } : s))
    )
  }

  const issueAllKit = (studentId: string) => {
    setRoster((prev) =>
      prev.map((s) =>
        s.id === studentId
          ? {
              ...s,
              tagIssued: true,
              gownReceived: true,
              capIssued: true,
              refreshmentReady: true,
              kitIssued: true,
            }
          : s
      )
    )
  }

  const resetStudentKit = (studentId: string) => {
    setRoster((prev) =>
      prev.map((s) =>
        s.id === studentId
          ? {
              ...s,
              tagIssued: false,
              gownReceived: false,
              capIssued: false,
              refreshmentReady: false,
              kitIssued: false,
              gownReturned: false,
              gownReturnTime: undefined,
            }
          : s
      )
    )
  }

  const recordGownReturn = (studentId: string) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    setRoster((prev) =>
      prev.map((s) =>
        s.id === studentId
          ? { ...s, gownReturned: true, gownReturnTime: time }
          : s
      )
    )
  }

  const filteredRoster = roster.filter((s) => {
    const q = searchQuery.toLowerCase().trim()
    if (!q) return true
    return (
      s.name.toLowerCase().includes(q) ||
      s.registerNumber.toLowerCase().includes(q) ||
      s.registrationId.toLowerCase().includes(q) ||
      s.department.toLowerCase().includes(q)
    )
  })

  // Aggregate stats
  const gownsIssuedCount = roster.filter((s) => s.gownReceived).length + 840
  const gownsReturnedCount = roster.filter((s) => s.gownReturned).length + 122
  const admittedCount = roster.filter((s) => s.admittedAtGate).length + 908

  const completedStepsCount =
    (selectedStudent.tagIssued ? 1 : 0) +
    (selectedStudent.gownReceived ? 1 : 0) +
    (selectedStudent.capIssued ? 1 : 0) +
    (selectedStudent.refreshmentReady ? 1 : 0) +
    (selectedStudent.kitIssued ? 1 : 0)

  return (
    <div className="app-shell staff-app-shell">
      {/* Mobile Scrim */}
      <button
        className={`sidebar-scrim ${sidebarOpen ? 'visible' : ''}`}
        aria-label="Close navigation"
        onClick={() => setSidebarOpen(false)}
      />

      {/* Side Menu in Student Flow Style */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="brand">
          <div className="brand-mark">
            <img src={import.meta.env.BASE_URL + 'campus-trust-logo.png'} alt="Campus Trust" />
          </div>
          <div className="brand-copy">
            <strong>Campus<span className="brand-highlight">Trust</span></strong>
            <small className="brand-subtitle">Staff Portal</small>
          </div>
        </div>

        <div className="staff-sidebar-station-card">
          <div className="staff-sidebar-station-pill">
            <Icon name="shield" size={13} />
            <span>{staff.counter}</span>
          </div>
          <small>{staff.role}</small>
        </div>

        <nav className="main-nav" aria-label="Staff navigation">
          {STAFF_NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={activeTab === item.id ? 'active' : ''}
              onClick={() => {
                setActiveTab(item.id)
                setSidebarOpen(false)
              }}
            >
              <Icon name={item.icon} />
              <span>{item.label}</span>
            </button>
          ))}

        </nav>

        <div className="sidebar-footer">
          {profileOpen && (
            <div className="profile-popup" role="dialog" aria-label="Staff profile">
              <div className="profile-popup-heading">
                <span>Staff profile</span>
                <button
                  type="button"
                  onClick={() => setProfileOpen(false)}
                  aria-label="Close profile"
                >
                  <Icon name="x" size={16} />
                </button>
              </div>
              <div className="profile-popup-user">
                <div className="avatar">{staffInitials}</div>
                <div>
                  <strong>{staff.name}</strong>
                  <span>{staff.employeeId}</span>
                </div>
              </div>
              <div className="profile-popup-detail">
                <span>Assigned Station</span>
                <strong>{staff.counter}</strong>
              </div>
              <div className="profile-popup-detail">
                <span>Designation</span>
                <strong>{staff.role}</strong>
              </div>
              <button
                type="button"
                className="profile-signout"
                onClick={() => {
                  setProfileOpen(false)
                  onLogout()
                }}
              >
                <Icon name="logout" size={17} />
                <span>Sign out</span>
              </button>
            </div>
          )}

          <button
            type="button"
            className="student-card profile-trigger"
            onClick={() => setProfileOpen((open) => !open)}
            aria-expanded={profileOpen}
            aria-haspopup="dialog"
          >
            <div className="avatar">{staffInitials}</div>
            <div>
              <strong>{staff.name}</strong>
              <span>{staff.employeeId}</span>
            </div>
            <Icon name="chevron" size={17} />
          </button>
        </div>
      </aside>

      {/* Main Staff Content */}
      <main className="main-content staff-main-content">
        <header className="topbar">
          <button
            className="mobile-menu"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open navigation"
          >
            <Icon name="menu" />
          </button>
          <div className="topbar-title">{TAB_TITLES[activeTab]}</div>
          <div className="topbar-actions">
            <div className="status-pill"><span /> Convocation 2026</div>
            <span className="staff-topbar-station-pill">
              <Icon name="shield" size={13} /> {staff.counter}
            </span>
            <button
              type="button"
              className="staff-topbar-signout-btn"
              onClick={onLogout}
              title="Sign out of staff portal"
            >
              <Icon name="logout" size={15} />
              <span>Sign out</span>
            </button>
          </div>
        </header>

        <div className="staff-page-content">
          {/* Counter Info Banner */}
          <section className="staff-station-banner">
          <div className="station-meta-block">
            <span className="station-label">ASSIGNED STATION</span>
            <strong>{staff.counter}</strong>
            <small>Dr. T. P. Ganesan Auditorium</small>
          </div>
          <div className="station-divider" />
          <div className="station-stat">
            <span className="station-stat-num">{gownsIssuedCount}</span>
            <span className="station-stat-label">Regalia Issued</span>
          </div>
          <div className="station-stat">
            <span className="station-stat-num">{gownsReturnedCount}</span>
            <span className="station-stat-label">Gowns Returned</span>
          </div>
          <div className="station-stat">
            <span className="station-stat-num">{admittedCount}</span>
            <span className="station-stat-label">Admitted at Gates</span>
          </div>
          <div className="station-status-pill">
            <span className="pulse-dot" /> Desk Active & Online
          </div>
        </section>

        {/* TAB 1: KIT & GOWN COUNTER */}
        {activeTab === 'counter' && (
          <div className="staff-counter-grid">
            {/* Student Search & Selection Column */}
            <aside className="panel staff-student-search-panel">
              <div className="panel-header">
                <div>
                  <p className="eyebrow">STUDENT LOOKUP</p>
                  <h3>Counter Queue</h3>
                </div>
                <span className="badge-count">{filteredRoster.length} students</span>
              </div>

              <div className="staff-search-input">
                <Icon name="search" size={17} />
                <input
                  type="text"
                  placeholder="Search by Reg ID, Roll No, Name…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button type="button" onClick={() => setSearchQuery('')} aria-label="Clear search">
                    <Icon name="x" size={14} />
                  </button>
                )}
              </div>

              <div className="staff-student-list">
                {filteredRoster.map((student) => {
                  const isSelected = student.id === selectedStudent.id
                  const doneCount =
                    (student.tagIssued ? 1 : 0) +
                    (student.gownReceived ? 1 : 0) +
                    (student.capIssued ? 1 : 0) +
                    (student.refreshmentReady ? 1 : 0) +
                    (student.kitIssued ? 1 : 0)
                  return (
                    <button
                      key={student.id}
                      type="button"
                      className={`staff-student-row ${isSelected ? 'active' : ''}`}
                      onClick={() => setSelectedStudentId(student.id)}
                    >
                      <div className="student-row-avatar">
                        {student.name.split(' ').map((p) => p[0]).join('').slice(0, 2)}
                      </div>
                      <div className="student-row-details">
                        <strong>{student.name}</strong>
                        <span>{student.registerNumber} · {student.block}-{student.seat}</span>
                      </div>
                      <div className="student-row-status">
                        <span className={`roster-pill ${doneCount === 5 ? 'success' : doneCount > 0 ? 'warning' : 'pending'}`}>
                          {doneCount === 5 ? 'All 5 Issued' : `${doneCount}/5 Issued`}
                        </span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </aside>

            {/* Active Student Regalia Clearance Management */}
            <section className="panel staff-clearance-panel">
              <div className="clearance-header-card">
                <div className="student-face-preview">
                  <img src={studentPhoto} alt={selectedStudent.name} />
                  <span className="face-verified-pill">
                    <Icon name="check" size={12} /> Verified
                  </span>
                </div>

                <div className="student-clearance-info">
                  <div className="student-title-row">
                    <h2>{selectedStudent.name}</h2>
                    <span className="student-reg-tag">{selectedStudent.registrationId}</span>
                  </div>
                  <p className="student-program">{selectedStudent.degree} · {selectedStudent.department}</p>

                  <div className="student-seat-chips">
                    <span className="seat-chip"><strong>BLOCK</strong> {selectedStudent.block}</span>
                    <span className="seat-chip"><strong>ROW</strong> {selectedStudent.row}</span>
                    <span className="seat-chip"><strong>SEAT</strong> {selectedStudent.seat}</span>
                    <span className="seat-chip"><strong>GATE</strong> {selectedStudent.gate}</span>
                    <span className="seat-chip success"><strong>FEE</strong> ₹100 {selectedStudent.paymentStatus}</span>
                  </div>
                </div>

                <div className="clearance-header-actions">
                  <button type="button" className="btn-issue-all" onClick={() => issueAllKit(selectedStudent.id)}>
                    <Icon name="check" size={16} />
                    <span>Issue All Items</span>
                  </button>
                  <button type="button" className="btn-reset-kit" onClick={() => resetStudentKit(selectedStudent.id)}>
                    <Icon name="x" size={14} />
                    <span>Reset</span>
                  </button>
                </div>
              </div>

              {/* Kit Items Checklist */}
              <div className="staff-kit-checklist">
                <div className="checklist-kicker">
                  <h4>Regalia & Kit Issuance Status ({completedStepsCount}/5 Completed)</h4>
                  <span className={`overall-status-pill ${completedStepsCount === 5 ? 'success' : 'pending'}`}>
                    {completedStepsCount === 5 ? 'Clearance Complete' : 'Pending Items'}
                  </span>
                </div>

                <div className="staff-checklist-grid">
                  {/* Item 1: Tag */}
                  <div className={`staff-kit-card ${selectedStudent.tagIssued ? 'issued' : 'pending'}`}>
                    <div className="kit-card-icon">
                      <Icon name={selectedStudent.tagIssued ? 'check' : 'x'} size={18} />
                    </div>
                    <div className="kit-card-content">
                      <div className="kit-card-top">
                        <strong>Tag issued</strong>
                        <span className={`kit-pill ${selectedStudent.tagIssued ? 'success' : 'pending'}`}>
                          {selectedStudent.tagIssued ? 'Issued' : 'Pending'}
                        </span>
                      </div>
                      <p>RFID entry badge #TAG-2026-10245 · Gate {selectedStudent.gate} clearance active</p>
                    </div>
                    <button
                      type="button"
                      className={`btn-toggle-step ${selectedStudent.tagIssued ? 'done' : ''}`}
                      onClick={() => updateStudentKit(selectedStudent.id, 'tagIssued', !selectedStudent.tagIssued)}
                    >
                      {selectedStudent.tagIssued ? 'Mark Pending' : 'Issue Tag'}
                    </button>
                  </div>

                  {/* Item 2: Gown */}
                  <div className={`staff-kit-card ${selectedStudent.gownReceived ? 'issued' : 'pending'}`}>
                    <div className="kit-card-icon">
                      <Icon name={selectedStudent.gownReceived ? 'check' : 'x'} size={18} />
                    </div>
                    <div className="kit-card-content">
                      <div className="kit-card-top">
                        <strong>Gown received</strong>
                        <span className={`kit-pill ${selectedStudent.gownReceived ? 'success' : 'pending'}`}>
                          {selectedStudent.gownReceived ? 'Received' : 'Pending'}
                        </span>
                      </div>
                      <p>Academic regalia robe (Size 40 / L) & Department discipline stole</p>
                    </div>
                    <button
                      type="button"
                      className={`btn-toggle-step ${selectedStudent.gownReceived ? 'done' : ''}`}
                      onClick={() => updateStudentKit(selectedStudent.id, 'gownReceived', !selectedStudent.gownReceived)}
                    >
                      {selectedStudent.gownReceived ? 'Mark Pending' : 'Issue Gown'}
                    </button>
                  </div>

                  {/* Item 3: Cap */}
                  <div className={`staff-kit-card ${selectedStudent.capIssued ? 'issued' : 'pending'}`}>
                    <div className="kit-card-icon">
                      <Icon name={selectedStudent.capIssued ? 'check' : 'x'} size={18} />
                    </div>
                    <div className="kit-card-content">
                      <div className="kit-card-top">
                        <strong>Graduation cap & mortarboard</strong>
                        <span className={`kit-pill ${selectedStudent.capIssued ? 'success' : 'pending'}`}>
                          {selectedStudent.capIssued ? 'Issued' : 'Pending'}
                        </span>
                      </div>
                      <p>Ceremonial mortarboard with 2026 graduation tassel</p>
                    </div>
                    <button
                      type="button"
                      className={`btn-toggle-step ${selectedStudent.capIssued ? 'done' : ''}`}
                      onClick={() => updateStudentKit(selectedStudent.id, 'capIssued', !selectedStudent.capIssued)}
                    >
                      {selectedStudent.capIssued ? 'Mark Pending' : 'Issue Cap'}
                    </button>
                  </div>

                  {/* Item 4: Refreshment */}
                  <div className={`staff-kit-card ${selectedStudent.refreshmentReady ? 'issued' : 'pending'}`}>
                    <div className="kit-card-icon">
                      <Icon name={selectedStudent.refreshmentReady ? 'check' : 'x'} size={18} />
                    </div>
                    <div className="kit-card-content">
                      <div className="kit-card-top">
                        <strong>Refreshment coupons</strong>
                        <span className={`kit-pill ${selectedStudent.refreshmentReady ? 'success' : 'pending'}`}>
                          {selectedStudent.refreshmentReady ? 'Ready' : 'Pending'}
                        </span>
                      </div>
                      <p>Student meal pack & guest high-tea passes · Food Court 02</p>
                    </div>
                    <button
                      type="button"
                      className={`btn-toggle-step ${selectedStudent.refreshmentReady ? 'done' : ''}`}
                      onClick={() => updateStudentKit(selectedStudent.id, 'refreshmentReady', !selectedStudent.refreshmentReady)}
                    >
                      {selectedStudent.refreshmentReady ? 'Mark Pending' : 'Issue Coupons'}
                    </button>
                  </div>

                  {/* Item 5: Ceremony Kit */}
                  <div className={`staff-kit-card ${selectedStudent.kitIssued ? 'issued' : 'pending'}`}>
                    <div className="kit-card-icon">
                      <Icon name={selectedStudent.kitIssued ? 'check' : 'x'} size={18} />
                    </div>
                    <div className="kit-card-content">
                      <div className="kit-card-top">
                        <strong>Ceremony kit & degree folder</strong>
                        <span className={`kit-pill ${selectedStudent.kitIssued ? 'success' : 'pending'}`}>
                          {selectedStudent.kitIssued ? 'Issued' : 'Pending'}
                        </span>
                      </div>
                      <p>Degree portfolio folder, ceremony proceedings guide & pledge card</p>
                    </div>
                    <button
                      type="button"
                      className={`btn-toggle-step ${selectedStudent.kitIssued ? 'done' : ''}`}
                      onClick={() => updateStudentKit(selectedStudent.id, 'kitIssued', !selectedStudent.kitIssued)}
                    >
                      {selectedStudent.kitIssued ? 'Mark Pending' : 'Issue Kit'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Gown Return Section */}
              <div className="staff-gown-return-card">
                <div className="gown-return-header">
                  <div>
                    <h4>Graduation Regalia Return Desk</h4>
                    <p>Collect academic gown by 04:00 PM at Counter 04 and issue security clearance acknowledgment.</p>
                  </div>
                  {selectedStudent.gownReturned ? (
                    <span className="gown-return-status-pill returned">
                      <Icon name="check" size={13} /> Returned at {selectedStudent.gownReturnTime || '03:15 PM'}
                    </span>
                  ) : (
                    <span className="gown-return-status-pill pending">
                      <Icon name="clock" size={13} /> Gown with Graduate
                    </span>
                  )}
                </div>

                <div className="gown-return-actions">
                  {!selectedStudent.gownReturned ? (
                    <button
                      type="button"
                      className="btn-return-gown"
                      onClick={() => recordGownReturn(selectedStudent.id)}
                    >
                      <Icon name="check" size={16} />
                      <span>Confirm Gown Return & Issue Clearance</span>
                    </button>
                  ) : (
                    <div className="return-confirmed-banner">
                      <Icon name="check" size={18} />
                      <div>
                        <strong>Gown Return Confirmed</strong>
                        <span>Deposit clearance slip generated. Certificate release authorized.</span>
                      </div>
                      <button
                        type="button"
                        className="btn-undo-return"
                        onClick={() => updateStudentKit(selectedStudent.id, 'gownReturned', false)}
                      >
                        Undo
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>
        )}

        {/* TAB 2: STUDENT LIST */}
        {activeTab === 'roster' && (
          <div className="staff-roster-view">
            <div className="panel roster-table-panel">
              <div className="roster-table-header">
                <div>
                  <p className="eyebrow">EVENT OPERATIONS</p>
                  <h3>Student List</h3>
                </div>
                <div className="roster-search">
                  <Icon name="search" size={16} />
                  <input
                    placeholder="Filter students by name, reg id, department…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="roster-table-wrapper">
                <table className="roster-table">
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Registration ID</th>
                      <th>Seating</th>
                      <th>Gate</th>
                      <th>Gown Return</th>
                      <th>Entry At</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRoster.map((student) => (
                        <tr key={student.id} className={student.id === selectedStudent.id ? 'highlighted' : ''}>
                          <td>
                            <div className="student-cell">
                              <div className="cell-avatar">{student.name[0]}</div>
                              <div>
                                <strong>{student.name}</strong>
                                <small>{student.registerNumber}</small>
                              </div>
                            </div>
                          </td>
                          <td><code>{student.registrationId}</code></td>
                          <td>{student.block}-{student.row}-{student.seat}</td>
                          <td><span className="gate-pill">{student.gate}</span></td>
                          <td>
                            <span className={`roster-pill ${student.gownReturned ? 'success' : 'pending'}`}>
                              {student.gownReturned ? 'Yes' : 'No'}
                            </span>
                          </td>
                          <td>
                            <span className={`roster-pill ${student.admittedAtGate ? 'success' : 'pending'}`}>
                              {student.admittedAtGate ? (student.admittedTime || '08:45 AM') : '—'}
                            </span>
                          </td>
                          <td>
                            <div className="row-action-btns">
                              <button
                                type="button"
                                className="table-btn"
                                onClick={() => {
                                  setSelectedStudentId(student.id)
                                  setActiveTab('counter')
                                }}
                              >
                                Manage Kit
                              </button>
                            </div>
                          </td>
                        </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SEATING LAYOUT */}
        {activeTab === 'seating' && (
          <div className="staff-seating-view">
            <div className="staff-seating-intro">
              <div><p className="eyebrow">AUDITORIUM ALLOCATION</p><h2>Student & Staff Seating Locator</h2><p>Select an attendee to highlight their exact block, row and seat.</p></div>
              <span><Icon name="location" size={16} /> Dr. T. P. Ganesan Auditorium</span>
            </div>
            <SeatingLayout allocations={seatingAllocations} selectedId={selectedStudentId} onSelect={setSelectedStudentId} showRoster />
          </div>
        )}

        {/* TAB 5: SPECIFIC NOTIFICATIONS */}
        {activeTab === 'notifications' && (
          <div className="staff-notifications-view">
            <section className="panel notification-composer">
              <div className="panel-header">
                <div><p className="eyebrow">STUDENT COMMUNICATION</p><h3>Send a specific notification</h3></div>
                <span className="notification-channel"><span /> Portal notification</span>
              </div>

              <div className="notification-form-grid">
                <label>
                  <span>Notification type</span>
                  <select value={notificationCategory} onChange={(event) => setNotificationCategory(event.target.value as NotificationCategory)}>
                    <option>Announcement</option>
                    <option>Alert</option>
                    <option>Reminder</option>
                  </select>
                </label>
                <label>
                  <span>Send to</span>
                  <select value={notificationAudience} onChange={(event) => setNotificationAudience(event.target.value)}>
                    <option>All Students</option>
                    <option>Block A Students</option>
                    <option>Computing Technologies</option>
                    {roster.map((student) => <option key={student.id}>{student.name} — {student.registerNumber}</option>)}
                  </select>
                </label>
                <label className="notification-form-full">
                  <span>Title</span>
                  <input value={notificationTitle} onChange={(event) => setNotificationTitle(event.target.value)} placeholder="Enter a clear notification title" />
                </label>
                <label className="notification-form-full">
                  <span>Message</span>
                  <textarea value={notificationMessage} onChange={(event) => setNotificationMessage(event.target.value)} placeholder="Write the announcement, alert or reminder for students…" rows={5} />
                </label>
              </div>

              <div className="notification-composer-actions">
                <label className="notification-important-toggle"><input type="checkbox" checked={notificationImportant} onChange={(event) => setNotificationImportant(event.target.checked)} /><span>Mark as important</span></label>
                <button type="button" className="notification-send-button" disabled={!notificationTitle.trim() || !notificationMessage.trim()} onClick={sendNotification}><Icon name="bell" size={16} /> Send notification</button>
              </div>
              {notificationSent && <div className="notification-sent-confirmation"><Icon name="check" size={17} /><span>Notification sent successfully to {notificationAudience}.</span></div>}
            </section>

            <section className="panel notification-history">
              <div className="panel-header"><div><p className="eyebrow">RECENT ACTIVITY</p><h3>Sent notifications</h3></div><span className="badge-count">{notifications.length} messages</span></div>
              <div className="notification-history-list">
                {notifications.map((notification) => (
                  <article key={notification.id}>
                    <span className={`notification-history-icon ${notification.category.toLowerCase()}`}><Icon name={notification.category === 'Reminder' ? 'clock' : notification.category === 'Alert' ? 'bell' : 'file'} size={17} /></span>
                    <div><div><strong>{notification.title}</strong><span>{notification.category}</span>{notification.important && <b>Important</b>}</div><p>{notification.message}</p><small>{notification.audience} · {notification.sentAt}</small></div>
                  </article>
                ))}
              </div>
            </section>
          </div>
        )}

        </div>
      </main>
    </div>
  )
}
