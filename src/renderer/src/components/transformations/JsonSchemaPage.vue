<script setup lang="ts">
import { ref, watch } from 'vue'
import { useTabsContentStore } from '../../stores/tabsContentStore'
import { useToast } from '../../stores/toastStore'
import jsonSchemaValidate from '../../transformations/structured/json-schema'
import './TransformationPage.css'

const props = defineProps<{ tabId: string; transformationId: string }>()
const tabsContentStore = useTabsContentStore()
const { showToast } = useToast()
const initial = tabsContentStore.getTabContent(props.tabId)
const defaultSchema =
  '{\n  "type": "object",\n  "properties": {},\n  "additionalProperties": true\n}'

const inputText = ref(initial.inputText)
const outputText = ref(initial.outputText)
const schemaText = ref(String(initial.paramValues?.schema ?? defaultSchema))
const isTransforming = ref(false)

const validate = async (): Promise<void> => {
  if (!inputText.value.trim() || !schemaText.value.trim()) return
  isTransforming.value = true
  try {
    outputText.value = await jsonSchemaValidate(inputText.value, { schema: schemaText.value })
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
    showToast('Validation result copied')
  } catch {
    showToast('Failed to copy output', 'error')
  }
}

const clearAll = (): void => {
  inputText.value = ''
  outputText.value = ''
}

watch(
  [inputText, outputText, schemaText],
  () =>
    tabsContentStore.saveTabContent(props.tabId, {
      inputText: inputText.value,
      outputText: outputText.value,
      paramValues: { schema: schemaText.value }
    }),
  { deep: true }
)
</script>

<template>
  <div class="transformation-page">
    <div class="transformation-header">
      <h1>JSON Schema Validator</h1>
      <p class="transformation-description">
        Validate JSON locally against JSON Schema 2020-12 with format checks and complete errors
      </p>
    </div>

    <div class="schema-grid">
      <div class="textarea-container">
        <label for="schema-data">JSON data</label>
        <div class="textarea-wrapper">
          <textarea
            id="schema-data"
            v-model="inputText"
            class="transformation-textarea"
            spellcheck="false"
            placeholder='{"email":"dev@example.com"}'
          ></textarea>
        </div>
      </div>
      <div class="textarea-container">
        <label for="schema-document">JSON Schema</label>
        <div class="textarea-wrapper">
          <textarea
            id="schema-document"
            v-model="schemaText"
            class="transformation-textarea"
            spellcheck="false"
          ></textarea>
        </div>
      </div>
    </div>

    <div class="actions-container">
      <button
        class="action-button transform-button"
        :disabled="isTransforming || !inputText.trim() || !schemaText.trim()"
        @click="validate"
      >
        Validate
      </button>
      <button
        class="action-button clear-button"
        :disabled="!inputText && !outputText"
        @click="clearAll"
      >
        Clear data
      </button>
      <button class="action-button copy-button" :disabled="!outputText" @click="copyOutput">
        Copy result
      </button>
    </div>

    <div class="schema-output textarea-container">
      <label for="schema-result">Validation result</label>
      <div class="textarea-wrapper">
        <textarea
          id="schema-result"
          :value="outputText"
          readonly
          class="transformation-textarea"
          spellcheck="false"
          placeholder="Validation result will appear here..."
        ></textarea>
      </div>
    </div>
  </div>
</template>

<style scoped>
.schema-grid {
  display: grid;
  width: min(100%, 1600px);
  flex: 1;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.85rem;
  min-height: 260px;
  margin: 0 auto 0.85rem;
}

.schema-output {
  width: min(100%, 1600px);
  min-height: 190px;
  margin: 0.85rem auto 0;
}

@media (max-width: 860px) {
  .schema-grid {
    grid-template-columns: 1fr;
  }
}
</style>
