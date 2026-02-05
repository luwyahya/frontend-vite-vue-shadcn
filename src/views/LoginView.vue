<template>
  <!-- Toast -->
  <Toast
    :message="toastMessage"
    :type="toastType"
    :visible="showToast"
  />

  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
    <Card class="w-full max-w-md transform transition-all duration-300 hover:scale-105 animate-in fade-in-0 slide-in-from-bottom-4">
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
            class="w-full relative"
            :disabled="loading"
          >
<<<<<<< HEAD
            <div v-if="loading" class="absolute inset-0 flex items-center justify-center">
              <div class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
            </div>
            <span :class="{ 'opacity-0': loading }">
              {{ loading ? 'Logging in...' : 'Login' }}
            </span>
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
=======
            {{ loading ? 'Logging in...' : 'Login' }}
            </Button>
                  <CardDescription class="text-center text-sm">
               Don't have an account?
                  <RouterLink
                    to="/register"
                    class="ml-1 font-medium text-muted-foreground hover:text-blue-600 transition-colors"
                  >
                    Sign Up
                  </RouterLink>
              </CardDescription>
>>>>>>> 2c18bd1839144712220935501486f7bb1db62c8f
        </form>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
<<<<<<< HEAD

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
=======
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/toast/use-toast'
>>>>>>> 2c18bd1839144712220935501486f7bb1db62c8f

const { toast } = useToast()
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
<<<<<<< HEAD
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
=======
    const success = await authStore.login({ email: email.value, password: password.value })
    
    if (success) {
      toast({
        title: 'Login berhasil',
        description: 'Selamat datang kembali!',
        class: 'border-green-200 bg-green-50 text-green-800',
      })
      
      // Force redirect ke dashboard
      await router.push('/dashboard')
      // Reload untuk memastikan state terupdate
      window.location.reload()
    }
  } catch (error: any) {
    console.error('Login failed:', error)
    
    toast({
      title: 'Login gagal',
      description: error?.message || 'Periksa email dan password Anda.',
      variant: 'destructive',
>>>>>>> 2c18bd1839144712220935501486f7bb1db62c8f
    })
  } finally {
    loading.value = false
  }
}
</script>
