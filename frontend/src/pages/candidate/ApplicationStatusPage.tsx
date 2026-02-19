import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Star } from 'lucide-react'
import toast from 'react-hot-toast'
import { applicationService, Application } from '../../services/applicationService'

const statusColors = {
  APPLIED: 'badge-info',
  VIEWED: 'badge-warning',
  SHORTLISTED: 'badge-success',
  REJECTED: 'badge-danger',
  SELECTED: 'badge-success'
}

const statusDescriptions = {
  APPLIED: 'Your application has been submitted',
  VIEWED: 'Recruiter has viewed your application',
  SHORTLISTED: 'Congratulations! You have been shortlisted',
  REJECTED: 'Unfortunately, your application was not selected',
  SELECTED: 'Congratulations! You have been selected for this position'
}

export default function ApplicationStatusPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')

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

  const filteredApplications = filter === 'all' 
    ? applications 
    : applications.filter(app => app.status === filter)

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/candidate/dashboard" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Dashboard
        </Link>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Your Applications</h1>
          <Link to="/candidate/jobs" className="btn-primary">
            Browse More Jobs
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="card mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium ${filter === 'all' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              All ({applications.length})
            </button>
            <button
              onClick={() => setFilter('APPLIED')}
              className={`px-4 py-2 rounded-lg font-medium ${filter === 'APPLIED' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Applied ({applications.filter(a => a.status === 'APPLIED').length})
            </button>
            <button
              onClick={() => setFilter('VIEWED')}
              className={`px-4 py-2 rounded-lg font-medium ${filter === 'VIEWED' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Viewed ({applications.filter(a => a.status === 'VIEWED').length})
            </button>
            <button
              onClick={() => setFilter('SHORTLISTED')}
              className={`px-4 py-2 rounded-lg font-medium ${filter === 'SHORTLISTED' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Shortlisted ({applications.filter(a => a.status === 'SHORTLISTED').length})
            </button>
            <button
              onClick={() => setFilter('SELECTED')}
              className={`px-4 py-2 rounded-lg font-medium ${filter === 'SELECTED' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Selected ({applications.filter(a => a.status === 'SELECTED').length})
            </button>
            <button
              onClick={() => setFilter('REJECTED')}
              className={`px-4 py-2 rounded-lg font-medium ${filter === 'REJECTED' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Rejected ({applications.filter(a => a.status === 'REJECTED').length})
            </button>
          </div>
        </div>

        {/* Applications List */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading...</p>
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-600 mb-4">No applications found</p>
            <Link to="/candidate/jobs" className="btn-primary inline-block">
              Browse Jobs
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApplications.map((app) => (
              <div key={app.id} className="card hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{app.jobPost?.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      {app.jobPost?.recruiter.fullName} • {app.jobPost?.location}
                      {app.jobPost?.isRemote && ' • Remote'}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`badge ${statusColors[app.status]} mb-2`}>{app.status}</span>
                    {app.suitabilityScore && (
                      <div className="flex items-center gap-1">
                        <Star className="h-5 w-5 text-yellow-500 fill-current" />
                        <span className="text-lg font-semibold text-gray-900">{app.suitabilityScore.toFixed(0)}</span>
                        <span className="text-gray-600">/100</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-700">{statusDescriptions[app.status]}</p>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Applied</p>
                    <p className="text-gray-600">{new Date(app.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Your Skills</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {app.skills.slice(0, 3).map((skill) => (
                        <span key={skill} className="px-2 py-1 bg-white text-gray-700 rounded text-xs border">
                          {skill}
                        </span>
                      ))}
                      {app.skills.length > 3 && (
                        <span className="px-2 py-1 text-gray-500 text-xs">
                          +{app.skills.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Experience Level</p>
                    <p className="text-gray-600">{app.jobPost?.experienceLevel}</p>
                  </div>
                </div>

                {app.suitabilityScore && (
                  <div className="border-t pt-4">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">AI Insight:</span> Your profile scored{' '}
                      <span className="font-semibold text-primary-600">{app.suitabilityScore.toFixed(0)}/100</span>
                      {' '}for this position based on skills match, experience, and qualifications.
                    </p>
                  </div>
                )}

                <div className="flex gap-2 mt-4">
                  <Link to={`/candidate/jobs/${app.jobPost?.id}`} className="btn-secondary">
                    View Job
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
