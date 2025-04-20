<template>
  <div class="bcrypt-dialog" @click.self="close">
    <div class="bcrypt-content">
      <div class="bcrypt-header">
        <h2>Bcrypt Hash Options</h2>
        <button @click="close">✕</button>
      </div>

      <div class="bcrypt-body">
        <div class="bcrypt-row">
          <label class="bcrypt-label">Rounds (Cost Factor)</label>
          <div class="bcrypt-control">
            <input v-model="rounds" type="number" min="1" max="20" @input="validateRounds" />
          </div>
        </div>
        <div class="bcrypt-info">
          <p>
            Higher rounds provide stronger security but take longer to compute. Range: 1-20,
            Default: 12
          </p>
          <p>
            <strong>Security Note:</strong> Values below 10 are not recommended for sensitive data.
          </p>
        </div>
      </div>

      <div class="bcrypt-footer">
        <button @click="saveAsDefault">Save as Default</button>
        <button @click="applyOnce">Apply Once</button>
        <button @click="close">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useSettingsStore } from '../store/settingsStore'

// Define props and emits
const emit = defineEmits<{
  close: []
  apply: [rounds: number]
}>()

// Get the settings store
const settingsStore = useSettingsStore()

// Create reactive ref for rounds
const rounds = ref<number>(settingsStore.bcryptRounds)

// Validate rounds to ensure they're within range
const validateRounds = (): void => {
  // Convert to number and clamp between 1 and 20
  rounds.value = Math.max(1, Math.min(20, Number(rounds.value) || 1))
}

// Save the current rounds as the default in settings
const saveAsDefault = (): void => {
  settingsStore.setBcryptRounds(rounds.value)
  emit('apply', rounds.value)
  emit('close')
}

// Apply the current rounds just for this operation
const applyOnce = (): void => {
  emit('apply', rounds.value)
  emit('close')
}

// Close the dialog
const close = (): void => {
  emit('close')
}

// When component is mounted, ensure the rounds value is set from settings
onMounted(() => {
  rounds.value = settingsStore.bcryptRounds
})
</script>

<style scoped>
.bcrypt-dialog {
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

.bcrypt-content {
  background-color: var(--background);
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  width: 90%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  max-height: 90vh;
  overflow: hidden;
}

.bcrypt-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid var(--border);
}

.bcrypt-header h2 {
  margin: 0;
  font-size: 1.2rem;
}

.bcrypt-header button {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: var(--text);
}

.bcrypt-body {
  padding: 16px;
  overflow-y: auto;
  flex: 1;
}

.bcrypt-row {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.bcrypt-label {
  flex: 0 0 40%;
  font-weight: bold;
}

.bcrypt-control {
  flex: 1;
}

.bcrypt-control input[type='number'] {
  width: 100%;
  padding: 8px;
  border: 1px solid var(--border);
  border-radius: 4px;
  background-color: var(--inputBackground);
  color: var(--text);
}

.bcrypt-info {
  margin-top: 16px;
  font-size: 0.9em;
  color: var(--textSecondary);
}

.bcrypt-footer {
  display: flex;
  justify-content: flex-end;
  padding: 16px;
  border-top: 1px solid var(--border);
  gap: 8px;
}

.bcrypt-footer button {
  padding: 8px 16px;
  border: 1px solid var(--border);
  border-radius: 4px;
  background-color: var(--surface);
  color: var(--text);
  cursor: pointer;
  transition: background-color 0.2s;
}

.bcrypt-footer button:hover {
  background-color: var(--menuHoverBackground);
}

.bcrypt-footer button:first-child {
  margin-right: auto;
}
</style>
