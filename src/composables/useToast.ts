import { ref } from 'vue'

interface ToastState {
  message: string
  type: 'success' | 'error'
  visible: boolean
}

const toastState = ref<ToastState>({
  message: '',
  type: 'success',
  visible: false
})

export const useToast = () => {
  const showToast = (message: string, type: 'success' | 'error', duration = 3000) => {
    toastState.value = { message, type, visible: true }
    
    setTimeout(() => {
      toastState.value.visible = false
    }, duration)
  }

  const success = (message: string, duration?: number) => {
    showToast(message, 'success', duration)
  }

  const error = (message: string, duration?: number) => {
    showToast(message, 'error', duration)
  }

  return {
    toastState,
    success,
    error
  }
}