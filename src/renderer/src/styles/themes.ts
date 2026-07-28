// Import theme types
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  CYBERPUNK: 'cyberpunk'
} as const

export type ThemeType = (typeof THEMES)[keyof typeof THEMES]

interface Theme {
  primary: string
  primaryDark: string
  secondary: string
  background: string
  surface: string
  surfaceHover: string
  text: string
  textSecondary: string
  border: string
  divider: string
  error: string
  success: string
  warning: string
  info: string
  infoDark: string
  inputBackground: string
  editorBackground: string
  editorForeground: string
  editorLineNumbers: string
  editorSelectionBackground: string
  editorCursor: string
  tabBackground: string
  tabActiveBackground: string
  tabHoverBackground: string
  tabActiveBorder: string
  tabText: string
  tabActiveText: string
  menuBackground: string
  menuHoverBackground: string
  menuText: string
  menuBorder: string
  scrollbarThumb: string
  scrollbarTrack: string
  buttonText: string // Text color for buttons with primary background
}

// Light theme colors
export const lightTheme: Theme = {
  primary: '#635bdb',
  primaryDark: '#5149c6',
  secondary: '#64748b',
  background: '#f6f7fb',
  surface: '#ffffff',
  surfaceHover: '#f0f2f7',
  text: '#18202e',
  textSecondary: '#697386',
  border: '#dfe3eb',
  divider: '#e8ebf1',
  error: '#dc3f50',
  success: '#16865b',
  warning: '#b7791f',
  info: '#147d92',
  infoDark: '#11697a',
  inputBackground: '#ffffff',
  editorBackground: '#fbfcfe',
  editorForeground: '#202938',
  editorLineNumbers: '#8490a4',
  editorSelectionBackground: '#dcd9ff',
  editorCursor: '#202938',
  tabBackground: '#f0f2f7',
  tabActiveBackground: '#ffffff',
  tabHoverBackground: '#e7eaf1',
  tabActiveBorder: '#635bdb',
  tabText: '#697386',
  tabActiveText: '#18202e',
  menuBackground: '#ffffff',
  menuHoverBackground: '#f0f2f7',
  menuText: '#18202e',
  menuBorder: '#dfe3eb',
  scrollbarThumb: '#b8bfcc',
  scrollbarTrack: '#eef0f5',
  buttonText: '#ffffff'
}

// Dark theme colors
export const darkTheme: Theme = {
  primary: '#8b82f6',
  primaryDark: '#786ee9',
  secondary: '#8e9aaf',
  background: '#0d1017',
  surface: '#161b25',
  surfaceHover: '#202735',
  text: '#eef1f7',
  textSecondary: '#98a3b7',
  border: '#2a3241',
  divider: '#202735',
  error: '#f06a7c',
  success: '#4fc38b',
  warning: '#f1bb62',
  info: '#5bc0d1',
  infoDark: '#45a6b8',
  inputBackground: '#111620',
  editorBackground: '#10141c',
  editorForeground: '#dfe5ef',
  editorLineNumbers: '#77839a',
  editorSelectionBackground: '#383464',
  editorCursor: '#dfe5ef',
  tabBackground: '#141923',
  tabActiveBackground: '#0f131b',
  tabHoverBackground: '#202735',
  tabActiveBorder: '#8b82f6',
  tabText: '#8f9aae',
  tabActiveText: '#eef1f7',
  menuBackground: '#1a202b',
  menuHoverBackground: '#252d3a',
  menuText: '#eef1f7',
  menuBorder: '#30394a',
  scrollbarThumb: '#465167',
  scrollbarTrack: '#151a23',
  buttonText: '#ffffff'
}

// Cyberpunk theme colors
export const cyberpunkTheme: Theme = {
  primary: '#f05ee8',
  primaryDark: '#d947d1',
  secondary: '#38dce8',
  background: '#090a14',
  surface: '#15162a',
  surfaceHover: '#222442',
  text: '#e8f2f7',
  textSecondary: '#9aa8bc',
  border: '#3a3350',
  divider: '#201f37',
  error: '#ff557d',
  success: '#42e6a4',
  warning: '#f3cf66',
  info: '#38dce8',
  infoDark: '#27bcc7',
  inputBackground: '#101124',
  editorBackground: '#090a14',
  editorForeground: '#92eef4',
  editorLineNumbers: '#d758d1',
  editorSelectionBackground: '#3d2b70',
  editorCursor: '#92eef4',
  tabBackground: '#14152a',
  tabActiveBackground: '#0d0e1c',
  tabHoverBackground: '#222442',
  tabActiveBorder: '#f05ee8',
  tabText: '#94cfd5',
  tabActiveText: '#dffbff',
  menuBackground: '#17182e',
  menuHoverBackground: '#252744',
  menuText: '#e8f2f7',
  menuBorder: '#44375c',
  scrollbarThumb: '#a345a4',
  scrollbarTrack: '#15162a',
  buttonText: '#140717'
}

// Get theme by name
export const getThemeByName = (themeName: ThemeType): Theme => {
  switch (themeName) {
    case THEMES.LIGHT:
      return lightTheme
    case THEMES.DARK:
      return darkTheme
    case THEMES.CYBERPUNK:
      return cyberpunkTheme
    default:
      return darkTheme
  }
}

// Generate CSS variables from theme
export const generateCssVariables = (theme: Theme): string => {
  return Object.entries(theme)
    .map(([key, value]) => {
      if (typeof value === 'string') {
        return `--${key}: ${value};`
      }
      return ''
    })
    .filter(Boolean)
    .join('\\n')
}

// Helper function to convert hex color to RGB values
const hexToRgb = (hex: string): string => {
  // Remove the hash if it exists
  hex = hex.replace(/^#/, '')

  // Parse the hex values
  let r, g, b
  if (hex.length === 3) {
    // Short notation (e.g., #ABC)
    r = parseInt(hex.charAt(0) + hex.charAt(0), 16)
    g = parseInt(hex.charAt(1) + hex.charAt(1), 16)
    b = parseInt(hex.charAt(2) + hex.charAt(2), 16)
  } else {
    // Full notation (e.g., #AABBCC)
    r = parseInt(hex.substring(0, 2), 16)
    g = parseInt(hex.substring(2, 4), 16)
    b = parseInt(hex.substring(4, 6), 16)
  }

  return `${r}, ${g}, ${b}`
}

// Apply theme to document
export const applyTheme = (themeName: ThemeType): void => {
  const theme = getThemeByName(themeName)
  const root = document.documentElement

  // Apply CRT effect based on settings
  try {
    const settingsString = localStorage.getItem('textonom-settings')
    if (settingsString) {
      const parsedData = JSON.parse(settingsString)
      // Settings may be nested under `state` or flat
      const settings = parsedData.state?.settings || parsedData
      const turboMode = settings.crtEffect !== undefined ? settings.crtEffect : true

      root.setAttribute('data-crt-effect', turboMode ? 'true' : 'false')
    }
  } catch (error) {
    console.error('Failed to apply effects from settings:', error)
    // Set defaults based on theme
    root.setAttribute('data-crt-effect', 'false')
  }

  // Set data attribute for theme
  root.setAttribute('data-theme', themeName)

  // Apply all theme variables
  Object.entries(theme).forEach(([key, value]) => {
    if (typeof value === 'string' && value.startsWith('#')) {
      // Set the color variable
      root.style.setProperty(`--${key}`, value)

      // Also set the RGB version for rgba() usage
      root.style.setProperty(`--${key}Rgb`, hexToRgb(value))
    } else if (typeof value === 'string') {
      root.style.setProperty(`--${key}`, value)
    }
  })
}
