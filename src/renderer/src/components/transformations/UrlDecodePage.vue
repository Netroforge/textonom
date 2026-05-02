<script setup lang="ts">
import BaseTransformationPage from './BaseTransformationPage.vue'
import { urlDecode } from '../../transformations/url'

defineProps<{ tabId: string }>()

const transform = async (text: string): Promise<string> => urlDecode(text)
</script>

<template>
  <BaseTransformationPage
    :tab-id="tabId"
    transformation-name="URL Decode"
    transformation-description="Decode URL encoded text"
    input-placeholder="Enter URL encoded text to decode..."
    output-placeholder="Decoded text will appear here..."
    transform-button-text="Decode"
    :transform-function="transform"
  />
</template>
