<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { useHistoryStore } from '../stores/historyStore'
import { useTabsStore } from '../stores/tabsStore'
import { getTransformationById } from '../transformations/registry'
import './HistoryPanel.css'

const props = defineProps<{
  onClose: () => void
}>()

const historyStore = useHistoryStore()
const { state } = historyStore
const tabsStore = useTabsStore()
const { addTab } = tabsStore

const favoriteTransformations = computed(() => {
  return state.favorites
    .map((id) => {
      const t = getTransformationById(id)
      return t ? { id: t.id, name: t.name, description: t.description } : null
    })
    .filter((t): t is { id: string; name: string; description: string } => t !== null)
})

const recentHistory = computed(() => {
  return state.history.filter((entry) => getTransformationById(entry.transformationId)).slice(0, 20)
})

const handleOpenTransformation = (transformationId: string): void => {
  if (addTab(transformationId)) {
    props.onClose()
  }
}

const handleRemoveFromHistory = (id: string, e: Event): void => {
  e.stopPropagation()
  historyStore.removeFromHistory(id)
}

const handleToggleFavorite = (transformationId: string, e: Event): void => {
  e.stopPropagation()
  historyStore.toggleFavorite(transformationId)
}

const handleClearHistory = (): void => {
  historyStore.clearHistory()
}

const formatTime = (timestamp: number): string => {
  const now = Date.now()
  const diff = now - timestamp
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  return `${days}d ago`
}

const handleKeydown = (e: KeyboardEvent): void => {
  if (e.key === 'Escape') {
    props.onClose()
  }
}

onMounted(() => window.addEventListener('keydown', handleKeydown))
onUnmounted(() => window.removeEventListener('keydown', handleKeydown))

const onOverlayClick = (e: MouseEvent): void => {
  if (e.target === e.currentTarget) props.onClose()
}
</script>

<template>
  <div class="history-overlay" @click="onOverlayClick">
    <div class="history-panel" role="dialog" aria-modal="true" aria-labelledby="history-title">
      <div class="history-panel-header">
        <h3 id="history-title">History & Favorites</h3>
        <button class="close-button" aria-label="Close" @click="onClose">✕</button>
      </div>

      <div class="history-panel-content">
        <div v-if="favoriteTransformations.length > 0" class="history-section">
          <div class="history-section-header">
            <h4>Favorites</h4>
          </div>
          <div class="history-list">
            <div
              v-for="fav in favoriteTransformations"
              :key="fav.id"
              class="history-item"
              role="button"
              tabindex="0"
              @click="handleOpenTransformation(fav.id)"
              @keydown.enter.prevent="handleOpenTransformation(fav.id)"
              @keydown.space.prevent="handleOpenTransformation(fav.id)"
            >
              <button
                type="button"
                class="history-item-star history-item-star-active"
                :aria-label="`Remove ${fav.name} from favorites`"
                @click="(e) => handleToggleFavorite(fav.id, e)"
                @keydown.stop
              >
                ★
              </button>
              <div class="history-item-info">
                <span class="history-item-name">{{ fav.name }}</span>
              </div>
            </div>
          </div>
        </div>

        <div v-if="recentHistory.length > 0" class="history-section">
          <div class="history-section-header">
            <h4>Recent</h4>
            <button class="clear-history-button" @click="handleClearHistory">Clear</button>
          </div>
          <div class="history-list">
            <div
              v-for="entry in recentHistory"
              :key="entry.id"
              class="history-item"
              role="button"
              tabindex="0"
              @click="handleOpenTransformation(entry.transformationId)"
              @keydown.enter.prevent="handleOpenTransformation(entry.transformationId)"
              @keydown.space.prevent="handleOpenTransformation(entry.transformationId)"
            >
              <button
                type="button"
                class="history-item-star"
                :class="{
                  'history-item-star-active': historyStore.isFavorite(entry.transformationId)
                }"
                :aria-label="`${historyStore.isFavorite(entry.transformationId) ? 'Remove' : 'Add'} ${entry.transformationName} ${historyStore.isFavorite(entry.transformationId) ? 'from' : 'to'} favorites`"
                @click="(e) => handleToggleFavorite(entry.transformationId, e)"
                @keydown.stop
              >
                {{ historyStore.isFavorite(entry.transformationId) ? '★' : '☆' }}
              </button>
              <div class="history-item-info">
                <span class="history-item-name">{{ entry.transformationName }}</span>
                <span class="history-item-time">{{ formatTime(entry.timestamp) }}</span>
              </div>
              <button
                class="history-item-remove"
                aria-label="Remove from history"
                @click="(e) => handleRemoveFromHistory(entry.id, e)"
                @keydown.stop
              >
                ✕
              </button>
            </div>
          </div>
        </div>

        <div
          v-if="favoriteTransformations.length === 0 && recentHistory.length === 0"
          class="history-empty"
        >
          <p>No history yet. Open a transformation to get started.</p>
        </div>
      </div>
    </div>
  </div>
</template>
