import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { ArrowLeft, Upload, X, FileText, CheckCircle } from 'lucide-react'
import { jobService, JobPost } from '../../services/jobService'
import { applicationService } from '../../services/applicationService'

interface ApplicationForm {
  skills: string[]
  experience: string
  educationLevel: string
  portfolio: string
  coverLetter: string
  resume: FileList
  customAnswers: { [key: string]: string }
  [key: string]: string | string[] | FileList | { [key: string]: string }
}

export default function ApplyJobPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [job, setJob] = useState<JobPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [skillInput, setSkillInput] = useState('')
  const [skills, setSkills] = useState<string[]>([])
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<ApplicationForm>()

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

  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()])
      setSkillInput('')
    }
  }

  const removeSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill))
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleFileSelect = (file: File) => {
    // Validate file type
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a PDF or DOC file')
      return
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB')
      return
    }

    setSelectedFile(file)
    // Update react-hook-form value
    const dataTransfer = new DataTransfer()
    dataTransfer.items.add(file)
    setValue('resume', dataTransfer.files)
    toast.success('Resume uploaded successfully!')
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelect(e.target.files[0])
    }
  }

  const removeFile = () => {
    setSelectedFile(null)
    setValue('resume', undefined as any)
  }

  const onSubmit = async (data: any) => {
    if (skills.length === 0) {
      toast.error('Please add at least one skill')
      return
    }

    if (!data.resume || data.resume.length === 0) {
      toast.error('Please upload your resume')
      return
    }

    try {
      setSubmitting(true)
      const formData = new FormData()
      formData.append('jobPostId', id!)
      formData.append('skills', JSON.stringify(skills))
      formData.append('experience', data.experience)
      if (data.educationLevel) formData.append('educationLevel', data.educationLevel)
      if (data.portfolio) formData.append('portfolio', data.portfolio)
      if (data.coverLetter) formData.append('coverLetter', data.coverLetter)
      formData.append('resume', data.resume[0])

      // Add custom answers if any
      if (job?.customQuestions && Array.isArray(job.customQuestions)) {
        const customAnswers: string[] = []
        job.customQuestions.forEach((_: string, index: number) => {
          if (data[`customAnswer${index}`]) {
            customAnswers.push(data[`customAnswer${index}`])
          }
        })
        if (customAnswers.length > 0) {
          formData.append('customAnswers', JSON.stringify(customAnswers))
        }
      }

      await applicationService.applyToJob(formData)
      toast.success('Application submitted successfully! AI is analyzing your profile...')
      navigate('/candidate/applications')
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to submit application')
    } finally {
      setSubmitting(false)
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
        <Link to={`/candidate/jobs/${id}`} className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Job Details
        </Link>

        <div className="card">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Apply to {job.title}</h1>
          <p className="text-gray-600 mb-6">Fill out the application form below. Our AI will analyze your profile and match you with the job requirements.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Skills */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Skills * <span className="text-gray-500 font-normal">(Add skills one by one)</span>
              </label>
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
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span key={skill} className="badge badge-info flex items-center gap-2">
                    {skill}
                    <button type="button" onClick={() => removeSkill(skill)} className="hover:text-red-600">
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Experience */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Experience *
              </label>
              <textarea
                {...register('experience', { required: 'Experience is required' })}
                rows={4}
                className="input-field"
                placeholder="Describe your relevant work experience..."
              />
              {errors.experience && <p className="mt-1 text-sm text-red-600">{errors.experience.message}</p>}
            </div>

            {/* Education */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Education Level
              </label>
              <select {...register('educationLevel')} className="input-field">
                <option value="">Select education level</option>
                <option value="High School">High School</option>
                <option value="Associate Degree">Associate Degree</option>
                <option value="Bachelor's Degree">Bachelor's Degree</option>
                <option value="Master's Degree">Master's Degree</option>
                <option value="PhD">PhD</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Portfolio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Portfolio URL (optional)
              </label>
              <input
                {...register('portfolio')}
                type="url"
                className="input-field"
                placeholder="https://yourportfolio.com"
              />
            </div>

            {/* Cover Letter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cover Letter (optional)
              </label>
              <textarea
                {...register('coverLetter')}
                rows={6}
                className="input-field"
                placeholder="Tell us why you're a great fit for this role..."
              />
            </div>

            {/* Custom Questions */}
            {job.customQuestions && Array.isArray(job.customQuestions) && job.customQuestions.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Screening Questions</h3>
                <div className="space-y-4">
                  {job.customQuestions.map((question: string, index: number) => (
                    <div key={index}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {index + 1}. {question}
                      </label>
                      <textarea
                        {...register(`customAnswer${index}`)}
                        rows={3}
                        className="input-field"
                        placeholder="Your answer..."
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Resume Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resume * <span className="text-gray-500 font-normal">(PDF or DOC)</span>
              </label>
              
              {!selectedFile ? (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg transition-colors ${
                    isDragging
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
                  }`}
                >
                  <div className="space-y-1 text-center">
                    <Upload className={`mx-auto h-12 w-12 ${
                      isDragging ? 'text-primary-500' : 'text-gray-400'
                    }`} />
                    <div className="flex text-sm text-gray-600">
                      <label className="relative cursor-pointer bg-transparent rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
                        <span>Upload a file</span>
                        <input
                          {...register('resume', { required: 'Resume is required' })}
                          type="file"
                          className="sr-only"
                          accept=".pdf,.doc,.docx"
                          onChange={handleFileInputChange}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      {isDragging ? 'Drop your file here' : 'PDF, DOC up to 5MB'}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="mt-1 flex items-center justify-between p-4 border-2 border-green-500 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                      <p className="text-xs text-gray-500">
                        {(selectedFile.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <button
                    type="button"
                    onClick={removeFile}
                    className="p-1 hover:bg-red-100 rounded-full transition-colors"
                    title="Remove file"
                  >
                    <X className="h-5 w-5 text-red-600" />
                  </button>
                </div>
              )}
              
              {errors.resume && <p className="mt-1 text-sm text-red-600">{errors.resume.message}</p>}
            </div>

            {/* Submit */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Application'}
              </button>
              <button
                type="button"
                onClick={() => navigate(`/candidate/jobs/${id}`)}
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
