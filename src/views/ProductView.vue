<template>
  <SidebarProvider
    :style="{
      '--sidebar-width': '16rem',
      '--header-height': '3rem',
    }"
  >
    <AppSidebar />
    <SidebarInset>
      <SiteHeader />
      
      <div class="flex flex-1 flex-col">
        <div class="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
          <!-- Page Header -->
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-3xl font-bold tracking-tight">Products</h1>
              <p class="text-muted-foreground mt-1">
                Manage your product inventory
              </p>
            </div>
            <Dialog v-model:open="dialogOpen" v-if="isAuthenticated">
              <DialogTrigger as-child>
                <Button @click="openCreateDialog">
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogTitle>{{ editingProduct ? 'Edit Product' : 'Create Product' }}</DialogTitle>
                <DialogDescription>
                  {{ editingProduct ? 'Update product information' : 'Add a new product to your inventory' }}
                </DialogDescription>
                <form @submit.prevent="handleSubmit" class="space-y-4 mt-4">
                  <div class="space-y-2">
                    <Label for="name">Name</Label>
                    <Input
                      id="name"
                      v-model="formData.name"
                      placeholder="Product name"
                      required
                    />
                  </div>
                  <div class="space-y-2">
                    <Label for="sku">SKU</Label>
                    <Input
                      id="sku"
                      v-model="formData.sku"
                      placeholder="Product SKU"
                      required
                    />
                  </div>
                  <div class="space-y-2">
                    <Label for="description">Description</Label>
                    <Input
                      id="description"
                      v-model="formData.description"
                      placeholder="Product description"
                      required
                    />
                  </div>
                  <div class="space-y-2">
                    <Label for="price">Price</Label>
                    <Input
                      id="price"
                      v-model.number="formData.price"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      required
                    />
                  </div>
                  <div class="space-y-2">
                    <Label for="stock">Stock</Label>
                    <Input
                      id="stock"
                      v-model.number="formData.stock"
                      type="number"
                      placeholder="0"
                      required
                    />
                  </div>
                  <div class="space-y-2">
                    <Label for="category">Category</Label>
                    <Select v-model="formData.category_id">
                      <SelectTrigger>
                        <SelectValue placeholder="Select category (optional)" />
                      </SelectTrigger>
                      <SelectContent class="h-[200px] overflow-y-auto">
                        <SelectItem :value="null">No Category</SelectItem>
                        <SelectItem v-for="category in categories" :key="category.id" :value="category.id">
                          {{ category.name }}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div class="flex gap-2 justify-end">
                    <Button type="button" variant="outline" @click="dialogOpen = false">
                      Cancel
                    </Button>
                    <Button type="submit" :disabled="productStore.loading">
                      {{ productStore.loading ? 'Saving...' : 'Save' }}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <!-- Search and Filter Section -->
          <Card>
            <CardContent class="p-4">
              <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <!-- Search -->
                <div class="flex-1 max-w-sm">
                  <Input
                    v-model="searchQuery"
                    placeholder="Search products..."
                    @input="handleSearch"
                    class="w-full"
                  />
                </div>
                
                <!-- Filters -->
                <div class="flex gap-2 flex-wrap">
                  <Input
                    v-model="filters.min_price"
                    placeholder="Min Price"
                    type="number"
                    step="0.01"
                    class="w-32"
                    @input="handleFilter"
                  />
                  <Input
                    v-model="filters.max_price"
                    placeholder="Max Price"
                    type="number"
                    step="0.01"
                    class="w-32"
                    @input="handleFilter"
                  />
                  
                  <Select v-model="filters.sort_by" @update:model-value="handleFilter">
                    <SelectTrigger class="w-32">
                      <SelectValue placeholder="Sort By" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="stock">Stock</SelectItem>
                      <SelectItem value="created_at">Date</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select v-model="filters.sort_order" @update:model-value="handleFilter">
                    <SelectTrigger class="w-24">
                      <SelectValue placeholder="Order" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asc">ASC</SelectItem>
                      <SelectItem value="desc">DESC</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select v-model="filters.stock_status" @update:model-value="handleFilter">
                    <SelectTrigger class="w-36">
                      <SelectValue placeholder="Stock Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Stock</SelectItem>
                      <SelectItem value="in_stock">In Stock</SelectItem>
                      <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                      <SelectItem value="low_stock">Low Stock</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    @click="clearFilters"
                    v-if="hasActiveFilters"
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <!-- Analytics Cards -->
          <SectionCards />

          <!-- Products Table -->
          <Card>
            <CardContent class="p-0">
              <div v-if="productStore.loading && productStore.items.length === 0" class="flex items-center justify-center p-12">
                <p class="text-muted-foreground">Loading products...</p>
              </div>

              <div v-else-if="productStore.items.length === 0" class="flex flex-col items-center justify-center p-12">
                <p class="text-muted-foreground mb-4">
                  {{ isAuthenticated ? 'No products found' : 'Please login to view products from database' }}
                </p>
                <Button @click="openCreateDialog" v-if="isAuthenticated">Add your first product</Button>
                <Button v-else @click="$router.push('/login')">Login to Continue</Button>
              </div>

              <div v-else>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead class="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow v-for="product in productStore.items" :key="product.id">
                      <TableCell class="font-medium">{{ product.id }}</TableCell>
                      <TableCell>{{ product.sku }}</TableCell>
                      <TableCell>{{ product.name }}</TableCell>
                      <TableCell>{{ product.description }}</TableCell>
                      <TableCell>${{ product.price.toFixed(2) }}</TableCell>
                      <TableCell>{{ product.stock }}</TableCell>
                      <TableCell class="text-right">
                        <div class="flex gap-2 justify-end" v-if="isAuthenticated">
                          <Button
                            size="sm"
                            variant="outline"
                            @click="openEditDialog(product)"
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            @click="handleDelete(product.id)"
                          >
                            Delete
                          </Button>
                        </div>
                        <div v-else class="text-sm text-muted-foreground">
                          Login to manage
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>

                <!-- Pagination -->
                <div class="flex items-center justify-between border-t p-4">
                  <div class="flex items-center gap-4">
                    <div class="text-sm text-muted-foreground">
                      Page {{ productStore.pagination.current_page }} of {{ productStore.pagination.last_page }}
                      ({{ productStore.pagination.total }} total items)
                    </div>
                    <div class="flex items-center gap-2">
                      <Label class="text-sm">Per page:</Label>
                      <Select :model-value="productStore.pagination.per_page.toString()" @update:model-value="handlePerPageChange">
                        <SelectTrigger class="w-20">
                          <SelectValue :placeholder="productStore.pagination.per_page.toString()" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">5</SelectItem>
                          <SelectItem value="10">10</SelectItem>
                          <SelectItem value="25">25</SelectItem>
                          <SelectItem value="50">50</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div class="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      :disabled="productStore.pagination.current_page === 1"
                      @click="handlePageChange(productStore.pagination.current_page - 1)"
                    >
                      Previous
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      :disabled="productStore.pagination.current_page === productStore.pagination.last_page"
                      @click="handlePageChange(productStore.pagination.current_page + 1)"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useProductStore } from '@/stores/product.store'
import type { Product, ProductFormData } from '@/types/product.types'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import AppSidebar from '@/components/AppSidebar.vue'
import SiteHeader from '@/components/SiteHeader.vue'
import SectionCards from '@/components/SectionCards.vue'

import { useAuthStore } from '@/stores/auth.store'
import { categoryService } from '@/services/category.service'

const productStore = useProductStore()
const authStore = useAuthStore()

const isAuthenticated = computed(() => authStore.isAuthenticated)

const dialogOpen = ref(false)
const editingProduct = ref<Product | null>(null)
interface Category {
  id: number
  name: string
}

const categories = ref<Category[]>([])
const searchQuery = ref('')
const filters = reactive({
  min_price: '' as string,
  max_price: '' as string,
  sort_by: 'created_at' as 'name' | 'price' | 'stock' | 'created_at',
  sort_order: 'desc' as 'asc' | 'desc',
  stock_status: 'all' as 'all' | 'in_stock' | 'out_of_stock' | 'low_stock',
})

const formData = reactive<ProductFormData>({
  name: '',
  description: '',
  price: 0,
  stock: 0,
  sku: '',
  category_id: null,
})

const hasActiveFilters = computed(() => {
  return searchQuery.value !== '' || 
         filters.min_price !== '' || 
         filters.max_price !== '' ||
         filters.sort_by !== 'created_at' ||
         filters.sort_order !== 'desc' ||
         filters.stock_status !== 'all'
})

let searchTimeout: NodeJS.Timeout

const handleSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    applyFilters()
  }, 500)
}

const handleFilter = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    applyFilters()
  }, 500)
}

const applyFilters = () => {
  const params: any = {
    page: 1,
    per_page: productStore.pagination.per_page
  }
  
  // Add search query
  if (searchQuery.value.trim()) {
    params.q = searchQuery.value.trim()
  }
  
  // Add price filters
  if (filters.min_price) {
    params.min_price = filters.min_price
  }
  if (filters.max_price) {
    params.max_price = filters.max_price
  }
  
  // Add stock status filter
  if (filters.stock_status && filters.stock_status !== 'all') {
    params.stock_status = filters.stock_status
  }
  
  // Add sorting
  if (filters.sort_by) {
    params.sort_by = filters.sort_by
  }
  if (filters.sort_order) {
    params.sort_order = filters.sort_order
  }
  
  productStore.fetchProducts(1, productStore.pagination.per_page, undefined, params)
}

const handlePageChange = (page: number) => {
  const params: any = {
    page,
    per_page: productStore.pagination.per_page
  }
  
  // Maintain current search and filters
  if (searchQuery.value.trim()) {
    params.q = searchQuery.value.trim()
  }
  if (filters.min_price) params.min_price = filters.min_price
  if (filters.max_price) params.max_price = filters.max_price
  if (filters.stock_status && filters.stock_status !== 'all') {
    params.stock_status = filters.stock_status
  }
  if (filters.sort_by) params.sort_by = filters.sort_by
  if (filters.sort_order) params.sort_order = filters.sort_order
  
  productStore.fetchProducts(page, productStore.pagination.per_page, undefined, params)
}

const handlePerPageChange = (perPage: any) => {
  if (perPage) {
    console.log('Per page changed to:', perPage)
    productStore.fetchProducts(1, parseInt(String(perPage)))
  }
}

const clearFilters = () => {
  searchQuery.value = ''
  filters.min_price = ''
  filters.max_price = ''
  filters.sort_by = 'created_at'
  filters.sort_order = 'desc'
  filters.stock_status = 'all'
  productStore.fetchProducts(1, productStore.pagination.per_page)
}

const resetForm = () => {
  formData.name = ''
  formData.description = ''
  formData.price = 0
  formData.stock = 0
  formData.sku = ''
  formData.category_id = null
  editingProduct.value = null
}

const openCreateDialog = () => {
  resetForm()
  dialogOpen.value = true
}

const openEditDialog = (product: Product) => {
  editingProduct.value = product
  formData.name = product.name
  formData.description = product.description
  formData.price = product.price
  formData.stock = product.stock
  formData.sku = product.sku
  formData.category_id = product.category_id || null
  dialogOpen.value = true
}

const handleSubmit = async () => {
  try {
    if (editingProduct.value) {
      await productStore.updateProduct(editingProduct.value.id, formData)
    } else {
      await productStore.createProduct(formData)
    }
    dialogOpen.value = false
    resetForm()
  } catch (error) {
    console.error('Failed to save product:', error)
    alert('Failed to save product. Please try again.')
  }
}

const handleDelete = async (id: number) => {
  if (confirm('Are you sure you want to delete this product?')) {
    try {
      await productStore.deleteProduct(id)
    } catch (error) {
      console.error('Failed to delete product:', error)
      alert('Failed to delete product. Please try again.')
    }
  }
}

onMounted(async () => {
  if (!isAuthenticated.value) {
    // Show message that login is required for database access
    return
  }
  
  try {
    // Fetch categories and products with default pagination
    const [categoriesResponse] = await Promise.all([
      categoryService.getCategories(),
      productStore.fetchProducts(1, 10) // Start with page 1, 10 items per page
    ])
    categories.value = categoriesResponse.data
  } catch (error) {
    console.error('Failed to load data:', error)
    alert('Failed to load data from database. Please check your connection and try again.')
  }
})
</script>