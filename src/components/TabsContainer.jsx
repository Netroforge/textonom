import React, { useEffect, useState } from 'react';
import { useTransformation } from '../contexts/TransformationContext';
import { registerIpcEvent, registerWindowEvent } from '../utils/eventManager';
import styled from 'styled-components';
import { FiPlus, FiX } from 'react-icons/fi';
import TextEditor from './TextEditor';
import { getTextGlow, CyberpunkColors } from '../styles/themes';

const TabsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
`;

const TabsHeader = styled.div`
  display: flex;
  background-color: ${props => {
        if (props.theme === 'cyberpunk-turbo') {
            return CyberpunkColors.darkBlue;
        }
        return props.theme === 'dark' ? '#1e1e1e' : '#f0f0f0';
    }};
  border-bottom: 1px solid ${props => {
        if (props.theme === 'cyberpunk-turbo') {
            return CyberpunkColors.borderColor;
        }
        return props.theme === 'dark' ? '#333' : '#ddd';
    }};
  position: relative; /* For absolute positioning of the new tab button */

  /* Add subtle glow to the bottom border for cyberpunk-turbo theme */
  ${props => props.theme === 'cyberpunk-turbo' ? `
    box-shadow: 0 1px 5px ${CyberpunkColors.cyanRGBA(0.2)};
  ` : ''}
`;

const TabsScroller = styled.div`
  display: flex;
  overflow-x: auto;
  flex-grow: 1;
  &::-webkit-scrollbar {
    height: 5px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme === 'dark' ? '#555' : '#ccc'};
    border-radius: 5px;
  }
`;

const Tab = styled.div`
  padding: 8px 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  background-color: ${props => {
        if (props.theme === 'cyberpunk-turbo') {
            return props.active ? CyberpunkColors.mediumBlue : CyberpunkColors.darkBlue;
        }
        return props.active
            ? (props.theme === 'dark' ? '#2d2d2d' : '#fff')
            : (props.theme === 'dark' ? '#1e1e1e' : '#f0f0f0');
    }};
  color: ${props => {
        if (props.theme === 'cyberpunk-turbo') {
            return props.active ? CyberpunkColors.cyan : CyberpunkColors.lightText;
        }
        return props.active
            ? (props.theme === 'dark' ? '#fff' : '#000')
            : (props.theme === 'dark' ? '#ccc' : '#666');
    }};
  border-right: 1px solid ${props => {
        if (props.theme === 'cyberpunk-turbo') {
            return props.active ? CyberpunkColors.cyan : CyberpunkColors.borderColor;
        }
        return props.theme === 'dark' ? '#333' : '#ddd';
    }};
  min-width: 10%;
  max-width: 20%;
  position: relative;
  transition: all 0.2s ease;

  /* Apply glow effect for cyberpunk-turbo theme */
  ${props => props.theme === 'cyberpunk-turbo' && props.active ? `
    ${getTextGlow(CyberpunkColors.cyanRGBA(), 1)}
    border-bottom: 2px solid ${CyberpunkColors.cyan};
  ` : ''}

  &:hover {
    background-color: ${props => {
        if (props.theme === 'cyberpunk-turbo') {
            return CyberpunkColors.mediumBlue;
        }
        return props.theme === 'dark' ? '#3a3a3a' : '#f9f9f9';
    }};
    ${props => props.theme === 'cyberpunk-turbo' && !props.active ? `
      ${getTextGlow(CyberpunkColors.cyanRGBA(), 0.5)}
    ` : ''}
  }
`;

const TabTitle = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
`;

const CloseButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  width: 1.5em;
  height: 1.5em;

  &:hover {
    background-color: ${props => props.theme === 'dark' ? '#555' : '#ddd'};
  }
`;

const NewTabButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 12px;
  cursor: pointer;
  color: ${props => {
        if (props.theme === 'cyberpunk-turbo') {
            return CyberpunkColors.cyan;
        }
        return props.theme === 'dark' ? '#ccc' : '#666';
    }};
  position: sticky;
  right: 0;
  top: 0;
  background-color: ${props => {
        if (props.theme === 'cyberpunk-turbo') {
            return CyberpunkColors.darkBlue;
        }
        return props.theme === 'dark' ? '#1e1e1e' : '#f0f0f0';
    }};
  border-left: 1px solid ${props => {
        if (props.theme === 'cyberpunk-turbo') {
            return CyberpunkColors.borderColor;
        }
        return props.theme === 'dark' ? '#333' : '#ddd';
    }};
  z-index: 10;
  box-shadow: ${props => {
        if (props.theme === 'cyberpunk-turbo') {
            return `-5px 0 10px rgba(0, 0, 30, 0.5), 0 0 5px ${CyberpunkColors.cyanRGBA(0.2)}`;
        }
        return props.theme === 'dark' ? '-5px 0 10px rgba(0, 0, 0, 0.3)' : '-5px 0 10px rgba(0, 0, 0, 0.1)';
    }};
  height: 100%;
  transition: all 0.2s ease;

  /* Apply glow effect for cyberpunk-turbo theme */
  ${props => props.theme === 'cyberpunk-turbo' ? `
    ${getTextGlow(CyberpunkColors.cyanRGBA(), 0.8)}
  ` : ''}

  &:hover {
    background-color: ${props => {
        if (props.theme === 'cyberpunk-turbo') {
            return CyberpunkColors.mediumBlue;
        }
        return props.theme === 'dark' ? '#3a3a3a' : '#f9f9f9';
    }};
    ${props => props.theme === 'cyberpunk-turbo' ? `
      ${getTextGlow(CyberpunkColors.cyanRGBA(), 1)}
    ` : ''}
  }
`;

const TabContent = styled.div`
  flex: 1;
  overflow: hidden;
  position: relative;
`;

const TabsContainer = ({ settings, onOpenFile, onSaveFile }) => {
    const [tabs, setTabs] = useState([]);
    const [activeTabIndex, setActiveTabIndex] = useState(0);

    // Get transformation context
    const { setActiveTabContent, setActiveTabIndex: setTransformationTabIndex } = useTransformation();

    // Save tabs state whenever tabs or active tab changes
    useEffect(() => {
        // Only save if we have tabs (avoid saving empty state during initialization)
        if (tabs.length > 0) {
            const { ipcRenderer } = window.electron;

            // Create a tabs state object to save
            // For files with paths, we don't need to save the content as it can be loaded from disk
            // For unsaved files, we need to save the content
            const tabsToSave = tabs.map(tab => ({
                id: tab.id,
                title: tab.title,
                filePath: tab.filePath,
                // Only save content for unsaved files
                content: tab.filePath ? undefined : tab.content,
                isModified: tab.isModified
            }));

            const tabsState = {
                tabs: tabsToSave,
                activeTabIndex
            };

            // Save tabs state to main process
            ipcRenderer.invoke('save-tabs-state', tabsState)
                .then(result => console.log('TabsContainer: Tabs state saved successfully:', result))
                .catch(error => console.error('Failed to save tabs state:', error));
        }
    }, [tabs, activeTabIndex]);

    // Listen for IPC events from the main process
    useEffect(() => {
        const { ipcRenderer } = window.electron;

        // Handle file open event
        const handleFileOpened = async (event, { filePath, content }) => {
            // Check if the file is already open
            const existingTabIndex = tabs.findIndex(tab => tab.filePath === filePath);

            if (existingTabIndex !== -1) {
                // File is already open, switch to that tab
                setActiveTabIndex(existingTabIndex);
                // Update content if it has changed
                if (tabs[existingTabIndex].content !== content) {
                    updateTabContent(existingTabIndex, content);
                }
            } else {
                // Get the basename of the file path using the IPC handler
                const title = await window.electron.ipcRenderer.invoke('path-basename', filePath);

                // Add new tab for the opened file
                const newTab = {
                    id: Date.now(),
                    title,
                    filePath,
                    content,
                    isModified: false
                };

                setTabs([...tabs, newTab]);
                setActiveTabIndex(tabs.length);
            }
        };

        // Handle new tab event
        const handleNewTab = () => {
            addNewTab();
        };

        // Handle save event
        const handleSave = async () => {
            if (tabs.length === 0) return;

            const currentTab = tabs[activeTabIndex];

            if (currentTab.filePath) {
                // Save to existing file
                const success = await ipcRenderer.invoke('save-file', {
                    filePath: currentTab.filePath,
                    content: currentTab.content
                });

                if (success) {
                    updateTabModifiedStatus(activeTabIndex, false);
                }
            } else {
                // Save as new file
                handleSaveAs();
            }
        };

        // Handle save as event
        const handleSaveAs = async () => {
            if (tabs.length === 0) return;

            const currentTab = tabs[activeTabIndex];
            const filePath = await ipcRenderer.invoke('save-file-as', {
                content: currentTab.content,
                filePath: currentTab.filePath
            });

            if (filePath) {
                // Get the basename of the file path using the IPC handler
                const title = await window.electron.ipcRenderer.invoke('path-basename', filePath);

                updateTab(activeTabIndex, {
                    title,
                    filePath,
                    isModified: false
                });
            }
        };

        // Handle load tabs state event
        const handleLoadTabsState = async (event, tabsState) => {
            return await loadTabsFromState(tabsState);
        };

        // Register event listeners using the event manager
        const cleanupFileOpened = registerIpcEvent(ipcRenderer, 'file-opened', handleFileOpened);
        const cleanupNewTab = registerIpcEvent(ipcRenderer, 'menu-new-tab', handleNewTab);
        const cleanupSave = registerIpcEvent(ipcRenderer, 'menu-save', handleSave);
        const cleanupSaveAs = registerIpcEvent(ipcRenderer, 'menu-save-as', handleSaveAs);
        const cleanupLoadTabsState = registerIpcEvent(ipcRenderer, 'load-tabs-state', handleLoadTabsState);

        // Clean up event listeners
        return () => {
            cleanupFileOpened();
            cleanupNewTab();
            cleanupSave();
            cleanupSaveAs();
            cleanupLoadTabsState();
        };
    }, [tabs, activeTabIndex]);

    // Add a new empty tab
    const addNewTab = () => {
        const newTab = {
            id: Date.now(),
            title: 'Untitled',
            filePath: null,
            content: '',
            isModified: false
        };

        const newTabs = [...tabs, newTab];
        setTabs(newTabs);
        setActiveTabIndex(tabs.length);

        // Explicitly save the tabs state when adding a new tab
        const { ipcRenderer } = window.electron;
        const tabsToSave = newTabs.map(tab => ({
            id: tab.id,
            title: tab.title,
            filePath: tab.filePath,
            // Only save content for unsaved files
            content: tab.filePath ? undefined : tab.content,
            isModified: tab.isModified
        }));

        const tabsState = {
            tabs: tabsToSave,
            activeTabIndex: tabs.length // This will be the index of the new tab
        };

        ipcRenderer.invoke('save-tabs-state', tabsState)
            .then(result => console.log('TabsContainer: Tabs state saved successfully after adding new tab:', result))
            .catch(error => console.error('Failed to save tabs state after adding new tab:', error));
    };

    // Close a tab
    const closeTab = (index, event) => {
        event.stopPropagation();

        // If it's the last tab, add a new empty one
        if (tabs.length === 1) {
            const newTab = {
                id: Date.now(),
                title: 'Untitled',
                filePath: null,
                content: '',
                isModified: false
            };
            setTabs([newTab]);
            setActiveTabIndex(0);

            // Explicitly save the tabs state when replacing with a new tab
            const { ipcRenderer } = window.electron;
            const tabsState = {
                tabs: [{
                    id: newTab.id,
                    title: newTab.title,
                    filePath: newTab.filePath,
                    content: newTab.content,
                    isModified: newTab.isModified
                }],
                activeTabIndex: 0
            };

            ipcRenderer.invoke('save-tabs-state', tabsState)
                .then(result => console.log('TabsContainer: Tabs state saved successfully after closing last tab:', result))
                .catch(error => console.error('Failed to save tabs state after closing last tab:', error));

            return;
        }

        // Remove the tab
        const newTabs = [...tabs];
        newTabs.splice(index, 1);
        setTabs(newTabs);

        // Adjust active tab index
        let newActiveIndex = activeTabIndex;
        if (index === activeTabIndex) {
            // If we closed the active tab, activate the previous one or the next one
            newActiveIndex = Math.min(index, newTabs.length - 1);
            setActiveTabIndex(newActiveIndex);
        } else if (index < activeTabIndex) {
            // If we closed a tab before the active one, adjust the index
            newActiveIndex = activeTabIndex - 1;
            setActiveTabIndex(newActiveIndex);
        }

        // Explicitly save the tabs state when closing a tab
        const { ipcRenderer } = window.electron;
        const tabsToSave = newTabs.map(tab => ({
            id: tab.id,
            title: tab.title,
            filePath: tab.filePath,
            // Only save content for unsaved files
            content: tab.filePath ? undefined : tab.content,
            isModified: tab.isModified
        }));

        const tabsState = {
            tabs: tabsToSave,
            activeTabIndex: newActiveIndex
        };

        ipcRenderer.invoke('save-tabs-state', tabsState)
            .then(result => console.log('TabsContainer: Tabs state saved successfully after closing tab:', result))
            .catch(error => console.error('Failed to save tabs state after closing tab:', error));
    };

    // Switch to a tab
    const switchToTab = (index) => {
        setActiveTabIndex(index);

        // Update transformation context
        if (tabs[index]) {
            setTransformationTabIndex(index);
            setActiveTabContent(tabs[index].content || '');
        }
    };

    // Update tab content
    const updateTabContent = (index, content) => {
        const newTabs = [...tabs];
        const currentContent = newTabs[index].content;
        newTabs[index] = {
            ...newTabs[index],
            content,
            // Mark as modified if it's a file and content has changed, or always for unsaved files
            isModified: newTabs[index].filePath ? (content !== currentContent) : true
        };
        setTabs(newTabs);
    };

    // Update tab properties
    const updateTab = (index, props) => {
        const newTabs = [...tabs];
        newTabs[index] = {
            ...newTabs[index],
            ...props
        };
        setTabs(newTabs);
    };

    // Update tab modified status
    const updateTabModifiedStatus = (index, isModified) => {
        const newTabs = [...tabs];
        newTabs[index] = {
            ...newTabs[index],
            isModified
        };
        setTabs(newTabs);
    };

    // Handle content change in the editor
    const handleEditorChange = (content) => {
        if (tabs.length === 0) {
            return;
        }

        const currentTab = tabs[activeTabIndex];
        // Mark as modified if it's a file and content has changed, or always for unsaved files
        const isModified = currentTab.filePath ? (content !== currentTab.content) : true;

        updateTab(activeTabIndex, {
            content,
            isModified
        });

        // Update transformation context
        setActiveTabContent(content || '');
    };

    // Listen for transformation results to update tab state
    // Note: The actual content update is now handled by the TextEditor component
    useEffect(() => {
        const handleTransformationResult = (event) => {
            const { tabIndex, content } = event.detail;

            if (tabIndex === activeTabIndex && content) {
                // Only update the modified status, not the content
                // This prevents breaking the undo history
                const currentTab = tabs[activeTabIndex];
                if (currentTab.filePath) {
                    updateTabModifiedStatus(activeTabIndex, true);
                }
            }
        };

        // Register event listener using the event manager
        const cleanup = registerWindowEvent('transformation-result', handleTransformationResult);

        // Clean up event listener
        return cleanup;
    }, [activeTabIndex, tabs]);

    // Function to load tabs from saved state
    const loadTabsFromState = async (tabsState) => {
        const { ipcRenderer } = window.electron;

        if (tabsState && tabsState.tabs && tabsState.tabs.length > 0) {
            // Load tabs from saved state
            const loadedTabs = await Promise.all(tabsState.tabs.map(async (tab) => {
                // If it's a file with a path, try to load its content from disk
                if (tab.filePath) {
                    try {
                        // Check if file exists and load its content
                        const content = await ipcRenderer.invoke('get-file-content', tab.filePath)
                            .catch(() => null);

                        if (content !== null) {
                            // File exists and was loaded successfully
                            return {
                                ...tab,
                                content,
                                isModified: false // Reset modified flag for loaded files
                            };
                        } else {
                            // File doesn't exist or couldn't be loaded
                            // Return null to filter it out later
                            return null;
                        }
                    } catch (error) {
                        return null;
                    }
                } else {
                    // It's an unsaved file, use the saved content
                    return {
                        ...tab,
                        content: tab.content || '',
                        id: tab.id || Date.now() // Ensure it has an ID
                    };
                }
            }));

            // Filter out any null tabs (files that couldn't be loaded)
            const validTabs = loadedTabs.filter(tab => tab !== null);

            if (validTabs.length > 0) {
                // Set the loaded tabs
                setTabs(validTabs);

                // Set active tab index, ensuring it's valid
                const newActiveIndex = Math.min(tabsState.activeTabIndex || 0, validTabs.length - 1);
                setActiveTabIndex(newActiveIndex);
                return true;
            }
        }
        return false;
    };

    // Initialize tabs - load saved tabs from main process
    useEffect(() => {
        // Register for the load-tabs-state event
        const handleLoadTabsState = async (event, tabsState) => {
            if (tabsState && tabsState.tabs && tabsState.tabs.length > 0) {
                try {
                    // Process the tabs state
                    const result = await loadTabsFromState(tabsState);
                    if (!result) {
                        // If loading tabs failed, create a new empty tab
                        addNewTab();
                    }
                } catch (error) {
                    console.error('Error loading tabs:', error);
                    // Fallback to creating a new tab
                    addNewTab();
                }
            } else {
                // No saved tabs, create a new empty tab
                addNewTab();
            }
        };

        const { ipcRenderer } = window.electron;
        const cleanup = registerIpcEvent(ipcRenderer, 'load-tabs-state', handleLoadTabsState);

        return () => {
            cleanup();
        };
    }, []);

    // Request tabs state from main process when component mounts
    useEffect(() => {
        const requestTabsState = async () => {
            const { ipcRenderer } = window.electron;
            try {
                const tabsState = await ipcRenderer.invoke('get-tabs-state');

                // We don't need to process the state here as it will be handled by the load-tabs-state event handler
                // Just send the event to trigger the handler
                ipcRenderer.send('load-tabs-state', tabsState);
            } catch (error) {
                console.error('Error requesting tabs state:', error);
                // Fallback to creating a new tab
                addNewTab();
            }
        };

        if (tabs.length === 0) {
            requestTabsState();
        }
    }, []);

    return (
        <TabsWrapper>
            <TabsHeader theme={settings.theme}>
                <TabsScroller theme={settings.theme}>
                    {tabs.map((tab, index) => (
                        <Tab
                            key={tab.id}
                            active={index === activeTabIndex}
                            theme={settings.theme}
                            onClick={() => switchToTab(index)}
                        >
                            <TabTitle>
                                {tab.title}{tab.isModified ? ' *' : ''}
                            </TabTitle>
                            <CloseButton
                                theme={settings.theme}
                                onClick={(e) => closeTab(index, e)}
                            >
                                <FiX size={12} />
                            </CloseButton>
                        </Tab>
                    ))}
                </TabsScroller>
                <NewTabButton
                    theme={settings.theme}
                    onClick={addNewTab}
                >
                    <FiPlus size={16} />
                </NewTabButton>
            </TabsHeader>

            <TabContent>
                {tabs.length > 0 && activeTabIndex >= 0 && activeTabIndex < tabs.length && (
                    <TextEditor
                        content={tabs[activeTabIndex].content}
                        onChange={handleEditorChange}
                        filePath={tabs[activeTabIndex].filePath}
                        settings={settings}
                    />
                )}
            </TabContent>
        </TabsWrapper>
    );
};

export default TabsContainer;
