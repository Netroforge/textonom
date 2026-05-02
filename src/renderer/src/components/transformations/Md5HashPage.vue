<script setup lang="ts">
import BaseTransformationPage from './BaseTransformationPage.vue'
import { md5Hash } from '../../transformations/hash'

defineProps<{ tabId: string }>()

const transform = async (text: string): Promise<string> => md5Hash(text)
</script>

<template>
  <BaseTransformationPage
    :tab-id="tabId"
    transformation-name="MD5 Hash"
    transformation-description="Generate MD5 hash of text"
    input-placeholder="Enter text to hash..."
    output-placeholder="MD5 hash will appear here..."
    transform-button-text="Hash"
    :transform-function="transform"
  />
</template>
