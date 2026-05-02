<script setup lang="ts">
import BaseTransformationPage from './BaseTransformationPage.vue'
import { deduplicateLines } from '../../transformations/lines'

defineProps<{ tabId: string }>()

const transform = async (text: string): Promise<string> => deduplicateLines(text)
</script>

<template>
  <BaseTransformationPage
    :tab-id="tabId"
    transformation-name="Deduplicate Lines"
    transformation-description="Remove duplicate lines"
    input-placeholder="Enter text with duplicate lines to remove..."
    output-placeholder="Deduplicated lines will appear here..."
    transform-button-text="Deduplicate"
    :transform-function="transform"
  />
</template>
