import React, { useEffect, useRef, useCallback, useState, memo } from 'react'
import './CRTEffect.css'

interface CRTEffectProps {
  children: React.ReactNode
}

const CRTEffect: React.FC<CRTEffectProps> = ({ children }): React.ReactElement => {
  const glitchIntervalRef = useRef<number | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const [isVisible, setIsVisible] = useState(true)

  // Create a random glitch effect using requestAnimationFrame for better performance
  const createGlitch = useCallback((): void => {
    // Check if CRT effect is active and element is visible
    if (document.documentElement.getAttribute('data-crt-effect') !== 'true' || !isVisible) return

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
  }, [isVisible]) // Dependencies include visibility state

  // Set up glitch effects with requestAnimationFrame and throttling
  useEffect(() => {
    // Only set up effects if CRT effect is enabled
    if (document.documentElement.getAttribute('data-crt-effect') !== 'true') return

    // Check if element is visible using Intersection Observer
    const observer = new IntersectionObserver(
      (entries) => {
        setIsVisible(entries[0].isIntersecting)
      },
      { threshold: 0.1 }
    )

    // Observe the container element
    const container = document.querySelector('.crt-container')
    if (container) {
      observer.observe(container)
    }

    // Create random glitches with throttling
    const setupGlitchInterval = (): void => {
      if (glitchIntervalRef.current) {
        clearInterval(glitchIntervalRef.current)
      }

      // Set interval for glitch effects
      const interval = 1000 // Check every 1 second

      glitchIntervalRef.current = window.setInterval(() => {
        // Only create glitches if visible
        if (!isVisible) return

        // Only create glitches 50% of the time
        if (Math.random() < 0.5) {
          // Use requestAnimationFrame for smoother animation
          if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current)
          }
          animationFrameRef.current = requestAnimationFrame(createGlitch)
        }
      }, interval)
    }

    // Start the glitch cycle
    setupGlitchInterval()

    // Clean up on unmount
    return (): void => {
      if (glitchIntervalRef.current !== null) {
        clearInterval(glitchIntervalRef.current)
      }
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      observer.disconnect()
    }
  }, [createGlitch, isVisible])

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

    // Reset after a short time using requestAnimationFrame for better performance
    const resetTime = performance.now() + duration

    const resetGlitch = (timestamp: number): void => {
      if (timestamp >= resetTime) {
        glitchElement.style.transform = 'translateX(0)'
        glitchElement.style.clipPath = 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
      } else {
        requestAnimationFrame(resetGlitch)
      }
    }

    requestAnimationFrame(resetGlitch)
  }

  // Horizontal glitch effect
  const createHorizontalGlitch = (duration: number): void => {
    const element = document.querySelector('.crt-horizontal-glitch') as HTMLElement
    if (!element) return

    // Make element visible
    element.style.display = 'block'

    // Create 2-5 horizontal glitch lines
    const numLines = Math.floor(Math.random() * 4) + 2
    let html = ''

    for (let i = 0; i < numLines; i++) {
      const glitchY = Math.random() * 100
      const glitchHeight = Math.random() * 8 + 2
      const glitchAlpha = Math.random() * 0.5 + 0.3
      const offsetX = Math.random() < 0.5 ? Math.random() * 30 : 0
      const glitchWidth = 100 - offsetX

      html += `<div style="
        position: absolute;
        top: ${glitchY}%;
        left: ${offsetX}%;
        width: ${glitchWidth}%;
        height: ${glitchHeight}px;
        background-color: white;
        opacity: ${glitchAlpha.toFixed(2)};
        z-index: 10;
        will-change: transform; /* Hint for browser optimization */
      "></div>`

      // Sometimes add a second line close to the first
      if (Math.random() < 0.4) {
        const secondLineOffset = Math.random() * 4 + 1
        html += `<div style="
          position: absolute;
          top: calc(${glitchY}% + ${glitchHeight}px + ${secondLineOffset}px);
          left: ${offsetX}%;
          width: ${glitchWidth * 0.9}%;
          height: ${glitchHeight * 0.8}px;
          background-color: white;
          opacity: ${(glitchAlpha * 0.7).toFixed(2)};
          z-index: 10;
          will-change: transform; /* Hint for browser optimization */
        "></div>`
      }
    }

    element.innerHTML = html

    // Reset after duration using requestAnimationFrame
    const resetTime = performance.now() + duration

    const resetGlitch = (timestamp: number): void => {
      if (timestamp >= resetTime) {
        element.style.display = 'none'
        element.innerHTML = ''
      } else {
        requestAnimationFrame(resetGlitch)
      }
    }

    requestAnimationFrame(resetGlitch)
  }

  // Color shift artifacts
  const createColorShift = (duration: number): void => {
    const element = document.querySelector('.crt-color-shift') as HTMLElement
    if (!element) return

    // Make element visible
    element.style.display = 'block'

    const shiftX = Math.random() * 70
    const shiftY = Math.random() * 100
    const shiftWidth = Math.random() * 20 + 15
    const shiftHeight = Math.random() * 40 + 15

    // Choose which color channel to shift
    const colorIndex = Math.floor(Math.random() * 5)
    const colors = [
      'rgba(255, 0, 0, 0.25)', // Red
      'rgba(0, 255, 0, 0.25)', // Green
      'rgba(0, 0, 255, 0.25)', // Blue
      'rgba(0, 255, 255, 0.25)', // Cyan
      'rgba(255, 0, 255, 0.25)' // Magenta
    ]
    const shiftColor = colors[colorIndex]

    // Create the color shift element with will-change for better performance
    element.innerHTML = `<div style="
      position: absolute;
      top: ${shiftY}%;
      left: ${shiftX}%;
      width: ${shiftWidth}%;
      height: ${shiftHeight}px;
      background-color: ${shiftColor};
      mix-blend-mode: screen;
      z-index: 10;
      will-change: transform; /* Hint for browser optimization */
    "></div>`

    // Add complementary color shift
    if (Math.random() < 0.7) {
      const complementaryColors = [
        'rgba(0, 255, 255, 0.2)', // Cyan (complement to Red)
        'rgba(255, 0, 255, 0.2)', // Magenta (complement to Green)
        'rgba(255, 255, 0, 0.2)', // Yellow (complement to Blue)
        'rgba(255, 0, 0, 0.2)', // Red (complement to Cyan)
        'rgba(0, 255, 0, 0.2)' // Green (complement to Magenta)
      ]
      const compColor = complementaryColors[colorIndex]

      const offsetX = Math.random() * 30 - 15

      element.innerHTML += `<div style="
        position: absolute;
        top: calc(${shiftY}% + ${shiftHeight}px + ${Math.random() * 15}px);
        left: calc(${shiftX}% + ${offsetX}px);
        width: ${shiftWidth * 0.9}%;
        height: ${shiftHeight * 0.8}px;
        background-color: ${compColor};
        mix-blend-mode: screen;
        z-index: 10;
        will-change: transform; /* Hint for browser optimization */
      "></div>`
    }

    // Reset after duration using requestAnimationFrame
    const resetTime = performance.now() + duration

    const resetGlitch = (timestamp: number): void => {
      if (timestamp >= resetTime) {
        element.style.display = 'none'
        element.innerHTML = ''
      } else {
        requestAnimationFrame(resetGlitch)
      }
    }

    requestAnimationFrame(resetGlitch)
  }

  return (
    <div className="crt-container crt-flicker">
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

// Use React.memo to prevent unnecessary re-renders
export default memo(CRTEffect)
