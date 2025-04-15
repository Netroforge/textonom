import React, {useEffect, useRef} from 'react';
import styled from 'styled-components';
import {drawEdgeDarkening, drawRandomGlitches, drawRgbSeparation, drawScanlines, drawScreenGlow} from './effects';
import {clearCanvas} from './effects/effectUtils';

const CRTContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 100;
  overflow: hidden;
`;

// Canvas for scanlines and other static effects
const StaticEffectsCanvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 101;
  opacity: 0.5;
  pointer-events: none;
`;

// Canvas for dynamic glitch effects
const GlitchCanvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 102;
  opacity: 0.3;
  pointer-events: none;
`;

const CRTEffect = () => {
  const staticCanvasRef = useRef(null);
  const glitchCanvasRef = useRef(null);
  const requestRef = useRef(null);
  const timeRef = useRef(0);
  const flickerElementRef = useRef(null);

  // Initialize and animate effects
  useEffect(() => {
    const staticCanvas = staticCanvasRef.current;
    const glitchCanvas = glitchCanvasRef.current;
    const staticCtx = staticCanvas.getContext('2d');
    const glitchCtx = glitchCanvas.getContext('2d');

    // Set canvas size to match container
    const resizeCanvas = () => {
      staticCanvas.width = staticCanvas.offsetWidth;
      staticCanvas.height = staticCanvas.offsetHeight;
      glitchCanvas.width = glitchCanvas.offsetWidth;
      glitchCanvas.height = glitchCanvas.offsetHeight;

      // Redraw static effects when resized
      drawStaticEffects(staticCtx, staticCanvas.width, staticCanvas.height);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Draw static effects (scanlines, edge darkening, screen glow)
    function drawStaticEffects(ctx, width, height) {
      clearCanvas(ctx, width, height);

      // Draw scanlines
      drawScanlines(ctx, width, height, 0.15);

      // Draw edge darkening
      drawEdgeDarkening(ctx, width, height, 0.2);

      // Draw screen glow
      drawScreenGlow(ctx, width, height);
    }

    // Draw initial static effects
    drawStaticEffects(staticCtx, staticCanvas.width, staticCanvas.height);

    // Draw dynamic glitch effects
    function drawGlitchEffects(ctx, width, height, time) {
      clearCanvas(ctx, width, height);

      // Draw RGB separation (chromatic aberration)
      drawRgbSeparation(ctx, width, height);

      // Draw random glitches
      drawRandomGlitches(ctx, width, height, 0.015);
    }

    // Screen flicker effect
    const flickerElement = document.createElement('div');
    flickerElement.style.position = 'absolute';
    flickerElement.style.top = '0';
    flickerElement.style.left = '0';
    flickerElement.style.right = '0';
    flickerElement.style.bottom = '0';
    flickerElement.style.backgroundColor = 'rgba(0, 0, 0, 0)';
    flickerElement.style.zIndex = '103';
    flickerElement.style.pointerEvents = 'none';
    flickerElement.style.transition = 'background-color 0.05s ease';

    glitchCanvas.parentNode.appendChild(flickerElement);
    flickerElementRef.current = flickerElement;

    // Flicker animation
    const flicker = () => {
      if (Math.random() < 0.01) {
        const opacity = Math.random() * 0.25 + 0.05;

        // Occasionally use a color tint instead of just darkening
        if (Math.random() < 0.3) {
          const colorChoice = Math.floor(Math.random() * 3);
          let color;

          switch (colorChoice) {
            case 0:
              color = `rgba(0, 255, 255, ${opacity * 0.3})`; // Cyan tint
              break;
            case 1:
              color = `rgba(255, 0, 255, ${opacity * 0.3})`; // Magenta tint
              break;
            case 2:
            default:
              color = `rgba(0, 0, 0, ${opacity})`; // Standard darkening
              break;
          }

          flickerElement.style.backgroundColor = color;
        } else {
          flickerElement.style.backgroundColor = `rgba(0, 0, 0, ${opacity})`;
        }

        // Vary the duration of the flicker
        const duration = Math.random() < 0.7 ? 50 : Math.floor(Math.random() * 150) + 30;

        setTimeout(() => {
          if (flickerElement.parentNode) {
            flickerElement.style.backgroundColor = 'rgba(0, 0, 0, 0)';
          }
        }, duration);
      }
    };

    // Animation loop with reduced frequency
    let frameCount = 0;
    const animate = (time) => {
      if (timeRef.current === 0) {
        timeRef.current = time;
      }

      const elapsed = time - timeRef.current;
      timeRef.current = time;

      // Only draw glitch effects every few frames to reduce frequency
      frameCount++;
      if (frameCount % 60 === 0) { // Only update every 8th frame
        drawGlitchEffects(glitchCtx, glitchCanvas.width, glitchCanvas.height, time);
      }

      // Flicker effect
      if (elapsed > 300) {
        flicker();
      }

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    // Clean up
    return () => {
      cancelAnimationFrame(requestRef.current);
      window.removeEventListener('resize', resizeCanvas);
      if (flickerElementRef.current && flickerElementRef.current.parentNode) {
        flickerElementRef.current.parentNode.removeChild(flickerElementRef.current);
      }
    };
  }, []);

  return (
    <CRTContainer>
      <StaticEffectsCanvas ref={staticCanvasRef} />
      <GlitchCanvas ref={glitchCanvasRef} />
    </CRTContainer>
  );
};

export default CRTEffect;
