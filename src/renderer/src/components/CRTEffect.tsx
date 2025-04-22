import React, { useEffect, useRef } from 'react'
import { useSettingsStore } from '../stores/settingsStore'
import './CRTEffect.css'

interface CRTEffectProps {
  children: React.ReactNode
}

const CRTEffect: React.FC<CRTEffectProps> = ({ children }) => {
  const { settings } = useSettingsStore()
  const glitchTimerRef = useRef<number | null>(null)

  // Set up glitch effects
  useEffect(() => {
    // Only run effects if CRT effect is enabled
    if (!settings.crtEffect) return

    // Create random glitches at random intervals
    const createGlitches = (): void => {
      // Random interval between 2-10 seconds
      const interval = 2000 + Math.random() * 8000

      // Create a glitch
      createGlitch()

      // Schedule next glitch
      glitchTimerRef.current = window.setTimeout(createGlitches, interval)
    }

    // Start the glitch cycle
    createGlitches()

    // Clean up on unmount
    return () => {
      if (glitchTimerRef.current !== null) {
        clearTimeout(glitchTimerRef.current)
      }
    }
  }, [settings.crtEffect])

  // Create a random glitch effect
  const createGlitch = (): void => {
    // Check if CRT effect is active
    if (!settings.crtEffect) return

    // Determine which type of glitch to create
    const glitchType = Math.floor(Math.random() * 3)

    // Duration for the glitch effect
    const duration = 100 + Math.random() * 300

    switch (glitchType) {
      case 0:
        createBasicGlitch(duration)
        break
      case 1:
        createHorizontalGlitch(duration)
        break
      case 2:
        createColorShift(duration)
        break
    }
  }

  // Basic glitch effect
  const createBasicGlitch = (duration: number): void => {
    const glitchElement = document.querySelector('.crt-glitch-overlay') as HTMLElement
    if (!glitchElement) return

    // Apply random transform
    const xOffset = Math.random() * 10 - 5
    glitchElement.style.transform = `translateX(${xOffset}px)`

    // Apply random clip path
    const top = Math.random() * 10
    const bottom = 100 - Math.random() * 10
    glitchElement.style.clipPath = `polygon(0 ${top}%, 100% ${top}%, 100% ${bottom}%, 0 ${bottom}%)`

    // Reset after a short time
    setTimeout(() => {
      glitchElement.style.transform = 'translateX(0)'
      glitchElement.style.clipPath = 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
    }, duration)
  }

  // Horizontal glitch effect
  const createHorizontalGlitch = (duration: number): void => {
    const glitchElement = document.querySelector('.crt-horizontal-glitch') as HTMLElement
    if (!glitchElement) return

    // Make the element visible
    glitchElement.style.display = 'block'

    // Apply random height and position
    const height = 2 + Math.random() * 10
    const top = Math.random() * 90
    glitchElement.style.height = `${height}px`
    glitchElement.style.top = `${top}%`

    // Apply random transform
    const xOffset = Math.random() * 20 - 10
    glitchElement.style.transform = `translateX(${xOffset}px)`

    // Reset after a short time
    setTimeout(() => {
      glitchElement.style.display = 'none'
      glitchElement.style.transform = 'translateX(0)'
    }, duration)
  }

  // Color shift glitch effect
  const createColorShift = (duration: number): void => {
    const glitchElement = document.querySelector('.crt-color-shift') as HTMLElement
    if (!glitchElement) return

    // Make the element visible
    glitchElement.style.display = 'block'

    // Apply random color shift
    const redOffset = Math.random() * 10 - 5
    const greenOffset = Math.random() * 10 - 5
    const blueOffset = Math.random() * 10 - 5
    glitchElement.style.textShadow = `
      ${redOffset}px 0 rgba(255, 0, 0, 0.5),
      ${greenOffset}px 0 rgba(0, 255, 0, 0.5),
      ${blueOffset}px 0 rgba(0, 0, 255, 0.5)
    `

    // Reset after a short time
    setTimeout(() => {
      glitchElement.style.display = 'none'
      glitchElement.style.textShadow = 'none'
    }, duration)
  }

  return (
    <div className={`crt-container ${settings.crtEffect ? 'crt-flicker' : ''}`}>
      <div className="crt-content">{children}</div>
      <div className="crt-glitch-overlay" data-text="GLITCH"></div>
      <div className="crt-scanlines"></div>
      <div className="crt-rgb-separation"></div>
      <div className="crt-vignette"></div>
      <div className="crt-glow"></div>
      <div className="crt-flicker-overlay"></div>
      <div className="crt-horizontal-glitch"></div>
      <div className="crt-color-shift"></div>
      <div className="crt-static-noise"></div>
      <div className="crt-vertical-sync"></div>
      <div className="crt-signal-jitter"></div>
      <div className="crt-digital-corruption"></div>
      <div className="crt-scan-distortion"></div>
      <div className="crt-text-corruption"></div>
      <div className="crt-pixel-displacement"></div>
    </div>
  )
}

export default CRTEffect
