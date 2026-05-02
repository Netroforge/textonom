<script setup lang="ts">
import BaseTransformationPage from './BaseTransformationPage.vue'
import { yamlToJson } from '../../transformations/conversion'

defineProps<{ tabId: string }>()

const transform = async (text: string): Promise<string> => yamlToJson(text)
</script>

<template>
  <BaseTransformationPage
    :tab-id="tabId"
    transformation-name="YAML to JSON"
    transformation-description="Convert YAML to JSON format"
    input-placeholder="Enter YAML to convert to JSON..."
    output-placeholder="JSON will appear here..."
    transform-button-text="Convert"
    :transform-function="transform"
  />
</template>
