import { httpService } from './http.service'

interface Category {
  id: number
  name: string
}

interface CategoryResponse {
  data: Category[]
}

class CategoryService {
  private readonly endpoint = '/categories'

  async getCategories(): Promise<CategoryResponse> {
    return httpService.get<CategoryResponse>(this.endpoint)
  }
}

export const categoryService = new CategoryService()