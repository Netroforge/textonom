package com.github.netroforge.textonom.ui

import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.material.MaterialTheme
import androidx.compose.material.Surface
import androidx.compose.material.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.focus.FocusRequester
import androidx.compose.ui.focus.focusRequester
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.input.key.*
import androidx.compose.ui.layout.onGloballyPositioned
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import com.github.netroforge.textonom.model.Settings
import com.github.netroforge.textonom.model.ThemeType

/**
 * A text editor component with configurable settings.
 */
@Composable
fun TextEditor(
    text: String,
    onTextChange: (String) -> Unit,
    settings: Settings,
    onUndo: () -> Boolean = { false },
    onRedo: () -> Boolean = { false },
    modifier: Modifier = Modifier,
    readOnly: Boolean = false,
    autoFocus: Boolean = true // Add parameter to control auto-focus behavior
) {
    // Create shared scroll state to synchronize line numbers with text
    val verticalScrollState = rememberScrollState()
    val horizontalScrollState = rememberScrollState()

    // Create a focus requester to automatically focus the text field
    val focusRequester = remember { FocusRequester() }

    // Remember the available width for text (used for calculating wrapping)
    var editorWidthPx by remember { mutableStateOf(0f) }
    val density = LocalDensity.current
    val charWidth = with(density) { settings.getFontSize().toPx() * 0.6f } // Estimate average character width

    // Auto-focus the text field when it's first displayed
    LaunchedEffect(Unit) {
        if (autoFocus) {
            focusRequester.requestFocus()
        }
    }

    // Key event handler for undo/redo
    val keyEventHandler = { keyEvent: KeyEvent ->
        when {
            // Undo: Ctrl+Z
            (keyEvent.isCtrlPressed && !keyEvent.isShiftPressed && keyEvent.key == Key.Z && keyEvent.type == KeyEventType.KeyDown) -> {
                println("TextEditor: Ctrl+Z pressed, calling onUndo()")
                val undoResult = onUndo()
                println("TextEditor: onUndo() result=$undoResult")
                true
            }
            // Redo: Ctrl+Shift+Z
            (keyEvent.isCtrlPressed && keyEvent.isShiftPressed && keyEvent.key == Key.Z && keyEvent.type == KeyEventType.KeyDown) -> {
                println("TextEditor: Ctrl+Shift+Z pressed, calling onRedo()")
                val redoResult = onRedo()
                println("TextEditor: onRedo() result=$redoResult")
                true
            }
            else -> false
        }
    }

    Surface(
        color = MaterialTheme.colors.background,
        modifier = modifier.fillMaxSize().onKeyEvent(keyEventHandler)
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
                                .padding(start = 8.dp, top = 14.dp, end = 8.dp, bottom = 8.dp)
                                .focusRequester(focusRequester),
                            readOnly = readOnly,
                            textStyle = TextStyle(
                                fontFamily = settings.getFontFamily(),
                                fontSize = settings.getFontSize(),
                                color = MaterialTheme.colors.onBackground,
                                lineHeight = settings.getFontSize().times(1.5f) // Add consistent line height
                            ),
                            cursorBrush = SolidColor(getCursorColor(settings.themeType))
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
                                .padding(start = 8.dp, top = 14.dp, end = 8.dp, bottom = 8.dp)
                                .focusRequester(focusRequester),
                            readOnly = readOnly,
                            textStyle = TextStyle(
                                fontFamily = settings.getFontFamily(),
                                fontSize = settings.getFontSize(),
                                color = MaterialTheme.colors.onBackground,
                                lineHeight = settings.getFontSize().times(1.5f) // Add consistent line height
                            ),
                            cursorBrush = SolidColor(getCursorColor(settings.themeType))
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
 * Returns the cursor color based on the current theme.
 */
private fun getCursorColor(themeType: ThemeType): Color {
    return when (themeType) {
        ThemeType.LIGHT -> Color(0xFF000000) // Black cursor for light theme
        ThemeType.DARK -> Color(0xFFFFFFFF) // White cursor for dark theme
        ThemeType.CYBERPUNK -> Color(0xFF00FFFF) // Cyan neon cursor for cyberpunk theme
        ThemeType.CYBERPUNK_TURBO -> Color(0xFF00FFFF) // Cyan neon cursor for cyberpunk turbo theme
    }
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
