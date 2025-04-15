import {drawRect, random, randomBool, randomCyberpunkColor, randomInt} from './effectUtils';

/**
 * Simulates digital corruption (data corruption artifacts).
 *
 * @param {CanvasRenderingContext2D} ctx - The canvas context
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 */
export const drawDigitalCorruption = (ctx, width, height) => {
    // Create a region for the digital corruption effect
    const corruptionX = random(0, width * 0.8);
    const corruptionY = random(0, height * 0.8);
    const corruptionWidth = random(100, 300);
    const corruptionHeight = random(30, 90);

    // Choose a cyberpunk color for the corruption
    const corruptionColor = randomCyberpunkColor(0.4);

    // Draw digital blocks to simulate data corruption
    const blockSize = random(5, 20);
    const numBlocksX = Math.max(1, Math.floor(corruptionWidth / blockSize));
    const numBlocksY = Math.max(1, Math.floor(corruptionHeight / blockSize));

    // Only draw about 1/3 of the blocks for a sparse effect
    const totalBlocks = Math.floor(numBlocksX * numBlocksY / 3);

    for (let i = 0; i < totalBlocks; i++) {
        if (randomBool(0.7)) { // 70% chance to draw each block
            const blockX = corruptionX + (randomInt(0, numBlocksX - 1) * blockSize);
            const blockY = corruptionY + (randomInt(0, numBlocksY - 1) * blockSize);
            const blockAlpha = random(0.2, 0.7);

            const blockColor = corruptionColor.replace(/[\d.]+\)$/g, `${blockAlpha})`);
            drawRect(ctx, blockX, blockY, blockSize, blockSize, blockColor, 'screen');
        }
    }

    // Sometimes add binary-like text effect (1s and 0s)
    if (randomBool(0.2)) {
        const binaryColor = corruptionColor.replace(/[\d.]+\)$/g, '0.4)');
        const binarySize = 8;

        for (let i = 0; i < 15; i++) {
            const binaryX = corruptionX + random(0, corruptionWidth);
            const binaryY = corruptionY + random(0, corruptionHeight);

            // Draw a small rectangle to represent a binary digit
            drawRect(ctx, binaryX, binaryY, binarySize, binarySize, binaryColor, 'screen');
        }
    }
};
