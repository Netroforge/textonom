<template>
  <div class="about-dialog" @click.self="close">
    <div class="about-content">
      <div class="about-header">
        <h2>About Textonom</h2>
        <button @click="close">✕</button>
      </div>

      <div class="about-section">
        <div class="app-logo">
          <div class="image-wrapper">
            <img
              class="app-logo-image"
              width="256"
              height="256"
              src="../assets/e55776f0-9aff-49ea-ba3c-7c796e1a98cf-no-background.png"
              alt=""
            />
          </div>
        </div>
        <div class="app-info">
          <h3>Textonom {{ appVersion }}</h3>
          <p>A text editor that lets you perform common text transformations locally.</p>
        </div>
      </div>

      <div class="about-footer">
        <button @click="close">Close</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// Define props and emits
const emit = defineEmits<{
  close: []
}>()

// App version
const appVersion = ref<string>('Loading...')

// Get app version on mount
onMounted(async () => {
  try {
    appVersion.value = await window.api.getAppVersion()
  } catch (error) {
    console.error('Error getting app version:', error)
    appVersion.value = 'Unknown'
  }
})

// Close the about dialog
const close = (): void => {
  emit('close')
}
</script>

<style scoped>
.about-dialog {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.about-content {
  background-color: var(--background);
  border: 1px solid var(--border);
  border-radius: 4px;
  width: 550px;
  max-width: 90%;
  max-height: 90%;
  overflow-y: auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.about-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  background-color: var(--background);
  z-index: 1;
}

.about-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: var(--text);
}

.about-header button {
  background: none;
  border: none;
  color: var(--text);
  font-size: 1.2rem;
  cursor: pointer;
}

.about-section {
  padding: 1rem;
  border-bottom: 1px solid var(--border);
  background-color: var(--background);
}

.app-info {
  text-align: center;
  margin: 1rem 0;
}

.app-logo {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
  /* Ensure exact match with about-content background */
  background-color: transparent;
}

.image-wrapper {
  background-color: var(--background);
  display: inline-block;
}

.app-logo-image {
  display: block;
  background-color: var(--background);
}

.about-section-title {
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1.2rem;
  color: var(--text);
}

.about-row {
  margin-bottom: 0.5rem;
  display: flex;
  justify-content: center;
}

.check-updates-btn {
  background-color: var(--primary);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  border: none;
  width: 100%;
  margin-top: 0.5rem;
}

.check-updates-btn:hover {
  background-color: var(--info);
}

.about-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  padding: 1rem;
}

.about-footer button {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  background-color: var(--surface);
  color: var(--text);
  border: 1px solid var(--border);
}

.about-footer button:hover {
  background-color: var(--menuHoverBackground);
}
</style>
