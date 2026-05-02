<script setup lang="ts">
import BaseTransformationPage from './BaseTransformationPage.vue'
import { reverseLines } from '../../transformations/lines'

defineProps<{ tabId: string }>()

const transform = async (text: string): Promise<string> => reverseLines(text)
</script>

<template>
  <BaseTransformationPage
    :tab-id="tabId"
    transformation-name="Reverse Lines"
    transformation-description="Reverse the order of lines"
    input-placeholder="Enter text with multiple lines to reverse..."
    output-placeholder="Reversed lines will appear here..."
    transform-button-text="Reverse"
    :transform-function="transform"
  />
</template>
