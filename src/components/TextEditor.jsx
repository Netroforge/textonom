import React, { useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import styled from 'styled-components';
import { registerIpcEvent } from '../utils/eventManager';
import { getMonacoTheme, defineMonacoThemes } from '../styles/monacoThemes';
import { setActiveEditorReferences, initializeEditorTransformation } from '../utils/editorTransformation';
import { logInfo, logError } from '../utils/logger';

const EditorContainer = styled.div`
  height: 100%;
  width: 100%;
  position: relative;
`;

// Initialize the global transformation function
initializeEditorTransformation();

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
        // Configure Monaco themes before mounting
        defineMonacoThemes(monaco);
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
        logInfo('TextEditor', `Editor mounted for file: ${filePath || 'new tab'}`);
        logInfo('TextEditor', `Initial content length: ${content ? content.length : 0}`);

        // Store Monaco in window for global access
        window.monaco = monaco;

        // Set local references
        editorRef.current = editor;
        modelRef.current = editor.getModel();

        // Set global references for the transformation utility
        setActiveEditorReferences(editor, editor.getModel());

        // Test if we can get the content from the model
        try {
            const modelContent = editor.getModel().getValue();
            logInfo('TextEditor', `Model content length: ${modelContent ? modelContent.length : 0}`);

            // Test if we can apply a transformation
            const testContent = modelContent;
            const success = window.applyEditorTransformation(testContent);
            logInfo('TextEditor', `Test transformation result: ${success ? 'success' : 'failed'}`);
        } catch (error) {
            logError('TextEditor', `Error in editor mount tests: ${error.message}`);
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
