<script setup lang="ts">
interface TreeNode {
  key: string | number
  value: unknown
  type: 'object' | 'array' | 'string' | 'number' | 'boolean' | 'null'
  path: string
  expanded: boolean
  children?: TreeNode[]
}

const props = defineProps<{
  node: TreeNode
  depth: number
}>()

const emit = defineEmits<{
  toggle: [node: TreeNode]
  copyPath: [path: string]
  copyValue: [value: unknown]
}>()

const hasChildren = (): boolean => {
  return props.node.type === 'object' || props.node.type === 'array'
}

const formatValue = (): string => {
  if (props.node.type === 'null') return 'null'
  if (props.node.type === 'string') return `"${props.node.value}"`
  if (props.node.type === 'boolean') return String(props.node.value)
  if (props.node.type === 'number') return String(props.node.value)
  if (props.node.type === 'array') return `Array[${(props.node.value as unknown[]).length}]`
  if (props.node.type === 'object') {
    const keys = Object.keys(props.node.value as Record<string, unknown>)
    return `{${keys.length} keys}`
  }
  return String(props.node.value)
}

const typeClass = (): string => {
  return `tree-node-${props.node.type}`
}
</script>

<template>
  <div class="tree-node" :style="{ paddingLeft: `${depth * 16}px` }">
    <div class="tree-node-row" :class="typeClass()">
      <span
        v-if="hasChildren()"
        class="tree-toggle"
        :class="{ 'tree-toggle-expanded': node.expanded }"
        @click="emit('toggle', node)"
      >
        {{ node.expanded ? '▼' : '▶' }}
      </span>
      <span v-else class="tree-toggle tree-toggle-leaf"></span>

      <span v-if="node.key !== ''" class="tree-key">
        {{ typeof node.key === 'number' ? node.key : `"${node.key}"` }}
        <span class="tree-colon">:</span>
      </span>

      <span class="tree-value" :class="typeClass()">
        {{ formatValue() }}
      </span>

      <span class="tree-actions">
        <button class="tree-action-btn" title="Copy path" @click="emit('copyPath', node.path)">
          Path
        </button>
        <button
          v-if="!hasChildren()"
          class="tree-action-btn"
          title="Copy value"
          @click="emit('copyValue', node.value)"
        >
          Value
        </button>
      </span>
    </div>

    <div v-if="hasChildren() && node.expanded && node.children" class="tree-children">
      <TreeNodeItem
        v-for="child in node.children"
        :key="String(child.key)"
        :node="child"
        :depth="depth + 1"
        @toggle="(n) => emit('toggle', n)"
        @copy-path="(p) => emit('copyPath', p)"
        @copy-value="(v) => emit('copyValue', v)"
      />
    </div>
  </div>
</template>
