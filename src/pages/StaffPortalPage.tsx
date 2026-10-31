import { useState } from 'react'
import { Icon } from '../components/ui/Icon'
import { DEFAULT_STAFF, INITIAL_ROSTER, type StaffMember, type StudentRosterRecord } from '../config/staff'
import studentPhoto from '../assets/student-verification.png'
import { SeatingLayout, type SeatAllocation } from '../components/seating/SeatingLayout'
import { InstructionsPage } from './InstructionsPage'

interface StaffPortalPageProps {
  staff?: StaffMember
  onLogout: () => void
}

type StaffTab = 'counter' | 'roster' | 'seating' | 'instructions'

export function StaffPortalPage({ staff = DEFAULT_STAFF, onLogout }: StaffPortalPageProps) {
  const [activeTab, setActiveTab] = useState<StaffTab>('roster')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [roster, setRoster] = useState<StudentRosterRecord[]>(INITIAL_ROSTER)
  const [selectedStudentId, setSelectedStudentId] = useState<string>('student-1')
  const [drawerStudentId, setDrawerStudentId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [rosterPage, setRosterPage] = useState(1)
  const [rosterPageSize, setRosterPageSize] = useState(5)

  const staffInitials = staff.name
    .split(' ')
    .filter(Boolean)
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const STAFF_NAV_ITEMS = [
    { id: 'roster' as const, label: 'Student List', icon: 'user' as const },
    { id: 'seating' as const, label: 'Seating Layout', icon: 'grid' as const },
    { id: 'instructions' as const, label: 'Instructions', icon: 'file' as const },
  ]

  const TAB_TITLES: Record<StaffTab, string> = {
    counter: 'Kit & Gown Desk',
    roster: 'Student List',
    seating: 'Seating Layout',
    instructions: 'Instructions',
  }

  const selectedStudent = roster.find((s) => s.id === selectedStudentId) || roster[0]
  const drawerStudent = roster.find((s) => s.id === drawerStudentId)
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
      s.mobileNumber.toLowerCase().includes(q) ||
      s.personalEmail.toLowerCase().includes(q) ||
      s.officialEmail.toLowerCase().includes(q) ||
      s.program.toLowerCase().includes(q) ||
      s.department.toLowerCase().includes(q)
    )
  })

  const rosterPageCount = Math.max(1, Math.ceil(filteredRoster.length / rosterPageSize))
  const activeRosterPage = Math.min(rosterPage, rosterPageCount)
  const rosterPageStart = (activeRosterPage - 1) * rosterPageSize
  const paginatedRoster = filteredRoster.slice(rosterPageStart, rosterPageStart + rosterPageSize)
  const rosterPageEnd = Math.min(rosterPageStart + rosterPageSize, filteredRoster.length)

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
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''} ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="brand">
          <div className="brand-mark">
            <img src={import.meta.env.BASE_URL + 'campus-trust-logo.png'} alt="Campus Trust" />
          </div>
          <div className="brand-copy">
            <strong>Campus<span className="brand-highlight">Trust</span></strong>
            <small className="brand-subtitle">Staff Portal</small>
          </div>
        </div>

        <button
          type="button"
          className="sidebar-collapse-button"
          onClick={() => {
            setProfileOpen(false)
            setSidebarCollapsed((collapsed) => !collapsed)
          }}
          aria-label={sidebarCollapsed ? 'Expand navigation' : 'Collapse navigation'}
          title={sidebarCollapsed ? 'Expand navigation' : 'Collapse navigation'}
        >
          <Icon name="chevron" size={16} />
        </button>

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
              title={sidebarCollapsed ? item.label : undefined}
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
      <main className={`main-content staff-main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
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
                    onChange={(e) => {
                      setSearchQuery(e.target.value)
                      setRosterPage(1)
                    }}
                  />
                </div>
              </div>

              <div className="roster-table-wrapper">
                <table className="roster-table">
                  <thead>
                    <tr>
                      <th>S No.</th>
                      <th>Student Name</th>
                      <th>Register No.</th>
                      <th>Academic Year</th>
                      <th>Mobile No.</th>
                      <th>Personal Email</th>
                      <th>Official Email</th>
                      <th>Degree</th>
                      <th>Program</th>
                      <th>Graduation Type</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedRoster.map((student, index) => (
                        <tr key={student.id} className={student.id === selectedStudent.id ? 'highlighted' : ''}>
                          <td className="roster-serial">{rosterPageStart + index + 1}</td>
                          <td>
                            <div className="student-cell">
                              <div className="cell-avatar">{student.name[0]}</div>
                              <div>
                                <strong>{student.name}</strong>
                              </div>
                            </div>
                          </td>
                          <td><code>{student.registerNumber}</code></td>
                          <td>{student.academicYear}</td>
                          <td>{student.mobileNumber}</td>
                          <td>{student.personalEmail}</td>
                          <td>{student.officialEmail}</td>
                          <td>{student.degree}</td>
                          <td>{student.program}</td>
                          <td><span className="roster-pill success">{student.graduationType}</span></td>
                          <td>
                            <button
                              type="button"
                              className="roster-more-button"
                              aria-label={`View details for ${student.name}`}
                              title="View student details"
                              onClick={() => {
                                setSelectedStudentId(student.id)
                                setDrawerStudentId(student.id)
                              }}
                            ><span /><span /><span /></button>
                          </td>
                        </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="roster-pagination" aria-label="Student list pagination">
                <div className="roster-page-summary">
                  <span>
                    Showing {filteredRoster.length === 0 ? 0 : rosterPageStart + 1}–{rosterPageEnd} of {filteredRoster.length} students
                  </span>
                  <label>
                    Rows per page
                    <select
                      value={rosterPageSize}
                      onChange={(event) => {
                        setRosterPageSize(Number(event.target.value))
                        setRosterPage(1)
                      }}
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                    </select>
                  </label>
                </div>
                <div className="roster-page-controls">
                  <button
                    type="button"
                    aria-label="Previous page"
                    disabled={activeRosterPage === 1}
                    onClick={() => setRosterPage((page) => Math.max(1, page - 1))}
                  >
                    ‹
                  </button>
                  {Array.from({ length: rosterPageCount }, (_, index) => index + 1).map((page) => (
                    <button
                      type="button"
                      key={page}
                      className={page === activeRosterPage ? 'active' : ''}
                      aria-label={`Page ${page}`}
                      aria-current={page === activeRosterPage ? 'page' : undefined}
                      onClick={() => setRosterPage(page)}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    type="button"
                    aria-label="Next page"
                    disabled={activeRosterPage === rosterPageCount}
                    onClick={() => setRosterPage((page) => Math.min(rosterPageCount, page + 1))}
                  >
                    ›
                  </button>
                </div>
              </div>
            </div>

            {drawerStudent && (
              <div className="roster-drawer-layer">
                <button type="button" className="roster-drawer-backdrop" onClick={() => setDrawerStudentId(null)} aria-label="Close student details" />
                <aside className="roster-detail-drawer" role="dialog" aria-modal="true" aria-labelledby="roster-drawer-title">
                  <div className="roster-drawer-header">
                    <span className="roster-drawer-header-icon"><Icon name="cap" size={19} /></span>
                    <div>
                      <h2 id="roster-drawer-title">Student Record Details</h2>
                      <span>Registration: <strong>{drawerStudent.registerNumber}</strong></span>
                    </div>
                    <button type="button" onClick={() => setDrawerStudentId(null)} aria-label="Close student details"><Icon name="x" size={18} /></button>
                  </div>

                  <div className="roster-drawer-summary">
                    <div className="cell-avatar">{drawerStudent.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}</div>
                    <div>
                      <div className="roster-drawer-student-name"><strong>{drawerStudent.name}</strong><em>{drawerStudent.degree.startsWith('M') ? 'PG' : 'UG'}</em><b>{drawerStudent.degreeMode}</b></div>
                      <span>{drawerStudent.degree} — {drawerStudent.program}</span>
                      <small><Icon name="mail" size={13} /> {drawerStudent.officialEmail}</small>
                    </div>
                  </div>

                  <section className="roster-drawer-section">
                    <h3><Icon name="user" size={15} /> Academic & Personal Information</h3>
                    <dl>
                      <div><dt>Registration Number</dt><dd>{drawerStudent.registerNumber}</dd></div>
                      <div><dt>Program / Course</dt><dd>{drawerStudent.degree} — {drawerStudent.program}</dd></div>
                      <div><dt>Aadhaar No.</dt><dd>{drawerStudent.aadhaarNumber}</dd></div>
                      <div><dt>Mobile No.</dt><dd>{drawerStudent.mobileNumber}</dd></div>
                      <div><dt>Official Email</dt><dd>{drawerStudent.officialEmail}</dd></div>
                      <div><dt>Personal Email</dt><dd>{drawerStudent.personalEmail}</dd></div>
                      <div><dt>Degree</dt><dd>{drawerStudent.degree}</dd></div>
                      <div><dt>Program</dt><dd>{drawerStudent.program}</dd></div>
                      <div><dt>Graduation Type</dt><dd>{drawerStudent.graduationType}</dd></div>
                      <div><dt>Degree Mode</dt><dd>{drawerStudent.degreeMode}</dd></div>
                      <div><dt>Faculty Name</dt><dd>{drawerStudent.facultyName}</dd></div>
                    </dl>
                  </section>

                  <section className="roster-drawer-section">
                    <h3><Icon name="calendar" size={15} /> Convocation Information</h3>
                    <dl>
                      <div><dt>Convocation Name</dt><dd>{drawerStudent.convocationName}</dd></div>
                      <div><dt>Academic Year</dt><dd>{drawerStudent.academicYear}</dd></div>
                      <div><dt>Convocation Date</dt><dd>{drawerStudent.convocationDate}</dd></div>
                      <div><dt>Convocation Reg. No.</dt><dd>{drawerStudent.registrationId}</dd></div>
                      <div><dt>Venue Name</dt><dd>{drawerStudent.venueName}</dd></div>
                      <div className="drawer-detail-wide"><dt>Venue Address</dt><dd><Icon name="location" size={13} /> {drawerStudent.venueAddress}</dd></div>
                    </dl>
                  </section>

                  <section className="roster-drawer-section">
                    <h3><Icon name="ticket" size={15} /> Convocation Registration & Seating</h3>
                    <dl>
                      <div><dt>Degree Registered</dt><dd><span className={`drawer-status ${drawerStudent.registered ? 'yes' : 'no'}`}>{drawerStudent.registered ? 'Yes' : 'No'}</span></dd></div>
                      <div><dt>Convocation Registered</dt><dd><span className={`drawer-status ${drawerStudent.registered ? 'yes' : 'no'}`}>{drawerStudent.registered ? 'Yes' : 'No'}</span></dd></div>
                      <div><dt>Allocated Seat No.</dt><dd>{drawerStudent.block}-{drawerStudent.row}-{drawerStudent.seat}</dd></div>
                      <div><dt>Guest Count</dt><dd>{drawerStudent.guestCount}</dd></div>
                      <div><dt>Registered At</dt><dd>{drawerStudent.registeredAt || '—'}</dd></div>
                      <div><dt>Bundle ID</dt><dd>{drawerStudent.bundleId}</dd></div>
                    </dl>
                  </section>

                  <section className="roster-drawer-section">
                    <h3><Icon name="check" size={15} /> Event Fulfilment</h3>
                    <dl>
                      <div><dt>Gown Paid</dt><dd>{drawerStudent.paymentStatus === 'Paid' ? 'Yes' : 'No'}</dd></div>
                      <div><dt>Gown Paid At</dt><dd>{drawerStudent.gownPaidAt || '—'}</dd></div>
                      <div><dt>Tag Issued</dt><dd>{drawerStudent.tagIssued ? 'Yes' : 'No'}</dd></div>
                      <div><dt>Tag Issued At</dt><dd>{drawerStudent.tagIssuedAt || '—'}</dd></div>
                      <div><dt>Gown Received</dt><dd>{drawerStudent.gownReceived ? 'Yes' : 'No'}</dd></div>
                      <div><dt>Gown Received At</dt><dd>{drawerStudent.gownReceivedAt || '—'}</dd></div>
                      <div><dt>Gown Returned</dt><dd>{drawerStudent.gownReturned ? 'Yes' : 'No'}</dd></div>
                      <div><dt>Gown Returned At</dt><dd>{drawerStudent.gownReturnTime || '—'}</dd></div>
                      <div><dt>Refreshment Received</dt><dd>{drawerStudent.refreshmentReady ? 'Yes' : 'No'}</dd></div>
                      <div><dt>Refreshment Received At</dt><dd>{drawerStudent.refreshmentReceivedAt || '—'}</dd></div>
                      <div><dt>Tokens</dt><dd>{drawerStudent.tokens}</dd></div>
                    </dl>
                  </section>
                  <div className="roster-drawer-footer"><button type="button" onClick={() => setDrawerStudentId(null)}>Close</button></div>
                </aside>
              </div>
            )}
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

        {/* TAB 5: INSTRUCTIONS */}
        {activeTab === 'instructions' && (
          <div className="staff-instructions-view">
            <InstructionsPage />
          </div>
        )}

        </div>
      </main>
    </div>
  )
}
