<script setup lang="ts">
import BaseTransformationPage from './BaseTransformationPage.vue'
import { hexEncode } from '../../transformations/hex'

defineProps<{ tabId: string }>()

const transform = async (text: string): Promise<string> => hexEncode(text)
</script>

<template>
  <BaseTransformationPage
    :tab-id="tabId"
    transformation-name="Hex Encode"
    transformation-description="Encode text to hexadecimal representation"
    input-placeholder="Enter text to encode to hexadecimal..."
    output-placeholder="Hexadecimal encoded text will appear here..."
    transform-button-text="Encode"
    :transform-function="transform"
  />
</template>
