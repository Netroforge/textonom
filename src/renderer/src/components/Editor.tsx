import { useEffect, useRef } from 'react'
import * as monaco from 'monaco-editor'
import styled from 'styled-components'
import { useStore } from '../store/useStore'
import { themes } from '../styles/themes'

interface EditorProps {
  content: string
  onChange: (content: string) => void
  language?: string
  readOnly?: boolean
}

const EditorContainer = styled.div`
  height: 100%;
  width: 100%;
  overflow: hidden;
`

const Editor: React.FC<EditorProps> = ({ content, onChange, language = 'plaintext', readOnly = false }) => {
  const editorRef = useRef<HTMLDivElement>(null)
  const monacoEditorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null)
  const { settings } = useStore()

  // Initialize Monaco editor
  useEffect(() => {
    if (editorRef.current) {
      // Define Monaco editor themes
      monaco.editor.defineTheme('light', {
        base: 'vs',
        inherit: true,
        rules: [],
        colors: {
          'editor.background': themes.light.background,
          'editor.foreground': themes.light.foreground,
          'editor.lineHighlightBackground': themes.light.secondary,
          'editorCursor.foreground': themes.light.primary,
          'editorLineNumber.foreground': themes.light.border,
          'editorLineNumber.activeForeground': themes.light.primary
        }
      })

      monaco.editor.defineTheme('dark', {
        base: 'vs-dark',
        inherit: true,
        rules: [],
        colors: {
          'editor.background': themes.dark.background,
          'editor.foreground': themes.dark.foreground,
          'editor.lineHighlightBackground': themes.dark.secondary,
          'editorCursor.foreground': themes.dark.primary,
          'editorLineNumber.foreground': themes.dark.border,
          'editorLineNumber.activeForeground': themes.dark.primary
        }
      })

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
          'editor.background': themes.cyberpunk.background,
          'editor.foreground': themes.cyberpunk.foreground,
          'editor.lineHighlightBackground': themes.cyberpunk.secondary,
          'editorCursor.foreground': themes.cyberpunk.primary,
          'editorLineNumber.foreground': themes.cyberpunk.border,
          'editorLineNumber.activeForeground': themes.cyberpunk.primary
        }
      })

      monaco.editor.defineTheme('cyberpunkTurbo', {
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
          'editor.background': themes.cyberpunkTurbo.background,
          'editor.foreground': themes.cyberpunkTurbo.foreground,
          'editor.lineHighlightBackground': themes.cyberpunkTurbo.secondary,
          'editorCursor.foreground': themes.cyberpunkTurbo.primary,
          'editorLineNumber.foreground': themes.cyberpunkTurbo.border,
          'editorLineNumber.activeForeground': themes.cyberpunkTurbo.primary
        }
      })

      // Create Monaco editor
      monacoEditorRef.current = monaco.editor.create(editorRef.current, {
        value: content,
        language,
        theme: settings.theme,
        automaticLayout: true,
        minimap: { enabled: false },
        lineNumbers: settings.showLineNumbers ? 'on' : 'off',
        readOnly,
        fontSize: settings.fontSize,
        fontFamily: settings.fontFamily,
        tabSize: settings.tabSize,
        insertSpaces: settings.insertSpaces,
        wordWrap: settings.wordWrap ? 'on' : 'off',
        wrappingStrategy: 'advanced',
        scrollBeyondLastLine: false
      })

      // Set up change event handler
      monacoEditorRef.current.onDidChangeModelContent(() => {
        if (monacoEditorRef.current) {
          onChange(monacoEditorRef.current.getValue())
        }
      })

      // Set up cursor options for better visibility
      monacoEditorRef.current.updateOptions({
        cursorBlinking: 'solid',
        cursorStyle: 'block',
        cursorWidth: 2
      })
    }

    return () => {
      if (monacoEditorRef.current) {
        monacoEditorRef.current.dispose()
      }
    }
  }, [onChange])

  // Update editor content when content prop changes
  useEffect(() => {
    if (monacoEditorRef.current && content !== monacoEditorRef.current.getValue()) {
      // Save cursor position and selection
      const position = monacoEditorRef.current.getPosition()
      const selection = monacoEditorRef.current.getSelection()

      // Update content
      monacoEditorRef.current.setValue(content)

      // Restore cursor position and selection
      if (position) {
        monacoEditorRef.current.setPosition(position)
      }
      if (selection) {
        monacoEditorRef.current.setSelection(selection)
      }
    }
  }, [content])

  // Update editor settings when settings change
  useEffect(() => {
    if (monacoEditorRef.current) {
      monacoEditorRef.current.updateOptions({
        theme: settings.theme as string,
        fontSize: settings.fontSize,
        fontFamily: settings.fontFamily,
        tabSize: settings.tabSize,
        insertSpaces: settings.insertSpaces,
        lineNumbers: settings.showLineNumbers ? 'on' : 'off',
        wordWrap: settings.wordWrap ? 'on' : 'off'
      })
    }
  }, [settings])

  return <EditorContainer ref={editorRef} />
}

export default Editor
