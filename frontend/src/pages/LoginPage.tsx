import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Briefcase } from 'lucide-react'
import { authService } from '../services/authService'
import { useAuthStore } from '../store/authStore'

interface LoginForm {
  email: string
  password: string
}

export default function LoginPage() {
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>()

  const onSubmit = async (data: LoginForm) => {
    try {
      setLoading(true)
      const response = await authService.login(data)
      setAuth(response.user, response.token)
      toast.success('Login successful!')
      
      // Redirect based on role
      if (response.user.role === 'RECRUITER') {
        navigate('/recruiter/dashboard')
      } else {
        navigate('/candidate/dashboard')
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-accent-50 -z-10"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{animationDelay: '3s'}}></div>
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <Link to="/" className="flex justify-center">
          <div className="bg-gradient-to-br from-primary-600 to-primary-700 p-3 rounded-2xl shadow-xl">
            <Briefcase className="h-10 w-10 text-white" />
          </div>
        </Link>
        <h2 className="mt-8 text-center text-4xl font-black text-gray-900">
          Welcome Back
        </h2>
        <p className="mt-3 text-center text-lg text-gray-600">
          Sign in to continue your hiring journey
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="card-glass border-2 border-white/40">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email address
              </label>
              <input
                {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } })}
                type="email"
                className="input-field"
                placeholder="you@example.com"
              />
              {errors.email && <p className="mt-2 text-sm text-red-600 flex items-center gap-1">{errors.email.message}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <input
                {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Minimum 6 characters' } })}
                type="password"
                className="input-field"
                placeholder="••••••••"
              />
              {errors.password && <p className="mt-2 text-sm text-red-600 flex items-center gap-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold text-primary-600 hover:text-primary-700 transition-colors">
                Create one now
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
