<script setup lang="ts">
import { ref, watch } from 'vue'
import { argon2Hash } from '../../transformations/hash'
import { useTabsContentStore } from '../../stores/tabsContentStore'
import TransformationAnimation from '../TransformationAnimation.vue'
import './TransformationPage.css'

const props = defineProps<{ tabId: string }>()

const tabsContentStore = useTabsContentStore()
const initialContent = tabsContentStore.getTabContent(props.tabId)

const inputText = ref(initialContent.inputText)
const outputText = ref(initialContent.outputText)
const type = ref(Number(initialContent.paramValues?.type ?? 2))
const memoryCost = ref(Number(initialContent.paramValues?.memoryCost ?? 1024))
const timeCost = ref(Number(initialContent.paramValues?.timeCost ?? 3))
const parallelism = ref(Number(initialContent.paramValues?.parallelism ?? 1))
const isTransforming = ref(false)

const applyTransformation = async (): Promise<void> => {
  if (!inputText.value) return
  isTransforming.value = true
  try {
    const result = await argon2Hash(inputText.value, {
      type: type.value,
      memoryCost: memoryCost.value,
      timeCost: timeCost.value,
      parallelism: parallelism.value
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

watch([inputText, outputText, type, memoryCost, timeCost, parallelism], () => {
  tabsContentStore.saveTabContent(props.tabId, {
    inputText: inputText.value,
    outputText: outputText.value,
    paramValues: {
      type: type.value,
      memoryCost: memoryCost.value,
      timeCost: timeCost.value,
      parallelism: parallelism.value
    }
  })
})
</script>

<template>
  <div class="transformation-page">
    <div class="transformation-header">
      <h1>Argon2 Hash</h1>
      <p class="transformation-description">
        Generate Argon2-like hash of text (simulated using PBKDF2 for browser compatibility)
      </p>
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
          ></textarea>
        </div>
      </div>

      <div class="actions-container">
        <div class="parameters-container">
          <div class="parameter">
            <label for="type-select">Argon2 Variant</label>
            <select
              id="type-select"
              v-model.number="type"
              class="parameter-input"
              :disabled="isTransforming"
            >
              <option :value="0">argon2d</option>
              <option :value="1">argon2i</option>
              <option :value="2">argon2id (recommended)</option>
            </select>
          </div>
          <div class="parameter">
            <label for="memory-cost-input">Memory Cost (KiB)</label>
            <input
              id="memory-cost-input"
              v-model.number="memoryCost"
              type="number"
              min="256"
              max="4096"
              step="256"
              class="parameter-input"
              :disabled="isTransforming"
            />
          </div>
          <div class="parameter">
            <label for="time-cost-input">Time Cost (Iterations)</label>
            <input
              id="time-cost-input"
              v-model.number="timeCost"
              type="number"
              min="1"
              max="10"
              class="parameter-input"
              :disabled="isTransforming"
            />
          </div>
          <div class="parameter">
            <label for="parallelism-input">Parallelism</label>
            <input
              id="parallelism-input"
              v-model.number="parallelism"
              type="number"
              min="1"
              max="16"
              class="parameter-input"
              :disabled="isTransforming"
            />
          </div>
        </div>

        <button
          class="action-button transform-button"
          :disabled="isTransforming"
          @click="applyTransformation"
        >
          Hash
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
          <TransformationAnimation v-if="isTransforming" transformation-name="Argon2 Hash" />
          <textarea
            id="output-textarea"
            :value="outputText"
            readonly
            class="transformation-textarea"
            placeholder="Argon2 hash will appear here..."
            spellcheck="false"
          ></textarea>
        </div>
      </div>
    </div>
  </div>
</template>
