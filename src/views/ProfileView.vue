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
          <div>
            <h1 class="text-3xl font-bold tracking-tight">Profile</h1>
            <p class="text-muted-foreground mt-1">
              Manage your account information
            </p>
          </div>

      <!-- Profile Card -->
      <Card class="mb-6">
        <CardHeader>
          <CardTitle class="flex items-center gap-3">
            <div class="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
              {{ user?.name?.charAt(0).toUpperCase() }}
            </div>
            <div>
              <h2 class="text-xl font-semibold">{{ user?.name }}</h2>
              <p class="text-gray-600">{{ user?.email }}</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <!-- Avatar Upload Section -->
          <div class="mb-6 flex flex-col items-center">
            <div class="relative">
              <div class="w-24 h-24 rounded-full overflow-hidden bg-gray-200 border-4 border-white shadow-lg">
                <img 
                  v-if="user?.avatar || avatarPreview" 
                  :src="avatarPreview || user?.avatar" 
                  alt="Profile Avatar"
                  class="w-full h-full object-cover"
                />
                <div 
                  v-else 
                  class="w-full h-full bg-blue-500 flex items-center justify-center text-white text-2xl font-bold"
                >
                  {{ user?.name?.charAt(0).toUpperCase() }}
                </div>
              </div>
              <button
                v-if="isEditing"
                @click="triggerFileInput"
                class="absolute -bottom-2 -right-2 bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 transition-colors shadow-lg"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              @change="handleAvatarChange"
              class="hidden"
            />
            <p class="text-sm text-gray-500 mt-2">{{ user?.name }}</p>
            <p class="text-xs text-gray-400">{{ user?.email }}</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label for="name">Full Name</Label>
              <Input
                id="name"
                v-model="profileForm.name"
                :disabled="!isEditing"
                class="mt-1"
              />
            </div>
            <div>
              <Label for="email">Email</Label>
              <Input
                id="email"
                v-model="profileForm.email"
                type="email"
                :disabled="!isEditing"
                class="mt-1"
              />
            </div>
            <div>
              <Label for="phone">Phone</Label>
              <Input
                id="phone"
                v-model="profileForm.phone"
                :disabled="!isEditing"
                placeholder="Enter phone number"
                class="mt-1"
              />
            </div>
            <div>
              <Label for="address">Address</Label>
              <Input
                id="address"
                v-model="profileForm.address"
                :disabled="!isEditing"
                placeholder="Enter address"
                class="mt-1"
              />
            </div>
            <div>
              <Label for="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                v-model="profileForm.dateOfBirth"
                type="date"
                :disabled="!isEditing"
                class="mt-1"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter class="flex justify-end gap-2">
          <Button
            v-if="!isEditing"
            @click="startEditing"
            variant="outline"
          >
            Edit Profile
          </Button>
          <template v-else>
            <Button
              @click="cancelEditing"
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              @click="saveProfile"
              :disabled="loading"
            >
              {{ loading ? 'Saving...' : 'Save Changes' }}
            </Button>
          </template>
        </CardFooter>
      </Card>

      <!-- Account Settings -->
      <Card>
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
          <CardDescription>
            Manage your account preferences and security
          </CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h3 class="font-medium">Change Password</h3>
              <p class="text-sm text-gray-600">Update your password to keep your account secure</p>
            </div>
            <Button variant="outline" @click="showChangePassword = true">
              Change
            </Button>
          </div>
          
          <div class="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h3 class="font-medium">Two-Factor Authentication</h3>
              <p class="text-sm text-gray-600">Add an extra layer of security to your account</p>
            </div>
            <Button variant="outline" disabled>
              Enable
            </Button>
          </div>

          <div class="flex items-center justify-between p-4 border rounded-lg border-red-200">
            <div>
              <h3 class="font-medium text-red-600">Delete Account</h3>
              <p class="text-sm text-gray-600">Permanently delete your account and all data</p>
            </div>
            <Button variant="destructive" @click="showDeleteConfirm = true">
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>
        </div>
      </div>
    </SidebarInset>
  </SidebarProvider>

    <!-- Change Password Dialog -->
    <Dialog v-model:open="showChangePassword">
      <DialogContent>
        <DialogTitle>Change Password</DialogTitle>
        <DialogDescription>
          Enter your current password and choose a new one
        </DialogDescription>
        <div class="space-y-4 mt-4">
          <div>
            <Label for="currentPassword">Current Password</Label>
            <Input
              id="currentPassword"
              v-model="passwordForm.current"
              type="password"
              class="mt-1"
            />
          </div>
          <div>
            <Label for="newPassword">New Password</Label>
            <Input
              id="newPassword"
              v-model="passwordForm.new"
              type="password"
              class="mt-1"
            />
          </div>
          <div>
            <Label for="confirmPassword">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              v-model="passwordForm.confirm"
              type="password"
              class="mt-1"
            />
          </div>
        </div>
        <div class="flex justify-end gap-2 mt-6">
          <Button variant="outline" @click="showChangePassword = false">
            Cancel
          </Button>
          <Button @click="changePassword" :disabled="loading">
            {{ loading ? 'Changing...' : 'Change Password' }}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import { api } from '@/services/api.service'
import AppSidebar from '@/components/AppSidebar.vue'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { useToast } from '@/components/ui/toast/use-toast'
import SiteHeader from '@/components/SiteHeader.vue'

const { toast } = useToast()
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'

const authStore = useAuthStore()
const user = authStore.user

const isEditing = ref(false)
const loading = ref(false)
const showChangePassword = ref(false)
const showDeleteConfirm = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)
const avatarPreview = ref<string | null>(null)
const selectedFile = ref<File | null>(null)

const profileForm = reactive({
  name: user?.name || '',
  email: user?.email || '',
  phone: user?.phone || '',
  address: user?.address || '',
  dateOfBirth: user?.date_of_birth || ''
})

const passwordForm = reactive({
  current: '',
  new: '',
  confirm: ''
})



const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleAvatarChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    selectedFile.value = file
    
    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      avatarPreview.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

const startEditing = () => {
  isEditing.value = true
}

const cancelEditing = () => {
  isEditing.value = false
  avatarPreview.value = null
  selectedFile.value = null
  
  // Reset form
  profileForm.name = user?.name || ''
  profileForm.email = user?.email || ''
}

const saveProfile = async () => {
  loading.value = true
  try {
    const formData = new FormData()
    formData.append('name', profileForm.name)
    formData.append('email', profileForm.email)
    formData.append('phone', profileForm.phone || '')
    formData.append('address', profileForm.address || '')
    formData.append('date_of_birth', profileForm.dateOfBirth || '')
    
    // Add avatar file if selected
    if (selectedFile.value) {
      formData.append('avatar', selectedFile.value)
    }
    
    // Call Laravel API to update profile
    const response = await api.post('/profile/update', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    
    // Update user in store with response data
    if (authStore.user && response.data.data) {
      const updatedUser = response.data.data
      authStore.user = updatedUser
      localStorage.setItem('user', JSON.stringify(updatedUser))
    }
    
    isEditing.value = false
    avatarPreview.value = null
    selectedFile.value = null
    
    toast({
      title: 'Profile updated successfully',
      description: 'Your profile has been updated.',
      class: 'border-green-200 bg-green-50 text-green-800',
    })
    console.log('Profile updated successfully')
  } catch (error: any) {
    console.error('Failed to update profile:', error)
    toast({
      title: 'Profile update failed',
      description: error?.message || 'Failed to update profile',
      variant: 'destructive',
    })
  } finally {
    loading.value = false
  }
}

const changePassword = async () => {
  if (passwordForm.new !== passwordForm.confirm) {
    alert('New passwords do not match')
    return
  }
  
  loading.value = true
  try {
    // Call Laravel API to change password
    await api.post('/profile/update', {
      current_password: passwordForm.current,
      new_password: passwordForm.new,
      new_password_confirmation: passwordForm.confirm
    })
    
    showChangePassword.value = false
    passwordForm.current = ''
    passwordForm.new = ''
    passwordForm.confirm = ''
    
    toast({
      title: 'Password changed successfully',
      description: 'Your password has been updated.',
      class: 'border-green-200 bg-green-50 text-green-800',
    })
    console.log('Password changed successfully')
  } catch (error: any) {
    console.error('Failed to change password:', error)
    toast({
      title: 'Password change failed',
      description: error?.message || 'Failed to change password',
      variant: 'destructive',
    })
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  // Load additional profile data if needed
})
</script>