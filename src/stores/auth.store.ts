import { defineStore } from 'pinia'
import type { AuthState, User, LoginCredentials } from '@/types/auth.types'

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    isLoggedIn: !!localStorage.getItem('token'),
    token: localStorage.getItem('token'),
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null,
  }),

  getters: {
    isAuthenticated: (state) => state.isLoggedIn && !!state.token,
  },

  actions: {
    async login(credentials: LoginCredentials) {
      try {
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
        throw error
      }
    },

    logout() {
      // Clear state
      this.token = null
      this.user = null
      this.isLoggedIn = false

      // Clear localStorage
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
