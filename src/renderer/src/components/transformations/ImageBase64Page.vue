<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useTabsContentStore } from '../../stores/tabsContentStore'
import { useToast } from '../../stores/toastStore'
import { imageToBase64, base64ToImage } from '../../transformations/image'
import TransformationAnimation from '../TransformationAnimation.vue'
import './TransformationPage.css'

const props = defineProps<{ tabId: string; transformationId: string }>()

const tabsContentStore = useTabsContentStore()
const { showToast } = useToast()
const initialContent = tabsContentStore.getTabContent(props.tabId)

const mode = ref<'encode' | 'decode'>(
  (initialContent.paramValues?.mode as 'encode' | 'decode') ?? 'encode'
)
const inputText = ref(initialContent.inputText)
const outputText = ref(initialContent.outputText)
const imagePreview = ref('')
const isTransforming = ref(false)
const fileName = ref('')

const dropZoneActive = ref(false)

const handleFile = async (file: File): Promise<void> => {
  if (!file.type.startsWith('image/')) {
    showToast('Please select an image file', 'error')
    return
  }
  fileName.value = file.name
  isTransforming.value = true
  try {
    const dataUri = await imageToBase64(file)
    imagePreview.value = dataUri
    inputText.value = dataUri
    outputText.value = dataUri
    showToast(`Encoded ${file.name}`)
  } catch {
    showToast('Failed to read file', 'error')
  } finally {
    isTransforming.value = false
  }
}

const onFileSelected = (event: Event): void => {
  const input = event.target as HTMLInputElement
  if (input.files?.[0]) handleFile(input.files[0])
}

const onDrop = (event: DragEvent): void => {
  dropZoneActive.value = false
  if (event.dataTransfer?.files[0]) handleFile(event.dataTransfer.files[0])
}

const decodeBase64 = async (): Promise<void> => {
  if (!inputText.value) return
  isTransforming.value = true
  try {
    const dataUri = await base64ToImage(inputText.value)
    outputText.value = dataUri
    imagePreview.value = dataUri
  } catch {
    showToast('Invalid Base64 image data', 'error')
  } finally {
    isTransforming.value = false
  }
}

const copyOutput = async (): Promise<void> => {
  if (!outputText.value) return
  try {
    await navigator.clipboard.writeText(outputText.value)
    showToast('Copied to clipboard')
  } catch {
    showToast('Failed to copy to clipboard', 'error')
  }
}

const saveDecodedImage = (): void => {
  if (!outputText.value || mode.value !== 'decode') return
  const link = document.createElement('a')
  link.href = outputText.value
  const ext = fileName.value?.split('.').pop() || 'png'
  link.download = `decoded.${ext}`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  showToast('Image saved')
}

const clearAll = (): void => {
  inputText.value = ''
  outputText.value = ''
  imagePreview.value = ''
  fileName.value = ''
}

const dataUriSize = computed(() => {
  if (!outputText.value) return ''
  const bytes = new Blob([outputText.value]).size
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
})

watch(
  [inputText, outputText, mode],
  () => {
    tabsContentStore.saveTabContent(props.tabId, {
      inputText: inputText.value,
      outputText: outputText.value,
      paramValues: { mode: mode.value }
    })
  },
  { deep: true }
)
</script>

<template>
  <div class="transformation-page">
    <div class="transformation-header">
      <h1>Image to / from Base64</h1>
      <p class="transformation-description">
        Convert images to Base64 data URIs, or decode Base64 back to images
      </p>
    </div>

    <div class="parameters-container">
      <div class="parameter">
        <label>Mode</label>
        <div class="mode-toggle">
          <button class="mode-btn" :class="{ active: mode === 'encode' }" @click="mode = 'encode'">
            Image → Base64
          </button>
          <button class="mode-btn" :class="{ active: mode === 'decode' }" @click="mode = 'decode'">
            Base64 → Image
          </button>
        </div>
      </div>
    </div>

    <div class="transformation-content">
      <div class="textarea-container">
        <label>Input</label>
        <div class="textarea-wrapper">
          <template v-if="mode === 'encode'">
            <div
              class="drop-zone"
              :class="{ 'drop-zone-active': dropZoneActive }"
              @dragover.prevent="dropZoneActive = true"
              @dragleave="dropZoneActive = false"
              @drop.prevent="onDrop"
            >
              <input type="file" accept="image/*" class="file-input" @change="onFileSelected" />
              <div class="drop-zone-content">
                <p v-if="!fileName">Drop an image here or click to browse</p>
                <p v-else class="file-name">{{ fileName }}</p>
                <p class="drop-hint">Supports PNG, JPG, GIF, SVG, WebP</p>
              </div>
            </div>
          </template>
          <textarea
            v-else
            v-model="inputText"
            class="transformation-textarea"
            placeholder="Paste Base64 image data (data:image/...) here..."
            spellcheck="false"
          ></textarea>
        </div>
      </div>

      <div class="actions-container">
        <button
          class="action-button transform-button"
          :disabled="isTransforming || (!inputText && mode === 'decode')"
          @click="decodeBase64"
        >
          Decode
        </button>
        <button
          class="action-button clear-button"
          :disabled="!inputText && !outputText"
          @click="clearAll"
        >
          Clear
        </button>
        <button class="action-button copy-button" :disabled="!outputText" @click="copyOutput">
          Copy Base64
        </button>
        <button
          v-if="mode === 'decode'"
          class="action-button save-button"
          :disabled="!outputText"
          @click="saveDecodedImage"
        >
          Save Image
        </button>
      </div>

      <div class="textarea-container">
        <label>
          Output
          <span v-if="dataUriSize" class="output-size">{{ dataUriSize }}</span>
        </label>
        <div class="textarea-wrapper">
          <TransformationAnimation v-if="isTransforming" transformation-name="Image" />
          <template v-if="imagePreview">
            <div class="image-preview-container">
              <img
                :src="imagePreview"
                alt="Preview"
                class="image-preview"
                @error="showToast('Failed to load image preview', 'error')"
              />
            </div>
          </template>
          <textarea
            v-if="outputText"
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

<style scoped>
.mode-toggle {
  display: flex;
  gap: 0.25rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 4px;
  overflow: hidden;
}

.mode-btn {
  flex: 1;
  padding: 0.5rem 1rem;
  border: none;
  background: transparent;
  color: var(--text-muted, #888);
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: bold;
  transition:
    background 0.15s,
    color 0.15s;
}

.mode-btn.active {
  background: var(--primary);
  color: var(--buttonText);
}

.mode-btn:hover:not(.active) {
  background: var(--surfaceHover);
}

.drop-zone {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 150px;
  border: 2px dashed var(--border);
  border-radius: 4px;
  background: var(--surface);
  cursor: pointer;
  transition:
    border-color 0.15s,
    background 0.15s;
  position: relative;
}

.drop-zone:hover,
.drop-zone-active {
  border-color: var(--primary);
  background: var(--surfaceHover);
}

.file-input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}

.drop-zone-content {
  text-align: center;
  padding: 1rem;
  pointer-events: none;
}

.file-name {
  font-weight: bold;
  color: var(--text);
}

.drop-hint {
  font-size: 0.8rem;
  color: var(--text-muted, #888);
  margin-top: 0.25rem;
}

.output-size {
  font-size: 0.75rem;
  color: var(--text-muted, #888);
  font-weight: normal;
  margin-left: 0.5rem;
}

.image-preview-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 150px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 4px;
  overflow: hidden;
  padding: 0.5rem;
}

.image-preview {
  max-width: 100%;
  max-height: 300px;
  object-fit: contain;
  border-radius: 2px;
}
</style>
