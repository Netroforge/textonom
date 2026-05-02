<script setup lang="ts">
import BaseTransformationPage from './BaseTransformationPage.vue'
import { hexDecode } from '../../transformations/hex'

defineProps<{ tabId: string }>()

const transform = async (text: string): Promise<string> => hexDecode(text)
</script>

<template>
  <BaseTransformationPage
    :tab-id="tabId"
    transformation-name="Hex Decode"
    transformation-description="Decode hexadecimal text to plain text"
    input-placeholder="Enter hexadecimal text to decode..."
    output-placeholder="Decoded text will appear here..."
    transform-button-text="Decode"
    :transform-function="transform"
  />
</template>
