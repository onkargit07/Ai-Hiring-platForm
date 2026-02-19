import api from '../lib/api'

export interface JobPost {
  id: string
  title: string
  description: string
  skillsRequired: string[]
  experienceLevel: string
  location: string
  isRemote: boolean
  salaryMin?: number
  salaryMax?: number
  education?: string
  customQuestions?: any
  requiredFields?: any
  optionalFields?: any
  isActive: boolean
  createdAt: string
  recruiter?: {
    id: string
    fullName: string
  }
  _count?: {
    applications: number
  }
}

export interface CreateJobData {
  title: string
  description: string
  skillsRequired: string[]
  experienceLevel: string
  location: string
  isRemote: boolean
  salaryMin?: number
  salaryMax?: number
  education?: string
  customQuestions?: any
  requiredFields?: string[]
  optionalFields?: string[]
}

export const jobService = {
  getAllJobs: async (filters?: {
    role?: string
    location?: string
    experienceLevel?: string
    skills?: string
  }) => {
    const params = new URLSearchParams()
    if (filters?.role) params.append('role', filters.role)
    if (filters?.location) params.append('location', filters.location)
    if (filters?.experienceLevel) params.append('experienceLevel', filters.experienceLevel)
    if (filters?.skills) params.append('skills', filters.skills)

    const response = await api.get(`/jobs?${params.toString()}`)
    return response.data
  },

  getJobById: async (id: string) => {
    const response = await api.get(`/jobs/${id}`)
    return response.data
  },

  getRecruiterJobs: async () => {
    const response = await api.get('/jobs/recruiter/my-jobs')
    return response.data
  },

  createJob: async (data: CreateJobData) => {
    const response = await api.post('/jobs', data)
    return response.data
  },

  updateJob: async (id: string, data: Partial<CreateJobData>) => {
    const response = await api.put(`/jobs/${id}`, data)
    return response.data
  },

  deleteJob: async (id: string) => {
    const response = await api.delete(`/jobs/${id}`)
    return response.data
  },
}
