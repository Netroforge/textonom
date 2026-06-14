<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { getTransformationById, getAllTransformations } from '../../transformations/registry'
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
const isTransforming = ref(false)
const isPreviewing = ref(false)
const previewText = ref('')
const showPreview = ref(false)
const editingStepIndex = ref<number | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

const triggerFileInput = (): void => {
  fileInput.value?.click()
}

interface PipelineStep {
  transformationId: string
  name: string
  parameters: Record<string, string | number | boolean>
  enabled: boolean
}

const steps = ref<PipelineStep[]>(
  (initialContent.paramValues?.steps as unknown as PipelineStep[]) ?? []
)
const availableTransformations = ref<Array<{ id: string; name: string; category: string }>>([])

// For adding new steps
const newStepTransformationId = ref('')
const newStepName = ref('')

const loadAvailableTransformations = async (): Promise<void> => {
  const registryTransforms = getAllTransformations()
  availableTransformations.value = registryTransforms
    .filter((t) => t.id !== 'pipelineTransform')
    .map((t) => ({ id: t.id, name: t.name, category: t.category }))
    .sort((a, b) => a.name.localeCompare(b.name))
}

const getStepName = (transformationId: string): string => {
  const transform = getTransformationById(transformationId)
  return transform?.name ?? transformationId
}

const addStep = (): void => {
  if (!newStepTransformationId.value) return

  const name = newStepName.value || getStepName(newStepTransformationId.value)

  steps.value.push({
    transformationId: newStepTransformationId.value,
    name,
    parameters: {},
    enabled: true
  })

  newStepTransformationId.value = ''
  newStepName.value = ''
  saveSteps()
}

const removeStep = (index: number): void => {
  steps.value.splice(index, 1)
  saveSteps()
}

const moveStep = (fromIndex: number, toIndex: number): void => {
  const [removed] = steps.value.splice(fromIndex, 1)
  steps.value.splice(toIndex, 0, removed)
  saveSteps()
}

const toggleStep = (index: number): void => {
  steps.value[index].enabled = !steps.value[index].enabled
  saveSteps()
}

const updateStepParameters = (
  index: number,
  parameters: Record<string, string | number | boolean>
): void => {
  steps.value[index].parameters = parameters
  saveSteps()
}

const getStepParameters = (
  index: number
): Array<{
  name: string
  type: 'number' | 'string' | 'boolean'
  description: string
  default?: number | string | boolean
  min?: number
  max?: number
}> => {
  const step = steps.value[index]
  if (!step) return []
  const transform = getTransformationById(step.transformationId)
  return transform?.parameters ?? []
}

const updateStepParam = (
  stepIndex: number,
  paramName: string,
  value: string | number | boolean
): void => {
  const newParams = { ...steps.value[stepIndex].parameters, [paramName]: value }
  updateStepParameters(stepIndex, newParams)
}

const saveSteps = (): void => {
  const paramValues = { steps: steps.value } as unknown as Record<string, string | number | boolean>
  tabsContentStore.saveTabContent(props.tabId, {
    inputText: inputText.value,
    outputText: outputText.value,
    paramValues
  })
}

const applyTransformation = async (): Promise<void> => {
  if (!inputText.value) return
  if (steps.value.filter((s) => s.enabled).length === 0) {
    outputText.value = 'Error: No enabled pipeline steps'
    return
  }

  isTransforming.value = true
  try {
    const { pipelineTransform } = await import('../../transformations/pipeline')
    const pipelineConfig = { steps: steps.value }
    outputText.value = await pipelineTransform(inputText.value, {
      pipeline: pipelineConfig
    } as unknown as Record<string, string | number | boolean>)
  } catch (error) {
    if (error instanceof Error) outputText.value = `Error: ${error.message}`
    else if (typeof error === 'string') outputText.value = `Error: ${error}`
    else outputText.value = 'An unknown error occurred'
  } finally {
    isTransforming.value = false
  }
}

const previewPipeline = async (): Promise<void> => {
  if (!inputText.value) return
  if (steps.value.filter((s) => s.enabled).length === 0) {
    previewText.value = 'No enabled pipeline steps to preview'
    showPreview.value = true
    return
  }

  isPreviewing.value = true
  try {
    const { pipelinePreview } = await import('../../transformations/pipeline')
    const pipelineConfig = { steps: steps.value }
    previewText.value = await pipelinePreview(inputText.value, {
      pipeline: pipelineConfig
    } as unknown as Record<string, string | number | boolean>)
    showPreview.value = true
  } catch (error) {
    if (error instanceof Error) previewText.value = `Error: ${error.message}`
    else if (typeof error === 'string') previewText.value = `Error: ${error}`
    else previewText.value = 'An unknown error occurred'
    showPreview.value = true
  } finally {
    isPreviewing.value = false
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

const savePipeline = async (): Promise<void> => {
  const pipelineData = {
    steps: steps.value,
    name: `Pipeline ${new Date().toISOString().split('T')[0]}`,
    created: new Date().toISOString()
  }
  const blob = new Blob([JSON.stringify(pipelineData, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `textonom-pipeline-${Date.now()}.json`
  a.click()
  URL.revokeObjectURL(url)
  showToast('Pipeline saved to file')
}

const loadPipeline = async (event: Event): Promise<void> => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  const text = await file.text()
  try {
    const data = JSON.parse(text)
    if (data.steps && Array.isArray(data.steps)) {
      steps.value = data.steps as PipelineStep[]
      saveSteps()
      showToast('Pipeline loaded successfully')
    } else {
      showToast('Invalid pipeline file format', 'error')
    }
  } catch {
    showToast('Failed to parse pipeline file', 'error')
  }
  input.value = ''
}

const clearPipeline = (): void => {
  steps.value = []
  saveSteps()
  showToast('Pipeline cleared')
}

const handleDragStart = (e: DragEvent, index: number): void => {
  e.dataTransfer?.setData('text/plain', String(index))
  const target = e.target as HTMLElement
  target?.classList.add('dragging')
}

const handleDragEnd = (e: DragEvent): void => {
  const target = e.target as HTMLElement
  target?.classList.remove('dragging')
}

const handleDrop = (e: DragEvent, index: number): void => {
  const from = Number(e.dataTransfer?.getData('text/plain'))
  if (from !== index) moveStep(from, index)
}

// Watch for changes to persist
watch(
  [inputText, outputText, steps],
  () => {
    saveSteps()
  },
  { deep: true }
)

onMounted(async () => {
  await loadAvailableTransformations()
})
</script>

<template>
  <div class="transformation-page">
    <div class="transformation-header">
      <h1>Pipeline Transform</h1>
      <p class="transformation-description">
        Chain multiple transformations together to create complex text processing workflows. Drag
        steps to reorder, toggle to enable/disable.
      </p>
    </div>

    <!-- Pipeline Builder -->
    <div class="pipeline-builder">
      <div class="pipeline-header">
        <h2>Pipeline Steps</h2>
        <div class="pipeline-actions">
          <button
            class="action-button secondary"
            :disabled="steps.length === 0"
            @click="savePipeline"
          >
            Save Pipeline
          </button>
          <button
            class="action-button secondary"
            title="Load pipeline from file"
            @click="triggerFileInput"
          >
            Load Pipeline
          </button>
          <input
            ref="fileInput"
            type="file"
            accept=".json"
            style="display: none"
            @change="loadPipeline"
          />
          <button
            class="action-button danger"
            :disabled="steps.length === 0"
            @click="clearPipeline"
          >
            Clear All
          </button>
        </div>
      </div>

      <div class="add-step-form">
        <select v-model="newStepTransformationId" class="parameter-input" style="flex: 1">
          <option value="">-- Select transformation to add --</option>
          <option v-for="t in availableTransformations" :key="t.id" :value="t.id">
            {{ t.name }} ({{ t.category }})
          </option>
        </select>
        <input
          v-model="newStepName"
          type="text"
          class="parameter-input"
          placeholder="Custom name (optional)"
          style="width: 200px"
        />
        <button class="action-button" :disabled="!newStepTransformationId" @click="addStep">
          Add Step
        </button>
      </div>

      <div v-if="steps.length > 0" class="pipeline-steps">
        <div
          v-for="(step, index) in steps"
          :key="index"
          class="pipeline-step"
          :class="{ disabled: !step.enabled }"
          draggable="true"
          @dragstart="(e) => handleDragStart(e, index)"
          @dragend="handleDragEnd"
          @dragover.prevent
          @drop="(e) => handleDrop(e, index)"
        >
          <div class="step-handle" title="Drag to reorder">⋮⋮</div>

          <div class="step-main">
            <label class="step-checkbox">
              <input type="checkbox" :checked="step.enabled" @change="toggleStep(index)" />
              <span class="step-name">{{ step.name }}</span>
              <span class="step-id">{{ step.transformationId }}</span>
            </label>
          </div>

          <div v-if="Object.keys(step.parameters).length > 0" class="step-params">
            <span v-for="(value, key) in step.parameters" :key="key" class="param-badge">
              {{ key }}: {{ value }}
            </span>
          </div>

          <div class="step-actions">
            <button
              class="icon-button"
              title="Configure parameters"
              @click="editingStepIndex = index"
            >
              ⚙
            </button>
            <button class="icon-button danger" title="Remove step" @click="removeStep(index)">
              ✕
            </button>
          </div>
        </div>
      </div>

      <div v-else class="empty-pipeline">
        <p>No pipeline steps yet. Add transformations above to build your workflow.</p>
      </div>
    </div>

    <!-- Step Parameter Modal -->
    <div
      v-if="editingStepIndex !== null"
      class="modal-overlay"
      @click.self="editingStepIndex = null"
    >
      <div class="modal">
        <h3>Configure Step: {{ steps[editingStepIndex]?.name }}</h3>
        <div class="step-param-editor">
          <template v-if="Object.keys(getStepParameters(editingStepIndex!)).length === 0">
            <p>This transformation has no configurable parameters.</p>
          </template>
          <div v-else class="parameters-container">
            <div
              v-for="param in getStepParameters(editingStepIndex!)"
              :key="param.name"
              class="parameter"
            >
              <label :for="`step-param-${editingStepIndex}-${param.name}`">{{
                param.description || param.name
              }}</label>
              <input
                v-if="param.type === 'number'"
                :id="`step-param-${editingStepIndex}-${param.name}`"
                type="number"
                :value="steps[editingStepIndex!].parameters[param.name]"
                :min="param.min"
                :max="param.max"
                class="parameter-input"
                @input="
                  updateStepParam(
                    editingStepIndex!,
                    param.name,
                    Number(($event.target as HTMLInputElement).value)
                  )
                "
              />
              <input
                v-else-if="param.type === 'boolean'"
                :id="`step-param-${editingStepIndex}-${param.name}`"
                type="checkbox"
                :checked="steps[editingStepIndex!].parameters[param.name] === true"
                class="parameter-input"
                @change="
                  updateStepParam(
                    editingStepIndex!,
                    param.name,
                    ($event.target as HTMLInputElement).checked
                  )
                "
              />
              <input
                v-else
                :id="`step-param-${editingStepIndex}-${param.name}`"
                type="text"
                :value="steps[editingStepIndex!].parameters[param.name]"
                class="parameter-input"
                @input="
                  updateStepParam(
                    editingStepIndex!,
                    param.name,
                    ($event.target as HTMLInputElement).value
                  )
                "
              />
            </div>
          </div>
        </div>
        <div class="modal-actions">
          <button class="action-button" @click="editingStepIndex = null">Done</button>
        </div>
      </div>
    </div>

    <!-- Input/Output -->
    <div class="transformation-content">
      <div class="textarea-container">
        <label for="input-textarea">Input</label>
        <div class="textarea-wrapper">
          <textarea
            id="input-textarea"
            v-model="inputText"
            class="transformation-textarea"
            placeholder="Enter text to process through pipeline..."
            spellcheck="false"
          ></textarea>
        </div>
      </div>

      <div class="actions-container">
        <button
          class="action-button transform-button"
          :disabled="isTransforming || !inputText || steps.filter((s) => s.enabled).length === 0"
          @click="applyTransformation"
        >
          <TransformationAnimation v-if="isTransforming" transformation-name="Pipeline" />
          <span v-else>Run Pipeline</span>
        </button>
        <button
          class="action-button secondary"
          :disabled="isPreviewing || !inputText || steps.filter((s) => s.enabled).length === 0"
          @click="previewPipeline"
        >
          <span v-if="isPreviewing">Previewing...</span>
          <span v-else>Preview</span>
        </button>
        <button
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
          <TransformationAnimation v-if="isTransforming" transformation-name="Pipeline" />
          <textarea
            id="output-textarea"
            :value="outputText"
            readonly
            class="transformation-textarea"
            placeholder="Pipeline output will appear here..."
            spellcheck="false"
          ></textarea>
        </div>
      </div>
    </div>

    <!-- Preview Modal -->
    <div v-if="showPreview" class="modal-overlay" @click.self="showPreview = false">
      <div class="modal modal-large">
        <div class="modal-header">
          <h3>Pipeline Preview</h3>
          <button class="icon-button" title="Close" @click="showPreview = false">✕</button>
        </div>
        <div class="modal-body">
          <pre class="preview-output">{{ previewText }}</pre>
        </div>
        <div class="modal-actions">
          <button class="action-button" @click="showPreview = false">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pipeline-builder {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: 8px;
  border: 1px solid var(--border-color);
}

.pipeline-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.pipeline-header h2 {
  margin: 0;
  font-size: 1.1rem;
}

.pipeline-actions {
  display: flex;
  gap: 0.5rem;
}

.add-step-form {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.pipeline-steps {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.pipeline-step {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  transition: all 0.2s;
}

.pipeline-step.dragging {
  opacity: 0.5;
  border-color: var(--accent-color);
}

.pipeline-step.disabled {
  opacity: 0.6;
  background: var(--bg-tertiary);
}

.step-handle {
  cursor: grab;
  color: var(--text-muted);
  font-size: 1.2rem;
  user-select: none;
}

.step-handle:active {
  cursor: grabbing;
}

.step-main {
  flex: 1;
}

.step-checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.step-name {
  font-weight: 500;
}

.step-id {
  font-size: 0.75rem;
  color: var(--text-muted);
  background: var(--bg-tertiary);
  padding: 0.125rem 0.375rem;
  border-radius: 3px;
}

.step-params {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  flex: 1;
}

.param-badge {
  font-size: 0.7rem;
  background: var(--accent-color);
  color: var(--accent-text);
  padding: 0.125rem 0.5rem;
  border-radius: 3px;
}

.step-actions {
  display: flex;
  gap: 0.25rem;
}

.icon-button {
  background: none;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  padding: 0.375rem 0.625rem;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.15s;
}

.icon-button:hover {
  background: var(--bg-tertiary);
  border-color: var(--accent-color);
}

.icon-button.danger:hover {
  background: var(--danger-bg);
  border-color: var(--danger-color);
  color: var(--danger-color);
}

.empty-pipeline {
  text-align: center;
  padding: 2rem;
  color: var(--text-muted);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal {
  background: var(--bg-primary);
  border-radius: 8px;
  padding: 1.5rem;
  max-width: 500px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.modal-large {
  max-width: 800px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--border-color);
}

.modal-header h3 {
  margin: 0;
}

.modal-body {
  max-height: 50vh;
  overflow-y: auto;
}

.preview-output {
  background: var(--bg-secondary);
  padding: 1rem;
  border-radius: 6px;
  font-family: var(--font-mono);
  font-size: 0.85rem;
  line-height: 1.5;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--border-color);
}

.action-button.secondary {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border-color: var(--border-color);
}

.action-button.secondary:hover {
  background: var(--bg-tertiary);
}

.action-button.danger {
  background: var(--danger-bg);
  color: var(--danger-color);
  border-color: var(--danger-color);
}

.action-button.danger:hover {
  background: var(--danger-hover);
}

@media (max-width: 768px) {
  .add-step-form {
    flex-direction: column;
  }
  .add-step-form input,
  .add-step-form select,
  .add-step-form button {
    width: 100%;
  }
}
</style>
