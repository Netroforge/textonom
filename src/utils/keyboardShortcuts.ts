import { useEffect } from 'react';
import { useStore } from '../store/useStore';

interface KeyboardShortcutsProps {
  onOpenFile: () => void;
  onSaveFile: () => void;
  onSaveFileAs: () => void;
  onNewFile: () => void;
  onSettingsOpen: () => void;
}

export const useKeyboardShortcuts = ({
  onOpenFile,
  onSaveFile,
  onSaveFileAs,
  onNewFile,
  onSettingsOpen,
}: KeyboardShortcutsProps) => {
  const { tabs, activeTabId, closeTab } = useStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if the event target is an input element
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        // Don't handle shortcuts when typing in form elements
        return;
      }

      // Common modifier key for different platforms
      const modKey = navigator.platform.includes('Mac') ? e.metaKey : e.ctrlKey;

      // File operations
      if (modKey && e.key === 'o') {
        // Ctrl+O / Cmd+O: Open file
        e.preventDefault();
        onOpenFile();
      } else if (modKey && e.key === 's' && !e.shiftKey) {
        // Ctrl+S / Cmd+S: Save file
        e.preventDefault();
        onSaveFile();
      } else if (modKey && e.shiftKey && e.key === 'S') {
        // Ctrl+Shift+S / Cmd+Shift+S: Save file as
        e.preventDefault();
        onSaveFileAs();
      } else if (modKey && e.key === 'n') {
        // Ctrl+N / Cmd+N: New file
        e.preventDefault();
        onNewFile();
      } else if (modKey && e.key === 'w') {
        // Ctrl+W / Cmd+W: Close current tab
        e.preventDefault();
        if (activeTabId) {
          closeTab(activeTabId);
        }
      } else if (modKey && e.key === ',') {
        // Ctrl+, / Cmd+,: Open settings
        e.preventDefault();
        onSettingsOpen();
      }

      // Tab navigation
      if (modKey && e.key === 'Tab') {
        // Ctrl+Tab / Cmd+Tab: Cycle through tabs
        e.preventDefault();
        if (tabs.length > 1 && activeTabId) {
          const currentIndex = tabs.findIndex(tab => tab.id === activeTabId);
          const nextIndex = (currentIndex + 1) % tabs.length;
          const nextTabId = tabs[nextIndex].id;
          useStore.getState().setActiveTab(nextTabId);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeTabId, tabs, closeTab, onOpenFile, onSaveFile, onSaveFileAs, onNewFile, onSettingsOpen]);
};
