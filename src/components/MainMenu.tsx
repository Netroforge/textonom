import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import * as textTransformations from '../utils/textTransformations';
import '../styles/MainMenu.css';

interface MainMenuProps {
  onSettingsClick: () => void;
  onNewFile: () => void;
  onOpenFile: () => void;
  onSaveFile: () => void;
  onSaveFileAs: () => void;
}

const MainMenu: React.FC<MainMenuProps> = ({
  onSettingsClick,
  onNewFile,
  onOpenFile,
  onSaveFile,
  onSaveFileAs
}) => {
  const { tabs, activeTabId, updateTabContent } = useStore();
  const activeTab = tabs.find((tab) => tab.id === activeTabId);

  const [isFileMenuOpen, setIsFileMenuOpen] = useState(false);
  const [isTransformMenuOpen, setIsTransformMenuOpen] = useState(false);

  // Text transformations
  const applyTransformation = (transformFn: (text: string) => string | Promise<string>) => {
    if (!activeTabId || !activeTab) return;

    try {
      Promise.resolve(transformFn(activeTab.content))
        .then((transformedText) => {
          updateTabContent(activeTabId, transformedText);
        })
        .catch((error) => {
          console.error('Transformation error:', error);
          // Show error message to user
          alert(`Transformation failed: ${error.message}`);
        });
    } catch (error) {
      console.error('Transformation error:', error);
      // Show error message to user
      alert(`Transformation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Toggle menu states
  const toggleFileMenu = () => {
    setIsFileMenuOpen(!isFileMenuOpen);
    setIsTransformMenuOpen(false);
  };

  const toggleTransformMenu = () => {
    setIsTransformMenuOpen(!isTransformMenuOpen);
    setIsFileMenuOpen(false);
  };

  // Close menus when clicking outside
  const handleClickOutside = () => {
    setIsFileMenuOpen(false);
    setIsTransformMenuOpen(false);
  };

  return (
    <div className="menu-container">
      <div className="menu-bar">
        <div className="menu-item">
          <button onClick={toggleFileMenu}>File</button>
          {isFileMenuOpen && (
            <div className="dropdown-menu">
              <button onClick={onNewFile}>New</button>
              <button onClick={onOpenFile}>Open</button>
              <button onClick={onSaveFile} disabled={!activeTabId}>Save</button>
              <button onClick={onSaveFileAs} disabled={!activeTabId}>Save As</button>
            </div>
          )}
        </div>

        <div className="menu-item">
          <button onClick={toggleTransformMenu} disabled={!activeTabId}>Transform</button>
          {isTransformMenuOpen && (
            <div className="dropdown-menu">
              <div className="submenu-item">
                <span>Base64</span>
                <div className="submenu">
                  <button onClick={() => applyTransformation(textTransformations.base64Encode)}>Encode</button>
                  <button onClick={() => applyTransformation(textTransformations.base64Decode)}>Decode</button>
                </div>
              </div>

              <div className="submenu-item">
                <span>JSON</span>
                <div className="submenu">
                  <button onClick={() => applyTransformation(textTransformations.jsonPrettify)}>Prettify</button>
                  <button onClick={() => applyTransformation(textTransformations.jsonCompact)}>Compact</button>
                </div>
              </div>

              <div className="submenu-item">
                <span>URL</span>
                <div className="submenu">
                  <button onClick={() => applyTransformation(textTransformations.urlEncode)}>Encode</button>
                  <button onClick={() => applyTransformation(textTransformations.urlDecode)}>Decode</button>
                </div>
              </div>

              <div className="submenu-item">
                <span>Case</span>
                <div className="submenu">
                  <button onClick={() => applyTransformation(textTransformations.toUpperCase)}>UPPERCASE</button>
                  <button onClick={() => applyTransformation(textTransformations.toLowerCase)}>lowercase</button>
                  <button onClick={() => applyTransformation(textTransformations.toTitleCase)}>Title Case</button>
                </div>
              </div>

              <div className="submenu-item">
                <span>XML</span>
                <div className="submenu">
                  <button onClick={() => applyTransformation(textTransformations.xmlPrettify)}>Prettify</button>
                  <button onClick={() => applyTransformation(textTransformations.xmlCompact)}>Compact</button>
                </div>
              </div>

              <div className="submenu-item">
                <span>Lines</span>
                <div className="submenu">
                  <button onClick={() => applyTransformation(textTransformations.sortLines)}>Sort</button>
                  <button onClick={() => applyTransformation(textTransformations.deduplicateLines)}>Deduplicate</button>
                  <button onClick={() => applyTransformation(textTransformations.reverseLines)}>Reverse</button>
                </div>
              </div>

              <div className="submenu-item">
                <span>HTML</span>
                <div className="submenu">
                  <button onClick={() => applyTransformation(textTransformations.htmlEncode)}>Encode</button>
                  <button onClick={() => applyTransformation(textTransformations.htmlDecode)}>Decode</button>
                </div>
              </div>

              <div className="submenu-item">
                <span>Hash</span>
                <div className="submenu">
                  <button onClick={() => applyTransformation(textTransformations.md5Hash)}>MD5</button>
                  <button onClick={() => applyTransformation(textTransformations.sha1Hash)}>SHA-1</button>
                  <button onClick={() => applyTransformation(textTransformations.sha256Hash)}>SHA-256</button>
                </div>
              </div>

              <div className="submenu-item">
                <span>Unicode</span>
                <div className="submenu">
                  <button onClick={() => applyTransformation(textTransformations.unicodeEscape)}>Escape</button>
                  <button onClick={() => applyTransformation(textTransformations.unicodeUnescape)}>Unescape</button>
                </div>
              </div>

              <div className="submenu-item">
                <span>Format Conversion</span>
                <div className="submenu">
                  <button onClick={() => applyTransformation(textTransformations.jsonToYaml)}>JSON to YAML</button>
                  <button onClick={() => applyTransformation(textTransformations.yamlToJson)}>YAML to JSON</button>
                  <button onClick={() => applyTransformation(textTransformations.propertiesFileToYaml)}>Properties to YAML</button>
                  <button onClick={() => applyTransformation(textTransformations.yamlToPropertiesFile)}>YAML to Properties</button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="menu-item">
          <button onClick={onSettingsClick}>Settings</button>
        </div>
      </div>

      {(isFileMenuOpen || isTransformMenuOpen) && (
        <div className="menu-backdrop" onClick={handleClickOutside}></div>
      )}
    </div>
  );
};

export default MainMenu;
