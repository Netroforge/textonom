import { THEMES } from '../store/settingsStore'

// Light theme colors
export const lightTheme = {
  primary: '#007bff',
  secondary: '#6c757d',
  background: '#ffffff',
  surface: '#f8f9fa',
  text: '#212529',
  border: '#dee2e6',
  divider: '#e9ecef',
  error: '#dc3545',
  success: '#28a745',
  warning: '#ffc107',
  info: '#17a2b8',
  editorBackground: '#ffffff',
  editorForeground: '#212529',
  editorLineNumbers: '#6c757d',
  editorSelectionBackground: '#b3d7ff',
  editorCursor: '#212529',
  tabBackground: '#f8f9fa',
  tabActiveBackground: '#ffffff',
  tabHoverBackground: '#e9ecef',
  tabActiveBorder: '#007bff',
  tabText: '#495057',
  tabActiveText: '#212529',
  menuBackground: '#ffffff',
  menuHoverBackground: '#f8f9fa',
  menuText: '#212529',
  menuBorder: '#dee2e6',
  scrollbarThumb: '#adb5bd',
  scrollbarTrack: '#e9ecef'
}

// Dark theme colors
export const darkTheme = {
  primary: '#0d6efd',
  secondary: '#6c757d',
  background: '#212529',
  surface: '#343a40',
  text: '#f8f9fa',
  border: '#495057',
  divider: '#343a40',
  error: '#dc3545',
  success: '#28a745',
  warning: '#ffc107',
  info: '#17a2b8',
  editorBackground: '#1e1e1e',
  editorForeground: '#d4d4d4',
  editorLineNumbers: '#858585',
  editorSelectionBackground: '#264f78',
  editorCursor: '#d4d4d4',
  tabBackground: '#343a40',
  tabActiveBackground: '#1e1e1e',
  tabHoverBackground: '#495057',
  tabActiveBorder: '#0d6efd',
  tabText: '#adb5bd',
  tabActiveText: '#f8f9fa',
  menuBackground: '#343a40',
  menuHoverBackground: '#495057',
  menuText: '#f8f9fa',
  menuBorder: '#495057',
  scrollbarThumb: '#6c757d',
  scrollbarTrack: '#343a40'
}

// Cyberpunk theme colors
export const cyberpunkTheme = {
  primary: '#ff00ff', // Magenta
  secondary: '#00ffff', // Cyan
  background: '#0a0a16', // Dark blue-black
  surface: '#1a1a2e', // Dark blue
  text: '#00ffff', // Cyan
  border: '#ff00ff', // Magenta
  divider: '#1a1a2e', // Dark blue
  error: '#ff0055', // Neon red
  success: '#00ff9f', // Neon green
  warning: '#ffcc00', // Neon yellow
  info: '#00ffff', // Cyan
  editorBackground: '#0a0a16', // Dark blue-black
  editorForeground: '#00ffff', // Cyan
  editorLineNumbers: '#ff00ff', // Magenta
  editorSelectionBackground: '#3d1a7a', // Purple
  editorCursor: '#00ffff', // Cyan
  tabBackground: '#1a1a2e', // Dark blue
  tabActiveBackground: '#0a0a16', // Dark blue-black
  tabHoverBackground: '#2a2a4e', // Lighter blue
  tabActiveBorder: '#ff00ff', // Magenta
  tabText: '#00ffff', // Cyan
  tabActiveText: '#00ffff', // Cyan
  menuBackground: '#1a1a2e', // Dark blue
  menuHoverBackground: '#2a2a4e', // Lighter blue
  menuText: '#00ffff', // Cyan
  menuBorder: '#ff00ff', // Magenta
  scrollbarThumb: '#ff00ff', // Magenta
  scrollbarTrack: '#1a1a2e', // Dark blue
  textGlow: true // Enable text glow effect
}

// Cyberpunk Turbo theme (with CRT effect)
export const cyberpunkTurboTheme = {
  ...cyberpunkTheme,
  primary: '#ff00ff', // Magenta
  secondary: '#00ffff', // Cyan
  background: '#0a0a16', // Dark blue-black
  surface: '#1a1a2e', // Dark blue
  text: '#00ffff', // Cyan
  border: '#ff00ff', // Magenta
  divider: '#1a1a2e', // Dark blue
  error: '#ff0055', // Neon red
  success: '#00ff9f', // Neon green
  warning: '#ffcc00', // Neon yellow
  info: '#00ffff', // Cyan
  editorBackground: '#0a0a16', // Dark blue-black
  editorForeground: '#00ffff', // Cyan
  editorLineNumbers: '#ff00ff', // Magenta
  editorSelectionBackground: '#3d1a7a', // Purple
  editorCursor: '#00ffff', // Cyan
  tabBackground: '#1a1a2e', // Dark blue
  tabActiveBackground: '#0a0a16', // Dark blue-black
  tabHoverBackground: '#2a2a4e', // Lighter blue
  tabActiveBorder: '#ff00ff', // Magenta
  tabText: '#00ffff', // Cyan
  tabActiveText: '#00ffff', // Cyan
  menuBackground: '#1a1a2e', // Dark blue
  menuHoverBackground: '#2a2a4e', // Lighter blue
  menuText: '#00ffff', // Cyan
  menuBorder: '#ff00ff', // Magenta
  scrollbarThumb: '#ff00ff', // Magenta
  scrollbarTrack: '#1a1a2e', // Dark blue
  crtEffect: true, // Enable CRT effect
  textGlow: true // Enable text glow effect
}

// Get theme by name
export const getThemeByName = (themeName) => {
  switch (themeName) {
    case THEMES.LIGHT:
      return lightTheme
    case THEMES.DARK:
      return darkTheme
    case THEMES.CYBERPUNK:
      return cyberpunkTheme
    case THEMES.CYBERPUNK_TURBO:
      return cyberpunkTurboTheme
    default:
      return darkTheme
  }
}

// Generate CSS variables from theme
export const generateCssVariables = (theme) => {
  return Object.entries(theme).map(([key, value]) => `--${key}: ${value};`).join('\\n')
}

// Apply theme to document
export const applyTheme = (themeName) => {
  const theme = getThemeByName(themeName)
  const root = document.documentElement
  
  Object.entries(theme).forEach(([key, value]) => {
    if (typeof value === 'string') {
      root.style.setProperty(`--${key}`, value)
    }
  })
  
  // Set data attributes for special effects
  root.setAttribute('data-theme', themeName)
  root.setAttribute('data-crt-effect', theme.crtEffect ? 'true' : 'false')
  root.setAttribute('data-text-glow', theme.textGlow ? 'true' : 'false')
}
