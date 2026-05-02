<script setup lang="ts">
import BaseTransformationPage from './BaseTransformationPage.vue'
import { toLowerCase } from '../../transformations/case'

defineProps<{ tabId: string }>()

const transform = async (text: string): Promise<string> => toLowerCase(text)
</script>

<template>
  <BaseTransformationPage
    :tab-id="tabId"
    transformation-name="To Lowercase"
    transformation-description="Convert text to lowercase"
    input-placeholder="Enter text to convert to lowercase..."
    output-placeholder="Lowercase text will appear here..."
    transform-button-text="Convert"
    :transform-function="transform"
  />
</template>
