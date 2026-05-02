<script setup lang="ts">
import BaseTransformationPage from './BaseTransformationPage.vue'
import { toUpperCase } from '../../transformations/case'

defineProps<{ tabId: string }>()

const transform = async (text: string): Promise<string> => toUpperCase(text)
</script>

<template>
  <BaseTransformationPage
    :tab-id="tabId"
    transformation-name="To Uppercase"
    transformation-description="Convert text to uppercase"
    input-placeholder="Enter text to convert to uppercase..."
    output-placeholder="Uppercase text will appear here..."
    transform-button-text="Convert"
    :transform-function="transform"
  />
</template>
