package com.github.netroforge.textonom.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.selection.selectable
import androidx.compose.foundation.selection.selectableGroup
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Check
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.Dialog
import androidx.compose.ui.window.DialogProperties
import androidx.compose.ui.window.rememberWindowState
import com.github.netroforge.textonom.model.Settings
import com.github.netroforge.textonom.model.ThemeType
import com.github.netroforge.textonom.cyberpunkColors
import com.github.netroforge.textonom.ui.effects.crtEffect
import java.awt.Dimension
import java.awt.Toolkit

/**
 * Dialog for editing application settings.
 */
@Composable
fun SettingsDialog(
    settings: Settings,
    onSettingsChanged: (Settings) -> Unit,
    onDismiss: () -> Unit
) {
    var currentSettings by remember { mutableStateOf(settings) }

    Dialog(
        onDismissRequest = onDismiss
    ) {
        // Get screen dimensions and calculate dialog size as a percentage of screen size
        val screenSize = Toolkit.getDefaultToolkit().screenSize
        val dialogWidth = (screenSize.width * 0.7f).toInt()
        val dialogHeight = (screenSize.height * 0.8f).toInt()

        // Convert pixels to dp
        val density = LocalDensity.current
        val widthDp = with(density) { dialogWidth.toDp() }
        val heightDp = with(density) { dialogHeight.toDp() }

        // Use percentage of screen size for dialog
        Box(modifier = Modifier.size(widthDp, heightDp)) {
            Surface(
                modifier = Modifier.fillMaxSize(),
                color = MaterialTheme.colors.background
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(16.dp)
                ) {
                // Title
                Text(
                    text = "Editor Settings",
                    style = MaterialTheme.typography.h5,
                    modifier = Modifier.padding(bottom = 16.dp)
                )

                // Settings content
                Row(
                    modifier = Modifier
                        .weight(1f)
                        .fillMaxWidth()
                ) {
                    // Tabs for settings categories
                    var selectedTabIndex by remember { mutableStateOf(0) }
                    val tabs = listOf("Theme", "Font", "Tab Behavior", "Display", "Auto-Save")

                    // Use 25% of dialog width for tabs section
                    Column(
                        modifier = Modifier
                            .fillMaxWidth(0.25f)
                            .fillMaxHeight()
                            .background(MaterialTheme.colors.surface)
                            .padding(8.dp)
                    ) {
                        tabs.forEachIndexed { index, title ->
                            SettingsTab(
                                title = title,
                                selected = index == selectedTabIndex,
                                onClick = { selectedTabIndex = index }
                            )
                        }
                    }

                    // Settings content based on selected tab (75% of dialog width)
                    Box(
                        modifier = Modifier
                            .weight(1f)
                            .fillMaxHeight()
                            .padding(16.dp)
                            .verticalScroll(rememberScrollState())
                    ) {
                        when (selectedTabIndex) {
                            0 -> ThemeSettings(currentSettings) { currentSettings = it }
                            1 -> FontSettings(currentSettings) { currentSettings = it }
                            2 -> TabSettings(currentSettings) { currentSettings = it }
                            3 -> DisplaySettings(currentSettings) { currentSettings = it }
                            4 -> AutoSaveSettings(currentSettings) { currentSettings = it }
                        }
                    }
                }

                // Buttons
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(top = 16.dp),
                    horizontalArrangement = Arrangement.End
                ) {
                    Button(
                        onClick = {
                            onSettingsChanged(currentSettings)
                            onDismiss()
                        },
                        colors = ButtonDefaults.buttonColors(
                            backgroundColor = MaterialTheme.colors.primary
                        )
                    ) {
                        Text("Save")
                    }

                    Spacer(modifier = Modifier.width(8.dp))

                    Button(
                        onClick = onDismiss,
                        colors = ButtonDefaults.buttonColors(
                            backgroundColor = MaterialTheme.colors.surface
                        )
                    ) {
                        Text("Cancel")
                    }
                }
                    }
                }
        }
    }
}

/**
 * Tab item in the settings dialog.
 */
@Composable
private fun SettingsTab(
    title: String,
    selected: Boolean,
    onClick: () -> Unit
) {
    val backgroundColor = if (selected) {
        MaterialTheme.colors.primary.copy(alpha = 0.1f)
    } else {
        Color.Transparent
    }

    Row(
        modifier = Modifier
            .fillMaxWidth()
            .height(48.dp)
            .background(backgroundColor)
            .selectable(
                selected = selected,
                onClick = onClick
            )
            .padding(horizontal = 16.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(
            text = title,
            style = MaterialTheme.typography.body1,
            color = if (selected) MaterialTheme.colors.primary else MaterialTheme.colors.onSurface
        )
    }
}

/**
 * Theme settings section.
 */
@Composable
private fun ThemeSettings(
    settings: Settings,
    onSettingsChanged: (Settings) -> Unit
) {
    Column(modifier = Modifier.fillMaxWidth()) {
        Text(
            text = "Theme",
            style = MaterialTheme.typography.h6,
            modifier = Modifier.padding(bottom = 16.dp)
        )

        Row(
            modifier = Modifier
                .fillMaxWidth()
                .selectableGroup()
                .padding(vertical = 8.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text("Theme Mode:", modifier = Modifier.width(120.dp))

            Column(modifier = Modifier.selectableGroup()) {
                // Light theme option
                Row(
                    modifier = Modifier.padding(vertical = 4.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    RadioButton(
                        selected = settings.themeType == ThemeType.LIGHT,
                        onClick = { onSettingsChanged(settings.withThemeType(ThemeType.LIGHT)) }
                    )
                    Text(
                        text = "Light",
                        modifier = Modifier.padding(start = 8.dp)
                    )
                }

                // Dark theme option
                Row(
                    modifier = Modifier.padding(vertical = 4.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    RadioButton(
                        selected = settings.themeType == ThemeType.DARK,
                        onClick = { onSettingsChanged(settings.withThemeType(ThemeType.DARK)) }
                    )
                    Text(
                        text = "Dark",
                        modifier = Modifier.padding(start = 8.dp)
                    )
                }

                // Cyberpunk theme option
                Row(
                    modifier = Modifier.padding(vertical = 4.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    RadioButton(
                        selected = settings.themeType == ThemeType.CYBERPUNK,
                        onClick = { onSettingsChanged(settings.withThemeType(ThemeType.CYBERPUNK)) }
                    )
                    Text(
                        text = "Cyberpunk",
                        modifier = Modifier.padding(start = 8.dp),
                        color = if (settings.themeType == ThemeType.CYBERPUNK) Color(0xFF00FFFF) else MaterialTheme.colors.onSurface
                    )
                }
            }
        }

        // CRT effect toggle (only visible for Cyberpunk theme)
        if (settings.themeType == ThemeType.CYBERPUNK) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 8.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text("CRT Monitor Effect:", modifier = Modifier.width(160.dp))
                Switch(
                    checked = settings.enableCrtEffect,
                    onCheckedChange = { onSettingsChanged(settings.withCrtEffect(it)) },
                    colors = SwitchDefaults.colors(
                        checkedThumbColor = Color(0xFF00FFFF), // Cyan neon for cyberpunk theme
                        checkedTrackColor = Color(0xFF0A0A20).copy(alpha = 0.5f)
                    )
                )
            }

            // Green phosphor toggle (only visible when CRT effect is enabled)
            if (settings.enableCrtEffect) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 8.dp, horizontal = 16.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text("Green Phosphor Mode:", modifier = Modifier.width(160.dp))
                    Switch(
                        checked = settings.useGreenPhosphor,
                        onCheckedChange = { onSettingsChanged(settings.withGreenPhosphor(it)) },
                        colors = SwitchDefaults.colors(
                            checkedThumbColor = Color(0xFF00FF00), // Green for phosphor mode
                            checkedTrackColor = Color(0xFF0A0A20).copy(alpha = 0.5f)
                        )
                    )
                }
            }
        }

        // Theme preview
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(100.dp)
                .padding(vertical = 16.dp)
                .background(
                    when (settings.themeType) {
                        ThemeType.LIGHT -> Color.White
                        ThemeType.DARK -> Color.DarkGray
                        ThemeType.CYBERPUNK -> Color(0xFF0A0A20) // Dark blue-purple background
                    }
                )
                .border(1.dp, Color.Gray)
                // Apply CRT effect to preview if cyberpunk theme is selected and effect is enabled
                .crtEffect(
                    enabled = settings.themeType == ThemeType.CYBERPUNK && settings.enableCrtEffect,
                    scanlineAlpha = 0.2f, // Stronger effect for the preview
                    flickerStrength = 0.04f, // More noticeable flicker for preview
                    glitchProbability = 0.1f, // Much higher probability for preview to showcase the effect
                    greenPhosphor = settings.useGreenPhosphor // Use green phosphor mode if selected
                )
        ) {
            Text(
                text = "Theme Preview",
                color = when (settings.themeType) {
                    ThemeType.LIGHT -> Color.Black
                    ThemeType.DARK -> Color.White
                    ThemeType.CYBERPUNK -> Color(0xFF00FFFF) // Cyan neon text
                },
                modifier = Modifier.align(Alignment.Center)
            )
        }
    }
}

/**
 * Font settings section.
 */
@Composable
private fun FontSettings(
    settings: Settings,
    onSettingsChanged: (Settings) -> Unit
) {
    Column(modifier = Modifier.fillMaxWidth()) {
        Text(
            text = "Font",
            style = MaterialTheme.typography.h6,
            modifier = Modifier.padding(bottom = 16.dp)
        )

        // Font family selection
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(vertical = 8.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text("Font Family:", modifier = Modifier.fillMaxWidth(0.3f))

            val fontOptions = listOf("Default", "Monospace", "Sans Serif", "Serif", "Cursive")
            var expanded by remember { mutableStateOf(false) }

            Box {
                Button(onClick = { expanded = true }) {
                    Text(settings.fontName)
                }

                DropdownMenu(
                    expanded = expanded,
                    onDismissRequest = { expanded = false }
                ) {
                    fontOptions.forEach { option ->
                        DropdownMenuItem(
                            onClick = {
                                onSettingsChanged(settings.copy(fontName = option))
                                expanded = false
                            }
                        ) {
                            Text(option)
                        }
                    }
                }
            }
        }

        // Font size selection
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(vertical = 8.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text("Font Size:", modifier = Modifier.fillMaxWidth(0.3f))

            Slider(
                value = settings.fontSize.toFloat(),
                onValueChange = { onSettingsChanged(settings.copy(fontSize = it.toInt())) },
                valueRange = 8f..24f,
                steps = 15,
                modifier = Modifier.fillMaxWidth(0.5f)
            )

            Text(
                text = "${settings.fontSize}px",
                modifier = Modifier.padding(start = 16.dp)
            )
        }

        // Font preview
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(100.dp)
                .padding(vertical = 16.dp)
                .background(MaterialTheme.colors.surface)
                .border(1.dp, Color.Gray)
        ) {
            Text(
                text = "Font Preview - ${settings.fontName} ${settings.fontSize}px",
                fontFamily = when (settings.fontName) {
                    "Monospace" -> FontFamily.Monospace
                    "Sans Serif" -> FontFamily.SansSerif
                    "Serif" -> FontFamily.Serif
                    "Cursive" -> FontFamily.Cursive
                    else -> FontFamily.Default
                },
                fontSize = settings.getFontSize(),
                modifier = Modifier
                    .align(Alignment.Center)
            )
        }
    }
}

/**
 * Tab behavior settings section.
 */
@Composable
private fun TabSettings(
    settings: Settings,
    onSettingsChanged: (Settings) -> Unit
) {
    Column(modifier = Modifier.fillMaxWidth()) {
        Text(
            text = "Tab Behavior",
            style = MaterialTheme.typography.h6,
            modifier = Modifier.padding(bottom = 16.dp)
        )

        // Tab size
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(vertical = 8.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text("Tab Size:", modifier = Modifier.fillMaxWidth(0.3f))

            Slider(
                value = settings.tabSize.toFloat(),
                onValueChange = { onSettingsChanged(settings.copy(tabSize = it.toInt())) },
                valueRange = 2f..8f,
                steps = 5,
                modifier = Modifier.fillMaxWidth(0.5f)
            )

            Text(
                text = "${settings.tabSize} spaces",
                modifier = Modifier.padding(start = 16.dp)
            )
        }

        // Use spaces for tabs
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(vertical = 8.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Checkbox(
                checked = settings.useSpacesForTabs,
                onCheckedChange = { onSettingsChanged(settings.copy(useSpacesForTabs = it)) }
            )

            Text(
                text = "Use spaces for tabs",
                modifier = Modifier.padding(start = 8.dp)
            )
        }

        // Auto-indent
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(vertical = 8.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Checkbox(
                checked = settings.autoIndent,
                onCheckedChange = { onSettingsChanged(settings.copy(autoIndent = it)) }
            )

            Text(
                text = "Enable auto-indent",
                modifier = Modifier.padding(start = 8.dp)
            )
        }
    }
}

/**
 * Display settings section.
 */
@Composable
private fun DisplaySettings(
    settings: Settings,
    onSettingsChanged: (Settings) -> Unit
) {
    Column(modifier = Modifier.fillMaxWidth()) {
        Text(
            text = "Display",
            style = MaterialTheme.typography.h6,
            modifier = Modifier.padding(bottom = 16.dp)
        )

        // Show line numbers
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(vertical = 8.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Checkbox(
                checked = settings.showLineNumbers,
                onCheckedChange = { onSettingsChanged(settings.copy(showLineNumbers = it)) }
            )

            Text(
                text = "Show line numbers",
                modifier = Modifier.padding(start = 8.dp)
            )
        }

        // Word wrap
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(vertical = 8.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Checkbox(
                checked = settings.wordWrap,
                onCheckedChange = { onSettingsChanged(settings.copy(wordWrap = it)) }
            )

            Text(
                text = "Enable word wrap",
                modifier = Modifier.padding(start = 8.dp)
            )
        }

        // Wrap column
        if (settings.wordWrap) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 8.dp, horizontal = 32.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text("Wrap column:", modifier = Modifier.fillMaxWidth(0.3f))

                Slider(
                    value = settings.wrapColumn.toFloat(),
                    onValueChange = { onSettingsChanged(settings.copy(wrapColumn = it.toInt())) },
                    valueRange = 40f..120f,
                    steps = 79,
                    modifier = Modifier.fillMaxWidth(0.5f)
                )

                Text(
                    text = "${settings.wrapColumn} characters",
                    modifier = Modifier.padding(start = 16.dp)
                )
            }
        }
    }
}

/**
 * Auto-save settings section.
 */
@Composable
private fun AutoSaveSettings(
    settings: Settings,
    onSettingsChanged: (Settings) -> Unit
) {
    Column(modifier = Modifier.fillMaxWidth()) {
        Text(
            text = "Auto-Save",
            style = MaterialTheme.typography.h6,
            modifier = Modifier.padding(bottom = 16.dp)
        )

        // Enable auto-save
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(vertical = 8.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Checkbox(
                checked = settings.autoSave,
                onCheckedChange = { onSettingsChanged(settings.copy(autoSave = it)) }
            )

            Text(
                text = "Enable auto-save",
                modifier = Modifier.padding(start = 8.dp)
            )
        }

        // Auto-save interval
        if (settings.autoSave) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 8.dp, horizontal = 32.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text("Interval:", modifier = Modifier.fillMaxWidth(0.3f))

                Slider(
                    value = settings.autoSaveIntervalSeconds.toFloat(),
                    onValueChange = { onSettingsChanged(settings.copy(autoSaveIntervalSeconds = it.toInt())) },
                    valueRange = 10f..300f,
                    steps = 28,
                    modifier = Modifier.fillMaxWidth(0.5f)
                )

                Text(
                    text = "${settings.autoSaveIntervalSeconds} seconds",
                    modifier = Modifier.padding(start = 16.dp)
                )
            }
        }
    }
}
