<script setup lang="ts">
import BaseTransformationPage from './BaseTransformationPage.vue'
import { unicodeUnescape } from '../../transformations/unicode'

defineProps<{ tabId: string }>()

const transform = async (text: string): Promise<string> => unicodeUnescape(text)
</script>

<template>
  <BaseTransformationPage
    :tab-id="tabId"
    transformation-name="Unicode Unescape"
    transformation-description="Convert \\uXXXX format to actual Unicode characters"
    input-placeholder="Enter Unicode escaped text to unescape..."
    output-placeholder="Unicode unescaped text will appear here..."
    transform-button-text="Unescape"
    :transform-function="transform"
  />
</template>
