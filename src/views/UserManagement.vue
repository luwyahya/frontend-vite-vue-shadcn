<template>
  <SidebarProvider>
    <AppSidebar />
    <SidebarInset>
      <SiteHeader />
      <Toast :message="toastMessage" :type="toastType" :visible="showToast" />

      <div class="min-h-screen bg-gray-50 py-8">
        <div class="max-w-6xl mx-auto px-4">
          
          <div class="mb-8">
            <h1 class="text-3xl font-bold text-gray-900">User Management</h1>
            <p class="text-gray-600 mt-2">Manage system users and permissions</p>
          </div>

          <Card class="mb-6">
            <CardContent class="p-6">
              <div class="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div class="relative flex-1 max-w-md">
                  <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    v-model="searchQuery"
                    placeholder="Search users..."
                    class="pl-10"
                  />
                </div>

                <div class="flex gap-2 flex-wrap">
                  <Badge
                    @click="selectedFilter = 'all'"
                    :variant="selectedFilter === 'all' ? 'default' : 'outline'"
                    class="cursor-pointer"
                  >
                    All ({{ users.length }})
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <!-- Loading State -->
          <div v-if="isLoading" class="space-y-4">
            <div v-for="n in 5" :key="n" class="animate-pulse">
              <Card>
                <CardContent class="p-6">
                  <div class="flex items-center space-x-4">
                    <div class="w-12 h-12 bg-gray-200 rounded-full"></div>
                    <div class="flex-1 space-y-2">
                      <div class="h-4 bg-gray-200 rounded w-1/4"></div>
                      <div class="h-3 bg-gray-200 rounded w-1/3"></div>
                    </div>
                    <div class="h-6 w-16 bg-gray-200 rounded"></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <!-- Users List -->
          <div v-else class="space-y-4">
            <Card
              v-for="user in filteredUsers"
              :key="user.id"
              class="hover:shadow-lg transition-shadow cursor-pointer"
              @click="showUserDetail(user)"
            >
              <CardContent class="p-6">
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-4">
                    <div class="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center">
                      <img 
                        v-if="user.avatar"
                        :src="getAvatarUrl(user.avatar)"
                        :alt="user.name"
                        class="w-full h-full object-cover"
                        @error="handleImageError"
                      />
                      <div 
                        v-if="!user.avatar || imageError"
                        class="w-full h-full flex items-center justify-center text-white font-semibold"
                        :class="getAvatarColor(user.name)"
                      >
                        {{ user.name.charAt(0).toUpperCase() }}
                      </div>
                    </div>
                    <div>
                      <h3 class="font-semibold text-lg">{{ user.name }}</h3>
                      <p class="text-gray-600">{{ user.email }}</p>
                      <p class="text-sm text-gray-500">{{ user.roles?.join(', ') || 'No roles' }}</p>
                    </div>
                  </div>
                  <div class="flex items-center space-x-3">
                    <span class="text-xs text-gray-500">
                      {{ new Date(user.created_at).toLocaleDateString() }}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <!-- Empty State -->
          <div v-if="!isLoading && filteredUsers.length === 0" class="text-center py-12">
            <Users class="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 class="text-lg font-medium text-gray-900 mb-2">No users found</h3>
            <p class="text-gray-600 mb-4">
              {{ searchQuery ? 'Try adjusting your search terms' : 'No users available' }}
            </p>
          </div>
        </div>
      </div>
    </SidebarInset>
  </SidebarProvider>

  <!-- User Detail Dialog -->
  <Dialog v-model:open="showDetailDialog">
    <DialogContent class="max-w-md">
      <DialogTitle>User Details</DialogTitle>
      <div v-if="selectedUser" class="space-y-4 mt-4">
        <div class="text-center">
          <div class="w-20 h-20 mx-auto rounded-full overflow-hidden flex items-center justify-center mb-4">
            <img 
              v-if="selectedUser.avatar"
              :src="getAvatarUrl(selectedUser.avatar)"
              :alt="selectedUser.name"
              class="w-full h-full object-cover"
              @error="handleImageError"
            />
            <div 
              v-if="!selectedUser.avatar || imageError"
              class="w-full h-full flex items-center justify-center text-white text-xl font-semibold"
              :class="getAvatarColor(selectedUser.name)"
            >
              {{ selectedUser.name.charAt(0).toUpperCase() }}
            </div>
          </div>
          <h3 class="text-xl font-semibold">{{ selectedUser.name }}</h3>
        </div>
        
        <div class="space-y-3">
          <div>
            <Label class="text-sm font-medium text-gray-500">Email</Label>
            <p class="text-gray-900">{{ selectedUser.email }}</p>
          </div>
          
          <div v-if="selectedUser.phone">
            <Label class="text-sm font-medium text-gray-500">Phone</Label>
            <p class="text-gray-900">{{ selectedUser.phone }}</p>
          </div>
          
          <div v-if="selectedUser.address">
            <Label class="text-sm font-medium text-gray-500">Address</Label>
            <p class="text-gray-900">{{ selectedUser.address }}</p>
          </div>
          
          <div v-if="selectedUser.date_of_birth">
            <Label class="text-sm font-medium text-gray-500">Date of Birth</Label>
            <p class="text-gray-900">{{ new Date(selectedUser.date_of_birth).toLocaleDateString() }}</p>
          </div>
          
          <div>
            <Label class="text-sm font-medium text-gray-500">Roles</Label>
            <div class="flex gap-1 flex-wrap">
              <Badge v-for="role in selectedUser.roles" :key="role" class="bg-blue-500 text-white">
                {{ role }}
              </Badge>
              <span v-if="!selectedUser.roles?.length" class="text-gray-500">No roles assigned</span>
            </div>
          </div>
          
          <div>
            <Label class="text-sm font-medium text-gray-500">Member Since</Label>
            <p class="text-gray-900">{{ new Date(selectedUser.created_at).toLocaleDateString() }}</p>
          </div>
        </div>
      </div>
      
      <div class="flex justify-end mt-6">
        <Button variant="outline" @click="showDetailDialog = false">Close</Button>
      </div>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { api } from '@/services/api.service'
import { getAvatarColor, getAvatarUrl } from '@/utils/avatar.utils'
import AppSidebar from '@/components/AppSidebar.vue'
import SiteHeader from '@/components/SiteHeader.vue'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { Toast } from '@/components/ui/toast'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Search, Users } from 'lucide-vue-next'

// State
const users = ref<any[]>([])
const isLoading = ref(false)
const searchQuery = ref('')
const selectedFilter = ref('all')
const showDetailDialog = ref(false)
const selectedUser = ref<any>(null)
const imageError = ref(false)

// Toast
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref<'success' | 'error'>('success')

// Computed
const filteredUsers = computed(() => {
  let filtered = users.value

  if (searchQuery.value) {
    filtered = filtered.filter((user: any) =>
      user.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  return filtered
})



// Methods
const showToastMessage = (message: string, type: 'success' | 'error') => {
  toastMessage.value = message
  toastType.value = type
  showToast.value = true
  setTimeout(() => showToast.value = false, 3000)
}

const fetchUsers = async () => {
  isLoading.value = true
  try {
    const response = await api.get('/users')
    users.value = response.data.data || response.data
  } catch (error) {
    console.error('Failed to fetch users:', error)
    showToastMessage('Failed to load users', 'error')
  } finally {
    isLoading.value = false
  }
}

const handleImageError = () => {
  imageError.value = true
}

const showUserDetail = (user: any) => {
  selectedUser.value = user
  imageError.value = false
  showDetailDialog.value = true
}

onMounted(() => {
  fetchUsers()
})
</script>