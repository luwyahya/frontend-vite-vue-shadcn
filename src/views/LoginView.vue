<template>
  <Toast :message="toastMessage" :type="toastType" :visible="showToast" />
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
    <Card class="w-full max-w-md">
      <CardHeader class="space-y-1">
        <CardTitle class="text-2xl font-bold text-center">Welcome Back</CardTitle>
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
          <Button type="submit" class="w-full" :disabled="loading">
            {{ loading ? 'Logging in...' : 'Login' }}
          </Button>
        </form>
      </CardContent>
      <CardFooter class="flex flex-col space-y-2">
        <p class="text-xs text-muted-foreground text-center">
          This is a demo login. Use any email and password.
        </p>
      </CardFooter>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Toast } from '@/components/ui/toast'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const loading = ref(false)
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
    await authStore.login({ email: email.value, password: password.value })
    showToastMessage('Login berhasil!', 'success')
    setTimeout(() => {
      router.push('/dashboard')
    }, 1000)
  } catch (error) {
    console.error('Login failed:', error)
    showToastMessage('Login gagal! Periksa email dan password Anda.', 'error')
  } finally {
    loading.value = false
  }
}
</script>
