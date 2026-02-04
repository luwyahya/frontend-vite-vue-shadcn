<template>
  <!-- Toast -->
  <Toast
    :message="toastMessage"
    :type="toastType"
    :visible="showToast"
  />

  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
    <Card class="w-full max-w-md">
      <CardHeader class="space-y-1">
        <CardTitle class="text-2xl font-bold text-center">
          Welcome Back
        </CardTitle>
        <CardDescription class="text-center">
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form @submit.prevent="handleLogin" class="space-y-4">
          <div class="space-y-2">
            <Label for="email">Email</Label>
            <Input
              id="email"
              v-model="email"
              type="email"
              placeholder="john@example.com"
              required
            />
          </div>

          <div class="space-y-2">
            <Label for="password">Password</Label>
            <Input
              id="password"
              v-model="password"
              type="password"
              placeholder="••••••••"
              required
            />
          </div>

          <Button
            type="submit"
            class="w-full"
            :disabled="loading"
          >
            {{ loading ? 'Logging in...' : 'Login' }}
          </Button>

          <CardDescription class="text-center text-sm">
            Don't have an account?
            <RouterLink
              to="/register"
              class="ml-1 font-medium hover:text-blue-600"
            >
              Sign Up
            </RouterLink>
          </CardDescription>
        </form>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Toast } from '@/components/ui/toast'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const loading = ref(false)

// Toast state
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref<'success' | 'error'>('success')

const showToastMessage = (message: string, type: 'success' | 'error') => {
  toastMessage.value = message
  toastType.value = type
  showToast.value = true

  setTimeout(() => {
    showToast.value = false
  }, 3000)
}

const handleLogin = async () => {
  loading.value = true

  try {
    await authStore.login({
      email: email.value,
      password: password.value,
    })

    showToastMessage('Login berhasil!', 'success')

    setTimeout(() => {
      router.push('/dashboard')
    }, 1000)

  } catch (error: any) {
    console.error('Login failed:', error)
    console.log('Error message:', error.message)
    
    // Force show error toast for testing
    showToastMessage(
      error.message || 'Login gagal. Periksa email dan password.',
      'error'
    )
    
    console.log('Toast state after error:', {
      showToast: showToast.value,
      toastMessage: toastMessage.value,
      toastType: toastType.value
    })
  } finally {
    loading.value = false
  }
}
</script>
