import { useState, useMemo } from 'react'
import JSZip from 'jszip'
import { Icon } from '../components/ui/Icon'
import { DEFAULT_STAFF, INITIAL_ROSTER, type StaffMember, type StudentRosterRecord } from '../config/staff'
import { DEFAULT_FACULTY } from '../config/faculty'
import { FACULTY_STAFF_ALLOCATIONS } from '../config/seating'
import type { FacultyMember } from '../types/faculty'
import studentPortraitGrid from '../assets/indian-student-portraits-grid.jpg'
import { SeatingLayout, type SeatAllocation } from '../components/seating/SeatingLayout'
import { StaffInstructionsPage } from './StaffInstructionsPage'

export type StaffTab = 'counter' | 'tokens' | 'auditorium-entry' | 'seating' | 'faculty-distribution' | 'roster' | 'instructions'

interface StaffPortalPageProps {
  staff?: StaffMember
  faculty?: FacultyMember
  initialTab?: StaffTab
  onLogout: () => void
}

const getKitIssuedCount = (student: StudentRosterRecord) =>
  Number(Boolean(student.attendanceRecorded)) +
  Number(Boolean(student.gownIssued)) +
  Number(Boolean(student.breakfastTokenIssued)) +
  Number(Boolean(student.lunchTokenIssued))

function StudentPortrait({ student, className = '' }: { student: StudentRosterRecord; className?: string }) {
  const column = student.photoIndex % 7
  const row = Math.floor(student.photoIndex / 7)

  return (
    <span
      className={`student-portrait-sprite ${className}`.trim()}
      role="img"
      aria-label={`${student.name} profile photo`}
      style={{
        backgroundImage: `url(${studentPortraitGrid})`,
        backgroundPosition: `${(column / 6) * 100}% ${(row / 5) * 100}%`,
      }}
    />
  )
}

const escapeExcelXml = (value: string | number) => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&apos;')

const excelColumnName = (index: number) => {
  let value = index + 1
  let name = ''
  while (value > 0) {
    value -= 1
    name = String.fromCharCode(65 + (value % 26)) + name
    value = Math.floor(value / 26)
  }
  return name
}

async function exportDegreeDistributionWorkbook(faculty: FacultyMember, students: StudentRosterRecord[]) {
  const headers = [
    'S.No', 'Student Name', 'Register Number', 'Registration ID', 'Degree', 'Program',
    'Department', 'Block', 'Row', 'Seat', 'Faculty', 'Distribution Status',
    'Distributed At', 'Official Email', 'Mobile Number',
  ]
  const rows: Array<Array<string | number>> = [
    headers,
    ...students.map((student, index) => [
      index + 1,
      student.name,
      student.registerNumber,
      student.registrationId,
      student.degree,
      student.program,
      student.department,
      student.block,
      student.row,
      student.seat,
      faculty.name,
      student.degreeDistributed ? 'Distributed' : 'Pending',
      student.degreeDistributedAt || '',
      student.officialEmail,
      student.mobileNumber,
    ]),
  ]
  const lastColumn = excelColumnName(headers.length - 1)
  const sheetRows = rows.map((row, rowIndex) => {
    const cells = row.map((value, columnIndex) => {
      const reference = `${excelColumnName(columnIndex)}${rowIndex + 1}`
      return `<c r="${reference}" t="inlineStr"${rowIndex === 0 ? ' s="1"' : ''}><is><t>${escapeExcelXml(value)}</t></is></c>`
    }).join('')
    return `<row r="${rowIndex + 1}">${cells}</row>`
  }).join('')

  const zip = new JSZip()
  zip.file('[Content_Types].xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  <Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
  <Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
</Types>`)
  zip.folder('_rels')?.file('.rels', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>`)
  zip.folder('xl')?.file('workbook.xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheets><sheet name="Degree Distribution" sheetId="1" r:id="rId1"/></sheets>
</workbook>`)
  zip.folder('xl')?.folder('_rels')?.file('workbook.xml.rels', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`)
  zip.folder('xl')?.file('styles.xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <fonts count="2"><font><sz val="11"/><name val="DM Sans"/></font><font><b/><color rgb="FFFFFFFF"/><sz val="11"/><name val="DM Sans"/></font></fonts>
  <fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FF155BC3"/><bgColor indexed="64"/></patternFill></fill></fills>
  <borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>
  <cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>
  <cellXfs count="2"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1"/></cellXfs>
</styleSheet>`)
  zip.folder('xl')?.folder('worksheets')?.file('sheet1.xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <dimension ref="A1:${lastColumn}${rows.length}"/>
  <sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>
  <cols>${headers.map((header, index) => `<col min="${index + 1}" max="${index + 1}" width="${Math.max(10, Math.min(32, header.length + 6))}" customWidth="1"/>`).join('')}</cols>
  <sheetData>${sheetRows}</sheetData>
  <autoFilter ref="A1:${lastColumn}${rows.length}"/>
</worksheet>`)

  const workbook = await zip.generateAsync({ type: 'blob', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
  const url = URL.createObjectURL(workbook)
  const link = document.createElement('a')
  const department = faculty.department.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase()
  link.href = url
  link.download = `${department}-degree-distribution-29-nov-2026.xlsx`
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

export function StaffPortalPage({
  staff = DEFAULT_STAFF,
  faculty = DEFAULT_FACULTY,
  initialTab = 'instructions',
  onLogout,
}: StaffPortalPageProps) {
  const initialFacultyRoster = INITIAL_ROSTER.filter((student) => student.assignedFacultyId === faculty.id)
  const initialStudentId = initialFacultyRoster[0]?.id || INITIAL_ROSTER[0].id
  const [activeTab, setActiveTab] = useState<StaffTab>(initialTab)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [roster, setRoster] = useState<StudentRosterRecord[]>(initialFacultyRoster)
  const [selectedStudentId, setSelectedStudentId] = useState<string>(initialStudentId)
  const [selectedSeatAllocationId, setSelectedSeatAllocationId] = useState<string>(initialStudentId)
  const [drawerStudentId, setDrawerStudentId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [rosterPage, setRosterPage] = useState(1)
  const [rosterPageSize, setRosterPageSize] = useState(10)

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
    { id: 'instructions' as const, label: 'Student Instructions', icon: 'file' as const },
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
    instructions: 'Student Instructions',
  }

  // Every generated record has a faculty ID; use legacy matching only for older records.
  const assignedStudents = roster.filter((student) => {
    if (student.assignedFacultyId) return student.assignedFacultyId === currentFaculty.id
    return (
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

  const handleDegreeDistributionExport = async () => {
    try {
      await exportDegreeDistributionWorkbook(currentFaculty, assignedStudents)
      setFacultySuccessToast(`Excel export downloaded for ${currentFaculty.department} (${assignedStudents.length} graduates).`)
    } catch {
      setFacultySuccessToast('Unable to generate the Excel export. Please try again.')
    }
    window.setTimeout(() => setFacultySuccessToast(''), 3500)
  }

  const selectedStudent = roster.find((s) => s.id === selectedStudentId) || roster[0]
  const drawerStudent = roster.find((s) => s.id === drawerStudentId)
  const seatingAllocations: SeatAllocation[] = [
    ...roster.map((student) => ({
      id: student.id,
      name: student.name,
      registerNumber: student.registerNumber,
      block: student.block,
      row: student.row,
      seat: student.seat,
      type: 'student' as const,
      department: student.department,
      role: student.degree ? `${student.degree} Graduate` : 'Graduate attendee',
      email: student.officialEmail || student.personalEmail,
      degreeDistributed: Boolean(student.degreeDistributed),
      photoIndex: student.photoIndex,
    })),
    ...FACULTY_STAFF_ALLOCATIONS,
  ]

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
              degreeDistributed: false,
              degreeDistributedAt: undefined,
              breakfastTokenRedeemed: false,
              breakfastTime: undefined,
              lunchTokenRedeemed: false,
              lunchTime: undefined,
              photoSessionCompleted: false,
              photoSessionAt: undefined,
              admittedAtGate: false,
              auditoriumFaceVerified: false,
              auditoriumEntryTime: undefined,
              admittedTime: undefined,
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

  // Keep every incomplete student at the top; fully issued students move to the bottom.
  const counterQueueRoster = useMemo(() => {
    return [...filteredRoster].sort((a, b) => {
      const aFullyIssued = getKitIssuedCount(a) === 4
      const bFullyIssued = getKitIssuedCount(b) === 4

      if (aFullyIssued !== bFullyIssued) return aFullyIssued ? 1 : -1
      return 0
    })
  }, [filteredRoster])

  const rosterPageCount = Math.max(1, Math.ceil(filteredRoster.length / rosterPageSize))
  const activeRosterPage = Math.min(rosterPage, rosterPageCount)
  const rosterPageStart = (activeRosterPage - 1) * rosterPageSize
  const paginatedRoster = filteredRoster.slice(rosterPageStart, rosterPageStart + rosterPageSize)
  const rosterPageEnd = Math.min(rosterPageStart + rosterPageSize, filteredRoster.length)

  const completedStepsCount =
    (selectedStudent.attendanceRecorded ? 1 : 0) +
    (selectedStudent.gownIssued ? 1 : 0) +
    (selectedStudent.breakfastTokenIssued ? 1 : 0) +
    (selectedStudent.lunchTokenIssued ? 1 : 0)

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
                {counterQueueRoster.map((student) => {
                  const isSelected = student.id === selectedStudent.id
                  const doneCount = getKitIssuedCount(student)
                  return (
                    <button
                      key={student.id}
                      type="button"
                      className={`staff-student-row ${isSelected ? 'active' : ''}`}
                      onClick={() => setSelectedStudentId(student.id)}
                    >
                      <StudentPortrait student={student} className="student-row-avatar" />
                      <div className="student-row-details">
                        <strong>{student.name}</strong>
                        <span>{student.registerNumber} · {student.block}-{student.seat}</span>
                      </div>
                      <div className="student-row-status">
                        <span className={`roster-pill ${doneCount === 4 ? 'success' : doneCount > 0 ? 'warning' : 'pending'}`}>
                          {doneCount === 4 ? 'Kit Issued' : `${doneCount}/4 Issued`}
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
                  <StudentPortrait student={selectedStudent} className="student-face-photo" />
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
                  <h4>Attendance & Graduation Kit Status ({completedStepsCount}/4 Completed)</h4>
                  <span className={`overall-status-pill ${completedStepsCount === 4 ? 'success' : 'pending'}`}>
                    {completedStepsCount === 4 ? 'Clearance Complete' : 'Pending Items'}
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
                  </div>

                  {/* Item 3: Breakfast Token */}
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
                  </div>

                  {/* Item 4: Lunch Token */}
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
                    <StudentPortrait student={student} className="operation-graduate-photo" />
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
                  const kitComplete = Boolean(student.attendanceRecorded && student.gownIssued && student.breakfastTokenIssued && student.lunchTokenIssued)
                  return (
                    <article className={`auditorium-entry-card ${student.admittedAtGate ? 'admitted' : ''}`} key={student.id}>
                      <div className="auditorium-student-photo">
                        <StudentPortrait student={student} />
                        {student.auditoriumFaceVerified && <span className="auditorium-verified-icon"><Icon name="check" size={13} /></span>}
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
                <div className="faculty-roster-title-row">
                  <div>
                    <h2>Assigned Graduates & Seat Identification</h2>
                    <p>Identify each graduate by allotted seat number and record certificate distribution</p>
                  </div>
                  <button type="button" className="faculty-export-button" onClick={handleDegreeDistributionExport}>
                    <Icon name="download" size={16} />
                    Export Excel
                  </button>
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
                          <StudentPortrait student={student} className="graduate-avatar-img" />
                          <div className="graduate-text-details">
                            <h3>{student.name}</h3>
                            <p className="reg-no">{student.registerNumber}</p>
                            <p className="degree-name">{student.degree} · {student.program}</p>
                            <p className="gate-note">
                              <Icon name="shield" size={13} /> Campus Arrival: Face Verified · {student.gate}
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
                <div className="roster-header-actions">
                  <button type="button" className="faculty-export-button" onClick={handleDegreeDistributionExport}>
                    <Icon name="download" size={16} />
                    Export Distribution
                  </button>
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
                          <td data-label="Register No." style={{ cursor: 'pointer' }} onClick={() => {
                                setSelectedStudentId(student.id)
                                setDrawerStudentId(student.id)
                              }}><code>{student.registerNumber}</code></td>
                          <td data-label="Academic Year">{student.academicYear}</td>
                          <td data-label="Mobile No.">{student.mobileNumber}</td>
                          <td data-label="Personal Email">{student.personalEmail}</td>
                          <td data-label="Official Email">{student.officialEmail}</td>
                          <td data-label="Degree">{student.degree}</td>
                          <td data-label="Program">{student.program}</td>
                          <td data-label="Type"><span className="roster-pill success">{student.graduationType}</span></td>
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

                  <section className="roster-drawer-section drawer-degree-distribution">
                    <h3><Icon name="award" size={15} /> Degree Distribution</h3>
                    <div className="drawer-degree-status-row">
                      <div>
                        <span className={`drawer-status ${drawerStudent.degreeDistributed ? 'yes' : 'no'}`}>
                          {drawerStudent.degreeDistributed ? 'Certificate Handed Over' : 'Pending Handover'}
                        </span>
                        <small>
                          {drawerStudent.degreeDistributed
                            ? `Distributed at ${drawerStudent.degreeDistributedAt || 'recorded time unavailable'}`
                            : 'Confirm after handing the degree certificate to the graduate.'}
                        </small>
                      </div>
                      <button
                        type="button"
                        className={`btn-toggle-step ${drawerStudent.degreeDistributed ? 'done' : ''}`}
                        onClick={() => updateTimedStep(
                          drawerStudent.id,
                          'degreeDistributed',
                          !drawerStudent.degreeDistributed,
                          'degreeDistributedAt',
                        )}
                      >
                        <Icon name={drawerStudent.degreeDistributed ? 'x' : 'check'} size={14} />
                        {drawerStudent.degreeDistributed ? 'Mark Pending' : 'Confirm Handover'}
                      </button>
                    </div>
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
