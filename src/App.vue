<template>
  <router-view />
<<<<<<< HEAD
  <Toast 
    v-if="toastState.visible"
    :message="toastState.message" 
    :type="toastState.type" 
  />
</template>

<script setup lang="ts">
import Toast from '@/components/Toast.vue'
import { useToast } from '@/composables/useToast'

const { toastState } = useToast()
=======
  <Toaster/>
</template>

<script setup lang="ts">
import { Toaster } from '@/components/ui/toast'
>>>>>>> 1bc0a473434b7cc1c74f8beac1747ae3953dc831
</script>
