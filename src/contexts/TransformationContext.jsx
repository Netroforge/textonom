import React, {createContext, useContext, useEffect, useState} from 'react';
import {registerIpcEvent} from '../utils/eventManager';
import {applyTransformation} from '../utils/transformations';

// Create context
const TransformationContext = createContext();

// Provider component
export const TransformationProvider = ({children}) => {
    const [activeTabContent, setActiveTabContent] = useState('');
    const [activeTabIndex, setActiveTabIndex] = useState(0);

    // Listen for transformation events from the main process
    useEffect(() => {
        const {ipcRenderer} = window.electron;

        const handleTransform = (event, transformType) => {
            console.log(`TransformationContext received transform event with type: ${transformType}`);

            if (!activeTabContent) {
                console.log('No content to transform');
                return;
            }

            try {
                // Apply the transformation using the utility function
                const transformedContent = applyTransformation(activeTabContent, transformType);

                // Notify subscribers about the transformation result
                window.dispatchEvent(new CustomEvent('transformation-result', {
                    detail: {
                        tabIndex: activeTabIndex,
                        content: transformedContent
                    }
                }));
            } catch (error) {
                console.error(`Error during transformation: ${error.message}`);

                // Show error message
                ipcRenderer.invoke('show-error', {
                    title: 'Transformation Error',
                    message: `Failed to apply ${transformType} transformation: ${error.message}`
                });
            }
        };

        // Register event listener using the event manager
        const cleanup = registerIpcEvent(ipcRenderer, 'transform', handleTransform);

        // Clean up event listener
        return cleanup;
    }, [activeTabContent, activeTabIndex]);

    // Context value
    const value = {
        setActiveTabContent,
        setActiveTabIndex
    };

    return (
        <TransformationContext.Provider value={value}>
            {children}
        </TransformationContext.Provider>
    );
};

// Custom hook for using the transformation context
export const useTransformation = () => {
    const context = useContext(TransformationContext);

    if (!context) {
        throw new Error('useTransformation must be used within a TransformationProvider');
    }

    return context;
};

export default TransformationContext;
