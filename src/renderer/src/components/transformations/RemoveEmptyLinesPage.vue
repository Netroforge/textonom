<script setup lang="ts">
import BaseTransformationPage from './BaseTransformationPage.vue'
import { removeEmptyLines } from '../../transformations/lines'

defineProps<{ tabId: string }>()

const transform = async (text: string): Promise<string> => removeEmptyLines(text)
</script>

<template>
  <BaseTransformationPage
    :tab-id="tabId"
    transformation-name="Remove Empty Lines"
    transformation-description="Remove all empty lines from text"
    input-placeholder="Enter text with empty lines to remove..."
    output-placeholder="Text with empty lines removed will appear here..."
    transform-button-text="Remove Empty Lines"
    :transform-function="transform"
  />
</template>
