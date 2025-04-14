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
    val glitchCount = if (Random.nextFloat() < 0.3f) Random.nextInt(2, 4) else 1

    repeat(glitchCount) {
        // Determine glitch type - more variety with new effects
        when (Random.nextInt(9)) {
            0 -> drawHorizontalGlitchLines()
            1 -> drawColorShift()
            2 -> drawStaticNoise()
            3 -> drawVerticalSyncLoss()
            4 -> drawSignalJitter()
            5 -> drawDigitalCorruption()
            6 -> drawScanDistortion()
            7 -> drawTextCorruption()
            8 -> drawPixelDisplacement()
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
    val shiftWidth = Random.nextFloat() * 200f + 150f  // Increased width
    val shiftHeight = Random.nextFloat() * 40f + 15f   // Increased height

    // Choose which color channel to shift with more vibrant colors
    val shiftColor = when (Random.nextInt(5)) {
        0 -> Color.Red
        1 -> Color.Green
        2 -> Color.Blue
        3 -> Color(0xFF00FFFF) // Cyan
        else -> Color(0xFFFF00FF) // Magenta
    }.copy(alpha = 0.25f)  // Increased alpha for more visibility

    // Draw the color shift with a slight offset
    drawRect(
        color = shiftColor,
        topLeft = Offset(shiftX, shiftY),
        size = Size(shiftWidth, shiftHeight),
        blendMode = BlendMode.Screen
    )

    // More likely to add a complementary color shift nearby
    if (Random.nextFloat() < 0.7f) {
        val complementaryColor = when (shiftColor.toArgb() and 0xFFFFFF) {
            Color.Red.toArgb() and 0xFFFFFF -> Color.Cyan
            Color.Green.toArgb() and 0xFFFFFF -> Color.Magenta
            Color.Blue.toArgb() and 0xFFFFFF -> Color.Yellow
            Color(0xFF00FFFF).toArgb() and 0xFFFFFF -> Color.Red
            else -> Color.Green
        }.copy(alpha = 0.2f)  // Increased alpha

        // Draw with more dramatic offset
        drawRect(
            color = complementaryColor,
            topLeft = Offset(shiftX + Random.nextFloat() * 30f - 15f, shiftY + shiftHeight + Random.nextFloat() * 15f),
            size = Size(shiftWidth * 0.9f, shiftHeight * 0.8f),
            blendMode = BlendMode.Screen
        )
    }
}

/**
 * Draws static noise (snow) effect.
 */
private fun DrawScope.drawStaticNoise() {
    // Make noise cover more of the screen
    val noiseRegionX = Random.nextFloat() * size.width * 0.6f
    val noiseRegionY = Random.nextFloat() * size.height * 0.6f
    val noiseRegionWidth = Random.nextFloat() * 400f + 250f // Even larger region
    val noiseRegionHeight = Random.nextFloat() * 300f + 150f // Even larger region

    // Choose from multiple noise colors for cyberpunk theme
    val noiseColor = when (Random.nextInt(4)) {
        0 -> Color.White
        1 -> Color(0xFF00FFFF) // Cyan
        2 -> Color(0xFFFF00FF) // Magenta
        else -> Color(0xFF00FF00) // Green
    }

    // Draw more random noise pixels (increased to 500)
    repeat(500) {
        val noiseX = noiseRegionX + Random.nextFloat() * noiseRegionWidth
        val noiseY = noiseRegionY + Random.nextFloat() * noiseRegionHeight
        val noiseWidth = Random.nextFloat() * 4f + 1f // Larger pixel width
        val noiseHeight = Random.nextFloat() * 4f + 1f // Larger pixel height
        val noiseAlpha = Random.nextFloat() * 0.5f + 0.2f // More visible

        drawRect(
            color = noiseColor.copy(alpha = noiseAlpha),
            topLeft = Offset(noiseX, noiseY),
            size = Size(noiseWidth, noiseHeight),
            blendMode = BlendMode.Screen
        )
    }

    // More likely to add larger static bursts
    if (Random.nextFloat() < 0.7f) {
        repeat(Random.nextInt(5, 12)) { // More bursts
            val burstX = Random.nextFloat() * size.width
            val burstY = Random.nextFloat() * size.height
            val burstWidth = Random.nextFloat() * 12f + 6f // Larger bursts
            val burstHeight = Random.nextFloat() * 12f + 6f // Larger bursts
            val burstAlpha = Random.nextFloat() * 0.6f + 0.3f // More visible

            // Choose a different color for the burst
            val burstColor = when (Random.nextInt(3)) {
                0 -> Color.White
                1 -> Color(0xFF00FFFF) // Cyan
                else -> Color(0xFFFF00FF) // Magenta
            }

            drawRect(
                color = burstColor.copy(alpha = burstAlpha),
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
    val syncLossHeight = Random.nextFloat() * 80f + 40f // Increased height

    // Choose a more vibrant line color for cyberpunk theme
    val lineColor = when (Random.nextInt(3)) {
        0 -> Color.White.copy(alpha = 0.6f) // Brighter white
        1 -> Color(0xFF00FFFF).copy(alpha = 0.6f) // Cyan
        else -> Color(0xFFFF00FF).copy(alpha = 0.6f) // Magenta
    }

    // Draw a horizontal tear line with increased width
    drawLine(
        color = lineColor,
        start = Offset(0f, syncLossY),
        end = Offset(size.width, syncLossY),
        strokeWidth = 3f, // Thicker line
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

    // Draw a semi-transparent overlay to simulate the distortion with more vibrant color
    val distortionColor = when (Random.nextInt(3)) {
        0 -> Color.Cyan.copy(alpha = 0.1f) // Brighter cyan
        1 -> Color(0xFFFF00FF).copy(alpha = 0.1f) // Magenta
        else -> Color(0xFF00FF00).copy(alpha = 0.1f) // Green
    }

    drawRect(
        color = distortionColor,
        topLeft = Offset(0f, syncLossY),
        size = Size(size.width, syncLossHeight),
        blendMode = BlendMode.Screen
    )

    // Add horizontal lines within the distortion area for more effect
    val lineCount = Random.nextInt(3, 7)
    val lineSpacing = syncLossHeight / (lineCount + 1)

    repeat(lineCount) { index ->
        val lineY = syncLossY + lineSpacing * (index + 1)
        val lineOffset = Random.nextFloat() * 30f - 15f // Random horizontal offset

        drawLine(
            color = lineColor.copy(alpha = 0.3f),
            start = Offset(lineOffset, lineY),
            end = Offset(size.width + lineOffset, lineY),
            strokeWidth = 1.5f,
            blendMode = BlendMode.Screen
        )
    }
}

/**
 * Simulates signal jitter (small horizontal displacement).
 */
private fun DrawScope.drawSignalJitter() {
    val jitterY = Random.nextFloat() * size.height
    val jitterHeight = Random.nextFloat() * 100f + 60f // Increased height
    val jitterOffset = Random.nextFloat() * 25f + 10f // Increased offset

    // Choose from multiple colors for cyberpunk theme
    val jitterColor = when (Random.nextInt(3)) {
        0 -> Color(0xFF00FFFF).copy(alpha = 0.15f) // Cyan
        1 -> Color(0xFFFF00FF).copy(alpha = 0.15f) // Magenta
        else -> Color(0xFF00FF00).copy(alpha = 0.15f) // Green
    }

    // Draw a slightly offset rectangle to simulate horizontal jitter
    drawRect(
        color = jitterColor,
        topLeft = Offset(jitterOffset, jitterY),
        size = Size(size.width * 0.4f, jitterHeight), // Wider jitter
        blendMode = BlendMode.Screen
    )

    // Sometimes add a second jitter effect for more intensity
    if (Random.nextFloat() < 0.4f) {
        val secondJitterY = jitterY + Random.nextFloat() * 50f - 25f
        val secondJitterHeight = jitterHeight * 0.7f
        val secondJitterOffset = jitterOffset * -0.8f // Opposite direction

        val secondJitterColor = when (jitterColor.toArgb() and 0xFFFFFF) {
            Color(0xFF00FFFF).toArgb() and 0xFFFFFF -> Color(0xFFFF00FF).copy(alpha = 0.12f) // Magenta
            Color(0xFFFF00FF).toArgb() and 0xFFFFFF -> Color(0xFF00FF00).copy(alpha = 0.12f) // Green
            else -> Color(0xFF00FFFF).copy(alpha = 0.12f) // Cyan
        }

        drawRect(
            color = secondJitterColor,
            topLeft = Offset(secondJitterOffset, secondJitterY),
            size = Size(size.width * 0.3f, secondJitterHeight),
            blendMode = BlendMode.Screen
        )
    }
}

/**
 * Simulates digital corruption (data corruption artifacts).
 */
private fun DrawScope.drawDigitalCorruption() {
    // Create a region for the digital corruption effect
    val corruptionX = Random.nextFloat() * size.width * 0.8f
    val corruptionY = Random.nextFloat() * size.height * 0.8f
    val corruptionWidth = Random.nextFloat() * 200f + 100f
    val corruptionHeight = Random.nextFloat() * 60f + 30f

    // Choose a cyberpunk color for the corruption
    val corruptionColor = when (Random.nextInt(4)) {
        0 -> Color(0xFF00FFFF) // Cyan
        1 -> Color(0xFFFF00FF) // Magenta
        2 -> Color(0xFF00FF00) // Green
        else -> Color.White
    }

    // Draw digital blocks to simulate data corruption
    val blockSize = Random.nextFloat() * 15f + 5f
    val numBlocksX = (corruptionWidth / blockSize).toInt().coerceAtLeast(1)
    val numBlocksY = (corruptionHeight / blockSize).toInt().coerceAtLeast(1)

    repeat(numBlocksX * numBlocksY / 3) { // Only draw about 1/3 of the blocks for a sparse effect
        if (Random.nextFloat() < 0.7f) { // 70% chance to draw each block
            val blockX = corruptionX + (Random.nextInt(numBlocksX) * blockSize)
            val blockY = corruptionY + (Random.nextInt(numBlocksY) * blockSize)
            val blockAlpha = Random.nextFloat() * 0.5f + 0.2f

            drawRect(
                color = corruptionColor.copy(alpha = blockAlpha),
                topLeft = Offset(blockX, blockY),
                size = Size(blockSize, blockSize),
                blendMode = BlendMode.Screen
            )
        }
    }

    // Sometimes add binary-like text effect (1s and 0s)
    if (Random.nextFloat() < 0.3f) {
        val binaryColor = corruptionColor.copy(alpha = 0.4f)
        val binarySize = 8f

        repeat(15) {
            val binaryX = corruptionX + Random.nextFloat() * corruptionWidth
            val binaryY = corruptionY + Random.nextFloat() * corruptionHeight

            // Draw a small rectangle to represent a binary digit
            drawRect(
                color = binaryColor,
                topLeft = Offset(binaryX, binaryY),
                size = Size(binarySize, binarySize),
                blendMode = BlendMode.Screen
            )
        }
    }
}

/**
 * Simulates scan distortion (horizontal scanning artifacts).
 */
private fun DrawScope.drawScanDistortion() {
    // Create a region for the scan distortion
    val distortionY = Random.nextFloat() * size.height
    val distortionHeight = Random.nextFloat() * 40f + 20f

    // Choose a cyberpunk color for the distortion
    val distortionColor = when (Random.nextInt(3)) {
        0 -> Color(0xFF00FFFF) // Cyan
        1 -> Color(0xFFFF00FF) // Magenta
        else -> Color(0xFF00FF00) // Green
    }.copy(alpha = 0.2f)

    // Draw the main distortion area
    drawRect(
        color = distortionColor,
        topLeft = Offset(0f, distortionY),
        size = Size(size.width, distortionHeight),
        blendMode = BlendMode.Screen
    )

    // Add scan lines within the distortion
    val scanLineCount = Random.nextInt(5, 10)
    val scanLineSpacing = distortionHeight / scanLineCount

    repeat(scanLineCount) { index ->
        val lineY = distortionY + index * scanLineSpacing
        val lineWidth = size.width * (Random.nextFloat() * 0.4f + 0.6f) // Varying line widths
        val lineOffset = size.width * Random.nextFloat() * 0.3f // Random starting point
        val lineAlpha = Random.nextFloat() * 0.5f + 0.3f

        drawLine(
            color = distortionColor.copy(alpha = lineAlpha),
            start = Offset(lineOffset, lineY),
            end = Offset(lineOffset + lineWidth, lineY),
            strokeWidth = Random.nextFloat() * 2f + 1f,
            blendMode = BlendMode.Screen
        )
    }

    // Add some vertical artifacts for more effect
    if (Random.nextFloat() < 0.5f) {
        val verticalCount = Random.nextInt(2, 5)
        repeat(verticalCount) {
            val lineX = Random.nextFloat() * size.width
            val lineHeight = distortionHeight * (Random.nextFloat() * 0.6f + 0.4f)
            val lineY = distortionY + (distortionHeight - lineHeight) * Random.nextFloat()

            drawLine(
                color = distortionColor.copy(alpha = 0.3f),
                start = Offset(lineX, lineY),
                end = Offset(lineX, lineY + lineHeight),
                strokeWidth = Random.nextFloat() * 1.5f + 0.5f,
                blendMode = BlendMode.Screen
            )
        }
    }
}

/**
 * Simulates text corruption (garbled text effect).
 */
private fun DrawScope.drawTextCorruption() {
    // Create a region for the text corruption
    val corruptionX = Random.nextFloat() * size.width * 0.7f
    val corruptionY = Random.nextFloat() * size.height * 0.7f
    val corruptionWidth = Random.nextFloat() * 250f + 150f
    val corruptionHeight = Random.nextFloat() * 100f + 50f

    // Choose a cyberpunk color for the corruption
    val textColor = when (Random.nextInt(4)) {
        0 -> Color(0xFF00FFFF) // Cyan
        1 -> Color(0xFFFF00FF) // Magenta
        2 -> Color(0xFF00FF00) // Green
        else -> Color.White
    }.copy(alpha = 0.4f)

    // Draw random symbols to simulate corrupted text
    val symbolSize = Random.nextFloat() * 5f + 3f
    val symbolCount = Random.nextInt(20, 40)

    repeat(symbolCount) {
        val symbolX = corruptionX + Random.nextFloat() * corruptionWidth
        val symbolY = corruptionY + Random.nextFloat() * corruptionHeight

        // Draw a small rectangle or line to represent a text symbol
        if (Random.nextBoolean()) {
            // Rectangle for block character
            drawRect(
                color = textColor,
                topLeft = Offset(symbolX, symbolY),
                size = Size(symbolSize, symbolSize * 1.5f),
                blendMode = BlendMode.Screen
            )
        } else {
            // Line for dash-like character
            drawLine(
                color = textColor,
                start = Offset(symbolX, symbolY),
                end = Offset(symbolX + symbolSize * 2, symbolY),
                strokeWidth = symbolSize / 2,
                blendMode = BlendMode.Screen
            )
        }
    }

    // Add a glowing effect around the text area
    drawRect(
        brush = Brush.radialGradient(
            colors = listOf(
                textColor.copy(alpha = 0.1f),
                Color.Transparent
            ),
            center = Offset(corruptionX + corruptionWidth / 2, corruptionY + corruptionHeight / 2),
            radius = (corruptionWidth + corruptionHeight) / 3
        ),
        topLeft = Offset(
            corruptionX - corruptionWidth / 4,
            corruptionY - corruptionHeight / 4
        ),
        size = Size(
            corruptionWidth * 1.5f,
            corruptionHeight * 1.5f
        ),
        blendMode = BlendMode.Screen
    )
}

/**
 * Simulates pixel displacement (shifting blocks of pixels).
 */
private fun DrawScope.drawPixelDisplacement() {
    // Create a region for the pixel displacement
    val displacementX = Random.nextFloat() * size.width * 0.6f
    val displacementY = Random.nextFloat() * size.height * 0.6f
    val displacementWidth = Random.nextFloat() * 300f + 200f
    val displacementHeight = Random.nextFloat() * 150f + 100f

    // Choose a cyberpunk color for highlighting the displacement
    val highlightColor = when (Random.nextInt(3)) {
        0 -> Color(0xFF00FFFF) // Cyan
        1 -> Color(0xFFFF00FF) // Magenta
        else -> Color(0xFF00FF00) // Green
    }.copy(alpha = 0.15f)

    // Draw the base displacement area with a subtle highlight
    drawRect(
        color = highlightColor,
        topLeft = Offset(displacementX, displacementY),
        size = Size(displacementWidth, displacementHeight),
        blendMode = BlendMode.Screen
    )

    // Create displaced blocks within the area
    val blockCount = Random.nextInt(4, 8)
    repeat(blockCount) {
        // Define a block to displace
        val blockWidth = displacementWidth / (Random.nextFloat() * 3f + 2f)
        val blockHeight = displacementHeight / (Random.nextFloat() * 3f + 2f)
        val blockX = displacementX + Random.nextFloat() * (displacementWidth - blockWidth)
        val blockY = displacementY + Random.nextFloat() * (displacementHeight - blockHeight)

        // Define the displacement amount
        val displaceX = Random.nextFloat() * 30f - 15f
        val displaceY = Random.nextFloat() * 10f - 5f

        // Draw the displaced block with a stronger highlight
        drawRect(
            color = highlightColor.copy(alpha = 0.25f),
            topLeft = Offset(blockX + displaceX, blockY + displaceY),
            size = Size(blockWidth, blockHeight),
            blendMode = BlendMode.Screen
        )

        // Add a border effect to the displaced block
        if (Random.nextFloat() < 0.7f) {
            val borderColor = highlightColor.copy(alpha = 0.4f)
            val borderWidth = 2f

            // Top border
            drawLine(
                color = borderColor,
                start = Offset(blockX + displaceX, blockY + displaceY),
                end = Offset(blockX + displaceX + blockWidth, blockY + displaceY),
                strokeWidth = borderWidth,
                blendMode = BlendMode.Screen
            )

            // Right border
            drawLine(
                color = borderColor,
                start = Offset(blockX + displaceX + blockWidth, blockY + displaceY),
                end = Offset(blockX + displaceX + blockWidth, blockY + displaceY + blockHeight),
                strokeWidth = borderWidth,
                blendMode = BlendMode.Screen
            )

            // Bottom border
            drawLine(
                color = borderColor,
                start = Offset(blockX + displaceX, blockY + displaceY + blockHeight),
                end = Offset(blockX + displaceX + blockWidth, blockY + displaceY + blockHeight),
                strokeWidth = borderWidth,
                blendMode = BlendMode.Screen
            )

            // Left border
            drawLine(
                color = borderColor,
                start = Offset(blockX + displaceX, blockY + displaceY),
                end = Offset(blockX + displaceX, blockY + displaceY + blockHeight),
                strokeWidth = borderWidth,
                blendMode = BlendMode.Screen
            )
        }
    }
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
                // Random flicker effect with occasional stronger flickers
                flickerAlpha = if (Random.nextFloat() < 0.05f) {
                    // Occasional stronger flicker
                    1f - (Random.nextFloat() * strength * 2.5f)
                } else {
                    // Normal flicker
                    1f - (Random.nextFloat() * strength)
                }

                // Random delay between flickers with occasional rapid flickers
                val delayTime = if (Random.nextFloat() < 0.1f) {
                    // Occasional rapid flicker
                    Random.nextLong(20, 80)
                } else {
                    // Normal flicker rate
                    Random.nextLong(50, 300)
                }
                delay(delayTime)
            }
        }

        graphicsLayer(alpha = flickerAlpha)
    }
}
