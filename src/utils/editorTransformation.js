import { logInfo, logError, logWarning } from './logger';

// References to the active editor and model
let activeEditorRef = null;
let activeModelRef = null;

/**
 * Set the active editor and model references
 * @param {object} editor - Monaco editor instance
 * @param {object} model - Monaco editor model
 */
export const setActiveEditorReferences = (editor, model) => {
    activeEditorRef = editor;
    activeModelRef = model;
    logInfo('EditorTransformation', 'Global editor references set');
};

/**
 * Apply a transformation to the editor content
 * @param {string} newContent - The new content to set
 * @returns {boolean} Success status
 */
export const applyEditorTransformation = (newContent) => {
    logInfo('EditorTransformation', 'Global applyEditorTransformation called');

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
            logInfo('EditorTransformation', 'Global transformation applied successfully');
            return true;
        } catch (error) {
            logError('EditorTransformation', `Error applying global transformation: ${error.message}`);
            logError('EditorTransformation', `Stack trace: ${error.stack}`);
            // Continue to try other methods
        }
    } else {
        logWarning('EditorTransformation', 'Global editor or model reference is null, trying alternative methods');
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
                    logInfo('EditorTransformation', 'Transformation applied via monaco.editor.getEditors()');
                    return true;
                }
            }
        }
    } catch (error) {
        logError('EditorTransformation', `Error applying transformation via monaco.editor.getEditors(): ${error.message}`);
    }

    logError('EditorTransformation', 'All transformation methods failed');
    return false;
};

// Export a function to initialize the global transformation function
export const initializeEditorTransformation = () => {
    // Set the global function
    window.applyEditorTransformation = applyEditorTransformation;
};
