<script setup lang="ts">
import BaseTransformationPage from './BaseTransformationPage.vue'
import { timestampToIso } from '../../transformations/timestamp'

defineProps<{ tabId: string }>()

const transform = async (text: string): Promise<string> => timestampToIso(text)
</script>

<template>
  <BaseTransformationPage
    :tab-id="tabId"
    transformation-name="Unix Timestamp to ISO"
    transformation-description="Convert Unix timestamps (seconds or milliseconds, one per line) to ISO 8601"
    input-placeholder="1700000000"
    output-placeholder="ISO 8601 dates will appear here..."
    transform-button-text="Convert"
    :transform-function="transform"
  />
</template>
