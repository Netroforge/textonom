import React, { useEffect, useRef } from 'react';
import '../styles/CRTEffect.css';

const CRTEffect: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestIdRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to match container
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Variables for animation effects
    let time = 0;
    let glitchTimeout = 0;
    let glitchActive = false;

    // Main animation loop
    const animate = () => {
      time += 0.01;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw scanlines
      drawScanlines(ctx, canvas.width, canvas.height);

      // Apply screen flicker
      applyScreenFlicker(ctx, canvas.width, canvas.height, time);

      // Randomly trigger glitch effects
      if (!glitchActive && Math.random() < 0.005) {
        glitchActive = true;
        glitchTimeout = Math.floor(Math.random() * 10) + 5;
      }

      if (glitchActive) {
        applyGlitchEffect(ctx, canvas.width, canvas.height);
        glitchTimeout--;
        if (glitchTimeout <= 0) {
          glitchActive = false;
        }
      }

      // Apply edge darkening
      applyEdgeDarkening(ctx, canvas.width, canvas.height);

      // Continue animation loop
      requestIdRef.current = requestAnimationFrame(animate);
    };

    // Start animation
    requestIdRef.current = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      cancelAnimationFrame(requestIdRef.current);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  // Draw scanlines
  const drawScanlines = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.fillStyle = 'rgba(0, 0, 0, var(--scanline-opacity))';
    for (let y = 0; y < height; y += 2) {
      ctx.fillRect(0, y, width, 1);
    }
  };

  // Apply screen flicker
  const applyScreenFlicker = (ctx: CanvasRenderingContext2D, width: number, height: number, time: number) => {
    const flickerIntensity = Math.sin(time * 2) * 0.5 + 0.5;
    ctx.fillStyle = `rgba(0, 0, 0, ${flickerIntensity * 0.05})`;
    ctx.fillRect(0, 0, width, height);
  };

  // Apply glitch effect
  const applyGlitchEffect = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Horizontal line glitches
    const numGlitches = Math.floor(Math.random() * 5) + 1;

    for (let i = 0; i < numGlitches; i++) {
      const y = Math.floor(Math.random() * height);
      const h = Math.floor(Math.random() * 5) + 1;
      const offset = Math.floor(Math.random() * 20) - 10;

      ctx.fillStyle = 'rgba(0, 255, 255, 0.5)';
      ctx.fillRect(0, y, width, h);

      // Color shift
      ctx.fillStyle = 'rgba(255, 0, 255, 0.3)';
      ctx.fillRect(offset, y, width, h);
    }

    // Static noise
    if (Math.random() < 0.3) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      for (let i = 0; i < 100; i++) {
        const x = Math.floor(Math.random() * width);
        const y = Math.floor(Math.random() * height);
        const size = Math.floor(Math.random() * 3) + 1;
        ctx.fillRect(x, y, size, size);
      }
    }
  };

  // Apply edge darkening
  const applyEdgeDarkening = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const gradient = ctx.createRadialGradient(
      width / 2, height / 2, Math.min(width, height) * 0.4,
      width / 2, height / 2, Math.max(width, height) * 0.7
    );

    gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
    gradient.addColorStop(1, `rgba(0, 0, 0, var(--edge-darkness))`);

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Add subtle cyan glow
    const glowGradient = ctx.createRadialGradient(
      width / 2, height / 2, 0,
      width / 2, height / 2, Math.max(width, height) * 0.7
    );

    glowGradient.addColorStop(0, 'var(--glow-color)');
    glowGradient.addColorStop(1, 'rgba(0, 255, 255, 0)');

    ctx.fillStyle = glowGradient;
    ctx.fillRect(0, 0, width, height);
  };

  return <canvas ref={canvasRef} className="crt-effect" />;
};

export default CRTEffect;
