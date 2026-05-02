<script setup lang="ts">
import BaseTransformationPage from './BaseTransformationPage.vue'
import { xmlCompact } from '../../transformations/xml'

defineProps<{ tabId: string }>()

const transform = async (text: string): Promise<string> => xmlCompact(text)
</script>

<template>
  <BaseTransformationPage
    :tab-id="tabId"
    transformation-name="XML Compact"
    transformation-description="Compact XML by removing whitespace"
    input-placeholder="Enter XML to compact..."
    output-placeholder="Compacted XML will appear here..."
    transform-button-text="Compact"
    :transform-function="transform"
  />
</template>
