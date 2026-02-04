<template>
  <Transition
    enter-active-class="transition-all duration-300 ease-out"
    enter-from-class="opacity-0 translate-y-[-100%]"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition-all duration-300 ease-in"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 translate-y-[-100%]"
  >
    <div
      v-if="visible"
      :class="[
        'fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg text-gray-800 font-medium flex items-center gap-2',
        type === 'success' ? 'bg-green-100 border border-green-300' : 'bg-red-100 border border-red-300'
      ]"
    >
      <svg v-if="type === 'success'" class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
      </svg>
      <svg v-else class="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
      </svg>
      {{ message }}
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { watch } from 'vue'

interface Props {
  message: string
  type: 'success' | 'error'
  visible: boolean
}

const props = defineProps<Props>()

// Debug: watch props changes
watch(() => props, (newProps) => {
  console.log('Toast props changed:', newProps)
}, { deep: true, immediate: true })
</script>
