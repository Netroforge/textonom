import React, { useState } from 'react'
import styled from 'styled-components'
import { useStore } from '../store/useStore'
import { themes } from '../styles/themes'
import * as textTransformations from '../utils/textTransformations'
import { FiSettings, FiFile, FiMenu } from 'react-icons/fi'

const MenuContainer = styled.div`
  display: flex;
  background-color: ${({ theme }) => themes[theme].secondary};
  border-bottom: 1px solid ${({ theme }) => themes[theme].border};
  height: 40px;
  padding: 0 10px;
`

const MenuItem = styled.div`
  display: flex;
  align-items: center;
  padding: 0 15px;
  height: 100%;
  color: ${({ theme }) => themes[theme].foreground};
  cursor: pointer;
  position: relative;

  &:hover {
    background-color: ${({ theme }) => themes[theme].border};
  }
`

const MenuIcon = styled.span`
  margin-right: 5px;
  display: flex;
  align-items: center;
`

const SubMenu = styled.div<{ visible: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  background-color: ${({ theme }) => themes[theme].background};
  border: 1px solid ${({ theme }) => themes[theme].border};
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  min-width: 200px;
  z-index: 100;
  display: ${({ visible }) => (visible ? 'block' : 'none')};
`

const SubMenuItem = styled.div`
  padding: 10px 15px;
  color: ${({ theme }) => themes[theme].foreground};
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => themes[theme].secondary};
  }
`

const SubMenuGroup = styled.div`
  border-bottom: 1px solid ${({ theme }) => themes[theme].border};
  padding: 5px 0;

  &:last-child {
    border-bottom: none;
  }
`

const SubMenuTitle = styled.div`
  padding: 5px 15px;
  color: ${({ theme }) => themes[theme].primary};
  font-weight: bold;
  font-size: 0.9em;
`

interface MainMenuProps {
  theme: string;
  onOpenFile: () => void;
  onSaveFile: () => void;
  onSaveFileAs: () => void;
  onOpenSettings: () => void;
}

const MainMenu: React.FC<MainMenuProps> = ({
  theme,
  onOpenFile,
  onSaveFile,
  onSaveFileAs,
  onOpenSettings
}) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const { tabs, activeTabId, updateTabContent } = useStore()

  const handleMenuClick = (menu: string): void => {
    setActiveMenu(activeMenu === menu ? null : menu)
  }

  const handleTransformation = (transformFn: (text: string) => string): void => {
    if (!activeTabId) return

    const activeTab = tabs.find(tab => tab.id === activeTabId)
    if (!activeTab) return

    const transformedContent = transformFn(activeTab.content)
    updateTabContent(activeTabId, transformedContent)
    setActiveMenu(null)
  }

  const handleBcryptHash = (): void => {
    if (!activeTabId) return

    const activeTab = tabs.find(tab => tab.id === activeTabId)
    if (!activeTab) return

    // Prompt for cost factor
    const costFactor = prompt('Enter cost factor (1-20):', '10')
    if (!costFactor) return

    const cost = parseInt(costFactor, 10)
    if (isNaN(cost) || cost < 1 || cost > 20) {
      alert('Cost factor must be a number between 1 and 20')
      return
    }

    const transformedContent = textTransformations.bcryptHash(activeTab.content, cost)
    updateTabContent(activeTabId, transformedContent)
    setActiveMenu(null)
  }

  return (
    <MenuContainer theme={theme}>
      <MenuItem theme={theme} onClick={() => handleMenuClick('file')}>
        <MenuIcon><FiFile /></MenuIcon>
        File
        <SubMenu theme={theme} visible={activeMenu === 'file'}>
          <SubMenuItem theme={theme} onClick={onOpenFile}>
            Open File
          </SubMenuItem>
          <SubMenuItem theme={theme} onClick={onSaveFile}>
            Save
          </SubMenuItem>
          <SubMenuItem theme={theme} onClick={onSaveFileAs}>
            Save As
          </SubMenuItem>
        </SubMenu>
      </MenuItem>

      <MenuItem theme={theme} onClick={() => handleMenuClick('transform')}>
        <MenuIcon><FiMenu /></MenuIcon>
        Transform
        <SubMenu theme={theme} visible={activeMenu === 'transform'}>
          <SubMenuGroup theme={theme}>
            <SubMenuTitle theme={theme}>Encoding/Decoding</SubMenuTitle>
            <SubMenuItem theme={theme} onClick={() => handleTransformation(textTransformations.base64Encode)}>
              Base64 Encode
            </SubMenuItem>
            <SubMenuItem theme={theme} onClick={() => handleTransformation(textTransformations.base64Decode)}>
              Base64 Decode
            </SubMenuItem>
            <SubMenuItem theme={theme} onClick={() => handleTransformation(textTransformations.urlEncode)}>
              URL Encode
            </SubMenuItem>
            <SubMenuItem theme={theme} onClick={() => handleTransformation(textTransformations.urlDecode)}>
              URL Decode
            </SubMenuItem>
            <SubMenuItem theme={theme} onClick={() => handleTransformation(textTransformations.htmlEncode)}>
              HTML Encode
            </SubMenuItem>
            <SubMenuItem theme={theme} onClick={() => handleTransformation(textTransformations.htmlDecode)}>
              HTML Decode
            </SubMenuItem>
          </SubMenuGroup>

          <SubMenuGroup theme={theme}>
            <SubMenuTitle theme={theme}>Case Transformations</SubMenuTitle>
            <SubMenuItem theme={theme} onClick={() => handleTransformation(textTransformations.toUpperCase)}>
              UPPERCASE
            </SubMenuItem>
            <SubMenuItem theme={theme} onClick={() => handleTransformation(textTransformations.toLowerCase)}>
              lowercase
            </SubMenuItem>
            <SubMenuItem theme={theme} onClick={() => handleTransformation(textTransformations.toTitleCase)}>
              Title Case
            </SubMenuItem>
          </SubMenuGroup>

          <SubMenuGroup theme={theme}>
            <SubMenuTitle theme={theme}>JSON</SubMenuTitle>
            <SubMenuItem theme={theme} onClick={() => handleTransformation(textTransformations.jsonPrettify)}>
              Prettify JSON
            </SubMenuItem>
            <SubMenuItem theme={theme} onClick={() => handleTransformation(textTransformations.jsonCompact)}>
              Compact JSON
            </SubMenuItem>
            <SubMenuItem theme={theme} onClick={() => handleTransformation(textTransformations.jsonToYaml)}>
              JSON to YAML
            </SubMenuItem>
          </SubMenuGroup>

          <SubMenuGroup theme={theme}>
            <SubMenuTitle theme={theme}>XML</SubMenuTitle>
            <SubMenuItem theme={theme} onClick={() => handleTransformation(textTransformations.xmlPrettify)}>
              Prettify XML
            </SubMenuItem>
            <SubMenuItem theme={theme} onClick={() => handleTransformation(textTransformations.xmlCompact)}>
              Compact XML
            </SubMenuItem>
          </SubMenuGroup>

          <SubMenuGroup theme={theme}>
            <SubMenuTitle theme={theme}>YAML</SubMenuTitle>
            <SubMenuItem theme={theme} onClick={() => handleTransformation(textTransformations.yamlToJson)}>
              YAML to JSON
            </SubMenuItem>
          </SubMenuGroup>

          <SubMenuGroup theme={theme}>
            <SubMenuTitle theme={theme}>Spring Boot</SubMenuTitle>
            <SubMenuItem theme={theme} onClick={() => handleTransformation(textTransformations.propertiesFileToYaml)}>
              Properties to YAML
            </SubMenuItem>
            <SubMenuItem theme={theme} onClick={() => handleTransformation(textTransformations.yamlToPropertiesFile)}>
              YAML to Properties
            </SubMenuItem>
          </SubMenuGroup>

          <SubMenuGroup theme={theme}>
            <SubMenuTitle theme={theme}>Line Operations</SubMenuTitle>
            <SubMenuItem theme={theme} onClick={() => handleTransformation(textTransformations.sortLines)}>
              Sort Lines
            </SubMenuItem>
            <SubMenuItem theme={theme} onClick={() => handleTransformation(textTransformations.deduplicateLines)}>
              Deduplicate Lines
            </SubMenuItem>
            <SubMenuItem theme={theme} onClick={() => handleTransformation(textTransformations.reverseLines)}>
              Reverse Lines
            </SubMenuItem>
          </SubMenuGroup>

          <SubMenuGroup theme={theme}>
            <SubMenuTitle theme={theme}>Unicode</SubMenuTitle>
            <SubMenuItem theme={theme} onClick={() => handleTransformation(textTransformations.unicodeEscape)}>
              Unicode Escape
            </SubMenuItem>
            <SubMenuItem theme={theme} onClick={() => handleTransformation(textTransformations.unicodeUnescape)}>
              Unicode Unescape
            </SubMenuItem>
          </SubMenuGroup>

          <SubMenuGroup theme={theme}>
            <SubMenuTitle theme={theme}>Hash Generation</SubMenuTitle>
            <SubMenuItem theme={theme} onClick={() => handleTransformation(textTransformations.md5Hash)}>
              MD5 Hash
            </SubMenuItem>
            <SubMenuItem theme={theme} onClick={() => handleTransformation(textTransformations.sha1Hash)}>
              SHA-1 Hash
            </SubMenuItem>
            <SubMenuItem theme={theme} onClick={() => handleTransformation(textTransformations.sha256Hash)}>
              SHA-256 Hash
            </SubMenuItem>
            <SubMenuItem theme={theme} onClick={handleBcryptHash}>
              Bcrypt Hash
            </SubMenuItem>
          </SubMenuGroup>
        </SubMenu>
      </MenuItem>

      <MenuItem theme={theme} onClick={onOpenSettings}>
        <MenuIcon><FiSettings /></MenuIcon>
        Settings
      </MenuItem>
    </MenuContainer>
  )
}

export default MainMenu
