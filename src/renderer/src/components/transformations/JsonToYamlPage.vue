<script setup lang="ts">
import BaseTransformationPage from './BaseTransformationPage.vue'
import { jsonToYaml } from '../../transformations/conversion'

defineProps<{ tabId: string }>()

const transform = async (text: string): Promise<string> => jsonToYaml(text)
</script>

<template>
  <BaseTransformationPage
    :tab-id="tabId"
    transformation-name="JSON to YAML"
    transformation-description="Convert JSON to YAML format"
    input-placeholder="Enter JSON to convert to YAML..."
    output-placeholder="YAML will appear here..."
    transform-button-text="Convert"
    :transform-function="transform"
  />
</template>
