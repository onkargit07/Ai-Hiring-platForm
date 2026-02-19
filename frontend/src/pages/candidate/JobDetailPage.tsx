import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, MapPin, IndianRupee, GraduationCap } from 'lucide-react'
import toast from 'react-hot-toast'
import { jobService, JobPost } from '../../services/jobService'

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [job, setJob] = useState<JobPost | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchJob()
  }, [id])

  const fetchJob = async () => {
    try {
      const response = await jobService.getJobById(id!)
      setJob(response.job)
    } catch (error) {
      toast.error('Failed to fetch job details')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Job not found</p>
          <Link to="/candidate/jobs" className="btn-primary">
            Back to Jobs
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/candidate/jobs" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Jobs
        </Link>

        <div className="card">
          {/* Header */}
          <div className="mb-6 pb-6 border-b">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">{job.title}</h1>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="badge badge-info flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {job.location}
              </span>
              {job.isRemote && <span className="badge badge-success">Remote</span>}
              <span className="badge badge-warning">{job.experienceLevel}</span>
            </div>
            <p className="text-gray-600">Posted by: {job.recruiter?.fullName}</p>
            <p className="text-sm text-gray-500">
              Posted on {new Date(job.createdAt).toLocaleDateString()} • {job._count?.applications || 0} applicants
            </p>
          </div>

          {/* Salary */}
          {job.salaryMin && job.salaryMax && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <IndianRupee className="h-5 w-5 text-gray-700" />
                <h2 className="text-xl font-semibold text-gray-900">Salary Range</h2>
              </div>
              <p className="text-2xl font-bold text-primary-600">
                ₹{job.salaryMin.toLocaleString()} - ₹{job.salaryMax.toLocaleString()}
              </p>
            </div>
          )}

          {/* Description */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Job Description</h2>
            <p className="text-gray-600 whitespace-pre-line">{job.description}</p>
          </div>

          {/* Required Skills */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Required Skills</h2>
            <div className="flex flex-wrap gap-2">
              {job.skillsRequired.map((skill) => (
                <span key={skill} className="px-3 py-2 bg-primary-100 text-primary-700 rounded-lg font-medium">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Education */}
          {job.education && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <GraduationCap className="h-5 w-5 text-gray-700" />
                <h2 className="text-xl font-semibold text-gray-900">Education Requirements</h2>
              </div>
              <p className="text-gray-600">{job.education}</p>
            </div>
          )}

          {/* Custom Questions */}
          {job.customQuestions && Array.isArray(job.customQuestions) && job.customQuestions.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Screening Questions</h2>
              <div className="space-y-2">
                {job.customQuestions.map((question: string, index: number) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-gray-700">{index + 1}. {question}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Apply Button */}
          <div className="pt-6 border-t">
            <button
              onClick={() => navigate(`/candidate/jobs/${id}/apply`)}
              className="btn-primary w-full md:w-auto text-lg px-8 py-3"
            >
              Apply for this Position
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
