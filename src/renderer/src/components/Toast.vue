<script setup lang="ts">
import { useToast } from '../stores/toastStore'
import './Toast.css'

const { toasts } = useToast()
</script>

<template>
  <div class="toast-container">
    <TransitionGroup name="toast">
      <div v-for="toast in toasts" :key="toast.id" class="toast" :class="`toast--${toast.type}`">
        {{ toast.message }}
      </div>
    </TransitionGroup>
  </div>
</template>
