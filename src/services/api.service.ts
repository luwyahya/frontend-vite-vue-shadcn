import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios'
import type { ApiError } from '@/types/api.types'

class ApiService {
  private axiosInstance: AxiosInstance

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    // Request interceptor: Add Bearer token to all requests
    this.axiosInstance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('token')
        
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error: AxiosError) => {
        return Promise.reject(error)
      }
    )

    // Response interceptor: Handle errors
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        return response
      },
      (error: AxiosError<ApiError>) => {
        console.log('Interceptor caught error:', error)
        console.log('Error response:', error.response)
        console.log('Error response data:', error.response?.data)
        console.log('Validation errors detail:', error.response?.data?.errors)
        if (error.response?.data?.errors?.category_id) {
          console.log('Category ID error:', error.response.data.errors.category_id)
        }
        
        // Handle 401 Unauthorized
        if (error.response?.status === 401) {
          const currentPath = window.location.pathname
          
          // Only redirect if not already on auth pages
          if (currentPath !== '/login' && currentPath !== '/register') {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            window.location.href = '/login'
          }
        }

        // Handle other errors
        const apiError: ApiError = {
          message: error.response?.data?.message || error.message || 'An error occurred',
          errors: error.response?.data?.errors,
        }

        return Promise.reject(apiError)
      }
    )
  }

  public getInstance(): AxiosInstance {
    return this.axiosInstance
  }
}

export const apiService = new ApiService()
export const api = apiService.getInstance()
