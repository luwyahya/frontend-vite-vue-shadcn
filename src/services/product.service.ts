import { httpService } from './http.service'
import { mockProductService } from './mock-product.service'
import type { Product, ProductFormData } from '@/types/product.types'
import type { LaravelApiResponse } from '@/types/api.types'

// Use mock service in development mode
const USE_MOCK = import.meta.env.DEV

class ProductService {
  private readonly endpoint = '/products'

  async getProducts(
    page: number = 1, 
    params: any = {}
  ): Promise<LaravelApiResponse<Product[]>> {
    if (USE_MOCK) {
      return mockProductService.getProducts(page, params.per_page || 10)
    }
    
    const queryParams = {
      page,
      ...params
    }
    
    // Remove null/empty values
    Object.keys(queryParams).forEach(key => {
      if (queryParams[key] === null || queryParams[key] === '') {
        delete queryParams[key]
      }
    })
    
    return httpService.get<LaravelApiResponse<Product[]>>(this.endpoint, queryParams)
  }

  async getProduct(id: number): Promise<LaravelApiResponse<Product>> {
    if (USE_MOCK) {
      return mockProductService.getProduct(id)
    }
    return httpService.get<LaravelApiResponse<Product>>(`${this.endpoint}/${id}`)
  }

  async createProduct(data: ProductFormData): Promise<LaravelApiResponse<Product>> {
    if (USE_MOCK) {
      return mockProductService.createProduct(data)
    }
    return httpService.post<LaravelApiResponse<Product>>(this.endpoint, data)
  }

  async updateProduct(id: number, data: ProductFormData): Promise<LaravelApiResponse<Product>> {
    if (USE_MOCK) {
      return mockProductService.updateProduct(id, data)
    }
    return httpService.put<LaravelApiResponse<Product>>(`${this.endpoint}/${id}`, data)
  }

  async deleteProduct(id: number): Promise<void> {
    if (USE_MOCK) {
      return mockProductService.deleteProduct(id)
    }
    return httpService.delete<void>(`${this.endpoint}/${id}`)
  }
}

export const productService = new ProductService()
