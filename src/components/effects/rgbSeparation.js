import {drawRect, random, randomBool} from './effectUtils';

/**
 * Draws a realistic RGB phosphor pattern and color separation effect.
 *
 * @param {CanvasRenderingContext2D} ctx - The canvas context
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 */
export const drawRgbSeparation = (ctx, width, height) => {
  // Add chromatic aberration at the edges
  const aberrationStrength = random(0.05, 0.12);
  const edgeWidth = width * 0.1;

  // Only apply the effect sometimes
  if (randomBool(0.4)) {
    // Left edge aberration (red)
    const leftGradient = ctx.createLinearGradient(0, 0, edgeWidth, 0);
    leftGradient.addColorStop(0, `rgba(255, 0, 0, ${aberrationStrength})`);
    leftGradient.addColorStop(1, 'rgba(255, 0, 0, 0)');

    drawRect(
      ctx,
      0,
      0,
      edgeWidth,
      height,
      leftGradient,
      'screen'
    );

    // Right edge aberration (blue)
    const rightGradient = ctx.createLinearGradient(width - edgeWidth, 0, width, 0);
    rightGradient.addColorStop(0, 'rgba(0, 0, 255, 0)');
    rightGradient.addColorStop(1, `rgba(0, 0, 255, ${aberrationStrength})`);

    drawRect(
      ctx,
      width - edgeWidth,
      0,
      edgeWidth,
      height,
      rightGradient,
      'screen'
    );
  }

  // Sometimes add RGB separation in a random area
  if (randomBool(0.15)) {
    const separationX = random(width * 0.2, width * 0.8);
    const separationY = random(height * 0.2, height * 0.8);
    const separationWidth = random(50, 150);
    const separationHeight = random(20, 60);
    const separationStrength = random(0.1, 0.2);

    // Red channel shifted left
    drawRect(
      ctx,
      separationX - 5,
      separationY,
      separationWidth,
      separationHeight,
      `rgba(255, 0, 0, ${separationStrength})`,
      'screen'
    );

    // Green channel in the middle
    drawRect(
      ctx,
      separationX,
      separationY,
      separationWidth,
      separationHeight,
      `rgba(0, 255, 0, ${separationStrength})`,
      'screen'
    );

    // Blue channel shifted right
    drawRect(
      ctx,
      separationX + 5,
      separationY,
      separationWidth,
      separationHeight,
      `rgba(0, 0, 255, ${separationStrength})`,
      'screen'
    );
  }
};
