import React, { useRef, useState, useEffect } from 'react'
import { useTabsStore } from '../stores/tabsStore'
import './TabBar.css'

interface TabBarProps {
  isHomeActive: boolean
  onShowHome: () => void
  onHideHome: () => void
}

const TabBar: React.FC<TabBarProps> = ({ isHomeActive, onShowHome, onHideHome }) => {
  const { tabs, activeTabId, setActiveTab, closeTab, reorderTabs } = useTabsStore()

  // Refs for DOM elements
  const tabsContainerRef = useRef<HTMLDivElement>(null)
  const tabRefs = useRef<(HTMLDivElement | null)[]>([])

  // Drag and drop state
  const [draggedTab, setDraggedTab] = useState<string | null>(null)
  const [draggedIndex, setDraggedIndex] = useState<number>(-1)
  const [dropIndicatorLeft, setDropIndicatorLeft] = useState<number>(0)
  const [isDragging, setIsDragging] = useState<boolean>(false)

  // Reset tab refs when tabs change
  useEffect(() => {
    tabRefs.current = tabRefs.current.slice(0, tabs.length)
  }, [tabs])

  // Handle tab activation
  const handleTabClick = (tabId: string): void => {
    setActiveTab(tabId)
    onHideHome()
  }

  // Handle tab closing
  const handleCloseTab = (e: React.MouseEvent, tabId: string): void => {
    e.stopPropagation()
    closeTab(tabId)
  }

  // Handle home button click
  const handleHomeClick = (): void => {
    onShowHome()
  }

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, tabId: string, index: number): void => {
    setDraggedTab(tabId)
    setDraggedIndex(index)
    setIsDragging(true)

    // Set drag image (optional)
    if (e.dataTransfer && tabRefs.current[index]) {
      e.dataTransfer.setDragImage(tabRefs.current[index]!, 0, 0)
    }

    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent, tabId: string, index: number): void => {
    e.preventDefault()

    if (!isDragging || draggedTab === null) return

    // Calculate drop position
    const tabElement = tabRefs.current[index]
    if (tabElement) {
      const rect = tabElement.getBoundingClientRect()
      const mouseX = e.clientX

      // Determine if we're on the left or right half of the tab
      if (mouseX < rect.left + rect.width / 2) {
        // Left half - place indicator at the left edge
        setDropIndicatorLeft(
          rect.left - (tabsContainerRef.current?.getBoundingClientRect().left || 0)
        )
      } else {
        // Right half - place indicator at the right edge
        setDropIndicatorLeft(
          rect.right - (tabsContainerRef.current?.getBoundingClientRect().left || 0)
        )
      }
    }
  }

  const handleDrop = (e: React.DragEvent, index: number): void => {
    e.preventDefault()

    if (draggedIndex === index || draggedTab === null) return

    // Determine the actual drop index based on the mouse position
    const tabElement = tabRefs.current[index]
    if (tabElement) {
      const rect = tabElement.getBoundingClientRect()
      const mouseX = e.clientX

      let dropIndex = index

      // If dropping on the right half of a tab, increment the index
      if (mouseX > rect.left + rect.width / 2) {
        dropIndex += 1
      }

      // Adjust for the case where we're moving from left to right
      if (draggedIndex < dropIndex) {
        dropIndex -= 1
      }

      // Reorder the tabs
      reorderTabs(draggedIndex, dropIndex)
    }

    // Reset drag state
    setDraggedTab(null)
    setDraggedIndex(-1)
    setIsDragging(false)
  }

  const handleDragEnd = (): void => {
    setDraggedTab(null)
    setDraggedIndex(-1)
    setIsDragging(false)
  }

  return (
    <div className="tabs-container">
      <button
        className={`home-button ${isHomeActive ? 'active' : ''}`}
        title="Home"
        onClick={handleHomeClick}
      >
        Home
      </button>

      <div ref={tabsContainerRef} className="tabs-scroll-area">
        {/* Drop indicator */}
        {isDragging && (
          <div className="drop-indicator" style={{ left: `${dropIndicatorLeft}px` }}></div>
        )}

        {tabs.map((tab, index) => (
          <div
            key={tab.id}
            ref={(el) => (tabRefs.current[index] = el)}
            className={`tab ${tab.id === activeTabId && !isHomeActive ? 'active' : ''} ${isHomeActive ? 'inactive' : ''} ${draggedTab === tab.id ? 'dragging' : ''}`}
            draggable="true"
            onClick={() => handleTabClick(tab.id)}
            onDragStart={(e) => handleDragStart(e, tab.id, index)}
            onDragOver={(e) => handleDragOver(e, tab.id, index)}
            onDrop={(e) => handleDrop(e, index)}
            onDragEnd={handleDragEnd}
          >
            <div className="tab-title">{tab.title}</div>
            <div className="tab-close" onClick={(e) => handleCloseTab(e, tab.id)}>
              ✕
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TabBar
