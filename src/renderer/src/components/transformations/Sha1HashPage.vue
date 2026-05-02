<script setup lang="ts">
import BaseTransformationPage from './BaseTransformationPage.vue'
import { sha1Hash } from '../../transformations/hash'

defineProps<{ tabId: string }>()

const transform = async (text: string): Promise<string> => sha1Hash(text)
</script>

<template>
  <BaseTransformationPage
    :tab-id="tabId"
    transformation-name="SHA-1 Hash"
    transformation-description="Generate SHA-1 hash of text"
    input-placeholder="Enter text to hash..."
    output-placeholder="SHA-1 hash will appear here..."
    transform-button-text="Hash"
    :transform-function="transform"
  />
</template>
