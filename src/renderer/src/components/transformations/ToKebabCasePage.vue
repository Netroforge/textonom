<script setup lang="ts">
import BaseTransformationPage from './BaseTransformationPage.vue'
import { toKebabCase } from '../../transformations/case'

defineProps<{ tabId: string }>()

const transform = async (text: string): Promise<string> => toKebabCase(text)
</script>

<template>
  <BaseTransformationPage
    :tab-id="tabId"
    transformation-name="To kebab-case"
    transformation-description="Convert text to kebab-case (lowercase with hyphens)"
    input-placeholder="Enter text to convert to kebab-case..."
    output-placeholder="Text in kebab-case will appear here..."
    transform-button-text="Convert"
    :transform-function="transform"
  />
</template>
