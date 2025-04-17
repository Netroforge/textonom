import { createGlobalStyle, css } from 'styled-components'

export type ThemeType = 'light' | 'dark' | 'cyberpunk' | 'cyberpunkTurbo'

interface ThemeColors {
  background: string
  foreground: string
  primary: string
  secondary: string
  accent: string
  border: string
  error: string
  success: string
}

export const themes: Record<ThemeType, ThemeColors> = {
  light: {
    background: '#ffffff',
    foreground: '#333333',
    primary: '#2196f3',
    secondary: '#f5f5f5',
    accent: '#ff4081',
    border: '#e0e0e0',
    error: '#f44336',
    success: '#4caf50'
  },
  dark: {
    background: '#1e1e1e',
    foreground: '#d4d4d4',
    primary: '#569cd6',
    secondary: '#252526',
    accent: '#c586c0',
    border: '#404040',
    error: '#f48771',
    success: '#6a9955'
  },
  cyberpunk: {
    background: '#0c0c14',
    foreground: '#f0f0f0',
    primary: '#00ffff',
    secondary: '#1a1a2e',
    accent: '#ff00ff',
    border: '#2a2a4a',
    error: '#ff0055',
    success: '#00ff9f'
  },
  cyberpunkTurbo: {
    background: '#0c0c14',
    foreground: '#f0f0f0',
    primary: '#00ffff',
    secondary: '#1a1a2e',
    accent: '#ff00ff',
    border: '#2a2a4a',
    error: '#ff0055',
    success: '#00ff9f'
  }
}

// CRT effect for Cyberpunk Turbo theme
const crtEffect = css`
  &::before {
    content: "";
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 9999;
    pointer-events: none;
    background: linear-gradient(
      rgba(18, 16, 16, 0) 50%,
      rgba(0, 0, 0, 0.1) 50%
    );
    background-size: 100% 4px;
    animation: scanlines 0.2s linear infinite;
  }

  &::after {
    content: "";
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 9998;
    pointer-events: none;
    background: radial-gradient(
      ellipse at center,
      rgba(0, 0, 0, 0) 0%,
      rgba(0, 0, 0, 0.3) 90%,
      rgba(0, 0, 0, 0.5) 100%
    );
  }

  @keyframes scanlines {
    0% {
      background-position: 0 0;
    }
    100% {
      background-position: 0 4px;
    }
  }

  @keyframes flicker {
    0% {
      opacity: 0.97;
    }
    5% {
      opacity: 0.9;
    }
    10% {
      opacity: 0.97;
    }
    15% {
      opacity: 0.92;
    }
    20% {
      opacity: 0.97;
    }
    50% {
      opacity: 0.97;
    }
    55% {
      opacity: 0.95;
    }
    60% {
      opacity: 0.97;
    }
    75% {
      opacity: 0.92;
    }
    80% {
      opacity: 0.97;
    }
    100% {
      opacity: 0.97;
    }
  }

  @keyframes glitch {
    0% {
      transform: translate(0);
    }
    20% {
      transform: translate(-2px, 2px);
    }
    40% {
      transform: translate(-2px, -2px);
    }
    60% {
      transform: translate(2px, 2px);
    }
    80% {
      transform: translate(2px, -2px);
    }
    100% {
      transform: translate(0);
    }
  }
`

export const GlobalStyle = createGlobalStyle<{ theme: ThemeType }>`
  body {
    margin: 0;
    padding: 0;
    font-family: ${({ theme }) => theme === 'cyberpunkTurbo' ? "'VT323', monospace" : "'Roboto', sans-serif"};
    background-color: ${({ theme }) => themes[theme].background};
    color: ${({ theme }) => themes[theme].foreground};
    transition: background-color 0.3s, color 0.3s;
    ${({ theme }) => theme === 'cyberpunkTurbo' && crtEffect}
    animation: ${({ theme }) => theme === 'cyberpunkTurbo' ? 'flicker 0.3s infinite' : 'none'};
  }

  #root {
    height: 100vh;
    display: flex;
    flex-direction: column;
  }

  * {
    box-sizing: border-box;
  }

  /* Scrollbar styling */
  ::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }

  ::-webkit-scrollbar-track {
    background: ${({ theme }) => themes[theme].secondary};
  }

  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => themes[theme].primary};
    border-radius: 5px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => themes[theme].accent};
  }

  /* Cyberpunk Turbo glitch effect */
  ${({ theme }) => theme === 'cyberpunkTurbo' && `
    .glitch {
      animation: glitch 0.2s infinite;
      position: relative;
    }

    .glitch::before,
    .glitch::after {
      content: attr(data-text);
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }

    .glitch::before {
      left: 2px;
      text-shadow: -1px 0 ${themes.cyberpunkTurbo.accent};
      clip: rect(44px, 450px, 56px, 0);
      animation: glitch-anim 5s infinite linear alternate-reverse;
    }

    .glitch::after {
      left: -2px;
      text-shadow: -1px 0 ${themes.cyberpunkTurbo.primary};
      clip: rect(44px, 450px, 56px, 0);
      animation: glitch-anim2 5s infinite linear alternate-reverse;
    }

    @keyframes glitch-anim {
      0% {
        clip: rect(31px, 9999px, 94px, 0);
      }
      5% {
        clip: rect(70px, 9999px, 71px, 0);
      }
      10% {
        clip: rect(29px, 9999px, 83px, 0);
      }
      15% {
        clip: rect(16px, 9999px, 91px, 0);
      }
      20% {
        clip: rect(2px, 9999px, 23px, 0);
      }
      25% {
        clip: rect(46px, 9999px, 25px, 0);
      }
      30% {
        clip: rect(31px, 9999px, 88px, 0);
      }
      35% {
        clip: rect(92px, 9999px, 89px, 0);
      }
      40% {
        clip: rect(2px, 9999px, 54px, 0);
      }
      45% {
        clip: rect(99px, 9999px, 100px, 0);
      }
      50% {
        clip: rect(42px, 9999px, 27px, 0);
      }
      55% {
        clip: rect(22px, 9999px, 90px, 0);
      }
      60% {
        clip: rect(60px, 9999px, 30px, 0);
      }
      65% {
        clip: rect(87px, 9999px, 71px, 0);
      }
      70% {
        clip: rect(11px, 9999px, 47px, 0);
      }
      75% {
        clip: rect(82px, 9999px, 35px, 0);
      }
      80% {
        clip: rect(75px, 9999px, 71px, 0);
      }
      85% {
        clip: rect(54px, 9999px, 28px, 0);
      }
      90% {
        clip: rect(45px, 9999px, 24px, 0);
      }
      95% {
        clip: rect(31px, 9999px, 35px, 0);
      }
      100% {
        clip: rect(86px, 9999px, 67px, 0);
      }
    }

    @keyframes glitch-anim2 {
      0% {
        clip: rect(65px, 9999px, 65px, 0);
      }
      5% {
        clip: rect(7px, 9999px, 75px, 0);
      }
      10% {
        clip: rect(73px, 9999px, 82px, 0);
      }
      15% {
        clip: rect(98px, 9999px, 71px, 0);
      }
      20% {
        clip: rect(20px, 9999px, 49px, 0);
      }
      25% {
        clip: rect(45px, 9999px, 56px, 0);
      }
      30% {
        clip: rect(75px, 9999px, 23px, 0);
      }
      35% {
        clip: rect(79px, 9999px, 88px, 0);
      }
      40% {
        clip: rect(12px, 9999px, 15px, 0);
      }
      45% {
        clip: rect(26px, 9999px, 67px, 0);
      }
      50% {
        clip: rect(24px, 9999px, 10px, 0);
      }
      55% {
        clip: rect(67px, 9999px, 70px, 0);
      }
      60% {
        clip: rect(40px, 9999px, 31px, 0);
      }
      65% {
        clip: rect(17px, 9999px, 79px, 0);
      }
      70% {
        clip: rect(94px, 9999px, 65px, 0);
      }
      75% {
        clip: rect(65px, 9999px, 81px, 0);
      }
      80% {
        clip: rect(23px, 9999px, 22px, 0);
      }
      85% {
        clip: rect(39px, 9999px, 98px, 0);
      }
      90% {
        clip: rect(36px, 9999px, 62px, 0);
      }
      95% {
        clip: rect(82px, 9999px, 97px, 0);
      }
      100% {
        clip: rect(93px, 9999px, 21px, 0);
      }
    }
  `}
`
