<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useTabsStore } from '../stores/tabsStore'
import { useTabsContentStore } from '../stores/tabsContentStore'
import { useHomePageStore } from '../stores/homePageStore'
import { useHistoryStore } from '../stores/historyStore'
import { useToast } from '../stores/toastStore'
import type { Transformation } from '../types/transformation'
import { detectText, type SmartDetectionResult } from '../utils/smartDetection'
import {
  getAllCategories,
  searchTransformations,
  getTransformationById
} from '../transformations/registry'
import FavoriteButton from './FavoriteButton.vue'
import './HomePage.css'

const props = defineProps<{
  onTransformationOpened: () => void
}>()

const tabsStore = useTabsStore()
const { tabs } = storeToRefs(tabsStore)
const { addTab } = tabsStore
const tabsContentStore = useTabsContentStore()
const { showToast } = useToast()

const homePageStore = useHomePageStore()
const { homePage } = storeToRefs(homePageStore)
const { setHomePageSearchQuery, setHomePageScrollPosition } = homePageStore

const historyStore = useHistoryStore()

const homePageRef = ref<HTMLDivElement | null>(null)
const searchInputRef = ref<HTMLInputElement | null>(null)
const categoryFilterRef = ref<HTMLElement | null>(null)
const activeCategory = ref('all')
const smartPasteState = ref<'idle' | 'reading' | 'ready' | 'empty' | 'error'>('idle')
const smartPasteInput = ref('')
const smartPasteResult = ref<SmartDetectionResult | null>(null)

const categories = getAllCategories()
const transformationCount = categories.reduce(
  (total, category) => total + category.transformations.length,
  0
)

const isSearching = computed(() => homePage.value.searchQuery.trim().length > 0)

const favoriteTransformations = computed(() => {
  return historyStore.state.favorites
    .map((id) => getTransformationById(id))
    .filter((t) => t !== undefined) as NonNullable<ReturnType<typeof getTransformationById>>[]
})

const recentTransformations = computed(() => {
  return historyStore.state.history
    .slice(0, 6)
    .map((entry) => {
      const transformation = getTransformationById(entry.transformationId)
      return transformation ? { transformation, timestamp: entry.timestamp } : null
    })
    .filter(
      (
        item
      ): item is {
        transformation: Transformation
        timestamp: number
      } => item !== null
    )
})

const showQuickAccess = computed(() => !isSearching.value && activeCategory.value === 'all')

const handleKeydown = (e: KeyboardEvent): void => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'f') {
    e.preventDefault()
    searchInputRef.value?.focus()
    searchInputRef.value?.select()
  }
}

const isTransformationOpen = (transformationId: string): boolean => {
  return tabs.value.some((tab) => tab.transformationId === transformationId)
}

const filteredCategories = computed(() => {
  const categoryResults = isSearching.value
    ? (() => {
        const matched = searchTransformations(homePage.value.searchQuery)
        const matchedIds = new Set(matched.map((match) => match.id))
        return categories
          .map((category) => ({
            ...category,
            transformations: category.transformations.filter((transformation) =>
              matchedIds.has(transformation.id)
            )
          }))
          .filter((category) => category.transformations.length > 0)
      })()
    : categories

  if (activeCategory.value === 'all') return categoryResults
  return categoryResults.filter((category) => category.id === activeCategory.value)
})

const visibleTransformationCount = computed(() =>
  filteredCategories.value.reduce((total, category) => total + category.transformations.length, 0)
)

const categoryOptions = computed(() => [
  { id: 'all', name: 'All tools', count: transformationCount },
  ...categories.map((category) => ({
    id: category.id,
    name: category.name,
    count: category.transformations.length
  }))
])

const formatRelativeTime = (timestamp: number): string => {
  const elapsedMinutes = Math.floor((Date.now() - timestamp) / 60000)
  if (elapsedMinutes < 1) return 'Just now'
  if (elapsedMinutes < 60) return `${elapsedMinutes}m ago`
  const elapsedHours = Math.floor(elapsedMinutes / 60)
  if (elapsedHours < 24) return `${elapsedHours}h ago`
  return `${Math.floor(elapsedHours / 24)}d ago`
}

const selectCategory = async (categoryId: string): Promise<void> => {
  activeCategory.value = categoryId
  homePageRef.value?.scrollTo({ top: 0, behavior: 'smooth' })
  await nextTick()

  const activeButton = categoryFilterRef.value?.querySelector<HTMLElement>(
    `[data-category-id="${categoryId}"]`
  )
  activeButton?.scrollIntoView?.({
    behavior: 'smooth',
    block: 'nearest',
    inline: 'nearest'
  })
}

const handleSearchChange = (e: Event): void => {
  const target = e.target as HTMLInputElement
  setHomePageSearchQuery(target.value)
  if (target.value) activeCategory.value = 'all'
}

const handleClearSearch = (): void => {
  setHomePageSearchQuery('')
  searchInputRef.value?.focus()
}

const handleTransformationClick = (transformationId: string): void => {
  addTab(transformationId)
  props.onTransformationOpened()
}

const readClipboard = async (): Promise<void> => {
  smartPasteState.value = 'reading'

  try {
    const clipboardText = await window.api.readClipboardText()
    smartPasteInput.value = clipboardText
    smartPasteResult.value = detectText(clipboardText)
    smartPasteState.value = clipboardText.trim() ? 'ready' : 'empty'
  } catch {
    smartPasteInput.value = ''
    smartPasteResult.value = null
    smartPasteState.value = 'error'
    showToast(
      'Clipboard access was denied. Copy text and allow clipboard access to use Smart Paste.',
      'error'
    )
  }
}

const openSmartSuggestion = (transformationId: string): void => {
  const tabId = addTab(transformationId)
  if (!tabId) return

  const existingContent = tabsContentStore.getTabContent(tabId)
  tabsContentStore.saveTabContent(tabId, {
    inputText: smartPasteInput.value,
    outputText: '',
    paramValues: existingContent.paramValues
  })
  props.onTransformationOpened()
}

const getSuggestionName = (transformationId: string): string =>
  getTransformationById(transformationId)?.name ?? transformationId

const handleToggleFavorite = (transformationId: string): void => {
  historyStore.toggleFavorite(transformationId)
}

const handleScroll = (): void => {
  if (homePageRef.value) {
    setHomePageScrollPosition(homePageRef.value.scrollTop)
  }
}

onMounted(() => {
  if (homePageRef.value) {
    homePageRef.value.scrollTop = homePage.value.scrollPosition
    homePageRef.value.addEventListener('scroll', handleScroll)
  }
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  if (homePageRef.value) {
    homePageRef.value.removeEventListener('scroll', handleScroll)
  }
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <main ref="homePageRef" class="home-page">
    <header class="home-header">
      <div class="home-header-inner">
        <div class="home-heading">
          <span class="home-eyebrow">Private by default · Runs locally</span>
          <h1>Transform text, instantly</h1>
          <p>Choose from {{ transformationCount }} focused tools without sending your data away.</p>
        </div>

        <div class="home-discovery">
          <div class="search-container">
            <svg class="search-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="m21 21-4.35-4.35m2.35-5.65a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z" />
            </svg>
            <input
              ref="searchInputRef"
              type="search"
              class="search-input"
              placeholder="Search by tool or task…"
              aria-label="Search transformations"
              :value="homePage.searchQuery"
              @input="handleSearchChange"
              @keydown.esc="handleClearSearch"
            />
            <kbd class="search-shortcut">Ctrl F</kbd>
            <button
              v-if="homePage.searchQuery"
              type="button"
              class="search-clear"
              aria-label="Clear search"
              title="Clear search"
              @click="handleClearSearch"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="m6 6 12 12M18 6 6 18" />
              </svg>
            </button>
          </div>
          <div class="smart-paste-action">
            <button
              type="button"
              class="smart-paste-button"
              :disabled="smartPasteState === 'reading'"
              @click="readClipboard"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M9 5h6m-6 0a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2m-6 0a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2m2 0h1a2 2 0 0 1 2 2v12H5V7a2 2 0 0 1 2-2h1"
                />
                <path d="m12 10 .7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7L12 10Z" />
              </svg>
              {{ smartPasteState === 'reading' ? 'Reading clipboard…' : 'Smart Paste' }}
            </button>
            <span>Clipboard is read only when you click</span>
          </div>
        </div>
      </div>
    </header>

    <div class="home-content">
      <nav ref="categoryFilterRef" class="category-filter" aria-label="Transformation categories">
        <button
          v-for="category in categoryOptions"
          :key="category.id"
          type="button"
          class="category-filter-button"
          :data-category-id="category.id"
          :class="{ active: activeCategory === category.id }"
          :aria-pressed="activeCategory === category.id"
          @click="selectCategory(category.id)"
        >
          <span>{{ category.name }}</span>
          <span class="category-filter-count">{{ category.count }}</span>
        </button>
      </nav>

      <section
        v-if="smartPasteState !== 'idle' && smartPasteState !== 'reading'"
        class="smart-paste-panel"
        aria-live="polite"
        aria-labelledby="smart-paste-title"
      >
        <div class="smart-paste-summary">
          <span class="smart-paste-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="m12 3 .9 2.2L15 6l-2.1.8L12 9l-.9-2.2L9 6l2.1-.8L12 3Z" />
              <path d="m18 11 .6 1.4L20 13l-1.4.6L18 15l-.6-1.4L16 13l1.4-.6L18 11Z" />
              <path d="M6 10v9h12v-2M8 5H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
            </svg>
          </span>
          <div>
            <span class="section-kicker">Detected locally</span>
            <h2 id="smart-paste-title">
              {{ smartPasteResult?.kind ?? 'Clipboard unavailable' }}
            </h2>
            <p v-if="smartPasteState === 'ready'">
              {{ smartPasteResult?.summary }} · {{ smartPasteInput.length.toLocaleString() }}
              {{ smartPasteInput.length === 1 ? 'character' : 'characters' }}
            </p>
            <p v-else-if="smartPasteState === 'empty'">
              Copy some text, then scan the clipboard again.
            </p>
            <p v-else>
              Textonom could not read the clipboard. Check your system permission and try again.
            </p>
          </div>
        </div>

        <div
          v-if="smartPasteState === 'ready' && smartPasteResult?.suggestions.length"
          class="smart-paste-suggestions"
        >
          <button
            v-for="suggestion in smartPasteResult.suggestions"
            :key="suggestion.transformationId"
            type="button"
            class="smart-suggestion"
            @click="openSmartSuggestion(suggestion.transformationId)"
          >
            <span>
              <strong>{{ getSuggestionName(suggestion.transformationId) }}</strong>
              <small>{{ suggestion.reason }}</small>
            </span>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>

        <button v-else type="button" class="smart-paste-retry" @click="readClipboard">
          Try again
        </button>
      </section>

      <div v-if="isSearching" class="results-summary" aria-live="polite">
        <span>
          {{ visibleTransformationCount }}
          {{ visibleTransformationCount === 1 ? 'tool' : 'tools' }} found
        </span>
        <span class="results-query">for “{{ homePage.searchQuery }}”</span>
      </div>

      <section
        v-if="showQuickAccess && recentTransformations.length > 0"
        class="quick-section"
        aria-labelledby="recent-tools-title"
      >
        <div class="section-heading">
          <div>
            <span class="section-kicker">Pick up where you left off</span>
            <h2 id="recent-tools-title">Recent</h2>
          </div>
        </div>
        <div class="quick-grid">
          <button
            v-for="item in recentTransformations"
            :key="item.transformation.id"
            type="button"
            class="quick-card"
            @click="handleTransformationClick(item.transformation.id)"
          >
            <span class="quick-card-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M12 7v5l3 2m6-2a9 9 0 1 1-9-9 9 9 0 0 1 9 9Z" />
              </svg>
            </span>
            <span class="quick-card-copy">
              <strong>{{ item.transformation.name }}</strong>
              <small>{{ formatRelativeTime(item.timestamp) }}</small>
            </span>
            <svg class="quick-card-arrow" viewBox="0 0 24 24" aria-hidden="true">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>
      </section>

      <section
        v-if="showQuickAccess && favoriteTransformations.length > 0"
        class="quick-section"
        aria-labelledby="favorite-tools-title"
      >
        <div class="section-heading">
          <div>
            <span class="section-kicker">Your shortcuts</span>
            <h2 id="favorite-tools-title">Favorites</h2>
          </div>
        </div>
        <div class="transformations-grid favorites-grid">
          <article
            v-for="transformation in favoriteTransformations"
            :key="transformation.id"
            class="transformation-card"
            :class="{ 'transformation-card-open': isTransformationOpen(transformation.id) }"
            role="button"
            tabindex="0"
            :aria-label="`Open ${transformation.name}`"
            @click="handleTransformationClick(transformation.id)"
            @keydown.enter.prevent="handleTransformationClick(transformation.id)"
            @keydown.space.prevent="handleTransformationClick(transformation.id)"
          >
            <div class="transformation-card-content">
              <div class="transformation-card-header">
                <h3 class="transformation-title">{{ transformation.name }}</h3>
                <FavoriteButton
                  active
                  :item-name="transformation.name"
                  @toggle="handleToggleFavorite(transformation.id)"
                />
              </div>
              <p class="transformation-description">{{ transformation.description }}</p>
              <span class="card-open-label">
                Open tool
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </span>
            </div>
          </article>
        </div>
      </section>

      <div class="categories-container">
        <section
          v-for="category in filteredCategories"
          :key="category.id"
          class="category-section"
          :aria-labelledby="`category-title-${category.id}`"
        >
          <div class="section-heading category-heading">
            <div>
              <span class="section-kicker">{{ category.transformations.length }} tools</span>
              <h2 :id="`category-title-${category.id}`">{{ category.name }}</h2>
              <p>{{ category.description }}</p>
            </div>
          </div>

          <div class="transformations-grid">
            <article
              v-for="transformation in category.transformations"
              :key="transformation.id"
              class="transformation-card"
              :class="{ 'transformation-card-open': isTransformationOpen(transformation.id) }"
              role="button"
              tabindex="0"
              :aria-label="`Open ${transformation.name}`"
              @click="handleTransformationClick(transformation.id)"
              @keydown.enter.prevent="handleTransformationClick(transformation.id)"
              @keydown.space.prevent="handleTransformationClick(transformation.id)"
            >
              <div class="transformation-card-content">
                <div class="transformation-card-header">
                  <h3 class="transformation-title">{{ transformation.name }}</h3>
                  <FavoriteButton
                    :active="historyStore.isFavorite(transformation.id)"
                    :item-name="transformation.name"
                    @toggle="handleToggleFavorite(transformation.id)"
                  />
                </div>
                <p class="transformation-description">{{ transformation.description }}</p>
                <span class="card-open-label">
                  Open tool
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </span>
              </div>
            </article>
          </div>
        </section>

        <div v-if="filteredCategories.length === 0" class="no-results">
          <span class="no-results-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="m21 21-4.35-4.35m2.35-5.65a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z" />
            </svg>
          </span>
          <h2>No matching tools</h2>
          <p>Try a format, action, or shorter search term.</p>
          <button type="button" class="clear-results-button" @click="handleClearSearch">
            Clear search
          </button>
        </div>
      </div>
    </div>
  </main>
</template>
