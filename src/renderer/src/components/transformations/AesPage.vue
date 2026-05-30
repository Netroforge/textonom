<script setup lang="ts">
import { ref, watch } from 'vue'
import { aesEncrypt, aesDecrypt } from '../../transformations/aes'
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
const key = ref(String(initialContent.paramValues?.key ?? ''))
const mode = ref(String(initialContent.paramValues?.mode ?? 'encrypt'))
const outputFormat = ref(String(initialContent.paramValues?.output ?? 'base64'))
const isTransforming = ref(false)

const applyTransformation = async (): Promise<void> => {
  if (!inputText.value) return
  isTransforming.value = true
  try {
    const params = { key: key.value, output: outputFormat.value }
    const fn = mode.value === 'encrypt' ? aesEncrypt : aesDecrypt
    outputText.value = await fn(inputText.value, params)
  } catch (error) {
    if (error instanceof Error) outputText.value = `Error: ${error.message}`
    else if (typeof error === 'string') outputText.value = `Error: ${error}`
    else outputText.value = 'An unknown error occurred during transformation'
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

const swapIO = (): void => {
  const tmp = inputText.value
  inputText.value = outputText.value
  outputText.value = tmp
}

watch([inputText, outputText, key, mode, outputFormat], () => {
  tabsContentStore.saveTabContent(props.tabId, {
    inputText: inputText.value,
    outputText: outputText.value,
    paramValues: { key: key.value, mode: mode.value, output: outputFormat.value }
  })
})
</script>

<template>
  <div class="transformation-page">
    <div class="transformation-header">
      <h1>AES Encrypt / Decrypt</h1>
      <p class="transformation-description">
        Encrypt or decrypt text using AES (Advanced Encryption Standard)
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
            :placeholder="
              mode === 'encrypt' ? 'Enter text to encrypt...' : 'Enter encrypted text to decrypt...'
            "
            spellcheck="false"
          ></textarea>
        </div>
      </div>

      <div class="actions-container">
        <div class="parameters-container">
          <div class="parameter">
            <label for="aes-mode">Mode</label>
            <select id="aes-mode" v-model="mode" class="parameter-input" :disabled="isTransforming">
              <option value="encrypt">Encrypt</option>
              <option value="decrypt">Decrypt</option>
            </select>
          </div>
          <div class="parameter">
            <label for="aes-key">Secret Key</label>
            <input
              id="aes-key"
              v-model="key"
              type="text"
              class="parameter-input"
              :disabled="isTransforming"
              placeholder="Enter encryption key..."
            />
          </div>
          <div class="parameter">
            <label for="aes-format">Output Format</label>
            <select
              id="aes-format"
              v-model="outputFormat"
              class="parameter-input"
              :disabled="isTransforming"
            >
              <option value="base64">Base64</option>
              <option value="hex">Hex</option>
            </select>
          </div>
        </div>

        <button
          class="action-button transform-button"
          :disabled="isTransforming || !inputText || !key"
          @click="applyTransformation"
        >
          {{ mode === 'encrypt' ? 'Encrypt' : 'Decrypt' }}
        </button>
        <button
          class="action-button clear-button"
          :disabled="isTransforming || (!inputText && !outputText)"
          @click="clearInput"
        >
          Clear
        </button>
        <button
          class="action-button swap-button"
          :disabled="isTransforming || !outputText"
          @click="swapIO"
        >
          Swap I/O
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
          <TransformationAnimation v-if="isTransforming" transformation-name="AES" />
          <textarea
            id="output-textarea"
            :value="outputText"
            readonly
            class="transformation-textarea"
            :placeholder="
              mode === 'encrypt'
                ? 'Encrypted output will appear here...'
                : 'Decrypted output will appear here...'
            "
            spellcheck="false"
          ></textarea>
        </div>
      </div>
    </div>
  </div>
</template>
