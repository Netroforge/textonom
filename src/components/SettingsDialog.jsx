import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FiX } from 'react-icons/fi';
import { getTextGlow, CyberpunkColors } from '../styles/themes';

const DialogOverlay = styled.div`
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
`;

const DialogContent = styled.div`
  background-color: ${props => {
    if (props.theme === 'cyberpunk-turbo' || props.theme === 'cyberpunk') {
      return CyberpunkColors.darkBlue;
    }
    return props.theme === 'dark' ? '#1e1e1e' : '#fff';
  }};
  color: ${props => {
    if (props.theme === 'cyberpunk-turbo' || props.theme === 'cyberpunk') {
      return CyberpunkColors.lightText;
    }
    return props.theme === 'dark' ? '#fff' : '#000';
  }};
  border-radius: 4px;
  padding: 20px;
  width: 500px;
  max-width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: ${props => {
    if (props.theme === 'cyberpunk-turbo' || props.theme === 'cyberpunk') {
      return `0 0 10px ${CyberpunkColors.cyanRGBA(0.3)}, 0 4px 15px rgba(0, 0, 0, 0.5)`;
    }
    return '0 4px 8px rgba(0, 0, 0, 0.2)';
  }};
  border: ${props => (props.theme === 'cyberpunk-turbo' || props.theme === 'cyberpunk') ? `1px solid ${CyberpunkColors.cyanRGBA(0.3)}` : 'none'};
  transition: all 0.2s ease;
`;

const DialogHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const DialogTitle = styled.h2`
  margin: 0;
  font-size: 1.5rem;
  ${props => (props.theme === 'cyberpunk-turbo' || props.theme === 'cyberpunk') ? `
    color: ${CyberpunkColors.cyan};
    ${getTextGlow(CyberpunkColors.cyanRGBA(), 1)}
  ` : ''}
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${props => {
    if (props.theme === 'cyberpunk-turbo' || props.theme === 'cyberpunk') {
      return CyberpunkColors.cyan;
    }
    return props.theme === 'dark' ? '#ccc' : '#666';
  }};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  ${props => (props.theme === 'cyberpunk-turbo' || props.theme === 'cyberpunk') ? `
    ${getTextGlow(CyberpunkColors.cyanRGBA(), 0.5)}
  ` : ''}

  &:hover {
    color: ${props => {
    if (props.theme === 'cyberpunk-turbo' || props.theme === 'cyberpunk') {
      return CyberpunkColors.cyan;
    }
    return props.theme === 'dark' ? '#fff' : '#000';
  }};
    ${props => (props.theme === 'cyberpunk-turbo' || props.theme === 'cyberpunk') ? `
      ${getTextGlow(CyberpunkColors.cyanRGBA(), 1)}
    ` : ''}
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-weight: 500;
  ${props => (props.theme === 'cyberpunk-turbo' || props.theme === 'cyberpunk') ? `
    color: ${CyberpunkColors.magenta};
    ${getTextGlow(CyberpunkColors.magentaRGBA(), 0.7)}
  ` : ''}
`;

const Select = styled.select`
  padding: 8px;
  border-radius: 4px;
  border: 1px solid ${props => {
    if (props.theme === 'cyberpunk-turbo' || props.theme === 'cyberpunk') {
      return CyberpunkColors.cyanRGBA(0.5);
    }
    return props.theme === 'dark' ? '#555' : '#ddd';
  }};
  background-color: ${props => {
    if (props.theme === 'cyberpunk-turbo' || props.theme === 'cyberpunk') {
      return CyberpunkColors.darkBlue;
    }
    return props.theme === 'dark' ? '#2d2d2d' : '#fff';
  }};
  color: ${props => {
    if (props.theme === 'cyberpunk-turbo' || props.theme === 'cyberpunk') {
      return CyberpunkColors.cyan;
    }
    return props.theme === 'dark' ? '#fff' : '#000';
  }};
  ${props => (props.theme === 'cyberpunk-turbo' || props.theme === 'cyberpunk') ? `
    ${getTextGlow(CyberpunkColors.cyanRGBA(), 0.5)}
    box-shadow: 0 0 5px ${CyberpunkColors.cyanRGBA(0.2)};
    &:focus {
      outline: none;
      border-color: ${CyberpunkColors.cyan};
      box-shadow: 0 0 8px ${CyberpunkColors.cyanRGBA(0.4)};
    }
  ` : ''}
`;

const Input = styled.input`
  padding: 8px;
  border-radius: 4px;
  border: 1px solid ${props => {
    if (props.theme === 'cyberpunk-turbo') {
      return CyberpunkColors.cyanRGBA(0.5);
    }
    return props.theme === 'dark' ? '#555' : '#ddd';
  }};
  background-color: ${props => {
    if (props.theme === 'cyberpunk-turbo') {
      return CyberpunkColors.darkBlue;
    }
    return props.theme === 'dark' ? '#2d2d2d' : '#fff';
  }};
  color: ${props => {
    if (props.theme === 'cyberpunk-turbo') {
      return CyberpunkColors.cyan;
    }
    return props.theme === 'dark' ? '#fff' : '#000';
  }};
  ${props => props.theme === 'cyberpunk-turbo' ? `
    ${getTextGlow(CyberpunkColors.cyanRGBA(), 0.5)}
    box-shadow: 0 0 5px ${CyberpunkColors.cyanRGBA(0.2)};
    &:focus {
      outline: none;
      border-color: ${CyberpunkColors.cyan};
      box-shadow: 0 0 8px ${CyberpunkColors.cyanRGBA(0.4)};
    }
    &[type="checkbox"] {
      accent-color: ${CyberpunkColors.cyan};
    }
  ` : ''}
`;

const Checkbox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 20px;
`;

const Button = styled.button`
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;

  &.primary {
    background-color: ${props => (props.theme === 'cyberpunk-turbo' || props.theme === 'cyberpunk') ? CyberpunkColors.magenta : '#0066cc'};
    color: white;
    ${props => (props.theme === 'cyberpunk-turbo' || props.theme === 'cyberpunk') ? `
      border: 1px solid ${CyberpunkColors.magentaRGBA(0.5)};
      ${getTextGlow(CyberpunkColors.magentaRGBA(), 0.8)}
    ` : ''}

    &:hover {
      background-color: ${props => (props.theme === 'cyberpunk-turbo' || props.theme === 'cyberpunk') ? '#ff33bb' : '#0055aa'};
      ${props => (props.theme === 'cyberpunk-turbo' || props.theme === 'cyberpunk') ? `
        ${getTextGlow(CyberpunkColors.magentaRGBA(), 1)}
        box-shadow: 0 0 10px ${CyberpunkColors.magentaRGBA(0.3)};
      ` : ''}
    }
  }

  &.secondary {
    background-color: ${props => {
    if (props.theme === 'cyberpunk-turbo' || props.theme === 'cyberpunk') {
      return CyberpunkColors.mediumBlue;
    }
    return props.theme === 'dark' ? '#555' : '#eee';
  }};
    color: ${props => {
    if (props.theme === 'cyberpunk-turbo' || props.theme === 'cyberpunk') {
      return CyberpunkColors.cyan;
    }
    return props.theme === 'dark' ? '#fff' : '#000';
  }};
    ${props => (props.theme === 'cyberpunk-turbo' || props.theme === 'cyberpunk') ? `
      border: 1px solid ${CyberpunkColors.cyanRGBA(0.3)};
      ${getTextGlow(CyberpunkColors.cyanRGBA(), 0.5)}
    ` : ''}

    &:hover {
      background-color: ${props => {
    if (props.theme === 'cyberpunk-turbo' || props.theme === 'cyberpunk') {
      return '#2a2a4e';
    }
    return props.theme === 'dark' ? '#666' : '#ddd';
  }};
      ${props => (props.theme === 'cyberpunk-turbo' || props.theme === 'cyberpunk') ? `
        ${getTextGlow(CyberpunkColors.cyanRGBA(), 0.8)}
        box-shadow: 0 0 10px ${CyberpunkColors.cyanRGBA(0.2)};
      ` : ''}
    }
  }
`;

const SettingsDialog = ({ isOpen, onClose, settings, onSaveSettings }) => {
  const [formData, setFormData] = useState({
    theme: 'light',
    fontFamily: 'Consolas, monospace',
    fontSize: 14,
    tabSize: 2,
    useTabs: false,
    showLineNumbers: true,
    wordWrap: true,
    wrapColumn: 80,
    autoSave: false,
    autoSaveInterval: 60
  });

  // Initialize form data from settings
  useEffect(() => {
    if (settings) {
      setFormData({
        theme: settings.theme || 'light',
        fontFamily: settings.font?.family || 'Consolas, monospace',
        fontSize: settings.font?.size || 14,
        tabSize: settings.tabSize || 2,
        useTabs: settings.useTabs || false,
        showLineNumbers: settings.showLineNumbers || true,
        wordWrap: settings.wordWrap || true,
        wrapColumn: settings.wrapColumn || 80,
        autoSave: settings.autoSave || false,
        autoSaveInterval: settings.autoSaveInterval ? settings.autoSaveInterval / 1000 : 60
      });
    }
  }, [settings, isOpen]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Convert form data to settings format
    const newSettings = {
      theme: formData.theme,
      font: {
        family: formData.fontFamily,
        size: Number(formData.fontSize)
      },
      tabSize: Number(formData.tabSize),
      useTabs: formData.useTabs,
      showLineNumbers: formData.showLineNumbers,
      wordWrap: formData.wordWrap,
      wrapColumn: Number(formData.wrapColumn),
      autoSave: formData.autoSave,
      autoSaveInterval: Number(formData.autoSaveInterval) * 1000 // Convert to milliseconds
    };

    onSaveSettings(newSettings);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <DialogOverlay onClick={onClose}>
      <DialogContent
        theme={settings.theme}
        onClick={(e) => e.stopPropagation()}
      >
        <DialogHeader>
          <DialogTitle theme={settings.theme}>Settings</DialogTitle>
          <CloseButton theme={settings.theme} onClick={onClose}>
            <FiX size={24} />
          </CloseButton>
        </DialogHeader>

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="theme" theme={settings.theme}>Theme</Label>
            <Select
              id="theme"
              name="theme"
              value={formData.theme}
              onChange={handleChange}
              theme={settings.theme}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="cyberpunk">Cyberpunk</option>
              <option value="cyberpunk-turbo">Cyberpunk Turbo</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="fontFamily" theme={settings.theme}>Font Family</Label>
            <Select
              id="fontFamily"
              name="fontFamily"
              value={formData.fontFamily}
              onChange={handleChange}
              theme={settings.theme}
            >
              <option value="Consolas, monospace">Consolas</option>
              <option value="'Courier New', monospace">Courier New</option>
              <option value="'Source Code Pro', monospace">Source Code Pro</option>
              <option value="'Fira Code', monospace">Fira Code</option>
              <option value="'JetBrains Mono', monospace">JetBrains Mono</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="fontSize" theme={settings.theme}>Font Size</Label>
            <Input
              type="number"
              id="fontSize"
              name="fontSize"
              value={formData.fontSize}
              onChange={handleChange}
              min="8"
              max="32"
              theme={settings.theme}
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="tabSize" theme={settings.theme}>Tab Size</Label>
            <Input
              type="number"
              id="tabSize"
              name="tabSize"
              value={formData.tabSize}
              onChange={handleChange}
              min="1"
              max="8"
              theme={settings.theme}
            />
          </FormGroup>

          <FormGroup>
            <Checkbox>
              <Input
                type="checkbox"
                id="useTabs"
                name="useTabs"
                checked={formData.useTabs}
                onChange={handleChange}
              />
              <Label htmlFor="useTabs" theme={settings.theme}>Use Tabs Instead of Spaces</Label>
            </Checkbox>
          </FormGroup>

          <FormGroup>
            <Checkbox>
              <Input
                type="checkbox"
                id="showLineNumbers"
                name="showLineNumbers"
                checked={formData.showLineNumbers}
                onChange={handleChange}
              />
              <Label htmlFor="showLineNumbers" theme={settings.theme}>Show Line Numbers</Label>
            </Checkbox>
          </FormGroup>

          <FormGroup>
            <Checkbox>
              <Input
                type="checkbox"
                id="wordWrap"
                name="wordWrap"
                checked={formData.wordWrap}
                onChange={handleChange}
              />
              <Label htmlFor="wordWrap" theme={settings.theme}>Word Wrap</Label>
            </Checkbox>
          </FormGroup>

          {formData.wordWrap && (
            <FormGroup>
              <Label htmlFor="wrapColumn" theme={settings.theme}>Wrap Column</Label>
              <Input
                type="number"
                id="wrapColumn"
                name="wrapColumn"
                value={formData.wrapColumn}
                onChange={handleChange}
                min="40"
                max="200"
                theme={settings.theme}
              />
            </FormGroup>
          )}

          <FormGroup>
            <Checkbox>
              <Input
                type="checkbox"
                id="autoSave"
                name="autoSave"
                checked={formData.autoSave}
                onChange={handleChange}
              />
              <Label htmlFor="autoSave" theme={settings.theme}>Auto Save</Label>
            </Checkbox>
          </FormGroup>

          {formData.autoSave && (
            <FormGroup>
              <Label htmlFor="autoSaveInterval" theme={settings.theme}>Auto Save Interval (seconds)</Label>
              <Input
                type="number"
                id="autoSaveInterval"
                name="autoSaveInterval"
                value={formData.autoSaveInterval}
                onChange={handleChange}
                min="5"
                max="3600"
                theme={settings.theme}
              />
            </FormGroup>
          )}

          <ButtonGroup>
            <Button
              type="button"
              className="secondary"
              onClick={onClose}
              theme={settings.theme}
            >
              Cancel
            </Button>
            <Button type="submit" className="primary" theme={settings.theme}>
              Save
            </Button>
          </ButtonGroup>
        </Form>
      </DialogContent>
    </DialogOverlay>
  );
};

export default SettingsDialog;
