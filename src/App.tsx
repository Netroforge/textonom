import React, { useState, useEffect, useCallback } from 'react';
import TabBar from './components/TabBar';
import Editor from './components/Editor';
import MainMenu from './components/MainMenu';
import SettingsDialog from './components/SettingsDialog';
import { useStore } from './store/useStore';
import { useKeyboardShortcuts } from './utils/keyboardShortcuts';
import './styles/App.css';

const App: React.FC = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { settings: { theme }, addTab } = useStore();

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  // Define callback functions for file operations
  const handleNewFile = useCallback(() => {
    addTab({
      title: 'New Tab',
      content: '',
      path: null,
      isModified: false,
    });
  }, [addTab]);

  const handleOpenFile = useCallback(async () => {
    try {
      // Open file dialog
      const selected = await window.Tauri?.invoke('plugin:dialog|open', {
        multiple: false,
        filters: [{ name: 'All Files', extensions: ['*'] }],
      });

      if (selected) {
        // Read file content
        const content = await window.Tauri?.invoke('plugin:fs|read_file', {
          path: selected,
        });

        // Get file name from path
        const pathParts = selected.split(/[/\\]/);
        const fileName = pathParts[pathParts.length - 1];

        // Create new tab with file content
        addTab({
          title: fileName,
          content,
          path: selected,
          isModified: false,
        });
      }
    } catch (error) {
      console.error('Error opening file:', error);
    }
  }, [addTab]);

  const handleSaveFile = useCallback(async () => {
    const { activeTabId, tabs, updateTabPath, updateTabTitle, setTabModified } = useStore.getState();
    const activeTab = tabs.find((tab) => tab.id === activeTabId);

    if (!activeTabId || !activeTab) return;

    try {
      if (activeTab.path) {
        // Save to existing path
        await window.Tauri?.invoke('plugin:fs|write_file', {
          path: activeTab.path,
          contents: activeTab.content,
        });
        setTabModified(activeTabId, false);
      } else {
        // Open save dialog
        const selected = await window.Tauri?.invoke('plugin:dialog|save', {
          filters: [{ name: 'Text Files', extensions: ['txt'] }],
        });

        if (selected) {
          // Save file
          await window.Tauri?.invoke('plugin:fs|write_file', {
            path: selected,
            contents: activeTab.content,
          });

          // Get file name from path
          const pathParts = selected.split(/[/\\]/);
          const fileName = pathParts[pathParts.length - 1];

          // Update tab info
          updateTabPath(activeTabId, selected);
          updateTabTitle(activeTabId, fileName);
          setTabModified(activeTabId, false);
        }
      }
    } catch (error) {
      console.error('Error saving file:', error);
    }
  }, []);

  const handleSaveFileAs = useCallback(async () => {
    const { activeTabId, tabs, updateTabPath, updateTabTitle, setTabModified } = useStore.getState();
    const activeTab = tabs.find((tab) => tab.id === activeTabId);

    if (!activeTabId || !activeTab) return;

    try {
      // Open save dialog
      const selected = await window.Tauri?.invoke('plugin:dialog|save', {
        filters: [{ name: 'Text Files', extensions: ['txt'] }],
      });

      if (selected) {
        // Save file
        await window.Tauri?.invoke('plugin:fs|write_file', {
          path: selected,
          contents: activeTab.content,
        });

        // Get file name from path
        const pathParts = selected.split(/[/\\]/);
        const fileName = pathParts[pathParts.length - 1];

        // Update tab info
        updateTabPath(activeTabId, selected);
        updateTabTitle(activeTabId, fileName);
        setTabModified(activeTabId, false);
      }
    } catch (error) {
      console.error('Error saving file:', error);
    }
  }, []);

  // Set up keyboard shortcuts
  useKeyboardShortcuts({
    onOpenFile: handleOpenFile,
    onSaveFile: handleSaveFile,
    onSaveFileAs: handleSaveFileAs,
    onNewFile: handleNewFile,
    onSettingsOpen: () => setIsSettingsOpen(true),
  });

  return (
    <div className="app-container">
      <MainMenu
        onSettingsClick={() => setIsSettingsOpen(true)}
        onNewFile={handleNewFile}
        onOpenFile={handleOpenFile}
        onSaveFile={handleSaveFile}
        onSaveFileAs={handleSaveFileAs}
      />
      <TabBar />
      <Editor />
      {isSettingsOpen && (
        <SettingsDialog onClose={() => setIsSettingsOpen(false)} />
      )}
    </div>
  );
};

export default App;
