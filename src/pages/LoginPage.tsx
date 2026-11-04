import { useState, type FormEvent } from 'react'
import { Icon } from '../components/ui/Icon'
import { COE_APPROVED_STUDENTS } from '../config/student'
import { DEFAULT_STAFF, type StaffMember } from '../config/staff'
import { INITIAL_FACULTY_LIST } from '../config/faculty'
import type { FacultyMember } from '../types/faculty'
import type { COEStudent } from '../types/registration'

export type UserRole = 'student' | 'staff'

export type StaffTab = 'counter' | 'tokens' | 'auditorium-entry' | 'seating' | 'faculty-distribution' | 'roster' | 'instructions'

interface LoginPageProps {
  onLogin: (
    role: UserRole,
    payload?: {
      student?: COEStudent
      faculty?: FacultyMember
      staff?: StaffMember
      initialTab?: StaffTab
    },
  ) => void
}
export function LoginPage({ onLogin }: LoginPageProps) {
  const [role, setRole] = useState<UserRole>('student')
  const [coeStudents, setCoeStudents] = useState<COEStudent[]>(COE_APPROVED_STUDENTS)

  // Student Form State
  const [netId, setNetId] = useState('C10001')
  const [password, setPassword] = useState('123456')
  const [studentError, setStudentError] = useState('')
  const [inAbsentiaStudent, setInAbsentiaStudent] = useState<COEStudent | null>(null)

  // Faculty and staff sign-in state
  const [operationsNetId, setOperationsNetId] = useState('EMP9041')
  const [operationsPassword, setOperationsPassword] = useState('123456')
  const [operationsError, setOperationsError] = useState('')

  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleStudentSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStudentError('')
    setInAbsentiaStudent(null)

    const query = netId.trim().toUpperCase()
    if (!query) {
      setStudentError('Please enter your NetID or Register Number.')
      return
    }

    // Verify against COE Approved Student List (Step 1 requirement)
    const matching = coeStudents.find(
      (s) => s.netId.toUpperCase() === query || s.registerNumber.toUpperCase() === query,
    )

    if (!matching) {
      setStudentError('Access Restricted: NetID is not present in the COE-approved eligible graduates list for Convocation 2026. Please contact the Controller of Examinations (COE) Office.')
      return
    }

    if (!matching.coeApproved) {
      setStudentError('Access Restricted: Your graduation clearance is pending with the COE Office.')
      return
    }

    // Check attendance confirmation (Step 1)
    if (matching.attendanceMode === 'in_absentia') {
      setInAbsentiaStudent(matching)
      return
    }

    setIsSubmitting(true)
    window.setTimeout(() => {
      setIsSubmitting(false)
      onLogin('student', { student: matching })
    }, 600)
  }

  const confirmInPersonAttendance = (studentToConfirm: COEStudent) => {
    const updated = coeStudents.map((s) =>
      s.netId === studentToConfirm.netId ? { ...s, attendanceMode: 'in_person' as const } : s,
    )
    setCoeStudents(updated)
    setInAbsentiaStudent(null)
    setIsSubmitting(true)
    window.setTimeout(() => {
      setIsSubmitting(false)
      onLogin('student', { student: { ...studentToConfirm, attendanceMode: 'in_person' } })
    }, 600)
  }

  const handleOperationsSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setOperationsError('')
    if (!operationsNetId.trim() || !operationsPassword.trim()) {
      setOperationsError('Please enter your User NetID and Password.')
      return
    }

    const normalizedNetId = operationsNetId.trim().toUpperCase()
    const faculty = INITIAL_FACULTY_LIST.find(
      (member) => member.employeeId.toUpperCase() === normalizedNetId,
    )

    if (faculty) {
      setIsSubmitting(true)
      window.setTimeout(() => {
        setIsSubmitting(false)
        onLogin('staff', { faculty, initialTab: 'faculty-distribution' })
      }, 600)
      return
    }

    const staffDetails: StaffMember = {
      ...DEFAULT_STAFF,
      employeeId: normalizedNetId,
    }
    setIsSubmitting(true)
    window.setTimeout(() => {
      setIsSubmitting(false)
      onLogin('staff', { staff: staffDetails, initialTab: 'counter' })
    }, 600)
  }

  return (
    <main className="login-page">
      <section className="login-brand-panel" aria-label="CampusTrust introduction">
        <img className="login-white-logo" src={import.meta.env.BASE_URL + 'campus-trust-white-logo.png'} alt="CampusTrust" />

        <div className="login-brand-copy">
          <p className="login-convocation-label">
            <span /> Convocation 2026 · Official Portal
          </p>
          <h1>
            {role === 'student' ? <>Your Gateway<br />to Graduation Day 2026!</> : <>Faculty & Staff<br />Operations Desk</>}
          </h1>
          <p>
            {role === 'student'
              ? 'Restricted registration for COE-approved graduates. Confirm attendance, verify live photo ID, and generate your Graduation Day Pass.'
              : 'Unified operations workspace for campus arrival check-in, kit distribution, faculty registration, and auditorium degree certificate distribution.'}
          </p>

          <div className="preparatory-notice-box">
            <strong><Icon name="check" size={15} /> Preparatory Process Check</strong>
            <span>COE Approved List · DODE Presentee Verification · In-Person Access Only</span>
          </div>
        </div>
      </section>

      <section className="login-form-panel">
        <div className="login-form-wrap">
          {/* Role Switcher Tabs */}
          <div className="login-role-tabs" role="tablist" aria-label="Select user role">
            <button
              type="button"
              role="tab"
              aria-selected={role === 'student'}
              className={`login-role-tab ${role === 'student' ? 'active' : ''}`}
              onClick={() => { setRole('student'); setStudentError('') }}
            >
              <Icon name="cap" size={16} />
              <span>Student Portal</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={role === 'staff'}
              className={`login-role-tab ${role === 'staff' ? 'active' : ''}`}
              onClick={() => { setRole('staff'); setOperationsError('') }}
            >
              <Icon name="shield" size={16} />
              <span>Faculty & Staff Desk</span>
            </button>
          </div>

          {/* Student Login Flow */}
          {role === 'student' && (
            <>
              <div className="login-form-heading">
                <span className="login-role-tag">ONLINE STUDENT REGISTRATION</span>
                <h2>Graduate Login</h2>
                <p>Login with your NetID to access registration and generate your Graduation Day Pass</p>
              </div>

              {inAbsentiaStudent ? (
                <div className="in-absentia-warning-box">
                  <div className="warning-header">
                    <Icon name="help" size={20} />
                    <strong>Attendance Status: In Absentia</strong>
                  </div>
                  <p>
                    Hello <strong>{inAbsentiaStudent.name}</strong> ({inAbsentiaStudent.registerNumber}).
                    You are on the COE-approved list, but your attendance is currently recorded as <strong>In Absentia</strong>.
                    Degree certificates for in absentia graduates are sent via post.
                  </p>
                  <p className="notice-sub">
                    To attend Graduation Day in person and receive your Graduation Kit, Gown, Robe and Tokens, please confirm In-Person attendance.
                  </p>
                  <div className="absentia-actions">
                    <button
                      type="button"
                      className="flow-primary"
                      onClick={() => confirmInPersonAttendance(inAbsentiaStudent)}
                    >
                      <Icon name="check" size={16} /> Confirm In-Person Attendance & Register
                    </button>
                    <button
                      type="button"
                      className="secondary-button"
                      onClick={() => setInAbsentiaStudent(null)}
                    >
                      Back
                    </button>
                  </div>
                </div>
              ) : (
                <form className="login-form" onSubmit={handleStudentSubmit} noValidate>
                  <div className="login-input">
                    <Icon name="user" size={21} />
                    <input
                      value={netId}
                      onChange={(event) => setNetId(event.target.value)}
                      placeholder="NetID or Register Number (e.g. C10001)"
                      aria-label="NetID"
                      autoComplete="username"
                    />
                  </div>

                  <div className="login-input">
                    <Icon name="lock" size={21} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Password"
                      aria-label="Password"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword((visible) => !visible)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      <Icon name={showPassword ? 'eye' : 'eye-off'} size={19} />
                    </button>
                  </div>

                  {studentError && (
                    <p className="login-error" role="alert">
                      <Icon name="x" size={16} /> {studentError}
                    </p>
                  )}

                  <button type="submit" className="login-submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <><span className="spinner" /> Verifying COE Approved List…</>
                    ) : (
                      <>Access Online Registration <Icon name="arrow" size={19} /></>
                    )}
                  </button>

                  <div className="login-demo-helper">
                    <Icon name="help" size={14} />
                    <div>
                      <span><strong>Demo NetIDs:</strong></span>
                      <button type="button" className="demo-chip" onClick={() => setNetId('C10001')}>C10001 (In Person · Approved)</button>
                      <button type="button" className="demo-chip" onClick={() => setNetId('C10002')}>C10002 (In Absentia)</button>
                      <button type="button" className="demo-chip" onClick={() => setNetId('C99999')}>C99999 (Unapproved)</button>
                    </div>
                  </div>
                </form>
              )}
            </>
          )}

          {/* Faculty & Staff Operations Desk Flow */}
          {role === 'staff' && (
            <>
              <div className="login-form-heading">
                <span className="login-role-tag staff-tag">EVENT OPERATIONS DESK</span>
                <h2>Faculty & Staff Sign In</h2>
                <p>Enter your User NetID and password to access the assigned convocation desk.</p>
              </div>

              <form className="login-form" onSubmit={handleOperationsSubmit} noValidate>
                <div className="login-input">
                  <Icon name="user" size={21} />
                  <input
                    value={operationsNetId}
                    onChange={(event) => setOperationsNetId(event.target.value)}
                    placeholder="User NetID"
                    aria-label="User NetID"
                    autoComplete="username"
                  />
                </div>

                <div className="login-input">
                  <Icon name="lock" size={21} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={operationsPassword}
                    onChange={(event) => setOperationsPassword(event.target.value)}
                    placeholder="Password"
                    aria-label="Password"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword((visible) => !visible)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    <Icon name={showPassword ? 'eye' : 'eye-off'} size={19} />
                  </button>
                </div>

                {operationsError && (
                  <p className="login-error" role="alert">
                    <Icon name="x" size={16} /> {operationsError}
                  </p>
                )}

                <button type="submit" className="login-submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <><span className="spinner" /> Signing in…</>
                  ) : (
                    <>Sign In <Icon name="arrow" size={19} /></>
                  )}
                </button>

                <div className="login-demo-helper">
                  <Icon name="help" size={14} />
                  <span>Demo: EMP9041 for staff or EMP-FAC-401 for faculty · Password: 123456</span>
                </div>
              </form>
            </>
          )}
        </div>
      </section>
    </main>
  )
}
