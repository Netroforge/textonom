<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useTabsContentStore } from '../../stores/tabsContentStore'
import { useToast } from '../../stores/toastStore'
import './TransformationPage.css'
import './RegexTesterPage.css'

const props = defineProps<{ tabId: string }>()

const tabsContentStore = useTabsContentStore()
const { showToast } = useToast()
const initialContent = tabsContentStore.getTabContent(props.tabId)

const inputText = ref(initialContent.inputText)
const pattern = ref(String(initialContent.paramValues?.pattern ?? ''))
const flags = ref(String(initialContent.paramValues?.flags ?? 'g'))
const showGroupDetails = ref(initialContent.paramValues?.showGroupDetails ?? true)
const regexError = ref<string | null>(null)
const inputTextareaRef = ref<HTMLTextAreaElement | null>(null)
const inputPreviewRef = ref<HTMLDivElement | null>(null)

interface MatchInfo {
  index: number
  fullMatch: string
  position: number
  groups: { name: string; value: string }[]
  captures: string[]
}

const createMatchingRegex = (): RegExp => {
  const matchingFlags = flags.value.includes('g') ? flags.value : `${flags.value}g`
  return new RegExp(pattern.value, matchingFlags)
}

const matches = computed<MatchInfo[]>(() => {
  if (!inputText.value || !pattern.value) return []

  try {
    const regex = createMatchingRegex()
    const allMatches = [...inputText.value.matchAll(regex)]

    return allMatches.map((m, i) => {
      const groups = m.groups
        ? Object.entries(m.groups)
            .filter(([, v]) => v !== undefined)
            .map(([name, value]) => ({ name, value: value ?? '' }))
        : []

      const captures = m.slice(1).map((c) => c ?? '')

      return {
        index: i,
        fullMatch: m[0],
        position: m.index ?? 0,
        groups,
        captures
      }
    })
  } catch {
    return []
  }
})

const highlightedInput = computed(() => {
  if (!inputText.value || !pattern.value) return null

  try {
    const regex = createMatchingRegex()
    const allMatches = [...inputText.value.matchAll(regex)]

    if (allMatches.length === 0) return null

    let result = ''
    let lastIndex = 0

    for (const match of allMatches) {
      const matchIndex = match.index ?? 0
      result += escapeHtml(inputText.value.slice(lastIndex, matchIndex))
      result += `<mark class="regex-match">${escapeHtml(match[0])}</mark>`
      lastIndex = matchIndex + match[0].length
    }

    result += escapeHtml(inputText.value.slice(lastIndex))
    return result
  } catch {
    return null
  }
})

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

watch(
  [inputText, pattern, flags],
  () => {
    if (!pattern.value) {
      regexError.value = null
      return
    }

    try {
      new RegExp(pattern.value, flags.value)
      regexError.value = null
    } catch (error) {
      regexError.value = error instanceof Error ? error.message : 'Invalid regex'
    }
  },
  { immediate: true }
)

const insertRegexHelper = (helper: string): void => {
  pattern.value += helper
}

const syncPreviewScroll = (): void => {
  if (!inputTextareaRef.value || !inputPreviewRef.value) return
  inputPreviewRef.value.scrollTop = inputTextareaRef.value.scrollTop
  inputPreviewRef.value.scrollLeft = inputTextareaRef.value.scrollLeft
}

const copyResults = async (): Promise<void> => {
  if (matches.value.length === 0) return
  try {
    await navigator.clipboard.writeText(JSON.stringify(matches.value, null, 2))
    showToast('Results copied to clipboard')
  } catch {
    showToast('Failed to copy to clipboard', 'error')
  }
}

watch(
  [inputText, pattern, flags, showGroupDetails],
  () => {
    tabsContentStore.saveTabContent(props.tabId, {
      inputText: inputText.value,
      outputText: '',
      paramValues: {
        pattern: pattern.value,
        flags: flags.value,
        showGroupDetails: showGroupDetails.value
      }
    })
  },
  { deep: true }
)
</script>

<template>
  <div class="transformation-page regex-tester-page">
    <div class="transformation-header">
      <h1>Regex Tester</h1>
      <p class="transformation-description">
        Test regular expressions with live preview and detailed match results
      </p>
    </div>

    <div class="transformation-content">
      <div class="regex-tester-controls">
        <div class="regex-tester-row">
          <div class="regex-tester-field regex-pattern-field">
            <label for="regex-pattern">Pattern</label>
            <input
              id="regex-pattern"
              v-model="pattern"
              type="text"
              class="parameter-input"
              placeholder="e.g. \\d{3}-\\d{4}"
              @input="regexError = null"
            />
          </div>
          <div class="regex-tester-field regex-flags-field">
            <label for="regex-flags">Flags</label>
            <input
              id="regex-flags"
              v-model="flags"
              type="text"
              class="parameter-input"
              placeholder="g, i, m"
            />
          </div>
          <div class="regex-tester-field">
            <label class="checkbox-label">
              <input v-model="showGroupDetails" type="checkbox" />
              Show groups
            </label>
          </div>
        </div>

        <div v-if="!regexError" class="regex-helpers">
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
          <button type="button" class="helper-btn" @click="insertRegexHelper('()')">( )</button>
          <button type="button" class="helper-btn" @click="insertRegexHelper('(?:)')">(?:)</button>
          <button type="button" class="helper-btn" @click="insertRegexHelper('[]')">[ ]</button>
          <button type="button" class="helper-btn" @click="insertRegexHelper('\\b')">\\b</button>
        </div>

        <div v-if="regexError" class="regex-error">{{ regexError }}</div>
      </div>

      <div class="regex-tester-panels">
        <div class="regex-tester-input-panel">
          <div class="panel-header">
            <label>Input Text</label>
            <span v-if="pattern && matches.length > 0" class="match-count">
              {{ matches.length }} match{{ matches.length !== 1 ? 'es' : '' }}
            </span>
          </div>
          <div class="textarea-wrapper regex-textarea-wrapper">
            <!-- eslint-disable vue/no-v-html -->
            <div
              v-if="highlightedInput"
              ref="inputPreviewRef"
              class="live-preview-input"
              v-html="highlightedInput"
            ></div>
            <!-- eslint-enable vue/no-v-html -->
            <textarea
              ref="inputTextareaRef"
              v-model="inputText"
              class="transformation-textarea regex-input-textarea"
              :class="{ 'has-preview': highlightedInput }"
              placeholder="Enter text to test against the pattern..."
              spellcheck="false"
              @scroll="syncPreviewScroll"
            ></textarea>
          </div>
        </div>

        <div class="regex-tester-results-panel">
          <div class="panel-header">
            <label>Matches</label>
            <button v-if="matches.length > 0" class="copy-results-btn" @click="copyResults">
              Copy JSON
            </button>
          </div>
          <div class="regex-results-list">
            <div v-if="matches.length === 0" class="no-matches">
              {{
                regexError
                  ? 'Fix the regular expression to see matches'
                  : pattern
                    ? 'No matches found'
                    : 'Enter a pattern to start testing'
              }}
            </div>
            <div v-for="match in matches" :key="match.index" class="match-item">
              <div class="match-item-header">
                <span class="match-index">#{{ match.index }}</span>
                <span class="match-value">"{{ match.fullMatch }}"</span>
                <span class="match-position">at {{ match.position }}</span>
              </div>
              <div v-if="showGroupDetails && match.captures.length > 0" class="match-captures">
                <div v-for="(capture, ci) in match.captures" :key="ci" class="capture-item">
                  <span class="capture-label">Group {{ ci + 1 }}:</span>
                  <span class="capture-value">"{{ capture }}"</span>
                </div>
              </div>
              <div v-if="showGroupDetails && match.groups.length > 0" class="match-groups">
                <div v-for="group in match.groups" :key="group.name" class="group-item">
                  <span class="group-label">{{ group.name }}:</span>
                  <span class="group-value">"{{ group.value }}"</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
