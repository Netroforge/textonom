<script setup lang="ts">
import BaseTransformationPage from './BaseTransformationPage.vue'
import { jsonCompact } from '../../transformations/json'

defineProps<{ tabId: string }>()

const transform = async (text: string): Promise<string> => jsonCompact(text)
</script>

<template>
  <BaseTransformationPage
    :tab-id="tabId"
    transformation-name="JSON Compact"
    transformation-description="Compact JSON by removing whitespace"
    input-placeholder="Enter JSON to compact..."
    output-placeholder="Compacted JSON will appear here..."
    transform-button-text="Compact"
    :transform-function="transform"
  />
</template>
