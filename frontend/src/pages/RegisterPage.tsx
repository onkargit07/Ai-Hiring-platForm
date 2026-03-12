import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Briefcase } from 'lucide-react'
import { authService } from '../services/authService'
import { useAuthStore } from '../store/authStore'

interface RegisterForm {
  email: string
  password: string
  confirmPassword: string
  fullName: string
  company?: string
  role: 'RECRUITER' | 'CANDIDATE'
}

export default function RegisterPage() {
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterForm>({
    defaultValues: { role: 'CANDIDATE' }
  })

  const password = watch('password')
  const selectedRole = watch('role')

  const onSubmit = async (data: RegisterForm) => {
    try {
      setLoading(true)
      const { confirmPassword, ...registerData } = data
      const response = await authService.register(registerData)
      setAuth(response.user, response.token)
      toast.success('Registration successful!')
      
      // Redirect based on role
      if (response.user.role === 'RECRUITER') {
        navigate('/recruiter/dashboard')
      } else {
        navigate('/candidate/dashboard')
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-accent-50 -z-10"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-accent-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{animationDelay: '2s'}}></div>
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <Link to="/" className="flex justify-center">
          <div className="bg-gradient-to-br from-primary-600 to-primary-700 p-3 rounded-2xl shadow-xl">
            <Briefcase className="h-10 w-10 text-white" />
          </div>
        </Link>
        <h2 className="mt-8 text-center text-4xl font-black text-gray-900">
          Join TalentAI
        </h2>
        <p className="mt-3 text-center text-lg text-gray-600">
          Start hiring smarter with AI-powered recruitment
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="card-glass border-2 border-white/40">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                I am a
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className="relative flex cursor-pointer rounded-xl border-2 border-gray-200 bg-white p-5 hover:border-primary-400 hover:shadow-lg transition-all duration-300 group">
                  <input
                    {...register('role')}
                    type="radio"
                    value="CANDIDATE"
                    className="sr-only"
                  />
                  <div className="flex flex-col flex-1 items-center text-center">
                    <div className="w-10 h-10 bg-accent-100 text-accent-600 rounded-lg flex items-center justify-center mb-2 group-hover:bg-accent-200 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <span className="block text-sm font-bold text-gray-900">Candidate</span>
                    <span className="mt-1 text-xs text-gray-500">Looking for jobs</span>
                  </div>
                </label>
                <label className="relative flex cursor-pointer rounded-xl border-2 border-gray-200 bg-white p-5 hover:border-primary-400 hover:shadow-lg transition-all duration-300 group">
                  <input
                    {...register('role')}
                    type="radio"
                    value="RECRUITER"
                    className="sr-only"
                  />
                  <div className="flex flex-col flex-1 items-center text-center">
                    <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center mb-2 group-hover:bg-primary-200 transition-colors">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <span className="block text-sm font-bold text-gray-900">Recruiter</span>
                    <span className="mt-1 text-xs text-gray-500">Hiring talent</span>
                  </div>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              <input
                {...register('fullName', { required: 'Full name is required' })}
                type="text"
                className="input-field"
                placeholder="John Doe"
              />
              {errors.fullName && <p className="mt-2 text-sm text-red-600">{errors.fullName.message}</p>}
            </div>

            {selectedRole === 'RECRUITER' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Company Name
                </label>
                <input
                  {...register('company', { 
                    required: selectedRole === 'RECRUITER' ? 'Company name is required for recruiters' : false 
                  })}
                  type="text"
                  className="input-field"
                  placeholder="Acme Corp"
                />
                {errors.company && <p className="mt-2 text-sm text-red-600">{errors.company.message}</p>}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email address
              </label>
              <input
                {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } })}
                type="email"
                className="input-field"
                placeholder="you@example.com"
              />
              {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <input
                {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Minimum 6 characters' } })}
                type="password"
                className="input-field"
                placeholder="••••••••"
              />
              {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                {...register('confirmPassword', { 
                  required: 'Please confirm password',
                  validate: value => value === password || 'Passwords do not match'
                })}
                type="password"
                className="input-field"
                placeholder="••••••••"
              />
              {errors.confirmPassword && <p className="mt-2 text-sm text-red-600">{errors.confirmPassword.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-700 transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <Link to="/" className="text-sm text-gray-600 hover:text-primary-600 transition-colors font-medium">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}
