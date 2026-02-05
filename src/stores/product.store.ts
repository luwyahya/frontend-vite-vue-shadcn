import { defineStore } from 'pinia'
import { productService } from '@/services/product.service'
import type { ProductFormData, ProductState } from '@/types/product.types'

export const useProductStore = defineStore('product', {
  state: (): ProductState => ({
    items: [],
    loading: false,
    searchQuery: '',
    filters: {
      max_price: '',
      min_price: '',
      sort_by: 'created_at',
      sort_order: 'desc',
      stock_status: 'all',
    },
    pagination: {
      current_page: 1,
      last_page: 1,
      per_page: 10,
      total: 0,
    },
  }),

  actions: {
    async fetchProducts(page: number = 1, perPage: number = 10, _unused?: string, filters?: any) {
      this.loading = true
      try {
        const params = {
          per_page: perPage,
          ...filters
        }
        console.log('Store calling API with params:', { page, ...params })
        
        const response = await productService.getProducts(page, params)
        console.log('Store received response:', response)
        
        // Handle response based on actual backend format
        if (response.success && response.data) {
          this.items = response.data
          
          // Handle pagination from response
          if (response.pagination) {
            this.pagination = {
              current_page: response.pagination.current_page || page,
              last_page: response.pagination.last_page || 1,
              per_page: response.pagination.per_page || perPage,
              total: response.pagination.total || 0,
            }
          } else {
            // Fallback pagination
            this.pagination = {
              current_page: page,
              last_page: Math.ceil((response.total || this.items.length) / perPage),
              per_page: perPage,
              total: response.total || this.items.length,
            }
          }
        } else {
          // Fallback for different response format
          this.items = Array.isArray(response) ? response : response.data || []
          this.pagination = {
            current_page: page,
            last_page: 1,
            per_page: perPage,
            total: this.items.length,
          }
        }
        
        console.log('Final store state:', {
          items: this.items.length,
          pagination: this.pagination
        })
      } catch (error) {
        console.error('Failed to fetch products:', error)
        this.items = []
      } finally {
        this.loading = false
      }
    },

    async searchProducts(query: string) {
      this.searchQuery = query
      const params = {
        q: query,
        ...this.filters
      }
      await this.fetchProducts(1, this.pagination.per_page, undefined, params)
    },

    async filterProducts(filters: any) {
      this.filters = { ...this.filters, ...filters }
      const params = {
        q: this.searchQuery,
        ...this.filters
      }
      await this.fetchProducts(1, this.pagination.per_page, undefined, params)
    },

    async clearFilters() {
      this.searchQuery = ''
      this.filters = {
        max_price: '',
        min_price: '',
        sort_by: 'created_at',
        sort_order: 'desc',
        stock_status: 'all',
      }
      await this.fetchProducts(1, this.pagination.per_page)
    },

    async createProduct(data: ProductFormData) {
      this.loading = true
      try {
        const response: any = await productService.createProduct(data)
        // Handle backend response format
        const newProduct = ('success' in response) ? response.data : response.data
        this.items.unshift(newProduct)
        return newProduct
      } catch (error: any) {
        console.error('Failed to create product:', error)
        console.error('Error response:', error.response)
        console.error('Error response data:', error.response?.data)
        console.error('Validation errors:', error.response?.data?.errors)
        
        // Handle validation errors (422)
        if (error.response?.status === 422) {
          const validationErrors = error.response.data.errors || {}
          console.error('Validation errors:', validationErrors)
          console.error('Full error response:', error.response.data)
          
          // Create user-friendly error message
          const errorMessages = Object.entries(validationErrors)
            .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
            .join('; ')
          throw new Error(`Validation failed: ${errorMessages}`)
        }
        
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateProduct(id: number, data: ProductFormData) {
      this.loading = true
      try {
        const response: any = await productService.updateProduct(id, data)
        // Handle backend response format
        const updatedProduct = ('success' in response) ? response.data : response.data
        const index = this.items.findIndex((item) => item.id === id)
        if (index !== -1) {
          this.items[index] = updatedProduct
        }
        return updatedProduct
      } catch (error) {
        console.error('Failed to update product:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteProduct(id: number) {
      this.loading = true
      try {
        await productService.deleteProduct(id)
        // Remove product from the list
        this.items = this.items.filter((item) => item.id !== id)
      } catch (error) {
        console.error('Failed to delete product:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    nextPage() {
      if (this.pagination.current_page < this.pagination.last_page) {
        const params = {
          q: this.searchQuery,
          per_page: this.pagination.per_page,
          ...this.filters
        }
        this.fetchProducts(this.pagination.current_page + 1, undefined, undefined, params)
      }
    },

    prevPage() {
      if (this.pagination.current_page > 1) {
        const params = {
          q: this.searchQuery,
          per_page: this.pagination.per_page,
          ...this.filters
        }
        this.fetchProducts(this.pagination.current_page - 1, undefined, undefined, params)
      }
    },
  },
})
