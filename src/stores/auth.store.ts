import { defineStore } from 'pinia'
import type { AuthState, User, LoginCredentials } from '@/types/auth.types'
import { api } from '@/services/api.service'

interface RegisterPayload {
  name: string
  email: string
  password: string
  password_confirmation: string
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    isLoggedIn: !!localStorage.getItem('token'),
    token: localStorage.getItem('token'),
    user: localStorage.getItem('user')
      ? JSON.parse(localStorage.getItem('user')!)
      : null,
  }),

  getters: {
    isAuthenticated: (state) => state.isLoggedIn && !!state.token,
  },

  actions: {
  async login(credentials: LoginCredentials) {
    try {
      const response = await api.post('/login', credentials)
      
      const { access_token, user } = response.data.data
      
      this.token = access_token
      this.user = user
      this.isLoggedIn = true
      
      localStorage.setItem('token', access_token)
      localStorage.setItem('user', JSON.stringify(user))
      
      return true
    } catch (error: any) {
      console.error('API Error:', error)
      
      // Handle different error scenarios
      if (error.response) {
        // Server responded with error status
        const status = error.response.status
        const message = error.response.data?.message
        
        if (status === 401) {
          throw new Error('Email atau password salah')
        } else if (status === 422) {
          throw new Error('Data tidak valid')
        } else {
          throw new Error(message || 'Login gagal')
        }
      } else if (error.request) {
        // Network error - API tidak bisa diakses
        throw new Error('Tidak dapat terhubung ke server')
      } else {
        // Other error
        throw new Error('Terjadi kesalahan')
      }
    }
  },

    async register(payload: RegisterPayload) {
      try {
        await api.post('/register', payload)
        return true
      } catch (error: any) {
        if (error.response?.status === 422) {
          // Validation errors dari Laravel
          const validationErrors = error.response.data.errors || {}
          console.error('Validation errors:', validationErrors)
          throw {
            message: 'Validation failed',
            errors: validationErrors
          }
        }
        throw error
      }
    },

    logout() {
      this.token = null
      this.user = null
      this.isLoggedIn = false

      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },

    checkAuth() {
      const token = localStorage.getItem('token')
      const user = localStorage.getItem('user')

      if (token && user) {
        this.token = token
        this.user = JSON.parse(user)
        this.isLoggedIn = true
      } else {
        this.logout()
      }
    },
  },
})
