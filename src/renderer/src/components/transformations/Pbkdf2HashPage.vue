<script setup lang="ts">
import { ref, watch } from 'vue'
import { pbkdf2Hash } from '../../transformations/hash'
import { useTabsContentStore } from '../../stores/tabsContentStore'
import TransformationAnimation from '../TransformationAnimation.vue'
import './TransformationPage.css'

const props = defineProps<{ tabId: string }>()

const tabsContentStore = useTabsContentStore()
const initialContent = tabsContentStore.getTabContent(props.tabId)

const inputText = ref(initialContent.inputText)
const outputText = ref(initialContent.outputText)
const algorithm = ref(String(initialContent.paramValues?.algorithm ?? 'SHA256'))
const iterations = ref(Number(initialContent.paramValues?.iterations ?? 100000))
const keyLength = ref(Number(initialContent.paramValues?.keyLength ?? 32))
const salt = ref(String(initialContent.paramValues?.salt ?? ''))
const isTransforming = ref(false)

const applyTransformation = async (): Promise<void> => {
  if (!inputText.value) return
  isTransforming.value = true
  try {
    outputText.value = await pbkdf2Hash(inputText.value, {
      algorithm: algorithm.value,
      iterations: iterations.value,
      keyLength: keyLength.value,
      salt: salt.value
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
  } catch {
    // Ignore clipboard errors
  }
}

watch([inputText, outputText, algorithm, iterations, keyLength, salt], () => {
  tabsContentStore.saveTabContent(props.tabId, {
    inputText: inputText.value,
    outputText: outputText.value,
    paramValues: {
      algorithm: algorithm.value,
      iterations: iterations.value,
      keyLength: keyLength.value,
      salt: salt.value
    }
  })
})
</script>

<template>
  <div class="transformation-page">
    <div class="transformation-header">
      <h1>PBKDF2 Hash</h1>
      <p class="transformation-description">
        Derive a key from text using PBKDF2 with HMAC. Use a strong, unique salt for password
        hashing.
      </p>
    </div>

    <div class="parameters-container">
      <div class="parameter">
        <label for="pbkdf2-algorithm">HMAC Algorithm</label>
        <select
          id="pbkdf2-algorithm"
          v-model="algorithm"
          class="parameter-input"
          :disabled="isTransforming"
        >
          <option value="SHA1">SHA-1</option>
          <option value="SHA256">SHA-256</option>
          <option value="SHA512">SHA-512</option>
        </select>
      </div>
      <div class="parameter">
        <label for="pbkdf2-iterations">Iterations</label>
        <input
          id="pbkdf2-iterations"
          v-model.number="iterations"
          type="number"
          min="1"
          max="1000000"
          class="parameter-input"
          :disabled="isTransforming"
        />
      </div>
      <div class="parameter">
        <label for="pbkdf2-keylength">Key Length (bytes)</label>
        <input
          id="pbkdf2-keylength"
          v-model.number="keyLength"
          type="number"
          min="8"
          max="128"
          class="parameter-input"
          :disabled="isTransforming"
        />
      </div>
      <div class="parameter">
        <label for="pbkdf2-salt">Salt (hex or text, blank = random)</label>
        <input
          id="pbkdf2-salt"
          v-model="salt"
          type="text"
          class="parameter-input"
          :disabled="isTransforming"
          placeholder="leave blank for random salt"
        />
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
          ></textarea>
        </div>
      </div>

      <div class="actions-container">
        <button
          class="action-button transform-button"
          :disabled="isTransforming"
          @click="applyTransformation"
        >
          Hash
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
          <TransformationAnimation v-if="isTransforming" transformation-name="PBKDF2 Hash" />
          <textarea
            id="output-textarea"
            :value="outputText"
            readonly
            class="transformation-textarea"
            placeholder="PBKDF2 hash will appear here..."
            spellcheck="false"
          ></textarea>
        </div>
      </div>
    </div>
  </div>
</template>
