import { useState, type FormEvent } from 'react'
import { Icon } from '../components/ui/Icon'

interface LoginPageProps {
  onLogin: () => void
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [registerNumber, setRegisterNumber] = useState('C10001')
  const [password, setPassword] = useState('123456')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')

    if (!registerNumber.trim() || !password.trim()) {
      setError('Enter your credentials to continue.')
      return
    }

    setIsSubmitting(true)

    window.setTimeout(onLogin, 650)
  }

  return (
    <main className="login-page">
      <section className="login-brand-panel" aria-label="CampusTrust introduction">
        <img className="login-white-logo" src={import.meta.env.BASE_URL + 'campus-trust-white-logo.png'} alt="CampusTrust" />

        <div className="login-brand-copy">
          <p className="login-convocation-label">
            <span /> Convocation 2026
          </p>
          <h1>Your Gateway<br />to Convocation 2026!</h1>
          <p>Complete your registration, verify your identity, add guests and access your convocation passes securely in one place.</p>
        </div>
      </section>

      <section className="login-form-panel">
        <div className="login-form-wrap">
          <div className="login-form-heading">
            <span className="login-role-tag">STUDENT PORTAL</span>
            <h2>Student Login</h2>
            <p>Enter your credentials to access your registration and passes</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit} noValidate>
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
                  Login <Icon name="arrow" size={19} />
                </>
              )}
            </button>

            <div className="login-demo-helper">
              <Icon name="help" size={14} />
              <span>
                Demo Student: User ID C10001 · Password 123456
              </span>
            </div>
          </form>
        </div>
      </section>
    </main>
  )
}
