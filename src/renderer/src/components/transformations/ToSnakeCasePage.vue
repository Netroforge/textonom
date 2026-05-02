<script setup lang="ts">
import BaseTransformationPage from './BaseTransformationPage.vue'
import { toSnakeCase } from '../../transformations/case'

defineProps<{ tabId: string }>()

const transform = async (text: string): Promise<string> => toSnakeCase(text)
</script>

<template>
  <BaseTransformationPage
    :tab-id="tabId"
    transformation-name="To snake_case"
    transformation-description="Convert text to snake_case (lowercase with underscores)"
    input-placeholder="Enter text to convert to snake_case..."
    output-placeholder="Text in snake_case will appear here..."
    transform-button-text="Convert"
    :transform-function="transform"
  />
</template>
