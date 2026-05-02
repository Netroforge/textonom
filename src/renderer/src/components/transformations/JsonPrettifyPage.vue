<script setup lang="ts">
import BaseTransformationPage from './BaseTransformationPage.vue'
import { jsonPrettify } from '../../transformations/json'

defineProps<{ tabId: string }>()

const transform = async (text: string): Promise<string> => jsonPrettify(text)
</script>

<template>
  <BaseTransformationPage
    :tab-id="tabId"
    transformation-name="JSON Prettify"
    transformation-description="Format JSON with proper indentation"
    input-placeholder="Enter JSON to format..."
    output-placeholder="Formatted JSON will appear here..."
    transform-button-text="Format"
    :transform-function="transform"
  />
</template>
