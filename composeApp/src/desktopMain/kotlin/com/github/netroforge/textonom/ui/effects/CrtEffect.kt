package com.github.netroforge.textonom.ui.effects

import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.composed
import androidx.compose.ui.draw.drawWithContent
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.*
import androidx.compose.ui.graphics.drawscope.DrawScope
import kotlinx.coroutines.delay
import kotlin.math.PI
import kotlin.math.sin
import kotlin.random.Random

/**
 * Applies a CRT monitor effect to the content.
 *
 * @param enabled Whether the effect is enabled
 * @param scanlineAlpha The alpha value for the scanlines (0.0-1.0)
 * @param flickerStrength The strength of the flicker effect (0.0-1.0)
 * @param glitchProbability The probability of a glitch occurring (0.0-1.0)
 */
fun Modifier.crtEffect(
    enabled: Boolean = true,
    scanlineAlpha: Float = 0.15f,
    flickerStrength: Float = 0.03f,
    glitchProbability: Float = 0.01f
): Modifier {
    if (!enabled) return this

    return this
        .graphicsLayer(alpha = 0.99f) // Needed for the blend mode to work correctly
        .drawWithContent {
            // Draw the original content
            drawContent()

            // Draw the CRT effects
            drawScanlines(scanlineAlpha)
            drawRgbSeparation()
            drawVignette()
            drawScreenGlow()
            // No screen curvature for flat monitor look
            drawRandomGlitches(glitchProbability)
        }
        .flickerEffect(enabled = enabled, strength = flickerStrength)
}

/**
 * Draws scanlines over the content with a more authentic CRT look.
 */
private fun DrawScope.drawScanlines(alpha: Float) {
    // For green phosphor CRT look, we want more pronounced horizontal scanlines
    val scanlineHeight = 1.0f
    val scanlineSpacing = 4f // Slightly wider spacing to match the image
    val scanlineColor = Color.Black.copy(alpha = alpha * 1.5f) // More pronounced scanlines

    // Draw horizontal scanlines with varying intensity
    var y = 0f
    while (y < size.height) {
        // Calculate varying intensity based on position
        val intensityVariation = (sin(y * 0.1f) * 0.1f + 0.9f).toFloat()
        val lineAlpha = alpha * intensityVariation * 1.5f // More pronounced

        // Draw main scanline - solid line for green phosphor look
        drawLine(
            color = scanlineColor.copy(alpha = lineAlpha),
            start = Offset(0f, y),
            end = Offset(size.width, y),
            strokeWidth = scanlineHeight
        )

        y += scanlineSpacing
    }
}

/**
 * Draws a more realistic RGB phosphor pattern and color separation effect.
 */
private fun DrawScope.drawRgbSeparation() {
    // Create a more realistic RGB phosphor pattern
    val phosphorSize = 3f
    val phosphorSpacing = 6f
    val phosphorAlpha = 0.07f

    // Draw RGB phosphor dots in a grid pattern
    var y = 0f
    while (y < size.height) {
        var x = 0f
        while (x < size.width) {
            // Red phosphor
            drawCircle(
                color = Color.Red.copy(alpha = phosphorAlpha),
                radius = phosphorSize / 2,
                center = Offset(x, y),
                blendMode = BlendMode.Screen
            )

            // Green phosphor (offset slightly)
            drawCircle(
                color = Color.Green.copy(alpha = phosphorAlpha),
                radius = phosphorSize / 2,
                center = Offset(x + phosphorSize, y),
                blendMode = BlendMode.Screen
            )

            // Blue phosphor (offset slightly more)
            drawCircle(
                color = Color.Blue.copy(alpha = phosphorAlpha),
                radius = phosphorSize / 2,
                center = Offset(x + phosphorSize * 2, y),
                blendMode = BlendMode.Screen
            )

            x += phosphorSpacing * 3
        }
        y += phosphorSpacing
    }

    // Add chromatic aberration at the edges
    val aberrationStrength = 0.08f
    val edgeWidth = size.width * 0.1f

    // Left edge aberration
    drawRect(
        brush = Brush.horizontalGradient(
            colors = listOf(
                Color.Red.copy(alpha = aberrationStrength),
                Color.Transparent
            ),
            startX = 0f,
            endX = edgeWidth
        ),
        size = Size(edgeWidth, size.height),
        blendMode = BlendMode.Screen
    )

    // Right edge aberration
    drawRect(
        brush = Brush.horizontalGradient(
            colors = listOf(
                Color.Transparent,
                Color.Blue.copy(alpha = aberrationStrength)
            ),
            startX = size.width - edgeWidth,
            endX = size.width
        ),
        topLeft = Offset(size.width - edgeWidth, 0f),
        size = Size(edgeWidth, size.height),
        blendMode = BlendMode.Screen
    )
}

/**
 * Draws a simplified edge darkening effect without circular gradients.
 */
private fun DrawScope.drawVignette() {
    val edgeWidth = size.width * 0.1f
    val edgeAlpha = 0.2f

    // Top edge darkening
    drawRect(
        brush = Brush.verticalGradient(
            colors = listOf(
                Color.Black.copy(alpha = edgeAlpha),
                Color.Transparent
            ),
            startY = 0f,
            endY = edgeWidth
        ),
        size = Size(size.width, edgeWidth),
        blendMode = BlendMode.Darken
    )

    // Bottom edge darkening
    drawRect(
        brush = Brush.verticalGradient(
            colors = listOf(
                Color.Transparent,
                Color.Black.copy(alpha = edgeAlpha)
            ),
            startY = size.height - edgeWidth,
            endY = size.height
        ),
        topLeft = Offset(0f, size.height - edgeWidth),
        size = Size(size.width, edgeWidth),
        blendMode = BlendMode.Darken
    )

    // Left edge darkening
    drawRect(
        brush = Brush.horizontalGradient(
            colors = listOf(
                Color.Black.copy(alpha = edgeAlpha),
                Color.Transparent
            ),
            startX = 0f,
            endX = edgeWidth
        ),
        size = Size(edgeWidth, size.height),
        blendMode = BlendMode.Darken
    )

    // Right edge darkening
    drawRect(
        brush = Brush.horizontalGradient(
            colors = listOf(
                Color.Transparent,
                Color.Black.copy(alpha = edgeAlpha)
            ),
            startX = size.width - edgeWidth,
            endX = size.width
        ),
        topLeft = Offset(size.width - edgeWidth, 0f),
        size = Size(edgeWidth, size.height),
        blendMode = BlendMode.Darken
    )
}

/**
 * Draws an enhanced glow effect to simulate CRT phosphor glow and bloom.
 */
private fun DrawScope.drawScreenGlow() {
    // Create a more dynamic bloom/glow effect with multiple layers

    // Cyan color for cyberpunk theme
    val glowColor = Color(0xFF00FFFF)

    // Base glow - subtle overall glow
    val baseGlowAlpha = 0.03f
    drawRect(
        color = glowColor.copy(alpha = baseGlowAlpha),
        size = Size(size.width, size.height),
        blendMode = BlendMode.Screen
    )

    // Uniform horizontal glow - no circular effects
    val horizontalGlowAlpha = 0.04f
    val horizontalGlow = Brush.verticalGradient(
        colors = listOf(
            glowColor.copy(alpha = horizontalGlowAlpha),
            glowColor.copy(alpha = horizontalGlowAlpha * 1.5f),
            glowColor.copy(alpha = horizontalGlowAlpha)
        )
    )
    drawRect(
        brush = horizontalGlow,
        size = Size(size.width, size.height),
        blendMode = BlendMode.Screen
    )

    // Random bright spots have been removed to create a more uniform appearance

    // Add subtle pulsing effect to the glow (this will be controlled by the flickerEffect)
    val pulseTime = System.currentTimeMillis() % 2000 / 2000f
    val pulseIntensity = (sin(pulseTime * 2 * PI.toFloat()) * 0.01f + 0.02f).toFloat()

    drawRect(
        color = glowColor.copy(alpha = pulseIntensity),
        size = Size(size.width, size.height),
        blendMode = BlendMode.Screen
    )
}

// Screen curvature effect has been removed to match the flat monitor look

/**
 * Draws enhanced random glitches to simulate CRT interference and analog signal issues.
 */
private fun DrawScope.drawRandomGlitches(probability: Float) {
    // Only draw glitches occasionally based on probability
    if (Random.nextFloat() > probability) return

    // Potentially draw multiple glitch effects at once for more intense effect
    val glitchCount = if (Random.nextFloat() < 0.3f) Random.nextInt(1, 3) else 1

    repeat(glitchCount) {
        // Determine glitch type - more variety
        when (Random.nextInt(5)) {
            0 -> drawHorizontalGlitchLines()
            1 -> drawColorShift()
            2 -> drawStaticNoise()
            3 -> drawVerticalSyncLoss()
            4 -> drawSignalJitter()
        }
    }
}

/**
 * Draws horizontal glitch lines (common in CRT displays).
 */
private fun DrawScope.drawHorizontalGlitchLines() {
    // Draw 2-5 horizontal glitch lines (increased from 1-3)
    val numLines = Random.nextInt(2, 6)

    repeat(numLines) {
        val glitchY = Random.nextFloat() * size.height
        val glitchHeight = Random.nextFloat() * 8f + 2f // Increased height for more visibility
        val glitchAlpha = Random.nextFloat() * 0.5f + 0.3f // Increased alpha for more visibility

        // Determine if the glitch line should be offset horizontally
        val offsetX = if (Random.nextBoolean()) Random.nextFloat() * size.width * 0.3f else 0f
        val glitchWidth = size.width - offsetX

        // White glitch color for cyberpunk theme
        val glitchColor = Color.White.copy(alpha = glitchAlpha)

        drawRect(
            color = glitchColor,
            topLeft = Offset(offsetX, glitchY),
            size = Size(glitchWidth, glitchHeight),
            blendMode = BlendMode.Screen
        )

        // Sometimes add a second line close to the first for a more intense effect
        if (Random.nextFloat() < 0.4f) {
            val secondLineOffset = Random.nextFloat() * 4f + 1f
            drawRect(
                color = glitchColor.copy(alpha = glitchAlpha * 0.7f),
                topLeft = Offset(offsetX, glitchY + glitchHeight + secondLineOffset),
                size = Size(glitchWidth * 0.9f, glitchHeight * 0.8f),
                blendMode = BlendMode.Screen
            )
        }
    }
}

/**
 * Draws color shift artifacts (RGB channel separation).
 */
private fun DrawScope.drawColorShift() {
    val shiftX = Random.nextFloat() * size.width * 0.7f
    val shiftY = Random.nextFloat() * size.height
    val shiftWidth = Random.nextFloat() * 150f + 100f
    val shiftHeight = Random.nextFloat() * 30f + 10f

    // Choose which color channel to shift
    val shiftColor = when (Random.nextInt(3)) {
        0 -> Color.Red
        1 -> Color.Green
        else -> Color.Blue
    }.copy(alpha = 0.15f)

    // Draw the color shift with a slight offset
    drawRect(
        color = shiftColor,
        topLeft = Offset(shiftX, shiftY),
        size = Size(shiftWidth, shiftHeight),
        blendMode = BlendMode.Screen
    )

    // Sometimes add a complementary color shift nearby
    if (Random.nextBoolean()) {
        val complementaryColor = when (shiftColor.toArgb() and 0xFFFFFF) {
            Color.Red.toArgb() and 0xFFFFFF -> Color.Cyan
            Color.Green.toArgb() and 0xFFFFFF -> Color.Magenta
            else -> Color.Yellow
        }.copy(alpha = 0.1f)

        drawRect(
            color = complementaryColor,
            topLeft = Offset(shiftX + Random.nextFloat() * 20f - 10f, shiftY + shiftHeight + Random.nextFloat() * 10f),
            size = Size(shiftWidth * 0.8f, shiftHeight * 0.7f),
            blendMode = BlendMode.Screen
        )
    }
}

/**
 * Draws static noise (snow) effect.
 */
private fun DrawScope.drawStaticNoise() {
    // Make noise cover more of the screen
    val noiseRegionX = Random.nextFloat() * size.width * 0.5f
    val noiseRegionY = Random.nextFloat() * size.height * 0.5f
    val noiseRegionWidth = Random.nextFloat() * 300f + 200f // Larger region
    val noiseRegionHeight = Random.nextFloat() * 200f + 100f // Larger region

    // White noise color for cyberpunk theme
    val noiseColor = Color.White

    // Draw more random noise pixels (increased from 200 to 350)
    repeat(350) {
        val noiseX = noiseRegionX + Random.nextFloat() * noiseRegionWidth
        val noiseY = noiseRegionY + Random.nextFloat() * noiseRegionHeight
        val noiseWidth = Random.nextFloat() * 3f + 0.8f // Pixel width
        val noiseHeight = Random.nextFloat() * 3f + 0.8f // Pixel height
        val noiseAlpha = Random.nextFloat() * 0.4f + 0.15f // More visible

        drawRect(
            color = noiseColor.copy(alpha = noiseAlpha),
            topLeft = Offset(noiseX, noiseY),
            size = Size(noiseWidth, noiseHeight),
            blendMode = BlendMode.Screen
        )
    }

    // Sometimes add a few larger static bursts
    if (Random.nextFloat() < 0.5f) {
        repeat(Random.nextInt(3, 8)) {
            val burstX = Random.nextFloat() * size.width
            val burstY = Random.nextFloat() * size.height
            val burstWidth = Random.nextFloat() * 8f + 4f
            val burstHeight = Random.nextFloat() * 8f + 4f
            val burstAlpha = Random.nextFloat() * 0.5f + 0.2f

            drawRect(
                color = noiseColor.copy(alpha = burstAlpha),
                topLeft = Offset(burstX, burstY),
                size = Size(burstWidth, burstHeight),
                blendMode = BlendMode.Screen
            )
        }
    }
}

/**
 * Simulates vertical sync loss (rolling/jumping image).
 */
private fun DrawScope.drawVerticalSyncLoss() {
    val syncLossY = Random.nextFloat() * size.height * 0.7f
    val syncLossHeight = Random.nextFloat() * 50f + 30f

    // White line color for cyberpunk theme
    val lineColor = Color.White.copy(alpha = 0.4f)

    // Draw a horizontal tear line
    drawLine(
        color = lineColor,
        start = Offset(0f, syncLossY),
        end = Offset(size.width, syncLossY),
        strokeWidth = 2f,
        blendMode = BlendMode.Screen
    )

    // Draw distorted area below the tear
    val distortionPath = Path().apply {
        moveTo(0f, syncLossY)
        lineTo(size.width, syncLossY)
        lineTo(size.width, syncLossY + syncLossHeight)
        lineTo(0f, syncLossY + syncLossHeight)
        close()
    }

    // Draw a semi-transparent overlay to simulate the distortion
    val distortionColor = Color.Cyan.copy(alpha = 0.05f)

    drawRect(
        color = distortionColor,
        topLeft = Offset(0f, syncLossY),
        size = Size(size.width, syncLossHeight),
        blendMode = BlendMode.Screen
    )
}

/**
 * Simulates signal jitter (small horizontal displacement).
 */
private fun DrawScope.drawSignalJitter() {
    val jitterY = Random.nextFloat() * size.height
    val jitterHeight = Random.nextFloat() * 80f + 40f
    val jitterOffset = Random.nextFloat() * 15f + 5f

    // Cyan color for cyberpunk theme
    val jitterColor = Color(0xFF00FFFF).copy(alpha = 0.1f)

    // Draw a slightly offset rectangle to simulate horizontal jitter
    drawRect(
        color = jitterColor,
        topLeft = Offset(jitterOffset, jitterY),
        size = Size(size.width * 0.3f, jitterHeight),
        blendMode = BlendMode.Screen
    )
}

/**
 * Applies a flickering effect to simulate an old CRT monitor.
 */
private fun Modifier.flickerEffect(
    enabled: Boolean = true,
    strength: Float = 0.03f
): Modifier {
    if (!enabled) return this

    return composed {
        var flickerAlpha by remember { mutableStateOf(1f) }

        LaunchedEffect(Unit) {
            while (true) {
                // Random flicker effect
                flickerAlpha = 1f - (Random.nextFloat() * strength)

                // Random delay between flickers
                val delayTime = Random.nextLong(50, 300)
                delay(delayTime)
            }
        }

        graphicsLayer(alpha = flickerAlpha)
    }
}
