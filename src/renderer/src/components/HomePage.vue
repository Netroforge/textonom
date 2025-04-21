<template>
  <div ref="homePageRef" class="home-page">
    <div class="home-header">
      <h1>Textonom Transformations</h1>
      <div class="search-container">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search transformations..."
          class="search-input"
        />
      </div>
    </div>

    <div class="categories-container">
      <div v-for="category in filteredCategories" :key="category.id" class="category-section">
        <h2 class="category-title">{{ category.name }}</h2>
        <p class="category-description">{{ category.description }}</p>

        <div class="transformations-grid">
          <div
            v-for="transformation in category.transformations"
            :key="transformation.id"
            :class="[
              'transformation-card',
              isTransformationOpen(transformation.id) ? 'transformation-card-open' : ''
            ]"
            @click="openTransformation(transformation.id)"
          >
            <div class="transformation-card-content">
              <h3 class="transformation-title">{{ transformation.name }}</h3>
              <p class="transformation-description">{{ transformation.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="filteredCategories.length === 0" class="no-results">
      <p>No transformations found matching "{{ searchQuery }}"</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { getAllCategories, searchTransformations } from '../transformations/registry'
import { useTabsStore } from '../store/tabsStore'
import { useHomePageStore } from '../store/homePageStore'

// Get the stores
const tabsStore = useTabsStore()
const homePageStore = useHomePageStore()

// Refs
const homePageRef = ref<HTMLElement | null>(null)

// Search functionality
const searchQuery = ref(homePageStore.searchQuery)

// Get all categories
const categories = getAllCategories()

// Filter categories based on search query
const filteredCategories = computed(() => {
  if (!searchQuery.value) {
    return categories
  }

  // Search for transformations matching the query
  const matchingTransformations = searchTransformations(searchQuery.value)
  const matchingIds = new Set(matchingTransformations.map((t) => t.id))

  // Filter categories to only include those with matching transformations
  return categories
    .map((category) => ({
      ...category,
      transformations: category.transformations.filter((t) => matchingIds.has(t.id))
    }))
    .filter((category) => category.transformations.length > 0)
})

// Define emits
const emit = defineEmits<{
  'transformation-opened': []
}>()

// Create a reactive map of open transformation IDs for faster lookups
const openTransformationIds = computed(() => {
  const openIds = new Set<string>()
  tabsStore.tabs.forEach((tab) => {
    openIds.add(tab.transformationId)
  })
  return openIds
})

// Check if a transformation is already open in a tab
const isTransformationOpen = (transformationId: string): boolean => {
  return openTransformationIds.value.has(transformationId)
}

// Open a transformation in a new tab
const openTransformation = (transformationId: string): void => {
  // Create a new tab
  tabsStore.addTab(transformationId)

  // Emit event to indicate a transformation was opened
  emit('transformation-opened')
}

// Save the current scroll position
const saveScrollPosition = (): void => {
  if (homePageRef.value) {
    homePageStore.setScrollPosition(homePageRef.value.scrollTop)
  }
}

// Restore the saved scroll position
const restoreScrollPosition = async (): Promise<void> => {
  if (homePageRef.value && homePageStore.scrollPosition > 0) {
    // Use nextTick to ensure the DOM is updated before scrolling
    await nextTick()
    homePageRef.value.scrollTop = homePageStore.scrollPosition
  }
}

// Save search query to store when it changes
watch(searchQuery, (newValue) => {
  homePageStore.setSearchQuery(newValue)
})

// Lifecycle hooks
onMounted(async () => {
  // Restore the saved scroll position
  await restoreScrollPosition()
})

onBeforeUnmount(() => {
  // Save the current scroll position and search query
  saveScrollPosition()
  homePageStore.setSearchQuery(searchQuery.value)
})
</script>

<style scoped>
.home-page {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
  padding: 1rem;
  background-color: var(--background);
  color: var(--text);
}

.home-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border);
}

.home-header h1 {
  margin-bottom: 1rem;
  font-size: 2rem;
  text-align: center;
}

.search-container {
  width: 100%;
  max-width: 600px;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border: 1px solid var(--border);
  border-radius: 4px;
  background-color: var(--inputBackground);
  color: var(--text);
}

.search-input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 2px rgba(var(--primaryRgb), 0.2);
}

.categories-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.category-section {
  margin-bottom: 1.5rem;
}

.category-title {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: var(--primary);
}

.category-description {
  margin-bottom: 1rem;
  color: var(--textSecondary);
}

.transformations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

.transformation-card {
  background-color: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  cursor: pointer;
  height: 100%;
}

.transformation-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-color: var(--primary);
}

.transformation-card-open {
  border: 2px solid var(--primary);
  box-shadow: 0 0 12px rgba(var(--primaryRgb), 0.7);
  position: relative;
  background-color: rgba(var(--primaryRgb), 0.15);
  transform: translateY(-2px); /* Always appear slightly raised */
}

.transformation-card-open::after {
  content: '✓ Open';
  position: absolute;
  top: 8px;
  right: 8px;
  background-color: var(--primary);
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: bold;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  z-index: 1;
}

.transformation-card-content {
  padding: 1rem;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.transformation-title {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: var(--text);
}

.transformation-description {
  font-size: 0.9rem;
  color: var(--textSecondary);
  flex-grow: 1;
}

.no-results {
  text-align: center;
  margin-top: 2rem;
  padding: 2rem;
  background-color: var(--surface);
  border-radius: 8px;
  border: 1px solid var(--border);
}
</style>
