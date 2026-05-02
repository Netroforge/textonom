<script setup lang="ts">
import BaseTransformationPage from './BaseTransformationPage.vue'
import { urlEncode } from '../../transformations/url'

defineProps<{ tabId: string }>()

const transform = async (text: string): Promise<string> => urlEncode(text)
</script>

<template>
  <BaseTransformationPage
    :tab-id="tabId"
    transformation-name="URL Encode"
    transformation-description="Encode text for use in URLs"
    input-placeholder="Enter text to URL encode..."
    output-placeholder="URL encoded text will appear here..."
    transform-button-text="Encode"
    :transform-function="transform"
  />
</template>
