import React, { useEffect, useState } from 'react';
import { useTransformation } from '../contexts/TransformationContext';
import { registerIpcEvent, registerWindowEvent } from '../utils/eventManager';
import styled from 'styled-components';
import { FiPlus, FiX } from 'react-icons/fi';
import TextEditor from './TextEditor';
import path from 'path';

const TabsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
`;

const TabsHeader = styled.div`
  display: flex;
  background-color: ${props => props.theme === 'dark' ? '#1e1e1e' : '#f0f0f0'};
  border-bottom: 1px solid ${props => props.theme === 'dark' ? '#333' : '#ddd'};
  overflow-x: auto;
  white-space: nowrap;
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
  background-color: ${props => props.active
        ? (props.theme === 'dark' ? '#2d2d2d' : '#fff')
        : (props.theme === 'dark' ? '#1e1e1e' : '#f0f0f0')};
  color: ${props => props.active
        ? (props.theme === 'dark' ? '#fff' : '#000')
        : (props.theme === 'dark' ? '#ccc' : '#666')};
  border-right: 1px solid ${props => props.theme === 'dark' ? '#333' : '#ddd'};
  min-width: 10%;
  max-width: 20%;
  position: relative;

  &:hover {
    background-color: ${props => props.theme === 'dark' ? '#3a3a3a' : '#f9f9f9'};
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
  padding: 8px;
  cursor: pointer;
  color: ${props => props.theme === 'dark' ? '#ccc' : '#666'};

  &:hover {
    background-color: ${props => props.theme === 'dark' ? '#3a3a3a' : '#f9f9f9'};
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

    // Listen for IPC events from the main process
    useEffect(() => {
        const { ipcRenderer } = window.electron;

        // Handle file open event
        const handleFileOpened = (event, { filePath, content }) => {
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
                // Add new tab for the opened file
                const newTab = {
                    id: Date.now(),
                    title: path.basename(filePath),
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
                updateTab(activeTabIndex, {
                    title: path.basename(filePath),
                    filePath,
                    isModified: false
                });
            }
        };

        // Register event listeners using the event manager
        const cleanupFileOpened = registerIpcEvent(ipcRenderer, 'file-opened', handleFileOpened);
        const cleanupNewTab = registerIpcEvent(ipcRenderer, 'menu-new-tab', handleNewTab);
        const cleanupSave = registerIpcEvent(ipcRenderer, 'menu-save', handleSave);
        const cleanupSaveAs = registerIpcEvent(ipcRenderer, 'menu-save-as', handleSaveAs);

        // Clean up event listeners
        return () => {
            cleanupFileOpened();
            cleanupNewTab();
            cleanupSave();
            cleanupSaveAs();
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

        setTabs([...tabs, newTab]);
        setActiveTabIndex(tabs.length);
    };

    // Close a tab
    const closeTab = (index, event) => {
        event.stopPropagation();

        // If it's the last tab, add a new empty one
        if (tabs.length === 1) {
            setTabs([{
                id: Date.now(),
                title: 'Untitled',
                filePath: null,
                content: '',
                isModified: false
            }]);
            setActiveTabIndex(0);
            return;
        }

        // Remove the tab
        const newTabs = [...tabs];
        newTabs.splice(index, 1);
        setTabs(newTabs);

        // Adjust active tab index
        if (index === activeTabIndex) {
            // If we closed the active tab, activate the previous one or the next one
            setActiveTabIndex(Math.min(index, newTabs.length - 1));
        } else if (index < activeTabIndex) {
            // If we closed a tab before the active one, adjust the index
            setActiveTabIndex(activeTabIndex - 1);
        }
    };

    // Switch to a tab
    const switchToTab = (index) => {
        console.log(`TabsContainer: Switching to tab ${index}`);
        setActiveTabIndex(index);

        // Update transformation context
        if (tabs[index]) {
            console.log(`TabsContainer: Updating transformation context with tab ${index}`);
            console.log(`TabsContainer: Tab content length: ${tabs[index].content ? tabs[index].content.length : 0}`);
            setTransformationTabIndex(index);
            setActiveTabContent(tabs[index].content || '');
        } else {
            console.log(`TabsContainer: Tab ${index} not found`);
        }
    };

    // Update tab content
    const updateTabContent = (index, content) => {
        const newTabs = [...tabs];
        newTabs[index] = {
            ...newTabs[index],
            content,
            isModified: newTabs[index].filePath !== null // Only mark as modified if it's a file
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
        console.log(`TabsContainer: Editor content changed, length: ${content ? content.length : 0}`);
        if (tabs.length === 0) {
            console.log('TabsContainer: No tabs available, ignoring content change');
            return;
        }

        const currentTab = tabs[activeTabIndex];
        const isModified = currentTab.filePath !== null && content !== currentTab.content;

        console.log(`TabsContainer: Updating tab ${activeTabIndex} with new content`);
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
            console.log('TabsContainer received transformation-result event');
            const { tabIndex, content } = event.detail;

            if (tabIndex === activeTabIndex && content) {
                console.log('Marking tab as modified after transformation');
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

    // Initialize with an empty tab if there are no tabs
    useEffect(() => {
        if (tabs.length === 0) {
            addNewTab();
        }
    }, []);

    return (
        <TabsWrapper>
            <TabsHeader theme={settings.theme}>
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
