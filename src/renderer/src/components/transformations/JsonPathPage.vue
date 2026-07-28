<script setup lang="ts">
import { ref, watch } from 'vue'
import { useTabsContentStore } from '../../stores/tabsContentStore'
import { useToast } from '../../stores/toastStore'
import jsonPathQuery from '../../transformations/structured/json-path'
import './TransformationPage.css'

const props = defineProps<{ tabId: string; transformationId: string }>()
const tabsContentStore = useTabsContentStore()
const { showToast } = useToast()
const initial = tabsContentStore.getTabContent(props.tabId)

const inputText = ref(initial.inputText)
const outputText = ref(initial.outputText)
const path = ref(String(initial.paramValues?.path ?? '$'))
const isTransforming = ref(false)

const run = async (): Promise<void> => {
  if (!inputText.value.trim()) return
  isTransforming.value = true
  try {
    outputText.value = await jsonPathQuery(inputText.value, { path: path.value })
  } catch (error) {
    outputText.value = `Error: ${error instanceof Error ? error.message : String(error)}`
  } finally {
    isTransforming.value = false
  }
}

const copyOutput = async (): Promise<void> => {
  if (!outputText.value) return
  try {
    await navigator.clipboard.writeText(outputText.value)
    showToast('JSONPath result copied')
  } catch {
    showToast('Failed to copy output', 'error')
  }
}

const clearAll = (): void => {
  inputText.value = ''
  outputText.value = ''
}

watch(
  [inputText, outputText, path],
  () =>
    tabsContentStore.saveTabContent(props.tabId, {
      inputText: inputText.value,
      outputText: outputText.value,
      paramValues: { path: path.value }
    }),
  { deep: true }
)
</script>

<template>
  <div class="transformation-page">
    <div class="transformation-header">
      <h1>JSONPath Query</h1>
      <p class="transformation-description">
        Query JSON locally with JSONPath filters, recursive descent, slices, and wildcards
      </p>
    </div>

    <div class="parameters-container">
      <div class="parameter">
        <label for="jsonpath-expression">JSONPath expression</label>
        <input
          id="jsonpath-expression"
          v-model="path"
          class="parameter-input"
          spellcheck="false"
          placeholder="$.store.books[?(@.price < 10)]"
          @keydown.enter.prevent="run"
        />
      </div>
    </div>

    <div class="transformation-content">
      <div class="textarea-container">
        <label for="jsonpath-input">JSON document</label>
        <div class="textarea-wrapper">
          <textarea
            id="jsonpath-input"
            v-model="inputText"
            class="transformation-textarea"
            spellcheck="false"
            placeholder='{"store":{"books":[{"title":"One","price":8}]}}'
          ></textarea>
        </div>
      </div>

      <div class="actions-container">
        <button
          class="action-button transform-button"
          :disabled="isTransforming || !inputText.trim() || !path.trim()"
          @click="run"
        >
          Run query
        </button>
        <button
          class="action-button clear-button"
          :disabled="!inputText && !outputText"
          @click="clearAll"
        >
          Clear
        </button>
        <button class="action-button copy-button" :disabled="!outputText" @click="copyOutput">
          Copy output
        </button>
      </div>

      <div class="textarea-container">
        <label for="jsonpath-output">Matches</label>
        <div class="textarea-wrapper">
          <textarea
            id="jsonpath-output"
            :value="outputText"
            readonly
            class="transformation-textarea"
            spellcheck="false"
            placeholder="Query matches will appear here..."
          ></textarea>
        </div>
      </div>
    </div>
  </div>
</template>
