package com.github.netroforge.textonom.model

import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.unit.sp
import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json
import java.io.File

/**
 * Enum representing the available themes.
 */
@Serializable
enum class ThemeType {
    @SerialName("light")
    LIGHT,

    @SerialName("dark")
    DARK,

    @SerialName("cyberpunk")
    CYBERPUNK,

    @SerialName("cyberpunk_turbo")
    CYBERPUNK_TURBO
}

/**
 * Represents the editor settings.
 */
@Serializable
data class Settings(
    // Theme settings
    val themeType: ThemeType = ThemeType.LIGHT,

    // Font settings
    val fontName: String = "Monospace",
    val fontSize: Int = 14,

    // Tab settings
    val tabSize: Int = 4,
    val useSpacesForTabs: Boolean = true,
    val autoIndent: Boolean = true,

    // Display settings
    val showLineNumbers: Boolean = true,
    val wordWrap: Boolean = true,
    val wrapColumn: Int = 80,

    // Auto-save settings
    val autoSave: Boolean = false,
    val autoSaveIntervalSeconds: Int = 60,

    // Theme effect settings
    val enableCrtEffect: Boolean = false,

    // Session state
    val sessionState: SessionState = SessionState()
) {
    companion object {
        private const val SETTINGS_FILENAME = "textonom_settings.json"
        private val json = Json { prettyPrint = true; ignoreUnknownKeys = true; encodeDefaults = true }

        /**
         * Gets the settings file location.
         */
        private fun getSettingsFile(): File {
            val userHome = System.getProperty("user.home")
            val appDir = File(userHome, ".textonom")
            if (!appDir.exists()) {
                appDir.mkdirs()
            }
            return File(appDir, SETTINGS_FILENAME)
        }

        /**
         * Loads settings from disk.
         */
        fun load(): Settings {
            val settingsFile = getSettingsFile()
            return if (settingsFile.exists()) {
                try {
                    json.decodeFromString<Settings>(settingsFile.readText())
                } catch (e: Exception) {
                    // If there's an error reading the settings, return default settings
                    Settings()
                }
            } else {
                // If settings file doesn't exist, return default settings
                Settings()
            }
        }
    }

    /**
     * Saves settings to disk.
     */
    fun save() {
        val settingsFile = getSettingsFile()
        settingsFile.writeText(json.encodeToString(this))
    }

    /**
     * Returns the FontFamily based on the fontName.
     */
    fun getFontFamily(): FontFamily {
        return when (fontName.lowercase()) {
            "serif" -> FontFamily.Serif
            "sans-serif" -> FontFamily.SansSerif
            "monospace" -> FontFamily.Monospace
            "cursive" -> FontFamily.Cursive
            else -> FontFamily.Default
        }
    }

    /**
     * Returns the font size in sp.
     */
    fun getFontSize() = fontSize.sp

    /**
     * Returns a copy with the theme type updated.
     * For Cyberpunk Turbo, automatically enables CRT effect.
     */
    fun withThemeType(type: ThemeType) = copy(
        themeType = type,
        enableCrtEffect = type == ThemeType.CYBERPUNK_TURBO
    )

    /**
     * Returns whether the current theme is dark (DARK, CYBERPUNK, or CYBERPUNK_TURBO).
     */
    val isDarkTheme: Boolean
        get() = themeType == ThemeType.DARK || themeType == ThemeType.CYBERPUNK || themeType == ThemeType.CYBERPUNK_TURBO

    /**
     * Returns a copy with the updated font name.
     */
    fun withFontName(name: String) = copy(fontName = name)

    /**
     * Returns a copy with the updated font size.
     */
    fun withFontSize(size: Int) = copy(fontSize = size)

    /**
     * Returns a copy with the updated tab size.
     */
    fun withTabSize(size: Int) = copy(tabSize = size)

    /**
     * Returns a copy with the updated spaces for tabs setting.
     */
    fun withSpacesForTabs(useSpaces: Boolean) = copy(useSpacesForTabs = useSpaces)

    /**
     * Returns a copy with the updated auto-indent setting.
     */
    fun withAutoIndent(autoIndent: Boolean) = copy(autoIndent = autoIndent)

    /**
     * Returns a copy with the updated line numbers visibility.
     */
    fun withShowLineNumbers(show: Boolean) = copy(showLineNumbers = show)

    /**
     * Returns a copy with the updated word wrap setting.
     */
    fun withWordWrap(wrap: Boolean) = copy(wordWrap = wrap)

    /**
     * Returns a copy with the updated wrap column.
     */
    fun withWrapColumn(column: Int) = copy(wrapColumn = column)

    /**
     * Returns a copy with the updated auto-save setting.
     */
    fun withAutoSave(autoSave: Boolean) = copy(autoSave = autoSave)

    /**
     * Returns a copy with the updated auto-save interval.
     */
    fun withAutoSaveInterval(intervalSeconds: Int) = copy(autoSaveIntervalSeconds = intervalSeconds)

    /**
     * Returns a copy with the updated CRT effect setting.
     * For Cyberpunk Turbo theme, CRT effect is always enabled and cannot be disabled.
     */
    fun withCrtEffect(enabled: Boolean) = copy(
        enableCrtEffect = if (themeType == ThemeType.CYBERPUNK_TURBO) true else enabled
    )

    /**
     * Returns a copy with the updated session state.
     */
    fun withSessionState(newSessionState: SessionState) = copy(sessionState = newSessionState)
}
