import React, { useRef, useState, useEffect, useCallback } from 'react'
import { useAppStore } from '../stores/appStore'
import './TabBar.css'

interface TabBarProps {
  isHomeActive: boolean
  onShowHome: () => void
  onHideHome: () => void
}

const TabBar: React.FC<TabBarProps> = ({ isHomeActive, onShowHome, onHideHome }) => {
  const {
    tabs,
    activeTabId,
    setActiveTab,
    closeTab,
    closeOtherTabs,
    closeAllTabs,
    closeTabsToRight,
    reorderTabs
  } = useAppStore()

  // Refs for DOM elements
  const tabsContainerRef = useRef<HTMLDivElement>(null)
  const tabRefs = useRef<(HTMLDivElement | null)[]>([])

  // Drag and drop state
  const [draggedTab, setDraggedTab] = useState<string | null>(null)
  const [draggedIndex, setDraggedIndex] = useState<number>(-1)
  const [dropIndicatorLeft, setDropIndicatorLeft] = useState<number>(0)
  const [isDragging, setIsDragging] = useState<boolean>(false)

  // Context menu state
  const [contextMenuVisible, setContextMenuVisible] = useState<boolean>(false)
  const [contextMenuPosition, setContextMenuPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0
  })
  const [contextMenuTabId, setContextMenuTabId] = useState<string | null>(null)

  // Scroll state
  const [showScrollButtons, setShowScrollButtons] = useState<boolean>(false)

  // Check if scroll buttons should be shown and adjust tab widths
  const checkScrollButtonsVisibility = useCallback((): void => {
    if (!tabsContainerRef.current) return

    const container = tabsContainerRef.current
    const shouldShowButtons = container.scrollWidth > container.clientWidth

    // Adjust tab widths based on number of tabs
    const tabElements = container.querySelectorAll('.tab')
    if (tabElements.length > 0) {
      // Apply different max-width based on number of tabs
      let maxWidth = '200px'
      if (tabs.length > 10) {
        maxWidth = '120px'
      } else if (tabs.length > 5) {
        maxWidth = '160px'
      }

      tabElements.forEach((tab) => {
        ;(tab as HTMLElement).style.maxWidth = maxWidth
      })
    }

    setShowScrollButtons(shouldShowButtons)
  }, [tabs.length])

  // Reset tab refs when tabs change
  useEffect(() => {
    tabRefs.current = tabRefs.current.slice(0, tabs.length)

    // Check if scroll buttons should be shown
    checkScrollButtonsVisibility()
  }, [tabs, checkScrollButtonsVisibility])

  // Check scroll buttons visibility when window is resized
  useEffect(() => {
    const handleResize = (): void => {
      checkScrollButtonsVisibility()
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [tabs, checkScrollButtonsVisibility])

  // Add keyboard shortcuts for tab navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      // Ctrl+Tab to switch to next tab
      if (e.ctrlKey && e.key === 'Tab') {
        e.preventDefault()
        if (tabs.length > 0) {
          const currentIndex = tabs.findIndex((tab) => tab.id === activeTabId)
          const nextIndex = (currentIndex + 1) % tabs.length
          setActiveTab(tabs[nextIndex].id)
          onHideHome()
        }
      }

      // Ctrl+Shift+Tab to switch to previous tab
      if (e.ctrlKey && e.shiftKey && e.key === 'Tab') {
        e.preventDefault()
        if (tabs.length > 0) {
          const currentIndex = tabs.findIndex((tab) => tab.id === activeTabId)
          const prevIndex = (currentIndex - 1 + tabs.length) % tabs.length
          setActiveTab(tabs[prevIndex].id)
          onHideHome()
        }
      }

      // Ctrl+1-9 to switch to specific tab
      if (e.ctrlKey && !e.shiftKey && !e.altKey && /^[1-9]$/.test(e.key)) {
        const tabIndex = parseInt(e.key) - 1
        if (tabIndex < tabs.length) {
          e.preventDefault()
          setActiveTab(tabs[tabIndex].id)
          onHideHome()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [tabs, activeTabId, setActiveTab, onHideHome])

  // Handle tab scrolling
  const scrollLeft = useCallback((): void => {
    if (tabsContainerRef.current) {
      const container = tabsContainerRef.current
      const newPosition = Math.max(0, container.scrollLeft - 200)
      container.scrollTo({ left: newPosition, behavior: 'smooth' })
    }
  }, [])

  const scrollRight = useCallback((): void => {
    if (tabsContainerRef.current) {
      const container = tabsContainerRef.current
      const newPosition = Math.min(
        container.scrollWidth - container.clientWidth,
        container.scrollLeft + 200
      )
      container.scrollTo({ left: newPosition, behavior: 'smooth' })
    }
  }, [])

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

  // Handle context menu
  const handleContextMenu = (e: React.MouseEvent, tabId: string): void => {
    e.preventDefault()
    setContextMenuTabId(tabId)
    setContextMenuPosition({ x: e.clientX, y: e.clientY })
    setContextMenuVisible(true)
  }

  // Close context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (): void => {
      setContextMenuVisible(false)
    }

    if (contextMenuVisible) {
      document.addEventListener('click', handleClickOutside)
    }

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [contextMenuVisible])

  // Context menu actions
  const handleCloseOtherTabs = (): void => {
    if (contextMenuTabId) {
      closeOtherTabs(contextMenuTabId)
    }
    setContextMenuVisible(false)
  }

  const handleCloseAllTabs = (): void => {
    closeAllTabs()
    setContextMenuVisible(false)
  }

  const handleCloseTabsToRight = (): void => {
    if (contextMenuTabId) {
      closeTabsToRight(contextMenuTabId)
    }
    setContextMenuVisible(false)
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

      <div className="tabs-rows-container">
        {showScrollButtons && (
          <button className="tab-scroll-button tab-scroll-left" onClick={scrollLeft}>
            &lt;
          </button>
        )}

        <div className="tabs-scroll-area" ref={tabsContainerRef}>
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
              onContextMenu={(e) => handleContextMenu(e, tab.id)}
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

        {showScrollButtons && (
          <button className="tab-scroll-button tab-scroll-right" onClick={scrollRight}>
            &gt;
          </button>
        )}
      </div>

      {/* Context Menu */}
      {contextMenuVisible && contextMenuTabId && (
        <div
          className="tab-context-menu"
          style={{
            top: `${contextMenuPosition.y}px`,
            left: `${contextMenuPosition.x}px`
          }}
        >
          <div
            className="context-menu-item"
            onClick={() => {
              closeTab(contextMenuTabId)
              setContextMenuVisible(false)
            }}
          >
            Close
          </div>
          <div className="context-menu-item" onClick={handleCloseOtherTabs}>
            Close Others
          </div>
          <div className="context-menu-item" onClick={handleCloseTabsToRight}>
            Close Tabs to the Right
          </div>
          <div className="context-menu-item" onClick={handleCloseAllTabs}>
            Close All
          </div>
        </div>
      )}
    </div>
  )
}

export default TabBar
