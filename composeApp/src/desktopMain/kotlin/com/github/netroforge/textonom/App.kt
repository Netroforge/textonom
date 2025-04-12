package com.github.netroforge.textonom

import androidx.compose.foundation.layout.*
import androidx.compose.material.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.window.FrameWindowScope
import com.github.netroforge.textonom.model.Settings
import com.github.netroforge.textonom.ui.*
import com.github.netroforge.textonom.utils.TextTransformations
import com.github.netroforge.textonom.viewmodel.SettingsManager
import com.github.netroforge.textonom.viewmodel.TabManager
import org.jetbrains.compose.ui.tooling.preview.Preview

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
        colors = if (settingsManager.settings.isDarkTheme) {
            darkColors()
        } else {
            lightColors()
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
        Column(modifier = Modifier.fillMaxSize()) {
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
