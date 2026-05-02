<script setup lang="ts">
import BaseTransformationPage from './BaseTransformationPage.vue'
import { sortLines } from '../../transformations/lines'

defineProps<{ tabId: string }>()

const transform = async (text: string): Promise<string> => sortLines(text)
</script>

<template>
  <BaseTransformationPage
    :tab-id="tabId"
    transformation-name="Sort Lines"
    transformation-description="Sort lines alphabetically"
    input-placeholder="Enter text with multiple lines to sort..."
    output-placeholder="Sorted lines will appear here..."
    transform-button-text="Sort"
    :transform-function="transform"
  />
</template>
