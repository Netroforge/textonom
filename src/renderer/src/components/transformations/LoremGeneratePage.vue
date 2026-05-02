<script setup lang="ts">
import { ref, watch } from 'vue'
import { loremGenerate } from '../../transformations/lorem'
import { useTabsContentStore } from '../../stores/tabsContentStore'
import './TransformationPage.css'

const props = defineProps<{ tabId: string }>()

const tabsContentStore = useTabsContentStore()
const initialContent = tabsContentStore.getTabContent(props.tabId)

const outputText = ref(initialContent.outputText)
const unit = ref(String(initialContent.paramValues?.unit ?? 'paragraphs'))
const count = ref(Number(initialContent.paramValues?.count ?? 3))
const isTransforming = ref(false)

const applyTransformation = async (): Promise<void> => {
  isTransforming.value = true
  try {
    outputText.value = await loremGenerate('', { unit: unit.value, count: count.value })
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

watch([outputText, unit, count], () => {
  tabsContentStore.saveTabContent(props.tabId, {
    inputText: '',
    outputText: outputText.value,
    paramValues: { unit: unit.value, count: count.value }
  })
})
</script>

<template>
  <div class="transformation-page">
    <div class="transformation-header">
      <h1>Lorem Ipsum</h1>
      <p class="transformation-description">Generate placeholder lorem ipsum text</p>
    </div>

    <div class="parameters-container">
      <div class="parameter">
        <label for="lorem-unit">Unit</label>
        <select id="lorem-unit" v-model="unit" class="parameter-input" :disabled="isTransforming">
          <option value="paragraphs">Paragraphs</option>
          <option value="sentences">Sentences</option>
          <option value="words">Words</option>
        </select>
      </div>
      <div class="parameter">
        <label for="lorem-count">Count</label>
        <input
          id="lorem-count"
          v-model.number="count"
          type="number"
          min="1"
          max="100"
          class="parameter-input"
          :disabled="isTransforming"
        />
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
            placeholder="Lorem ipsum text will appear here..."
            spellcheck="false"
          ></textarea>
        </div>
      </div>
    </div>
  </div>
</template>
