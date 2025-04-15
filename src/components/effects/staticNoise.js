import {drawRect, random, randomBool, randomCyberpunkColor, randomInt} from './effectUtils';

/**
 * Draws static noise (snow) effect.
 *
 * @param {CanvasRenderingContext2D} ctx - The canvas context
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 */
export const drawStaticNoise = (ctx, width, height) => {
  // Make noise cover a region of the screen
  const noiseRegionX = random(0, width * 0.6);
  const noiseRegionY = random(0, height * 0.6);
  const noiseRegionWidth = random(250, 650);
  const noiseRegionHeight = random(150, 450);

  // Choose from multiple noise colors for cyberpunk theme
  const noiseColor = randomBool(0.7)
    ? randomCyberpunkColor(0.3)
    : `rgba(255, 255, 255, 0.3)`;

  // Draw random noise pixels
  const pixelCount = randomInt(300, 500);
  for (let i = 0; i < pixelCount; i++) {
    const noiseX = noiseRegionX + random(0, noiseRegionWidth);
    const noiseY = noiseRegionY + random(0, noiseRegionHeight);
    const noiseWidth = random(1, 4);
    const noiseHeight = random(1, 4);
    const noiseAlpha = random(0.2, 0.7);

    // Vary the color slightly for each pixel
    const pixelColor = noiseColor.replace(/[\d.]+\)$/g, `${noiseAlpha})`);

    drawRect(ctx, noiseX, noiseY, noiseWidth, noiseHeight, pixelColor, 'screen');
  }

  // More likely to add larger static bursts
  if (randomBool(0.4)) {
    const burstCount = randomInt(5, 12);
    for (let i = 0; i < burstCount; i++) {
      const burstX = random(0, width);
      const burstY = random(0, height);
      const burstWidth = random(6, 18);
      const burstHeight = random(6, 18);
      const burstAlpha = random(0.3, 0.9);

      // Choose a different color for the burst
      const burstColor = randomCyberpunkColor(burstAlpha);

      drawRect(ctx, burstX, burstY, burstWidth, burstHeight, burstColor, 'screen');
    }
  }
};
