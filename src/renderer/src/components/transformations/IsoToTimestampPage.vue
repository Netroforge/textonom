<script setup lang="ts">
import { ref, watch } from 'vue'
import { isoToTimestamp } from '../../transformations/timestamp'
import { useTabsContentStore } from '../../stores/tabsContentStore'
import './TransformationPage.css'

const props = defineProps<{ tabId: string }>()

const tabsContentStore = useTabsContentStore()
const initialContent = tabsContentStore.getTabContent(props.tabId)

const inputText = ref(initialContent.inputText)
const outputText = ref(initialContent.outputText)
const unit = ref(String(initialContent.paramValues?.unit ?? 'seconds'))
const isTransforming = ref(false)

const applyTransformation = async (): Promise<void> => {
  if (!inputText.value) return
  isTransforming.value = true
  try {
    outputText.value = await isoToTimestamp(inputText.value, { unit: unit.value })
  } catch (error) {
    if (error instanceof Error) outputText.value = `Error: ${error.message}`
    else outputText.value = 'An unknown error occurred'
  } finally {
    isTransforming.value = false
  }
}

const clearInput = (): void => {
  inputText.value = ''
  outputText.value = ''
}

const copyOutput = async (): Promise<void> => {
  if (!outputText.value) return
  try {
    await navigator.clipboard.writeText(outputText.value)
  } catch (error) {
    console.error('Failed to copy to clipboard:', error)
  }
}

const handleKeydown = (e: KeyboardEvent): void => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    e.preventDefault()
    applyTransformation()
  }
}

watch([inputText, outputText, unit], () => {
  tabsContentStore.saveTabContent(props.tabId, {
    inputText: inputText.value,
    outputText: outputText.value,
    paramValues: { unit: unit.value }
  })
})
</script>

<template>
  <div class="transformation-page">
    <div class="transformation-header">
      <h1>ISO to Unix Timestamp</h1>
      <p class="transformation-description">
        Convert ISO 8601 dates (one per line) to Unix timestamps
      </p>
    </div>

    <div class="parameters-container">
      <div class="parameter">
        <label for="ts-unit">Output Unit</label>
        <select id="ts-unit" v-model="unit" class="parameter-input" :disabled="isTransforming">
          <option value="seconds">Seconds</option>
          <option value="milliseconds">Milliseconds</option>
        </select>
      </div>
    </div>

    <div class="transformation-content">
      <div class="textarea-container">
        <label for="input-textarea">Input</label>
        <div class="textarea-wrapper">
          <textarea
            id="input-textarea"
            v-model="inputText"
            class="transformation-textarea"
            placeholder="2024-01-01T00:00:00Z"
            spellcheck="false"
            @keydown="handleKeydown"
          ></textarea>
        </div>
      </div>

      <div class="actions-container">
        <button
          class="action-button transform-button"
          :disabled="isTransforming"
          @click="applyTransformation"
        >
          Convert
        </button>
        <button
          class="action-button clear-button"
          :disabled="isTransforming || (!inputText && !outputText)"
          @click="clearInput"
        >
          Clear
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
          <textarea
            id="output-textarea"
            :value="outputText"
            readonly
            class="transformation-textarea"
            placeholder="Unix timestamps will appear here..."
            spellcheck="false"
          ></textarea>
        </div>
      </div>
    </div>
  </div>
</template>
