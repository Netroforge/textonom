import {drawHorizontalGlitchLines} from './horizontalGlitchLines';
import {drawColorShift} from './colorShift';
import {drawStaticNoise} from './staticNoise';
import {drawVerticalSyncLoss} from './verticalSyncLoss';
import {drawSignalJitter} from './signalJitter';
import {drawDigitalCorruption} from './digitalCorruption';
import {drawScanDistortion} from './scanDistortion';
import {drawTextCorruption} from './textCorruption';
import {drawPixelDisplacement} from './pixelDisplacement';
import {drawRgbSeparation} from './rgbSeparation';
import {drawScanlines} from './scanlines';
import {drawEdgeDarkening} from './edgeDarkening';
import {drawScreenGlow} from './screenGlow';
import {randomBool, randomInt} from './effectUtils';

/**
 * Draws random glitches to simulate CRT interference and analog signal issues.
 *
 * @param {CanvasRenderingContext2D} ctx - The canvas context
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 * @param {number} probability - Probability of glitches occurring (0-1)
 */
export const drawRandomGlitches = (ctx, width, height, probability = 0.015) => {
  // Only draw glitches occasionally based on probability
  if (!randomBool(probability)) return;

  // Potentially draw multiple glitch effects at once for more intense effect
  const glitchCount = randomBool(0.3) ? randomInt(2, 4) : 1;

  for (let i = 0; i < glitchCount; i++) {
    // Determine glitch type - more variety with new effects
    const glitchType = randomInt(0, 8);

    switch (glitchType) {
      case 0:
        drawHorizontalGlitchLines(ctx, width, height);
        break;
      case 1:
        drawColorShift(ctx, width, height);
        break;
      case 2:
        drawStaticNoise(ctx, width, height);
        break;
      case 3:
        drawVerticalSyncLoss(ctx, width, height);
        break;
      case 4:
        drawSignalJitter(ctx, width, height);
        break;
      case 5:
        drawDigitalCorruption(ctx, width, height);
        break;
      case 6:
        drawScanDistortion(ctx, width, height);
        break;
      case 7:
        drawTextCorruption(ctx, width, height);
        break;
      case 8:
        drawPixelDisplacement(ctx, width, height);
        break;
    }
  }
};

// Export all effects
export {
  drawHorizontalGlitchLines,
  drawColorShift,
  drawStaticNoise,
  drawVerticalSyncLoss,
  drawSignalJitter,
  drawDigitalCorruption,
  drawScanDistortion,
  drawTextCorruption,
  drawPixelDisplacement,
  drawRgbSeparation,
  drawScanlines,
  drawEdgeDarkening,
  drawScreenGlow
};
