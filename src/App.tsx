import { useState } from 'react'
import { Header, type HeaderProps } from './components/layout/Header'
import { Sidebar } from './components/layout/Sidebar'
import type { PageId } from './config/navigation'
import { ConvocationPassPage } from './pages/ConvocationPassPage'
import { GuestAdditionPage } from './pages/GuestAdditionPage'
import { IdentityVerificationPage } from './pages/IdentityVerificationPage'
import { InstructionsPage } from './pages/InstructionsPage'
import { NotificationsPage } from './pages/NotificationsPage'
import { QueriesPage } from './pages/QueriesPage'
import { SeatingLayoutPage } from './pages/SeatingLayoutPage'
import { MapPage } from './pages/MapPage'
import { PaymentPage } from './pages/PaymentPage'
import { StudentInformationPage } from './pages/StudentInformationPage'
import { LoginPage, type UserRole, type StaffTab } from './pages/LoginPage'
import { StaffPortalPage } from './pages/StaffPortalPage'
import type { Guest, Student } from './types/registration'
import { STUDENT } from './config/student'
import { DEFAULT_STAFF, type StaffMember } from './config/staff'
import { DEFAULT_FACULTY } from './config/faculty'
import type { FacultyMember } from './types/faculty'
import { INITIAL_NOTIFICATIONS, type ConvocationNotification } from './types/notifications'
import { INITIAL_QUERIES, type StudentQuery } from './types/queries'
import './App.css'

const DEFAULT_GUESTS: Guest[] = [
  { name: '', relationship: '', aadhaarNumber: '' },
]

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState<UserRole>('student')
  const [studentInfo, setStudentInfo] = useState<Student>(STUDENT)
  const [currentFaculty, setCurrentFaculty] = useState<FacultyMember>(DEFAULT_FACULTY)
  const [currentStaff, setCurrentStaff] = useState<StaffMember>(DEFAULT_STAFF)
  const [staffInitialTab, setStaffInitialTab] = useState<StaffTab>('counter')
  const [capturedPhotoUrl, setCapturedPhotoUrl] = useState<string>('')

  const [activePage, setActivePage] = useState<PageId>('Student Information')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [guests, setGuests] = useState<Guest[]>(DEFAULT_GUESTS)
  const [notifications, setNotifications] = useState<ConvocationNotification[]>(INITIAL_NOTIFICATIONS)
  const [queries, setQueries] = useState<StudentQuery[]>(INITIAL_QUERIES)
  const [queryFormOpen, setQueryFormOpen] = useState(false)

  const navigateTo = (page: PageId) => {
    setActivePage(page)
    setSidebarOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const renderPage = () => {
    if (activePage === 'Instructions') {
      return <InstructionsPage onStartRegistration={() => navigateTo('Student Information')} />
    }
    if (activePage === 'Seating Layout') {
      return <SeatingLayoutPage />
    }
    if (activePage === 'Map') {
      return <MapPage />
    }
    if (activePage === 'Notifications') {
      return (
        <NotificationsPage
          notifications={notifications}
          onMarkRead={(id) => setNotifications((items) => items.map((item) => item.id === id ? { ...item, read: true } : item))}
          onMarkAllRead={() => setNotifications((items) => items.map((item) => ({ ...item, read: true })))}
        />
      )
    }
    if (activePage === 'Queries & Support') {
      return (
        <QueriesPage
          queries={queries}
          onSubmitQuery={(query) => setQueries((items) => [query, ...items])}
          onReplyQuery={(queryId, body, attachmentName) => setQueries((items) => items.map((query) => (
            query.id === queryId
              ? {
                  ...query,
                  status: 'Open',
                  messages: [...query.messages, {
                    id: `query-message-${Date.now()}`,
                    sender: 'Student',
                    body,
                    attachmentName,
                    sentAt: 'Just now',
                    channel: 'Portal',
                  }],
                }
              : query
          )))}
          showQueryForm={queryFormOpen}
          onCloseQueryForm={() => setQueryFormOpen(false)}
        />
      )
    }
    if (activePage === 'Student Information') {
      return (
        <StudentInformationPage
          student={studentInfo}
          onUpdateMobile={(mobile) => setStudentInfo((prev) => ({ ...prev, mobile }))}
          onContinue={() => navigateTo('ID Verification')}
        />
      )
    }
    if (activePage === 'ID Verification') {
      return (
        <IdentityVerificationPage
          onPhotoCaptured={(url) => setCapturedPhotoUrl(url)}
          onBack={() => navigateTo('Student Information')}
          onContinue={() => navigateTo('Payment')}
        />
      )
    }
    if (activePage === 'Payment') {
      return <PaymentPage onBack={() => navigateTo('ID Verification')} onSuccess={() => navigateTo('Guest Addition')} />
    }
    if (activePage === 'Guest Addition') {
      return <GuestAdditionPage initialGuests={guests} onBack={() => navigateTo('Payment')} onContinue={(updatedGuests) => { setGuests(updatedGuests); navigateTo('Convocation Pass') }} />
    }
    return (
      <ConvocationPassPage
        guests={guests}
        photoUrl={capturedPhotoUrl}
        student={studentInfo}
        onNavigateToSeating={() => navigateTo('Seating Layout')}
        onNavigateToMap={() => navigateTo('Map')}
      />
    )
  }

  const logout = () => {
    setIsAuthenticated(false)
    setUserRole('student')
    setActivePage('Student Information')
    setSidebarOpen(false)
    setSidebarCollapsed(false)
  }

  const unreadNotificationCount = notifications.filter((notification) => !notification.read).length
  const pageHeaderDetails: Partial<Omit<HeaderProps, 'activePage' | 'onOpenNavigation'>> = (() => {
    switch (activePage) {
      case 'Instructions':
        return {
          title: 'Instructions & Guidelines',
          subtitle: 'Read the essential procedures and important information before completing your registration.',
          eyebrow: 'CONVOCATION 2026',
          icon: 'file',
          status: { label: 'Important information', icon: 'check', tone: 'info' },
        }
      case 'Notifications':
        return {
          title: 'Notifications',
          subtitle: 'Announcements, alerts and reminders specifically shared for your convocation journey.',
          eyebrow: 'CONVOCATION 2026',
          icon: 'bell',
          status: { label: `${unreadNotificationCount} unread`, icon: 'bell', tone: 'info' },
        }
      case 'Queries & Support':
        return {
          title: 'Support History',
          subtitle: 'Track your submitted queries and responses from the convocation support team.',
          eyebrow: 'CONVOCATION 2026',
          icon: 'help',
          action: {
            label: queryFormOpen ? 'Cancel' : 'New Query',
            icon: queryFormOpen ? 'x' : 'plus',
            onClick: () => setQueryFormOpen((open) => !open),
          },
        }
      case 'Seating Layout':
        return {
          title: 'Seating Layout',
          subtitle: 'View your allocated auditorium block, row and seat before arriving at the venue.',
          eyebrow: 'CONVOCATION 2026',
          icon: 'grid',
          status: { label: 'Seat allocated', icon: 'check', tone: 'success' },
        }
      case 'Map':
        return {
          title: 'Campus & Venue Map',
          subtitle: 'Locate the Auditorium, Refreshment zones (Breakfast & Lunch), and designated Car Parking areas.',
          eyebrow: 'SRM CAMPUS · CONVOCATION 2026',
          icon: 'map',
          status: { label: 'Event Day Guide', icon: 'location', tone: 'info' },
        }
      case 'Student Information':
        return {
          title: 'Student Information',
          subtitle: 'Review the prefilled details provided by your college.',
          eyebrow: 'CAMPUS TRUST · CONVOCATION 2026',
          icon: 'user',
          status: { label: 'Step 1 of 5', tone: 'neutral' },
        }
      case 'ID Verification':
        return {
          title: 'Live Photo Capture',
          subtitle: 'Capture a clear live photo for secure campus and auditorium face recognition entry.',
          eyebrow: 'FACIAL RECOGNITION SERVICE',
          icon: 'camera',
          status: { label: 'Step 2 of 5', tone: 'neutral' },
        }
      case 'Payment':
        return {
          title: 'Payment Gateway',
          subtitle: 'Complete your payment to confirm your convocation registration.',
          eyebrow: 'SECURE CHECKOUT',
          icon: 'wallet',
          status: { label: 'Step 3 of 5', tone: 'neutral' },
        }
      case 'Guest Addition':
        return {
          title: 'Guest Addition',
          subtitle: 'Add up to three people attending the convocation with you.',
          eyebrow: 'ACCOMPANYING GUESTS',
          icon: 'user',
          status: { label: 'Step 4 of 5', tone: 'neutral' },
        }
      case 'Convocation Pass':
        return {
          title: 'Graduation Day Passes',
          subtitle: `${guests.length + 1} individual QR pass${guests.length ? 'es' : ''} generated with complete event day milestones.`,
          eyebrow: 'REGISTRATION COMPLETE',
          icon: 'ticket',
          status: { label: 'Step 5 of 5', icon: 'check', tone: 'success' },
        }
    }
  })()

  if (!isAuthenticated) {
    return (
      <LoginPage
        onLogin={(role, payload) => {
          setUserRole(role)
          if (payload?.faculty) setCurrentFaculty(payload.faculty)
          if (payload?.staff) setCurrentStaff(payload.staff)
          if (payload?.initialTab) setStaffInitialTab(payload.initialTab)
          if (payload?.student) {
            setStudentInfo((prev) => ({
              ...prev,
              name: payload.student!.name,
              registerNumber: payload.student!.registerNumber,
              netId: payload.student!.netId,
              degree: payload.student!.degree,
              program: payload.student!.program,
              department: payload.student!.department,
              email: payload.student!.email,
              mobile: payload.student!.mobile,
            }))
          }
          setIsAuthenticated(true)
        }}
      />
    )
  }

  if (userRole === 'staff') {
    return (
      <StaffPortalPage
        staff={currentStaff}
        faculty={currentFaculty}
        initialTab={staffInitialTab}
        onLogout={logout}
        onSwitchToStudentView={() => setUserRole('student')}
      />
    )
  }

  return (
    <div className="app-shell">
      <Sidebar
        activePage={activePage}
        isOpen={sidebarOpen}
        isCollapsed={sidebarCollapsed}
        student={studentInfo}
        onClose={() => setSidebarOpen(false)}
        onToggleCollapse={() => setSidebarCollapsed((collapsed) => !collapsed)}
        onNavigate={navigateTo}
        onLogout={logout}
      />
      <main className={`main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <Header
          activePage={activePage}
          onOpenNavigation={() => setSidebarOpen(true)}
          onSwitchRole={(newRole) => setUserRole(newRole)}
          {...pageHeaderDetails}
        />
        {renderPage()}
      </main>
    </div>
  )
}

export default App
