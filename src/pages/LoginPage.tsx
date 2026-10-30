import { useState, type FormEvent } from 'react'
import { Icon } from '../components/ui/Icon'
import { DEFAULT_STAFF, type StaffMember } from '../config/staff'

export type UserRole = 'student' | 'staff'

interface LoginPageProps {
  onLogin: (role: UserRole, staffDetails?: StaffMember) => void
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [role, setRole] = useState<UserRole>('student')
  const [registerNumber, setRegisterNumber] = useState('C10001')
  const [staffId, setStaffId] = useState('EMP9041')
  const [password, setPassword] = useState('123456')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole)
    setError('')
    if (newRole === 'staff') {
      setPassword('123456')
    } else {
      setPassword('123456')
    }
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')

    const identifier = role === 'student' ? registerNumber.trim() : staffId.trim()
    if (!identifier || !password.trim()) {
      setError('Enter your credentials to continue.')
      return
    }

    setIsSubmitting(true)

    window.setTimeout(() => {
      if (role === 'staff') {
        const staffDetails: StaffMember = {
          ...DEFAULT_STAFF,
          employeeId: staffId.trim().toUpperCase(),
        }
        onLogin('staff', staffDetails)
      } else {
        onLogin('student')
      }
    }, 650)
  }

  return (
    <main className="login-page">
      <section className="login-brand-panel" aria-label="CampusTrust introduction">
        <img className="login-white-logo" src={import.meta.env.BASE_URL + 'campus-trust-white-logo.png'} alt="CampusTrust" />

        <div className="login-brand-copy">
          <p className="login-convocation-label">
            <span /> {role === 'staff' ? 'Convocation Staff & Desk Portal' : 'Convocation 2026'}
          </p>
          <h1>
            {role === 'staff' ? (
              <>Event Desk &<br />Operations Portal</>
            ) : (
              <>Your Gateway<br />to Convocation 2026!</>
            )}
          </h1>
          <p>
            {role === 'staff'
              ? 'Access regalia distribution, live student verification, gown return clearance, and gate pass scanning in real time.'
              : 'Complete your registration, verify your identity, add guests and access your convocation passes securely in one place.'}
          </p>
        </div>
      </section>

      <section className="login-form-panel">
        <div className="login-form-wrap">
          {/* Role Switcher Tabs */}
          <div className="login-role-tabs" role="tablist" aria-label="Choose user type">
            <button
              type="button"
              role="tab"
              aria-selected={role === 'student'}
              className={`login-role-tab ${role === 'student' ? 'active' : ''}`}
              onClick={() => handleRoleChange('student')}
            >
              <Icon name="cap" size={16} />
              <span>Student Login</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={role === 'staff'}
              className={`login-role-tab ${role === 'staff' ? 'active' : ''}`}
              onClick={() => handleRoleChange('staff')}
            >
              <Icon name="shield" size={16} />
              <span>Staff Login</span>
            </button>
          </div>

          <div className="login-form-heading">
            <span className={`login-role-tag ${role === 'staff' ? 'staff-tag' : ''}`}>
              {role === 'staff' ? 'STAFF / DESK ACCESS' : 'STUDENT PORTAL'}
            </span>
            <h2>{role === 'staff' ? 'Staff Login' : 'Student Login'}</h2>
            <p>
              {role === 'staff'
                ? 'Enter your employee ID and password to access the convocation desk'
                : 'Enter your credentials to access your registration and passes'}
            </p>
          </div>

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            {role === 'student' ? (
              <div className="login-input">
                <Icon name="user" size={21} />
                <input
                  value={registerNumber}
                  onChange={(event) => setRegisterNumber(event.target.value)}
                  placeholder="User ID or Register Number"
                  aria-label="User ID"
                  autoComplete="username"
                  aria-describedby={error ? 'login-error' : undefined}
                />
              </div>
            ) : (
              <>
                <div className="login-input">
                  <Icon name="shield" size={21} />
                  <input
                    value={staffId}
                    onChange={(event) => setStaffId(event.target.value)}
                    placeholder="Employee ID (e.g. EMP9041)"
                    aria-label="Employee ID"
                    autoComplete="username"
                    aria-describedby={error ? 'login-error' : undefined}
                  />
                </div>

              </>
            )}

            <div className="login-input">
              <Icon name="lock" size={21} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Password"
                aria-label="Password"
                autoComplete="current-password"
                aria-describedby={error ? 'login-error' : undefined}
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

            {error && (
              <p className="login-error" id="login-error" role="alert">
                <Icon name="x" size={15} /> {error}
              </p>
            )}

            <button type="submit" className="login-submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className="spinner" /> Signing in…
                </>
              ) : (
                <>
                  {role === 'staff' ? 'Sign in to Staff Portal' : 'Login'} <Icon name="arrow" size={19} />
                </>
              )}
            </button>

            <div className="login-demo-helper">
              <Icon name="help" size={14} />
              <span>
                {role === 'student'
                  ? 'Demo Student: User ID C10001 · Password 123456'
                  : 'Demo Staff: Employee ID EMP9041 · Password 123456'}
              </span>
            </div>
          </form>
        </div>
      </section>
    </main>
  )
}
