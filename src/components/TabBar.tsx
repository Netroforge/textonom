import React from 'react';
import { useStore } from '../store/useStore';
import '../styles/TabBar.css';

const TabBar: React.FC = () => {
  const { tabs, activeTabId, addTab, closeTab, setActiveTab } = useStore();

  const handleAddTab = () => {
    addTab({
      title: 'New Tab',
      content: '',
      path: null,
      isModified: false,
    });
  };

  const handleCloseTab = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    closeTab(id);
  };

  const handleTabClick = (id: string) => {
    setActiveTab(id);
  };

  return (
    <div className="tab-container">
      <div className="tabs">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`tab ${activeTabId === tab.id ? 'active' : ''}`}
            onClick={() => handleTabClick(tab.id)}
          >
            <span className="tab-title">
              {tab.title}
              {tab.isModified && ' *'}
            </span>
            <button
              className="tab-close"
              onClick={(e) => handleCloseTab(e, tab.id)}
              aria-label="Close tab"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <button
        className="add-tab-button"
        onClick={handleAddTab}
        aria-label="Add new tab"
      >
        +
      </button>
    </div>
  );
};

export default TabBar;
