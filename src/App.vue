<template>
  <router-view />
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
</script>
