<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useTabsStore } from '../stores/tabsStore'
import { useHomePageStore } from '../stores/homePageStore'
import { getAllCategories, searchTransformations } from '../transformations/registry'
import './HomePage.css'

const props = defineProps<{
  onTransformationOpened: () => void
}>()

const tabsStore = useTabsStore()
const { tabs } = storeToRefs(tabsStore)
const { addTab } = tabsStore

const homePageStore = useHomePageStore()
const { homePage } = storeToRefs(homePageStore)
const { setHomePageSearchQuery, setHomePageScrollPosition } = homePageStore

const homePageRef = ref<HTMLDivElement | null>(null)

const categories = getAllCategories()

const isTransformationOpen = (transformationId: string): boolean => {
  return tabs.value.some((tab) => tab.transformationId === transformationId)
}

const filteredCategories = computed(() => {
  if (!homePage.value.searchQuery) return categories
  const matched = searchTransformations(homePage.value.searchQuery)
  const matchedIds = new Set(matched.map((m) => m.id))
  return categories
    .map((category) => ({
      ...category,
      transformations: category.transformations.filter((t) => matchedIds.has(t.id))
    }))
    .filter((category) => category.transformations.length > 0)
})

const handleSearchChange = (e: Event): void => {
  const target = e.target as HTMLInputElement
  setHomePageSearchQuery(target.value)
}

const handleTransformationClick = (transformationId: string): void => {
  addTab(transformationId)
  props.onTransformationOpened()
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
})

onUnmounted(() => {
  if (homePageRef.value) {
    homePageRef.value.removeEventListener('scroll', handleScroll)
  }
})
</script>

<template>
  <div ref="homePageRef" class="home-page">
    <div class="home-header">
      <h1>Textonom Transformations</h1>

      <div class="search-container">
        <input
          type="text"
          class="search-input"
          placeholder="Search transformations..."
          :value="homePage.searchQuery"
          @input="handleSearchChange"
        />
      </div>
    </div>

    <div class="categories-container">
      <div
        v-for="category in filteredCategories"
        :key="category.id"
        class="category-section"
      >
        <h2 class="category-title">{{ category.name }}</h2>
        <p class="category-description">{{ category.description }}</p>

        <div class="transformations-grid">
          <div
            v-for="transformation in category.transformations"
            :key="transformation.id"
            class="transformation-card"
            :class="{ 'transformation-card-open': isTransformationOpen(transformation.id) }"
            @click="handleTransformationClick(transformation.id)"
          >
            <div class="transformation-card-content">
              <h3 class="transformation-title">{{ transformation.name }}</h3>
              <p class="transformation-description">{{ transformation.description }}</p>
            </div>
          </div>
        </div>
      </div>

      <div v-if="filteredCategories.length === 0" class="no-results">
        <p>No transformations found matching "{{ homePage.searchQuery }}"</p>
      </div>
    </div>
  </div>
</template>
