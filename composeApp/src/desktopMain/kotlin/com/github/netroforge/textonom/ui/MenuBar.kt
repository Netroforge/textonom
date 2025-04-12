package com.github.netroforge.textonom.ui

import androidx.compose.runtime.Composable
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.window.FrameWindowScope
import androidx.compose.ui.window.MenuBar
import io.github.vinceglb.filekit.core.FileKit
import io.github.vinceglb.filekit.core.PickerMode
import io.github.vinceglb.filekit.core.PickerType
import kotlinx.coroutines.launch
import java.io.File

/**
 * Menu bar for the application.
 */
@Composable
fun FrameWindowScope.AppMenuBar(
    onOpenFile: (File) -> Unit,
    onSaveFile: (File?) -> Unit,
    onNewFile: () -> Unit,
    onExit: () -> Unit,
    onEncodeBase64: () -> Unit,
    onDecodeBase64: () -> Unit,
    onPrettifyJson: () -> Unit,
    onCompactJson: () -> Unit,
    onUrlEncode: () -> Unit,
    onUrlDecode: () -> Unit,
    onToUpperCase: () -> Unit,
    onToLowerCase: () -> Unit,
    onToTitleCase: () -> Unit,
    onPrettifyXml: () -> Unit,
    onCompactXml: () -> Unit,
    onSortLines: () -> Unit,
    onDeduplicateLines: () -> Unit,
    onReverseLines: () -> Unit,
    onEncodeHtml: () -> Unit,
    onDecodeHtml: () -> Unit,
    onMd5Hash: () -> Unit,
    onSha1Hash: () -> Unit,
    onSha256Hash: () -> Unit,
    onEscapeUnicode: () -> Unit,
    onUnescapeUnicode: () -> Unit,
    onJsonToYaml: () -> Unit,
    onPropertiesToYaml: () -> Unit,
    onOpenSettings: () -> Unit,
    hasSelectedTab: Boolean,
    selectedTab: com.github.netroforge.textonom.model.Tab?
) {
    MenuBar {
        // File menu
        Menu("File", mnemonic = 'F') {
            Item("Settings", onClick = onOpenSettings)
            Separator()
            Item("New", onClick = onNewFile)
            val coroutineScope = rememberCoroutineScope()

            Item("Open...", onClick = {
                coroutineScope.launch {
                    // Use FileKit to open file picker
                    // To show all files, we pass null for the extensions list
                    val file = FileKit.pickFile(
                        title = "Open File",
                        type = PickerType.File(extensions = null), // null means all files
                        mode = PickerMode.Single
                    )

                    file?.let {
                        onOpenFile(File(it.path))
                    }
                }
            })

            // Save and Save As are only enabled if there's a selected tab
            Item(
                "Save",
                enabled = hasSelectedTab,
                onClick = { onSaveFile(null) }
            )

            Item(
                "Save As...",
                enabled = hasSelectedTab,
                onClick = {
                    coroutineScope.launch {
                        // Get the current tab's file name and extension
                        val currentTab = selectedTab

                        // Determine base name and extension
                        val (baseName, extension) = if (currentTab?.file != null) {
                            // Use the name and extension from the current file
                            val fileName = currentTab.file.name.substringBeforeLast(".", currentTab.file.name)
                            val fileExt = currentTab.file.name.substringAfterLast(".", "").takeIf { it.isNotEmpty() } ?: "txt"
                            Pair(fileName, fileExt)
                        } else {
                            // New file, use default name and extension
                            Pair("document", "txt")
                        }

                        // Use FileKit to open file saver
                        val file = FileKit.saveFile(
                            baseName = baseName,
                            extension = extension
                        )

                        file?.let {
                            onSaveFile(File(it.path))
                        }
                    }
                }
            )

            Separator()
            Item("Exit", onClick = onExit)
        }

        // Transform menu
        Menu("Transform", mnemonic = 'T', enabled = hasSelectedTab) {
            // Base64 submenu
            Menu("Base64", mnemonic = 'B') {
                Item("Encode", onClick = onEncodeBase64)
                Item("Decode", onClick = onDecodeBase64)
            }

            // URL submenu
            Menu("URL", mnemonic = 'U') {
                Item("Encode", onClick = onUrlEncode)
                Item("Decode", onClick = onUrlDecode)
            }

            // HTML submenu
            Menu("HTML", mnemonic = 'H') {
                Item("Encode Entities", onClick = onEncodeHtml)
                Item("Decode Entities", onClick = onDecodeHtml)
            }

            // Case submenu
            Menu("Case", mnemonic = 'C') {
                Item("UPPERCASE", onClick = onToUpperCase)
                Item("lowercase", onClick = onToLowerCase)
                Item("Title Case", onClick = onToTitleCase)
            }

            // JSON submenu
            Menu("JSON", mnemonic = 'J') {
                Item("Prettify", onClick = onPrettifyJson)
                Item("Compact", onClick = onCompactJson)
                Separator()
                Item("Convert to YAML", onClick = onJsonToYaml)
            }

            // XML submenu
            Menu("XML", mnemonic = 'X') {
                Item("Prettify", onClick = onPrettifyXml)
                Item("Compact", onClick = onCompactXml)
            }

            // Line Operations submenu
            Menu("Line Operations", mnemonic = 'L') {
                Item("Sort Lines", onClick = onSortLines)
                Item("Remove Duplicates", onClick = onDeduplicateLines)
                Item("Reverse Order", onClick = onReverseLines)
            }

            // Hash submenu
            Menu("Hash", mnemonic = 'H') {
                Item("MD5", onClick = onMd5Hash)
                Item("SHA-1", onClick = onSha1Hash)
                Item("SHA-256", onClick = onSha256Hash)
            }

            // Unicode submenu
            Menu("Unicode", mnemonic = 'U') {
                Item("Escape", onClick = onEscapeUnicode)
                Item("Unescape", onClick = onUnescapeUnicode)
            }

            // Spring Boot submenu
            Menu("Spring Boot", mnemonic = 'S') {
                Item("Properties to YAML", onClick = onPropertiesToYaml)
            }
        }
    }
}
