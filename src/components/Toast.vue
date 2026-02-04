<template>
  <Teleport to="body">
    <div v-if="visible" class="fixed top-4 right-4 z-50 transition-all duration-300 ease-in-out"
         :class="[
           visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0',
           type === 'success' ? 'bg-green-500' : 'bg-red-500'
         ]">
      <div class="flex items-center gap-2 text-white px-4 py-3 rounded-lg shadow-lg min-w-[300px]">
        <span v-if="type === 'success'">✅</span>
        <span v-else>❌</span>
        <span>{{ message }}</span>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  message: string
  type: 'success' | 'error'
  duration?: number
}

const props = withDefaults(defineProps<Props>(), {
  duration: 3000
})

const visible = ref(false)

const show = () => {
  visible.value = true
  setTimeout(() => {
    visible.value = false
  }, props.duration)
}

watch(() => props.message, () => {
  if (props.message) {
    show()
  }
})

defineExpose({ show })
</script>