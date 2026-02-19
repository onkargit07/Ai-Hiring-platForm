import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { applicationService, Application } from '../../services/applicationService'
import { Briefcase, FileText, CheckCircle, LogOut } from 'lucide-react'
import toast from 'react-hot-toast'

const statusColors = {
  APPLIED: 'badge-info',
  VIEWED: 'badge-warning',
  SHORTLISTED: 'badge-success',
  REJECTED: 'badge-danger',
  SELECTED: 'badge-success'
}

export default function CandidateDashboard() {
  const { user, logout } = useAuthStore()
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    try {
      const response = await applicationService.getCandidateApplications()
      setApplications(response.applications)
    } catch (error) {
      toast.error('Failed to fetch applications')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    window.location.href = '/'
  }

  const stats = {
    total: applications.length,
    viewed: applications.filter(a => a.status === 'VIEWED').length,
    shortlisted: applications.filter(a => a.status === 'SHORTLISTED').length,
    selected: applications.filter(a => a.status === 'SELECTED').length
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Briefcase className="h-8 w-8 text-primary-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Candidate Dashboard</h1>
                <p className="text-sm text-gray-600">Welcome back, {user?.fullName}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/candidate/jobs" className="btn-primary">
                Browse Jobs
              </Link>
              <button onClick={handleLogout} className="flex items-center space-x-2 text-gray-700 hover:text-red-600">
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Applications</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <FileText className="h-12 w-12 text-primary-600" />
            </div>
          </div>
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Viewed</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.viewed}</p>
              </div>
              <FileText className="h-12 w-12 text-yellow-600" />
            </div>
          </div>
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Shortlisted</p>
                <p className="text-3xl font-bold text-green-600">{stats.shortlisted}</p>
              </div>
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
          </div>
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Selected</p>
                <p className="text-3xl font-bold text-blue-600">{stats.selected}</p>
              </div>
              <CheckCircle className="h-12 w-12 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Recent Applications */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Your Applications</h2>
          <Link to="/candidate/applications" className="text-primary-600 hover:underline">
            View All
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading...</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="card text-center py-12">
            <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No applications yet</h3>
            <p className="text-gray-600 mb-4">Start applying to jobs that match your skills</p>
            <Link to="/candidate/jobs" className="btn-primary inline-block">
              Browse Jobs
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.slice(0, 5).map((app) => (
              <div key={app.id} className="card hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{app.jobPost?.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      {app.jobPost?.recruiter.fullName} • {app.jobPost?.location}
                      {app.jobPost?.isRemote && ' • Remote'}
                    </p>
                    <div className="flex items-center gap-4">
                      <span className={`badge ${statusColors[app.status]}`}>{app.status}</span>
                      {app.suitabilityScore && (
                        <span className="text-sm text-gray-600">
                          AI Score: <span className="font-semibold text-primary-600">{app.suitabilityScore.toFixed(0)}/100</span>
                        </span>
                      )}
                      {app.projectComplexityScore && (
                        <span className="text-sm text-gray-600">
                          Complexity: <span className="font-semibold text-purple-600">{app.projectComplexityScore.toFixed(0)}/100</span>
                        </span>
                      )}
                      <span className="text-sm text-gray-500">
                        Applied {new Date(app.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <Link to="/candidate/jobs" className="card hover:shadow-lg transition-shadow cursor-pointer">
            <Briefcase className="h-12 w-12 text-primary-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Browse Jobs</h3>
            <p className="text-gray-600">Find and apply to jobs that match your skills and experience</p>
          </Link>
          <Link to="/candidate/applications" className="card hover:shadow-lg transition-shadow cursor-pointer">
            <FileText className="h-12 w-12 text-green-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Track Applications</h3>
            <p className="text-gray-600">Monitor the status of all your job applications</p>
          </Link>
        </div>
      </main>
    </div>
  )
}
