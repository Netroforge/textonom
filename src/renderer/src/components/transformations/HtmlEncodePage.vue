<script setup lang="ts">
import BaseTransformationPage from './BaseTransformationPage.vue'
import { htmlEncode } from '../../transformations/html'

defineProps<{ tabId: string }>()

const transform = async (text: string): Promise<string> => htmlEncode(text)
</script>

<template>
  <BaseTransformationPage
    :tab-id="tabId"
    transformation-name="HTML Encode"
    transformation-description="Encode special characters for HTML"
    input-placeholder="Enter text to HTML encode..."
    output-placeholder="HTML encoded text will appear here..."
    transform-button-text="Encode"
    :transform-function="transform"
  />
</template>
