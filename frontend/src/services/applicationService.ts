import api from '../lib/api'

export interface Application {
  id: string
  status: 'APPLIED' | 'VIEWED' | 'SHORTLISTED' | 'REJECTED' | 'SELECTED'
  resumeUrl: string
  skills: string[]
  experience: string
  educationLevel?: string
  portfolio?: string
  coverLetter?: string
  suitabilityScore?: number
  projectComplexityScore?: number
  experienceYears?: number
  isOverqualified?: boolean
  aiAnalysis?: {
    score: number
    skillsMatch: number
    experienceMatch: number
    educationMatch: number
    projectComplexityScore: number
    experienceYears: number
    isOverqualified: boolean
    overqualificationReason?: string
    projectComplexityBreakdown?: {
      technicalDepth: number
      innovation: number
      scalability: number
      realWorldImpact: number
      complexityRelativeToExperience: number
    }
    projects?: Array<{
      name: string
      complexity: number
      technologies: string[]
      impact: string
    }>
    strengths: string[]
    weaknesses: string[]
    recommendation: string
  }
  createdAt: string
  candidate?: {
    id: string
    fullName: string
    email: string
  }
  jobPost?: {
    id: string
    title: string
    location: string
    isRemote: boolean
    experienceLevel: string
    recruiter: {
      fullName: string
    }
  }
  rank?: number
  isTopCandidate?: boolean
}

export const applicationService = {
  applyToJob: async (formData: FormData) => {
    const response = await api.post('/applications/apply', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  getJobApplications: async (jobId: string) => {
    const response = await api.get(`/applications/job/${jobId}`)
    return response.data
  },

  getCandidateApplications: async () => {
    const response = await api.get('/applications/my-applications')
    return response.data
  },

  updateApplicationStatus: async (id: string, status: string) => {
    const response = await api.patch(`/applications/${id}/status`, { status })
    return response.data
  },
}
