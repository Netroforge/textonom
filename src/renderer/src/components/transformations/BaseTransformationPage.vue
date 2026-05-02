<script setup lang="ts">
import { ref, watch } from 'vue'
import { useTabsContentStore } from '../../stores/tabsContentStore'
import { TransformationParamValues } from '../../types/transformation'
import TransformationAnimation from '../TransformationAnimation.vue'
import './TransformationPage.css'

const props = defineProps<{
  tabId: string
  transformationName: string
  transformationDescription: string
  inputPlaceholder: string
  outputPlaceholder: string
  transformButtonText: string
  transformFunction: (text: string, params?: TransformationParamValues) => Promise<string>
}>()

const tabsContentStore = useTabsContentStore()
const initialContent = tabsContentStore.getTabContent(props.tabId)

const inputText = ref(initialContent.inputText)
const outputText = ref(initialContent.outputText)
const paramValues = ref<TransformationParamValues>(initialContent.paramValues)
const isTransforming = ref(false)

const applyTransformation = async (): Promise<void> => {
  if (!inputText.value) return
  isTransforming.value = true

  try {
    const result = await props.transformFunction(inputText.value, paramValues.value)
    outputText.value = result
    setTimeout(() => {
      isTransforming.value = false
    }, 100)
  } catch (error) {
    console.error('Transformation error:', error)
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

watch(
  [inputText, outputText, paramValues],
  () => {
    tabsContentStore.saveTabContent(props.tabId, {
      inputText: inputText.value,
      outputText: outputText.value,
      paramValues: paramValues.value
    })
  },
  { deep: true }
)
</script>

<template>
  <div class="transformation-page">
    <div class="transformation-header">
      <h1>{{ transformationName }}</h1>
      <p class="transformation-description">{{ transformationDescription }}</p>
    </div>

    <div v-if="$slots.parameters" class="parameters-container">
      <slot name="parameters" />
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
          <TransformationAnimation
            v-if="isTransforming"
            :transformation-name="transformationName"
          />
          <textarea
            id="output-textarea"
            :value="outputText"
            readonly
            class="transformation-textarea"
            :placeholder="outputPlaceholder"
            spellcheck="false"
          ></textarea>
        </div>
      </div>
    </div>
  </div>
</template>
