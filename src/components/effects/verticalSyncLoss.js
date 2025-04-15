import {drawLine, drawRect, random, randomBool, randomCyberpunkColor, randomInt} from './effectUtils';

/**
 * Simulates vertical sync loss (rolling/jumping image).
 *
 * @param {CanvasRenderingContext2D} ctx - The canvas context
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 */
export const drawVerticalSyncLoss = (ctx, width, height) => {
  const syncLossY = random(0, height * 0.7);
  const syncLossHeight = random(40, 120);

  // Choose a more vibrant line color for cyberpunk theme
  const lineColor = randomBool(0.7)
    ? randomCyberpunkColor(0.6)
    : `rgba(255, 255, 255, 0.6)`;

  // Draw a horizontal tear line with increased width
  drawLine(
    ctx,
    0,
    syncLossY,
    width,
    syncLossY,
    lineColor,
    3,
    'screen'
  );

  // Draw distorted area below the tear
  const distortionColor = randomCyberpunkColor(0.1);
  drawRect(ctx, 0, syncLossY, width, syncLossHeight, distortionColor, 'screen');

  // Add horizontal lines within the distortion area for more effect
  const lineCount = randomInt(3, 7);
  const lineSpacing = syncLossHeight / (lineCount + 1);

  for (let i = 0; i < lineCount; i++) {
    const lineY = syncLossY + lineSpacing * (i + 1);
    const lineOffset = random(-15, 15);

    drawLine(
      ctx,
      lineOffset,
      lineY,
      width + lineOffset,
      lineY,
      lineColor.replace(/[\d.]+\)$/g, '0.3)'),
      1.5,
      'screen'
    );
  }
};
