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

<script setup lang="ts">
defineProps<{
  transformationName: string
}>()
</script>

<style scoped>
.transformation-animation-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
  overflow: hidden;
  border-radius: 8px;
}

.animation-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(4px);
  animation: fadeIn 0.3s ease-out forwards;
}

.animation-content {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  animation: scaleIn 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

.animation-icon {
  width: 120px;
  height: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.hexagon-container {
  position: relative;
  width: 100px;
  height: 100px;
  animation: rotate 4s linear infinite;
}

.hexagon {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 10px;
  background-color: transparent;
  border: 3px solid var(--primary);
  opacity: 0.7;
  animation: pulse 2s ease-in-out infinite;
}

.hexagon:nth-child(1) {
  transform: rotate(0deg);
  animation-delay: 0s;
}

.hexagon:nth-child(2) {
  transform: rotate(60deg);
  animation-delay: 0.5s;
}

.hexagon:nth-child(3) {
  transform: rotate(120deg);
  animation-delay: 1s;
}

.animation-text {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.glitch-text {
  color: var(--primary);
  font-size: 2rem;
  font-weight: bold;
  text-shadow: 0 0 10px var(--primary);
  position: relative;
  animation: glitch 1s infinite;
}

.glitch-text::before,
.glitch-text::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.glitch-text::before {
  color: #0ff;
  z-index: -1;
  animation: glitch-offset 2s infinite;
}

.glitch-text::after {
  color: #f0f;
  z-index: -2;
  animation: glitch-offset 1s infinite reverse;
}

.transformation-name {
  color: white;
  font-size: 1.2rem;
  opacity: 0;
  animation: fadeIn 0.5s ease-out 0.5s forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes scaleIn {
  from {
    transform: scale(0.8);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.7;
  }
  50% {
    transform: scale(1.1);
    opacity: 1;
  }
}

@keyframes glitch {
  0%,
  100% {
    transform: translate(0);
  }
  20% {
    transform: translate(-3px, 3px);
  }
  40% {
    transform: translate(-3px, -3px);
  }
  60% {
    transform: translate(3px, 3px);
  }
  80% {
    transform: translate(3px, -3px);
  }
}

@keyframes glitch-offset {
  0%,
  100% {
    clip-path: inset(0 0 0 0);
  }
  10% {
    clip-path: inset(0 0 20% 0);
  }
  20% {
    clip-path: inset(20% 0 0 0);
  }
  30% {
    clip-path: inset(0 20% 0 0);
  }
  40% {
    clip-path: inset(0 0 0 20%);
  }
  50% {
    clip-path: inset(10% 10% 10% 10%);
  }
}
</style>
