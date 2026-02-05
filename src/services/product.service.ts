import { httpService } from './http.service'
import { api } from './api.service'
import type { Product, ProductFormData } from '@/types/product.types'
import type { LaravelApiResponse } from '@/types/api.types'

class ProductService {
  private readonly endpoint = '/products'

  async getProducts(
    page: number = 1, 
    params: any = {}
  ): Promise<any> {
    const queryParams = {
      page,
      ...params
    }
    
    console.log('Sending params to backend:', queryParams)
    
    const response = await api.get(this.endpoint, { params: queryParams })
    console.log('Raw backend response:', response.data)
    return response.data
  }

  async getProduct(id: number): Promise<LaravelApiResponse<Product>> {
    return httpService.get<LaravelApiResponse<Product>>(`${this.endpoint}/${id}`)
  }

  async createProduct(data: ProductFormData): Promise<LaravelApiResponse<Product>> {
    try {
      console.log('Sending product data:', data)
      // Use direct axios to bypass interceptor and see raw error
      const response = await api.post(this.endpoint, data)
      return response.data
    } catch (error: any) {
      console.error('Product service error:', error)
      console.error('Raw axios error:', error.response)
      console.error('Error status:', error.response?.status)
      console.error('Error data:', error.response?.data)
      throw error
    }
  }

  async updateProduct(id: number, data: ProductFormData): Promise<LaravelApiResponse<Product>> {
    return httpService.patch<LaravelApiResponse<Product>>(`${this.endpoint}/${id}`, data)
  }

  async deleteProduct(id: number): Promise<void> {
    return httpService.delete<void>(`${this.endpoint}/${id}`)
  }
}

export const productService = new ProductService()
