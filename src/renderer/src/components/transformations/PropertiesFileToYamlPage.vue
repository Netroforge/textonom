<script setup lang="ts">
import BaseTransformationPage from './BaseTransformationPage.vue'
import { propertiesFileToYaml } from '../../transformations/conversion'

defineProps<{ tabId: string }>()

const transform = async (text: string): Promise<string> => propertiesFileToYaml(text)
</script>

<template>
  <BaseTransformationPage
    :tab-id="tabId"
    transformation-name="Properties to YAML"
    transformation-description="Convert Java properties file to YAML"
    input-placeholder="Enter properties file content to convert to YAML..."
    output-placeholder="YAML will appear here..."
    transform-button-text="Convert"
    :transform-function="transform"
  />
</template>
