import { create } from 'zustand';
import { applyTransformation } from '../utils/transformations';

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
        
        console.log('[TransformationStore] Transform requested:', transformType);
        console.log('[TransformationStore] Active tab content available:', !!activeTabContent);
        console.log('[TransformationStore] Active tab content length:', activeTabContent ? activeTabContent.length : 0);
        console.log('[TransformationStore] Active tab index:', activeTabIndex);
        
        if (!activeTabContent) {
            console.error('[TransformationStore] No active tab content available for transformation');
            return false;
        }
        
        try {
            // Apply the transformation using the utility function
            const transformedContent = applyTransformation(activeTabContent, transformType);
            console.log('[TransformationStore] Transformation applied successfully, result length:', transformedContent.length);
            
            // Apply the transformation directly to the editor
            if (window.applyEditorTransformation) {
                console.log('[TransformationStore] Calling global applyEditorTransformation');
                const success = window.applyEditorTransformation(transformedContent);
                if (success) {
                    console.log('[TransformationStore] Global transformation successful');
                    // Mark the tab as modified
                    window.dispatchEvent(new CustomEvent('tab-modified', {
                        detail: {
                            tabIndex: activeTabIndex
                        }
                    }));
                    return true;
                } else {
                    console.error('[TransformationStore] Global transformation failed');
                }
            } else {
                console.error('[TransformationStore] Global applyEditorTransformation not available');
            }
            return false;
        } catch (error) {
            console.error(`[TransformationStore] Error during transformation: ${error.message}`);
            console.error('Stack trace:', error.stack);
            
            // Show error message if electron is available
            if (window.electron && window.electron.ipcRenderer) {
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
