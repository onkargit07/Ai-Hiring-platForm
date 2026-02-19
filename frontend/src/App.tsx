import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'

// Pages
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

// Recruiter Pages
import RecruiterDashboard from './pages/recruiter/RecruiterDashboard'
import CreateJobPage from './pages/recruiter/CreateJobPage'
import JobApplicationsPage from './pages/recruiter/JobApplicationsPage'

// Candidate Pages
import CandidateDashboard from './pages/candidate/CandidateDashboard'
import JobListingsPage from './pages/candidate/JobListingsPage'
import JobDetailPage from './pages/candidate/JobDetailPage'
import ApplyJobPage from './pages/candidate/ApplyJobPage'
import ApplicationStatusPage from './pages/candidate/ApplicationStatusPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Recruiter Routes */}
      <Route path="/recruiter/dashboard" element={<ProtectedRoute role="RECRUITER"><RecruiterDashboard /></ProtectedRoute>} />
      <Route path="/recruiter/jobs/create" element={<ProtectedRoute role="RECRUITER"><CreateJobPage /></ProtectedRoute>} />
      <Route path="/recruiter/jobs/:id/applications" element={<ProtectedRoute role="RECRUITER"><JobApplicationsPage /></ProtectedRoute>} />

      {/* Candidate Routes */}
      <Route path="/candidate/dashboard" element={<ProtectedRoute role="CANDIDATE"><CandidateDashboard /></ProtectedRoute>} />
      <Route path="/candidate/jobs" element={<ProtectedRoute role="CANDIDATE"><JobListingsPage /></ProtectedRoute>} />
      <Route path="/candidate/jobs/:id" element={<ProtectedRoute role="CANDIDATE"><JobDetailPage /></ProtectedRoute>} />
      <Route path="/candidate/jobs/:id/apply" element={<ProtectedRoute role="CANDIDATE"><ApplyJobPage /></ProtectedRoute>} />
      <Route path="/candidate/applications" element={<ProtectedRoute role="CANDIDATE"><ApplicationStatusPage /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

function ProtectedRoute({ children, role }: { children: React.ReactNode; role: string }) {
  const { user, isAuthenticated } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  if (role && user?.role !== role) {
    return <Navigate to="/" />
  }

  return <>{children}</>
}

export default App
