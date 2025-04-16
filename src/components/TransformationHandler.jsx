import { useEffect } from 'react';
import { registerIpcEvent } from '../utils/eventManager';
import useTransformationStore from '../stores/transformationStore';

/**
 * Component that handles transformation events from the main process
 * This component doesn't render anything, it just sets up event listeners
 */
const TransformationHandler = () => {
    // Get the applyTransformation function from the store
    const applyTransformation = useTransformationStore(state => state.applyTransformation);
    
    // Listen for transformation events from the main process
    useEffect(() => {
        const { ipcRenderer } = window.electron;
        
        const handleTransform = (event, transformType) => {
            console.log('[TransformationHandler] Transform event received:', transformType);
            applyTransformation(transformType);
        };
        
        // Register event listener using the event manager
        const cleanup = registerIpcEvent(ipcRenderer, 'transform', handleTransform);
        
        // Clean up event listener
        return cleanup;
    }, [applyTransformation]);
    
    // This component doesn't render anything
    return null;
};

export default TransformationHandler;
