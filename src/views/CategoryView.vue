<template>
  <SidebarProvider>
    <AppSidebar />
    <SidebarInset>
      <!-- Toast -->
      <Toast :message="toastMessage" :type="toastType" :visible="showToast" />

      <div class="min-h-screen bg-gray-50 py-8">
        <div class="max-w-6xl mx-auto px-4">
          
          <!-- Header -->
          <div class="mb-8">
            <h1 class="text-3xl font-bold text-gray-900">Categories</h1>
            <p class="text-gray-600 mt-2">Manage product categories</p>
          </div>

          <!-- Search and Filter -->
          <Card class="mb-6">
            <CardContent class="p-6">
              <div class="flex flex-col md:flex-row gap-4 items-center justify-between">
                <!-- Search Bar -->
                <div class="relative flex-1 max-w-md">
                  <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    v-model="searchQuery"
                    placeholder="Search categories..."
                    class="pl-10"
                  />
                </div>

                <!-- Filter Badges -->
                <div class="flex gap-2 flex-wrap">
                  <Badge
                    @click="selectedFilter = 'all'"
                    :variant="selectedFilter === 'all' ? 'default' : 'outline'"
                    class="cursor-pointer"
                  >
                    Show All ({{ categories.length }})
                  </Badge>
                  <Badge
                    @click="selectedFilter = 'active'"
                    :variant="selectedFilter === 'active' ? 'default' : 'outline'"
                    class="cursor-pointer"
                  >
                    Active ({{ activeCount }})
                  </Badge>
                  <Badge
                    @click="selectedFilter = 'inactive'"
                    :variant="selectedFilter === 'inactive' ? 'default' : 'outline'"
                    class="cursor-pointer"
                  >
                    Inactive ({{ inactiveCount }})
                  </Badge>
                </div>

                <!-- Add Category Button -->
                <Button @click="showAddDialog = true" class="transition-all duration-200 hover:scale-105">
                  <Plus class="w-4 h-4 mr-2" />
                  Add Category
                </Button>
              </div>
            </CardContent>
          </Card>

          <!-- Loading State -->
          <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div v-for="n in 8" :key="n" class="animate-pulse">
              <Card class="hover:shadow-lg transition-shadow">
                <CardContent class="p-6 text-center">
                  <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-200"></div>
                  <div class="h-6 bg-gray-200 rounded mb-2"></div>
                  <div class="h-4 bg-gray-200 rounded mb-3"></div>
                  <div class="flex items-center justify-between">
                    <div class="h-5 w-16 bg-gray-200 rounded"></div>
                    <div class="h-3 w-20 bg-gray-200 rounded"></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <!-- Categories Grid -->

          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <Card
              v-for="(category, index) in filteredCategories"
              :key="category.id"
              class="hover:shadow-lg transition-all duration-300 cursor-pointer animate-in fade-in-0 slide-in-from-bottom-4"
              :style="{ animationDelay: `${index * 50}ms` }"
              @click="selectCategory(category)"
            >
              <CardContent class="p-6 text-center">
                <div class="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                     :class="getCategoryColor(category.name)">
                  <component :is="getCategoryIcon(category.name)" class="w-8 h-8 text-white" />
                </div>
                <h3 class="font-semibold text-lg mb-2">{{ category.name }}</h3>
                <p class="text-sm text-gray-600 mb-3">{{ category.description || 'No description' }}</p>
                <div class="flex items-center justify-between">
                  <Badge :class="category.is_active ? 'bg-blue-500 text-white' : 'bg-yellow-500 text-white'">
                    {{ category.is_active ? 'Active' : 'Inactive' }}
                  </Badge>
                  <span class="text-xs text-gray-500">{{ category.products_count || 0 }} products</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <!-- Empty State -->
          <div v-if="!isLoading && filteredCategories.length === 0" class="text-center py-12">
            <Package class="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 class="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
            <p class="text-gray-600 mb-4">
              {{ searchQuery ? 'Try adjusting your search terms' : 'Get started by creating your first category' }}
            </p>
            <Button @click="showAddDialog = true" v-if="!searchQuery">
              <Plus class="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </div>
        </div>
      </div>
    </SidebarInset>
  </SidebarProvider>

  <!-- Add/Edit Category Dialog -->
  <Dialog v-model:open="showAddDialog">
    <DialogContent>
      <DialogTitle>{{ editingCategory ? 'Edit Category' : 'Add New Category' }}</DialogTitle>
      <DialogDescription>
        {{ editingCategory ? 'Update category information' : 'Create a new product category' }}
      </DialogDescription>
      <div class="space-y-4 mt-4">
        <div>
          <Label for="categoryName">Category Name</Label>
          <Input id="categoryName" v-model="categoryForm.name" placeholder="Enter category name" class="mt-1" />
        </div>
        <div>
          <Label for="categoryDescription">Description</Label>
          <Input id="categoryDescription" v-model="categoryForm.description" placeholder="Enter description (optional)" class="mt-1" />
        </div>
        <div class="flex items-center space-x-2">
          <input
            id="isActive"
            v-model="categoryForm.is_active"
            type="checkbox"
            class="rounded border-gray-300"
          />
          <Label for="isActive">Active</Label>
        </div>
      </div>
      <div class="flex justify-end gap-2 mt-6">
        <Button variant="outline" @click="closeDialog">Cancel</Button>
        <Button @click="saveCategory" :disabled="loading" class="relative">
          <div v-if="loading" class="absolute inset-0 flex items-center justify-center">
            <div class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
          </div>
          <span :class="{ 'opacity-0': loading }">
            {{ loading ? 'Saving...' : (editingCategory ? 'Update' : 'Create') }}
          </span>
        </Button>
        <Button v-if="editingCategory" @click="deleteCategory(editingCategory)" variant="destructive" :disabled="loading" class="relative">
          <div v-if="loading" class="absolute inset-0 flex items-center justify-center">
            <div class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
          </div>
          <span :class="{ 'opacity-0': loading }">
            {{ loading ? 'Deleting...' : 'Delete' }}
          </span>
        </Button>
      </div>
    </DialogContent>
  </Dialog>
</template>

    <script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '@/services/api.service'
import AppSidebar from '@/components/AppSidebar.vue'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { Toast } from '@/components/ui/toast'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { Search, Plus, Package, ShoppingBag, Shirt, Laptop, Home, Car, Book, Gamepad2, Music, Camera } from 'lucide-vue-next'

const router = useRouter()

// State
const categories = ref([])
const isLoading = ref(false)
const loading = ref(false)
const deleting = ref(false)
const searchQuery = ref('')
const selectedFilter = ref('all')
const showAddDialog = ref(false)
const editingCategory = ref(null)

// Toast
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref<'success' | 'error'>('success')

// Form
const categoryForm = reactive({
  name: '',
  description: '',
  is_active: true
})

// Computed
const filteredCategories = computed(() => {
  let filtered = categories.value

  // Filter by search query
  if (searchQuery.value) {
    filtered = filtered.filter(category =>
      category.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      category.description?.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  // Filter by status
  if (selectedFilter.value === 'active') {
    filtered = filtered.filter(category => category.is_active)
  } else if (selectedFilter.value === 'inactive') {
    filtered = filtered.filter(category => !category.is_active)
  }

  return filtered
})

const activeCount = computed(() => categories.value.filter(c => c.is_active).length)
const inactiveCount = computed(() => categories.value.filter(c => !c.is_active).length)

// Methods
const showToastMessage = (message: string, type: 'success' | 'error') => {
  toastMessage.value = message
  toastType.value = type
  showToast.value = true
  setTimeout(() => showToast.value = false, 3000)
}

const getCategoryIcon = (categoryName: string) => {
  const name = categoryName.toLowerCase()
  if (name.includes('fashion') || name.includes('clothing') || name.includes('apparel')) return Shirt
  if (name.includes('electronics') || name.includes('tech') || name.includes('gadget')) return Laptop
  if (name.includes('home') || name.includes('furniture') || name.includes('decor')) return Home
  if (name.includes('automotive') || name.includes('car') || name.includes('vehicle')) return Car
  if (name.includes('book') || name.includes('education') || name.includes('learning')) return Book
  if (name.includes('game') || name.includes('gaming') || name.includes('toy')) return Gamepad2
  if (name.includes('music') || name.includes('audio') || name.includes('sound')) return Music
  if (name.includes('photo') || name.includes('camera') || name.includes('video')) return Camera
  return ShoppingBag
}

const getCategoryColor = (categoryName: string) => {
  const name = categoryName.toLowerCase()
  if (name.includes('fashion') || name.includes('clothing')) return 'bg-pink-500'
  if (name.includes('electronics') || name.includes('tech')) return 'bg-blue-500'
  if (name.includes('home') || name.includes('furniture')) return 'bg-green-500'
  if (name.includes('automotive') || name.includes('car')) return 'bg-red-500'
  if (name.includes('book') || name.includes('education')) return 'bg-purple-500'
  if (name.includes('game') || name.includes('gaming')) return 'bg-orange-500'
  if (name.includes('music') || name.includes('audio')) return 'bg-indigo-500'
  if (name.includes('photo') || name.includes('camera')) return 'bg-yellow-500'
  return 'bg-gray-500'
}

const fetchCategories = async () => {
  isLoading.value = true
  try {
    const response = await api.get('/categories')
    categories.value = response.data.data || response.data
  } catch (error) {
    console.error('Failed to fetch categories:', error)
    showToastMessage('Failed to load categories', 'error')
  } finally {
    isLoading.value = false
  }
}

const selectCategory = (category: any) => {
  editingCategory.value = category
  categoryForm.name = category.name
  categoryForm.description = category.description || ''
  categoryForm.is_active = category.is_active
  showAddDialog.value = true
}

const deleteCategory = async (category: any) => {
  if (!confirm(`Are you sure you want to delete "${category.name}"?`)) {
    return
  }

  loading.value = true
  try {
    await api.delete(`/categories/${category.slug}`)
    showToastMessage('Category deleted successfully!', 'success')
    await fetchCategories()
  } catch (error: any) {
    console.error('Failed to delete category:', error)
    const errorMessage = error.response?.data?.message || error.message || 'Failed to delete category'
    showToastMessage(errorMessage, 'error')
  } finally {
    loading.value = false
  }
}

const closeDialog = () => {
  showAddDialog.value = false
  editingCategory.value = null
  categoryForm.name = ''
  categoryForm.description = ''
  categoryForm.is_active = true
}

const saveCategory = async () => {
  if (!categoryForm.name.trim()) {
    showToastMessage('Category name is required', 'error')
    return
  }

  loading.value = true
  try {
    if (editingCategory.value) {
      // Update existing category using slug
      const response = await api.put(`/categories/${editingCategory.value.slug}`, categoryForm)
      showToastMessage('Category updated successfully!', 'success')
    } else {
      // Create new category
      const response = await api.post('/categories', categoryForm)
      showToastMessage('Category created successfully!', 'success')
    }
    
    await fetchCategories()
    closeDialog()
  } catch (error: any) {
    console.error('Failed to save category:', error)
    const errorMessage = error.response?.data?.message || error.message || 'Failed to save category'
    showToastMessage(errorMessage, 'error')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchCategories()
})
</script>