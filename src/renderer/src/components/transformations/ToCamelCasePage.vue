<script setup lang="ts">
import BaseTransformationPage from './BaseTransformationPage.vue'
import { toCamelCase } from '../../transformations/case'

defineProps<{ tabId: string }>()

const transform = async (text: string): Promise<string> => toCamelCase(text)
</script>

<template>
  <BaseTransformationPage
    :tab-id="tabId"
    transformation-name="To camelCase"
    transformation-description="Convert text to camelCase (no spaces, first word lowercase, others capitalized)"
    input-placeholder="Enter text to convert to camelCase..."
    output-placeholder="Text in camelCase will appear here..."
    transform-button-text="Convert"
    :transform-function="transform"
  />
</template>
