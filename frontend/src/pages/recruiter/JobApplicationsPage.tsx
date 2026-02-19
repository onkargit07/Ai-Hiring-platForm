import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { ArrowLeft, Download, Star, Award, TrendingUp, Zap, Code, Lightbulb, Target, AlertTriangle } from 'lucide-react'
import { applicationService, Application } from '../../services/applicationService'
import { jobService, JobPost } from '../../services/jobService'

const statusColors = {
  APPLIED: 'badge-info',
  VIEWED: 'badge-warning',
  SHORTLISTED: 'badge-success',
  REJECTED: 'badge-danger',
  SELECTED: 'badge-success'
}

export default function JobApplicationsPage() {
  const { id } = useParams<{ id: string }>()
  const [job, setJob] = useState<JobPost | null>(null)
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [id])

  const fetchData = async () => {
    try {
      const [jobResponse, appResponse] = await Promise.all([
        jobService.getJobById(id!),
        applicationService.getJobApplications(id!)
      ])
      setJob(jobResponse.job)
      setApplications(appResponse.applications)
    } catch (error) {
      toast.error('Failed to fetch applications')
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (applicationId: string, status: string) => {
    try {
      await applicationService.updateApplicationStatus(applicationId, status)
      toast.success('Status updated successfully')
      fetchData()
    } catch (error) {
      toast.error('Failed to update status')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/recruiter/dashboard" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Dashboard
        </Link>

        {/* Job Info */}
        {job && (
          <div className="card mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="badge badge-info">{job.location}</span>
              {job.isRemote && <span className="badge badge-success">Remote</span>}
              <span className="badge badge-warning">{job.experienceLevel}</span>
            </div>
            <p className="text-gray-600 mb-4">{job.description}</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Required Skills:</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {job.skillsRequired.map((skill) => (
                    <span key={skill} className="px-2 py-1 bg-primary-100 text-primary-700 rounded text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-primary-600">{applications.length}</p>
                <p className="text-sm text-gray-600">Total Applications</p>
              </div>
            </div>
          </div>
        )}

        {/* Applications List */}
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Applications (AI Sorted)</h2>
            <p className="text-sm text-gray-600">
              Top 10 candidates marked with <Award className="inline h-4 w-4 text-yellow-500" />
            </p>
          </div>

          {applications.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No applications yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((app) => (
                <div key={app.id} className={`border rounded-lg p-6 ${app.isTopCandidate ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200 bg-white'}`}>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-3">
                      {app.isTopCandidate && <Award className="h-6 w-6 text-yellow-500" />}
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="text-xl font-semibold text-gray-900">{app.candidate?.fullName}</h3>
                          <span className="text-sm text-gray-600">#{app.rank}</span>
                        </div>
                        <p className="text-sm text-gray-600">{app.candidate?.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center justify-end gap-2 mb-2">
                        <Star className="h-6 w-6 text-yellow-500 fill-current" />
                        <span className="text-3xl font-bold text-gray-900">{app.suitabilityScore?.toFixed(0)}</span>
                        <span className="text-gray-600">/100</span>
                      </div>
                      {app.projectComplexityScore !== null && app.projectComplexityScore !== undefined && (
                        <div className="flex items-center justify-end gap-2 mb-2">
                          <TrendingUp className="h-5 w-5 text-purple-500" />
                          <span className="text-sm text-gray-700">
                            Complexity: <span className="font-semibold text-purple-600">{app.projectComplexityScore.toFixed(0)}/100</span>
                          </span>
                        </div>
                      )}
                      {app.experienceYears && (
                        <p className="text-sm text-gray-600 mb-2">
                          {app.experienceYears} years experience
                        </p>
                      )}
                      {app.isOverqualified && (
                        <div className="flex items-center gap-1 mb-2 text-orange-600">
                          <AlertTriangle className="h-4 w-4" />
                          <span className="text-xs font-semibold">Overqualified</span>
                        </div>
                      )}
                      <span className={`badge ${statusColors[app.status]}`}>{app.status}</span>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Skills</p>
                      <div className="flex flex-wrap gap-2">
                        {app.skills.map((skill) => (
                          <span key={skill} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Experience</p>
                      <p className="text-gray-600">{app.experience}</p>
                    </div>
                    {app.educationLevel && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Education</p>
                        <p className="text-gray-600">{app.educationLevel}</p>
                      </div>
                    )}
                    {app.portfolio && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Portfolio</p>
                        <a href={app.portfolio} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
                          View Portfolio
                        </a>
                      </div>
                    )}
                  </div>

                  {app.coverLetter && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-1">Cover Letter</p>
                      <p className="text-gray-600 text-sm line-clamp-3">{app.coverLetter}</p>
                    </div>
                  )}

                  {/* AI Analysis Section */}
                  {app.aiAnalysis && (
                    <div className="mb-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-200">
                      <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center">
                        <Zap className="h-4 w-4 mr-2 text-purple-600" />
                        AI Deep Analysis
                      </h4>
                      
                      {/* Overqualification Warning */}
                      {app.aiAnalysis.isOverqualified && app.aiAnalysis.overqualificationReason && (
                        <div className="mb-3 bg-orange-100 border border-orange-300 rounded-lg p-3">
                          <div className="flex items-start gap-2">
                            <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-sm font-bold text-orange-900">Overqualified Candidate</p>
                              <p className="text-xs text-orange-800 mt-1">{app.aiAnalysis.overqualificationReason}</p>
                              <p className="text-xs text-orange-700 mt-2">
                                Score has been adjusted (-15 to -25 points) to ensure fairness for appropriately-leveled candidates.
                                This candidate may seek higher compensation or responsibilities.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Scoring Breakdown */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                        <div className="text-center">
                          <p className="text-xs text-gray-600">Skills Match</p>
                          <p className="text-lg font-bold text-blue-600">{app.aiAnalysis.skillsMatch?.toFixed(0)}%</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-600">Experience</p>
                          <p className="text-lg font-bold text-green-600">{app.aiAnalysis.experienceMatch?.toFixed(0)}%</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-600">Education</p>
                          <p className="text-lg font-bold text-orange-600">{app.aiAnalysis.educationMatch?.toFixed(0)}%</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-600">Complexity</p>
                          <p className="text-lg font-bold text-purple-600">{app.aiAnalysis.projectComplexityScore?.toFixed(0)}%</p>
                        </div>
                      </div>

                      {/* Project Complexity Breakdown */}
                      {app.aiAnalysis.projectComplexityBreakdown && (
                        <div className="mb-3 bg-white rounded p-3">
                          <p className="text-xs font-semibold text-gray-700 mb-2">Project Complexity Factors:</p>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600 flex items-center">
                                <Code className="h-3 w-3 mr-1" />
                                Technical Depth
                              </span>
                              <span className="font-semibold text-gray-900">
                                {app.aiAnalysis.projectComplexityBreakdown.technicalDepth?.toFixed(0)}%
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600 flex items-center">
                                <Lightbulb className="h-3 w-3 mr-1" />
                                Innovation
                              </span>
                              <span className="font-semibold text-gray-900">
                                {app.aiAnalysis.projectComplexityBreakdown.innovation?.toFixed(0)}%
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600 flex items-center">
                                <TrendingUp className="h-3 w-3 mr-1" />
                                Scalability
                              </span>
                              <span className="font-semibold text-gray-900">
                                {app.aiAnalysis.projectComplexityBreakdown.scalability?.toFixed(0)}%
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600 flex items-center">
                                <Target className="h-3 w-3 mr-1" />
                                Real Impact
                              </span>
                              <span className="font-semibold text-gray-900">
                                {app.aiAnalysis.projectComplexityBreakdown.realWorldImpact?.toFixed(0)}%
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Key Projects */}
                      {app.aiAnalysis.projects && app.aiAnalysis.projects.length > 0 && (
                        <div className="mb-3">
                          <p className="text-xs font-semibold text-gray-700 mb-2">Key Projects Identified:</p>
                          <div className="space-y-2">
                            {app.aiAnalysis.projects.slice(0, 3).map((project: any, idx: number) => (
                              <div key={idx} className="bg-white rounded p-2 text-xs">
                                <div className="flex items-start justify-between">
                                  <p className="font-semibold text-gray-900">{project.name}</p>
                                  <span className="text-purple-600 font-bold">{project.complexity}/100</span>
                                </div>
                                {project.technologies && (
                                  <p className="text-gray-600 text-xs mt-1">
                                    {project.technologies.join(', ')}
                                  </p>
                                )}
                                {project.impact && (
                                  <p className="text-gray-700 mt-1">{project.impact}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Strengths & Weaknesses */}
                      <div className="grid md:grid-cols-2 gap-3 text-xs">
                        <div>
                          <p className="font-semibold text-green-700 mb-1">✓ Strengths:</p>
                          <ul className="list-disc list-inside text-gray-700 space-y-1">
                            {app.aiAnalysis.strengths?.slice(0, 3).map((strength: string, idx: number) => (
                              <li key={idx}>{strength}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="font-semibold text-orange-700 mb-1">⚠ Areas to Explore:</p>
                          <ul className="list-disc list-inside text-gray-700 space-y-1">
                            {app.aiAnalysis.weaknesses?.slice(0, 3).map((weakness: string, idx: number) => (
                              <li key={idx}>{weakness}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Recommendation */}
                      {app.aiAnalysis.recommendation && (
                        <div className="mt-3 pt-3 border-t border-purple-200">
                          <p className="text-xs font-semibold text-gray-700 mb-1">AI Recommendation:</p>
                          <p className="text-xs text-gray-900 bg-white rounded p-2">{app.aiAnalysis.recommendation}</p>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 pt-4 border-t">
                    <a
                      href={`${import.meta.env.VITE_API_URL || ''}${app.resumeUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary inline-flex items-center space-x-2"
                    >
                      <Download className="h-4 w-4" />
                      <span>Download Resume</span>
                    </a>
                    {app.status === 'APPLIED' && (
                      <button onClick={() => updateStatus(app.id, 'VIEWED')} className="btn-secondary">
                        Mark as Viewed
                      </button>
                    )}
                    <button onClick={() => updateStatus(app.id, 'SHORTLISTED')} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                      Shortlist
                    </button>
                    <button onClick={() => updateStatus(app.id, 'REJECTED')} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
                      Reject
                    </button>
                    <button onClick={() => updateStatus(app.id, 'SELECTED')} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                      Select
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
