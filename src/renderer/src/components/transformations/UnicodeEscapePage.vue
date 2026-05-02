<script setup lang="ts">
import BaseTransformationPage from './BaseTransformationPage.vue'
import { unicodeEscape } from '../../transformations/unicode'

defineProps<{ tabId: string }>()

const transform = async (text: string): Promise<string> => unicodeEscape(text)
</script>

<template>
  <BaseTransformationPage
    :tab-id="tabId"
    transformation-name="Unicode Escape"
    transformation-description="Escape Unicode characters to \\uXXXX format"
    input-placeholder="Enter text with Unicode characters to escape..."
    output-placeholder="Unicode escaped text will appear here..."
    transform-button-text="Escape"
    :transform-function="transform"
  />
</template>
