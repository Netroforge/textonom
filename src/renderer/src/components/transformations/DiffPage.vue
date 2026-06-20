<script setup lang="ts">
import { ref, watch, onUnmounted, onMounted, computed, nextTick } from 'vue'
import { useTabsContentStore } from '../../stores/tabsContentStore'
import { useToast } from '../../stores/toastStore'
import {
  computeTextDiff,
  formatDiffAsText,
  computeWordDiff,
  type DiffLine
} from '../../transformations/diff'
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
const outputMode = ref<'side-by-side' | 'text' | 'word-diff'>(
  (initialContent.paramValues?.outputMode as 'side-by-side' | 'text' | 'word-diff') ??
    'side-by-side'
)

const fileInputLeft = ref<HTMLInputElement | null>(null)
const fileInputRight = ref<HTMLInputElement | null>(null)

const loadFile = async (side: 'left' | 'right'): Promise<void> => {
  const input = side === 'left' ? fileInputLeft.value : fileInputRight.value
  if (!input?.files?.[0]) return
  try {
    const text = await input.files[0].text()
    if (side === 'left') originalText.value = text
    else changedText.value = text
  } catch {
    showToast('Failed to read file', 'error')
  }
  input.value = ''
}

let debounceTimer: ReturnType<typeof setTimeout> | null = null

const addedCount = computed(() => diffLines.value.filter((l) => l.type === 'added').length)
const removedCount = computed(() => diffLines.value.filter((l) => l.type === 'removed').length)
const hasChanges = computed(() => addedCount.value > 0 || removedCount.value > 0)

// Lines as typed on each side (updates instantly so the gutters stay in sync).
const leftLines = computed(() => originalText.value.split('\n'))
const rightLines = computed(() => changedText.value.split('\n'))

const wordDiffHtml = computed(() => {
  if (!originalText.value && !changedText.value) return ''
  const segments = computeWordDiff(originalText.value, changedText.value)
  let html = ''
  for (const seg of segments) {
    const cls = seg.type === 'equal' ? 'wd-equal' : seg.type === 'added' ? 'wd-added' : 'wd-removed'
    html += `<span class="${cls}">${escapeHtml(seg.text)}</span>`
  }
  return html
})

function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

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

    <div class="diff-toolbar">
      <div class="toolbar-group">
        <label class="tool-toggle" title="Show line numbers">
          <input v-model="showLineNumbers" type="checkbox" />
          <span>Line numbers</span>
        </label>
        <label class="tool-field">
          <span>View</span>
          <select v-model="outputMode" class="output-mode-select">
            <option value="side-by-side">Side by Side</option>
            <option value="word-diff">Word Diff</option>
            <option value="text">Plain Text</option>
          </select>
        </label>
        <div
          v-if="hasChanges"
          class="diff-stats"
          :title="`${addedCount} added, ${removedCount} removed`"
        >
          <span class="stat stat-added">+{{ addedCount }}</span>
          <span class="stat stat-removed">−{{ removedCount }}</span>
        </div>
      </div>

      <div class="toolbar-group">
        <button
          class="tool-btn"
          :disabled="!originalText && !changedText"
          title="Swap original and changed text"
          @click="swapSides"
        >
          <svg class="tool-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M8 3 4 7l4 4" />
            <path d="M4 7h16" />
            <path d="M16 21l4-4-4-4" />
            <path d="M20 17H4" />
          </svg>
          Swap
        </button>
        <button
          class="tool-btn"
          :disabled="!originalText && !changedText && !diffOutput"
          title="Clear both sides"
          @click="clearAll"
        >
          <svg class="tool-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M3 6h18" />
            <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
          </svg>
          Clear
        </button>

        <span class="toolbar-divider" aria-hidden="true"></span>

        <span class="copy-label">
          <svg class="tool-icon" viewBox="0 0 24 24" aria-hidden="true">
            <rect x="8" y="8" width="13" height="13" rx="2" />
            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
          </svg>
          Copy
        </span>
        <div class="copy-group">
          <button class="tool-btn" :disabled="diffLines.length === 0" @click="copyOutput">
            Diff
          </button>
          <button class="tool-btn" :disabled="!originalText" @click="copyOriginal">Original</button>
          <button class="tool-btn" :disabled="!changedText" @click="copyChanged">Changed</button>
        </div>
      </div>
    </div>

    <div class="diff-workspace">
      <TransformationAnimation v-if="isTransforming" transformation-name="Diff" />

      <!-- Side-by-side editable diff -->
      <div v-show="outputMode === 'side-by-side'" class="diff-view">
        <div class="diff-pane">
          <div class="pane-header">
            <span class="pane-title">Original</span>
            <label class="file-load-btn" title="Load original from a file">
              <input
                ref="fileInputLeft"
                type="file"
                class="file-input-hidden"
                accept=".txt,.md,.json,.csv,.xml,.yaml,.yml,.html,.css,.js,.ts"
                @change="loadFile('left')"
              />
              <svg class="tool-icon" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <path d="M17 8 12 3 7 8" />
                <path d="M12 3v12" />
              </svg>
              Load
            </label>
          </div>
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
          <div class="pane-header">
            <span class="pane-title">Changed</span>
            <label class="file-load-btn" title="Load changed from a file">
              <input
                ref="fileInputRight"
                type="file"
                class="file-input-hidden"
                accept=".txt,.md,.json,.csv,.xml,.yaml,.yml,.html,.css,.js,.ts"
                @change="loadFile('right')"
              />
              <svg class="tool-icon" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <path d="M17 8 12 3 7 8" />
                <path d="M12 3v12" />
              </svg>
              Load
            </label>
          </div>
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

      <!-- Word-level inline diff -->
      <div v-show="outputMode === 'word-diff'" class="word-diff-container">
        <div class="word-diff-legend">
          <span class="legend-removed">Removed</span>
          <span class="legend-added">Added</span>
          <span class="legend-equal">Unchanged</span>
        </div>
        <!-- eslint-disable-next-line vue/no-v-html -->
        <div v-if="wordDiffHtml" class="word-diff-output" v-html="wordDiffHtml"></div>
        <textarea
          v-else
          readonly
          class="transformation-textarea plain-diff"
          placeholder="Enter text in both panes to see word-level differences."
          spellcheck="false"
        ></textarea>
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
/* Tighten the shared page header so the editors get more room. */
.transformation-page > .transformation-header {
  margin-bottom: 0.85rem;
  padding-bottom: 0.75rem;
}

/* ---------- Toolbar ---------- */
.diff-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.55rem 1rem;
  margin-bottom: 0.85rem;
  padding: 0.45rem 0.6rem;
  background: var(--surface);
  border: 1px solid rgba(var(--borderRgb), 0.45);
  border-radius: 7px;
}

.toolbar-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tool-toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.8rem;
  color: var(--text);
  cursor: pointer;
  white-space: nowrap;
}

.tool-toggle input {
  width: 0.95rem;
  height: 0.95rem;
  margin: 0;
  padding: 0;
  border: none;
  background: none;
  accent-color: var(--primary);
  cursor: pointer;
}

.tool-field {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.8rem;
  color: var(--textSecondary);
  white-space: nowrap;
}

.output-mode-select {
  padding: 0.28rem 0.5rem;
  border: 1px solid rgba(var(--borderRgb), 0.5);
  border-radius: 5px;
  background-color: var(--inputBackground);
  color: var(--text);
  font-size: 0.8rem;
  cursor: pointer;
}

.output-mode-select:hover {
  border-color: var(--primary);
}

/* Live add/remove counters */
.diff-stats {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
}

.stat {
  font-size: 0.72rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
}

.stat-added {
  color: var(--success);
  background: rgba(var(--successRgb), 0.14);
}

.stat-removed {
  color: var(--error);
  background: rgba(var(--errorRgb), 0.14);
}

/* Ghost toolbar buttons */
.tool-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.34rem 0.6rem;
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--text);
  background: var(--inputBackground);
  border: 1px solid rgba(var(--borderRgb), 0.5);
  border-radius: 5px;
  cursor: pointer;
  transition:
    color 0.15s,
    border-color 0.15s,
    box-shadow 0.15s,
    background 0.15s;
}

.tool-btn:hover:not(:disabled) {
  color: var(--primary);
  border-color: var(--primary);
  box-shadow: 0 0 0 1px rgba(var(--primaryRgb), 0.35);
}

.tool-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.tool-icon {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.toolbar-divider {
  width: 1px;
  align-self: stretch;
  min-height: 1.2rem;
  margin: 0 0.15rem;
  background: rgba(var(--borderRgb), 0.5);
}

.copy-label {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--textSecondary);
}

.copy-group {
  display: inline-flex;
  gap: 0.25rem;
}

.copy-group .tool-btn {
  padding: 0.34rem 0.55rem;
}

/* ---------- Workspace ---------- */
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
  background: rgba(var(--borderRgb), 0.55);
  border: 1px solid rgba(var(--borderRgb), 0.55);
  border-radius: 7px;
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
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.35rem 0.4rem 0.35rem 0.75rem;
  background: var(--surface);
  border-bottom: 1px solid rgba(var(--borderRgb), 0.5);
}

.pane-title {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: var(--textSecondary);
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
  border-right: 1px solid rgba(var(--borderRgb), 0.4);
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
  padding: 0 0.6rem;
  text-align: right;
  color: var(--textSecondary);
  opacity: 0.6;
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
  background-color: rgba(var(--errorRgb), 0.16);
  box-shadow: inset 2px 0 var(--error);
}

.hl-added {
  background-color: rgba(var(--successRgb), 0.16);
  box-shadow: inset 2px 0 var(--success);
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

/* ---------- Load-from-file affordance ---------- */
.file-load-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.25rem 0.5rem;
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--textSecondary);
  background: transparent;
  border: 1px solid rgba(var(--borderRgb), 0.45);
  border-radius: 5px;
  cursor: pointer;
  transition:
    color 0.15s,
    border-color 0.15s,
    box-shadow 0.15s;
}

.file-load-btn:hover {
  color: var(--primary);
  border-color: var(--primary);
  box-shadow: 0 0 0 1px rgba(var(--primaryRgb), 0.3);
}

.file-input-hidden {
  display: none;
}

/* ---------- Word diff ---------- */
.word-diff-container {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.75rem;
  background: var(--inputBackground);
  border: 1px solid rgba(var(--borderRgb), 0.55);
  border-radius: 7px;
  overflow-y: auto;
}

.word-diff-legend {
  display: flex;
  gap: 1rem;
  font-size: 0.75rem;
  flex-shrink: 0;
}

.legend-removed,
.legend-added,
.legend-equal {
  padding: 0.125rem 0.375rem;
  border-radius: 3px;
}

.legend-removed {
  background: rgba(var(--errorRgb), 0.2);
  color: var(--error);
}

.legend-added {
  background: rgba(var(--successRgb), 0.2);
  color: var(--success);
}

.legend-equal {
  background: transparent;
  color: var(--textSecondary);
}

.word-diff-output {
  line-height: 1.8;
  white-space: pre-wrap;
  word-break: break-word;
  font-family: var(--fontFamily, monospace);
  font-size: var(--fontSize, 0.9rem);
}

.word-diff-output :deep(.wd-equal) {
  background: transparent;
}

.word-diff-output :deep(.wd-removed) {
  background: rgba(var(--errorRgb), 0.2);
  text-decoration: line-through;
  border-radius: 2px;
}

.word-diff-output :deep(.wd-added) {
  background: rgba(var(--successRgb), 0.2);
  border-radius: 2px;
}

@media (max-width: 768px) {
  .diff-view {
    flex-direction: column;
  }
}
</style>
