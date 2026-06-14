<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { regexReplace, regexTest } from '../../transformations/regex'
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
const pattern = ref(String(initialContent.paramValues?.pattern ?? ''))
const replacement = ref(String(initialContent.paramValues?.replacement ?? ''))
const flags = ref(String(initialContent.paramValues?.flags ?? 'g'))
const mode = ref(initialContent.paramValues?.mode ?? 'replace')
const isTransforming = ref(false)
const showLivePreview = ref(initialContent.paramValues?.showLivePreview ?? true)
const regexError = ref<string | null>(null)
const matchCount = ref(0)

// Live preview - highlighted input with matches
const highlightedInput = computed(() => {
  if (!inputText.value || !pattern.value || !showLivePreview.value) return null

  try {
    const regex = new RegExp(pattern.value, flags.value)
    const matches = [...inputText.value.matchAll(regex)]

    if (matches.length === 0) return null

    let result = ''
    let lastIndex = 0

    for (const match of matches) {
      const matchIndex = match.index ?? 0
      // Add text before match
      result += inputText.value.slice(lastIndex, matchIndex)
      // Add highlighted match
      result += `<mark class="regex-match">${match[0]}</mark>`
      lastIndex = matchIndex + match[0].length
    }

    // Add remaining text
    result += inputText.value.slice(lastIndex)

    return result
  } catch {
    return null
  }
})

// Watch for regex changes to update match count and error
watch(
  [inputText, pattern, flags, showLivePreview],
  () => {
    if (!showLivePreview.value || !inputText.value || !pattern.value) {
      matchCount.value = 0
      regexError.value = null
      return
    }

    try {
      const regex = new RegExp(pattern.value, flags.value)
      const matches = [...inputText.value.matchAll(regex)]
      matchCount.value = matches.length
      regexError.value = null
    } catch (error) {
      regexError.value = error instanceof Error ? error.message : 'Invalid regex'
      matchCount.value = 0
    }
  },
  { immediate: true }
)

const applyTransformation = async (): Promise<void> => {
  if (!inputText.value) return
  if (!pattern.value) {
    outputText.value = 'Error: Find pattern is required'
    return
  }
  isTransforming.value = true
  try {
    const params = { pattern: pattern.value, replacement: replacement.value, flags: flags.value }
    const fn = mode.value === 'replace' ? regexReplace : regexTest
    outputText.value = await fn(inputText.value, params)
  } catch (error) {
    if (error instanceof Error) outputText.value = `Error: ${error.message}`
    else if (typeof error === 'string') outputText.value = `Error: ${error}`
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

const insertRegexHelper = (helper: string): void => {
  pattern.value += helper
}

// Watch for changes to persist
watch(
  [inputText, outputText, pattern, replacement, flags, mode, showLivePreview],
  () => {
    tabsContentStore.saveTabContent(props.tabId, {
      inputText: inputText.value,
      outputText: outputText.value,
      paramValues: {
        pattern: pattern.value,
        replacement: replacement.value,
        flags: flags.value,
        mode: mode.value,
        showLivePreview: showLivePreview.value
      }
    })
  },
  { deep: true }
)
</script>

<template>
  <div class="transformation-page">
    <div class="transformation-header">
      <h1>Regex Find & Replace</h1>
      <p class="transformation-description">
        Search and replace text using regular expressions, or test matches
      </p>
    </div>

    <div class="transformation-content">
      <div class="textarea-container">
        <div class="input-header">
          <label for="input-textarea">Input</label>
          <div v-if="showLivePreview && pattern && matchCount > 0" class="input-stats">
            <span class="match-badge"
              >{{ matchCount }} match{{ matchCount !== 1 ? 'es' : '' }} found</span
            >
          </div>
        </div>
        <div class="textarea-wrapper">
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div
            v-if="showLivePreview && highlightedInput"
            class="live-preview-input"
            v-html="highlightedInput"
          ></div>
          <textarea
            id="input-textarea"
            v-model="inputText"
            class="transformation-textarea"
            :class="{ 'has-preview': showLivePreview && highlightedInput }"
            placeholder="Enter text to search/replace..."
            spellcheck="false"
          ></textarea>
        </div>
        <div v-if="regexError" class="regex-error">{{ regexError }}</div>
      </div>

      <div class="actions-container">
        <div class="parameters-container">
          <div class="parameter">
            <label for="regex-pattern">Find Pattern</label>
            <input
              id="regex-pattern"
              v-model="pattern"
              type="text"
              class="parameter-input"
              :disabled="isTransforming"
              placeholder="e.g. \\d+"
              @input="regexError = null"
            />
          </div>
          <div v-if="mode === 'replace'" class="parameter">
            <label for="regex-replacement">Replace With</label>
            <input
              id="regex-replacement"
              v-model="replacement"
              type="text"
              class="parameter-input"
              :disabled="isTransforming"
              placeholder="e.g. [number]"
            />
          </div>
          <div class="parameter">
            <label for="regex-flags">Flags</label>
            <input
              id="regex-flags"
              v-model="flags"
              type="text"
              class="parameter-input"
              :disabled="isTransforming"
              placeholder="g, i, m, gi, etc."
              style="width: 80px"
            />
          </div>
          <div class="parameter">
            <label for="regex-mode">Mode</label>
            <select
              id="regex-mode"
              v-model="mode"
              class="parameter-input"
              :disabled="isTransforming"
            >
              <option value="replace">Replace</option>
              <option value="test">Test (list matches)</option>
            </select>
          </div>
          <div class="parameter">
            <label class="checkbox-label">
              <input v-model="showLivePreview" type="checkbox" :disabled="isTransforming" />
              Live Preview
            </label>
          </div>
        </div>

        <div v-if="!isTransforming" class="regex-helpers">
          <span class="helpers-label">Quick insert:</span>
          <button type="button" class="helper-btn" @click="insertRegexHelper('\\d')">\\d</button>
          <button type="button" class="helper-btn" @click="insertRegexHelper('\\w')">\\w</button>
          <button type="button" class="helper-btn" @click="insertRegexHelper('\\s')">\\s</button>
          <button type="button" class="helper-btn" @click="insertRegexHelper('.')">.</button>
          <button type="button" class="helper-btn" @click="insertRegexHelper('*')">*</button>
          <button type="button" class="helper-btn" @click="insertRegexHelper('+')">+</button>
          <button type="button" class="helper-btn" @click="insertRegexHelper('?')">?</button>
          <button type="button" class="helper-btn" @click="insertRegexHelper('^')">^</button>
          <button type="button" class="helper-btn" @click="insertRegexHelper('$')">$</button>
          <button type="button" class="helper-btn" @click="insertRegexHelper('()')">()</button>
          <button type="button" class="helper-btn" @click="insertRegexHelper('(?:)')">(?:)</button>
          <button type="button" class="helper-btn" @click="insertRegexHelper('[]')">[]</button>
          <button type="button" class="helper-btn" @click="insertRegexHelper('\\b')">\\b</button>
        </div>

        <button
          class="action-button transform-button"
          :disabled="isTransforming || !inputText || !pattern"
          @click="applyTransformation"
        >
          {{ mode === 'replace' ? 'Replace' : 'Find Matches' }}
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
          <TransformationAnimation v-if="isTransforming" transformation-name="Regex" />
          <textarea
            id="output-textarea"
            :value="outputText"
            readonly
            class="transformation-textarea"
            :placeholder="
              mode === 'replace'
                ? 'Replaced text will appear here...'
                : 'Match results will appear here...'
            "
            spellcheck="false"
          ></textarea>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.input-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.match-badge {
  background: var(--accent-color);
  color: var(--accent-text);
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.live-preview-input {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  font-family: var(--font-mono);
  font-size: 0.9rem;
  line-height: 1.6;
  white-space: pre-wrap;
  word-wrap: break-word;
  max-height: 200px;
  overflow-y: auto;
}

.live-preview-input .regex-match {
  background: var(--accent-color);
  color: var(--accent-text);
  padding: 0 0.125rem;
  border-radius: 2px;
  font-weight: 500;
}

.transformation-textarea.has-preview {
  background: transparent !important;
}

.regex-error {
  color: var(--danger-color);
  font-size: 0.8rem;
  margin-top: 0.375rem;
}

.regex-helpers {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  align-items: center;
  padding: 0.5rem 0;
  border-top: 1px solid var(--border-color);
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 0.5rem;
}

.helpers-label {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-right: 0.5rem;
}

.helper-btn {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.15s;
  color: var(--text-primary);
}

.helper-btn:hover {
  background: var(--accent-color);
  color: var(--accent-text);
  border-color: var(--accent-color);
}

@media (max-width: 768px) {
  .regex-helpers {
    gap: 0.25rem;
  }
  .helper-btn {
    padding: 0.2rem 0.4rem;
    font-size: 0.7rem;
  }
}
</style>
