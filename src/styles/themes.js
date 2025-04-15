import { createGlobalStyle } from 'styled-components';

// Light theme
export const LightTheme = {
    background: '#ffffff',
    text: '#333333',
    primary: '#0066cc',
    secondary: '#f0f0f0',
    border: '#dddddd',
    accent: '#0066cc',
    error: '#cc0000',
    success: '#00cc66'
};

// Dark theme
export const DarkTheme = {
    background: '#1e1e1e',
    text: '#f0f0f0',
    primary: '#0099ff',
    secondary: '#2d2d2d',
    border: '#555555',
    accent: '#0099ff',
    error: '#ff6666',
    success: '#66cc99'
};

// Cyberpunk theme
export const CyberpunkTheme = {
    background: '#0c0c14',
    text: '#f0f0f0',
    primary: '#ff00ff',
    secondary: '#1a1a2e',
    border: '#3a3a5a',
    accent: '#00ffff',
    error: '#ff0055',
    success: '#00ff99'
};

// Cyberpunk Turbo theme (extends Cyberpunk)
export const CyberpunkTurboTheme = {
    ...CyberpunkTheme,
    background: '#0a0a12',
    primary: '#ff00aa',
    accent: '#00ffee'
};

// Utility function for text glow in cyberpunk turbo theme
export const getTextGlow = (color, intensity = 1) => {
    // Base glow effect with multiple layers for a more pronounced effect
    return `
    text-shadow: 0 0 2px ${color}${intensity * 0.3},
                 0 0 4px ${color}${intensity * 0.2},
                 0 0 8px ${color}${intensity * 0.1};
  `;
};

// Global styles for each theme
export const GlobalStyles = createGlobalStyle`
  body {
    background-color: ${props => props.theme.background};
    color: ${props => props.theme.text};
    font-family: ${props => props.fontFamily || 'Consolas, monospace'};
    font-size: ${props => props.fontSize || '14px'};
    margin: 0;
    padding: 0;
    transition: background-color 0.3s ease;
    height: 100vh;
    overflow: hidden;
  }

  #root {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  * {
    box-sizing: border-box;
  }

  /* Apply text glow to all text elements in cyberpunk-turbo theme */
  ${props => props.theme === 'cyberpunk-turbo' ? `
    h1, h2, h3, h4, h5, h6, p, span, div, button, a {
      ${getTextGlow('rgba(0, 255, 238, ', 0.8)}
    }
  ` : ''}

  /* Ensure all input fields have a visible cursor */
  input, textarea, [contenteditable="true"] {
    caret-color: ${props => {
        switch (props.theme) {
            case 'dark':
                return '#0099ff';
            case 'cyberpunk':
                return '#ff00ff';
            case 'cyberpunk-turbo':
                return '#ff00aa';
            default:
                return '#0066cc';
        }
    }};
  }

  ::-webkit-scrollbar {
    width: 1vw;
    height: 1vh;
    max-width: 12px;
    max-height: 12px;
  }

  ::-webkit-scrollbar-track {
    background: ${props => props.theme === 'dark' || props.theme === 'cyberpunk' || props.theme === 'cyberpunk-turbo'
        ? '#1a1a1a'
        : '#f0f0f0'};
  }

  ::-webkit-scrollbar-thumb {
    background: ${props => {
        switch (props.theme) {
            case 'dark':
                return '#555555';
            case 'cyberpunk':
                return '#ff00ff';
            case 'cyberpunk-turbo':
                return '#ff00aa';
            default:
                return '#cccccc';
        }
    }};
    border-radius: 6px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${props => {
        switch (props.theme) {
            case 'dark':
                return '#777777';
            case 'cyberpunk':
                return '#ff55ff';
            case 'cyberpunk-turbo':
                return '#ff55cc';
            default:
                return '#aaaaaa';
        }
    }};
  }
`;

// Get theme object by name
export const getThemeByName = (themeName) => {
    switch (themeName) {
        case 'dark':
            return DarkTheme;
        case 'cyberpunk':
            return CyberpunkTheme;
        case 'cyberpunk-turbo':
            return CyberpunkTurboTheme;
        default:
            return LightTheme;
    }
};
