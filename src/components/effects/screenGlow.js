import {drawRect} from './effectUtils';

/**
 * Draws an enhanced glow effect to simulate CRT phosphor glow and bloom.
 *
 * @param {CanvasRenderingContext2D} ctx - The canvas context
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 */
export const drawScreenGlow = (ctx, width, height) => {
    // Create a more dynamic bloom/glow effect with multiple layers
    // Cyan color for cyberpunk theme
    const glowColor = 'rgba(0, 255, 255, 0.03)';

    // Base glow - subtle overall glow
    drawRect(
        ctx,
        0,
        0,
        width,
        height,
        glowColor,
        'screen'
    );

    // Uniform horizontal glow - no circular effects
    const horizontalGlowAlpha = 0.04;
    const horizontalGradient = ctx.createLinearGradient(0, 0, 0, height);
    horizontalGradient.addColorStop(0, `rgba(0, 255, 255, ${horizontalGlowAlpha})`);
    horizontalGradient.addColorStop(0.5, `rgba(0, 255, 255, ${horizontalGlowAlpha * 1.5})`);
    horizontalGradient.addColorStop(1, `rgba(0, 255, 255, ${horizontalGlowAlpha})`);

    drawRect(
        ctx,
        0,
        0,
        width,
        height,
        horizontalGradient,
        'screen'
    );

    // Add subtle pulsing effect to the glow
    const pulseTime = Date.now() % 2000 / 2000;
    const pulseIntensity = (Math.sin(pulseTime * 2 * Math.PI) * 0.01 + 0.02);

    drawRect(
        ctx,
        0,
        0,
        width,
        height,
        `rgba(0, 255, 255, ${pulseIntensity})`,
        'screen'
    );
};
