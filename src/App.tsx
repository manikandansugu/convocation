import { useState } from 'react'
import { Header } from './components/layout/Header'
import { Sidebar } from './components/layout/Sidebar'
import type { PageId } from './config/navigation'
import { ConvocationPassPage } from './pages/ConvocationPassPage'
import { GuestAdditionPage } from './pages/GuestAdditionPage'
import { IdentityVerificationPage } from './pages/IdentityVerificationPage'
import { PaymentPage } from './pages/PaymentPage'
import { StudentInformationPage } from './pages/StudentInformationPage'
import { LoginPage, type UserRole } from './pages/LoginPage'
import { StaffPortalPage } from './pages/StaffPortalPage'
import { DEFAULT_STAFF, type StaffMember } from './config/staff'
import type { Guest } from './types/registration'
import './App.css'

const DEFAULT_GUESTS: Guest[] = [
  { name: '', relationship: '', aadhaarNumber: '' },
  { name: '', relationship: '', aadhaarNumber: '' },
]

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState<UserRole>('student')
  const [staffMember, setStaffMember] = useState<StaffMember>(DEFAULT_STAFF)
  const [activePage, setActivePage] = useState<PageId>('Student Information')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [guests, setGuests] = useState<Guest[]>(DEFAULT_GUESTS)

  const navigateTo = (page: PageId) => {
    setActivePage(page)
    setSidebarOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const renderPage = () => {
    if (activePage === 'Student Information') {
      return <StudentInformationPage onContinue={() => navigateTo('ID Verification')} />
    }
    if (activePage === 'ID Verification') {
      return <IdentityVerificationPage onBack={() => navigateTo('Student Information')} onContinue={() => navigateTo('Payment')} />
    }
    if (activePage === 'Payment') {
      return <PaymentPage onBack={() => navigateTo('ID Verification')} onSuccess={() => navigateTo('Guest Addition')} />
    }
    if (activePage === 'Guest Addition') {
      return <GuestAdditionPage initialGuests={guests} onBack={() => navigateTo('Payment')} onContinue={(updatedGuests) => { setGuests(updatedGuests); navigateTo('Convocation Pass') }} />
    }
    return <ConvocationPassPage guests={guests} />
  }

  const logout = () => {
    setIsAuthenticated(false)
    setUserRole('student')
    setActivePage('Student Information')
    setSidebarOpen(false)
  }

  const handleLogin = (role: UserRole, staffDetails?: StaffMember) => {
    setUserRole(role)
    if (staffDetails) {
      setStaffMember(staffDetails)
    }
    setIsAuthenticated(true)
  }

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />
  }

  if (userRole === 'staff') {
    return (
      <StaffPortalPage
        staff={staffMember}
        onLogout={logout}
        onSwitchToStudent={() => setUserRole('student')}
      />
    )
  }

  return (
    <div className="app-shell">
      <Sidebar activePage={activePage} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} onNavigate={navigateTo} onLogout={logout} />
      <main className="main-content">
        <Header activePage={activePage} onOpenNavigation={() => setSidebarOpen(true)} />
        {renderPage()}
      </main>
    </div>
  )
}

export default App
