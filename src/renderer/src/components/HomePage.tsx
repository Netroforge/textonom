import React, { useRef, useEffect } from 'react'
import { useTabsStore } from '../stores/tabsStore'
import { useHomePageStore } from '../stores/homePageStore'
import { getAllCategories, searchTransformations } from '../transformations/registry'
import './HomePage.css'

interface HomePageProps {
  onTransformationOpened: () => void
}

const HomePage: React.FC<HomePageProps> = ({ onTransformationOpened }): React.ReactElement => {
  // Get tabs state from tabs store
  const { tabs, addTab } = useTabsStore()

  // Get home page state from home page store
  const {
    homePage: { searchQuery, scrollPosition },
    setHomePageSearchQuery,
    setHomePageScrollPosition
  } = useHomePageStore()

  // Refs
  const homePageRef = useRef<HTMLDivElement>(null)

  // Get all categories
  const categories = getAllCategories()

  // Create a set of open transformation IDs for faster lookups
  const openTransformationIds = new Set<string>()
  tabs.forEach((tab) => {
    if (tab.transformationId) {
      openTransformationIds.add(tab.transformationId)
    }
  })

  // Check if a transformation is already open in a tab
  const isTransformationOpen = (transformationId: string): boolean => {
    return openTransformationIds.has(transformationId)
  }

  // Filter categories based on search query
  const filteredCategories = searchQuery
    ? categories
        .map((category) => ({
          ...category,
          transformations: category.transformations.filter((t) =>
            searchTransformations(searchQuery).some((ft) => ft.id === t.id)
          )
        }))
        .filter((category) => category.transformations.length > 0)
    : categories

  // Handle search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setHomePageSearchQuery(e.target.value)
  }

  // Handle transformation click
  const handleTransformationClick = (transformationId: string): void => {
    addTab(transformationId)
    onTransformationOpened()
  }

  // Save scroll position when unmounting
  useEffect(() => {
    const homePageElement = homePageRef.current

    if (homePageElement) {
      // Restore scroll position
      homePageElement.scrollTop = scrollPosition

      // Save scroll position when scrolling
      const handleScroll = (): void => {
        setHomePageScrollPosition(homePageElement.scrollTop)
      }

      homePageElement.addEventListener('scroll', handleScroll)

      return (): void => {
        homePageElement.removeEventListener('scroll', handleScroll)
      }
    }
  }, [scrollPosition, setHomePageScrollPosition])

  return (
    <div ref={homePageRef} className="home-page">
      <div className="home-header">
        <h1>Textonom Transformations</h1>

        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search transformations..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      <div className="categories-container">
        {filteredCategories.map((category) => (
          <div key={category.id} className="category-section">
            <h2 className="category-title">{category.name}</h2>
            <p className="category-description">{category.description}</p>

            <div className="transformations-grid">
              {category.transformations.map((transformation) => (
                <div
                  key={transformation.id}
                  className={`transformation-card ${isTransformationOpen(transformation.id) ? 'transformation-card-open' : ''}`}
                  onClick={() => handleTransformationClick(transformation.id)}
                >
                  <div className="transformation-card-content">
                    <h3 className="transformation-title">{transformation.name}</h3>
                    <p className="transformation-description">{transformation.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {filteredCategories.length === 0 && (
          <div className="no-results">
            <p>No transformations found matching &quot;{searchQuery}&quot;</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default HomePage
