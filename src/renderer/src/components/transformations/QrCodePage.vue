<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useTabsContentStore } from '../../stores/tabsContentStore'
import { useToast } from '../../stores/toastStore'
import { fileToDataUrl, qrDecode, qrGenerate } from '../../transformations/media'
import './TransformationPage.css'

const props = defineProps<{ tabId: string; transformationId: string }>()
const tabsContentStore = useTabsContentStore()
const { showToast } = useToast()
const initial = tabsContentStore.getTabContent(props.tabId)

const mode = ref<'generate' | 'decode'>(
  props.transformationId === 'qrDecode' ? 'decode' : 'generate'
)
const inputText = ref(initial.inputText)
const outputText = ref(initial.outputText)
const preview = ref(
  mode.value === 'generate' && initial.outputText.startsWith('data:image/')
    ? initial.outputText
    : ''
)
const errorCorrectionLevel = ref(String(initial.paramValues?.errorCorrectionLevel ?? 'M'))
const size = ref(Number(initial.paramValues?.size ?? 384))
const margin = ref(Number(initial.paramValues?.margin ?? 4))
const fileName = ref('')
const isTransforming = ref(false)
const dropActive = ref(false)

const canRun = computed(() => mode.value === 'generate' && inputText.value.length > 0)

const generate = async (): Promise<void> => {
  if (!canRun.value) return
  isTransforming.value = true
  try {
    outputText.value = await qrGenerate(inputText.value, {
      errorCorrectionLevel: errorCorrectionLevel.value,
      size: size.value,
      margin: margin.value
    })
    preview.value = outputText.value
  } catch (error) {
    showToast(error instanceof Error ? error.message : 'QR generation failed', 'error')
  } finally {
    isTransforming.value = false
  }
}

const decodeFile = async (file: File): Promise<void> => {
  if (!file.type.startsWith('image/')) {
    showToast('Select a PNG, JPEG, or WebP image', 'error')
    return
  }
  fileName.value = file.name
  isTransforming.value = true
  try {
    const dataUrl = await fileToDataUrl(file)
    preview.value = dataUrl
    inputText.value = dataUrl
    outputText.value = await qrDecode(dataUrl)
  } catch (error) {
    outputText.value = ''
    showToast(error instanceof Error ? error.message : 'QR decoding failed', 'error')
  } finally {
    isTransforming.value = false
  }
}

const onFileSelected = (event: Event): void => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) decodeFile(file)
}

const onDrop = (event: DragEvent): void => {
  dropActive.value = false
  const file = event.dataTransfer?.files[0]
  if (file) decodeFile(file)
}

const downloadQr = (): void => {
  if (!preview.value || mode.value !== 'generate') return
  const link = document.createElement('a')
  link.href = preview.value
  link.download = 'textonom-qr.png'
  link.click()
}

const copyOutput = async (): Promise<void> => {
  if (!outputText.value) return
  try {
    await navigator.clipboard.writeText(outputText.value)
    showToast(mode.value === 'decode' ? 'Decoded text copied' : 'QR data URI copied')
  } catch {
    showToast('Failed to copy output', 'error')
  }
}

const clearAll = (): void => {
  inputText.value = ''
  outputText.value = ''
  preview.value = ''
  fileName.value = ''
}

watch(mode, () => clearAll())
watch(
  [inputText, outputText, mode, errorCorrectionLevel, size, margin],
  () =>
    tabsContentStore.saveTabContent(props.tabId, {
      inputText: inputText.value,
      outputText: outputText.value,
      paramValues: {
        mode: mode.value,
        errorCorrectionLevel: errorCorrectionLevel.value,
        size: size.value,
        margin: margin.value
      }
    }),
  { deep: true }
)
</script>

<template>
  <div class="transformation-page">
    <div class="transformation-header">
      <h1>QR Code Reader / Generator</h1>
      <p class="transformation-description">Create or decode QR codes entirely on your device</p>
    </div>

    <div class="parameters-container">
      <div class="parameter">
        <label>Mode</label>
        <div class="qr-mode">
          <button :class="{ active: mode === 'generate' }" @click="mode = 'generate'">
            Generate
          </button>
          <button :class="{ active: mode === 'decode' }" @click="mode = 'decode'">
            Read image
          </button>
        </div>
      </div>
      <template v-if="mode === 'generate'">
        <div class="parameter">
          <label for="qr-level">Error correction</label>
          <select id="qr-level" v-model="errorCorrectionLevel" class="parameter-input">
            <option value="L">Low (L)</option>
            <option value="M">Medium (M)</option>
            <option value="Q">Quartile (Q)</option>
            <option value="H">High (H)</option>
          </select>
        </div>
        <div class="parameter">
          <label for="qr-size">Image size</label>
          <input
            id="qr-size"
            v-model.number="size"
            type="number"
            min="128"
            max="2048"
            class="parameter-input"
          />
        </div>
        <div class="parameter">
          <label for="qr-margin">Quiet-zone modules</label>
          <input
            id="qr-margin"
            v-model.number="margin"
            type="number"
            min="0"
            max="20"
            class="parameter-input"
          />
        </div>
      </template>
    </div>

    <div class="qr-workspace">
      <div class="textarea-container">
        <label>{{ mode === 'generate' ? 'Content' : 'QR image' }}</label>
        <div
          v-if="mode === 'decode'"
          class="qr-drop"
          :class="{ active: dropActive }"
          @dragover.prevent="dropActive = true"
          @dragleave="dropActive = false"
          @drop.prevent="onDrop"
        >
          <input type="file" accept="image/png,image/jpeg,image/webp" @change="onFileSelected" />
          <span>{{ fileName || 'Drop a QR image here or choose a file' }}</span>
        </div>
        <div v-else class="textarea-wrapper">
          <textarea
            v-model="inputText"
            class="transformation-textarea"
            spellcheck="false"
            placeholder="Text or URL to encode..."
          ></textarea>
        </div>
      </div>

      <div class="qr-preview-panel">
        <span>Preview</span>
        <img v-if="preview" :src="preview" alt="QR code preview" />
        <p v-else>No image yet</p>
      </div>
    </div>

    <div class="actions-container">
      <button
        v-if="mode === 'generate'"
        class="action-button transform-button"
        :disabled="isTransforming || !canRun"
        @click="generate"
      >
        Generate QR
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
      <button
        v-if="mode === 'generate'"
        class="action-button save-button"
        :disabled="!preview"
        @click="downloadQr"
      >
        Save PNG
      </button>
    </div>

    <div v-if="mode === 'decode'" class="qr-result textarea-container">
      <label for="qr-result">Decoded content</label>
      <div class="textarea-wrapper">
        <textarea
          id="qr-result"
          :value="outputText"
          readonly
          class="transformation-textarea"
          spellcheck="false"
        ></textarea>
      </div>
    </div>
  </div>
</template>

<style scoped>
.qr-mode {
  display: flex;
  gap: 0.35rem;
}

.qr-mode button {
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--border);
  border-radius: 7px;
  background: var(--surface);
  color: var(--textSecondary);
  cursor: pointer;
}

.qr-mode button.active {
  border-color: var(--primary);
  background: var(--primary);
  color: var(--buttonText);
}

.qr-workspace {
  display: grid;
  width: min(100%, 1600px);
  flex: 1;
  grid-template-columns: minmax(0, 1fr) minmax(260px, 0.7fr);
  gap: 0.85rem;
  min-height: 300px;
  margin: 0 auto;
}

.qr-preview-panel {
  display: grid;
  place-items: center;
  overflow: hidden;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: var(--surface);
}

.qr-preview-panel > span {
  align-self: start;
  justify-self: stretch;
  padding: 0.7rem 0.8rem;
  border-bottom: 1px solid var(--border);
  color: var(--textSecondary);
  font-size: 0.68rem;
  font-weight: 720;
  letter-spacing: 0.09em;
  text-transform: uppercase;
}

.qr-preview-panel img {
  max-width: min(90%, 520px);
  max-height: 520px;
  image-rendering: pixelated;
}

.qr-preview-panel p {
  color: var(--textSecondary);
}

.qr-drop {
  position: relative;
  display: grid;
  flex: 1;
  place-items: center;
  min-height: 240px;
  padding: 2rem;
  border: 2px dashed var(--border);
  color: var(--textSecondary);
}

.qr-drop.active {
  border-color: var(--primary);
  background: rgba(var(--primaryRgb), 0.08);
}

.qr-drop input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}

.qr-result {
  width: min(100%, 1600px);
  min-height: 160px;
  margin: 0.85rem auto 0;
}

@media (max-width: 800px) {
  .qr-workspace {
    grid-template-columns: 1fr;
  }
}
</style>
