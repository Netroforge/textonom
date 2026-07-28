<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useTabsContentStore } from '../../stores/tabsContentStore'
import { useToast } from '../../stores/toastStore'
import { fileToDataUrl, imageConvertCompress } from '../../transformations/media'
import './TransformationPage.css'

const props = defineProps<{ tabId: string; transformationId: string }>()
const tabsContentStore = useTabsContentStore()
const { showToast } = useToast()
const initial = tabsContentStore.getTabContent(props.tabId)

const inputText = ref(initial.inputText)
const outputText = ref(initial.outputText)
const fileName = ref('')
const originalBytes = ref(0)
const format = ref(String(initial.paramValues?.format ?? 'image/webp'))
const quality = ref(Number(initial.paramValues?.quality ?? 82))
const maxWidth = ref(Number(initial.paramValues?.maxWidth ?? 1920))
const maxHeight = ref(Number(initial.paramValues?.maxHeight ?? 1920))
const dropActive = ref(false)
const isTransforming = ref(false)

const outputBytes = computed(() => {
  const base64 = outputText.value.split(',')[1]
  return base64 ? Math.floor((base64.length * 3) / 4) : 0
})

const formatBytes = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

const handleFile = async (file: File): Promise<void> => {
  if (!file.type.startsWith('image/')) {
    showToast('Select an image file', 'error')
    return
  }
  fileName.value = file.name
  originalBytes.value = file.size
  inputText.value = await fileToDataUrl(file)
  outputText.value = ''
}

const onFileSelected = (event: Event): void => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) handleFile(file)
}

const onDrop = (event: DragEvent): void => {
  dropActive.value = false
  const file = event.dataTransfer?.files[0]
  if (file) handleFile(file)
}

const convert = async (): Promise<void> => {
  if (!inputText.value) return
  isTransforming.value = true
  try {
    outputText.value = await imageConvertCompress(inputText.value, {
      format: format.value,
      quality: quality.value / 100,
      maxWidth: maxWidth.value,
      maxHeight: maxHeight.value
    })
  } catch (error) {
    showToast(error instanceof Error ? error.message : 'Image conversion failed', 'error')
  } finally {
    isTransforming.value = false
  }
}

const download = (): void => {
  if (!outputText.value) return
  const extension = format.value === 'image/jpeg' ? 'jpg' : format.value.split('/')[1]
  const link = document.createElement('a')
  link.href = outputText.value
  link.download = `${fileName.value.replace(/\.[^.]+$/, '') || 'textonom-image'}.${extension}`
  link.click()
}

const clearAll = (): void => {
  inputText.value = ''
  outputText.value = ''
  fileName.value = ''
  originalBytes.value = 0
}

watch(
  [inputText, outputText, format, quality, maxWidth, maxHeight],
  () =>
    tabsContentStore.saveTabContent(props.tabId, {
      inputText: inputText.value,
      outputText: outputText.value,
      paramValues: {
        format: format.value,
        quality: quality.value,
        maxWidth: maxWidth.value,
        maxHeight: maxHeight.value
      }
    }),
  { deep: true }
)
</script>

<template>
  <div class="transformation-page">
    <div class="transformation-header">
      <h1>Image Converter / Compressor</h1>
      <p class="transformation-description">
        Resize and convert images to PNG, JPEG, or WebP without uploading them
      </p>
    </div>

    <div class="parameters-container">
      <div class="parameter">
        <label for="image-format">Output format</label>
        <select id="image-format" v-model="format" class="parameter-input">
          <option value="image/webp">WebP</option>
          <option value="image/jpeg">JPEG</option>
          <option value="image/png">PNG</option>
        </select>
      </div>
      <div class="parameter">
        <label for="image-quality">Quality: {{ quality }}%</label>
        <input id="image-quality" v-model.number="quality" type="range" min="5" max="100" />
      </div>
      <div class="parameter">
        <label for="image-width">Maximum width</label>
        <input
          id="image-width"
          v-model.number="maxWidth"
          type="number"
          min="1"
          max="16384"
          class="parameter-input"
        />
      </div>
      <div class="parameter">
        <label for="image-height">Maximum height</label>
        <input
          id="image-height"
          v-model.number="maxHeight"
          type="number"
          min="1"
          max="16384"
          class="parameter-input"
        />
      </div>
    </div>

    <div class="image-workspace">
      <div class="image-panel">
        <span>Original {{ originalBytes ? `· ${formatBytes(originalBytes)}` : '' }}</span>
        <div
          class="image-drop"
          :class="{ active: dropActive }"
          @dragover.prevent="dropActive = true"
          @dragleave="dropActive = false"
          @drop.prevent="onDrop"
        >
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif,image/bmp"
            @change="onFileSelected"
          />
          <img v-if="inputText" :src="inputText" alt="Original image" />
          <p v-else>Drop an image here or choose a file</p>
        </div>
      </div>
      <div class="image-panel">
        <span>Converted {{ outputBytes ? `· ${formatBytes(outputBytes)}` : '' }}</span>
        <div class="image-preview">
          <img v-if="outputText" :src="outputText" alt="Converted image" />
          <p v-else>Converted image will appear here</p>
        </div>
      </div>
    </div>

    <div class="actions-container">
      <button
        class="action-button transform-button"
        :disabled="isTransforming || !inputText"
        @click="convert"
      >
        Convert image
      </button>
      <button
        class="action-button clear-button"
        :disabled="!inputText && !outputText"
        @click="clearAll"
      >
        Clear
      </button>
      <button class="action-button save-button" :disabled="!outputText" @click="download">
        Save image
      </button>
    </div>
  </div>
</template>

<style scoped>
.image-workspace {
  display: grid;
  width: min(100%, 1600px);
  flex: 1;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.85rem;
  min-height: 320px;
  margin: 0 auto;
}

.image-panel {
  display: flex;
  min-width: 0;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: var(--surface);
}

.image-panel > span {
  padding: 0.7rem 0.8rem;
  border-bottom: 1px solid var(--border);
  color: var(--textSecondary);
  font-size: 0.68rem;
  font-weight: 720;
  letter-spacing: 0.09em;
  text-transform: uppercase;
}

.image-drop,
.image-preview {
  position: relative;
  display: grid;
  flex: 1;
  place-items: center;
  min-height: 280px;
  padding: 1rem;
  color: var(--textSecondary);
}

.image-drop {
  border: 2px dashed transparent;
}

.image-drop.active {
  border-color: var(--primary);
  background: rgba(var(--primaryRgb), 0.08);
}

.image-drop input {
  position: absolute;
  inset: 0;
  z-index: 2;
  opacity: 0;
  cursor: pointer;
}

.image-panel img {
  max-width: 100%;
  max-height: 60vh;
  object-fit: contain;
}

@media (max-width: 800px) {
  .image-workspace {
    grid-template-columns: 1fr;
  }
}
</style>
