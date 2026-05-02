<script setup lang="ts">
import BaseTransformationPage from './BaseTransformationPage.vue'
import { sha512Hash } from '../../transformations/hash'

defineProps<{ tabId: string }>()

const transform = async (text: string): Promise<string> => sha512Hash(text)
</script>

<template>
  <BaseTransformationPage
    :tab-id="tabId"
    transformation-name="SHA-512 Hash"
    transformation-description="Generate SHA-512 hash of text (stronger than SHA-256)"
    input-placeholder="Enter text to hash..."
    output-placeholder="SHA-512 hash will appear here..."
    transform-button-text="Hash"
    :transform-function="transform"
  />
</template>
