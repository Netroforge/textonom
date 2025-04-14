package com.github.netroforge.textonom.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.material.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.KeyboardArrowRight
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import com.github.netroforge.textonom.model.Tab
import io.github.vinceglb.filekit.core.FileKit
import io.github.vinceglb.filekit.core.PickerMode
import io.github.vinceglb.filekit.core.PickerType
import kotlinx.coroutines.launch
import java.io.File

/**
 * Custom top navigation bar for the application.
 * Replaces the system menu bar with a Compose-based implementation.
 */
@Composable
fun TopNavBar(
    onOpenFile: (File) -> Unit,
    onSaveFile: (File?) -> Unit,
    onNewFile: () -> Unit,
    onExit: () -> Unit,
    onUndo: () -> Boolean,
    onRedo: () -> Boolean,
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
    canUndo: Boolean,
    canRedo: Boolean,
    selectedTab: Tab?
) {
    val coroutineScope = rememberCoroutineScope()

    // State for dropdown menus
    var fileMenuExpanded by remember { mutableStateOf(false) }
    var editMenuExpanded by remember { mutableStateOf(false) }
    var transformMenuExpanded by remember { mutableStateOf(false) }

    // Submenu states
    var base64MenuExpanded by remember { mutableStateOf(false) }
    var urlMenuExpanded by remember { mutableStateOf(false) }
    var htmlMenuExpanded by remember { mutableStateOf(false) }
    var caseMenuExpanded by remember { mutableStateOf(false) }
    var jsonMenuExpanded by remember { mutableStateOf(false) }
    var xmlMenuExpanded by remember { mutableStateOf(false) }
    var lineOpsMenuExpanded by remember { mutableStateOf(false) }
    var hashMenuExpanded by remember { mutableStateOf(false) }
    var unicodeMenuExpanded by remember { mutableStateOf(false) }
    var springBootMenuExpanded by remember { mutableStateOf(false) }

    Surface(
        elevation = 4.dp,
        modifier = Modifier.fillMaxWidth()
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .height(48.dp)
                .background(MaterialTheme.colors.surface)
                .padding(horizontal = 8.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            // File Menu
            Box {
                Text(
                    text = "File",
                    modifier = Modifier
                        .clickable { fileMenuExpanded = true }
                        .padding(horizontal = 8.dp, vertical = 4.dp)
                )

                DropdownMenu(
                    expanded = fileMenuExpanded,
                    onDismissRequest = { fileMenuExpanded = false }
                ) {
                    DropdownMenuItem(onClick = {
                        onOpenSettings()
                        fileMenuExpanded = false
                    }) {
                        Text("Settings")
                    }

                    Divider()

                    DropdownMenuItem(onClick = {
                        onNewFile()
                        fileMenuExpanded = false
                    }) {
                        Text("New")
                    }

                    DropdownMenuItem(onClick = {
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
                        fileMenuExpanded = false
                    }) {
                        Text("Open...")
                    }

                    DropdownMenuItem(
                        onClick = {
                            onSaveFile(null)
                            fileMenuExpanded = false
                        },
                        enabled = hasSelectedTab
                    ) {
                        Text("Save")
                    }

                    DropdownMenuItem(
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
                            fileMenuExpanded = false
                        },
                        enabled = hasSelectedTab
                    ) {
                        Text("Save As...")
                    }

                    Divider()

                    DropdownMenuItem(onClick = {
                        onExit()
                        fileMenuExpanded = false
                    }) {
                        Text("Exit")
                    }
                }
            }

            Spacer(modifier = Modifier.width(8.dp))

            // Edit Menu
            Box {
                Text(
                    text = "Edit",
                    modifier = Modifier
                        .clickable(enabled = hasSelectedTab) { editMenuExpanded = true }
                        .padding(horizontal = 8.dp, vertical = 4.dp),
                    color = if (hasSelectedTab) MaterialTheme.colors.onSurface else MaterialTheme.colors.onSurface.copy(alpha = 0.38f)
                )

                DropdownMenu(
                    expanded = editMenuExpanded,
                    onDismissRequest = { editMenuExpanded = false }
                ) {
                    DropdownMenuItem(
                        onClick = {
                            onUndo()
                            editMenuExpanded = false
                        },
                        enabled = canUndo
                    ) {
                        Text("Undo (Ctrl+Z)")
                    }

                    DropdownMenuItem(
                        onClick = {
                            onRedo()
                            editMenuExpanded = false
                        },
                        enabled = canRedo
                    ) {
                        Text("Redo (Ctrl+Shift+Z)")
                    }
                }
            }

            Spacer(modifier = Modifier.width(8.dp))

            // Transform Menu
            Box {
                Text(
                    text = "Transform",
                    modifier = Modifier
                        .clickable(enabled = hasSelectedTab) { transformMenuExpanded = true }
                        .padding(horizontal = 8.dp, vertical = 4.dp),
                    color = if (hasSelectedTab) MaterialTheme.colors.onSurface else MaterialTheme.colors.onSurface.copy(alpha = 0.38f)
                )

                DropdownMenu(
                    expanded = transformMenuExpanded,
                    onDismissRequest = { transformMenuExpanded = false }
                ) {
                    // Base64 submenu
                    Box {
                        DropdownMenuItem(onClick = { base64MenuExpanded = true }) {
                            Row(
                                horizontalArrangement = Arrangement.SpaceBetween,
                                modifier = Modifier.fillMaxWidth()
                            ) {
                                Text("Base64")
                                Icon(
                                    imageVector = Icons.Default.KeyboardArrowRight,
                                    contentDescription = "Base64 submenu",
                                    modifier = Modifier.size(24.dp)
                                )
                            }
                        }

                        DropdownMenu(
                            expanded = base64MenuExpanded,
                            onDismissRequest = { base64MenuExpanded = false }
                        ) {
                            DropdownMenuItem(onClick = {
                                onEncodeBase64()
                                base64MenuExpanded = false
                                transformMenuExpanded = false
                            }) {
                                Text("Encode")
                            }

                            DropdownMenuItem(onClick = {
                                onDecodeBase64()
                                base64MenuExpanded = false
                                transformMenuExpanded = false
                            }) {
                                Text("Decode")
                            }
                        }
                    }

                    // URL submenu
                    Box {
                        DropdownMenuItem(onClick = { urlMenuExpanded = true }) {
                            Row(
                                horizontalArrangement = Arrangement.SpaceBetween,
                                modifier = Modifier.fillMaxWidth()
                            ) {
                                Text("URL")
                                Icon(
                                    imageVector = Icons.Default.KeyboardArrowRight,
                                    contentDescription = "URL submenu",
                                    modifier = Modifier.size(24.dp)
                                )
                            }
                        }

                        DropdownMenu(
                            expanded = urlMenuExpanded,
                            onDismissRequest = { urlMenuExpanded = false }
                        ) {
                            DropdownMenuItem(onClick = {
                                onUrlEncode()
                                urlMenuExpanded = false
                                transformMenuExpanded = false
                            }) {
                                Text("Encode")
                            }

                            DropdownMenuItem(onClick = {
                                onUrlDecode()
                                urlMenuExpanded = false
                                transformMenuExpanded = false
                            }) {
                                Text("Decode")
                            }
                        }
                    }

                    // HTML submenu
                    Box {
                        DropdownMenuItem(onClick = { htmlMenuExpanded = true }) {
                            Row(
                                horizontalArrangement = Arrangement.SpaceBetween,
                                modifier = Modifier.fillMaxWidth()
                            ) {
                                Text("HTML")
                                Icon(
                                    imageVector = Icons.Default.KeyboardArrowRight,
                                    contentDescription = "HTML submenu",
                                    modifier = Modifier.size(24.dp)
                                )
                            }
                        }

                        DropdownMenu(
                            expanded = htmlMenuExpanded,
                            onDismissRequest = { htmlMenuExpanded = false }
                        ) {
                            DropdownMenuItem(onClick = {
                                onEncodeHtml()
                                htmlMenuExpanded = false
                                transformMenuExpanded = false
                            }) {
                                Text("Encode Entities")
                            }

                            DropdownMenuItem(onClick = {
                                onDecodeHtml()
                                htmlMenuExpanded = false
                                transformMenuExpanded = false
                            }) {
                                Text("Decode Entities")
                            }
                        }
                    }

                    // Case submenu
                    Box {
                        DropdownMenuItem(onClick = { caseMenuExpanded = true }) {
                            Row(
                                horizontalArrangement = Arrangement.SpaceBetween,
                                modifier = Modifier.fillMaxWidth()
                            ) {
                                Text("Case")
                                Icon(
                                    imageVector = Icons.Default.KeyboardArrowRight,
                                    contentDescription = "Case submenu",
                                    modifier = Modifier.size(24.dp)
                                )
                            }
                        }

                        DropdownMenu(
                            expanded = caseMenuExpanded,
                            onDismissRequest = { caseMenuExpanded = false }
                        ) {
                            DropdownMenuItem(onClick = {
                                onToUpperCase()
                                caseMenuExpanded = false
                                transformMenuExpanded = false
                            }) {
                                Text("UPPERCASE")
                            }

                            DropdownMenuItem(onClick = {
                                onToLowerCase()
                                caseMenuExpanded = false
                                transformMenuExpanded = false
                            }) {
                                Text("lowercase")
                            }

                            DropdownMenuItem(onClick = {
                                onToTitleCase()
                                caseMenuExpanded = false
                                transformMenuExpanded = false
                            }) {
                                Text("Title Case")
                            }
                        }
                    }

                    // JSON submenu
                    Box {
                        DropdownMenuItem(onClick = { jsonMenuExpanded = true }) {
                            Row(
                                horizontalArrangement = Arrangement.SpaceBetween,
                                modifier = Modifier.fillMaxWidth()
                            ) {
                                Text("JSON")
                                Icon(
                                    imageVector = Icons.Default.KeyboardArrowRight,
                                    contentDescription = "JSON submenu",
                                    modifier = Modifier.size(24.dp)
                                )
                            }
                        }

                        DropdownMenu(
                            expanded = jsonMenuExpanded,
                            onDismissRequest = { jsonMenuExpanded = false }
                        ) {
                            DropdownMenuItem(onClick = {
                                onPrettifyJson()
                                jsonMenuExpanded = false
                                transformMenuExpanded = false
                            }) {
                                Text("Prettify")
                            }

                            DropdownMenuItem(onClick = {
                                onCompactJson()
                                jsonMenuExpanded = false
                                transformMenuExpanded = false
                            }) {
                                Text("Compact")
                            }

                            Divider()

                            DropdownMenuItem(onClick = {
                                onJsonToYaml()
                                jsonMenuExpanded = false
                                transformMenuExpanded = false
                            }) {
                                Text("Convert to YAML")
                            }
                        }
                    }

                    // XML submenu
                    Box {
                        DropdownMenuItem(onClick = { xmlMenuExpanded = true }) {
                            Row(
                                horizontalArrangement = Arrangement.SpaceBetween,
                                modifier = Modifier.fillMaxWidth()
                            ) {
                                Text("XML")
                                Icon(
                                    imageVector = Icons.Default.KeyboardArrowRight,
                                    contentDescription = "XML submenu",
                                    modifier = Modifier.size(24.dp)
                                )
                            }
                        }

                        DropdownMenu(
                            expanded = xmlMenuExpanded,
                            onDismissRequest = { xmlMenuExpanded = false }
                        ) {
                            DropdownMenuItem(onClick = {
                                onPrettifyXml()
                                xmlMenuExpanded = false
                                transformMenuExpanded = false
                            }) {
                                Text("Prettify")
                            }

                            DropdownMenuItem(onClick = {
                                onCompactXml()
                                xmlMenuExpanded = false
                                transformMenuExpanded = false
                            }) {
                                Text("Compact")
                            }
                        }
                    }

                    // Line Operations submenu
                    Box {
                        DropdownMenuItem(onClick = { lineOpsMenuExpanded = true }) {
                            Row(
                                horizontalArrangement = Arrangement.SpaceBetween,
                                modifier = Modifier.fillMaxWidth()
                            ) {
                                Text("Line Operations")
                                Icon(
                                    imageVector = Icons.Default.KeyboardArrowRight,
                                    contentDescription = "Line Operations submenu",
                                    modifier = Modifier.size(24.dp)
                                )
                            }
                        }

                        DropdownMenu(
                            expanded = lineOpsMenuExpanded,
                            onDismissRequest = { lineOpsMenuExpanded = false }
                        ) {
                            DropdownMenuItem(onClick = {
                                onSortLines()
                                lineOpsMenuExpanded = false
                                transformMenuExpanded = false
                            }) {
                                Text("Sort Lines")
                            }

                            DropdownMenuItem(onClick = {
                                onDeduplicateLines()
                                lineOpsMenuExpanded = false
                                transformMenuExpanded = false
                            }) {
                                Text("Remove Duplicates")
                            }

                            DropdownMenuItem(onClick = {
                                onReverseLines()
                                lineOpsMenuExpanded = false
                                transformMenuExpanded = false
                            }) {
                                Text("Reverse Order")
                            }
                        }
                    }

                    // Hash submenu
                    Box {
                        DropdownMenuItem(onClick = { hashMenuExpanded = true }) {
                            Row(
                                horizontalArrangement = Arrangement.SpaceBetween,
                                modifier = Modifier.fillMaxWidth()
                            ) {
                                Text("Hash")
                                Icon(
                                    imageVector = Icons.Default.KeyboardArrowRight,
                                    contentDescription = "Hash submenu",
                                    modifier = Modifier.size(24.dp)
                                )
                            }
                        }

                        DropdownMenu(
                            expanded = hashMenuExpanded,
                            onDismissRequest = { hashMenuExpanded = false }
                        ) {
                            DropdownMenuItem(onClick = {
                                onMd5Hash()
                                hashMenuExpanded = false
                                transformMenuExpanded = false
                            }) {
                                Text("MD5")
                            }

                            DropdownMenuItem(onClick = {
                                onSha1Hash()
                                hashMenuExpanded = false
                                transformMenuExpanded = false
                            }) {
                                Text("SHA-1")
                            }

                            DropdownMenuItem(onClick = {
                                onSha256Hash()
                                hashMenuExpanded = false
                                transformMenuExpanded = false
                            }) {
                                Text("SHA-256")
                            }
                        }
                    }

                    // Unicode submenu
                    Box {
                        DropdownMenuItem(onClick = { unicodeMenuExpanded = true }) {
                            Row(
                                horizontalArrangement = Arrangement.SpaceBetween,
                                modifier = Modifier.fillMaxWidth()
                            ) {
                                Text("Unicode")
                                Icon(
                                    imageVector = Icons.Default.KeyboardArrowRight,
                                    contentDescription = "Unicode submenu",
                                    modifier = Modifier.size(24.dp)
                                )
                            }
                        }

                        DropdownMenu(
                            expanded = unicodeMenuExpanded,
                            onDismissRequest = { unicodeMenuExpanded = false }
                        ) {
                            DropdownMenuItem(onClick = {
                                onEscapeUnicode()
                                unicodeMenuExpanded = false
                                transformMenuExpanded = false
                            }) {
                                Text("Escape")
                            }

                            DropdownMenuItem(onClick = {
                                onUnescapeUnicode()
                                unicodeMenuExpanded = false
                                transformMenuExpanded = false
                            }) {
                                Text("Unescape")
                            }
                        }
                    }

                    // Spring Boot submenu
                    Box {
                        DropdownMenuItem(onClick = { springBootMenuExpanded = true }) {
                            Row(
                                horizontalArrangement = Arrangement.SpaceBetween,
                                modifier = Modifier.fillMaxWidth()
                            ) {
                                Text("Spring Boot")
                                Icon(
                                    imageVector = Icons.Default.KeyboardArrowRight,
                                    contentDescription = "Spring Boot submenu",
                                    modifier = Modifier.size(24.dp)
                                )
                            }
                        }

                        DropdownMenu(
                            expanded = springBootMenuExpanded,
                            onDismissRequest = { springBootMenuExpanded = false }
                        ) {
                            DropdownMenuItem(onClick = {
                                onPropertiesToYaml()
                                springBootMenuExpanded = false
                                transformMenuExpanded = false
                            }) {
                                Text("Properties to YAML")
                            }
                        }
                    }
                }
            }

            // Spacer to balance the layout
            Spacer(modifier = Modifier.weight(1f))
        }
    }
}
