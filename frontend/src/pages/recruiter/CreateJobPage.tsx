import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { ArrowLeft, Plus, X } from 'lucide-react'
import { jobService, CreateJobData } from '../../services/jobService'

export default function CreateJobPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<CreateJobData & { skillInput: string; customQuestionInput: string }>({
    defaultValues: {
      isRemote: false,
      skillsRequired: [],
      customQuestions: []
    }
  })

  const [skills, setSkills] = useState<string[]>([])
  const [skillInput, setSkillInput] = useState('')
  const [customQuestions, setCustomQuestions] = useState<string[]>([])
  const [questionInput, setQuestionInput] = useState('')

  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()])
      setSkillInput('')
    }
  }

  const removeSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill))
  }

  const addQuestion = () => {
    if (questionInput.trim()) {
      setCustomQuestions([...customQuestions, questionInput.trim()])
      setQuestionInput('')
    }
  }

  const removeQuestion = (index: number) => {
    setCustomQuestions(customQuestions.filter((_, i) => i !== index))
  }

  const onSubmit = async (data: any) => {
    if (skills.length === 0) {
      toast.error('Please add at least one required skill')
      return
    }

    try {
      setLoading(true)
      await jobService.createJob({
        ...data,
        skillsRequired: skills,
        customQuestions: customQuestions.length > 0 ? customQuestions : undefined,
        salaryMin: data.salaryMin ? parseInt(data.salaryMin) : undefined,
        salaryMax: data.salaryMax ? parseInt(data.salaryMax) : undefined
      })
      toast.success('Job posted successfully!')
      navigate('/recruiter/dashboard')
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to create job')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/recruiter/dashboard" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Dashboard
        </Link>

        <div className="card">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Create Job Posting</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Info */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Job Title *</label>
              <input
                {...register('title', { required: 'Job title is required' })}
                type="text"
                className="input-field"
                placeholder="e.g., Senior Full Stack Developer"
              />
              {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Job Description *</label>
              <textarea
                {...register('description', { required: 'Description is required' })}
                rows={6}
                className="input-field"
                placeholder="Describe the role, responsibilities, and what makes your company great..."
              />
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
            </div>

            {/* Skills */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Required Skills *</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  className="input-field"
                  placeholder="Type a skill and press Enter"
                />
                <button type="button" onClick={addSkill} className="btn-primary">
                  <Plus className="h-5 w-5" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span key={skill} className="badge badge-info flex items-center gap-2">
                    {skill}
                    <button type="button" onClick={() => removeSkill(skill)}>
                      <X className="h-4 w-4" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Location and Remote */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                <input
                  {...register('location', { required: 'Location is required' })}
                  type="text"
                  className="input-field"
                  placeholder="e.g., New York, NY"
                />
                {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level *</label>
                <select {...register('experienceLevel', { required: 'Experience level is required' })} className="input-field">
                  <option value="">Select level</option>
                  <option value="Entry Level">Entry Level</option>
                  <option value="Junior">Junior</option>
                  <option value="Mid Level">Mid Level</option>
                  <option value="Senior">Senior</option>
                  <option value="Lead">Lead</option>
                </select>
                {errors.experienceLevel && <p className="mt-1 text-sm text-red-600">{errors.experienceLevel.message}</p>}
              </div>
            </div>

            <div className="flex items-center">
              <input
                {...register('isRemote')}
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900">
                This is a remote position
              </label>
            </div>

            {/* Salary */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Salary (optional)</label>
                <input
                  {...register('salaryMin')}
                  type="number"
                  className="input-field"
                  placeholder="50000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Salary (optional)</label>
                <input
                  {...register('salaryMax')}
                  type="number"
                  className="input-field"
                  placeholder="100000"
                />
              </div>
            </div>

            {/* Education */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Education (optional)</label>
              <input
                {...register('education')}
                type="text"
                className="input-field"
                placeholder="e.g., Bachelor's degree in Computer Science"
              />
            </div>

            {/* Custom Questions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Custom Screening Questions (optional)</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={questionInput}
                  onChange={(e) => setQuestionInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addQuestion())}
                  className="input-field"
                  placeholder="Type a question and press Enter"
                />
                <button type="button" onClick={addQuestion} className="btn-primary">
                  <Plus className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-2">
                {customQuestions.map((question, index) => (
                  <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <span className="flex-1 text-sm text-gray-700">{index + 1}. {question}</span>
                    <button type="button" onClick={() => removeQuestion(index)} className="text-red-600 hover:text-red-800">
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Job Post'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/recruiter/dashboard')}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
