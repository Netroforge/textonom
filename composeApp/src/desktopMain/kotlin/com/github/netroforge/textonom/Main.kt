package com.github.netroforge.textonom

import androidx.compose.ui.unit.DpSize
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.Window
import androidx.compose.ui.window.application
import androidx.compose.ui.window.rememberWindowState

fun main() = application {
    val windowState = rememberWindowState(size = DpSize(1024.dp, 768.dp))

    Window(
        onCloseRequest = ::exitApplication,
        title = "Textonom",
        state = windowState
    ) {
        App()
    }
}
