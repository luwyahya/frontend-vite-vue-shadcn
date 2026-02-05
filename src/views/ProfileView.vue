<template>
  <SidebarProvider>
    <AppSidebar />
    <SidebarInset>
      <!-- Toast -->
      <Toast :message="toastMessage" :type="toastType" :visible="showToast" />

      <div class="min-h-screen bg-gray-50 py-8">
        <div class="max-w-4xl mx-auto px-4">
          
          <!-- Header -->
          <div class="mb-8">
            <h1 class="text-3xl font-bold text-gray-900">Profile</h1>
            <p class="text-gray-600 mt-2">Manage your account information</p>
          </div>

          <!-- Profile Card -->
          <Card class="mb-6">
            <CardContent class="p-6">
              <div class="flex gap-8">
                <!-- Avatar Section - Left -->
                <div class="flex flex-col items-center">
                  <div class="relative">
                    <div class="w-32 h-32 rounded-full overflow-hidden bg-gray-200 border-4 border-white shadow-lg">
                      <img 
                        v-if="avatarUrl || avatarPreview"
                        :src="avatarPreview || avatarUrl || undefined"
                        alt="Avatar"
                        class="w-full h-full object-cover"
                      />
                      <div 
                        v-else
                        class="w-full h-full bg-blue-500 flex items-center justify-center text-white text-3xl font-bold"
                      >
                        {{ user?.name?.charAt(0).toUpperCase() }}
                      </div>
                    </div>
                    <button
                      v-if="isEditing"
                      @click="triggerFileInput"
                      class="absolute -bottom-2 -right-2 bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 transition-shadow shadow-lg"
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
                  <div class="text-center mt-4">
                    <h3 class="font-semibold text-lg">{{ user?.name }}</h3>
                    <p class="text-sm text-gray-500">{{ user?.email }}</p>
                  </div>
                </div>

                <!-- Form Fields - Right -->
                <div class="flex-1">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label for="name">Full Name</Label>
                      <Input id="name" v-model="profileForm.name" :disabled="!isEditing" class="mt-1" />
                    </div>
                    <div>
                      <Label for="email">Email</Label>
                      <Input id="email" v-model="profileForm.email" type="email" :disabled="!isEditing" class="mt-1" />
                    </div>
                    <div>
                      <Label for="phone">Phone</Label>
                      <Input id="phone" v-model="profileForm.phone" :disabled="!isEditing" placeholder="Enter phone number" class="mt-1" />
                    </div>
                    <div>
                      <Label for="address">Address</Label>
                      <Input id="address" v-model="profileForm.address" :disabled="!isEditing" placeholder="Enter address" class="mt-1" />
                    </div>
                    <div>
                      <Label for="dateOfBirth">Date of Birth</Label>
                      <Input
                          id="dateOfBirth"
                          v-model="dateOfBirthFormatted"
                          type="date"
                          :disabled="!isEditing"
                          class="mt-1"
                        />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter class="flex justify-end gap-2">
              <Button v-if="!isEditing" @click="startEditing" variant="outline">Edit Profile</Button>
              <template v-else>
                <Button @click="cancelEditing" variant="outline">Cancel</Button>
                <Button @click="saveProfile" :disabled="loading">{{ loading ? 'Saving...' : 'Save Changes' }}</Button>
              </template>
            </CardFooter>
          </Card>

          <!-- Quick Actions Menu -->
          <Card class="mb-6">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Navigate to different sections</CardDescription>
            </CardHeader>
            <CardContent>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div @click="$router.push('/products')" class="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <div class="text-center">
                    <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Package class="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 class="font-medium text-sm">Products</h3>
                  </div>
                </div>
                <div @click="$router.push('/orders')" class="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <div class="text-center">
                    <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <FileText class="w-6 h-6 text-green-600" />
                    </div>
                    <h3 class="font-medium text-sm">Orders</h3>
                  </div>
                </div>
                <div @click="$router.push('/payments')" class="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <div class="text-center">
                    <div class="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <CreditCard class="w-6 h-6 text-yellow-600" />
                    </div>
                    <h3 class="font-medium text-sm">Payments</h3>
                  </div>
                </div>
                <div @click="$router.push('/users')" class="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <div class="text-center">
                    <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Users class="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 class="font-medium text-sm">Users</h3>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <!-- Account Settings -->
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your account preferences and security</CardDescription>
            </CardHeader>
            <CardContent class="space-y-4">
              <div class="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 class="font-medium">Change Password</h3>
                  <p class="text-sm text-gray-600">Update your password to keep your account secure</p>
                </div>
                <Button variant="outline" @click="showChangePassword = true">Change</Button>
              </div>

              <div class="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 class="font-medium">Two-Factor Authentication</h3>
                  <p class="text-sm text-gray-600">Add an extra layer of security</p>
                </div>
                <Button variant="outline" disabled>Enable</Button>
              </div>

              <div class="flex items-center justify-between p-4 border rounded-lg border-red-200">
                <div>
                  <h3 class="font-medium text-red-600">Delete Account</h3>
                  <p class="text-sm text-gray-600">Permanently delete your account</p>
                </div>
                <Button variant="destructive" @click="showDeleteConfirm = true">Delete</Button>
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
      <DialogDescription>Enter your current password and choose a new one</DialogDescription>
      <div class="space-y-4 mt-4">
        <div>
          <Label for="currentPassword">Current Password</Label>
          <Input id="currentPassword" v-model="passwordForm.current" type="password" class="mt-1" />
        </div>
        <div>
          <Label for="newPassword">New Password</Label>
          <Input id="newPassword" v-model="passwordForm.new" type="password" class="mt-1" />
        </div>
        <div>
          <Label for="confirmPassword">Confirm New Password</Label>
          <Input id="confirmPassword" v-model="passwordForm.confirm" type="password" class="mt-1" />
        </div>
      </div>
      <div class="flex justify-end gap-2 mt-6">
        <Button variant="outline" @click="showChangePassword = false">Cancel</Button>
        <Button @click="changePassword" :disabled="loading">{{ loading ? 'Changing...' : 'Change Password' }}</Button>
      </div>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import { api } from '@/services/api.service'
import { getAvatarUrl } from '@/utils/avatar.utils'
import AppSidebar from '@/components/AppSidebar.vue'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { Toast } from '@/components/ui/toast'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { Package, FileText, CreditCard, Users } from 'lucide-vue-next'

// --- Store & user ---
const authStore = useAuthStore()
const user = authStore.user

// Computed avatar URL
const avatarUrl = computed(() => getAvatarUrl(user?.avatar))

// --- State ---
const isEditing = ref(false)
const loading = ref(false)
const showChangePassword = ref(false)
const showDeleteConfirm = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)
const avatarPreview = ref<string | null>(null)
const selectedFile = ref<File | null>(null)

// Toast
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref<'success' | 'error'>('success')

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

// --- Methods ---
const showToastMessage = (message: string, type: 'success' | 'error') => {
  toastMessage.value = message
  toastType.value = type
  showToast.value = true
  setTimeout(() => showToast.value = false, 3000)
}

const triggerFileInput = () => fileInput.value?.click()

const handleAvatarChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    selectedFile.value = file
    const reader = new FileReader()
    reader.onload = e => avatarPreview.value = e.target?.result as string
    reader.readAsDataURL(file)
  }
}

const startEditing = () => isEditing.value = true

const cancelEditing = () => {
  isEditing.value = false
  avatarPreview.value = null
  selectedFile.value = null
  profileForm.name = user?.name || ''
  profileForm.email = user?.email || ''
  profileForm.phone = user?.phone || ''
  profileForm.address = user?.address || ''
  profileForm.dateOfBirth = user?.date_of_birth || ''
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
    if (selectedFile.value) formData.append('avatar', selectedFile.value)

    const response = await api.post('/profile/update', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    // Update store dan reactive data
    if (authStore.user && response.data.data) {
      Object.assign(authStore.user, response.data.data)
      localStorage.setItem('user', JSON.stringify(response.data.data))
    }

    isEditing.value = false
    selectedFile.value = null
    // Jangan reset avatarPreview agar tetap terlihat
    setTimeout(() => {
      avatarPreview.value = null
    }, 100)

    showToastMessage('Profile updated successfully!', 'success')
  } catch (error: any) {
    console.error(error)
    showToastMessage(error.message || 'Failed to update profile', 'error')
  } finally {
    loading.value = false
  }
}

const changePassword = async () => {
  if (passwordForm.new !== passwordForm.confirm) {
    showToastMessage('Passwords do not match', 'error')
    return
  }
  loading.value = true
  try {
    await api.put('/profile/password', {
      current_password: passwordForm.current,
      new_password: passwordForm.new,
      new_password_confirmation: passwordForm.confirm
    })
    showChangePassword.value = false
    passwordForm.current = ''
    passwordForm.new = ''
    passwordForm.confirm = ''
    showToastMessage('Password changed successfully!', 'success')
  } catch (error: any) {
    console.error(error)
    showToastMessage(error.message || 'Failed to change password', 'error')
  } finally {
    loading.value = false
  }
}

const dateOfBirthFormatted = computed({
  get() {
    if (!user?.date_of_birth) return ''
    return user.date_of_birth.slice(0, 10)
  },
  set(value: string) {
    profileForm.dateOfBirth = value
  }
})

onMounted(() => {
  // Optional: fetch full profile from API
})
</script>
