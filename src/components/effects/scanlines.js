import {drawLine} from './effectUtils';

/**
 * Draws scanlines over the content with a more authentic CRT look.
 *
 * @param {CanvasRenderingContext2D} ctx - The canvas context
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 * @param {number} alpha - Base alpha value for scanlines
 */
export const drawScanlines = (ctx, width, height, alpha = 0.15) => {
  // For green phosphor CRT look, we want more pronounced horizontal scanlines
  const scanlineHeight = 1.0;
  const scanlineSpacing = 4; // Slightly wider spacing
  const scanlineColor = `rgba(0, 0, 0, ${alpha * 1.5})`;

  // Draw horizontal scanlines with varying intensity
  let y = 0;
  while (y < height) {
    // Calculate varying intensity based on position
    const intensityVariation = (Math.sin(y * 0.1) * 0.1 + 0.9);
    const lineAlpha = alpha * intensityVariation * 1.5;

    // Draw main scanline - solid line for green phosphor look
    drawLine(
      ctx,
      0,
      y,
      width,
      y,
      `rgba(0, 0, 0, ${lineAlpha})`,
      scanlineHeight
    );

    y += scanlineSpacing;
  }
};
