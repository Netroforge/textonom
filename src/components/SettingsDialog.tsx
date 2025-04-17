import React, { useState, useEffect } from 'react';
import { useStore, EditorSettings } from '../store/useStore';
import '../styles/SettingsDialog.css';

interface SettingsDialogProps {
  onClose: () => void;
}

const SettingsDialog: React.FC<SettingsDialogProps> = ({ onClose }) => {
  const { settings, updateSettings } = useStore();
  const [localSettings, setLocalSettings] = useState<EditorSettings>({ ...settings });

  // Reset local settings when dialog is opened
  useEffect(() => {
    setLocalSettings({ ...settings });
  }, [settings]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setLocalSettings((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else if (type === 'number') {
      setLocalSettings((prev) => ({
        ...prev,
        [name]: parseInt(value, 10),
      }));
    } else {
      setLocalSettings((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Apply settings
  const handleApply = () => {
    updateSettings(localSettings);
  };

  // Save settings and close dialog
  const handleSave = () => {
    updateSettings(localSettings);
    onClose();
  };

  // Cancel and close dialog
  const handleCancel = () => {
    onClose();
  };

  return (
    <div className="dialog-overlay">
      <div className="dialog-content settings-dialog">
        <div className="dialog-header">
          <h2 className="dialog-title">Settings</h2>
          <button className="dialog-close" onClick={onClose}>&times;</button>
        </div>

        <div className="dialog-body">
          <div className="settings-section">
            <h3>Theme</h3>
            <div className="settings-row">
              <label htmlFor="theme">Select Theme:</label>
              <select
                id="theme"
                name="theme"
                value={localSettings.theme}
                onChange={handleChange}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="cyberpunk">Cyberpunk</option>
                <option value="cyberpunk-turbo">Cyberpunk Turbo</option>
              </select>
            </div>
          </div>

          <div className="settings-section">
            <h3>Font</h3>
            <div className="settings-row">
              <label htmlFor="fontFamily">Font Family:</label>
              <select
                id="fontFamily"
                name="fontFamily"
                value={localSettings.fontFamily}
                onChange={handleChange}
              >
                <option value='Consolas, "Courier New", monospace'>Consolas</option>
                <option value='"Courier New", monospace'>Courier New</option>
                <option value='"Fira Code", monospace'>Fira Code</option>
                <option value='"Source Code Pro", monospace'>Source Code Pro</option>
                <option value='monospace'>Monospace</option>
              </select>
            </div>

            <div className="settings-row">
              <label htmlFor="fontSize">Font Size:</label>
              <input
                type="number"
                id="fontSize"
                name="fontSize"
                min="8"
                max="32"
                value={localSettings.fontSize}
                onChange={handleChange}
              />
            </div>

            <div className="font-preview" style={{
              fontFamily: localSettings.fontFamily,
              fontSize: `${localSettings.fontSize}px`
            }}>
              The quick brown fox jumps over the lazy dog.
            </div>
          </div>

          <div className="settings-section">
            <h3>Tab Behavior</h3>
            <div className="settings-row">
              <label htmlFor="tabSize">Tab Size:</label>
              <input
                type="number"
                id="tabSize"
                name="tabSize"
                min="1"
                max="8"
                value={localSettings.tabSize}
                onChange={handleChange}
              />
            </div>

            <div className="settings-row">
              <label htmlFor="insertSpaces">Insert Spaces:</label>
              <input
                type="checkbox"
                id="insertSpaces"
                name="insertSpaces"
                checked={localSettings.insertSpaces}
                onChange={handleChange}
              />
            </div>

            <div className="settings-row">
              <label htmlFor="autoIndent">Auto Indent:</label>
              <input
                type="checkbox"
                id="autoIndent"
                name="autoIndent"
                checked={localSettings.autoIndent}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="settings-section">
            <h3>Editor Display</h3>
            <div className="settings-row">
              <label htmlFor="showLineNumbers">Show Line Numbers:</label>
              <input
                type="checkbox"
                id="showLineNumbers"
                name="showLineNumbers"
                checked={localSettings.showLineNumbers}
                onChange={handleChange}
              />
            </div>

            <div className="settings-row">
              <label htmlFor="wordWrap">Word Wrap:</label>
              <input
                type="checkbox"
                id="wordWrap"
                name="wordWrap"
                checked={localSettings.wordWrap}
                onChange={handleChange}
              />
            </div>

            <div className="settings-row">
              <label htmlFor="wrapColumn">Wrap Column:</label>
              <input
                type="number"
                id="wrapColumn"
                name="wrapColumn"
                min="40"
                max="200"
                value={localSettings.wrapColumn}
                disabled={!localSettings.wordWrap}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="settings-section">
            <h3>Auto Save</h3>
            <div className="settings-row">
              <label htmlFor="autoSave">Enable Auto Save:</label>
              <input
                type="checkbox"
                id="autoSave"
                name="autoSave"
                checked={localSettings.autoSave}
                onChange={handleChange}
              />
            </div>

            <div className="settings-row">
              <label htmlFor="autoSaveInterval">Auto Save Interval (ms):</label>
              <input
                type="number"
                id="autoSaveInterval"
                name="autoSaveInterval"
                min="5000"
                max="300000"
                step="5000"
                value={localSettings.autoSaveInterval}
                disabled={!localSettings.autoSave}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="dialog-footer">
          <button className="btn" onClick={handleApply}>Apply</button>
          <button className="btn" onClick={handleSave}>Save</button>
          <button className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default SettingsDialog;
