<script setup lang="ts">
import { ref, watch } from 'vue'
import { regexReplace, regexTest } from '../../transformations/regex'
import { useTabsContentStore } from '../../stores/tabsContentStore'
import { useToast } from '../../stores/toastStore'
import TransformationAnimation from '../TransformationAnimation.vue'
import './TransformationPage.css'

const props = defineProps<{ tabId: string }>()

const tabsContentStore = useTabsContentStore()
const { showToast } = useToast()
const initialContent = tabsContentStore.getTabContent(props.tabId)

const inputText = ref(initialContent.inputText)
const outputText = ref(initialContent.outputText)
const pattern = ref(String(initialContent.paramValues?.pattern ?? ''))
const replacement = ref(String(initialContent.paramValues?.replacement ?? ''))
const flags = ref(String(initialContent.paramValues?.flags ?? 'g'))
const mode = ref(String(initialContent.paramValues?.mode ?? 'replace'))
const isTransforming = ref(false)

const applyTransformation = async (): Promise<void> => {
  if (!inputText.value) return
  if (!pattern.value) {
    outputText.value = 'Error: Find pattern is required'
    return
  }
  isTransforming.value = true
  try {
    const params = { pattern: pattern.value, replacement: replacement.value, flags: flags.value }
    const fn = mode.value === 'replace' ? regexReplace : regexTest
    outputText.value = await fn(inputText.value, params)
  } catch (error) {
    if (error instanceof Error) outputText.value = `Error: ${error.message}`
    else if (typeof error === 'string') outputText.value = `Error: ${error}`
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
    showToast('Output copied to clipboard')
  } catch {
    showToast('Failed to copy to clipboard', 'error')
  }
}

const copyInput = async (): Promise<void> => {
  if (!inputText.value) return
  try {
    await navigator.clipboard.writeText(inputText.value)
    showToast('Input copied to clipboard')
  } catch {
    showToast('Failed to copy to clipboard', 'error')
  }
}

watch([inputText, outputText, pattern, replacement, flags, mode], () => {
  tabsContentStore.saveTabContent(props.tabId, {
    inputText: inputText.value,
    outputText: outputText.value,
    paramValues: {
      pattern: pattern.value,
      replacement: replacement.value,
      flags: flags.value,
      mode: mode.value
    }
  })
})
</script>

<template>
  <div class="transformation-page">
    <div class="transformation-header">
      <h1>Regex Find & Replace</h1>
      <p class="transformation-description">
        Search and replace text using regular expressions, or test matches
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
            placeholder="Enter text to search/replace..."
            spellcheck="false"
          ></textarea>
        </div>
      </div>

      <div class="actions-container">
        <div class="parameters-container">
          <div class="parameter">
            <label for="regex-pattern">Find Pattern</label>
            <input
              id="regex-pattern"
              v-model="pattern"
              type="text"
              class="parameter-input"
              :disabled="isTransforming"
              placeholder="e.g. \d+"
            />
          </div>
          <div v-if="mode === 'replace'" class="parameter">
            <label for="regex-replacement">Replace With</label>
            <input
              id="regex-replacement"
              v-model="replacement"
              type="text"
              class="parameter-input"
              :disabled="isTransforming"
              placeholder="e.g. [number]"
            />
          </div>
          <div class="parameter">
            <label for="regex-flags">Flags</label>
            <input
              id="regex-flags"
              v-model="flags"
              type="text"
              class="parameter-input"
              :disabled="isTransforming"
              placeholder="g, i, m, gi, etc."
              style="width: 80px"
            />
          </div>
          <div class="parameter">
            <label for="regex-mode">Mode</label>
            <select
              id="regex-mode"
              v-model="mode"
              class="parameter-input"
              :disabled="isTransforming"
            >
              <option value="replace">Replace</option>
              <option value="test">Test (list matches)</option>
            </select>
          </div>
        </div>

        <button
          class="action-button transform-button"
          :disabled="isTransforming || !inputText || !pattern"
          @click="applyTransformation"
        >
          {{ mode === 'replace' ? 'Replace' : 'Find Matches' }}
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
          :disabled="isTransforming || !inputText"
          @click="copyInput"
        >
          Copy Input
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
          <TransformationAnimation v-if="isTransforming" transformation-name="Regex" />
          <textarea
            id="output-textarea"
            :value="outputText"
            readonly
            class="transformation-textarea"
            :placeholder="
              mode === 'replace'
                ? 'Replaced text will appear here...'
                : 'Match results will appear here...'
            "
            spellcheck="false"
          ></textarea>
        </div>
      </div>
    </div>
  </div>
</template>
