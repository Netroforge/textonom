import { create } from 'zustand';
import { applyTransformation } from '../utils/transformations';
import { logInfo, logError } from '../utils/logger';

// Reference the type definition file
/// <reference path="../types/electron.d.ts" />

// Check if we're in a browser environment and if electron is available
const isElectronAvailable = () => {
    return typeof window !== 'undefined' && window.electron && window.electron.ipcRenderer;
};

// Create a store for transformation state
const useTransformationStore = create((set, get) => ({
    // State
    activeTabContent: '',
    activeTabIndex: 0,

    // Actions
    setActiveTabContent: (content) => set({ activeTabContent: content || '' }),
    setActiveTabIndex: (index) => set({ activeTabIndex: index }),

    // Apply transformation
    applyTransformation: (transformType) => {
        const { activeTabContent, activeTabIndex } = get();

        logInfo('TransformationStore', `Transform requested: ${transformType}`);
        logInfo('TransformationStore', `Active tab content available: ${!!activeTabContent}`);
        logInfo('TransformationStore', `Active tab content length: ${activeTabContent ? activeTabContent.length : 0}`);
        logInfo('TransformationStore', `Active tab index: ${activeTabIndex}`);

        if (!activeTabContent) {
            logError('TransformationStore', 'No active tab content available for transformation');
            return false;
        }

        try {
            // Apply the transformation using the utility function
            const transformedContent = applyTransformation(activeTabContent, transformType);
            logInfo('TransformationStore', `Transformation applied successfully, result length: ${transformedContent.length}`);

            // Apply the transformation directly to the editor
            if (window.applyEditorTransformation) {
                logInfo('TransformationStore', 'Calling global applyEditorTransformation');
                const success = window.applyEditorTransformation(transformedContent);
                if (success) {
                    logInfo('TransformationStore', 'Global transformation successful');
                    // Mark the tab as modified
                    window.dispatchEvent(new CustomEvent('tab-modified', {
                        detail: {
                            tabIndex: activeTabIndex
                        }
                    }));
                    return true;
                } else {
                    logError('TransformationStore', 'Global transformation failed');
                }
            } else {
                logError('TransformationStore', 'Global applyEditorTransformation not available');
            }
            return false;
        } catch (error) {
            logError('TransformationStore', `Error during transformation: ${error.message}`);
            logError('TransformationStore', `Stack trace: ${error.stack}`);

            // Show error message if electron is available
            if (isElectronAvailable()) {
                window.electron.ipcRenderer.invoke('show-error', {
                    title: 'Transformation Error',
                    message: `Failed to apply ${transformType} transformation: ${error.message}`
                });
            }
            return false;
        }
    }
}));

export default useTransformationStore;
