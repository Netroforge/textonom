import React, { useState } from 'react'
import styled from 'styled-components'
import { useStore, EditorSettings } from '../store/useStore'
import { themes, ThemeType } from '../styles/themes'
import { FiX } from 'react-icons/fi'

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`

const Dialog = styled.div`
  background-color: ${({ theme }) => themes[theme].background};
  color: ${({ theme }) => themes[theme].foreground};
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  width: 500px;
  max-width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`

const DialogHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 20px;
  border-bottom: 1px solid ${({ theme }) => themes[theme].border};
`

const DialogTitle = styled.h2`
  margin: 0;
  font-size: 1.2rem;
  color: ${({ theme }) => themes[theme].primary};
`

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => themes[theme].foreground};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: ${({ theme }) => themes[theme].error};
  }
`

const DialogContent = styled.div`
  padding: 20px;
`

const SettingGroup = styled.div`
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
`

const SettingGroupTitle = styled.h3`
  margin: 0 0 10px;
  font-size: 1rem;
  color: ${({ theme }) => themes[theme].accent};
  border-bottom: 1px solid ${({ theme }) => themes[theme].border};
  padding-bottom: 5px;
`

const SettingRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;

  &:last-child {
    margin-bottom: 0;
  }
`

const SettingLabel = styled.label`
  flex: 1;
  margin-right: 10px;
`

const SettingControl = styled.div`
  flex: 2;
`

const Select = styled.select`
  width: 100%;
  padding: 8px;
  background-color: ${({ theme }) => themes[theme].secondary};
  color: ${({ theme }) => themes[theme].foreground};
  border: 1px solid ${({ theme }) => themes[theme].border};
  border-radius: 4px;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => themes[theme].primary};
  }
`

const Input = styled.input`
  width: 100%;
  padding: 8px;
  background-color: ${({ theme }) => themes[theme].secondary};
  color: ${({ theme }) => themes[theme].foreground};
  border: 1px solid ${({ theme }) => themes[theme].border};
  border-radius: 4px;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => themes[theme].primary};
  }
`

const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  margin-right: 5px;
`

const DialogFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 15px 20px;
  border-top: 1px solid ${({ theme }) => themes[theme].border};
`

const Button = styled.button<{ primary?: boolean }>`
  padding: 8px 16px;
  margin-left: 10px;
  background-color: ${({ primary, theme }) => primary ? themes[theme].primary : themes[theme].secondary};
  color: ${({ primary, theme }) => primary ? '#fff' : themes[theme].foreground};
  border: 1px solid ${({ primary, theme }) => primary ? themes[theme].primary : themes[theme].border};
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: ${({ primary, theme }) => primary ? themes[theme].accent : themes[theme].border};
  }
`

interface SettingsDialogProps {
  theme: ThemeType;
  onClose: () => void;
}

const SettingsDialog: React.FC<SettingsDialogProps> = ({ theme, onClose }) => {
  const { settings, updateSettings } = useStore()
  const [localSettings, setLocalSettings] = useState<EditorSettings>({ ...settings })

  const handleChange = (key: keyof EditorSettings, value: string | number | boolean): void => {
    setLocalSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleSave = (): void => {
    updateSettings(localSettings)
    onClose()
  }

  return (
    <Overlay onClick={onClose}>
      <Dialog theme={theme} onClick={(e) => e.stopPropagation()}>
        <DialogHeader theme={theme}>
          <DialogTitle theme={theme}>Settings</DialogTitle>
          <CloseButton theme={theme} onClick={onClose}>
            <FiX size={20} />
          </CloseButton>
        </DialogHeader>

        <DialogContent>
          <SettingGroup>
            <SettingGroupTitle theme={theme}>Appearance</SettingGroupTitle>

            <SettingRow>
              <SettingLabel htmlFor="theme">Theme</SettingLabel>
              <SettingControl>
                <Select
                  id="theme"
                  theme={theme}
                  value={localSettings.theme}
                  onChange={(e) => handleChange('theme', e.target.value)}
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="cyberpunk">Cyberpunk</option>
                  <option value="cyberpunkTurbo">Cyberpunk Turbo</option>
                </Select>
              </SettingControl>
            </SettingRow>

            <SettingRow>
              <SettingLabel htmlFor="fontFamily">Font Family</SettingLabel>
              <SettingControl>
                <Select
                  id="fontFamily"
                  theme={theme}
                  value={localSettings.fontFamily}
                  onChange={(e) => handleChange('fontFamily', e.target.value)}
                >
                  <option value="monospace">Monospace</option>
                  <option value="'Courier New', monospace">Courier New</option>
                  <option value="'Consolas', monospace">Consolas</option>
                  <option value="'Roboto Mono', monospace">Roboto Mono</option>
                  <option value="'Fira Code', monospace">Fira Code</option>
                </Select>
              </SettingControl>
            </SettingRow>

            <SettingRow>
              <SettingLabel htmlFor="fontSize">Font Size</SettingLabel>
              <SettingControl>
                <Input
                  id="fontSize"
                  theme={theme}
                  type="number"
                  min="8"
                  max="32"
                  value={localSettings.fontSize}
                  onChange={(e) => handleChange('fontSize', parseInt(e.target.value, 10))}
                />
              </SettingControl>
            </SettingRow>
          </SettingGroup>

          <SettingGroup>
            <SettingGroupTitle theme={theme}>Editor</SettingGroupTitle>

            <SettingRow>
              <SettingLabel htmlFor="tabSize">Tab Size</SettingLabel>
              <SettingControl>
                <Input
                  id="tabSize"
                  theme={theme}
                  type="number"
                  min="1"
                  max="8"
                  value={localSettings.tabSize}
                  onChange={(e) => handleChange('tabSize', parseInt(e.target.value, 10))}
                />
              </SettingControl>
            </SettingRow>

            <SettingRow>
              <SettingLabel>
                <Checkbox
                  checked={localSettings.insertSpaces}
                  onChange={(e) => handleChange('insertSpaces', e.target.checked)}
                />
                Insert Spaces Instead of Tabs
              </SettingLabel>
            </SettingRow>

            <SettingRow>
              <SettingLabel>
                <Checkbox
                  checked={localSettings.autoIndent}
                  onChange={(e) => handleChange('autoIndent', e.target.checked)}
                />
                Auto Indent
              </SettingLabel>
            </SettingRow>

            <SettingRow>
              <SettingLabel>
                <Checkbox
                  checked={localSettings.showLineNumbers}
                  onChange={(e) => handleChange('showLineNumbers', e.target.checked)}
                />
                Show Line Numbers
              </SettingLabel>
            </SettingRow>

            <SettingRow>
              <SettingLabel>
                <Checkbox
                  checked={localSettings.wordWrap}
                  onChange={(e) => handleChange('wordWrap', e.target.checked)}
                />
                Word Wrap
              </SettingLabel>
            </SettingRow>

            {localSettings.wordWrap && (
              <SettingRow>
                <SettingLabel htmlFor="wrapColumn">Wrap Column</SettingLabel>
                <SettingControl>
                  <Input
                    id="wrapColumn"
                    theme={theme}
                    type="number"
                    min="10"
                    max="300"
                    value={localSettings.wrapColumn}
                    onChange={(e) => handleChange('wrapColumn', parseInt(e.target.value, 10))}
                  />
                </SettingControl>
              </SettingRow>
            )}
          </SettingGroup>

          <SettingGroup>
            <SettingGroupTitle theme={theme}>Auto Save</SettingGroupTitle>

            <SettingRow>
              <SettingLabel>
                <Checkbox
                  checked={localSettings.autoSave}
                  onChange={(e) => handleChange('autoSave', e.target.checked)}
                />
                Enable Auto Save
              </SettingLabel>
            </SettingRow>

            {localSettings.autoSave && (
              <SettingRow>
                <SettingLabel htmlFor="autoSaveInterval">Auto Save Interval (ms)</SettingLabel>
                <SettingControl>
                  <Input
                    id="autoSaveInterval"
                    theme={theme}
                    type="number"
                    min="1000"
                    step="1000"
                    value={localSettings.autoSaveInterval}
                    onChange={(e) => handleChange('autoSaveInterval', parseInt(e.target.value, 10))}
                  />
                </SettingControl>
              </SettingRow>
            )}
          </SettingGroup>
        </DialogContent>

        <DialogFooter theme={theme}>
          <Button theme={theme} onClick={onClose}>Cancel</Button>
          <Button primary theme={theme} onClick={handleSave}>Save</Button>
        </DialogFooter>
      </Dialog>
    </Overlay>
  )
}

export default SettingsDialog
