<script setup lang="ts">
import BaseTransformationPage from './BaseTransformationPage.vue'
import { htmlDecode } from '../../transformations/html'

defineProps<{ tabId: string }>()

const transform = async (text: string): Promise<string> => htmlDecode(text)
</script>

<template>
  <BaseTransformationPage
    :tab-id="tabId"
    transformation-name="HTML Decode"
    transformation-description="Decode HTML encoded text"
    input-placeholder="Enter HTML encoded text to decode..."
    output-placeholder="Decoded text will appear here..."
    transform-button-text="Decode"
    :transform-function="transform"
  />
</template>
