import React from 'react'
import styled from 'styled-components'
import { useStore } from '../store/useStore'
import { FiPlus, FiX } from 'react-icons/fi'
import { themes } from '../styles/themes'

const TabBarContainer = styled.div`
  display: flex;
  background-color: ${({ theme }) => themes[theme].secondary};
  border-bottom: 1px solid ${({ theme }) => themes[theme].border};
  overflow-x: auto;
  height: 40px;
`

const Tab = styled.div<{ active: boolean; theme: string }>`
  display: flex;
  align-items: center;
  padding: 0 15px;
  height: 100%;
  min-width: 120px;
  max-width: 200px;
  background-color: ${({ active, theme }) => active ? themes[theme].background : themes[theme].secondary};
  color: ${({ active, theme }) => active ? themes[theme].primary : themes[theme].foreground};
  border-right: 1px solid ${({ theme }) => themes[theme].border};
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  position: relative;

  &:hover {
    background-color: ${({ active, theme }) => active ? themes[theme].background : themes[theme].border};
  }
`

const TabTitle = styled.span`
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
`

const TabModified = styled.span`
  margin-left: 5px;
  color: ${({ theme }) => themes[theme].accent};
`

const CloseButton = styled.button`
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  margin-left: 5px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: ${({ theme }) => themes[theme].error};
  }
`

const NewTabButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => themes[theme].foreground};
  cursor: pointer;
  padding: 0 15px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: ${({ theme }) => themes[theme].primary};
  }
`

interface TabBarProps {
  theme: string;
}

const TabBar: React.FC<TabBarProps> = ({ theme }) => {
  const { tabs, activeTabId, setActiveTab, closeTab, addTab } = useStore()

  const handleNewTab = (): void => {
    addTab({
      title: 'Untitled',
      content: ''
    })
  }

  return (
    <TabBarContainer theme={theme}>
      {tabs.map((tab) => (
        <Tab
          key={tab.id}
          active={tab.id === activeTabId}
          theme={theme}
          onClick={() => setActiveTab(tab.id)}
        >
          <TabTitle>{tab.title}</TabTitle>
          {tab.isModified && <TabModified theme={theme}>●</TabModified>}
          <CloseButton
            theme={theme}
            onClick={(e) => {
              e.stopPropagation()
              closeTab(tab.id)
            }}
          >
            <FiX size={16} />
          </CloseButton>
        </Tab>
      ))}
      <NewTabButton theme={theme} onClick={handleNewTab}>
        <FiPlus size={20} />
      </NewTabButton>
    </TabBarContainer>
  )
}

export default TabBar
