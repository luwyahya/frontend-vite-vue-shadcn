// Generic Laravel API Resource response format
export interface LaravelApiResponse<T> {
  data: T
  meta?: PaginationMeta
  links?: PaginationLinks
}

// Backend API response format with success flag
export interface BackendApiResponse<T> {
  success: boolean
  message: string
  data: T
}

// Union type for both response formats
export type ApiResponse<T> = LaravelApiResponse<T> | BackendApiResponse<T>

// Pagination metadata from Laravel
export interface PaginationMeta {
  current_page: number
  from: number | null
  last_page: number
  path: string
  per_page: number
  to: number | null
  total: number
}

// Pagination links
export interface PaginationLinks {
  first: string | null
  last: string | null
  prev: string | null
  next: string | null
}

// Generic API error response
export interface ApiError {
  message: string
  errors?: Record<string, string[]>
}
