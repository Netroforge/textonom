<script setup lang="ts">
import BaseTransformationPage from './BaseTransformationPage.vue'
import { slugify } from '../../transformations/text'

defineProps<{ tabId: string }>()

const transform = async (text: string): Promise<string> => slugify(text)
</script>

<template>
  <BaseTransformationPage
    :tab-id="tabId"
    transformation-name="Slugify"
    transformation-description="Convert text to a URL-friendly slug (lowercase, hyphenated)"
    input-placeholder="Enter text to slugify..."
    output-placeholder="Slug will appear here..."
    transform-button-text="Slugify"
    :transform-function="transform"
  />
</template>
