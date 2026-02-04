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
      const { data } = await api.post('/login', credentials)

      const token = data.data?.token || data.token
      const user = data.data?.user || data.user

      this.token = token
      this.user = user
      this.isLoggedIn = true

      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))

      return true
    },

    async register(payload: RegisterPayload) {
      try {
<<<<<<< HEAD
        const response = await fetch('http://127.0.0.1:8000/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(credentials),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || 'Login failed')
        }

        // Save to state
        this.token = data.data.access_token
        this.user = data.data.user
        this.isLoggedIn = true

        // Save to localStorage
        localStorage.setItem('token', data.data.access_token)
        localStorage.setItem('user', JSON.stringify(data.data.user))

        return { success: true }
      } catch (error) {
        console.error('Login failed:', error)
=======
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
>>>>>>> 1bc0a473434b7cc1c74f8beac1747ae3953dc831
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
