import { useEffect, useState } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { registerIpcEvent } from './utils/eventManager';
import TabsContainer from './components/TabsContainer';
import SettingsDialog from './components/SettingsDialog';
import CRTEffect from './components/CRTEffect';
import { getThemeByName, GlobalStyles } from './styles/themes';
import MonacoWrapper from './components/MonacoWrapper';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  position: relative;
`;

function App() {
    const [settings, setSettings] = useState({
        theme: 'light',
        font: {
            family: 'Consolas, monospace',
            size: 14
        },
        tabSize: 2,
        useTabs: false,
        showLineNumbers: true,
        wordWrap: true,
        wrapColumn: 80,
        autoSave: false,
        autoSaveInterval: 60000 // 1 minute
    });

    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    // Load settings from Electron main process
    useEffect(() => {
        const loadSettings = async () => {
            try {
                if (!window.electron) {
                    console.error('Electron APIs not available');
                    return;
                }
                const { ipcRenderer } = window.electron;
                const savedSettings = await ipcRenderer.invoke('get-settings');
                if (savedSettings) {
                    setSettings(savedSettings);
                }
            } catch (error) {
                console.error('Failed to load settings:', error);
            }
        };

        loadSettings();
    }, []);

    // Listen for menu events
    useEffect(() => {
        const { ipcRenderer } = window.electron;

        // Handle settings menu click
        const handleSettingsMenu = () => {
            setIsSettingsOpen(true);
        };

        // Register event listener using the event manager
        const cleanup = registerIpcEvent(ipcRenderer, 'menu-settings', handleSettingsMenu);

        // Clean up event listener
        return cleanup;
    }, []);

    // Save settings
    const handleSaveSettings = async (newSettings) => {
        try {
            const { ipcRenderer } = window.electron;
            const success = await ipcRenderer.invoke('save-settings', newSettings);

            if (success) {
                setSettings(newSettings);
            }
        } catch (error) {
            console.error('Failed to save settings:', error);
        }
    };

    // Get current theme
    const theme = getThemeByName(settings.theme);

    return (
        <ThemeProvider theme={theme}>
            <GlobalStyles theme={settings.theme} fontFamily={settings.font?.family}
                fontSize={settings.font?.size + 'px'} />
            <MonacoWrapper>
                <AppContainer>
                    <TabsContainer settings={settings} />

                    {isSettingsOpen && (
                        <SettingsDialog
                            isOpen={isSettingsOpen}
                            onClose={() => setIsSettingsOpen(false)}
                            settings={settings}
                            onSaveSettings={handleSaveSettings}
                        />
                    )}

                    {settings.theme === 'cyberpunk-turbo' && <CRTEffect />}
                </AppContainer>
            </MonacoWrapper>
        </ThemeProvider>
    );
}

export default App;
