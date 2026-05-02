<script setup lang="ts">
import BaseTransformationPage from './BaseTransformationPage.vue'
import { sha256Hash } from '../../transformations/hash'

defineProps<{ tabId: string }>()

const transform = async (text: string): Promise<string> => sha256Hash(text)
</script>

<template>
  <BaseTransformationPage
    :tab-id="tabId"
    transformation-name="SHA-256 Hash"
    transformation-description="Generate SHA-256 hash of text"
    input-placeholder="Enter text to hash..."
    output-placeholder="SHA-256 hash will appear here..."
    transform-button-text="Hash"
    :transform-function="transform"
  />
</template>
