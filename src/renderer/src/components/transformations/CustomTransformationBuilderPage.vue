<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import {
  getCustomTransformations,
  addCustomTransformation,
  updateCustomTransformation,
  deleteCustomTransformation,
  generateCustomId,
  validateCustomCode,
  refreshCustomTransformations
} from '../../transformations/index'
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

const customTransformations = ref<
  Array<{
    id: string
    name: string
    description: string
    category: string
    parameters: Array<{
      name: string
      type: 'number' | 'string' | 'boolean'
      description: string
      default?: number | string | boolean
      min?: number
      max?: number
    }>
    code: string
    createdAt: string
    updatedAt: string
  }>
>([])

const editingId = ref<string | null>(null)
const showBuilder = ref(false)
const builderForm = ref({
  name: '',
  description: '',
  category: 'custom',
  parameters: [] as Array<{
    name: string
    type: 'number' | 'string' | 'boolean'
    description: string
    default?: number | string | boolean
    min?: number
    max?: number
  }>,
  code: ''
})

const validationResult = ref<{ valid: boolean; error?: string }>({ valid: true })

const loadTransformations = (): void => {
  customTransformations.value = getCustomTransformations()
}

const startNew = (): void => {
  editingId.value = null
  builderForm.value = {
    name: '',
    description: '',
    category: 'custom',
    parameters: [],
    code: ''
  }
  showBuilder.value = true
}

const editTransformation = (id: string): void => {
  const transform = customTransformations.value.find((t) => t.id === id)
  if (transform) {
    editingId.value = id
    builderForm.value = { ...transform }
    showBuilder.value = true
  }
}

const deleteTransformation = (id: string): void => {
  if (confirm('Are you sure you want to delete this custom transformation?')) {
    deleteCustomTransformation(id)
    refreshCustomTransformations()
    loadTransformations()
    showToast('Custom transformation deleted')
  }
}

const validateCode = (): void => {
  validationResult.value = validateCustomCode(builderForm.value.code)
}

const saveTransformation = (): void => {
  if (!builderForm.value.name.trim()) {
    showToast('Please enter a name', 'error')
    return
  }
  if (!builderForm.value.code.trim()) {
    showToast('Please enter transformation code', 'error')
    return
  }

  validateCode()
  if (!validationResult.value.valid) {
    showToast(`Invalid code: ${validationResult.value.error}`, 'error')
    return
  }

  if (editingId.value) {
    updateCustomTransformation(editingId.value, {
      ...builderForm.value,
      updatedAt: new Date().toISOString()
    })
    showToast('Custom transformation updated')
  } else {
    const newTransform = {
      id: generateCustomId(),
      ...builderForm.value,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    addCustomTransformation(newTransform)
    showToast('Custom transformation created')
  }

  refreshCustomTransformations()
  loadTransformations()
  showBuilder.value = false
  editingId.value = null
}

const cancelBuilder = (): void => {
  showBuilder.value = false
  editingId.value = null
}

const addParameter = (): void => {
  builderForm.value.parameters.push({
    name: '',
    type: 'string',
    description: ''
  })
}

const removeParameter = (index: number): void => {
  builderForm.value.parameters.splice(index, 1)
}

const testTransformation = async (): Promise<void> => {
  if (!inputText.value) return
  if (!builderForm.value.code.trim()) return

  validateCode()
  if (!validationResult.value.valid) {
    showToast(`Invalid code: ${validationResult.value.error}`, 'error')
    return
  }

  isTransforming.value = true
  try {
    const params = builderForm.value.parameters.reduce(
      (acc, p) => {
        acc[p.name] = builderForm.value.parameters.find((p2) => p2.name === p.name)?.default ?? ''
        return acc
      },
      {} as Record<string, string | number | boolean>
    )

    const func = new Function(
      'text',
      'params',
      builderForm.value.code + '\nreturn transform(text, params);'
    )
    outputText.value = await func(inputText.value, params)
  } catch (error) {
    outputText.value = `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
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

// Example code templates
const templates = [
  {
    name: 'Basic Transform',
    code: `function transform(text, params) {
  // Your transformation logic here
  return text.toUpperCase()
}`
  },
  {
    name: 'With Parameters',
    code: `function transform(text, params) {
  const prefix = params.prefix || ''
  const suffix = params.suffix || ''
  return prefix + text + suffix
}`
  },
  {
    name: 'Array Processing',
    code: `function transform(text, params) {
  const lines = text.split('\\n')
  const processed = lines.map(line => {
    // Process each line
    return line.trim()
  }).filter(line => line.length > 0)
  return processed.join('\\n')
}`
  }
]

onMounted(() => {
  loadTransformations()
})

// Watch for changes to persist test input/output
watch(
  [inputText, outputText],
  () => {
    tabsContentStore.saveTabContent(props.tabId, {
      inputText: inputText.value,
      outputText: outputText.value,
      paramValues: {}
    })
  },
  { deep: true }
)
</script>

<template>
  <div class="transformation-page">
    <div class="transformation-header">
      <h1>Custom Transformation Builder</h1>
      <p class="transformation-description">
        Create your own text transformations using JavaScript. Define parameters, write code, and
        save for reuse.
      </p>
    </div>

    <!-- Custom Transformations List -->
    <div v-if="!showBuilder" class="custom-transformations-list">
      <div class="list-header">
        <h2>Your Custom Transformations</h2>
        <button class="action-button" @click="startNew">+ Create New Transformation</button>
      </div>

      <div v-if="customTransformations.length === 0" class="empty-state">
        <p>No custom transformations yet. Create your first one!</p>
      </div>

      <div v-else class="transformations-grid">
        <div
          v-for="transform in customTransformations"
          :key="transform.id"
          class="transformation-card"
        >
          <div class="card-header">
            <h3>{{ transform.name }}</h3>
            <span class="category-badge">{{ transform.category }}</span>
          </div>
          <p class="card-description">{{ transform.description }}</p>
          <div v-if="transform.parameters.length > 0" class="card-params">
            <span v-for="param in transform.parameters" :key="param.name" class="param-tag">{{
              param.name
            }}</span>
          </div>
          <div class="card-actions">
            <button
              class="action-button secondary"
              style="flex: 1"
              @click="() => testTransformation()"
            >
              Test
            </button>
            <button class="action-button secondary" @click="() => editTransformation(transform.id)">
              Edit
            </button>
            <button class="action-button danger" @click="() => deleteTransformation(transform.id)">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Builder Form -->
    <div v-if="showBuilder" class="custom-builder">
      <div class="builder-header">
        <h2>{{ editingId ? 'Edit' : 'Create' }} Custom Transformation</h2>
        <button class="action-button secondary" @click="cancelBuilder">Cancel</button>
      </div>

      <div class="builder-form">
        <div class="form-section">
          <h3>Basic Info</h3>
          <div class="parameter">
            <label for="ct-name">Name</label>
            <input
              id="ct-name"
              v-model="builderForm.name"
              type="text"
              class="parameter-input"
              placeholder="e.g. My Custom Transform"
            />
          </div>
          <div class="parameter">
            <label for="ct-description">Description</label>
            <textarea
              id="ct-description"
              v-model="builderForm.description"
              class="parameter-input"
              rows="2"
              placeholder="Describe what this transformation does..."
            ></textarea>
          </div>
          <div class="parameter">
            <label for="ct-category">Category</label>
            <select id="ct-category" v-model="builderForm.category" class="parameter-input">
              <option value="custom">Custom</option>
              <option value="text">Text Operations</option>
              <option value="encoding">Encoding & Decoding</option>
              <option value="formatting">Formatting</option>
              <option value="conversion">Format Conversion</option>
              <option value="hash">Hashing</option>
            </select>
          </div>
        </div>

        <div class="form-section">
          <h3>Parameters</h3>
          <p class="section-hint">
            Define parameters that users can configure when using this transformation
          </p>
          <div v-for="(param, index) in builderForm.parameters" :key="index" class="param-row">
            <input
              v-model="param.name"
              type="text"
              class="parameter-input"
              placeholder="Parameter name (e.g. prefix)"
              style="flex: 1"
            />
            <select v-model="param.type" class="parameter-input" style="width: 120px">
              <option value="string">String</option>
              <option value="number">Number</option>
              <option value="boolean">Boolean</option>
            </select>
            <input
              v-model="param.description"
              type="text"
              class="parameter-input"
              placeholder="Description"
              style="flex: 1"
            />
            <input
              v-model="param.default"
              type="text"
              class="parameter-input"
              placeholder="Default value"
              style="width: 120px"
            />
            <button
              class="icon-button danger"
              title="Remove parameter"
              @click="removeParameter(index)"
            >
              ✕
            </button>
          </div>
          <button class="action-button secondary" @click="addParameter">+ Add Parameter</button>
        </div>

        <div class="form-section">
          <h3>Transformation Code</h3>
          <p class="section-hint">
            Write JavaScript code that defines a <code>transform(text, params)</code> function
          </p>
          <div class="code-editor-wrapper">
            <div class="code-toolbar">
              <button
                type="button"
                class="helper-btn"
                :disabled="!builderForm.code"
                @click="validateCode"
              >
                Validate Code
              </button>
              <span v-if="validationResult.valid && builderForm.code" class="validation-success"
                >✓ Valid</span
              >
              <span v-if="!validationResult.valid && builderForm.code" class="validation-error"
                >✗ {{ validationResult.error }}</span
              >
              <template v-for="template in templates" :key="template.name">
                <button
                  type="button"
                  class="helper-btn secondary"
                  @click="builderForm.code = template.code"
                >
                  {{ template.name }}
                </button>
              </template>
            </div>
            <textarea
              v-model="builderForm.code"
              class="code-editor"
              placeholder="// Write your transform function here&#10;function transform(text, params) {&#10;  // Your code here&#10;  return text&#10;}"
              spellcheck="false"
            ></textarea>
          </div>
        </div>

        <div class="builder-actions">
          <button class="action-button secondary" @click="cancelBuilder">Cancel</button>
          <button class="action-button" @click="saveTransformation">
            {{ editingId ? 'Update' : 'Create' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Test Area -->
    <div class="transformation-content">
      <div class="textarea-container">
        <label for="input-textarea">Test Input</label>
        <div class="textarea-wrapper">
          <textarea
            id="input-textarea"
            v-model="inputText"
            class="transformation-textarea"
            placeholder="Enter text to test your transformation..."
            spellcheck="false"
          ></textarea>
        </div>
      </div>

      <div class="actions-container">
        <button
          class="action-button transform-button"
          :disabled="
            isTransforming || !inputText || !builderForm.code.trim() || !validationResult.valid
          "
          @click="testTransformation"
        >
          <TransformationAnimation v-if="isTransforming" transformation-name="Custom" />
          <span v-else>Test Transformation</span>
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
        <label for="output-textarea">Test Output</label>
        <div class="textarea-wrapper">
          <TransformationAnimation v-if="isTransforming" transformation-name="Custom" />
          <textarea
            id="output-textarea"
            :value="outputText"
            readonly
            class="transformation-textarea"
            placeholder="Transformation output will appear here..."
            spellcheck="false"
          ></textarea>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-transformations-list {
  margin-bottom: 1.5rem;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.list-header h2 {
  margin: 0;
  font-size: 1.1rem;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: var(--text-muted);
  background: var(--bg-secondary);
  border-radius: 8px;
  border: 1px dashed var(--border-color);
}

.transformations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

.transformation-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1rem;
  transition:
    transform 0.15s,
    box-shadow 0.15s;
}

.transformation-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.card-header h3 {
  margin: 0;
  font-size: 1rem;
}

.category-badge {
  font-size: 0.7rem;
  background: var(--accent-color);
  color: var(--accent-text);
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
}

.card-description {
  margin: 0 0 0.75rem 0;
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.card-params {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  margin-bottom: 0.75rem;
}

.param-tag {
  font-size: 0.7rem;
  background: var(--bg-tertiary);
  color: var(--text-secondary);
  padding: 0.125rem 0.5rem;
  border-radius: 3px;
}

.card-actions {
  display: flex;
  gap: 0.375rem;
}

.custom-builder {
  margin-bottom: 1.5rem;
}

.builder-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.builder-header h2 {
  margin: 0;
  font-size: 1.1rem;
}

.builder-form {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1.5rem;
}

.form-section {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.form-section:last-of-type {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.form-section h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
}

.section-hint {
  margin: 0 0 1rem 0;
  font-size: 0.8rem;
  color: var(--text-muted);
}

.section-hint code {
  background: var(--bg-tertiary);
  padding: 0.125rem 0.375rem;
  border-radius: 3px;
  font-family: var(--font-mono);
}

.param-row {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  align-items: center;
}

.param-row input[type='text'],
.param-row select {
  height: 36px;
}

.code-editor-wrapper {
  border: 1px solid var(--border-color);
  border-radius: 6px;
  overflow: hidden;
}

.code-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0.5rem;
  background: var(--bg-tertiary);
  border-bottom: 1px solid var(--border-color);
  align-items: center;
}

.code-editor {
  width: 100%;
  min-height: 200px;
  padding: 1rem;
  font-family: var(--font-mono);
  font-size: 0.85rem;
  line-height: 1.6;
  background: var(--bg-primary);
  border: none;
  color: var(--text-primary);
  resize: vertical;
  outline: none;
}

.code-editor:focus {
  box-shadow: inset 0 0 0 2px var(--accent-color);
}

.validation-success {
  color: var(--success-color);
  font-size: 0.8rem;
  font-weight: 500;
}

.validation-error {
  color: var(--danger-color);
  font-size: 0.8rem;
}

.helper-btn.secondary {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border-color: var(--border-color);
}

.helper-btn.secondary:hover {
  background: var(--bg-tertiary);
}

.builder-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}

@media (max-width: 768px) {
  .transformations-grid {
    grid-template-columns: 1fr;
  }
  .param-row {
    flex-direction: column;
    align-items: stretch;
  }
  .param-row input,
  .param-row select {
    width: 100%;
  }
}
</style>
