<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
    <Card class="w-full max-w-md">
      <CardHeader class="space-y-1">
        <CardTitle class="text-2xl font-bold text-center">Create Account</CardTitle>
        <CardDescription class="text-center">
          Fill in the details below to register
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form @submit.prevent="handleRegister" class="space-y-4">
          <div class="space-y-2">
            <Label for="name">Full Name</Label>
            <Input
              id="name"
              v-model="name"
              type="text"
              placeholder="John Doe"
              required
            />
          </div>

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

          <div class="space-y-2">
            <Label for="password_confirmation">Confirm Password</Label>
            <Input
              id="password_confirmation"
              v-model="passwordConfirmation"
              type="password"
              placeholder="••••••••"
              required
            />
          </div>

          <Button
            type="submit"
            class="w-full mb-2"
            :disabled="loading"
          >
            {{ loading ? 'Creating account...' : 'Register' }}
          </Button>

          <CardDescription class="text-center text-sm">
            Already have an account?
            <RouterLink
              to="/login"
              class="ml-1 font-medium text-muted-foreground hover:text-blue-600 transition-colors"
            >
              Login
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
  CardTitle
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/toast/use-toast'


const { toast } = useToast()

const router = useRouter()
const authStore = useAuthStore()

const name = ref('')
const email = ref('')
const password = ref('')
const passwordConfirmation = ref('')
const loading = ref(false)

const handleRegister = async () => {
  loading.value = true
  try {
    await authStore.register({
      name: name.value,
      email: email.value,
      password: password.value,
      password_confirmation: passwordConfirmation.value,
    })

    toast({
      title: 'Registrasi berhasil',
      description: 'Akun kamu berhasil dibuat. Silakan login.',
      class: 'border-green-200 bg-green-50 text-green-800',
    })

    router.push('/login')
  } catch (error: any) {
    console.error('Register failed:', error)

    toast({
      title: 'Registrasi gagal',
      description: error?.message || 'Terjadi kesalahan',
      variant: 'destructive',
    })
  } finally {
    loading.value = false
  }
}

</script>
