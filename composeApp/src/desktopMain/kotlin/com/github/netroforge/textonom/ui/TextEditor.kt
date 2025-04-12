package com.github.netroforge.textonom.ui

import androidx.compose.foundation.ScrollState
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.verticalScroll
import androidx.compose.foundation.ScrollbarAdapter
import androidx.compose.foundation.VerticalScrollbar
import androidx.compose.foundation.HorizontalScrollbar
import org.jetbrains.compose.ui.tooling.preview.Preview
import androidx.compose.material.MaterialTheme
import androidx.compose.material.Surface
import androidx.compose.material.Text
import androidx.compose.material.TextField
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.onGloballyPositioned
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import com.github.netroforge.textonom.model.Settings

/**
 * A text editor component with configurable settings.
 */
@Composable
fun TextEditor(
    text: String,
    onTextChange: (String) -> Unit,
    settings: Settings,
    modifier: Modifier = Modifier,
    readOnly: Boolean = false
) {
    // Create shared scroll state to synchronize line numbers with text
    val verticalScrollState = rememberScrollState()
    val horizontalScrollState = rememberScrollState()

    // Remember the available width for text (used for calculating wrapping)
    var editorWidthPx by remember { mutableStateOf(0f) }
    val density = LocalDensity.current
    val charWidth = with(density) { settings.getFontSize().toPx() * 0.6f } // Estimate average character width

    Surface(
        color = MaterialTheme.colors.background,
        modifier = modifier.fillMaxSize()
    ) {
        Row(modifier = Modifier.fillMaxSize()) {
            // Line numbers column (if enabled)
            if (settings.showLineNumbers) {
                LineNumbers(
                    text = text,
                    fontFamily = settings.getFontFamily(),
                    fontSize = settings.getFontSize(),
                    verticalScrollState = verticalScrollState,
                    wordWrap = settings.wordWrap,
                    wrapColumn = settings.wrapColumn,
                    editorWidthPx = editorWidthPx,
                    charWidth = charWidth
                )
            }

            // Text editor
            Box(modifier = Modifier.fillMaxSize()) {
                if (settings.wordWrap) {
                    // With word wrap - only vertical scrolling
                    Box(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(end = 12.dp, bottom = 12.dp) // Make room for scrollbars
                            .verticalScroll(verticalScrollState)
                            .onGloballyPositioned { coordinates ->
                                // Get the available width for the text editor content
                                editorWidthPx = coordinates.size.width.toFloat()
                            }
                    ) {
                        // Use BasicTextField instead of TextField for better control over padding
                        BasicTextField(
                            value = text,
                            onValueChange = onTextChange,
                            modifier = Modifier
                                .fillMaxSize()
                                .padding(start = 8.dp, top = 14.dp, end = 8.dp, bottom = 8.dp),
                            readOnly = readOnly,
                            textStyle = TextStyle(
                                fontFamily = settings.getFontFamily(),
                                fontSize = settings.getFontSize(),
                                color = MaterialTheme.colors.onBackground,
                                lineHeight = settings.getFontSize().times(1.5f) // Add consistent line height
                            )
                        )
                    }

                    // Vertical scrollbar
                    VerticalScrollbar(
                        modifier = Modifier.align(Alignment.CenterEnd).fillMaxHeight(),
                        adapter = ScrollbarAdapter(verticalScrollState)
                    )
                } else {
                    // Without word wrap - both horizontal and vertical scrolling
                    Box(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(end = 12.dp, bottom = 12.dp) // Make room for scrollbars
                            .verticalScroll(verticalScrollState)
                            .horizontalScroll(horizontalScrollState)
                            .onGloballyPositioned { coordinates ->
                                // Get the available width for the text editor content
                                editorWidthPx = coordinates.size.width.toFloat()
                            }
                    ) {
                        BasicTextField(
                            value = text,
                            onValueChange = onTextChange,
                            modifier = Modifier
                                .fillMaxSize()
                                .padding(start = 8.dp, top = 14.dp, end = 8.dp, bottom = 8.dp),
                            readOnly = readOnly,
                            textStyle = TextStyle(
                                fontFamily = settings.getFontFamily(),
                                fontSize = settings.getFontSize(),
                                color = MaterialTheme.colors.onBackground,
                                lineHeight = settings.getFontSize().times(1.5f) // Add consistent line height
                            )
                        )
                    }

                    // Vertical scrollbar
                    VerticalScrollbar(
                        modifier = Modifier.align(Alignment.CenterEnd).fillMaxHeight(),
                        adapter = ScrollbarAdapter(verticalScrollState)
                    )

                    // Horizontal scrollbar
                    HorizontalScrollbar(
                        modifier = Modifier.align(Alignment.BottomCenter).fillMaxWidth(),
                        adapter = ScrollbarAdapter(horizontalScrollState)
                    )
                }
            }
        }
    }
}

/**
 * Displays line numbers for the text editor.
 * This implementation handles word-wrapped lines by displaying line numbers
 * only for actual logical lines, not for wrapped continuations.
 */
@Composable
private fun LineNumbers(
    text: String,
    fontFamily: FontFamily,
    fontSize: androidx.compose.ui.unit.TextUnit,
    verticalScrollState: ScrollState,
    wordWrap: Boolean,
    wrapColumn: Int,
    editorWidthPx: Float,
    charWidth: Float
) {
    val lines = text.lines()
    val lineCount = lines.size.coerceAtLeast(1) // Ensure at least one line

    // Apply the same padding as the TextField to ensure alignment
    Box(
        modifier = Modifier
            .width(50.dp)
            .fillMaxHeight()
            .padding(bottom = 12.dp) // Make room for horizontal scrollbar
            .verticalScroll(verticalScrollState) // Use the same scroll state as the text editor
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(start = 8.dp, top = 14.dp, end = 8.dp, bottom = 8.dp)
        ) {
            // Render each line number
            for (i in 0 until lineCount) {
                val lineNumber = i + 1
                val lineContent = if (i < lines.size) lines[i] else ""

                // Calculate how many visual lines this logical line will take
                val visualLineCount = if (wordWrap) {
                    // Calculate based on the available width and character width
                    val charsPerLine = if (editorWidthPx > 0) {
                        (editorWidthPx / charWidth).toInt().coerceAtLeast(1)
                    } else {
                        wrapColumn // Fallback to settings if width not yet measured
                    }
                    calculateVisualLineCount(lineContent, charsPerLine)
                } else {
                    1 // No wrapping, so each logical line is one visual line
                }

                // Render the line number for the first visual line
                Text(
                    text = lineNumber.toString(),
                    fontFamily = fontFamily,
                    fontSize = fontSize,
                    color = MaterialTheme.colors.onBackground.copy(alpha = 0.5f),
                    textAlign = TextAlign.End,
                    lineHeight = fontSize.times(1.5f),
                    modifier = Modifier.fillMaxWidth()
                )

                // Add empty space for wrapped continuation lines
                for (j in 1 until visualLineCount) {
                    Spacer(
                        modifier = Modifier.height(fontSize.times(1.5f).value.dp)
                    )
                }
            }
        }
    }
}

/**
 * Calculates how many visual lines a logical line will take when rendered.
 * This is a simple estimation based on line length and the wrap column setting.
 */
private fun calculateVisualLineCount(line: String, wrapColumn: Int): Int {
    // If the line is shorter than the wrap column, it takes just one visual line
    if (line.length <= wrapColumn) {
        return 1
    }

    // Otherwise, estimate how many visual lines it will take
    return (line.length / wrapColumn + 1).coerceAtLeast(1)
}

/**
 * A placeholder to show when no tab is selected.
 */
@Composable
fun NoTabSelectedPlaceholder(settings: Settings) {
    Surface(
        color = MaterialTheme.colors.background,
        modifier = Modifier.fillMaxSize()
    ) {
        Box(modifier = Modifier.fillMaxSize()) {
            Text(
                text = "No tab selected. Create a new tab or open a file.",
                style = TextStyle(
                    fontFamily = settings.getFontFamily(),
                    fontSize = settings.getFontSize(),
                    color = MaterialTheme.colors.onBackground.copy(alpha = 0.6f)
                ),
                modifier = Modifier
                    .align(Alignment.Center)
                    .padding(14.dp)
            )
        }
    }
}
