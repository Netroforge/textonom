<script setup lang="ts">
import { ref, watch } from 'vue'
import { csvToJson } from '../../transformations/conversion'
import { useTabsContentStore } from '../../stores/tabsContentStore'
import TransformationAnimation from '../TransformationAnimation.vue'
import './TransformationPage.css'

const props = defineProps<{ tabId: string }>()

const tabsContentStore = useTabsContentStore()
const initialContent = tabsContentStore.getTabContent(props.tabId)

const inputText = ref(initialContent.inputText)
const outputText = ref(initialContent.outputText)
const delimiter = ref(String(initialContent.paramValues?.delimiter ?? ','))
const hasHeader = ref(initialContent.paramValues?.hasHeader !== false)
const isTransforming = ref(false)

const applyTransformation = async (): Promise<void> => {
  if (!inputText.value) return
  isTransforming.value = true
  try {
    const result = await csvToJson(inputText.value, {
      delimiter: delimiter.value,
      hasHeader: hasHeader.value
    })
    outputText.value = result
    setTimeout(() => {
      isTransforming.value = false
    }, 100)
  } catch (error) {
    console.error('Transformation error:', error)
    if (error instanceof Error) outputText.value = `Error: ${error.message}`
    else if (typeof error === 'string') outputText.value = `Error: ${error}`
    else outputText.value = 'An unknown error occurred during transformation'
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
    alert('Failed to copy to clipboard. Please try again or copy manually.')
  }
}

watch([inputText, outputText, delimiter, hasHeader], () => {
  tabsContentStore.saveTabContent(props.tabId, {
    inputText: inputText.value,
    outputText: outputText.value,
    paramValues: { delimiter: delimiter.value, hasHeader: hasHeader.value }
  })
})
</script>

<template>
  <div class="transformation-page">
    <div class="transformation-header">
      <h1>CSV to JSON</h1>
      <p class="transformation-description">Convert CSV data to JSON format</p>
    </div>

    <div class="transformation-content">
      <div class="textarea-container">
        <label for="input-textarea">Input</label>
        <div class="textarea-wrapper">
          <textarea
            id="input-textarea"
            v-model="inputText"
            class="transformation-textarea"
            placeholder="Enter CSV data to convert to JSON..."
            spellcheck="false"
          ></textarea>
        </div>
      </div>

      <div class="actions-container">
        <div class="parameters-container">
          <div class="parameter">
            <label for="delimiter-input">Delimiter</label>
            <input
              id="delimiter-input"
              v-model="delimiter"
              type="text"
              class="parameter-input"
              :disabled="isTransforming"
              maxlength="1"
              style="width: 40px; text-align: center"
            />
          </div>
          <div class="parameter">
            <label for="has-header-checkbox" class="checkbox-label">
              <input
                id="has-header-checkbox"
                v-model="hasHeader"
                type="checkbox"
                :disabled="isTransforming"
              />
              Has Header Row
            </label>
          </div>
        </div>

        <button
          class="action-button transform-button"
          :disabled="isTransforming"
          @click="applyTransformation"
        >
          Convert
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
          <TransformationAnimation v-if="isTransforming" transformation-name="CSV to JSON" />
          <textarea
            id="output-textarea"
            :value="outputText"
            readonly
            class="transformation-textarea"
            placeholder="JSON output will appear here..."
            spellcheck="false"
          ></textarea>
        </div>
      </div>
    </div>
  </div>
</template>
