import {drawRect} from './effectUtils';

/**
 * Draws a simplified edge darkening effect without circular gradients.
 *
 * @param {CanvasRenderingContext2D} ctx - The canvas context
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 * @param {number} alpha - Alpha value for the edge darkening
 */
export const drawEdgeDarkening = (ctx, width, height, alpha = 0.2) => {
    const edgeWidth = width * 0.1;
    const edgeHeight = height * 0.1;
    const edgeColor = `rgba(0, 0, 0, ${alpha})`;

    // Top edge darkening
    const topGradient = ctx.createLinearGradient(0, 0, 0, edgeHeight);
    topGradient.addColorStop(0, edgeColor);
    topGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    drawRect(
        ctx,
        0,
        0,
        width,
        edgeHeight,
        topGradient,
        'darken'
    );

    // Bottom edge darkening
    const bottomGradient = ctx.createLinearGradient(0, height - edgeHeight, 0, height);
    bottomGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
    bottomGradient.addColorStop(1, edgeColor);

    drawRect(
        ctx,
        0,
        height - edgeHeight,
        width,
        edgeHeight,
        bottomGradient,
        'darken'
    );

    // Left edge darkening
    const leftGradient = ctx.createLinearGradient(0, 0, edgeWidth, 0);
    leftGradient.addColorStop(0, edgeColor);
    leftGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    drawRect(
        ctx,
        0,
        0,
        edgeWidth,
        height,
        leftGradient,
        'darken'
    );

    // Right edge darkening
    const rightGradient = ctx.createLinearGradient(width - edgeWidth, 0, width, 0);
    rightGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
    rightGradient.addColorStop(1, edgeColor);

    drawRect(
        ctx,
        width - edgeWidth,
        0,
        edgeWidth,
        height,
        rightGradient,
        'darken'
    );
};
