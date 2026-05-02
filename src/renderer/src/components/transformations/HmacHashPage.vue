<script setup lang="ts">
import { ref, watch } from 'vue'
import { hmacHash } from '../../transformations/hash'
import { useTabsContentStore } from '../../stores/tabsContentStore'
import TransformationAnimation from '../TransformationAnimation.vue'
import './TransformationPage.css'

const props = defineProps<{ tabId: string }>()

const tabsContentStore = useTabsContentStore()
const initialContent = tabsContentStore.getTabContent(props.tabId)

const inputText = ref(initialContent.inputText)
const outputText = ref(initialContent.outputText)
const secretKey = ref(String(initialContent.paramValues?.key ?? ''))
const algorithm = ref(String(initialContent.paramValues?.algorithm ?? 'SHA256'))
const isTransforming = ref(false)

const applyTransformation = async (): Promise<void> => {
  if (!inputText.value) return
  if (!secretKey.value) {
    outputText.value = 'Error: Secret key is required'
    return
  }

  isTransforming.value = true
  try {
    outputText.value = await hmacHash(inputText.value, {
      key: secretKey.value,
      algorithm: algorithm.value
    })
  } catch (error) {
    console.error('Transformation error:', error)
    if (error instanceof Error) outputText.value = `Error: ${error.message}`
    else if (typeof error === 'string') outputText.value = `Error: ${error}`
    else outputText.value = 'An unknown error occurred during transformation'
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

watch([inputText, outputText, secretKey, algorithm], () => {
  tabsContentStore.saveTabContent(props.tabId, {
    inputText: inputText.value,
    outputText: outputText.value,
    paramValues: { key: secretKey.value, algorithm: algorithm.value }
  })
})
</script>

<template>
  <div class="transformation-page">
    <div class="transformation-header">
      <h1>HMAC Hash</h1>
      <p class="transformation-description">
        Generate HMAC (Hash-based Message Authentication Code) using various algorithms
      </p>
    </div>

    <div class="parameters-container">
      <div class="parameter">
        <label for="hmac-secret-key">Secret Key</label>
        <input
          id="hmac-secret-key"
          v-model="secretKey"
          type="text"
          class="parameter-input"
          :disabled="isTransforming"
          placeholder="Enter secret key"
        />
      </div>
      <div class="parameter">
        <label for="hmac-algorithm">Algorithm</label>
        <select
          id="hmac-algorithm"
          v-model="algorithm"
          class="parameter-input"
          :disabled="isTransforming"
        >
          <option value="SHA256">SHA-256</option>
          <option value="SHA512">SHA-512</option>
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
            placeholder="Enter text to hash..."
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
          Generate HMAC
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
          <TransformationAnimation v-if="isTransforming" transformation-name="HMAC Hash" />
          <textarea
            id="output-textarea"
            :value="outputText"
            readonly
            class="transformation-textarea"
            placeholder="HMAC hash will appear here..."
            spellcheck="false"
          ></textarea>
        </div>
      </div>
    </div>
  </div>
</template>
