<script setup lang="ts">
import BaseTransformationPage from './BaseTransformationPage.vue'
import { xmlPrettify } from '../../transformations/xml'

defineProps<{ tabId: string }>()

const transform = async (text: string): Promise<string> => xmlPrettify(text)
</script>

<template>
  <BaseTransformationPage
    :tab-id="tabId"
    transformation-name="XML Prettify"
    transformation-description="Format XML with proper indentation"
    input-placeholder="Enter XML to format..."
    output-placeholder="Formatted XML will appear here..."
    transform-button-text="Format"
    :transform-function="transform"
  />
</template>
