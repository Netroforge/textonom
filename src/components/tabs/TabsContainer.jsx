import React, { useEffect, useState } from 'react';
import { registerIpcEvent, registerWindowEvent } from '../../utils/eventManager';
import TextEditor from '../TextEditor';
import useTransformationStore from '../../stores/transformationStore';
import { TabsWrapper, TabContent } from './TabStyles';
import TabHeader from './TabHeader';
import { logInfo, logError } from '../../utils/logger';

const TabsContainer = ({ settings, onOpenFile, onSaveFile }) => {
    const [tabs, setTabs] = useState([]);
    const [activeTabIndex, setActiveTabIndex] = useState(0);

    // Get transformation store actions
    const setActiveTabContent = useTransformationStore(state => state.setActiveTabContent);
    const setTransformationTabIndex = useTransformationStore(state => state.setActiveTabIndex);

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
                .then(result => logInfo('TabsContainer', `Tabs state saved successfully: ${result}`))
                .catch(error => logError('TabsContainer', `Failed to save tabs state: ${error.message}`));
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
                // Update transformation context
                setTransformationTabIndex(existingTabIndex);

                // Update content if it has changed
                if (tabs[existingTabIndex].content !== content) {
                    updateTabContent(existingTabIndex, content);
                    setActiveTabContent(content || '');
                } else {
                    setActiveTabContent(tabs[existingTabIndex].content || '');
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
                const newTabIndex = tabs.length;
                setActiveTabIndex(newTabIndex);

                // Update transformation context for the new tab
                setTransformationTabIndex(newTabIndex);
                setActiveTabContent(content || '');
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
        const newTabIndex = tabs.length;
        setActiveTabIndex(newTabIndex);

        // Update transformation context for the new tab
        setTransformationTabIndex(newTabIndex);
        setActiveTabContent(newTab.content || '');

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
            activeTabIndex: newTabIndex // This will be the index of the new tab
        };

        ipcRenderer.invoke('save-tabs-state', tabsState)
            .then(result => logInfo('TabsContainer', `Tabs state saved successfully after adding new tab: ${result}`))
            .catch(error => logError('TabsContainer', `Failed to save tabs state after adding new tab: ${error.message}`));
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

            // Update transformation context for the new tab
            setTransformationTabIndex(0);
            setActiveTabContent(newTab.content || '');

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
                .then(result => logInfo('TabsContainer', `Tabs state saved successfully after closing last tab: ${result}`))
                .catch(error => logError('TabsContainer', `Failed to save tabs state after closing last tab: ${error.message}`));

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

            // Update transformation context for the new active tab
            if (newTabs[newActiveIndex]) {
                setTransformationTabIndex(newActiveIndex);
                setActiveTabContent(newTabs[newActiveIndex].content || '');
            }
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
            .then(result => logInfo('TabsContainer', `Tabs state saved successfully after closing tab: ${result}`))
            .catch(error => logError('TabsContainer', `Failed to save tabs state after closing tab: ${error.message}`));
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

    // Handle tab content change
    const handleTabContentChange = (value) => {
        if (activeTabIndex >= 0 && activeTabIndex < tabs.length) {
            updateTabContent(activeTabIndex, value);
            
            // Update transformation context
            setActiveTabContent(value || '');
        }
    };

    // Load tabs from saved state
    const loadTabsFromState = async (tabsState) => {
        if (tabsState && tabsState.tabs && tabsState.tabs.length > 0) {
            logInfo('TabsContainer', 'Loading tabs state');
            
            // Process the tabs to load content for files
            const validTabs = [];
            
            for (const tab of tabsState.tabs) {
                // If it's a file, load the content from disk
                if (tab.filePath) {
                    try {
                        const content = await window.electron.ipcRenderer.invoke('get-file-content', tab.filePath);
                        if (content !== null) {
                            validTabs.push({
                                ...tab,
                                content
                            });
                        } else {
                            logError('TabsContainer', `Failed to load content for file: ${tab.filePath}`);
                        }
                    } catch (error) {
                        logError('TabsContainer', `Error loading file content: ${error.message}`);
                    }
                } else {
                    // For unsaved tabs, use the saved content
                    validTabs.push(tab);
                }
            }
            
            if (validTabs.length > 0) {
                // Set the loaded tabs
                logInfo('TabsContainer', 'Setting tabs state with loaded tabs');
                setTabs(validTabs);
                
                // Set active tab index, ensuring it's valid
                const newActiveIndex = Math.min(tabsState.activeTabIndex || 0, validTabs.length - 1);
                logInfo('TabsContainer', `Setting active tab index to: ${newActiveIndex}`);
                setActiveTabIndex(newActiveIndex);
                
                // We don't need to update the transformation context here anymore
                // It will be handled by the dedicated effect that watches tabs and activeTabIndex
                logInfo('TabsContainer', 'Transformation context will be updated by the tabs/activeTabIndex effect');
                
                return true;
            }
        }
        logInfo('TabsContainer', 'No valid tabs to load');
        return false;
    };

    // Listen for tab-modified events from the editor
    useEffect(() => {
        const handleTabModified = (event) => {
            const { tabIndex } = event.detail;
            if (tabIndex >= 0 && tabIndex < tabs.length) {
                updateTabModifiedStatus(tabIndex, true);
            }
        };
        
        // Register window event listener
        const cleanup = registerWindowEvent('tab-modified', handleTabModified);
        
        // Clean up event listener
        return cleanup;
    }, [tabs]);

    // Update transformation context when tabs or active tab changes
    useEffect(() => {
        if (tabs.length > 0 && activeTabIndex >= 0 && activeTabIndex < tabs.length) {
            logInfo('TabsContainer', 'Updating transformation context');
            logInfo('TabsContainer', `Tab content length: ${tabs[activeTabIndex].content ? tabs[activeTabIndex].content.length : 0}`);
            
            // Update transformation context
            setTransformationTabIndex(activeTabIndex);
            setActiveTabContent(tabs[activeTabIndex].content || '');
            logInfo('TabsContainer', 'Transformation context updated');
        } else {
            logInfo('TabsContainer', 'Not updating transformation context - conditions not met');
        }
    }, [tabs, activeTabIndex]);

    // Create a new tab if there are no tabs
    useEffect(() => {
        if (tabs.length === 0) {
            addNewTab();
        }
    }, []);

    return (
        <TabsWrapper>
            <TabHeader 
                tabs={tabs}
                activeTabIndex={activeTabIndex}
                theme={settings.theme}
                onTabClick={switchToTab}
                onTabClose={closeTab}
                onNewTab={addNewTab}
            />
            <TabContent>
                {tabs.length > 0 && activeTabIndex >= 0 && activeTabIndex < tabs.length && (
                    <TextEditor
                        content={tabs[activeTabIndex].content}
                        onChange={handleTabContentChange}
                        filePath={tabs[activeTabIndex].filePath}
                        settings={settings}
                    />
                )}
            </TabContent>
        </TabsWrapper>
    );
};

export default TabsContainer;
