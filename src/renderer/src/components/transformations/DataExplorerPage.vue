<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useTabsContentStore } from '../../stores/tabsContentStore'
import { useToast } from '../../stores/toastStore'
import * as yaml from 'js-yaml'
import * as toml from 'smol-toml'
import TreeNodeItem from './TreeNodeItem.vue'
import './TransformationPage.css'
import './DataExplorerPage.css'

const props = defineProps<{ tabId: string }>()

const tabsContentStore = useTabsContentStore()
const { showToast } = useToast()
const initialContent = tabsContentStore.getTabContent(props.tabId)

const inputText = ref(initialContent.inputText)
const format = ref(String(initialContent.paramValues?.format ?? 'auto'))
const parseError = ref<string | null>(null)

interface TreeNode {
  key: string | number
  value: unknown
  type: 'object' | 'array' | 'string' | 'number' | 'boolean' | 'null'
  path: string
  expanded: boolean
  children?: TreeNode[]
}

const MAX_TREE_DEPTH = 100

type DataFormat = 'json' | 'yaml' | 'toml'

const detectedFormat = computed<DataFormat | null>(() => {
  if (format.value !== 'auto') return format.value as DataFormat
  if (!inputText.value) return null
  const trimmed = inputText.value.trim()
  if (trimmed.startsWith('{') || trimmed.startsWith('[')) return 'json'
  if (/^(?:[A-Za-z0-9_.-]+|["'][^"']+["'])\s*=/m.test(trimmed)) return 'toml'
  if (trimmed.includes(':') && !trimmed.startsWith('<')) return 'yaml'
  return 'json'
})

interface ParseResult {
  success: boolean
  value: unknown
  error: string | null
}

const parseResult = computed<ParseResult>(() => {
  if (!inputText.value.trim()) return { success: false, value: null, error: null }

  const fmt = detectedFormat.value
  if (!fmt) return { success: false, value: null, error: null }

  try {
    if (fmt === 'json') {
      return { success: true, value: JSON.parse(inputText.value), error: null }
    } else if (fmt === 'yaml') {
      return { success: true, value: yaml.load(inputText.value), error: null }
    } else if (fmt === 'toml') {
      return { success: true, value: toml.parse(inputText.value), error: null }
    }
    return { success: false, value: null, error: null }
  } catch (error) {
    return {
      success: false,
      value: null,
      error: error instanceof Error ? error.message : 'Failed to parse data'
    }
  }
})

const parsedData = computed(() => parseResult.value.value)
const hasParsedData = computed(() => parseResult.value.success)

watch(
  () => parseResult.value.error,
  (error) => {
    parseError.value = error
  },
  { immediate: true }
)

const treeData = computed<TreeNode[]>(() => {
  if (!hasParsedData.value) return []
  return buildTree(parsedData.value, '$', 0)
})

function buildTree(
  data: unknown,
  path: string,
  depth: number,
  ancestors = new WeakSet<object>()
): TreeNode[] {
  if (data === null || data === undefined) {
    return [{ key: '', value: null, type: 'null', path, expanded: false }]
  }

  if (typeof data === 'object') {
    if (ancestors.has(data)) {
      return [{ key: '', value: '[Circular]', type: 'string', path, expanded: false }]
    }
    if (depth >= MAX_TREE_DEPTH) {
      return [{ key: '', value: '[Maximum depth reached]', type: 'string', path, expanded: false }]
    }
    ancestors.add(data)
  }

  if (Array.isArray(data)) {
    const nodes = data.map((item, index) => {
      const childPath = `${path}[${index}]`
      const type = getType(item)
      const children =
        type === 'object' || type === 'array'
          ? buildTree(item, childPath, depth + 1, ancestors)
          : undefined
      return {
        key: index,
        value: item,
        type,
        path: childPath,
        expanded: depth < 2,
        children
      }
    })
    ancestors.delete(data)
    return nodes
  }

  if (typeof data === 'object') {
    const nodes = Object.entries(data).map(([key, value]) => {
      const childPath = /^[A-Za-z_$][\w$]*$/.test(key)
        ? `${path}.${key}`
        : `${path}[${JSON.stringify(key)}]`
      const type = getType(value)
      const children =
        type === 'object' || type === 'array'
          ? buildTree(value, childPath, depth + 1, ancestors)
          : undefined
      return {
        key,
        value,
        type,
        path: childPath,
        expanded: depth < 2,
        children
      }
    })
    ancestors.delete(data)
    return nodes
  }

  return [{ key: '', value: data, type: getType(data), path, expanded: false }]
}

function getType(value: unknown): TreeNode['type'] {
  if (value === null || value === undefined) return 'null'
  if (Array.isArray(value)) return 'array'
  if (typeof value === 'object') return 'object'
  if (typeof value === 'boolean') return 'boolean'
  if (typeof value === 'number') return 'number'
  return 'string'
}

function toggleNode(node: TreeNode): void {
  node.expanded = !node.expanded
}

function copyPath(path: string): void {
  navigator.clipboard
    .writeText(path)
    .then(() => {
      showToast('Path copied to clipboard')
    })
    .catch(() => {
      showToast('Failed to copy path', 'error')
    })
}

function copyValue(value: unknown): void {
  const text = typeof value === 'string' ? value : JSON.stringify(value, null, 2)
  navigator.clipboard
    .writeText(text)
    .then(() => {
      showToast('Value copied to clipboard')
    })
    .catch(() => {
      showToast('Failed to copy value', 'error')
    })
}

function expandAll(): void {
  function expand(nodes: TreeNode[]): void {
    for (const node of nodes) {
      node.expanded = true
      if (node.children) expand(node.children)
    }
  }
  expand(treeData.value)
}

function collapseAll(): void {
  function collapse(nodes: TreeNode[]): void {
    for (const node of nodes) {
      node.expanded = false
      if (node.children) collapse(node.children)
    }
  }
  collapse(treeData.value)
}

const copyAllAsJson = async (): Promise<void> => {
  if (!hasParsedData.value) return
  try {
    await navigator.clipboard.writeText(JSON.stringify(parsedData.value, null, 2))
    showToast('JSON copied to clipboard')
  } catch {
    showToast('Failed to copy to clipboard', 'error')
  }
}

watch(
  [inputText, format],
  () => {
    tabsContentStore.saveTabContent(props.tabId, {
      inputText: inputText.value,
      outputText: '',
      paramValues: {
        format: format.value
      }
    })
  },
  { deep: true }
)
</script>

<template>
  <div class="transformation-page data-explorer-page">
    <div class="transformation-header">
      <h1>Data Explorer</h1>
      <p class="transformation-description">
        Explore JSON, YAML, and TOML data as an interactive tree
      </p>
    </div>

    <div class="transformation-content">
      <div class="data-explorer-controls">
        <div class="data-explorer-row">
          <div class="data-explorer-field">
            <label for="data-format">Format</label>
            <select id="data-format" v-model="format" class="parameter-input">
              <option value="auto">Auto-detect</option>
              <option value="json">JSON</option>
              <option value="yaml">YAML</option>
              <option value="toml">TOML</option>
            </select>
          </div>
          <div v-if="detectedFormat" class="data-explorer-detected">
            Detected: <strong>{{ detectedFormat.toUpperCase() }}</strong>
          </div>
          <div class="data-explorer-actions">
            <button class="action-button" :disabled="!hasParsedData" @click="expandAll">
              Expand All
            </button>
            <button class="action-button" :disabled="!hasParsedData" @click="collapseAll">
              Collapse All
            </button>
            <button class="action-button" :disabled="!hasParsedData" @click="copyAllAsJson">
              Copy JSON
            </button>
          </div>
        </div>
      </div>

      <div v-if="parseError" class="data-explorer-error">{{ parseError }}</div>

      <div class="data-explorer-panels">
        <div class="data-explorer-input-panel">
          <div class="panel-header">
            <label>Input</label>
          </div>
          <div class="textarea-wrapper">
            <textarea
              v-model="inputText"
              class="transformation-textarea"
              placeholder="Paste JSON, YAML, or TOML data here..."
              spellcheck="false"
            ></textarea>
          </div>
        </div>

        <div class="data-explorer-tree-panel">
          <div class="panel-header">
            <label>Tree View</label>
          </div>
          <div class="tree-container">
            <div v-if="!hasParsedData && !parseError" class="tree-empty">
              Enter data to see the tree view
            </div>
            <div v-else-if="treeData.length === 0 && !parseError" class="tree-empty">
              No data to display
            </div>
            <div v-else class="tree-root">
              <TreeNodeItem
                v-for="node in treeData"
                :key="String(node.key)"
                :node="node"
                :depth="0"
                @toggle="toggleNode"
                @copy-path="copyPath"
                @copy-value="copyValue"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
