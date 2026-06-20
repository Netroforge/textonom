<script setup lang="ts">
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { bcryptHash } from '../../transformations/hash'
import { useTabsContentStore } from '../../stores/tabsContentStore'
import { useSettingsStore } from '../../stores/settingsStore'
import TransformationAnimation from '../TransformationAnimation.vue'
import './TransformationPage.css'

const props = defineProps<{ tabId: string }>()

const settingsStore = useSettingsStore()
const { settings } = storeToRefs(settingsStore)
const tabsContentStore = useTabsContentStore()

const initialContent = tabsContentStore.getTabContent(props.tabId)

const inputText = ref(initialContent.inputText)
const outputText = ref(initialContent.outputText)
const rounds = ref(
  initialContent.paramValues?.rounds
    ? Number(initialContent.paramValues.rounds)
    : settings.value.bcryptRounds || 12
)
const isTransforming = ref(false)

const applyTransformation = async (): Promise<void> => {
  if (!inputText.value) return
  if (rounds.value < 1 || rounds.value > 20) {
    outputText.value = 'Error: Rounds must be between 1 and 20'
    return
  }

  isTransforming.value = true
  try {
    const result = await bcryptHash(inputText.value, rounds.value)
    outputText.value = result
    setTimeout(() => {
      isTransforming.value = false
    }, 100)
  } catch (error) {
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
  } catch {
    alert('Failed to copy to clipboard. Please try again or copy manually.')
  }
}

watch([inputText, outputText, rounds], () => {
  tabsContentStore.saveTabContent(props.tabId, {
    inputText: inputText.value,
    outputText: outputText.value,
    paramValues: { rounds: rounds.value }
  })
})
</script>

<template>
  <div class="transformation-page">
    <div class="transformation-header">
      <h1>Bcrypt Hash</h1>
      <p class="transformation-description">
        Generate bcrypt hash of text (secure password hashing)
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
            <label for="rounds-input">Rounds (Cost Factor)</label>
            <input
              id="rounds-input"
              v-model.number="rounds"
              type="number"
              min="1"
              max="20"
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
          <TransformationAnimation v-if="isTransforming" transformation-name="Bcrypt Hash" />
          <textarea
            id="output-textarea"
            :value="outputText"
            readonly
            class="transformation-textarea"
            placeholder="Bcrypt hash will appear here..."
            spellcheck="false"
          ></textarea>
        </div>
      </div>
    </div>
  </div>
</template>
