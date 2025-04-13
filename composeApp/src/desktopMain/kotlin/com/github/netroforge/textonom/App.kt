package com.github.netroforge.textonom

import androidx.compose.foundation.layout.*
import androidx.compose.material.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.window.FrameWindowScope
import com.github.netroforge.textonom.model.Settings
import com.github.netroforge.textonom.model.ThemeType
import com.github.netroforge.textonom.ui.*
import com.github.netroforge.textonom.ui.effects.crtEffect
import com.github.netroforge.textonom.utils.TextTransformations
import com.github.netroforge.textonom.viewmodel.SettingsManager
import com.github.netroforge.textonom.viewmodel.TabManager
import org.jetbrains.compose.ui.tooling.preview.Preview

/**
 * Creates a cyberpunk color palette inspired by new retro wave from the 80s.
 */
fun cyberpunkColors(): Colors {
    return Colors(
        primary = Color(0xFF00FFFF), // Cyan neon
        primaryVariant = Color(0xFF00CCCC),
        secondary = Color(0xFFFF00FF), // Magenta neon
        secondaryVariant = Color(0xFFCC00CC),
        background = Color(0xFF0A0A20), // Dark blue-purple
        surface = Color(0xFF1A1A30),
        error = Color(0xFFFF3366), // Neon red
        onPrimary = Color(0xFF000000), // Black text on bright colors
        onSecondary = Color(0xFF000000),
        onBackground = Color(0xFFFFFFFF), // White text on dark backgrounds
        onSurface = Color(0xFFFFFFFF),
        onError = Color(0xFF000000),
        isLight = false
    )
}

@Composable
fun FrameWindowScope.App() {
    // Create the SettingsManager
    val settingsManager = remember { SettingsManager() }

    // Create the TabManager with settings
    val tabManager = remember { TabManager(settingsManager.settings) }

    // Start auto-save if enabled
    LaunchedEffect(settingsManager.settings) {
        tabManager.updateSettings(settingsManager.settings)
        tabManager.startAutoSave()
    }

    // Show settings dialog state
    var showSettingsDialog by remember { mutableStateOf(false) }

    // Apply theme based on settings
    MaterialTheme(
        colors = when (settingsManager.settings.themeType) {
            ThemeType.DARK -> darkColors()
            ThemeType.LIGHT -> lightColors()
            ThemeType.CYBERPUNK -> cyberpunkColors()
        }
    ) {
        // Set up the menu bar
        AppMenuBar(
            onOpenFile = { file -> tabManager.openFile(file) },
            onSaveFile = { file -> tabManager.saveSelectedTab(file) },
            onNewFile = { tabManager.createNewTab() },
            onExit = { },  // This will be handled in Main.kt
            onEncodeBase64 = {
                tabManager.transformSelectedTabContent(TextTransformations::encodeBase64)
            },
            onDecodeBase64 = {
                tabManager.transformSelectedTabContent(TextTransformations::decodeBase64)
            },
            onPrettifyJson = {
                tabManager.transformSelectedTabContent(TextTransformations::prettifyJson)
            },
            onCompactJson = {
                tabManager.transformSelectedTabContent(TextTransformations::compactJson)
            },
            onUrlEncode = {
                tabManager.transformSelectedTabContent(TextTransformations::urlEncode)
            },
            onUrlDecode = {
                tabManager.transformSelectedTabContent(TextTransformations::urlDecode)
            },
            onToUpperCase = {
                tabManager.transformSelectedTabContent(TextTransformations::toUpperCase)
            },
            onToLowerCase = {
                tabManager.transformSelectedTabContent(TextTransformations::toLowerCase)
            },
            onToTitleCase = {
                tabManager.transformSelectedTabContent(TextTransformations::toTitleCase)
            },
            onPrettifyXml = {
                tabManager.transformSelectedTabContent(TextTransformations::prettifyXml)
            },
            onCompactXml = {
                tabManager.transformSelectedTabContent(TextTransformations::compactXml)
            },
            onSortLines = {
                tabManager.transformSelectedTabContent(TextTransformations::sortLines)
            },
            onDeduplicateLines = {
                tabManager.transformSelectedTabContent(TextTransformations::deduplicateLines)
            },
            onReverseLines = {
                tabManager.transformSelectedTabContent(TextTransformations::reverseLines)
            },
            onEncodeHtml = {
                tabManager.transformSelectedTabContent(TextTransformations::encodeHtml)
            },
            onDecodeHtml = {
                tabManager.transformSelectedTabContent(TextTransformations::decodeHtml)
            },
            onMd5Hash = {
                tabManager.transformSelectedTabContent(TextTransformations::md5Hash)
            },
            onSha1Hash = {
                tabManager.transformSelectedTabContent(TextTransformations::sha1Hash)
            },
            onSha256Hash = {
                tabManager.transformSelectedTabContent(TextTransformations::sha256Hash)
            },
            onEscapeUnicode = {
                tabManager.transformSelectedTabContent(TextTransformations::escapeUnicode)
            },
            onUnescapeUnicode = {
                tabManager.transformSelectedTabContent(TextTransformations::unescapeUnicode)
            },
            onJsonToYaml = {
                tabManager.transformSelectedTabContent(TextTransformations::jsonToYaml)
            },
            onPropertiesToYaml = {
                tabManager.transformSelectedTabContent(TextTransformations::propertiesToYaml)
            },
            onOpenSettings = {
                showSettingsDialog = true
            },
            hasSelectedTab = tabManager.selectedTab != null,
            selectedTab = tabManager.selectedTab
        )

        // Main layout
        // Apply CRT effect if cyberpunk theme is selected and effect is enabled
        val shouldApplyCrtEffect = settingsManager.settings.themeType == ThemeType.CYBERPUNK &&
                                  settingsManager.settings.enableCrtEffect

        Column(modifier = Modifier
            .fillMaxSize()
            .crtEffect(
                enabled = shouldApplyCrtEffect,
                scanlineAlpha = 0.12f,  // Slightly reduced for better readability
                flickerStrength = 0.02f, // Subtle flicker
                glitchProbability = 0.05f, // More frequent glitches for authentic retro feel
                greenPhosphor = settingsManager.settings.useGreenPhosphor  // Use green phosphor mode if selected
            )
        ) {
            // Tab bar
            TabBar(
                tabs = tabManager.tabs,
                selectedTabIndex = tabManager.selectedTabIndex,
                onTabSelected = { index -> tabManager.selectTab(index) },
                onTabClosed = { index -> tabManager.closeTab(index) },
                onNewTabClicked = { tabManager.createNewTab() }
            )

            // Text editor area
            Box(modifier = Modifier.weight(1f)) {
                val selectedTab = tabManager.selectedTab
                if (selectedTab != null) {
                    TextEditor(
                        text = selectedTab.content,
                        onTextChange = { newText -> tabManager.updateSelectedTabContent(newText) },
                        settings = settingsManager.settings
                    )
                } else {
                    NoTabSelectedPlaceholder(settings = settingsManager.settings)
                }
            }
        }

        // Show settings dialog if requested
        if (showSettingsDialog) {
            SettingsDialog(
                settings = settingsManager.settings,
                onSettingsChanged = { newSettings ->
                    settingsManager.updateSettings(newSettings)
                },
                onDismiss = { showSettingsDialog = false }
            )
        }
    }
}
