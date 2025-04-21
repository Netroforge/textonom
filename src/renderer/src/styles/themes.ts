import { THEMES, useSettingsStore } from '../store/settingsStore'
import type { ThemeType } from '../types'

interface Theme {
  primary: string
  primaryDark: string
  secondary: string
  background: string
  surface: string
  surfaceHover: string
  text: string
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
  textGlow?: boolean
}

// Light theme colors
export const lightTheme: Theme = {
  primary: '#007bff',
  primaryDark: '#0069d9',
  secondary: '#6c757d',
  background: '#ffffff',
  surface: '#f8f9fa',
  surfaceHover: '#e9ecef',
  text: '#212529',
  border: '#dee2e6',
  divider: '#e9ecef',
  error: '#dc3545',
  success: '#28a745',
  warning: '#ffc107',
  info: '#17a2b8',
  infoDark: '#138496',
  inputBackground: '#ffffff',
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
export const darkTheme: Theme = {
  primary: '#0d6efd',
  primaryDark: '#0b5ed7',
  secondary: '#6c757d',
  background: '#212529',
  surface: '#343a40',
  surfaceHover: '#495057',
  text: '#f8f9fa',
  border: '#495057',
  divider: '#343a40',
  error: '#dc3545',
  success: '#28a745',
  warning: '#ffc107',
  info: '#17a2b8',
  infoDark: '#138496',
  inputBackground: '#2a2e33',
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
export const cyberpunkTheme: Theme = {
  primary: '#ff00ff', // Magenta
  primaryDark: '#cc00cc', // Darker magenta
  secondary: '#00ffff', // Cyan
  background: '#0a0a16', // Dark blue-black
  surface: '#1a1a2e', // Dark blue
  surfaceHover: '#2a2a4e', // Lighter blue
  text: '#00ffff', // Cyan
  border: '#ff00ff', // Magenta
  divider: '#1a1a2e', // Dark blue
  error: '#ff0055', // Neon red
  success: '#00ff9f', // Neon green
  warning: '#ffcc00', // Neon yellow
  info: '#00ffff', // Cyan
  infoDark: '#00cccc', // Darker cyan
  inputBackground: '#12122a', // Dark blue with slight purple tint
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
  const settingsStore = useSettingsStore()
  const root = document.documentElement

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

  // Set data attributes for special effects
  root.setAttribute('data-theme', themeName)
  root.setAttribute('data-crt-effect', settingsStore.turboMode ? 'true' : 'false')
  root.setAttribute('data-text-glow', theme.textGlow ? 'true' : 'false')
}
