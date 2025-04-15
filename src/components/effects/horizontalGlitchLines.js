import {drawRect, random, randomBool, randomCyberpunkColor, randomInt} from './effectUtils';

/**
 * Draws horizontal glitch lines (common in CRT displays).
 *
 * @param {CanvasRenderingContext2D} ctx - The canvas context
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 */
export const drawHorizontalGlitchLines = (ctx, width, height) => {
  // Draw 2-5 horizontal glitch lines
  const numLines = randomInt(2, 5);

  for (let i = 0; i < numLines; i++) {
    const glitchY = random(0, height);
    const glitchHeight = random(2, 8);
    const glitchAlpha = random(0.3, 0.8);

    // Determine if the glitch line should be offset horizontally
    const offsetX = randomBool(0.3) ? random(0, width * 0.3) : 0;
    const glitchWidth = width - offsetX;

    // White or cyberpunk color for the glitch
    const glitchColor = randomBool()
      ? `rgba(255, 255, 255, ${glitchAlpha})`
      : randomCyberpunkColor(glitchAlpha);

    drawRect(ctx, offsetX, glitchY, glitchWidth, glitchHeight, glitchColor, 'screen');

    // Sometimes add a second line close to the first for a more intense effect
    if (randomBool(0.25)) {
      const secondLineOffset = random(1, 4);
      drawRect(
        ctx,
        offsetX,
        glitchY + glitchHeight + secondLineOffset,
        glitchWidth * 0.9,
        glitchHeight * 0.8,
        glitchColor.replace(/[\d.]+\)$/g, `${glitchAlpha * 0.7})`),
        'screen'
      );
    }
  }
};
