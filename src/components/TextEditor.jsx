import React, {useEffect, useRef} from 'react';
import Editor from '@monaco-editor/react';
import styled from 'styled-components';
import {registerIpcEvent} from '../utils/eventManager';

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

        // Cyberpunk theme
        monaco.editor.defineTheme('cyberpunk', {
            base: 'vs-dark',
            inherit: true,
            rules: [
                {token: 'comment', foreground: '#6272a4'},
                {token: 'string', foreground: '#ff79c6'},
                {token: 'keyword', foreground: '#ff00ff'},
                {token: 'number', foreground: '#bd93f9'},
                {token: 'operator', foreground: '#00ffff'}
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
                {token: 'comment', foreground: '#6272a4'},
                {token: 'string', foreground: '#ff55cc'},
                {token: 'keyword', foreground: '#ff00aa'},
                {token: 'number', foreground: '#bd93f9'},
                {token: 'operator', foreground: '#00ffee'}
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
        minimap: {enabled: true},
        scrollBeyondLastLine: false,
        automaticLayout: true
    });

    // Handle editor mount
    const handleEditorDidMount = (editor, monaco) => {
        console.log('Editor mounted');
        editorRef.current = editor;
        modelRef.current = editor.getModel();
    };

    // Listen for undo/redo events from the main process
    useEffect(() => {
        if (!window.electron) return;

        const {ipcRenderer} = window.electron;

        // Handle undo event
        const handleUndo = () => {
            if (editorRef.current) {
                console.log('Executing undo command');
                editorRef.current.trigger('keyboard', 'undo', null);
            }
        };

        // Handle redo event
        const handleRedo = () => {
            if (editorRef.current) {
                console.log('Executing redo command');
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

    // Method to apply text transformation while preserving undo history
    const applyTransformation = (newContent) => {
        if (!editorRef.current || !modelRef.current) return;

        // Create an edit operation that replaces the entire content
        // This will be added to the undo stack as a single operation
        editorRef.current.executeEdits('transformation', [
            {
                range: modelRef.current.getFullModelRange(),
                text: newContent,
                forceMoveMarkers: true
            }
        ]);
    };

    // Listen for transformation results
    useEffect(() => {
        const handleTransformationResult = (event) => {
            const {content: newContent} = event.detail;

            if (newContent && editorRef.current) {
                console.log('Applying transformation with undo preservation');
                applyTransformation(newContent);
            }
        };

        // Add event listener
        window.addEventListener('transformation-result', handleTransformationResult);

        // Clean up
        return () => {
            window.removeEventListener('transformation-result', handleTransformationResult);
        };
    }, []);

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
