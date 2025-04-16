import React, { useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import styled from 'styled-components';
import { registerIpcEvent } from '../utils/eventManager';

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

// Create a global reference to the active editor
let activeEditorRef = null;
let activeModelRef = null;

// Global function to apply transformation
window.applyEditorTransformation = (newContent) => {
    console.log('[TextEditor] Global applyEditorTransformation called');

    // First try with the global references
    if (activeEditorRef && activeModelRef) {
        try {
            // Get the current range of the model
            const fullRange = activeModelRef.getFullModelRange();

            // Create an edit operation that replaces the entire content
            // This will be added to the undo stack as a single operation
            activeEditorRef.executeEdits('transformation', [
                {
                    range: fullRange,
                    text: newContent,
                    forceMoveMarkers: true
                }
            ]);
            console.log('[TextEditor] Global transformation applied successfully');
            return true;
        } catch (error) {
            console.error('[TextEditor] Error applying global transformation:', error);
            console.error('Stack trace:', error.stack);
            // Continue to try other methods
        }
    } else {
        console.warn('[TextEditor] Global editor or model reference is null, trying alternative methods');
    }

    // If we get here, the global references didn't work
    // Let's try to find the editor instance another way
    try {
        // Monaco might be available in the window object
        if (window.monaco && window.monaco.editor) {
            const editors = window.monaco.editor.getEditors();
            if (editors && editors.length > 0) {
                const editor = editors[0]; // Get the first editor
                const model = editor.getModel();

                if (editor && model) {
                    const fullRange = model.getFullModelRange();
                    editor.executeEdits('transformation', [
                        {
                            range: fullRange,
                            text: newContent,
                            forceMoveMarkers: true
                        }
                    ]);
                    console.log('[TextEditor] Transformation applied via monaco.editor.getEditors()');
                    return true;
                }
            }
        }
    } catch (error) {
        console.error('[TextEditor] Error applying transformation via monaco.editor.getEditors():', error);
    }

    console.error('[TextEditor] All transformation methods failed');
    return false;
};

const TextEditor = ({
    content,
    onChange,
    filePath,
    settings = {}
}) => {
    // Reference to the Monaco editor instance
    const editorRef = useRef(null);
    // Reference to the Monaco editor model
    const modelRef = useRef(null);
    const handleEditorBeforeMount = (monaco) => {
        // Configure Monaco before mounting

        // Custom dark theme
        monaco.editor.defineTheme('custom-dark', {
            base: 'vs-dark',
            inherit: true,
            rules: [],
            colors: {}
        });

        // Cyberpunk theme - now matches Cyberpunk Turbo
        monaco.editor.defineTheme('cyberpunk', {
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

    // Handle editor mount
    const handleEditorDidMount = (editor, monaco) => {
        console.log('[TextEditor] Editor mounted for file:', filePath || 'new tab');
        console.log('[TextEditor] Initial content length:', content ? content.length : 0);

        // Store Monaco in window for global access
        window.monaco = monaco;

        // Set local references
        editorRef.current = editor;
        modelRef.current = editor.getModel();

        // Set global references
        activeEditorRef = editor;
        activeModelRef = editor.getModel();
        console.log('[TextEditor] Global editor references set');

        // Test if we can get the content from the model
        try {
            const modelContent = editor.getModel().getValue();
            console.log('[TextEditor] Model content length:', modelContent ? modelContent.length : 0);

            // Test if we can apply a transformation
            const testContent = modelContent;
            const success = window.applyEditorTransformation(testContent);
            console.log('[TextEditor] Test transformation result:', success ? 'success' : 'failed');
        } catch (error) {
            console.error('[TextEditor] Error in editor mount tests:', error);
        }
    };

    // Listen for undo/redo events from the main process
    useEffect(() => {
        if (!window.electron) return;

        const { ipcRenderer } = window.electron;

        // Handle undo event
        const handleUndo = () => {
            if (editorRef.current) {
                editorRef.current.trigger('keyboard', 'undo', null);
            }
        };

        // Handle redo event
        const handleRedo = () => {
            if (editorRef.current) {
                editorRef.current.trigger('keyboard', 'redo', null);
            }
        };

        // Register event listeners
        const cleanupUndo = registerIpcEvent(ipcRenderer, 'menu-undo', handleUndo);
        const cleanupRedo = registerIpcEvent(ipcRenderer, 'menu-redo', handleRedo);

        // Clean up event listeners
        return () => {
            cleanupUndo();
            cleanupRedo();
        };
    }, []);

    // We're now using the global applyEditorTransformation function instead of local methods

    return (
        <EditorContainer>
            <Editor
                height="100%"
                width="100%"
                defaultLanguage="plaintext"
                value={content}
                onChange={onChange}
                beforeMount={handleEditorBeforeMount}
                onMount={handleEditorDidMount}
                options={getEditorOptions()}
                theme={getMonacoTheme(settings.theme)}
                loading={<div>Loading editor...</div>}
            />
        </EditorContainer>
    );
};

export default TextEditor;
