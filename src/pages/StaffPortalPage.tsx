import { useState } from 'react'
import { Icon } from '../components/ui/Icon'
import { DEFAULT_STAFF, INITIAL_ROSTER, type StaffMember, type StudentRosterRecord } from '../config/staff'
import { DEFAULT_FACULTY } from '../config/faculty'
import { FACULTY_STAFF_ALLOCATIONS } from '../config/seating'
import type { FacultyMember } from '../types/faculty'
import studentPhoto from '../assets/student-verification.png'
import { SeatingLayout, type SeatAllocation } from '../components/seating/SeatingLayout'
import { StaffInstructionsPage } from './StaffInstructionsPage'

export type StaffTab = 'counter' | 'tokens' | 'auditorium-entry' | 'seating' | 'faculty-distribution' | 'roster' | 'instructions'

interface StaffPortalPageProps {
  staff?: StaffMember
  faculty?: FacultyMember
  initialTab?: StaffTab
  onLogout: () => void
  onSwitchToStudentView?: () => void
}

export function StaffPortalPage({
  staff = DEFAULT_STAFF,
  faculty = DEFAULT_FACULTY,
  initialTab = 'counter',
  onLogout,
  onSwitchToStudentView,
}: StaffPortalPageProps) {
  const [activeTab, setActiveTab] = useState<StaffTab>(initialTab)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [roster, setRoster] = useState<StudentRosterRecord[]>(INITIAL_ROSTER)
  const [selectedStudentId, setSelectedStudentId] = useState<string>('student-1')
  const [selectedSeatAllocationId, setSelectedSeatAllocationId] = useState<string>('student-1')
  const [drawerStudentId, setDrawerStudentId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [rosterPage, setRosterPage] = useState(1)
  const [rosterPageSize, setRosterPageSize] = useState(5)

  // Faculty Certificate Distribution State
  const [currentFaculty, setCurrentFaculty] = useState<FacultyMember>(faculty)
  const [isEditingFacultyProfile, setIsEditingFacultyProfile] = useState(false)
  const [facultySearchQuery, setFacultySearchQuery] = useState('')
  const [facultyFilterStatus, setFacultyFilterStatus] = useState<'all' | 'pending' | 'distributed'>('all')
  const [facultySuccessToast, setFacultySuccessToast] = useState('')

  const staffInitials = staff.name
    .split(' ')
    .filter(Boolean)
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const STAFF_NAV_ITEMS = [
    { id: 'instructions' as const, label: 'Instructions', icon: 'file' as const },
    { id: 'roster' as const, label: 'Graduate List', icon: 'user' as const },
    { id: 'counter' as const, label: 'In-Person Check & Kit Desk', icon: 'tag' as const },
    { id: 'seating' as const, label: 'Seating & Faculty Allocation', icon: 'grid' as const },
  ]

  const TAB_TITLES: Record<StaffTab, string> = {
    counter: 'In-Person Check & Graduation Kit',
    tokens: 'Breakfast & Lunch Token Validation',
    'auditorium-entry': 'Auditorium Face Recognition Entry',
    seating: 'Seating & Faculty Allocation',
    'faculty-distribution': 'Degree Certificate Distribution',
    roster: 'COE-Approved Graduate List',
    instructions: 'Staff Instructions',
  }

  // Filter students assigned to this faculty member (by faculty ID, name, or assigned rows)
  const assignedStudents = roster.filter((student) => {
    return (
      student.assignedFacultyId === currentFaculty.id ||
      student.facultyName.toLowerCase().includes(currentFaculty.name.toLowerCase()) ||
      currentFaculty.assignedRows.includes(student.row)
    )
  })

  const displayedFacultyStudents = assignedStudents.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(facultySearchQuery.toLowerCase()) ||
      student.registerNumber.toLowerCase().includes(facultySearchQuery.toLowerCase()) ||
      `${student.row}-${student.seat}`.toLowerCase().includes(facultySearchQuery.toLowerCase()) ||
      student.program.toLowerCase().includes(facultySearchQuery.toLowerCase())

    if (!matchesSearch) return false

    if (facultyFilterStatus === 'pending') return !student.degreeDistributed
    if (facultyFilterStatus === 'distributed') return Boolean(student.degreeDistributed)
    return true
  })

  const distributedCount = assignedStudents.filter((s) => s.degreeDistributed).length
  const pendingCount = assignedStudents.length - distributedCount

  const handleFacultyDistribute = (studentId: string) => {
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    setRoster((prev) =>
      prev.map((s) =>
        s.id === studentId
          ? {
              ...s,
              degreeDistributed: true,
              degreeDistributedAt: nowTime,
              photoSessionCompleted: false, // Proceed to next milestone: photo session
            }
          : s,
      ),
    )
    const st = assignedStudents.find((s) => s.id === studentId)
    setFacultySuccessToast(
      `Degree Certificate successfully handed over to ${st?.name || 'graduate'} (Seat ${st?.row}-${st?.seat})! Student can proceed to Photo Session.`,
    )
    window.setTimeout(() => setFacultySuccessToast(''), 4000)
  }

  const handleSaveFacultyProfile = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsEditingFacultyProfile(false)
    setFacultySuccessToast('Faculty registration profile updated successfully.')
    window.setTimeout(() => setFacultySuccessToast(''), 3000)
  }

  const selectedStudent = roster.find((s) => s.id === selectedStudentId) || roster[0]
  const drawerStudent = roster.find((s) => s.id === drawerStudentId)
  const seatingAllocations: SeatAllocation[] = [...roster.map((student) => ({
    id: student.id,
    name: student.name,
    registerNumber: student.registerNumber,
    block: student.block,
    row: student.row,
    seat: student.seat,
    type: 'student',
    department: student.department,
    role: student.degree ? `${student.degree} Graduate` : 'Graduate attendee',
    email: student.officialEmail || student.personalEmail,
  } as SeatAllocation)), ...FACULTY_STAFF_ALLOCATIONS]

  const updateTimedStep = (
    studentId: string,
    field: keyof StudentRosterRecord,
    value: boolean,
    timeField?: keyof StudentRosterRecord,
  ) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    setRoster((prev) => prev.map((student) => (
      student.id === studentId
        ? { ...student, [field]: value, ...(timeField ? { [timeField]: value ? time : undefined } : {}) }
        : student
    )))
  }

  const recordAttendance = (studentId: string, value: boolean) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    setRoster((prev) => prev.map((student) => student.id === studentId ? {
      ...student,
      attendanceRecorded: value,
      faceVerifiedAtCheckin: value,
      checkinTime: value ? time : undefined,
      tagIssued: value,
    } : student))
  }

  const issueAllKit = (studentId: string) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    setRoster((prev) =>
      prev.map((s) =>
        s.id === studentId
          ? {
              ...s,
              attendanceRecorded: true,
              faceVerifiedAtCheckin: true,
              checkinTime: s.checkinTime || time,
              gownIssued: true,
              robeIssued: true,
              breakfastTokenIssued: true,
              lunchTokenIssued: true,
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
              attendanceRecorded: false,
              faceVerifiedAtCheckin: false,
              checkinTime: undefined,
              gownIssued: false,
              robeIssued: false,
              breakfastTokenIssued: false,
              lunchTokenIssued: false,
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

  const handleAuditoriumAdmission = (studentId: string) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    setRoster((prev) => prev.map((student) => student.id === studentId ? {
      ...student,
      auditoriumFaceVerified: true,
      admittedAtGate: true,
      auditoriumEntryTime: time,
      admittedTime: time,
    } : student))
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
    (selectedStudent.attendanceRecorded ? 1 : 0) +
    (selectedStudent.gownIssued ? 1 : 0) +
    (selectedStudent.robeIssued ? 1 : 0) +
    (selectedStudent.breakfastTokenIssued ? 1 : 0) +
    (selectedStudent.lunchTokenIssued ? 1 : 0)
  const selectedKitComplete = completedStepsCount === 5
  const eventAccessStepsCount =
    (selectedStudent.breakfastTokenRedeemed ? 1 : 0) +
    (selectedStudent.lunchTokenRedeemed ? 1 : 0) +
    (selectedStudent.admittedAtGate ? 1 : 0)

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
            <small className="brand-subtitle">Faculty & Staff Desk</small>
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
          <small>{staff.name} · {currentFaculty.name.split(' ').slice(0, 2).join(' ')}</small>
        </div>

        <nav className="main-nav" aria-label="Staff navigation">
          {STAFF_NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={item.id === 'counter'
                ? (['counter', 'tokens', 'auditorium-entry'] as StaffTab[]).includes(activeTab) ? 'active' : ''
                : activeTab === item.id ? 'active' : ''}
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
            <div className="profile-popup" role="dialog" aria-label="Operations profile">
              <div className="profile-popup-heading">
                <span>Operations Desk Profile</span>
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
                  <span>{staff.employeeId} · Operations Staff</span>
                </div>
              </div>
              <div className="profile-popup-detail">
                <span>Assigned Station</span>
                <strong>{staff.counter}</strong>
              </div>
              <div className="profile-popup-detail">
                <span>Faculty Representative</span>
                <strong>{currentFaculty.name} ({currentFaculty.assignedRows.join(', ')})</strong>
              </div>
              <div className="profile-popup-detail">
                <span>Department</span>
                <strong>{currentFaculty.department}</strong>
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
            {onSwitchToStudentView && (
              <button
                type="button"
                className="role-switch-btn"
                onClick={onSwitchToStudentView}
                title="Switch to student portal view"
              >
                <Icon name="cap" size={15} /> View Student Pass
              </button>
            )}
            <button
              type="button"
              className="staff-topbar-signout-btn"
              onClick={onLogout}
              title="Sign out of operations desk"
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
                    (student.attendanceRecorded ? 1 : 0) +
                    (student.gownIssued ? 1 : 0) +
                    (student.robeIssued ? 1 : 0) +
                    (student.breakfastTokenIssued ? 1 : 0) +
                    (student.lunchTokenIssued ? 1 : 0)
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
                    <span className="seat-chip success"><strong>COE</strong> Approved Presentee</span>
                  </div>
                </div>

                <div className="clearance-header-actions">
                  <button type="button" className="btn-issue-all" onClick={() => issueAllKit(selectedStudent.id)}>
                    <Icon name="check" size={16} />
                    <span>Issue All Items</span>
                  </button>
                  <button
                    type="button"
                    className="btn-go-seat"
                    onClick={() => {
                      setSelectedSeatAllocationId(selectedStudent.id)
                      setActiveTab('seating')
                      setSidebarOpen(false)
                      window.scrollTo({ top: 0, behavior: 'smooth' })
                    }}
                  >
                    <Icon name="location" size={15} />
                    <span>Go to Seat</span>
                  </button>
                  <button type="button" className="btn-reset-kit" onClick={() => resetStudentKit(selectedStudent.id)}>
                    <Icon name="x" size={14} />
                    <span>Reset</span>
                  </button>
                </div>
              </div>

              {/* Graduation Day Step 8: In-person check and graduation kit */}
              <div className="staff-kit-checklist">
                <div className="checklist-kicker">
                  <h4>Attendance & Graduation Kit Status ({completedStepsCount}/5 Completed)</h4>
                  <span className={`overall-status-pill ${completedStepsCount === 5 ? 'success' : 'pending'}`}>
                    {completedStepsCount === 5 ? 'Clearance Complete' : 'Pending Items'}
                  </span>
                </div>

                <div className="staff-checklist-grid">
                  {/* Item 1: In-Person Check & Face ID */}
                  <div className={`staff-kit-card ${selectedStudent.attendanceRecorded ? 'issued' : 'pending'}`}>
                    <div className="kit-card-icon">
                      <Icon name={selectedStudent.attendanceRecorded ? 'check' : 'shield'} size={18} />
                    </div>
                    <div className="kit-card-content">
                      <div className="kit-card-top">
                        <strong>In-Person Face ID & Attendance</strong>
                        <span className={`kit-pill ${selectedStudent.attendanceRecorded ? 'success' : 'pending'}`}>
                          {selectedStudent.attendanceRecorded ? `Recorded ${selectedStudent.checkinTime || ''}` : 'Pending Arrival'}
                        </span>
                      </div>
                      <p>Campus entrance facial recognition check · No paper registration needed</p>
                    </div>
                    <button
                      type="button"
                      className={`btn-toggle-step ${selectedStudent.attendanceRecorded ? 'done' : ''}`}
                      onClick={() => recordAttendance(selectedStudent.id, !selectedStudent.attendanceRecorded)}
                    >
                      {selectedStudent.attendanceRecorded ? 'Undo Check-in' : 'Scan Face & Record'}
                    </button>
                  </div>

                  {/* Item 2: Gown */}
                  <div className={`staff-kit-card ${selectedStudent.gownIssued ? 'issued' : 'pending'}`}>
                    <div className="kit-card-icon">
                      <Icon name={selectedStudent.gownIssued ? 'check' : 'cap'} size={18} />
                    </div>
                    <div className="kit-card-content">
                      <div className="kit-card-top">
                        <strong>Academic Gown</strong>
                        <span className={`kit-pill ${selectedStudent.gownIssued ? 'success' : 'pending'}`}>
                          {selectedStudent.gownIssued ? 'Gown Issued' : 'Pending'}
                        </span>
                      </div>
                      <p>Academic regalia gown (Size 40 / L) for ceremony procession</p>
                    </div>
                    <button
                      type="button"
                      className={`btn-toggle-step ${selectedStudent.gownIssued ? 'done' : ''}`}
                      onClick={() => updateTimedStep(selectedStudent.id, 'gownIssued', !selectedStudent.gownIssued, 'gownReceivedAt')}
                    >
                      {selectedStudent.gownIssued ? 'Mark Pending' : 'Issue Gown'}
                    </button>
                  </div>

                  {/* Item 3: Robe */}
                  <div className={`staff-kit-card ${selectedStudent.robeIssued ? 'issued' : 'pending'}`}>
                    <div className="kit-card-icon">
                      <Icon name={selectedStudent.robeIssued ? 'check' : 'award'} size={18} />
                    </div>
                    <div className="kit-card-content">
                      <div className="kit-card-top">
                        <strong>Ceremony Robe & Stole</strong>
                        <span className={`kit-pill ${selectedStudent.robeIssued ? 'success' : 'pending'}`}>
                          {selectedStudent.robeIssued ? 'Robe Issued' : 'Pending'}
                        </span>
                      </div>
                      <p>{selectedStudent.department} discipline stole & ceremonial hood</p>
                    </div>
                    <button
                      type="button"
                      className={`btn-toggle-step ${selectedStudent.robeIssued ? 'done' : ''}`}
                      onClick={() => updateTimedStep(selectedStudent.id, 'robeIssued', !selectedStudent.robeIssued)}
                    >
                      {selectedStudent.robeIssued ? 'Mark Pending' : 'Issue Robe'}
                    </button>
                  </div>

                  {/* Item 4: Breakfast Token */}
                  <div className={`staff-kit-card ${selectedStudent.breakfastTokenIssued ? 'issued' : 'pending'}`}>
                    <div className="kit-card-icon">
                      <Icon name={selectedStudent.breakfastTokenIssued ? 'check' : 'clock'} size={18} />
                    </div>
                    <div className="kit-card-content">
                      <div className="kit-card-top">
                        <strong>Breakfast Token</strong>
                        <span className={`kit-pill ${selectedStudent.breakfastTokenIssued ? 'success' : 'pending'}`}>
                          {selectedStudent.breakfastTokenIssued ? 'Token Issued' : 'Pending'}
                        </span>
                      </div>
                      <p>Token #BF-10245 · Valid for student & guests at Food Court 02</p>
                    </div>
                    <button
                      type="button"
                      className={`btn-toggle-step ${selectedStudent.breakfastTokenIssued ? 'done' : ''}`}
                      onClick={() => updateTimedStep(selectedStudent.id, 'breakfastTokenIssued', !selectedStudent.breakfastTokenIssued)}
                    >
                      {selectedStudent.breakfastTokenIssued ? 'Mark Pending' : 'Issue Breakfast Token'}
                    </button>
                  </div>

                  {/* Item 5: Lunch Token */}
                  <div className={`staff-kit-card ${selectedStudent.lunchTokenIssued ? 'issued' : 'pending'}`}>
                    <div className="kit-card-icon">
                      <Icon name={selectedStudent.lunchTokenIssued ? 'check' : 'ticket'} size={18} />
                    </div>
                    <div className="kit-card-content">
                      <div className="kit-card-top">
                        <strong>Lunch Token</strong>
                        <span className={`kit-pill ${selectedStudent.lunchTokenIssued ? 'success' : 'pending'}`}>
                          {selectedStudent.lunchTokenIssued ? 'Token Issued' : 'Pending'}
                        </span>
                      </div>
                      <p>Token #LN-10245 · Valid post-ceremony & photo session at Food Court 02</p>
                    </div>
                    <button
                      type="button"
                      className={`btn-toggle-step ${selectedStudent.lunchTokenIssued ? 'done' : ''}`}
                      onClick={() => updateTimedStep(selectedStudent.id, 'lunchTokenIssued', !selectedStudent.lunchTokenIssued)}
                    >
                      {selectedStudent.lunchTokenIssued ? 'Mark Pending' : 'Issue Lunch Token'}
                    </button>
                  </div>

                  {/* Degree Certificate Status */}
                  <div className={`staff-kit-card ${selectedStudent.degreeDistributed ? 'issued' : 'pending'}`}>
                    <div className="kit-card-icon">
                      <Icon name={selectedStudent.degreeDistributed ? 'check' : 'award'} size={18} />
                    </div>
                    <div className="kit-card-content">
                      <div className="kit-card-top">
                        <strong>Degree Certificate</strong>
                        <span className={`kit-pill ${selectedStudent.degreeDistributed ? 'success' : 'pending'}`}>
                          {selectedStudent.degreeDistributed
                            ? `Handed Over ${selectedStudent.degreeDistributedAt || ''}`
                            : 'Pending Handover'}
                        </span>
                      </div>
                      <p>Degree certificate distribution status for the selected graduate</p>
                    </div>
                    <button
                      type="button"
                      className={`btn-toggle-step ${selectedStudent.degreeDistributed ? 'done' : ''}`}
                      onClick={() => updateTimedStep(
                        selectedStudent.id,
                        'degreeDistributed',
                        !selectedStudent.degreeDistributed,
                        'degreeDistributedAt',
                      )}
                    >
                      {selectedStudent.degreeDistributed ? 'Mark Pending' : 'Confirm Handover'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="staff-kit-checklist integrated-desk-actions">
                <div className="checklist-kicker">
                  <h4>Token Validation & Auditorium Entry ({eventAccessStepsCount}/3 Completed)</h4>
                  <span className={`overall-status-pill ${eventAccessStepsCount === 3 ? 'success' : 'pending'}`}>
                    {eventAccessStepsCount === 3 ? 'Event Access Complete' : 'Pending Actions'}
                  </span>
                </div>

                <div className="staff-checklist-grid">
                  <div className={`staff-kit-card ${selectedStudent.breakfastTokenRedeemed ? 'issued' : 'pending'}`}>
                    <div className="kit-card-icon"><Icon name={selectedStudent.breakfastTokenRedeemed ? 'check' : 'ticket'} size={18} /></div>
                    <div className="kit-card-content">
                      <div className="kit-card-top">
                        <strong>Breakfast Token Validation</strong>
                        <span className={`kit-pill ${selectedStudent.breakfastTokenRedeemed ? 'success' : 'pending'}`}>
                          {selectedStudent.breakfastTokenRedeemed
                            ? `Served ${selectedStudent.breakfastTime || ''}`
                            : selectedStudent.breakfastTokenIssued ? 'Ready to Redeem' : 'Token Not Issued'}
                        </span>
                      </div>
                      <p>Validate the issued breakfast token before serving the graduate.</p>
                    </div>
                    <button
                      type="button"
                      className={`btn-toggle-step ${selectedStudent.breakfastTokenRedeemed ? 'done' : ''}`}
                      disabled={!selectedStudent.breakfastTokenIssued}
                      onClick={() => updateTimedStep(selectedStudent.id, 'breakfastTokenRedeemed', !selectedStudent.breakfastTokenRedeemed, 'breakfastTime')}
                    >
                      {selectedStudent.breakfastTokenRedeemed ? 'Undo' : 'Redeem Breakfast'}
                    </button>
                  </div>

                  <div className={`staff-kit-card ${selectedStudent.lunchTokenRedeemed ? 'issued' : 'pending'}`}>
                    <div className="kit-card-icon"><Icon name={selectedStudent.lunchTokenRedeemed ? 'check' : 'ticket'} size={18} /></div>
                    <div className="kit-card-content">
                      <div className="kit-card-top">
                        <strong>Lunch Token Validation</strong>
                        <span className={`kit-pill ${selectedStudent.lunchTokenRedeemed ? 'success' : 'pending'}`}>
                          {selectedStudent.lunchTokenRedeemed
                            ? `Served ${selectedStudent.lunchTime || ''}`
                            : selectedStudent.degreeDistributed ? 'Ready After Photo' : 'Awaiting Certificate'}
                        </span>
                      </div>
                      <p>Confirm the certificate and photo-session milestone before serving lunch.</p>
                    </div>
                    <button
                      type="button"
                      className={`btn-toggle-step ${selectedStudent.lunchTokenRedeemed ? 'done' : ''}`}
                      disabled={!selectedStudent.lunchTokenIssued || !selectedStudent.degreeDistributed}
                      onClick={() => {
                        updateTimedStep(selectedStudent.id, 'lunchTokenRedeemed', !selectedStudent.lunchTokenRedeemed, 'lunchTime')
                        if (!selectedStudent.lunchTokenRedeemed) updateTimedStep(selectedStudent.id, 'photoSessionCompleted', true, 'photoSessionAt')
                      }}
                    >
                      {selectedStudent.lunchTokenRedeemed ? 'Undo' : 'Confirm Photo & Redeem'}
                    </button>
                  </div>

                  <div className={`staff-kit-card ${selectedStudent.admittedAtGate ? 'issued' : 'pending'}`}>
                    <div className="kit-card-icon"><Icon name={selectedStudent.admittedAtGate ? 'check' : 'shield'} size={18} /></div>
                    <div className="kit-card-content">
                      <div className="kit-card-top">
                        <strong>Auditorium Entry</strong>
                        <span className={`kit-pill ${selectedStudent.admittedAtGate ? 'success' : 'pending'}`}>
                          {selectedStudent.admittedAtGate
                            ? `Admitted ${selectedStudent.auditoriumEntryTime || selectedStudent.admittedTime || ''}`
                            : selectedKitComplete ? 'Ready for Face Scan' : 'Complete Kit First'}
                        </span>
                      </div>
                      <p>Run the second face-recognition check before auditorium admission.</p>
                    </div>
                    <button
                      type="button"
                      className={`btn-toggle-step ${selectedStudent.admittedAtGate ? 'done' : ''}`}
                      disabled={!selectedKitComplete || selectedStudent.admittedAtGate}
                      onClick={() => handleAuditoriumAdmission(selectedStudent.id)}
                    >
                      {selectedStudent.admittedAtGate ? 'Admitted' : 'Scan Face & Admit'}
                    </button>
                  </div>
                </div>
              </div>

            </section>
          </div>
        )}

        {/* STEP 9 & 14: BREAKFAST AND LUNCH TOKEN VALIDATION */}
        {activeTab === 'tokens' && (
          <div className="staff-operation-page">
            <section className="panel staff-operation-summary">
              <div>
                <p className="eyebrow">GRADUATION DAY STEPS 9 & 14</p>
                <h2>Breakfast and lunch token validation</h2>
                <p>Redeem breakfast tokens before the ceremony and lunch tokens after degree distribution and the photo session.</p>
              </div>
              <div className="operation-metrics">
                <span><strong>{roster.filter((student) => student.breakfastTokenRedeemed).length}</strong> Breakfast served</span>
                <span><strong>{roster.filter((student) => student.lunchTokenRedeemed).length}</strong> Lunch served</span>
              </div>
            </section>

            <section className="panel operation-roster-panel">
              <div className="operation-toolbar">
                <div className="staff-search-input">
                  <Icon name="search" size={17} />
                  <input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search graduate name or register number…" />
                </div>
                <span>{filteredRoster.length} graduates</span>
              </div>
              <div className="operation-card-list">
                {filteredRoster.map((student) => (
                  <article className="operation-graduate-card" key={student.id}>
                    <img src={studentPhoto} alt="" />
                    <div className="operation-graduate-identity">
                      <strong>{student.name}</strong>
                      <span>{student.registerNumber} · Seat {student.row}-{student.seat}</span>
                    </div>
                    <div className="token-operation">
                      <span className={`operation-status ${student.breakfastTokenRedeemed ? 'complete' : student.breakfastTokenIssued ? 'ready' : 'blocked'}`}>
                        Breakfast: {student.breakfastTokenRedeemed ? `Served ${student.breakfastTime || ''}` : student.breakfastTokenIssued ? 'Token ready' : 'Token not issued'}
                      </span>
                      <button
                        type="button"
                        disabled={!student.breakfastTokenIssued}
                        onClick={() => updateTimedStep(student.id, 'breakfastTokenRedeemed', !student.breakfastTokenRedeemed, 'breakfastTime')}
                      >
                        {student.breakfastTokenRedeemed ? 'Undo' : 'Redeem breakfast'}
                      </button>
                    </div>
                    <div className="token-operation">
                      <span className={`operation-status ${student.lunchTokenRedeemed ? 'complete' : student.degreeDistributed && student.lunchTokenIssued ? 'ready' : 'blocked'}`}>
                        Lunch: {student.lunchTokenRedeemed ? `Served ${student.lunchTime || ''}` : student.degreeDistributed ? 'Ready after photo' : 'Awaiting certificate'}
                      </span>
                      <button
                        type="button"
                        disabled={!student.lunchTokenIssued || !student.degreeDistributed}
                        onClick={() => {
                          updateTimedStep(student.id, 'lunchTokenRedeemed', !student.lunchTokenRedeemed, 'lunchTime')
                          if (!student.lunchTokenRedeemed) updateTimedStep(student.id, 'photoSessionCompleted', true, 'photoSessionAt')
                        }}
                      >
                        {student.lunchTokenRedeemed ? 'Undo' : 'Confirm photo & redeem'}
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* STEP 10: AUDITORIUM FACE RECOGNITION ENTRY */}
        {activeTab === 'auditorium-entry' && (
          <div className="staff-operation-page">
            <section className="panel staff-operation-summary auditorium-summary">
              <div>
                <p className="eyebrow">GRADUATION DAY STEP 10</p>
                <h2>Auditorium face-recognition entry</h2>
                <p>Run the second recognition check and admit only graduates who completed attendance and graduation-kit collection.</p>
              </div>
              <div className="operation-metrics">
                <span><strong>{roster.filter((student) => student.admittedAtGate).length}</strong> Admitted</span>
                <span><strong>{roster.filter((student) => !student.admittedAtGate).length}</strong> Awaiting entry</span>
              </div>
            </section>

            <section className="panel operation-roster-panel">
              <div className="operation-toolbar">
                <div className="staff-search-input">
                  <Icon name="search" size={17} />
                  <input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search graduate name, register number or gate…" />
                </div>
                <span>{staff.gate} scanner online</span>
              </div>
              <div className="auditorium-entry-grid">
                {filteredRoster.map((student) => {
                  const kitComplete = Boolean(student.attendanceRecorded && student.gownIssued && student.robeIssued && student.breakfastTokenIssued && student.lunchTokenIssued)
                  return (
                    <article className={`auditorium-entry-card ${student.admittedAtGate ? 'admitted' : ''}`} key={student.id}>
                      <div className="auditorium-student-photo">
                        <img src={studentPhoto} alt={student.name} />
                        {student.auditoriumFaceVerified && <span><Icon name="check" size={13} /></span>}
                      </div>
                      <div className="auditorium-student-info">
                        <div><strong>{student.name}</strong><span>{student.registerNumber}</span></div>
                        <p>{student.gate} · {student.block} Block · Row {student.row} · Seat {student.seat}</p>
                        <div className="entry-prerequisites">
                          <span className={student.attendanceRecorded ? 'done' : ''}><Icon name={student.attendanceRecorded ? 'check' : 'clock'} size={12} /> Attendance</span>
                          <span className={kitComplete ? 'done' : ''}><Icon name={kitComplete ? 'check' : 'clock'} size={12} /> Kit issued</span>
                        </div>
                      </div>
                      <div className="auditorium-entry-action">
                        {student.admittedAtGate ? (
                          <span className="admitted-badge"><Icon name="check" size={14} /> Admitted {student.auditoriumEntryTime || student.admittedTime}</span>
                        ) : (
                          <button type="button" disabled={!kitComplete} onClick={() => handleAuditoriumAdmission(student.id)}>
                            <Icon name="camera" size={15} /> {kitComplete ? 'Scan face & admit' : 'Complete kit first'}
                          </button>
                        )}
                      </div>
                    </article>
                  )
                })}
              </div>
            </section>
          </div>
        )}

        {/* STEP 12: FACULTY DEGREE CERTIFICATE DISTRIBUTION */}
        {activeTab === 'faculty-distribution' && (
          <div className="faculty-portal-page" style={{ padding: 0, margin: 0, maxWidth: 'none' }}>
            {/* Faculty Hero Banner */}
            <section className="faculty-hero-banner panel">
              <div className="faculty-profile-summary">
                <div className="faculty-avatar">
                  {currentFaculty.name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="faculty-status-badges">
                    <span className="badge-approved">
                      <Icon name="check" size={13} /> {currentFaculty.status}
                    </span>
                    <span className="badge-role">Degree Distribution Faculty</span>
                  </div>
                  <h1>{currentFaculty.name}</h1>
                  <p className="faculty-designation">
                    {currentFaculty.designation} · {currentFaculty.department}
                  </p>
                  <div className="faculty-contact-row">
                    <span><Icon name="shield" size={14} /> ID: <strong>{currentFaculty.employeeId}</strong></span>
                    <span><Icon name="mail" size={14} /> {currentFaculty.email}</span>
                    <span><Icon name="phone" size={14} /> {currentFaculty.mobile}</span>
                  </div>
                </div>
              </div>

              <div className="faculty-header-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setIsEditingFacultyProfile((prev) => !prev)}
                >
                  <Icon name="user" size={15} /> {isEditingFacultyProfile ? 'Cancel Edit' : 'Edit Faculty Details'}
                </button>
              </div>
            </section>

            {/* Profile Edit Panel */}
            {isEditingFacultyProfile && (
              <section className="panel faculty-edit-card">
                <header className="kit-card-header">
                  <div className="kit-header-info">
                    <span className="eyebrow">UPDATE FACULTY REGISTRATION</span>
                    <h3>Faculty Member Information</h3>
                  </div>
                </header>

                <form className="faculty-edit-form" onSubmit={handleSaveFacultyProfile}>
                  <div className="faculty-form-grid">
                    <label>
                      <span>Full Name</span>
                      <input
                        value={currentFaculty.name}
                        onChange={(e) => setCurrentFaculty({ ...currentFaculty, name: e.target.value })}
                        required
                      />
                    </label>
                    <label>
                      <span>Designation</span>
                      <input
                        value={currentFaculty.designation}
                        onChange={(e) => setCurrentFaculty({ ...currentFaculty, designation: e.target.value })}
                        required
                      />
                    </label>
                    <label>
                      <span>Department</span>
                      <input
                        value={currentFaculty.department}
                        onChange={(e) => setCurrentFaculty({ ...currentFaculty, department: e.target.value })}
                        required
                      />
                    </label>
                    <label>
                      <span>Employee ID</span>
                      <input
                        value={currentFaculty.employeeId}
                        onChange={(e) => setCurrentFaculty({ ...currentFaculty, employeeId: e.target.value })}
                        required
                      />
                    </label>
                    <label>
                      <span>Official Email</span>
                      <input
                        type="email"
                        value={currentFaculty.email}
                        onChange={(e) => setCurrentFaculty({ ...currentFaculty, email: e.target.value })}
                        required
                      />
                    </label>
                    <label>
                      <span>Mobile Number</span>
                      <input
                        value={currentFaculty.mobile}
                        onChange={(e) => setCurrentFaculty({ ...currentFaculty, mobile: e.target.value })}
                        required
                      />
                    </label>
                    <label className="span-full">
                      <span>Assigned Auditorium Rows (comma-separated)</span>
                      <input
                        value={currentFaculty.assignedRows.join(', ')}
                        onChange={(e) =>
                          setCurrentFaculty({
                            ...currentFaculty,
                            assignedRows: e.target.value
                              .split(',')
                              .map((r) => r.trim().toUpperCase())
                              .filter(Boolean),
                          })
                        }
                        placeholder="e.g. A, E"
                        required
                      />
                    </label>
                  </div>
                  <div className="faculty-form-actions">
                    <button type="submit" className="flow-primary">
                      Save Registration Details
                    </button>
                  </div>
                </form>
              </section>
            )}

            {/* Toast notification */}
            {facultySuccessToast && (
              <div className="faculty-toast" role="status">
                <Icon name="check" size={18} />
                <span>{facultySuccessToast}</span>
              </div>
            )}

            {/* Assigned Rows Summary */}
            <section className="faculty-assignment-bar panel">
              <div className="assignment-lead">
                <div className="assignment-icon">
                  <Icon name="grid" size={24} />
                </div>
                <div>
                  <span className="eyebrow">AUDITORIUM RESPONSIBILITY</span>
                  <h3>Assigned Rows: {currentFaculty.assignedRows.join(', ')} · Front Block</h3>
                  <p>You are responsible for degree certificate distribution to graduates seated in these rows.</p>
                </div>
              </div>

              <div className="assignment-metrics">
                <div className="metric-box">
                  <span>TOTAL ASSIGNED</span>
                  <strong>{assignedStudents.length}</strong>
                </div>
                <div className="metric-box highlight-pending">
                  <span>PENDING HANDOVER</span>
                  <strong>{pendingCount}</strong>
                </div>
                <div className="metric-box highlight-done">
                  <span>DISTRIBUTED</span>
                  <strong>{distributedCount}</strong>
                </div>
              </div>
            </section>

            {/* Degree Distribution List */}
            <section className="panel faculty-roster-panel">
              <div className="faculty-roster-controls">
                <div>
                  <h2>Assigned Graduates & Seat Identification</h2>
                  <p>Identify each graduate by allotted seat number and record certificate distribution</p>
                </div>

                <div className="faculty-filter-group">
                  <div className="faculty-search-box">
                    <Icon name="search" size={16} />
                    <input
                      value={facultySearchQuery}
                      onChange={(e) => setFacultySearchQuery(e.target.value)}
                      placeholder="Search graduate name, seat or register no…"
                      aria-label="Search assigned graduates"
                    />
                  </div>

                  <div className="filter-chips">
                    <button
                      type="button"
                      className={facultyFilterStatus === 'all' ? 'active' : ''}
                      onClick={() => setFacultyFilterStatus('all')}
                    >
                      All ({assignedStudents.length})
                    </button>
                    <button
                      type="button"
                      className={facultyFilterStatus === 'pending' ? 'active' : ''}
                      onClick={() => setFacultyFilterStatus('pending')}
                    >
                      Pending ({pendingCount})
                    </button>
                    <button
                      type="button"
                      className={facultyFilterStatus === 'distributed' ? 'active' : ''}
                      onClick={() => setFacultyFilterStatus('distributed')}
                    >
                      Distributed ({distributedCount})
                    </button>
                  </div>
                </div>
              </div>

              {displayedFacultyStudents.length === 0 ? (
                <div className="faculty-empty-state">
                  <Icon name="search" size={28} />
                  <p>No graduates found matching your search filter.</p>
                </div>
              ) : (
                <div className="faculty-students-grid">
                  {displayedFacultyStudents.map((student) => {
                    const isDistributed = Boolean(student.degreeDistributed)
                    return (
                      <article
                        key={student.id}
                        className={`graduate-distribution-card ${isDistributed ? 'distributed' : 'pending'}`}
                      >
                        <div className="graduate-card-top">
                          <div className="graduate-seat-badge">
                            <small>ALLOTTED SEAT</small>
                            <strong>{student.row}-{student.seat}</strong>
                          </div>

                          <div className="graduate-status-pill-wrap">
                            {isDistributed ? (
                              <span className="status-pill success">
                                <Icon name="check" size={12} /> Certificate Handed Over ({student.degreeDistributedAt || 'Distributed'})
                              </span>
                            ) : (
                              <span className="status-pill pending">
                                <Icon name="clock" size={12} /> Pending Distribution
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="graduate-info-row">
                          <img
                            src={studentPhoto}
                            alt={student.name}
                            className="graduate-avatar-img"
                          />
                          <div className="graduate-text-details">
                            <h3>{student.name}</h3>
                            <p className="reg-no">{student.registerNumber}</p>
                            <p className="degree-name">{student.degree} · {student.program}</p>
                            <p className="gate-note">
                              <Icon name="shield" size={13} /> Campus Arrival: Face Verified · Gate {student.gate}
                            </p>
                          </div>
                        </div>

                        <div className="graduate-distribution-footer">
                          <div className="next-step-hint">
                            <small>NEXT MILESTONE:</small>
                            <span>{isDistributed ? 'Proceed to Official Photo Studio' : 'Awaiting Faculty Handover'}</span>
                          </div>

                          {!isDistributed ? (
                            <button
                              type="button"
                              className="distribute-action-btn"
                              onClick={() => handleFacultyDistribute(student.id)}
                            >
                              <Icon name="award" size={16} /> Hand Over Certificate
                            </button>
                          ) : (
                            <div className="distributed-confirmed-badge">
                              <Icon name="check" size={16} /> Distributed to Student
                            </div>
                          )}
                        </div>
                      </article>
                    )
                  })}
                </div>
              )}
            </section>
          </div>
        )}

        {/* TAB 3: STUDENT LIST */}
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
                              <strong>{student.name}</strong>
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
            <SeatingLayout allocations={seatingAllocations} selectedId={selectedSeatAllocationId} onSelect={setSelectedSeatAllocationId} showRoster isStaffView />
          </div>
        )}

        {/* TAB 5: INSTRUCTIONS */}
        {activeTab === 'instructions' && (
          <div className="staff-instructions-view">
            <StaffInstructionsPage />
          </div>
        )}

        </div>
      </main>
    </div>
  )
}
