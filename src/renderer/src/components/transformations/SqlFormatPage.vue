<script setup lang="ts">
import { ref, watch } from 'vue'
import { sqlFormat } from '../../transformations/formatting'
import { useTabsContentStore } from '../../stores/tabsContentStore'
import TransformationAnimation from '../TransformationAnimation.vue'
import './TransformationPage.css'

const props = defineProps<{ tabId: string }>()

const tabsContentStore = useTabsContentStore()
const initialContent = tabsContentStore.getTabContent(props.tabId)

const inputText = ref(initialContent.inputText)
const outputText = ref(initialContent.outputText)
const dialect = ref(String(initialContent.paramValues?.dialect ?? 'sql'))
const indentSize = ref(Number(initialContent.paramValues?.indentSize ?? 2))
const uppercase = ref(initialContent.paramValues?.uppercase === true)
const isTransforming = ref(false)

const applyTransformation = async (): Promise<void> => {
  if (!inputText.value) return
  isTransforming.value = true
  try {
    const result = await sqlFormat(inputText.value, {
      dialect: dialect.value,
      indentSize: indentSize.value,
      uppercase: uppercase.value
    })
    outputText.value = result
    setTimeout(() => {
      isTransforming.value = false
    }, 100)
  } catch (error) {
    if (error instanceof Error) outputText.value = `Error: ${error.message}`
    else if (typeof error === 'string') outputText.value = `Error: ${error}`
    else outputText.value = 'An unknown error occurred during transformation'
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
    alert('Failed to copy to clipboard. Please try again or copy manually.')
  }
}

watch([inputText, outputText, dialect, indentSize, uppercase], () => {
  tabsContentStore.saveTabContent(props.tabId, {
    inputText: inputText.value,
    outputText: outputText.value,
    paramValues: {
      dialect: dialect.value,
      indentSize: indentSize.value,
      uppercase: uppercase.value
    }
  })
})
</script>

<template>
  <div class="transformation-page">
    <div class="transformation-header">
      <h1>SQL Formatter</h1>
      <p class="transformation-description">
        Format SQL queries with proper indentation and syntax
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
            placeholder="Enter SQL query to format..."
            spellcheck="false"
          ></textarea>
        </div>
      </div>

      <div class="actions-container">
        <div class="parameters-container">
          <div class="parameter">
            <label for="dialect-select">SQL Dialect</label>
            <select
              id="dialect-select"
              v-model="dialect"
              class="parameter-input"
              :disabled="isTransforming"
            >
              <option value="sql">Standard SQL</option>
              <option value="mysql">MySQL</option>
              <option value="postgresql">PostgreSQL</option>
              <option value="tsql">T-SQL (SQL Server)</option>
              <option value="plsql">PL/SQL (Oracle)</option>
              <option value="sqlite">SQLite</option>
              <option value="bigquery">BigQuery</option>
              <option value="redshift">Redshift</option>
              <option value="spark">Spark SQL</option>
            </select>
          </div>
          <div class="parameter">
            <label for="indent-size-input">Indent Size</label>
            <input
              id="indent-size-input"
              v-model.number="indentSize"
              type="number"
              min="1"
              max="8"
              class="parameter-input"
              :disabled="isTransforming"
              style="width: 50px"
            />
          </div>
          <div class="parameter">
            <label for="uppercase-checkbox" class="checkbox-label">
              <input
                id="uppercase-checkbox"
                v-model="uppercase"
                type="checkbox"
                :disabled="isTransforming"
              />
              Uppercase Keywords
            </label>
          </div>
        </div>

        <button
          class="action-button transform-button"
          :disabled="isTransforming"
          @click="applyTransformation"
        >
          Format SQL
        </button>
        <button
          class="action-button clear-button"
          :disabled="isTransforming || !inputText"
          @click="clearInput"
        >
          Clear Input
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
          <TransformationAnimation v-if="isTransforming" transformation-name="SQL Format" />
          <textarea
            id="output-textarea"
            :value="outputText"
            readonly
            class="transformation-textarea"
            placeholder="Formatted SQL will appear here..."
            spellcheck="false"
          ></textarea>
        </div>
      </div>
    </div>
  </div>
</template>
