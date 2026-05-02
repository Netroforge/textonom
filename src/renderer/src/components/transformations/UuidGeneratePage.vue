<script setup lang="ts">
import { ref, watch } from 'vue'
import { uuidGenerate } from '../../transformations/uuid'
import { useTabsContentStore } from '../../stores/tabsContentStore'
import './TransformationPage.css'

const props = defineProps<{ tabId: string }>()

const tabsContentStore = useTabsContentStore()
const initialContent = tabsContentStore.getTabContent(props.tabId)

const outputText = ref(initialContent.outputText)
const count = ref(Number(initialContent.paramValues?.count ?? 1))
const uppercase = ref(initialContent.paramValues?.uppercase === true)
const isTransforming = ref(false)

const applyTransformation = async (): Promise<void> => {
  isTransforming.value = true
  try {
    outputText.value = await uuidGenerate('', { count: count.value, uppercase: uppercase.value })
  } catch (error) {
    if (error instanceof Error) outputText.value = `Error: ${error.message}`
    else outputText.value = 'An unknown error occurred'
  } finally {
    isTransforming.value = false
  }
}

const clearOutput = (): void => {
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

watch([outputText, count, uppercase], () => {
  tabsContentStore.saveTabContent(props.tabId, {
    inputText: '',
    outputText: outputText.value,
    paramValues: { count: count.value, uppercase: uppercase.value }
  })
})
</script>

<template>
  <div class="transformation-page">
    <div class="transformation-header">
      <h1>UUID Generator</h1>
      <p class="transformation-description">Generate one or more random UUIDs (v4)</p>
    </div>

    <div class="parameters-container">
      <div class="parameter">
        <label for="uuid-count">Count</label>
        <input
          id="uuid-count"
          v-model.number="count"
          type="number"
          min="1"
          max="1000"
          class="parameter-input"
          :disabled="isTransforming"
        />
      </div>
      <div class="parameter">
        <label for="uuid-uppercase" class="checkbox-label">
          <input
            id="uuid-uppercase"
            v-model="uppercase"
            type="checkbox"
            :disabled="isTransforming"
          />
          Uppercase
        </label>
      </div>
    </div>

    <div class="transformation-content">
      <div class="actions-container">
        <button
          class="action-button transform-button"
          :disabled="isTransforming"
          @click="applyTransformation"
        >
          Generate
        </button>
        <button
          class="action-button clear-button"
          :disabled="isTransforming || !outputText"
          @click="clearOutput"
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
            placeholder="Generated UUIDs will appear here..."
            spellcheck="false"
          ></textarea>
        </div>
      </div>
    </div>
  </div>
</template>
