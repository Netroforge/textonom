<script setup lang="ts">
import BaseTransformationPage from './BaseTransformationPage.vue'
import { jwtDecode } from '../../transformations/jwt'

defineProps<{ tabId: string }>()

const transform = async (text: string): Promise<string> => jwtDecode(text)
</script>

<template>
  <BaseTransformationPage
    :tab-id="tabId"
    transformation-name="JWT Decode"
    transformation-description="Decode JSON Web Token (JWT) to view its contents"
    input-placeholder="Enter JWT token to decode..."
    output-placeholder="Decoded JWT content will appear here..."
    transform-button-text="Decode"
    :transform-function="transform"
  />
</template>
