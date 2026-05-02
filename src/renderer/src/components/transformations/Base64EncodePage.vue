<script setup lang="ts">
import BaseTransformationPage from './BaseTransformationPage.vue'
import { base64Encode } from '../../transformations/base64'

defineProps<{ tabId: string }>()

const transform = async (text: string): Promise<string> => base64Encode(text)
</script>

<template>
  <BaseTransformationPage
    :tab-id="tabId"
    transformation-name="Base64 Encode"
    transformation-description="Encode text to Base64 format"
    input-placeholder="Enter text to encode to Base64..."
    output-placeholder="Base64 encoded text will appear here..."
    transform-button-text="Encode"
    :transform-function="transform"
  />
</template>
