import {drawLine, drawRect, random, randomBool, randomCyberpunkColor, randomInt} from './effectUtils';

/**
 * Simulates pixel displacement (shifting blocks of pixels).
 *
 * @param {CanvasRenderingContext2D} ctx - The canvas context
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 */
export const drawPixelDisplacement = (ctx, width, height) => {
    // Create a region for the pixel displacement
    const displacementX = random(0, width * 0.6);
    const displacementY = random(0, height * 0.6);
    const displacementWidth = random(200, 500);
    const displacementHeight = random(100, 250);

    // Choose a cyberpunk color for highlighting the displacement
    const highlightColor = randomCyberpunkColor(0.15);

    // Draw the base displacement area with a subtle highlight
    drawRect(
        ctx,
        displacementX,
        displacementY,
        displacementWidth,
        displacementHeight,
        highlightColor,
        'screen'
    );

    // Create displaced blocks within the area
    const blockCount = randomInt(4, 8);
    for (let i = 0; i < blockCount; i++) {
        // Define a block to displace
        const blockWidth = displacementWidth / (random(2, 5));
        const blockHeight = displacementHeight / (random(2, 5));
        const blockX = displacementX + random(0, displacementWidth - blockWidth);
        const blockY = displacementY + random(0, displacementHeight - blockHeight);

        // Define the displacement amount
        const displaceX = random(-15, 15);
        const displaceY = random(-5, 5);

        // Draw the displaced block with a stronger highlight
        const blockColor = highlightColor.replace(/[\d.]+\)$/g, '0.25)');
        drawRect(
            ctx,
            blockX + displaceX,
            blockY + displaceY,
            blockWidth,
            blockHeight,
            blockColor,
            'screen'
        );

        // Add a border effect to the displaced block
        if (randomBool(0.5)) {
            const borderColor = highlightColor.replace(/[\d.]+\)$/g, '0.4)');
            const borderWidth = 2;

            // Top border
            drawLine(
                ctx,
                blockX + displaceX,
                blockY + displaceY,
                blockX + displaceX + blockWidth,
                blockY + displaceY,
                borderColor,
                borderWidth,
                'screen'
            );

            // Right border
            drawLine(
                ctx,
                blockX + displaceX + blockWidth,
                blockY + displaceY,
                blockX + displaceX + blockWidth,
                blockY + displaceY + blockHeight,
                borderColor,
                borderWidth,
                'screen'
            );

            // Bottom border
            drawLine(
                ctx,
                blockX + displaceX,
                blockY + displaceY + blockHeight,
                blockX + displaceX + blockWidth,
                blockY + displaceY + blockHeight,
                borderColor,
                borderWidth,
                'screen'
            );

            // Left border
            drawLine(
                ctx,
                blockX + displaceX,
                blockY + displaceY,
                blockX + displaceX,
                blockY + displaceY + blockHeight,
                borderColor,
                borderWidth,
                'screen'
            );
        }
    }
};
