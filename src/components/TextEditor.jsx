import React from 'react';
import Editor from '@monaco-editor/react';
import styled from 'styled-components';

const EditorContainer = styled.div`
  height: 100%;
  width: 100%;
  position: relative;
`;

// Get the appropriate Monaco theme based on app theme
const getMonacoTheme = (theme) => {
  switch (theme) {
    case 'dark':
      return 'vs-dark';
    case 'cyberpunk':
      return 'cyberpunk';
    case 'cyberpunk-turbo':
      return 'cyberpunk-turbo';
    default:
      return 'vs-light';
  }
};

const TextEditor = ({
  content,
  onChange,
  filePath,
  settings = {}
}) => {
  const handleEditorBeforeMount = (monaco) => {
    // Configure Monaco before mounting

    // Custom dark theme
    monaco.editor.defineTheme('custom-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {}
    });

    // Cyberpunk theme
    monaco.editor.defineTheme('cyberpunk', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '#6272a4' },
        { token: 'string', foreground: '#ff79c6' },
        { token: 'keyword', foreground: '#ff00ff' },
        { token: 'number', foreground: '#bd93f9' },
        { token: 'operator', foreground: '#00ffff' }
      ],
      colors: {
        'editor.background': '#0c0c14',
        'editor.foreground': '#f0f0f0',
        'editorCursor.foreground': '#ff00ff',
        'editor.lineHighlightBackground': '#1a1a2e',
        'editorLineNumber.foreground': '#3a3a5a',
        'editor.selectionBackground': '#3a3a5a',
        'editor.selectionHighlightBackground': '#1a1a2e'
      }
    });

    // Cyberpunk Turbo theme
    monaco.editor.defineTheme('cyberpunk-turbo', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '#6272a4' },
        { token: 'string', foreground: '#ff55cc' },
        { token: 'keyword', foreground: '#ff00aa' },
        { token: 'number', foreground: '#bd93f9' },
        { token: 'operator', foreground: '#00ffee' }
      ],
      colors: {
        'editor.background': '#0a0a12',
        'editor.foreground': '#f0f0f0',
        'editorCursor.foreground': '#ff00aa',
        'editor.lineHighlightBackground': '#1a1a2e',
        'editorLineNumber.foreground': '#3a3a5a',
        'editor.selectionBackground': '#3a3a5a',
        'editor.selectionHighlightBackground': '#1a1a2e'
      }
    });
  };

  const getEditorOptions = () => ({
    fontFamily: settings.font?.family || 'Consolas, monospace',
    fontSize: settings.font?.size || 14,
    tabSize: settings.tabSize || 2,
    insertSpaces: !settings.useTabs,
    lineNumbers: settings.showLineNumbers ? 'on' : 'off',
    wordWrap: settings.wordWrap ? 'on' : 'off',
    wrappingStrategy: 'advanced',
    wrappingIndent: 'indent',
    wordWrapColumn: settings.wrapColumn || 80,
    minimap: { enabled: true },
    scrollBeyondLastLine: false,
    automaticLayout: true
  });

  return (
    <EditorContainer>
      <Editor
        height="100%"
        width="100%"
        defaultLanguage="plaintext"
        value={content}
        onChange={onChange}
        beforeMount={handleEditorBeforeMount}
        options={getEditorOptions()}
        theme={getMonacoTheme(settings.theme)}
        loading={<div>Loading editor...</div>}
      />
    </EditorContainer>
  );
};

export default TextEditor;
