<script setup lang="ts">
withDefaults(
  defineProps<{
    active: boolean
    itemName: string
    compact?: boolean
  }>(),
  {
    compact: false
  }
)

const emit = defineEmits<{
  toggle: []
}>()
</script>

<template>
  <button
    type="button"
    class="favorite-button"
    :class="{
      'favorite-button-active': active,
      'favorite-button-compact': compact
    }"
    :aria-label="`${active ? 'Remove' : 'Add'} ${itemName} ${active ? 'from' : 'to'} favorites`"
    :aria-pressed="active"
    :title="active ? 'Remove from favorites' : 'Add to favorites'"
    @click.stop="emit('toggle')"
    @keydown.stop
  >
    <svg class="favorite-button-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="m12 3.35 2.67 5.4 5.96.87-4.32 4.2 1.02 5.94L12 16.96l-5.33 2.8 1.02-5.94-4.32-4.2 5.96-.87L12 3.35Z"
      />
    </svg>
  </button>
</template>

<style scoped>
.favorite-button {
  appearance: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  flex: 0 0 30px;
  padding: 0;
  border: 1px solid transparent;
  border-radius: 7px;
  background-color: transparent;
  color: var(--text);
  opacity: 0.5;
  cursor: pointer;
  transition:
    color 0.15s ease,
    background-color 0.15s ease,
    border-color 0.15s ease,
    opacity 0.15s ease,
    transform 0.15s ease;
}

.favorite-button-icon {
  width: 17px;
  height: 17px;
  overflow: visible;
  fill: transparent;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
  transition:
    fill 0.15s ease,
    transform 0.15s ease;
}

.favorite-button:hover {
  border-color: rgba(var(--primaryRgb), 0.35);
  background-color: rgba(var(--primaryRgb), 0.12);
  color: var(--primary);
  opacity: 1;
}

.favorite-button:hover .favorite-button-icon {
  transform: scale(1.08);
}

.favorite-button:active {
  transform: scale(0.94);
}

.favorite-button:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
  opacity: 1;
}

.favorite-button-active {
  border-color: rgba(var(--primaryRgb), 0.45);
  background-color: rgba(var(--primaryRgb), 0.16);
  color: var(--primary);
  opacity: 1;
}

.favorite-button-active .favorite-button-icon {
  fill: currentColor;
}

.favorite-button-active:hover {
  border-color: rgba(var(--primaryRgb), 0.7);
  background-color: rgba(var(--primaryRgb), 0.24);
}

.favorite-button-compact {
  width: 26px;
  height: 26px;
  flex-basis: 26px;
  border-radius: 6px;
}

.favorite-button-compact .favorite-button-icon {
  width: 15px;
  height: 15px;
}

@media (prefers-reduced-motion: reduce) {
  .favorite-button,
  .favorite-button-icon {
    transition: none;
  }
}
</style>
