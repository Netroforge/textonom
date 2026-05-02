<script setup lang="ts">
import BaseTransformationPage from './BaseTransformationPage.vue'
import { markdownToHtml } from '../../transformations/markdown'

defineProps<{ tabId: string }>()

const transform = async (text: string): Promise<string> => markdownToHtml(text)
</script>

<template>
  <BaseTransformationPage
    :tab-id="tabId"
    transformation-name="Markdown to HTML"
    transformation-description="Convert Markdown text to HTML"
    input-placeholder="Enter Markdown text to convert to HTML..."
    output-placeholder="HTML output will appear here..."
    transform-button-text="Convert"
    :transform-function="transform"
  />
</template>
