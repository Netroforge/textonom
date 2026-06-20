<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { getTransformationById } from '../../transformations/registry'
import { useTabsContentStore } from '../../stores/tabsContentStore'
import { useToast } from '../../stores/toastStore'
import { TransformationParamValues } from '../../types/transformation'
import TransformationAnimation from '../TransformationAnimation.vue'
import './TransformationPage.css'

const props = defineProps<{ tabId: string; transformationId: string }>()

const tabsContentStore = useTabsContentStore()
const { showToast } = useToast()

const transformation = computed(() => getTransformationById(props.transformationId))
const isGenerator = computed(() => transformation.value?.category === 'generators')
const parameters = computed(() => transformation.value?.parameters ?? [])

const initialContent = tabsContentStore.getTabContent(props.tabId)

// Seed parameter values from any persisted content, then fill in metadata
// defaults for anything not yet set.
const buildInitialParams = (): TransformationParamValues => {
  const values: TransformationParamValues = { ...(initialContent.paramValues ?? {}) }
  for (const param of transformation.value?.parameters ?? []) {
    if (values[param.name] === undefined && param.default !== undefined) {
      values[param.name] = param.default
    }
  }
  return values
}

const inputText = ref(initialContent.inputText)
const outputText = ref(initialContent.outputText)
const paramValues = ref<TransformationParamValues>(buildInitialParams())
const isTransforming = ref(false)

const setParam = (name: string, value: string | number | boolean): void => {
  paramValues.value = { ...paramValues.value, [name]: value }
}

const targetValue = (event: Event): string => (event.target as HTMLInputElement).value
const targetChecked = (event: Event): boolean => (event.target as HTMLInputElement).checked

const SPINNER_THRESHOLD_MS = 150

const applyTransformation = async (): Promise<void> => {
  const fn = transformation.value?.fn
  if (!fn) {
    outputText.value = `Error: unknown transformation "${props.transformationId}"`
    return
  }
  if (!isGenerator.value && !inputText.value) return

  const spinnerTimer = setTimeout(() => {
    isTransforming.value = true
  }, SPINNER_THRESHOLD_MS)

  try {
    const source = isGenerator.value ? '' : inputText.value
    outputText.value = await fn(source, paramValues.value)
  } catch (error) {
    if (error instanceof Error) {
      outputText.value = `Error: ${error.message}`
    } else if (typeof error === 'string') {
      outputText.value = `Error: ${error}`
    } else {
      outputText.value = 'An unknown error occurred during transformation'
    }
  } finally {
    clearTimeout(spinnerTimer)
    isTransforming.value = false
  }
}

const clearAll = (): void => {
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
      <h1>{{ transformation?.name ?? 'Unknown transformation' }}</h1>
      <p class="transformation-description">{{ transformation?.description ?? '' }}</p>
    </div>

    <div v-if="parameters.length" class="parameters-container">
      <div v-for="param in parameters" :key="param.name" class="parameter">
        <label v-if="param.type === 'boolean'" :for="`param-${param.name}`" class="checkbox-label">
          <input
            :id="`param-${param.name}`"
            type="checkbox"
            :checked="paramValues[param.name] === true"
            :disabled="isTransforming"
            @change="setParam(param.name, targetChecked($event))"
          />
          {{ param.description || param.name }}
        </label>
        <template v-else>
          <label :for="`param-${param.name}`">{{ param.description || param.name }}</label>
          <input
            v-if="param.type === 'number'"
            :id="`param-${param.name}`"
            type="number"
            :value="paramValues[param.name]"
            :min="param.min"
            :max="param.max"
            class="parameter-input"
            :disabled="isTransforming"
            @input="setParam(param.name, Number(targetValue($event)))"
          />
          <input
            v-else
            :id="`param-${param.name}`"
            type="text"
            :value="paramValues[param.name]"
            class="parameter-input"
            :disabled="isTransforming"
            @input="setParam(param.name, targetValue($event))"
          />
        </template>
      </div>
    </div>

    <div class="transformation-content">
      <div v-if="!isGenerator" class="textarea-container">
        <label for="input-textarea">Input</label>
        <div class="textarea-wrapper">
          <textarea
            id="input-textarea"
            v-model="inputText"
            class="transformation-textarea"
            placeholder="Enter text..."
            spellcheck="false"
            @keydown="handleInputKeydown"
          ></textarea>
        </div>
      </div>

      <div class="actions-container">
        <button
          class="action-button transform-button"
          :disabled="isTransforming"
          @click="applyTransformation"
        >
          {{ isGenerator ? 'Generate' : 'Transform' }}
        </button>
        <button
          v-if="!isGenerator"
          class="action-button swap-button"
          :disabled="isTransforming || !outputText"
          title="Swap input with output"
          @click="swapIO"
        >
          Swap I/O
        </button>
        <button
          class="action-button clear-button"
          :disabled="isTransforming || (!inputText && !outputText)"
          @click="clearAll"
        >
          Clear
        </button>
        <button
          v-if="!isGenerator"
          class="action-button copy-button"
          :disabled="isTransforming || !inputText"
          title="Copy input to clipboard"
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
          <TransformationAnimation
            v-if="isTransforming"
            :transformation-name="transformation?.name ?? ''"
          />
          <textarea
            id="output-textarea"
            :value="outputText"
            readonly
            class="transformation-textarea"
            placeholder="Output will appear here..."
            spellcheck="false"
          ></textarea>
        </div>
      </div>
    </div>
  </div>
</template>
