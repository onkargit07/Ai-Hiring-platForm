import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { jobService, JobPost } from '../../services/jobService'
import { Briefcase, Plus, Users, Eye, LogOut, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function RecruiterDashboard() {
  const { user, logout } = useAuthStore()
  const [jobs, setJobs] = useState<JobPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      const response = await jobService.getRecruiterJobs()
      setJobs(response.jobs)
    } catch (error) {
      toast.error('Failed to fetch jobs')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    window.location.href = '/'
  }

  const handleDeleteJob = async (jobId: string, jobTitle: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${jobTitle}"?\n\nThis action cannot be undone and will also delete all applications for this job.`
    )
    
    if (!confirmed) return

    try {
      await jobService.deleteJob(jobId)
      toast.success('Job post deleted successfully!')
      // Refresh the jobs list
      fetchJobs()
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to delete job post')
    }
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
                <h1 className="text-2xl font-bold text-gray-900">Recruiter Dashboard</h1>
                <p className="text-sm text-gray-600">Welcome back, {user?.fullName}</p>
              </div>
            </div>
            <button onClick={handleLogout} className="flex items-center space-x-2 text-gray-700 hover:text-red-600">
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Jobs</p>
                <p className="text-3xl font-bold text-gray-900">{jobs.filter(j => j.isActive).length}</p>
              </div>
              <Briefcase className="h-12 w-12 text-primary-600" />
            </div>
          </div>
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Applications</p>
                <p className="text-3xl font-bold text-gray-900">
                  {jobs.reduce((sum, job) => sum + (job._count?.applications || 0), 0)}
                </p>
              </div>
              <Users className="h-12 w-12 text-green-600" />
            </div>
          </div>
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Jobs</p>
                <p className="text-3xl font-bold text-gray-900">{jobs.length}</p>
              </div>
              <Eye className="h-12 w-12 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Your Job Postings</h2>
          <Link to="/recruiter/jobs/create" className="btn-primary flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Create New Job</span>
          </Link>
        </div>

        {/* Jobs List */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="card text-center py-12">
            <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No jobs yet</h3>
            <p className="text-gray-600 mb-4">Create your first job posting to start receiving applications</p>
            <Link to="/recruiter/jobs/create" className="btn-primary inline-block">
              Create Job Post
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div key={job.id} className="card hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => handleDeleteJob(job.id, job.title)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors group"
                          title="Delete job post"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="badge badge-info">{job.location}</span>
                      {job.isRemote && <span className="badge badge-success">Remote</span>}
                      <span className="badge badge-warning">{job.experienceLevel}</span>
                      <span className={`badge ${job.isActive ? 'badge-success' : 'badge-error'}`}>
                        {job.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3 line-clamp-2">{job.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {job.skillsRequired.slice(0, 5).map((skill, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                          {skill}
                        </span>
                      ))}
                      {job.skillsRequired.length > 5 && (
                        <span className="px-2 py-1 text-gray-500 text-sm">
                          +{job.skillsRequired.length - 5} more
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="ml-6 text-right min-w-[180px]">
                    <div className="mb-4">
                      <p className="text-2xl font-bold text-primary-600">{job._count?.applications || 0}</p>
                      <p className="text-sm text-gray-600">Applications</p>
                    </div>
                    <div className="space-y-2">
                      <Link
                        to={`/recruiter/jobs/${job.id}/applications`}
                        className="btn-primary w-full inline-flex items-center justify-center space-x-2"
                      >
                        <Eye className="h-4 w-4" />
                        <span>View Applications</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
