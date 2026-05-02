<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import { useTabsStore } from '../stores/tabsStore'
import './TabBar.css'

const props = defineProps<{
  isHomeActive: boolean
  onShowHome: () => void
  onHideHome: () => void
}>()

const tabsStore = useTabsStore()
const { tabs, activeTabId } = storeToRefs(tabsStore)
const { setActiveTab, closeTab, closeOtherTabs, closeAllTabs, closeTabsToRight, reorderTabs } =
  tabsStore

const tabsContainerRef = ref<HTMLDivElement | null>(null)
const tabRefs = ref<(HTMLDivElement | null)[]>([])

const setTabRef = (el: Element | null, index: number): void => {
  tabRefs.value[index] = el as HTMLDivElement | null
}

const draggedTab = ref<string | null>(null)
const draggedIndex = ref<number>(-1)
const dropIndicatorLeft = ref<number>(0)
const isDragging = ref<boolean>(false)

const contextMenuVisible = ref<boolean>(false)
const contextMenuPosition = ref<{ x: number; y: number }>({ x: 0, y: 0 })
const contextMenuTabId = ref<string | null>(null)

const showScrollButtons = ref<boolean>(false)

const tabDensity = computed<'compact' | 'medium' | 'wide'>(() => {
  if (tabs.value.length > 10) return 'compact'
  if (tabs.value.length > 5) return 'medium'
  return 'wide'
})

const checkScrollButtonsVisibility = (): void => {
  const container = tabsContainerRef.value
  if (!container) return
  showScrollButtons.value = container.scrollWidth > container.clientWidth
}

watch(
  tabs,
  () => {
    tabRefs.value = tabRefs.value.slice(0, tabs.value.length)
    nextTick(() => checkScrollButtonsVisibility())
  },
  { deep: true }
)

const handleResize = (): void => {
  checkScrollButtonsVisibility()
}

const handleKeyDown = (e: KeyboardEvent): void => {
  if (e.ctrlKey && e.key === 'Tab') {
    e.preventDefault()
    if (tabs.value.length > 0) {
      const currentIndex = tabs.value.findIndex((tab) => tab.id === activeTabId.value)
      const nextIndex = (currentIndex + 1) % tabs.value.length
      setActiveTab(tabs.value[nextIndex].id)
      props.onHideHome()
    }
  }

  if (e.ctrlKey && e.shiftKey && e.key === 'Tab') {
    e.preventDefault()
    if (tabs.value.length > 0) {
      const currentIndex = tabs.value.findIndex((tab) => tab.id === activeTabId.value)
      const prevIndex = (currentIndex - 1 + tabs.value.length) % tabs.value.length
      setActiveTab(tabs.value[prevIndex].id)
      props.onHideHome()
    }
  }

  if (e.ctrlKey && !e.shiftKey && !e.altKey && /^[1-9]$/.test(e.key)) {
    const tabIndex = parseInt(e.key) - 1
    if (tabIndex < tabs.value.length) {
      e.preventDefault()
      setActiveTab(tabs.value[tabIndex].id)
      props.onHideHome()
    }
  }

  if ((e.ctrlKey || e.metaKey) && !e.shiftKey && !e.altKey && e.key.toLowerCase() === 'w') {
    if (activeTabId.value && !props.isHomeActive) {
      e.preventDefault()
      closeTab(activeTabId.value)
    }
  }

  if ((e.ctrlKey || e.metaKey) && !e.shiftKey && !e.altKey && e.key.toLowerCase() === 'h') {
    e.preventDefault()
    props.onShowHome()
  }
}

const handleClickOutsideContext = (): void => {
  contextMenuVisible.value = false
}

const handleTabKeydown = (e: KeyboardEvent, tabId: string): void => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    handleTabClick(tabId)
  }
}

const handleContextMenuKeydown = (e: KeyboardEvent, action: () => void): void => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    action()
  } else if (e.key === 'Escape') {
    contextMenuVisible.value = false
  }
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
  window.addEventListener('keydown', handleKeyDown)
  document.addEventListener('click', handleClickOutsideContext)
  nextTick(() => checkScrollButtonsVisibility())
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('keydown', handleKeyDown)
  document.removeEventListener('click', handleClickOutsideContext)
})

const scrollLeft = (): void => {
  const container = tabsContainerRef.value
  if (!container) return
  const newPosition = Math.max(0, container.scrollLeft - 200)
  container.scrollTo({ left: newPosition, behavior: 'smooth' })
}

const scrollRight = (): void => {
  const container = tabsContainerRef.value
  if (!container) return
  const newPosition = Math.min(
    container.scrollWidth - container.clientWidth,
    container.scrollLeft + 200
  )
  container.scrollTo({ left: newPosition, behavior: 'smooth' })
}

const handleTabClick = (tabId: string): void => {
  setActiveTab(tabId)
  props.onHideHome()
}

const handleCloseTab = (e: MouseEvent, tabId: string): void => {
  e.stopPropagation()
  closeTab(tabId)
}

const handleContextMenu = (e: MouseEvent, tabId: string): void => {
  e.preventDefault()
  contextMenuTabId.value = tabId
  contextMenuPosition.value = { x: e.clientX, y: e.clientY }
  contextMenuVisible.value = true
}

const handleCloseOtherTabs = (): void => {
  if (contextMenuTabId.value) {
    closeOtherTabs(contextMenuTabId.value)
  }
  contextMenuVisible.value = false
}

const handleCloseAllTabs = (): void => {
  closeAllTabs()
  contextMenuVisible.value = false
}

const handleCloseTabsToRight = (): void => {
  if (contextMenuTabId.value) {
    closeTabsToRight(contextMenuTabId.value)
  }
  contextMenuVisible.value = false
}

const handleHomeClick = (): void => {
  props.onShowHome()
}

const handleDragStart = (e: DragEvent, tabId: string, index: number): void => {
  draggedTab.value = tabId
  draggedIndex.value = index
  isDragging.value = true

  if (e.dataTransfer && tabRefs.value[index]) {
    e.dataTransfer.setDragImage(tabRefs.value[index]!, 0, 0)
    e.dataTransfer.effectAllowed = 'move'
  }
}

const handleDragOver = (e: DragEvent, _tabId: string, index: number): void => {
  e.preventDefault()
  if (!isDragging.value || draggedTab.value === null) return

  const tabElement = tabRefs.value[index]
  if (tabElement) {
    const rect = tabElement.getBoundingClientRect()
    const mouseX = e.clientX
    const containerLeft = tabsContainerRef.value?.getBoundingClientRect().left || 0

    if (mouseX < rect.left + rect.width / 2) {
      dropIndicatorLeft.value = rect.left - containerLeft
    } else {
      dropIndicatorLeft.value = rect.right - containerLeft
    }
  }
}

const handleDrop = (e: DragEvent, index: number): void => {
  e.preventDefault()
  if (draggedIndex.value === index || draggedTab.value === null) return

  const tabElement = tabRefs.value[index]
  if (tabElement) {
    const rect = tabElement.getBoundingClientRect()
    const mouseX = e.clientX
    let dropIndex = index
    if (mouseX > rect.left + rect.width / 2) {
      dropIndex += 1
    }
    if (draggedIndex.value < dropIndex) {
      dropIndex -= 1
    }
    reorderTabs(draggedIndex.value, dropIndex)
  }

  draggedTab.value = null
  draggedIndex.value = -1
  isDragging.value = false
}

const handleDragEnd = (): void => {
  draggedTab.value = null
  draggedIndex.value = -1
  isDragging.value = false
}
</script>

<template>
  <div class="tabs-container" :data-density="tabDensity">
    <button
      class="home-button"
      :class="{ active: isHomeActive }"
      title="Home"
      @click="handleHomeClick"
    >
      Home
    </button>

    <div class="tabs-rows-container">
      <button
        v-if="showScrollButtons"
        class="tab-scroll-button tab-scroll-left"
        @click="scrollLeft"
      >
        &lt;
      </button>

      <div
        ref="tabsContainerRef"
        class="tabs-scroll-area"
        role="tablist"
        aria-label="Open transformation tabs"
      >
        <div
          v-if="isDragging"
          class="drop-indicator"
          :style="{ left: `${dropIndicatorLeft}px` }"
        ></div>

        <div
          v-for="(tab, index) in tabs"
          :key="tab.id"
          :ref="(el) => setTabRef(el as Element | null, index)"
          class="tab"
          :class="{
            active: tab.id === activeTabId && !isHomeActive,
            inactive: isHomeActive,
            dragging: draggedTab === tab.id
          }"
          role="tab"
          :tabindex="tab.id === activeTabId && !isHomeActive ? 0 : -1"
          :aria-selected="tab.id === activeTabId && !isHomeActive"
          draggable="true"
          @click="handleTabClick(tab.id)"
          @keydown="handleTabKeydown($event, tab.id)"
          @contextmenu="handleContextMenu($event, tab.id)"
          @dragstart="handleDragStart($event, tab.id, index)"
          @dragover="handleDragOver($event, tab.id, index)"
          @drop="handleDrop($event, index)"
          @dragend="handleDragEnd"
        >
          <div class="tab-title">{{ tab.title }}</div>
          <button
            class="tab-close"
            type="button"
            :aria-label="`Close ${tab.title}`"
            @click="handleCloseTab($event, tab.id)"
          >
            ✕
          </button>
        </div>
      </div>

      <button
        v-if="showScrollButtons"
        class="tab-scroll-button tab-scroll-right"
        @click="scrollRight"
      >
        &gt;
      </button>
    </div>

    <div
      v-if="contextMenuVisible && contextMenuTabId"
      class="tab-context-menu"
      role="menu"
      :style="{
        top: `${contextMenuPosition.y}px`,
        left: `${contextMenuPosition.x}px`
      }"
    >
      <div
        class="context-menu-item"
        role="menuitem"
        tabindex="0"
        @click="
          () => {
            if (contextMenuTabId) closeTab(contextMenuTabId)
            contextMenuVisible = false
          }
        "
        @keydown="
          handleContextMenuKeydown($event, () => {
            if (contextMenuTabId) closeTab(contextMenuTabId)
            contextMenuVisible = false
          })
        "
      >
        Close
      </div>
      <div
        class="context-menu-item"
        role="menuitem"
        tabindex="0"
        @click="handleCloseOtherTabs"
        @keydown="handleContextMenuKeydown($event, handleCloseOtherTabs)"
      >
        Close Others
      </div>
      <div
        class="context-menu-item"
        role="menuitem"
        tabindex="0"
        @click="handleCloseTabsToRight"
        @keydown="handleContextMenuKeydown($event, handleCloseTabsToRight)"
      >
        Close Tabs to the Right
      </div>
      <div
        class="context-menu-item"
        role="menuitem"
        tabindex="0"
        @click="handleCloseAllTabs"
        @keydown="handleContextMenuKeydown($event, handleCloseAllTabs)"
      >
        Close All
      </div>
    </div>
  </div>
</template>
