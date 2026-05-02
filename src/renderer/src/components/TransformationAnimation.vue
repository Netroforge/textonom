<script setup lang="ts">
import './TransformationAnimation.css'

defineProps<{
  transformationName: string
}>()
</script>

<template>
  <div class="transformation-animation-container">
    <div class="animation-background"></div>
    <div class="animation-content">
      <div class="animation-icon">
        <div class="hexagon-container">
          <div class="hexagon"></div>
          <div class="hexagon"></div>
          <div class="hexagon"></div>
        </div>
      </div>
      <div class="animation-text">
        <div class="glitch-text" data-text="TRANSFORMING">TRANSFORMING</div>
        <div class="transformation-name">{{ transformationName }}</div>
      </div>
    </div>
  </div>
</template>
