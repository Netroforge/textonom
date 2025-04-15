import {drawLine, drawRect, random, randomBool, randomCyberpunkColor, randomInt} from './effectUtils';

/**
 * Simulates scan distortion (horizontal scanning artifacts).
 *
 * @param {CanvasRenderingContext2D} ctx - The canvas context
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 */
export const drawScanDistortion = (ctx, width, height) => {
    // Create a region for the scan distortion
    const distortionY = random(0, height);
    const distortionHeight = random(20, 60);

    // Choose a cyberpunk color for the distortion
    const distortionColor = randomCyberpunkColor(0.2);

    // Draw the main distortion area
    drawRect(ctx, 0, distortionY, width, distortionHeight, distortionColor, 'screen');

    // Add scan lines within the distortion
    const scanLineCount = randomInt(5, 10);
    const scanLineSpacing = distortionHeight / scanLineCount;

    for (let i = 0; i < scanLineCount; i++) {
        const lineY = distortionY + i * scanLineSpacing;
        const lineWidth = width * (random(0.6, 1.0)); // Varying line widths
        const lineOffset = width * random(0, 0.3); // Random starting point
        const lineAlpha = random(0.3, 0.8);

        const lineColor = distortionColor.replace(/[\d.]+\)$/g, `${lineAlpha})`);

        drawLine(
            ctx,
            lineOffset,
            lineY,
            lineOffset + lineWidth,
            lineY,
            lineColor,
            random(1, 3),
            'screen'
        );
    }

    // Add some vertical artifacts for more effect
    if (randomBool(0.3)) {
        const verticalCount = randomInt(2, 5);
        for (let i = 0; i < verticalCount; i++) {
            const lineX = random(0, width);
            const lineHeight = distortionHeight * random(0.4, 1.0);
            const lineY = distortionY + (distortionHeight - lineHeight) * random(0, 1);

            drawLine(
                ctx,
                lineX,
                lineY,
                lineX,
                lineY + lineHeight,
                distortionColor.replace(/[\d.]+\)$/g, '0.3)'),
                random(0.5, 2),
                'screen'
            );
        }
    }
};
