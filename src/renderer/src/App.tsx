import React, { useState, useEffect } from 'react'
import styled, { ThemeProvider } from 'styled-components'
import { useStore } from './store/useStore'
import { GlobalStyle, themes } from './styles/themes'
import Editor from './components/Editor'
import TabBar from './components/TabBar'
import MainMenu from './components/MainMenu'
import SettingsDialog from './components/SettingsDialog'

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
`

const EditorContainer = styled.div`
  flex: 1;
  overflow: hidden;
`

function App(): React.JSX.Element {
  const {
    tabs,
    activeTabId,
    settings,
    addTab,
    updateTabContent,
    setTabFilePath,
    markTabAsModified
  } = useStore()

  const [showSettings, setShowSettings] = useState(false)

  // Get the active tab
  const activeTab = tabs.find(tab => tab.id === activeTabId)

  // Handle file open
  const handleOpenFile = async (): Promise<void> => {
    try {
      const result = await window.api.file.openFile()
      if (result) {
        const { filePath, content } = result
        const fileName = filePath.split('/').pop() || 'Untitled'

        // Check if the file is already open
        const existingTab = tabs.find(tab => tab.filePath === filePath)
        if (existingTab) {
          // If it's already open, just switch to that tab
          useStore.getState().setActiveTab(existingTab.id)
        } else {
          // Otherwise, create a new tab
          const newTab = {
            title: fileName,
            content,
            filePath
          }
          addTab(newTab)
        }
      }
    } catch (error) {
      console.error('Error opening file:', error)
    }
  }

  // Handle file save
  const handleSaveFile = async (): Promise<void> => {
    if (!activeTab) return

    try {
      if (activeTab.filePath) {
        // Save to existing file
        await window.api.file.saveFile(activeTab.content, activeTab.filePath)
        markTabAsModified(activeTab.id, false)
      } else {
        // No file path, do Save As instead
        await handleSaveFileAs()
      }
    } catch (error) {
      console.error('Error saving file:', error)
    }
  }

  // Handle save as
  const handleSaveFileAs = async (): Promise<void> => {
    if (!activeTab) return

    try {
      const filePath = await window.api.file.saveFileAs(activeTab.content)
      if (filePath) {
        setTabFilePath(activeTab.id, filePath)
        markTabAsModified(activeTab.id, false)
      }
    } catch (error) {
      console.error('Error saving file:', error)
    }
  }

  // Auto-save functionality
  useEffect(() => {
    if (!settings.autoSave) return

    const autoSaveInterval = setInterval(() => {
      const modifiedTabs = tabs.filter(tab => tab.isModified && tab.filePath)

      modifiedTabs.forEach(async (tab) => {
        try {
          if (tab.filePath) {
            await window.api.file.saveFile(tab.content, tab.filePath)
            markTabAsModified(tab.id, false)
          }
        } catch (error) {
          console.error('Error auto-saving file:', error)
        }
      })
    }, settings.autoSaveInterval)

    return () => clearInterval(autoSaveInterval)
  }, [settings.autoSave, settings.autoSaveInterval, tabs])

  // Create a new tab if there are no tabs
  useEffect(() => {
    if (tabs.length === 0) {
      addTab({
        title: 'Untitled',
        content: ''
      })
    }
  }, [tabs.length, addTab])

  return (
    <ThemeProvider theme={themes[settings.theme]}>
      <GlobalStyle theme={settings.theme} />
      <AppContainer>
        <MainMenu
          theme={settings.theme}
          onOpenFile={handleOpenFile}
          onSaveFile={handleSaveFile}
          onSaveFileAs={handleSaveFileAs}
          onOpenSettings={() => setShowSettings(true)}
        />
        <TabBar theme={settings.theme} />
        <EditorContainer>
          {activeTab && (
            <Editor
              content={activeTab.content}
              onChange={(content) => updateTabContent(activeTab.id, content)}
              language="plaintext"
            />
          )}
        </EditorContainer>

        {showSettings && (
          <SettingsDialog
            theme={settings.theme}
            onClose={() => setShowSettings(false)}
          />
        )}
      </AppContainer>
    </ThemeProvider>
  )
}

export default App
