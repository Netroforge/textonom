import {drawRect, random, randomBool, randomCyberpunkColor} from './effectUtils';

/**
 * Simulates signal jitter (small horizontal displacement).
 *
 * @param {CanvasRenderingContext2D} ctx - The canvas context
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 */
export const drawSignalJitter = (ctx, width, height) => {
    const jitterY = random(0, height);
    const jitterHeight = random(60, 160);
    const jitterOffset = random(10, 35);

    // Choose from multiple colors for cyberpunk theme
    const jitterColor = randomCyberpunkColor(0.15);

    // Draw a slightly offset rectangle to simulate horizontal jitter
    drawRect(
        ctx,
        jitterOffset,
        jitterY,
        width * 0.4,
        jitterHeight,
        jitterColor,
        'screen'
    );

    // Sometimes add a second jitter effect for more intensity
    if (randomBool(0.25)) {
        const secondJitterY = jitterY + random(-25, 25);
        const secondJitterHeight = jitterHeight * 0.7;
        const secondJitterOffset = jitterOffset * -0.8; // Opposite direction

        // Choose a complementary color
        let secondJitterColor;
        if (jitterColor.includes('0, 255, 255')) { // Cyan
            secondJitterColor = `rgba(255, 0, 255, 0.12)`; // Magenta
        } else if (jitterColor.includes('255, 0, 255')) { // Magenta
            secondJitterColor = `rgba(0, 255, 0, 0.12)`; // Green
        } else {
            secondJitterColor = `rgba(0, 255, 255, 0.12)`; // Cyan
        }

        drawRect(
            ctx,
            secondJitterOffset,
            secondJitterY,
            width * 0.3,
            secondJitterHeight,
            secondJitterColor,
            'screen'
        );
    }
};
