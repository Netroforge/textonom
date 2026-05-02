<script setup lang="ts">
import BaseTransformationPage from './BaseTransformationPage.vue'
import { colorConvert } from '../../transformations/color'

defineProps<{ tabId: string }>()

const transform = async (text: string): Promise<string> => colorConvert(text)
</script>

<template>
  <BaseTransformationPage
    :tab-id="tabId"
    transformation-name="Color Converter"
    transformation-description="Convert colors between hex, rgb(), and hsl() — one color per line"
    input-placeholder="#3a86ff"
    output-placeholder="hex<TAB>rgb<TAB>hsl"
    transform-button-text="Convert"
    :transform-function="transform"
  />
</template>
