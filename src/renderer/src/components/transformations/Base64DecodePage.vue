<script setup lang="ts">
import BaseTransformationPage from './BaseTransformationPage.vue'
import { base64Decode } from '../../transformations/base64'

defineProps<{ tabId: string }>()

const transform = async (text: string): Promise<string> => base64Decode(text)
</script>

<template>
  <BaseTransformationPage
    :tab-id="tabId"
    transformation-name="Base64 Decode"
    transformation-description="Decode Base64 encoded text"
    input-placeholder="Enter Base64 encoded text to decode..."
    output-placeholder="Decoded text will appear here..."
    transform-button-text="Decode"
    :transform-function="transform"
  />
</template>
