<script setup lang="ts">
import BaseTransformationPage from './BaseTransformationPage.vue'
import { toTitleCase } from '../../transformations/case'

defineProps<{ tabId: string }>()

const transform = async (text: string): Promise<string> => toTitleCase(text)
</script>

<template>
  <BaseTransformationPage
    :tab-id="tabId"
    transformation-name="To Title Case"
    transformation-description="Convert text to title case (first letter of each word capitalized)"
    input-placeholder="Enter text to convert to title case..."
    output-placeholder="Title case text will appear here..."
    transform-button-text="Convert"
    :transform-function="transform"
  />
</template>
