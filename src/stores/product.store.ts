import { defineStore } from 'pinia'
import { productService } from '@/services/product.service'
import type { Product, ProductFormData, ProductState } from '@/types/product.types'

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
      stock_status: '',
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
        const response = await productService.getProducts(page, params)
        
        // Handle Laravel API Resource format
        this.items = response.data
        
        if (response.meta) {
          this.pagination = {
            current_page: response.meta.current_page,
            last_page: response.meta.last_page,
            per_page: response.meta.per_page,
            total: response.meta.total,
          }
        }
      } catch (error) {
        console.error('Failed to fetch products:', error)
        throw error
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
        stock_status: '',
      }
      await this.fetchProducts(1, this.pagination.per_page)
    },

    async createProduct(data: ProductFormData) {
      this.loading = true
      try {
        const response = await productService.createProduct(data)
        // Add new product to the list
        this.items.unshift(response.data)
        return response.data
      } catch (error) {
        console.error('Failed to create product:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateProduct(id: number, data: ProductFormData) {
      this.loading = true
      try {
        const response = await productService.updateProduct(id, data)
        // Update product in the list
        const index = this.items.findIndex((item) => item.id === id)
        if (index !== -1) {
          this.items[index] = response.data
        }
        return response.data
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
