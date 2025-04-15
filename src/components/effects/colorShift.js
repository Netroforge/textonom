import {drawRect, random, randomBool, randomInt} from './effectUtils';

/**
 * Draws color shift artifacts (RGB channel separation).
 *
 * @param {CanvasRenderingContext2D} ctx - The canvas context
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 */
export const drawColorShift = (ctx, width, height) => {
    const shiftX = random(0, width * 0.7);
    const shiftY = random(0, height);
    const shiftWidth = random(150, 350);
    const shiftHeight = random(15, 55);

    // Choose which color channel to shift with more vibrant colors
    const colorIndex = randomInt(0, 4);
    let shiftColor;

    switch (colorIndex) {
        case 0:
            shiftColor = `rgba(255, 0, 0, 0.25)`; // Red
            break;
        case 1:
            shiftColor = `rgba(0, 255, 0, 0.25)`; // Green
            break;
        case 2:
            shiftColor = `rgba(0, 0, 255, 0.25)`; // Blue
            break;
        case 3:
            shiftColor = `rgba(0, 255, 255, 0.25)`; // Cyan
            break;
        case 4:
            shiftColor = `rgba(255, 0, 255, 0.25)`; // Magenta
            break;
    }

    // Draw the color shift with a slight offset
    drawRect(ctx, shiftX, shiftY, shiftWidth, shiftHeight, shiftColor, 'screen');

    // More likely to add a complementary color shift nearby
    if (randomBool(0.5)) {
        let complementaryColor;

        // Choose a complementary color
        switch (colorIndex) {
            case 0: // Red -> Cyan
                complementaryColor = `rgba(0, 255, 255, 0.2)`;
                break;
            case 1: // Green -> Magenta
                complementaryColor = `rgba(255, 0, 255, 0.2)`;
                break;
            case 2: // Blue -> Yellow
                complementaryColor = `rgba(255, 255, 0, 0.2)`;
                break;
            case 3: // Cyan -> Red
                complementaryColor = `rgba(255, 0, 0, 0.2)`;
                break;
            case 4: // Magenta -> Green
                complementaryColor = `rgba(0, 255, 0, 0.2)`;
                break;
        }

        // Draw with more dramatic offset
        drawRect(
            ctx,
            shiftX + random(-15, 15),
            shiftY + shiftHeight + random(0, 15),
            shiftWidth * 0.9,
            shiftHeight * 0.8,
            complementaryColor,
            'screen'
        );
    }
};
