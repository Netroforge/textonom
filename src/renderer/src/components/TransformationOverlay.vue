<template>
  <div v-if="isTransforming" class="transformation-overlay">
    <div class="transformation-content">
      <div class="transformation-animation">
        <div class="transformation-glitch-container">
          <div class="transformation-glitch-text" data-text="TRANSFORMING">TRANSFORMING</div>
          <div class="transformation-glitch-scanlines"></div>
        </div>
        <div class="transformation-progress-container">
          <div class="transformation-progress-bar"></div>
        </div>
      </div>
      <div class="transformation-info">
        <div class="transformation-name">{{ transformationName }}</div>
        <div v-if="transformationDuration > 0" class="transformation-duration">
          Completed in {{ (transformationDuration / 1000).toFixed(2) }}s
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useTransformationStore } from '../store/transformationStore'

const transformationStore = useTransformationStore()

// Computed properties
const isTransforming = computed(() => transformationStore.isTransforming)
const transformationName = computed(() => transformationStore.transformationName)
const transformationDuration = computed(() => transformationStore.transformationDuration)
</script>

<style scoped>
.transformation-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(3px);
}

.transformation-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  border-radius: 8px;
  background-color: var(--surface);
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
  max-width: 80%;
  animation: pulse 2s infinite;
}

.transformation-animation {
  margin-bottom: 1.5rem;
  width: 100%;
}

.transformation-glitch-container {
  position: relative;
  margin-bottom: 1.5rem;
  overflow: hidden;
}

.transformation-glitch-text {
  font-size: 2rem;
  font-weight: bold;
  text-align: center;
  color: var(--primary);
  text-shadow:
    0 0 5px var(--primary),
    0 0 10px var(--primary);
  position: relative;
  animation: glitch 1s infinite;
}

.transformation-glitch-text::before,
.transformation-glitch-text::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.transformation-glitch-text::before {
  left: 2px;
  text-shadow: -2px 0 #ff00ff;
  animation: glitch-1 2s infinite linear alternate-reverse;
}

.transformation-glitch-text::after {
  left: -2px;
  text-shadow: 2px 0 #00ffff;
  animation: glitch-2 3s infinite linear alternate-reverse;
}

.transformation-glitch-scanlines {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, transparent 50%, rgba(0, 0, 0, 0.3) 51%);
  background-size: 100% 4px;
  z-index: 2;
  pointer-events: none;
  opacity: 0.3;
}

.transformation-progress-container {
  width: 100%;
  height: 10px;
  background-color: var(--background);
  border-radius: 5px;
  overflow: hidden;
  margin-top: 1rem;
}

.transformation-progress-bar {
  height: 100%;
  width: 100%;
  background: linear-gradient(90deg, var(--primary), var(--info), var(--primary));
  background-size: 200% 100%;
  animation: progress-animation 2s linear infinite;
}

.transformation-info {
  text-align: center;
}

.transformation-name {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: var(--text);
}

.transformation-duration {
  font-size: 0.9rem;
  color: var(--text);
  opacity: 0.8;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 10px rgba(0, 255, 255, 0.3);
  }
  50% {
    box-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
  }
  100% {
    box-shadow: 0 0 10px rgba(0, 255, 255, 0.3);
  }
}

@keyframes glitch {
  0% {
    transform: translate(0);
  }
  20% {
    transform: translate(-2px, 2px);
  }
  40% {
    transform: translate(-2px, -2px);
  }
  60% {
    transform: translate(2px, 2px);
  }
  80% {
    transform: translate(2px, -2px);
  }
  100% {
    transform: translate(0);
  }
}

@keyframes glitch-1 {
  0% {
    clip-path: inset(20% 0 80% 0);
  }
  20% {
    clip-path: inset(60% 0 40% 0);
  }
  40% {
    clip-path: inset(40% 0 60% 0);
  }
  60% {
    clip-path: inset(80% 0 20% 0);
  }
  80% {
    clip-path: inset(10% 0 90% 0);
  }
  100% {
    clip-path: inset(30% 0 70% 0);
  }
}

@keyframes glitch-2 {
  0% {
    clip-path: inset(10% 0 90% 0);
  }
  20% {
    clip-path: inset(30% 0 70% 0);
  }
  40% {
    clip-path: inset(50% 0 50% 0);
  }
  60% {
    clip-path: inset(70% 0 30% 0);
  }
  80% {
    clip-path: inset(90% 0 10% 0);
  }
  100% {
    clip-path: inset(20% 0 80% 0);
  }
}

@keyframes progress-animation {
  0% {
    background-position: 100% 0;
  }
  100% {
    background-position: 0 0;
  }
}
</style>
