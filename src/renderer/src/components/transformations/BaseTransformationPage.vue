<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useTabsContentStore } from '../../stores/tabsContentStore'
import { TransformationParamValues } from '../../types/transformation'
import { useToast } from '../../stores/toastStore'
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
const { showToast } = useToast()
const initialContent = tabsContentStore.getTabContent(props.tabId)

const inputText = ref(initialContent.inputText)
const outputText = ref(initialContent.outputText)
const paramValues = ref<TransformationParamValues>(initialContent.paramValues)
const isTransforming = ref(false)
const inputCharacterCount = computed(() => inputText.value.length)
const outputCharacterCount = computed(() => outputText.value.length)

const formatCharacterCount = (count: number): string =>
  `${count.toLocaleString()} ${count === 1 ? 'character' : 'characters'}`

// Show the spinner only if the transform takes long enough that the eye notices.
const SPINNER_THRESHOLD_MS = 150

const applyTransformation = async (): Promise<void> => {
  if (!inputText.value) return
  const spinnerTimer = setTimeout(() => {
    isTransforming.value = true
  }, SPINNER_THRESHOLD_MS)

  try {
    outputText.value = await props.transformFunction(inputText.value, paramValues.value)
  } catch (error) {
    const message =
      error instanceof Error ? error.message : typeof error === 'string' ? error : 'Unknown error'
    showToast(`Transformation failed: ${message}`, 'error')
    outputText.value = `Error: ${message}`
  } finally {
    clearTimeout(spinnerTimer)
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

const swapIO = (): void => {
  const tmp = inputText.value
  inputText.value = outputText.value
  outputText.value = tmp
}

const handleInputKeydown = (e: KeyboardEvent): void => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    e.preventDefault()
    applyTransformation()
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
      <div>
        <span class="transformation-kicker">Transformation</span>
        <h1>{{ transformationName }}</h1>
        <p class="transformation-description">{{ transformationDescription }}</p>
      </div>
      <div class="local-processing-badge" title="Your text is processed on this device">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M8 11V8a4 4 0 0 1 8 0v3m-9 0h10a1 1 0 0 1 1 1v7H6v-7a1 1 0 0 1 1-1Z" />
        </svg>
        Local processing
      </div>
    </div>

    <div v-if="$slots.parameters" class="parameters-container">
      <slot name="parameters" />
    </div>

    <div class="transformation-content">
      <section class="textarea-container">
        <div class="editor-heading">
          <label for="input-textarea">Input</label>
          <div class="editor-meta">
            <span>{{ formatCharacterCount(inputCharacterCount) }}</span>
            <button
              type="button"
              class="editor-action"
              :disabled="isTransforming || !inputText"
              title="Copy input to clipboard"
              aria-label="Copy input to clipboard"
              @click="copyInput"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="8" y="8" width="11" height="11" rx="2" />
                <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
              </svg>
              Copy
            </button>
          </div>
        </div>
        <div class="textarea-wrapper">
          <textarea
            id="input-textarea"
            v-model="inputText"
            class="transformation-textarea"
            :placeholder="inputPlaceholder"
            spellcheck="false"
            @keydown="handleInputKeydown"
          ></textarea>
        </div>
      </section>

      <div class="actions-container">
        <button
          class="action-button transform-button"
          :disabled="isTransforming || !inputText"
          :title="`${transformButtonText} (Ctrl+Enter)`"
          @click="applyTransformation"
        >
          <span>{{ transformButtonText }}</span>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 12h14m-5-5 5 5-5 5" />
          </svg>
          <kbd>Ctrl ↵</kbd>
        </button>
        <button
          class="action-button swap-button"
          :disabled="isTransforming || !outputText"
          title="Swap input with output"
          @click="swapIO"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M7 7h11l-3-3m3 3-3 3M17 17H6l3 3m-3-3 3-3" />
          </svg>
          Swap
        </button>
        <button
          class="action-button clear-button"
          :disabled="isTransforming || (!inputText && !outputText)"
          @click="clearInput"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 7h16m-10 4v6m4-6v6M9 7l1-3h4l1 3m3 0-1 13H7L6 7" />
          </svg>
          Clear
        </button>
      </div>

      <section class="textarea-container">
        <div class="editor-heading">
          <label for="output-textarea">Output</label>
          <div class="editor-meta">
            <span>{{ formatCharacterCount(outputCharacterCount) }}</span>
            <button
              type="button"
              class="editor-action"
              :disabled="isTransforming || !outputText"
              title="Copy output to clipboard"
              aria-label="Copy output to clipboard"
              @click="copyOutput"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="8" y="8" width="11" height="11" rx="2" />
                <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
              </svg>
              Copy
            </button>
          </div>
        </div>
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
      </section>
    </div>
  </div>
</template>
