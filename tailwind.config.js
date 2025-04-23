/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/renderer/src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      borderWidth: {
        3: '3px'
      },
      colors: {
        // Theme colors using CSS variables for theme switching
        primary: 'var(--primary)',
        'primary-rgb': 'var(--primaryRgb)',
        'primary-dark': 'var(--primaryDark)',
        secondary: 'var(--secondary)',
        'secondary-rgb': 'var(--secondaryRgb)',
        background: 'var(--background)',
        surface: 'var(--surface)',
        'surface-hover': 'var(--surfaceHover)',
        text: 'var(--text)',
        border: 'var(--border)',
        divider: 'var(--divider)',
        error: 'var(--error)',
        'error-rgb': 'var(--errorRgb)',
        success: 'var(--success)',
        'success-rgb': 'var(--successRgb)',
        warning: 'var(--warning)',
        'warning-rgb': 'var(--warningRgb)',
        info: 'var(--info)',
        'info-rgb': 'var(--infoRgb)',
        'info-dark': 'var(--infoDark)',
        'button-text': 'var(--buttonText)',
        'input-background': 'var(--inputBackground)',
        'title-bar-background': 'var(--titleBarBackground)',
        'title-bar-text': 'var(--titleBarText)',
        'title-bar-control-hover': 'var(--titleBarControlHover)',
        'title-bar-close-hover': 'var(--titleBarCloseHover)',
        'tab-background': 'var(--tabBackground)',
        'tab-text': 'var(--tabText)',
        'tab-active-background': 'var(--tabActiveBackground)',
        'tab-active-text': 'var(--tabActiveText)',
        'tab-active-border': 'var(--tabActiveBorder)',
        'scrollbar-track': 'var(--scrollbarTrack)',
        'scrollbar-thumb': 'var(--scrollbarThumb)'
      },
      fontFamily: {
        sans: ['var(--fontFamily)']
      },
      fontSize: {
        base: 'var(--fontSize)'
      },
      spacing: {
        'title-bar-height': '30px',
        'tab-bar-height': '42px',
        'status-bar-height': '24px'
      },
      animationDelay: {
        0: '0ms',
        500: '500ms',
        1000: '1000ms'
      },
      animation: {
        pulse: 'pulse 1.5s infinite',
        fadeIn: 'fadeIn 0.3s ease-out forwards',
        scaleIn: 'scaleIn 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
        glitch: 'glitch 1s infinite'
      },
      keyframes: {
        pulse: {
          '0%, 100%': { opacity: 0.8 },
          '50%': { opacity: 1 }
        },
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 }
        },
        scaleIn: {
          from: { transform: 'scale(0.8)', opacity: 0 },
          to: { transform: 'scale(1)', opacity: 1 }
        },
        glitch: {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-3px, 3px)' },
          '40%': { transform: 'translate(-3px, -3px)' },
          '60%': { transform: 'translate(3px, 3px)' },
          '80%': { transform: 'translate(3px, -3px)' }
        },
        'glitch-offset': {
          '0%, 100%': { clipPath: 'inset(0 0 0 0)' },
          '10%': { clipPath: 'inset(0 0 20% 0)' },
          '20%': { clipPath: 'inset(20% 0 0 0)' },
          '30%': { clipPath: 'inset(0 20% 0 0)' },
          '40%': { clipPath: 'inset(0 0 0 20%)' },
          '50%': { clipPath: 'inset(10% 10% 10% 10%)' }
        },
        rotate: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' }
        }
      }
    }
  },
  plugins: [
    function ({ addUtilities, theme }) {
      const animationDelayUtilities = Object.entries(theme('animationDelay')).map(
        ([key, value]) => {
          return {
            [`.animation-delay-${key}`]: {
              'animation-delay': value
            }
          }
        }
      )
      addUtilities(animationDelayUtilities)
    }
  ]
}
