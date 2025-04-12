import org.jetbrains.compose.desktop.application.dsl.TargetFormat

plugins {
    alias(libs.plugins.kotlinMultiplatform)
    alias(libs.plugins.composeMultiplatform)
    alias(libs.plugins.composeCompiler)
    alias(libs.plugins.kotlinSerialization)
}

kotlin {
    jvm("desktop")

    sourceSets {
        val desktopMain by getting

        commonMain.dependencies {
            implementation(compose.runtime)
            implementation(compose.foundation)
            implementation(compose.material)
            implementation(compose.ui)
            implementation(compose.components.resources)
            implementation(compose.components.uiToolingPreview)
            implementation(libs.androidx.lifecycle.viewmodel)
            implementation(libs.androidx.lifecycle.runtime.compose)
            implementation(libs.kotlinx.serialization.json)

            // FileKit dependencies
            implementation(libs.filekit.core)
            implementation(libs.filekit.compose)
        }
        desktopMain.dependencies {
            implementation(compose.desktop.currentOs)
            implementation(libs.kotlinx.coroutines.swing)
        }
    }
}

compose.resources {
    generateResClass = always
}

compose.desktop {
    application {
        mainClass = "com.github.netroforge.textonom.MainKt"

        nativeDistributions {
            targetFormats(
                TargetFormat.Dmg,
                TargetFormat.Msi,
                TargetFormat.Deb,
                TargetFormat.AppImage
            )
            packageName = "Textonom"
            packageVersion = "1.0.0"
            description = "A text editor that performs popular routine transformations of a text on your local machine"
            vendor = "Netroforge"

            val iconsRoot = project.file("src/desktopMain/composeResources")
            // Add module for Linux compatibility with FileKit
            linux {
                modules("jdk.security.auth")

                // TODO
                iconFile.set(iconsRoot.resolve("drawable/6c3424d6-5255-438d-add0-a535840aa3fa.png"))
            }
        }
    }
}
