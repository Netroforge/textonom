<template>
  <div class="transformation-page">
    <div class="transformation-header">
      <h1>{{ transformationName }}</h1>
      <p class="transformation-description">{{ transformationDescription }}</p>
    </div>

    <div class="transformation-content">
      <div class="textarea-container">
        <label for="input-textarea">Input</label>
        <div class="textarea-wrapper">
          <textarea
            id="input-textarea"
            v-model="inputText"
            class="transformation-textarea"
            :placeholder="inputPlaceholder"
            spellcheck="false"
          ></textarea>
        </div>
      </div>

      <div class="actions-container">
        <button
          class="action-button transform-button"
          :disabled="isTransforming"
          @click="applyTransformation"
        >
          {{ transformButtonText }}
        </button>
        <button
          class="action-button clear-button"
          :disabled="isTransforming || !inputText"
          @click="clearInput"
        >
          Clear Input
        </button>
        <button
          class="action-button copy-button"
          :disabled="isTransforming || !outputText"
          @click="copyOutput"
        >
          Copy Output
        </button>
      </div>

      <div class="textarea-container">
        <label for="output-textarea">Output</label>
        <div class="textarea-wrapper">
          <!-- Transformation Animation -->
          <TransformationAnimation
            v-if="isTransforming"
            :transformation-name="transformationName"
          />
          <textarea
            id="output-textarea"
            v-model="outputText"
            class="transformation-textarea"
            :placeholder="outputPlaceholder"
            readonly
            spellcheck="false"
          ></textarea>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { urlDecode } from '../../transformations/url'
import { useTabsContentStore } from '../../store/tabsContentStore'
import { TransformationParamValues } from '../../types/transformation'
import TransformationAnimation from '../TransformationAnimation.vue'

// Define tab properties
const props = defineProps<{
  tabId: string
}>()

// Define transformation properties
const transformationName = 'Url Decode'
const transformationDescription = 'Decode URL encoded text'
const inputPlaceholder = 'Enter URL encoded text to decode...'
const outputPlaceholder = 'URL decoded output will appear here...'
const transformButtonText = 'Decode'

// Get stores
const tabsContentStore = useTabsContentStore()

// Reactive state
const inputText = ref('')
const outputText = ref('')
const paramValues = ref<TransformationParamValues>({})
const isTransforming = ref(false)

// Apply the transformation
const applyTransformation = async (): Promise<void> => {
  if (!inputText.value) return

  // Start transformation and show overlay
  isTransforming.value = true

  try {
    // Apply the transformation
    outputText.value = await urlDecode(inputText.value)

    // End transformation after a short delay to show the animation
    setTimeout(() => {
      isTransforming.value = false
    }, 100)
  } catch (error) {
    console.error('Transformation error:', error)
    // Improve error handling with more specific error messages
    if (error instanceof Error) {
      outputText.value = `Error: ${error.message}`
    } else if (typeof error === 'string') {
      outputText.value = `Error: ${error}`
    } else {
      outputText.value = 'An unknown error occurred during transformation'
    }
    isTransforming.value = false
  }
}

// Clear input
const clearInput = (): void => {
  inputText.value = ''
  outputText.value = ''
}

// Copy output to clipboard
const copyOutput = async (): Promise<void> => {
  if (!outputText.value) return

  try {
    await navigator.clipboard.writeText(outputText.value)
  } catch (error) {
    console.error('Failed to copy to clipboard:', error)
    // Handle clipboard errors more gracefully
    alert('Failed to copy to clipboard. Please try again or copy manually.')
  }
}

// Save current tab state
const saveTabState = (): void => {
  tabsContentStore.saveTabContent(props.tabId, {
    inputText: inputText.value,
    outputText: outputText.value,
    paramValues: { ...paramValues.value }
  })
}

// Watch for changes in input, output, and parameters to save state
watch(
  [inputText, outputText, paramValues],
  () => {
    saveTabState()
  },
  { deep: true }
)

// Save state before component is unmounted
onBeforeUnmount(() => {
  saveTabState()
})

// Initialize parameter values and restore saved state
onMounted(() => {
  // Try to restore the saved state
  const savedState = tabsContentStore.getTabContent(props.tabId)

  if (savedState) {
    // Restore saved state
    inputText.value = savedState.inputText
    outputText.value = savedState.outputText
    paramValues.value = { ...savedState.paramValues }
  }
})
</script>

<style scoped>
.transformation-page {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 1rem;
  background-color: var(--background);
  color: var(--text);
  overflow-y: auto;
}

.transformation-header {
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border);
}

.transformation-header h1 {
  margin-bottom: 0.5rem;
  font-size: 1.8rem;
}

.transformation-description {
  color: var(--textSecondary);
  font-size: 1rem;
}

.transformation-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex: 1;
  min-height: 0;
}

.textarea-container {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
}

.textarea-wrapper {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.textarea-container label {
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.transformation-textarea {
  flex: 1;
  min-height: 150px;
  padding: 0.75rem;
  border: 1px solid var(--border);
  border-radius: 4px;
  background-color: var(--inputBackground);
  color: var(--text);
  font-family: var(--fontFamily);
  font-size: var(--fontSize);
  resize: none;
}

.actions-container {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  padding: 1rem 0;
}

.action-button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  transition:
    background-color 0.2s,
    opacity 0.2s;
}

.action-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.transform-button {
  background-color: var(--primary);
  color: white;
}

.transform-button:hover:not(:disabled) {
  background-color: var(--primaryDark);
}

.clear-button {
  background-color: var(--surface);
  color: var(--text);
  border: 1px solid var(--border);
}

.clear-button:hover:not(:disabled) {
  background-color: var(--surfaceHover);
}

.copy-button {
  background-color: var(--info);
  color: white;
}

.copy-button:hover:not(:disabled) {
  background-color: var(--infoDark);
}

@media (min-width: 768px) {
  .transformation-content {
    flex-direction: row;
  }

  .actions-container {
    flex-direction: column;
    justify-content: center;
    padding: 0 1rem;
  }
}
</style>
