import { ref } from 'vue'

export interface Toast {
  id: number
  message: string
  type: 'success' | 'error' | 'info'
}

const toasts = ref<Toast[]>([])
let nextId = 0

export function useToast(): {
  toasts: typeof toasts
  showToast: (message: string, type?: Toast['type'], duration?: number) => void
} {
  const showToast = (message: string, type: Toast['type'] = 'success', duration = 2000): void => {
    const id = nextId++
    toasts.value = [...toasts.value, { id, message, type }]
    setTimeout(() => {
      toasts.value = toasts.value.filter((t) => t.id !== id)
    }, duration)
  }

  return { toasts, showToast }
}
