<script setup lang="ts">
import { ref, watch } from 'vue'
import { baseConvert } from '../../transformations/numeric'
import { useTabsContentStore } from '../../stores/tabsContentStore'
import './TransformationPage.css'

const props = defineProps<{ tabId: string }>()

const tabsContentStore = useTabsContentStore()
const initialContent = tabsContentStore.getTabContent(props.tabId)

const inputText = ref(initialContent.inputText)
const outputText = ref(initialContent.outputText)
const fromBase = ref(Number(initialContent.paramValues?.fromBase ?? 10))
const toBase = ref(Number(initialContent.paramValues?.toBase ?? 16))
const isTransforming = ref(false)

const applyTransformation = async (): Promise<void> => {
  if (!inputText.value) return
  isTransforming.value = true
  try {
    outputText.value = await baseConvert(inputText.value, {
      fromBase: fromBase.value,
      toBase: toBase.value
    })
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

watch([inputText, outputText, fromBase, toBase], () => {
  tabsContentStore.saveTabContent(props.tabId, {
    inputText: inputText.value,
    outputText: outputText.value,
    paramValues: { fromBase: fromBase.value, toBase: toBase.value }
  })
})
</script>

<template>
  <div class="transformation-page">
    <div class="transformation-header">
      <h1>Number Base Converter</h1>
      <p class="transformation-description">
        Convert numbers (one per line) between binary, octal, decimal, and hex
      </p>
    </div>

    <div class="parameters-container">
      <div class="parameter">
        <label for="from-base">From Base</label>
        <select
          id="from-base"
          v-model.number="fromBase"
          class="parameter-input"
          :disabled="isTransforming"
        >
          <option :value="2">Binary (2)</option>
          <option :value="8">Octal (8)</option>
          <option :value="10">Decimal (10)</option>
          <option :value="16">Hex (16)</option>
        </select>
      </div>
      <div class="parameter">
        <label for="to-base">To Base</label>
        <select
          id="to-base"
          v-model.number="toBase"
          class="parameter-input"
          :disabled="isTransforming"
        >
          <option :value="2">Binary (2)</option>
          <option :value="8">Octal (8)</option>
          <option :value="10">Decimal (10)</option>
          <option :value="16">Hex (16)</option>
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
            placeholder="Numbers, one per line..."
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
            placeholder="Converted numbers will appear here..."
            spellcheck="false"
          ></textarea>
        </div>
      </div>
    </div>
  </div>
</template>
