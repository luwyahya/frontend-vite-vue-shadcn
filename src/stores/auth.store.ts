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
      const response = await api.post('/login', credentials)
      console.log('Login response:', response)
      console.log('Response data:', response.data)
      console.log('Nested data:', response.data.data)

      // Handle Laravel custom response format: {success, message, data: {access_token, user}}
      const token = response.data.data?.access_token
      const user = response.data.data?.user

      if (!token) {
        console.error('No token found in response:', response)
        console.error('Available keys in response.data.data:', Object.keys(response.data.data || {}))
        throw new Error('Login failed: No token received')
      }

      this.token = token
      this.user = user
      this.isLoggedIn = true

      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))

      return true
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
