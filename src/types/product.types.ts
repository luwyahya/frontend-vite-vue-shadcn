export interface Product {
  id: number
  name: string
  description: string
  price: number
  stock: number
  sku: string
  category_id: number | null
  created_at?: string
  updated_at?: string
}

export interface ProductFormData {
  name: string
  description: string
  price: number
  stock: number
  sku: string
  category_id: number | null
}

export interface ProductState {
  items: Product[]
  loading: boolean
  searchQuery: string
  filters: {
    max_price: string
    min_price: string
    sort_by: 'name' | 'price' | 'stock' | 'created_at'
    sort_order: 'asc' | 'desc'
    stock_status: 'all' | 'in_stock' | 'out_of_stock' | 'low_stock'
  }
  pagination: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}
