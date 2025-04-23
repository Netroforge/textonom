import React, { useRef, useEffect } from 'react'
import { useTabsStore } from '../stores/tabsStore'
import { useHomePageStore } from '../stores/homePageStore'
import { getAllCategories, searchTransformations } from '../transformations/registry'

interface HomePageProps {
  onTransformationOpened: () => void
  // onShowTailwindDemo prop removed
}

const HomePageTailwind: React.FC<HomePageProps> = ({
  onTransformationOpened
}): React.ReactElement => {
  const { tabs, addTab } = useTabsStore()
  const { searchQuery, scrollPosition, setSearchQuery, setScrollPosition } = useHomePageStore()

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
    setSearchQuery(e.target.value)
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
        setScrollPosition(homePageElement.scrollTop)
      }

      homePageElement.addEventListener('scroll', handleScroll)

      return (): void => {
        homePageElement.removeEventListener('scroll', handleScroll)
      }
    }

    return undefined
  }, [scrollPosition, setScrollPosition])

  return (
    <div
      ref={homePageRef}
      className="flex flex-col h-full overflow-y-auto bg-[#0a0a16] text-[#00ffff]"
    >
      {/* Header with title and search */}
      <div className="sticky top-0 z-[50] bg-[#0a0a16] border-b border-[#ff00ff] shadow-md">
        <div className="flex flex-col items-center py-4">
          <h1 className="text-3xl text-center text-[#00ffff] mb-4 font-normal">Textonom Transformations</h1>

          <div className="w-full max-w-3xl px-4">
            <input
              type="text"
              placeholder="Search transformations..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full bg-[#12122a] text-[#00ffff] border border-[#ff00ff] p-2 mb-4 focus:outline-none focus:border-[#ff00ff] focus:ring-1 focus:ring-[#ff00ff]"
            />
          </div>
        </div>
      </div>

      {/* Categories and transformations */}
      <div className="flex-1 px-4 py-2">
        <div className="max-w-6xl mx-auto">
          {filteredCategories.map((category) => (
            <div key={category.id} className="mb-6 bg-[#1a1a2e] border border-[#ff00ff] rounded-md overflow-hidden">
              <h2 className="text-xl font-bold bg-[#2a2a4e] text-[#00ffff] p-3 border-b border-[#ff00ff]">
                {category.name}
              </h2>
              <p className="text-[#00ffff] px-4 py-2 text-sm border-b border-[#ff00ff] bg-[#1a1a2e]">
                {category.description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 p-2">
                {category.transformations.map((transformation) => (
                  <div
                    key={transformation.id}
                    className={`cursor-pointer border border-[#ff00ff] rounded-md hover:bg-[#2a2a4e] transition-colors duration-200 h-full ${isTransformationOpen(transformation.id) ? 'bg-[#2a2a4e]' : 'bg-[#1a1a2e]'
                      }`}
                    onClick={() => handleTransformationClick(transformation.id)}
                  >
                    <div className="p-3 h-full flex flex-col">
                      <h3 className="text-[#00ffff] font-bold mb-1 text-base">{transformation.name}</h3>
                      <p className="text-[#00ffff] text-sm flex-1 opacity-90">{transformation.description}</p>
                      {isTransformationOpen(transformation.id) && (
                        <div className="mt-2 text-xs text-right text-[#ff00ff]">✓ Open</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {filteredCategories.length === 0 && (
            <div className="text-center mt-8 p-8 bg-[#1a1a2e] border border-[#ff00ff] rounded-md">
              <p className="text-[#00ffff]">
                No transformations found matching &quot;{searchQuery}&quot;
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto p-2 border-t border-[#ff00ff] bg-[#1a1a2e] text-right text-xs text-[#00ffff]">
        v1.0.2
      </div>
    </div>
  )
}

export default HomePageTailwind
