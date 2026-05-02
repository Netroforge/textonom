<script setup lang="ts">
import BaseTransformationPage from './BaseTransformationPage.vue'
import { removeDuplicateWords } from '../../transformations/text'

defineProps<{ tabId: string }>()

const transform = async (text: string): Promise<string> => removeDuplicateWords(text)
</script>

<template>
  <BaseTransformationPage
    :tab-id="tabId"
    transformation-name="Remove Duplicate Words"
    transformation-description="Remove duplicate words from text (case-insensitive)"
    input-placeholder="Enter text with duplicate words to remove..."
    output-placeholder="Text with duplicate words removed will appear here..."
    transform-button-text="Remove Duplicates"
    :transform-function="transform"
  />
</template>
