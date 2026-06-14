<script setup lang="ts">
import { ref, watch, onUnmounted, onMounted, computed, nextTick } from 'vue'
import { useTabsContentStore } from '../../stores/tabsContentStore'
import { useToast } from '../../stores/toastStore'
import { computeTextDiff, formatDiffAsText, type DiffLine } from '../../transformations/diff'
import TransformationAnimation from '../TransformationAnimation.vue'
import './TransformationPage.css'

const props = defineProps<{ tabId: string }>()

const tabsContentStore = useTabsContentStore()
const { showToast } = useToast()
const initialContent = tabsContentStore.getTabContent(props.tabId)

const originalText = ref((initialContent.paramValues?.originalText as string) ?? '')
const changedText = ref((initialContent.paramValues?.changedText as string) ?? '')
const diffOutput = ref(initialContent.outputText)
const diffLines = ref<DiffLine[]>([])
const isTransforming = ref(false)
const showLineNumbers = ref((initialContent.paramValues?.showLineNumbers as boolean) ?? true)
const outputMode = ref<'side-by-side' | 'text'>(
  (initialContent.paramValues?.outputMode as 'side-by-side' | 'text') ?? 'side-by-side'
)

let debounceTimer: ReturnType<typeof setTimeout> | null = null

const summary = computed(() => {
  const added = diffLines.value.filter((l) => l.type === 'added').length
  const removed = diffLines.value.filter((l) => l.type === 'removed').length
  if (added === 0 && removed === 0) return ''
  return `${added} addition${added !== 1 ? 's' : ''}, ${removed} deletion${removed !== 1 ? 's' : ''}`
})

// Lines as typed on each side (updates instantly so the gutters stay in sync).
const leftLines = computed(() => originalText.value.split('\n'))
const rightLines = computed(() => changedText.value.split('\n'))

// 1-based line numbers that changed, derived from the last computed diff.
const removedLineSet = computed(
  () => new Set(diffLines.value.filter((l) => l.type === 'removed').map((l) => l.oldLine))
)
const addedLineSet = computed(
  () => new Set(diffLines.value.filter((l) => l.type === 'added').map((l) => l.newLine))
)

const computeDiff = async (): Promise<void> => {
  if (!originalText.value && !changedText.value) {
    diffLines.value = []
    diffOutput.value = ''
    return
  }
  isTransforming.value = true
  try {
    const lines = computeTextDiff(originalText.value, changedText.value)
    diffLines.value = lines
    diffOutput.value = formatDiffAsText(lines)
  } catch (error) {
    showToast(error instanceof Error ? error.message : 'Diff computation failed', 'error')
  } finally {
    isTransforming.value = false
    nextTick(() => {
      updateOverlay('left')
      updateOverlay('right')
    })
  }
}

const scheduleDiff = (): void => {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    computeDiff()
  }, 300)
}

const swapSides = (): void => {
  const tmp = originalText.value
  originalText.value = changedText.value
  changedText.value = tmp
}

const clearAll = (): void => {
  originalText.value = ''
  changedText.value = ''
  diffOutput.value = ''
  diffLines.value = []
}

const copyOutput = async (): Promise<void> => {
  const text = formatDiffAsText(diffLines.value)
  if (!text) return
  try {
    await navigator.clipboard.writeText(text)
    showToast('Diff copied to clipboard')
  } catch {
    showToast('Failed to copy to clipboard', 'error')
  }
}

const copyOriginal = async (): Promise<void> => {
  if (!originalText.value) return
  try {
    await navigator.clipboard.writeText(originalText.value)
    showToast('Original text copied to clipboard')
  } catch {
    showToast('Failed to copy to clipboard', 'error')
  }
}

const copyChanged = async (): Promise<void> => {
  if (!changedText.value) return
  try {
    await navigator.clipboard.writeText(changedText.value)
    showToast('Changed text copied to clipboard')
  } catch {
    showToast('Failed to copy to clipboard', 'error')
  }
}

// --- Editable side-by-side overlay + scroll sync (Meld-style) ---
const leftTextarea = ref<HTMLTextAreaElement | null>(null)
const rightTextarea = ref<HTMLTextAreaElement | null>(null)
const leftHl = ref<HTMLElement | null>(null)
const rightHl = ref<HTMLElement | null>(null)
const leftGutter = ref<HTMLElement | null>(null)
const rightGutter = ref<HTMLElement | null>(null)
let syncingScroll = false

const updateOverlay = (side: 'left' | 'right'): void => {
  const ta = side === 'left' ? leftTextarea.value : rightTextarea.value
  if (!ta) return
  const hl = side === 'left' ? leftHl.value : rightHl.value
  const gutter = side === 'left' ? leftGutter.value : rightGutter.value
  if (hl) hl.style.transform = `translate(${-ta.scrollLeft}px, ${-ta.scrollTop}px)`
  if (gutter) gutter.style.transform = `translateY(${-ta.scrollTop}px)`
}

const onPaneScroll = (side: 'left' | 'right'): void => {
  updateOverlay(side)
  if (syncingScroll) return
  const ta = side === 'left' ? leftTextarea.value : rightTextarea.value
  const other = side === 'left' ? rightTextarea.value : leftTextarea.value
  if (!ta || !other) return
  if (other.scrollTop !== ta.scrollTop) {
    syncingScroll = true
    other.scrollTop = ta.scrollTop
    requestAnimationFrame(() => {
      syncingScroll = false
    })
  }
}

watch(
  [originalText, changedText],
  () => {
    scheduleDiff()
    tabsContentStore.saveTabContent(props.tabId, {
      inputText: originalText.value,
      outputText: outputMode.value === 'text' ? diffOutput.value : '',
      paramValues: {
        originalText: originalText.value,
        changedText: changedText.value,
        showLineNumbers: showLineNumbers.value,
        outputMode: outputMode.value
      }
    })
  },
  { deep: true }
)

watch(
  [showLineNumbers, outputMode],
  () => {
    tabsContentStore.saveTabContent(props.tabId, {
      inputText: originalText.value,
      outputText: outputMode.value === 'text' ? diffOutput.value : '',
      paramValues: {
        originalText: originalText.value,
        changedText: changedText.value,
        showLineNumbers: showLineNumbers.value,
        outputMode: outputMode.value
      }
    })
    nextTick(() => {
      updateOverlay('left')
      updateOverlay('right')
    })
  },
  { deep: true }
)

onMounted(() => {
  if (originalText.value || changedText.value) computeDiff()
})

onUnmounted(() => {
  if (debounceTimer) clearTimeout(debounceTimer)
})
</script>

<template>
  <div class="transformation-page">
    <div class="transformation-header">
      <h1>Text Diff</h1>
      <p class="transformation-description">
        Edit both sides directly — differences highlight live as you type
      </p>
    </div>

    <div class="actions-container">
      <div class="diff-options">
        <label class="checkbox-label" title="Show line numbers">
          <input v-model="showLineNumbers" type="checkbox" />
          Line Numbers
        </label>
        <label class="checkbox-label">
          View:
          <select v-model="outputMode" class="output-mode-select">
            <option value="side-by-side">Side by Side</option>
            <option value="text">Plain Text</option>
          </select>
        </label>
        <span v-if="summary" class="diff-summary">{{ summary }}</span>
      </div>

      <button
        class="action-button swap-button"
        :disabled="!originalText && !changedText"
        title="Swap original and changed text"
        @click="swapSides"
      >
        Swap Sides
      </button>
      <button
        class="action-button clear-button"
        :disabled="!originalText && !changedText && !diffOutput"
        @click="clearAll"
      >
        Clear
      </button>
      <button
        class="action-button copy-button"
        :disabled="diffLines.length === 0"
        @click="copyOutput"
      >
        Copy Diff
      </button>
      <button class="action-button copy-button" :disabled="!originalText" @click="copyOriginal">
        Copy Original
      </button>
      <button class="action-button copy-button" :disabled="!changedText" @click="copyChanged">
        Copy Changed
      </button>
    </div>

    <div class="diff-workspace">
      <TransformationAnimation v-if="isTransforming" transformation-name="Diff" />

      <!-- Side-by-side editable diff -->
      <div v-show="outputMode === 'side-by-side'" class="diff-view">
        <div class="diff-pane">
          <div class="pane-header">Original</div>
          <div class="pane-body">
            <div v-if="showLineNumbers" class="diff-gutter">
              <div ref="leftGutter" class="gutter-inner">
                <div v-for="(_, idx) in leftLines" :key="idx" class="gutter-line">
                  {{ idx + 1 }}
                </div>
              </div>
            </div>
            <div class="diff-editor">
              <div class="diff-highlight">
                <div ref="leftHl" class="hl-inner">
                  <div
                    v-for="(line, idx) in leftLines"
                    :key="idx"
                    class="hl-line"
                    :class="{ 'hl-removed': removedLineSet.has(idx + 1) }"
                  >
                    {{ line || ' ' }}
                  </div>
                </div>
              </div>
              <textarea
                ref="leftTextarea"
                v-model="originalText"
                class="diff-input"
                placeholder="Paste the original text here..."
                spellcheck="false"
                wrap="off"
                @scroll="onPaneScroll('left')"
              ></textarea>
            </div>
          </div>
        </div>

        <div class="diff-pane">
          <div class="pane-header">Changed</div>
          <div class="pane-body">
            <div v-if="showLineNumbers" class="diff-gutter">
              <div ref="rightGutter" class="gutter-inner">
                <div v-for="(_, idx) in rightLines" :key="idx" class="gutter-line">
                  {{ idx + 1 }}
                </div>
              </div>
            </div>
            <div class="diff-editor">
              <div class="diff-highlight">
                <div ref="rightHl" class="hl-inner">
                  <div
                    v-for="(line, idx) in rightLines"
                    :key="idx"
                    class="hl-line"
                    :class="{ 'hl-added': addedLineSet.has(idx + 1) }"
                  >
                    {{ line || ' ' }}
                  </div>
                </div>
              </div>
              <textarea
                ref="rightTextarea"
                v-model="changedText"
                class="diff-input"
                placeholder="Paste the changed text here..."
                spellcheck="false"
                wrap="off"
                @scroll="onPaneScroll('right')"
              ></textarea>
            </div>
          </div>
        </div>
      </div>

      <!-- Plain-text unified diff (read-only) -->
      <textarea
        v-show="outputMode === 'text'"
        :value="diffOutput"
        readonly
        class="transformation-textarea plain-diff"
        placeholder="Switch to Side by Side to enter text."
        spellcheck="false"
      ></textarea>
    </div>
  </div>
</template>

<style scoped>
.diff-options {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.85rem;
  cursor: pointer;
  white-space: nowrap;
}

.output-mode-select {
  padding: 0.25rem 0.5rem;
  border: 1px solid var(--border);
  border-radius: 4px;
  background-color: var(--inputBackground);
  color: var(--text);
  font-size: 0.85rem;
}

.diff-summary {
  font-size: 0.8rem;
  color: var(--text-muted, #888);
  background: var(--surface);
  padding: 0.125rem 0.5rem;
  border-radius: 4px;
}

/* The workspace takes all remaining vertical space. */
.diff-workspace {
  position: relative;
  flex: 1;
  min-height: 0;
  display: flex;
}

.diff-view {
  flex: 1;
  min-height: 0;
  display: flex;
  gap: 1px;
  background: var(--border);
  border: 1px solid var(--border);
  border-radius: 4px;
  overflow: hidden;
}

.diff-pane {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  background-color: var(--inputBackground);
}

.pane-header {
  flex-shrink: 0;
  padding: 0.25rem 0.75rem;
  font-size: 0.8rem;
  font-weight: bold;
  color: var(--text-muted, #888);
  background: var(--surface);
  border-bottom: 1px solid var(--border);
}

.pane-body {
  flex: 1;
  min-height: 0;
  display: flex;
  overflow: hidden;
}

/* Line-number gutter (vertically scroll-synced via transform). */
.diff-gutter {
  flex-shrink: 0;
  overflow: hidden;
  background: var(--surface);
  border-right: 1px solid var(--border);
  user-select: none;
}

.gutter-line,
.hl-line,
.diff-input {
  font-family: var(--fontFamily, monospace);
  font-size: var(--fontSize, 0.9rem);
  line-height: 1.6;
}

.gutter-line {
  padding: 0 0.5rem;
  text-align: right;
  color: var(--text-muted, #888);
  white-space: pre;
}

/* The editor stacks the highlight layer behind a transparent-background textarea. */
.diff-editor {
  position: relative;
  flex: 1;
  min-width: 0;
  overflow: hidden;
}

.diff-highlight {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.hl-inner {
  will-change: transform;
}

.hl-line {
  padding: 0 0.5rem;
  white-space: pre;
  color: transparent;
}

.hl-removed {
  background-color: rgba(244, 67, 54, 0.22);
}

.hl-added {
  background-color: rgba(76, 175, 80, 0.22);
}

/* Transparent background so the highlight bands show through. */
.diff-input {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0 0.5rem;
  border: none;
  outline: none;
  resize: none;
  background: transparent;
  color: var(--text);
  white-space: pre;
  overflow: auto;
}

.plain-diff {
  flex: 1;
  min-height: 0;
  width: 100%;
}

@media (max-width: 768px) {
  .diff-view {
    flex-direction: column;
  }
}
</style>
