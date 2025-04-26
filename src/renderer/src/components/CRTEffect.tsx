import React, { useEffect, useRef, useCallback, useState, memo } from 'react'
import './CRTEffect.css'

interface CRTEffectProps {
  children: React.ReactNode
}

const CRTEffect: React.FC<CRTEffectProps> = ({ children }): React.ReactElement => {
  const glitchIntervalRef = useRef<number | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const [isVisible, setIsVisible] = useState(true)

  // Basic glitch effect
  const createBasicGlitch = useCallback((duration: number): void => {
    const glitchElement = document.querySelector('.crt-glitch-overlay') as HTMLElement
    if (!glitchElement) {
      return
    }

    // Apply random transform - more pronounced
    const xOffset = Math.random() * 15 - 7.5 // Increased range
    glitchElement.style.transform = `translateX(${xOffset}px)`

    // Apply random clip path - more visible
    const top = Math.random() * 15 // Increased range
    const bottom = 100 - Math.random() * 15 // Increased range
    glitchElement.style.clipPath = `polygon(0 ${top}%, 100% ${top}%, 100% ${bottom}%, 0 ${bottom}%)`

    // Make sure the element is visible
    glitchElement.style.display = 'block'

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
  }, [])

  // Horizontal glitch effect
  const createHorizontalGlitch = useCallback((duration: number): void => {
    const element = document.querySelector('.crt-horizontal-glitch') as HTMLElement
    if (!element) {
      return
    }

    // Make element visible
    element.style.display = 'block'

    // Create 3-7 horizontal glitch lines (increased from 2-5)
    const numLines = Math.floor(Math.random() * 5) + 3
    let html = ''

    for (let i = 0; i < numLines; i++) {
      const glitchY = Math.random() * 100
      const glitchHeight = Math.random() * 10 + 3 // Increased size
      const glitchAlpha = Math.random() * 0.6 + 0.4 // Increased opacity
      const offsetX = Math.random() < 0.5 ? Math.random() * 30 : 0
      const glitchWidth = 100 - offsetX

      // Add animation for more noticeable effect
      const animationDuration = Math.random() * 0.2 + 0.1
      const animationDelay = Math.random() * 0.1

      html += `<div style="
        position: absolute;
        top: ${glitchY}%;
        left: ${offsetX}%;
        width: ${glitchWidth}%;
        height: ${glitchHeight}px;
        background-color: white;
        opacity: ${glitchAlpha.toFixed(2)};
        z-index: 10;
        will-change: transform, opacity;
        animation: glitch-flicker ${animationDuration}s ease-in-out ${animationDelay}s;
      "></div>`

      // More frequently add a second line close to the first (increased from 0.4 to 0.6)
      if (Math.random() < 0.6) {
        const secondLineOffset = Math.random() * 5 + 1
        html += `<div style="
          position: absolute;
          top: calc(${glitchY}% + ${glitchHeight}px + ${secondLineOffset}px);
          left: ${offsetX}%;
          width: ${glitchWidth * 0.9}%;
          height: ${glitchHeight * 0.8}px;
          background-color: white;
          opacity: ${(glitchAlpha * 0.8).toFixed(2)};
          z-index: 10;
          will-change: transform, opacity;
          animation: glitch-flicker ${animationDuration * 1.2}s ease-in-out ${animationDelay * 1.5}s;
        "></div>`
      }
    }

    // Add a style tag for the animation
    html += `<style>
      @keyframes glitch-flicker {
        0% { opacity: 1; }
        50% { opacity: 0.7; }
        100% { opacity: 1; }
      }
    </style>`

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
  }, [])

  // Color shift artifacts
  const createColorShift = useCallback((duration: number): void => {
    const element = document.querySelector('.crt-color-shift') as HTMLElement
    if (!element) {
      return
    }

    // Make element visible
    element.style.display = 'block'

    const shiftX = Math.random() * 70
    const shiftY = Math.random() * 100
    const shiftWidth = Math.random() * 25 + 20 // Increased size
    const shiftHeight = Math.random() * 50 + 20 // Increased size

    // Choose which color channel to shift
    const colorIndex = Math.floor(Math.random() * 5)
    const colors = [
      'rgba(255, 0, 0, 0.35)', // Red (increased opacity)
      'rgba(0, 255, 0, 0.35)', // Green (increased opacity)
      'rgba(0, 0, 255, 0.35)', // Blue (increased opacity)
      'rgba(0, 255, 255, 0.35)', // Cyan (increased opacity)
      'rgba(255, 0, 255, 0.35)' // Magenta (increased opacity)
    ]
    const shiftColor = colors[colorIndex]

    // Add animation for more noticeable effect
    const animationDuration = Math.random() * 0.3 + 0.2
    const animationDelay = Math.random() * 0.1

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
      will-change: transform, opacity;
      animation: color-shift-pulse ${animationDuration}s ease-in-out ${animationDelay}s;
    "></div>`

    // Add complementary color shift - more frequently (increased from 0.7 to 0.9)
    if (Math.random() < 0.9) {
      const complementaryColors = [
        'rgba(0, 255, 255, 0.3)', // Cyan (complement to Red) (increased opacity)
        'rgba(255, 0, 255, 0.3)', // Magenta (complement to Green) (increased opacity)
        'rgba(255, 255, 0, 0.3)', // Yellow (complement to Blue) (increased opacity)
        'rgba(255, 0, 0, 0.3)', // Red (complement to Cyan) (increased opacity)
        'rgba(0, 255, 0, 0.3)' // Green (complement to Magenta) (increased opacity)
      ]
      const compColor = complementaryColors[colorIndex]

      const offsetX = Math.random() * 35 - 17.5 // Increased range

      // Add a different animation for the complementary color
      const compAnimationDuration = Math.random() * 0.4 + 0.3
      const compAnimationDelay = Math.random() * 0.15

      element.innerHTML += `<div style="
        position: absolute;
        top: calc(${shiftY}% + ${shiftHeight}px + ${Math.random() * 20}px);
        left: calc(${shiftX}% + ${offsetX}px);
        width: ${shiftWidth * 0.95}%;
        height: ${shiftHeight * 0.9}px;
        background-color: ${compColor};
        mix-blend-mode: screen;
        z-index: 10;
        will-change: transform, opacity;
        animation: color-shift-pulse ${compAnimationDuration}s ease-in-out ${compAnimationDelay}s;
      "></div>`
    }

    // Add a style tag for the animation
    element.innerHTML += `<style>
      @keyframes color-shift-pulse {
        0% { opacity: 1; transform: translateX(0); }
        25% { opacity: 0.8; transform: translateX(2px); }
        50% { opacity: 1; transform: translateX(-1px); }
        75% { opacity: 0.9; transform: translateX(1px); }
        100% { opacity: 1; transform: translateX(0); }
      }
    </style>`

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
  }, [])

  // Create a random glitch effect using requestAnimationFrame for better performance
  const createGlitch = useCallback((): void => {
    // Check if CRT effect is active and element is visible
    const crtEffectValue = document.documentElement.getAttribute('data-crt-effect')

    if (crtEffectValue !== 'true' || !isVisible) {
      return
    }

    // Determine which type of glitch to create - rarely create multiple glitches
    const createMultiple = Math.random() < 0.15 // 15% chance

    if (createMultiple) {
      // Create 2 different glitch effects simultaneously for more dramatic effect
      const firstType = Math.floor(Math.random() * 3)
      let secondType = Math.floor(Math.random() * 3)
      // Make sure second type is different from first
      while (secondType === firstType) {
        secondType = Math.floor(Math.random() * 3)
      }

      // Longer durations for each glitch
      const duration1 = 200 + Math.random() * 400 // Increased from 150-500ms to 200-600ms
      const duration2 = 150 + Math.random() * 300 // Increased from 100-350ms to 150-450ms

      // Create both glitches with slight delay between them
      switch (firstType) {
        case 0:
          createBasicGlitch(duration1)
          break
        case 1:
          createHorizontalGlitch(duration1)
          break
        case 2:
          createColorShift(duration1)
          break
      }

      // Small delay for second glitch
      setTimeout(() => {
        switch (secondType) {
          case 0:
            createBasicGlitch(duration2)
            break
          case 1:
            createHorizontalGlitch(duration2)
            break
          case 2:
            createColorShift(duration2)
            break
        }
      }, 50)
    } else {
      // Create a single glitch effect (original behavior)
      const glitchType = Math.floor(Math.random() * 3)
      const duration = 200 + Math.random() * 450 // Increased from 150-500ms to 200-650ms

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
  }, [isVisible, createBasicGlitch, createHorizontalGlitch, createColorShift])

  // Set up a MutationObserver to watch for changes to the data-crt-effect attribute
  useEffect(() => {
    // Create a function to set up the glitch interval
    const setupGlitchIntervalFn = (visible: boolean): void => {
      if (glitchIntervalRef.current) {
        clearInterval(glitchIntervalRef.current)
      }

      // Set interval for glitch effects - less frequent
      const interval = 1000 // 1 second

      glitchIntervalRef.current = window.setInterval(() => {
        // Only create glitches if visible
        if (!visible) return

        // Reduced probability of glitches
        if (Math.random() < 0.3) {
          // Use requestAnimationFrame for smoother animation
          if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current)
          }

          // Force a glitch immediately every few intervals to ensure they appear
          const forceGlitch = Math.random() < 0.1 // Reduced from 0.2 to 0.1 (10% chance)
          if (forceGlitch) {
            // Create a glitch immediately
            createGlitch()
          } else {
            // Schedule glitch through animation frame
            animationFrameRef.current = requestAnimationFrame(createGlitch)
          }
        }
      }, interval)
    }

    // Function to handle CRT effect changes
    const handleCrtEffectChange = (): void => {
      const crtEffectValue = document.documentElement.getAttribute('data-crt-effect')

      if (crtEffectValue === 'true') {
        // Always assume visible for consistent behavior
        setIsVisible(true)

        // Force display of glitch elements
        document
          .querySelectorAll('.crt-glitch-overlay, .crt-horizontal-glitch, .crt-color-shift')
          .forEach((element) => {
            if (element instanceof HTMLElement) {
              element.style.display = 'block'
            }
          })

        // Create an initial glitch after a slightly longer delay
        setTimeout(() => {
          // Only create initial glitch with 50% probability
          if (Math.random() < 0.5) {
            createGlitch()
          }
        }, 1000) // 1000ms

        // Set up glitch interval
        setupGlitchIntervalFn(true)
      } else {
        // Clean up any existing intervals
        if (glitchIntervalRef.current) {
          clearInterval(glitchIntervalRef.current)
          glitchIntervalRef.current = null
        }
      }
    }

    // Set up mutation observer to watch for attribute changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-crt-effect') {
          handleCrtEffectChange()
        }
      })
    })

    // Start observing
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-crt-effect']
    })

    // Check initial state
    const initialCrtEffectValue = document.documentElement.getAttribute('data-crt-effect')

    if (initialCrtEffectValue === 'true') {
      handleCrtEffectChange()
    }

    // Clean up observer on unmount
    return () => {
      observer.disconnect()
      if (glitchIntervalRef.current) {
        clearInterval(glitchIntervalRef.current)
      }
    }
  }, [createGlitch])

  // Set up a separate useEffect for initial glitch creation
  useEffect(() => {
    // Create an initial glitch with reduced probability
    const initialGlitchTimeout = setTimeout(() => {
      // Only create initial glitch with 50% probability
      if (Math.random() < 0.5) {
        try {
          createGlitch()
        } catch (error) {
          console.error('ERROR CREATING INITIAL GLITCH:', error)
        }
      }

      // Force a direct glitch creation without using the callback, but with reduced probability
      if (Math.random() < 0.3) {
        // Only 30% chance to create direct glitch
        try {
          // Try to create a basic glitch directly
          const glitchElement = document.querySelector('.crt-glitch-overlay') as HTMLElement
          if (glitchElement) {
            glitchElement.style.display = 'block'
            glitchElement.style.transform = 'translateX(10px)'

            // Reset after 600ms
            setTimeout(() => {
              glitchElement.style.transform = 'translateX(0)'
            }, 600)
          } else {
            console.error('DIRECT GLITCH CREATION FAILED - ELEMENT NOT FOUND')
          }
        } catch (directError) {
          console.error('ERROR IN DIRECT GLITCH CREATION:', directError)
        }
      }
    }, 1000)

    return () => {
      clearTimeout(initialGlitchTimeout)
    }
  }, [createGlitch])

  // Force display of glitch elements if CRT effect is enabled
  useEffect(() => {
    // Check if CRT effect is enabled
    const crtEffectEnabled = document.documentElement.getAttribute('data-crt-effect') === 'true'

    if (crtEffectEnabled) {
      // Force display of glitch elements
      const glitchElements = document.querySelectorAll(
        '.crt-glitch-overlay, .crt-horizontal-glitch, .crt-color-shift'
      )
      glitchElements.forEach((element) => {
        if (element instanceof HTMLElement) {
          element.style.display = 'block'
        }
      })

      // Create an initial glitch with reduced probability
      setTimeout(() => {
        // Only create initial glitch with 50% probability
        if (Math.random() < 0.5) {
          createGlitch()
        }
      }, 1500) // Increased from 1000ms to 1500ms
    }
  }, [createGlitch])

  return (
    <div className="crt-container crt-flicker">
      <div className="crt-content">{children}</div>
      {/* Add inline styles to force display when CRT effect is enabled */}
      <div className="crt-glitch-overlay" data-text="GLITCH" style={{ display: 'block' }}></div>
      <div className="crt-scanlines"></div>
      <div className="crt-rgb-separation"></div>
      <div className="crt-vignette"></div>
      <div className="crt-glow"></div>
      <div className="crt-flicker-overlay"></div>
      <div className="crt-horizontal-glitch" style={{ display: 'block' }}></div>
      <div className="crt-color-shift" style={{ display: 'block' }}></div>
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
