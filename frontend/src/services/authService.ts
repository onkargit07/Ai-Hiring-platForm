import api from '../lib/api'

interface RegisterData {
  email: string
  password: string
  fullName: string
  role: 'RECRUITER' | 'CANDIDATE'
}

interface LoginData {
  email: string
  password: string
}

export const authService = {
  register: async (data: RegisterData) => {
    const response = await api.post('/auth/register', data)
    return response.data
  },

  login: async (data: LoginData) => {
    const response = await api.post('/auth/login', data)
    return response.data
  },
}
