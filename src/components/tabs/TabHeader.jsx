import React from 'react';
import { FiPlus, FiX } from 'react-icons/fi';
import { TabsHeader, TabsScroller, Tab, TabTitle, CloseButton, NewTabButton } from './TabStyles';

/**
 * TabHeader component that displays the tabs and new tab button
 */
const TabHeader = ({ 
  tabs, 
  activeTabIndex, 
  theme, 
  onTabClick, 
  onTabClose, 
  onNewTab 
}) => {
  return (
    <TabsHeader theme={theme}>
      <TabsScroller theme={theme}>
        {tabs.map((tab, index) => (
          <Tab
            key={tab.id}
            active={index === activeTabIndex}
            theme={theme}
            onClick={() => onTabClick(index)}
          >
            <TabTitle>
              {tab.title}{tab.isModified ? ' *' : ''}
            </TabTitle>
            <CloseButton
              theme={theme}
              onClick={(e) => onTabClose(index, e)}
            >
              <FiX size={12} />
            </CloseButton>
          </Tab>
        ))}
      </TabsScroller>
      <NewTabButton
        theme={theme}
        onClick={onNewTab}
      >
        <FiPlus size={16} />
      </NewTabButton>
    </TabsHeader>
  );
};

export default TabHeader;
