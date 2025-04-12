package com.github.netroforge.textonom

import androidx.compose.ui.window.Window
import androidx.compose.ui.window.application
import androidx.compose.ui.window.rememberWindowState
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.DpSize
import androidx.compose.ui.unit.dp
import io.github.vinceglb.filekit.core.FileKit

fun main() = application {
    // FileKit 0.8.8 doesn't require initialization on desktop
    val windowState = rememberWindowState(size = DpSize(1024.dp, 768.dp))

    Window(
        onCloseRequest = ::exitApplication,
        title = "Textonom",
        state = windowState
    ) {
        App()
    }
}
