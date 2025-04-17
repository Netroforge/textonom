import React, { useEffect, useRef } from 'react';
import { Editor as MonacoEditor } from '@monaco-editor/react';
import { useStore } from '../store/useStore';
import CRTEffect from './CRTEffect';
import '../styles/Editor.css';

const Editor: React.FC = () => {
  const { tabs, activeTabId, settings, updateTabContent } = useStore();
  const activeTab = tabs.find((tab) => tab.id === activeTabId);
  const editorRef = useRef<any>(null);

  // Handle editor mount
  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;

    // Apply editor settings
    editor.updateOptions({
      fontSize: settings.fontSize,
      fontFamily: settings.fontFamily,
      tabSize: settings.tabSize,
      insertSpaces: settings.insertSpaces,
      autoIndent: settings.autoIndent ? 'advanced' : 'none',
      lineNumbers: settings.showLineNumbers ? 'on' : 'off',
      wordWrap: settings.wordWrap ? 'on' : 'off',
      wrappingStrategy: 'advanced',
      wrappingIndent: 'indent',
    });
  };

  // Update editor options when settings change
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.updateOptions({
        fontSize: settings.fontSize,
        fontFamily: settings.fontFamily,
        tabSize: settings.tabSize,
        insertSpaces: settings.insertSpaces,
        autoIndent: settings.autoIndent ? 'advanced' : 'none',
        lineNumbers: settings.showLineNumbers ? 'on' : 'off',
        wordWrap: settings.wordWrap ? 'on' : 'off',
      });
    }
  }, [settings]);

  // Auto-save functionality
  useEffect(() => {
    let autoSaveInterval: number | undefined;

    if (settings.autoSave && activeTabId && activeTab?.path) {
      autoSaveInterval = window.setInterval(async () => {
        try {
          if (activeTab.isModified && activeTab.path) {
            const content = editorRef.current?.getValue() || '';
            await window.Tauri?.invoke('plugin:fs|write_file', {
              path: activeTab.path,
              contents: content,
            });
          }
        } catch (error) {
          console.error('Auto-save failed:', error);
        }
      }, settings.autoSaveInterval);
    }

    return () => {
      if (autoSaveInterval) {
        clearInterval(autoSaveInterval);
      }
    };
  }, [settings.autoSave, settings.autoSaveInterval, activeTabId, activeTab]);

  // Handle content change
  const handleChange = (value: string | undefined) => {
    if (activeTabId && value !== undefined) {
      updateTabContent(activeTabId, value);
    }
  };

  // Determine which theme to use for Monaco
  const getMonacoTheme = () => {
    switch (settings.theme) {
      case 'dark':
        return 'vs-dark';
      case 'cyberpunk':
      case 'cyberpunk-turbo':
        return 'vs-dark'; // We'll apply custom styling via CSS
      default:
        return 'vs';
    }
  };

  return (
    <div className="editor-container">
      {activeTab ? (
        <>
          <MonacoEditor
            height="100%"
            language="plaintext" // Default language, can be changed based on file extension
            value={activeTab.content}
            theme={getMonacoTheme()}
            onChange={handleChange}
            onMount={handleEditorDidMount}
            options={{
              automaticLayout: true,
              scrollBeyondLastLine: false,
              minimap: { enabled: true },
              scrollbar: {
                vertical: 'visible',
                horizontal: 'visible',
                verticalScrollbarSize: 10,
                horizontalScrollbarSize: 10,
              },
            }}
          />
          {settings.theme === 'cyberpunk-turbo' && <CRTEffect />}
        </>
      ) : (
        <div className="empty-editor">
          <p>No tab is currently open.</p>
          <p>Create a new tab or open a file to start editing.</p>
        </div>
      )}
    </div>
  );
};

export default Editor;
