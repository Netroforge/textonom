<template>
  <div class="tabs-container">
    <button class="home-button" :class="{ active: isHomeActive }" title="Home" @click="goToHome">
      Home
    </button>

    <div ref="tabsContainer" class="tabs-scroll-area">
      <!-- Drop indicator that shows where the tab will be placed -->
      <div
        v-if="isDragging"
        class="drop-indicator"
        :style="{ left: `${dropIndicatorLeft}px` }"
      ></div>

      <div
        v-for="(tab, index) in tabs"
        :key="tab.id"
        :ref="
          (el) => {
            if (el) tabRefs[index] = el
          }
        "
        class="tab"
        :class="{
          active: tab.id === activeTabId && !isHomeActive,
          inactive: isHomeActive,
          dragging: draggedTab === tab.id
        }"
        draggable="true"
        @click="setActiveTab(tab.id)"
        @dragstart="onDragStart($event, tab.id, index)"
        @dragover.prevent="onDragOver($event, tab.id, index)"
        @drop="onDrop($event, index)"
        @dragend="onDragEnd()"
      >
        <div class="tab-title">
          {{ tab.title }}
        </div>
        <div class="tab-close" @click.stop="closeTab(tab.id)">✕</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch, type ComponentPublicInstance } from 'vue'
import { useTabsStore } from '../store/tabsStore'

// Define props
defineProps<{
  isHomeActive: boolean
}>()

// Define emits
const emit = defineEmits<{
  'show-home': []
  'hide-home': []
}>()

// Get the tab's store
const tabsStore = useTabsStore()

// Computed properties for tabs and active tab
const tabs = computed(() => tabsStore.tabs)
const activeTabId = computed(() => tabsStore.activeTabId)

// Refs for DOM elements
const tabsContainer = ref<HTMLElement | null>(null)
const tabRefs = ref<(HTMLElement | Element | ComponentPublicInstance | null)[]>([])

// Drag and drop state
const draggedTab = ref<string | null>(null)
const draggedIndex = ref<number>(-1)
const dropTargetIndex = ref<number>(-1)
const dropIndicatorLeft = ref<number>(0)
const isDragging = ref<boolean>(false)

// Reset tab refs when tabs change
watch(tabs, () => {
  tabRefs.value = []
})

// Methods
const setActiveTab = (tabId: string): void => {
  tabsStore.setActiveTab(tabId)
  // Emit event to hide home page when a tab is activated
  emit('hide-home')
}

const closeTab = (tabId: string): void => {
  tabsStore.closeTab(tabId)
}

const goToHome = (): void => {
  // Emit event to show home page without closing tabs
  emit('show-home')
}

// Calculate the drop position based on mouse position
const calculateDropPosition = (event: DragEvent, currentIndex: number): number => {
  const tabElement = tabRefs.value[currentIndex]
  if (!tabElement) return currentIndex

  // Ensure tabElement is an Element with getBoundingClientRect
  if ('getBoundingClientRect' in tabElement) {
    const tabRect = tabElement.getBoundingClientRect()
    const mouseX = event.clientX

    // If mouse is on the left half of the tab, drop before; otherwise, drop after
    const tabMiddleX = tabRect.left + tabRect.width / 2

    if (mouseX < tabMiddleX) {
      // Drop before this tab
      return currentIndex
    } else {
      // Drop after this tab
      return currentIndex + 1
    }
  }

  // Default fallback if getBoundingClientRect is not available
  return currentIndex
}

// Update the drop indicator position
const updateDropIndicator = (targetIndex: number): void => {
  if (targetIndex < 0 || targetIndex > tabs.value.length) return

  // If dropping at the end
  if (targetIndex === tabs.value.length) {
    const lastTab = tabRefs.value[tabs.value.length - 1]
    if (lastTab && 'getBoundingClientRect' in lastTab && tabsContainer.value) {
      const rect = lastTab.getBoundingClientRect()
      dropIndicatorLeft.value = rect.right - tabsContainer.value.getBoundingClientRect().left
    }
    return
  }

  // Get the target tab element
  const targetTab = tabRefs.value[targetIndex]
  if (!targetTab || !tabsContainer.value) return

  // Ensure targetTab is an Element with getBoundingClientRect
  if (!('getBoundingClientRect' in targetTab)) return

  // Calculate the position relative to the tabs container
  const containerRect = tabsContainer.value.getBoundingClientRect()
  const tabRect = targetTab.getBoundingClientRect()

  // Position the indicator at the left edge of the target tab
  dropIndicatorLeft.value = tabRect.left - containerRect.left
}

// Drag and drop methods
const onDragStart = (event: DragEvent, tabId: string, index: number): void => {
  if (!event.dataTransfer) return

  // Set the dragged tab and index
  draggedTab.value = tabId
  draggedIndex.value = index
  isDragging.value = true

  // Set the drag data
  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.setData('text/plain', tabId)

  // Use a transparent drag image to make the drag smoother
  const dragImage = new Image()
  dragImage.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7' // Transparent 1x1 pixel
  event.dataTransfer.setDragImage(dragImage, 0, 0)
}

const onDragOver = (event: DragEvent, tabId: string, index: number): void => {
  if (!event.dataTransfer || !isDragging.value) return

  // Allow the drop
  event.dataTransfer.dropEffect = 'move'

  // Calculate where to drop the tab
  const newTargetIndex = calculateDropPosition(event, index)

  // Only update if the target index has changed
  if (newTargetIndex !== dropTargetIndex.value) {
    dropTargetIndex.value = newTargetIndex
    updateDropIndicator(newTargetIndex)
  }
}

const onDrop = (event: DragEvent, toIndex: number): void => {
  // Prevent default to allow drop
  event.preventDefault()

  // Calculate the final drop position
  const finalDropIndex = calculateDropPosition(event, toIndex)

  // Adjust the index if dropping after the dragged item
  let adjustedDropIndex = finalDropIndex
  if (draggedIndex.value < finalDropIndex) {
    adjustedDropIndex--
  }

  // If we have a valid drag operation
  if (draggedIndex.value !== -1 && draggedIndex.value !== adjustedDropIndex) {
    // Reorder the tabs in the store
    tabsStore.reorderTabs(draggedIndex.value, adjustedDropIndex)
  }

  // Reset drag state
  resetDragState()
}

const onDragEnd = (): void => {
  // Reset drag state
  resetDragState()
}

const resetDragState = (): void => {
  draggedTab.value = null
  draggedIndex.value = -1
  dropTargetIndex.value = -1
  isDragging.value = false
}

// Add global event listeners to handle edge cases
onMounted(() => {
  window.addEventListener('dragend', resetDragState)
})

onBeforeUnmount(() => {
  window.removeEventListener('dragend', resetDragState)
})
</script>

<style scoped>
/* Tab styling */
.tabs-container {
  display: flex;
  position: relative;
  background-color: var(--surface);
  border-bottom: 1px solid var(--border);
  height: 38px; /* Match the height of tabs */
}

.tabs-scroll-area {
  display: flex;
  overflow-x: auto;
  white-space: nowrap;
  flex: 1;
  position: relative; /* For absolute positioning of drop indicator */
}

.tab {
  padding: 0.5rem 1rem;
  cursor: pointer;
  background-color: var(--tabBackground);
  color: var(--tabText);
  border-right: 1px solid var(--border);
  border-bottom: 2px solid transparent; /* Add transparent border for consistent height */
  display: flex;
  align-items: center;
  min-width: 120px;
  max-width: 200px;
  box-sizing: border-box; /* Ensure padding and border are included in height calculation */
  transition: background-color 0.15s ease;
  user-select: none; /* Prevent text selection during drag */
}

.tab.active {
  background-color: var(--tabActiveBackground);
  color: var(--tabActiveText);
  border-bottom: 2px solid var(--tabActiveBorder); /* Colored border for active tab */
}

.tab.inactive {
  opacity: 0.7;
}

.tab:hover:not(.active):not(.dragging):not(.inactive) {
  background-color: var(--tabHoverBackground);
}

/* Drag and drop styling */
.tab.dragging {
  opacity: 0.6;
  cursor: grabbing;
  background-color: var(--tabActiveBackground);
  color: var(--tabActiveText);
}

/* Drop indicator styling */
.drop-indicator {
  position: absolute;
  top: 0;
  width: 2px;
  height: 100%;
  background-color: var(--tabActiveBorder);
  z-index: 200;
  pointer-events: none; /* Allow events to pass through */
  box-shadow: 0 0 4px var(--tabActiveBorder);
  transition: left 0.1s ease-out;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    opacity: 0.7;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.7;
  }
}

.tab-title {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tab-close {
  margin-left: 0.5rem;
  opacity: 0.7;
}

.tab-close:hover {
  opacity: 1;
}

.home-button {
  height: 100%; /* Full height with box-sizing: border-box */
  padding: 0.5rem 1rem; /* Match tab padding */
  cursor: pointer;
  background-color: var(--surface);
  color: var(--tabText);
  border: none;
  border-right: 1px solid var(--border);
  border-bottom: 2px solid transparent; /* Add transparent border to maintain height */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  box-sizing: border-box; /* Ensure padding and border are included in height calculation */
  user-select: none; /* Prevent text selection */
  transition: background-color 0.15s ease;
  /* Match font styling with tabs */
  font-family: inherit;
  font-size: inherit;
  font-weight: inherit;
}

.home-button:hover:not(.active) {
  background-color: var(--tabHoverBackground);
}

.home-button.active {
  background-color: var(--tabActiveBackground);
  color: var(--tabActiveText);
  border-bottom: 2px solid var(--tabActiveBorder); /* Colored border for active home button */
}
</style>
