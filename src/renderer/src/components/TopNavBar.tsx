import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useAppStore } from '../stores/appStore'
import './TopNavBar.css'

interface TopNavBarProps {
  onMenuAction: (menuAction: string) => void
  onOpenSettings: () => void
}

const TopNavBar: React.FC<TopNavBarProps> = ({
  onMenuAction,
  onOpenSettings
}): React.ReactElement => {
  // Get state from the app store
  const { activeTabId } = useAppStore()

  // Menu state
  const [activeMenu, setActiveMenu] = useState('')
  const [menuClicked, setMenuClicked] = useState(false)

  // Refs for menu containers
  const fileMenuRef = useRef<HTMLDivElement>(null)
  const helpMenuRef = useRef<HTMLDivElement>(null)

  // Toggle menu visibility
  const toggleMenu = (menu: string): void => {
    setActiveMenu(activeMenu === menu ? '' : menu)
    setMenuClicked(activeMenu !== menu)
  }

  // Close all menus
  const closeAllMenus = useCallback((): void => {
    setActiveMenu('')
    setMenuClicked(false)
  }, [])

  // Handle click outside to close menus
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent): void => {
      const isMenuClick = (event.target as Element).closest('.menu-container')
      const isTopNavClick = (event.target as Element).closest('.top-nav')

      // Close menus when clicking outside menu containers
      if (!isMenuClick) {
        closeAllMenus()
      }

      // Reset hover behavior when clicking outside the top nav
      if (!isTopNavClick) {
        setMenuClicked(false)
      }
    }

    // Add event listener
    document.addEventListener('click', handleOutsideClick)

    // Clean up
    return (): void => {
      document.removeEventListener('click', handleOutsideClick)
    }
  }, [closeAllMenus]) // Dependency on closeAllMenus

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      // Check for keyboard shortcuts
      if (event.ctrlKey || event.metaKey) {
        switch (event.key.toLowerCase()) {
          case 'x': // Ctrl+X: Cut
            // Let the browser handle this
            break
          case 'c': // Ctrl+C: Copy
            // Let the browser handle this
            break
          case 'v': // Ctrl+V: Paste
            // Let the browser handle this
            break
          case ',': // Ctrl+Comma: Settings
            event.preventDefault()
            onOpenSettings()
            break
        }
      } else if (event.key === 'Escape') {
        // Escape key closes all menus
        closeAllMenus()
      }
    }

    // Add event listener
    window.addEventListener('keydown', handleKeyDown)

    // Clean up
    return (): void => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [activeTabId, onOpenSettings, closeAllMenus]) // Re-run when dependencies change

  // Handle menu actions
  const handleMenuAction = (menuAction: string): void => {
    closeAllMenus()
    onMenuAction(menuAction)
  }

  // File operations have been removed

  // No edit operations - removed

  return (
    <div className="top-nav" ref={fileMenuRef}>
      {/* File Menu */}
      <div className="menu-container">
        <div
          className="top-nav-item"
          onClick={() => toggleMenu('file')}
          onMouseEnter={() => (menuClicked ? setActiveMenu('file') : null)}
        >
          File
        </div>
        {activeMenu === 'file' && (
          <div className="menu">
            {/* File operations have been removed */}
            <div className="menu-item" onClick={() => handleMenuAction('settings')}>
              <span>Settings</span>
            </div>
            <div className="menu-item" onClick={() => window.api.closeWindow()}>
              <span>Exit</span>
            </div>
          </div>
        )}
      </div>

      {/* Edit Menu has been removed */}

      {/* Help Menu */}
      <div className="menu-container" ref={helpMenuRef}>
        <div
          className="top-nav-item"
          onClick={() => toggleMenu('help')}
          onMouseEnter={() => (menuClicked ? setActiveMenu('help') : null)}
        >
          Help
        </div>
        {activeMenu === 'help' && (
          <div className="menu">
            <div className="menu-item" onClick={() => handleMenuAction('about')}>
              <span>About Textonom</span>
            </div>
            <div
              className="menu-item"
              onClick={() => {
                closeAllMenus()
                window.open('https://github.com/Netroforge/textonom', '_blank')
              }}
            >
              <span>GitHub Repository</span>
            </div>
            <div className="menu-item" onClick={() => handleMenuAction('checkForUpdates')}>
              <span>Check for Updates</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TopNavBar
