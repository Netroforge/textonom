<script setup lang="ts">
import BaseTransformationPage from './BaseTransformationPage.vue'
import { yamlToPropertiesFile } from '../../transformations/conversion'

defineProps<{ tabId: string }>()

const transform = async (text: string): Promise<string> => yamlToPropertiesFile(text)
</script>

<template>
  <BaseTransformationPage
    :tab-id="tabId"
    transformation-name="YAML to Properties"
    transformation-description="Convert YAML to Java properties file format"
    input-placeholder="Enter YAML to convert to properties file format..."
    output-placeholder="Properties file content will appear here..."
    transform-button-text="Convert"
    :transform-function="transform"
  />
</template>
