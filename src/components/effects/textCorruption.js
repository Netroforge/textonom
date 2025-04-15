import {drawLine, drawRect, random, randomBool, randomCyberpunkColor, randomInt} from './effectUtils';

/**
 * Simulates text corruption (garbled text effect).
 *
 * @param {CanvasRenderingContext2D} ctx - The canvas context
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 */
export const drawTextCorruption = (ctx, width, height) => {
    // Create a region for the text corruption
    const corruptionX = random(0, width * 0.7);
    const corruptionY = random(0, height * 0.7);
    const corruptionWidth = random(150, 400);
    const corruptionHeight = random(50, 150);

    // Choose a cyberpunk color for the corruption
    const textColor = randomCyberpunkColor(0.4);

    // Draw random symbols to simulate corrupted text
    const symbolSize = random(3, 8);
    const symbolCount = randomInt(20, 40);

    for (let i = 0; i < symbolCount; i++) {
        const symbolX = corruptionX + random(0, corruptionWidth);
        const symbolY = corruptionY + random(0, corruptionHeight);

        // Draw a small rectangle or line to represent a text symbol
        if (randomBool()) {
            // Rectangle for block character
            drawRect(
                ctx,
                symbolX,
                symbolY,
                symbolSize,
                symbolSize * 1.5,
                textColor,
                'screen'
            );
        } else {
            // Line for dash-like character
            drawLine(
                ctx,
                symbolX,
                symbolY,
                symbolX + symbolSize * 2,
                symbolY,
                textColor,
                symbolSize / 2,
                'screen'
            );
        }
    }

    // Add a subtle glow effect around the text area
    const glowColor = textColor.replace(/[\d.]+\)$/g, '0.1)');

    // Draw a larger rectangle with lower opacity for the glow
    drawRect(
        ctx,
        corruptionX - corruptionWidth / 4,
        corruptionY - corruptionHeight / 4,
        corruptionWidth * 1.5,
        corruptionHeight * 1.5,
        glowColor,
        'screen'
    );
};
