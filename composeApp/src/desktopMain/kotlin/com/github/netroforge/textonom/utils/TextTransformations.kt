package com.github.netroforge.textonom.utils

import java.net.URLDecoder
import java.net.URLEncoder
import java.nio.charset.StandardCharsets
import java.security.MessageDigest
import java.util.Base64
import kotlinx.serialization.json.*
import org.w3c.dom.Document
import javax.xml.parsers.DocumentBuilderFactory
import javax.xml.transform.OutputKeys
import javax.xml.transform.TransformerFactory
import javax.xml.transform.dom.DOMSource
import javax.xml.transform.stream.StreamResult
import java.io.StringReader
import java.io.StringWriter
import org.xml.sax.InputSource

/**
 * Utility class for text transformations.
 */
object TextTransformations {
    // Create Json instances once for better performance
    private val prettyJson = Json { prettyPrint = true }
    private val compactJson = Json { prettyPrint = false }

    // XML transformer factory
    private val transformerFactory = TransformerFactory.newInstance()
    private val documentBuilderFactory = DocumentBuilderFactory.newInstance()
    /**
     * Encodes text to Base64.
     */
    fun encodeBase64(text: String): String {
        return try {
            Base64.getEncoder().encodeToString(text.toByteArray())
        } catch (e: Exception) {
            // Return original text with error message if encoding fails
            "Error encoding to Base64: ${e.message}\n\n$text"
        }
    }

    /**
     * Decodes Base64 text.
     */
    fun decodeBase64(base64Text: String): String {
        return try {
            String(Base64.getDecoder().decode(base64Text))
        } catch (e: Exception) {
            // Return original text with error message if decoding fails
            "Error decoding from Base64: ${e.message}\n\n$base64Text"
        }
    }

    /**
     * Prettifies JSON text.
     */
    fun prettifyJson(jsonText: String): String {
        return try {
            val jsonElement = Json.parseToJsonElement(jsonText)
            prettyJson.encodeToString(JsonElement.serializer(), jsonElement)
        } catch (e: Exception) {
            // Return original text with error message if prettifying fails
            "Error prettifying JSON: ${e.message}\n\n$jsonText"
        }
    }

    /**
     * Compacts JSON text.
     */
    fun compactJson(jsonText: String): String {
        return try {
            val jsonElement = Json.parseToJsonElement(jsonText)
            compactJson.encodeToString(JsonElement.serializer(), jsonElement)
        } catch (e: Exception) {
            // Return original text with error message if compacting fails
            "Error compacting JSON: ${e.message}\n\n$jsonText"
        }
    }

    /**
     * URL encodes text.
     */
    fun urlEncode(text: String): String {
        return try {
            URLEncoder.encode(text, StandardCharsets.UTF_8.toString())
        } catch (e: Exception) {
            "Error URL encoding: ${e.message}\n\n$text"
        }
    }

    /**
     * URL decodes text.
     */
    fun urlDecode(text: String): String {
        return try {
            URLDecoder.decode(text, StandardCharsets.UTF_8.toString())
        } catch (e: Exception) {
            "Error URL decoding: ${e.message}\n\n$text"
        }
    }

    /**
     * Converts text to uppercase.
     */
    fun toUpperCase(text: String): String {
        return text.uppercase()
    }

    /**
     * Converts text to lowercase.
     */
    fun toLowerCase(text: String): String {
        return text.lowercase()
    }

    /**
     * Converts text to title case.
     */
    fun toTitleCase(text: String): String {
        return text.split(" ").joinToString(" ") { word ->
            if (word.isNotEmpty()) {
                word[0].uppercase() + word.substring(1).lowercase()
            } else {
                ""
            }
        }
    }

    /**
     * Prettifies XML text.
     */
    fun prettifyXml(xmlText: String): String {
        return try {
            val document = parseXmlToDocument(xmlText)
            formatXml(document, true)
        } catch (e: Exception) {
            "Error prettifying XML: ${e.message}\n\n$xmlText"
        }
    }

    /**
     * Compacts XML text.
     */
    fun compactXml(xmlText: String): String {
        return try {
            val document = parseXmlToDocument(xmlText)
            formatXml(document, false)
        } catch (e: Exception) {
            "Error compacting XML: ${e.message}\n\n$xmlText"
        }
    }

    /**
     * Parses XML string to Document.
     */
    private fun parseXmlToDocument(xmlText: String): Document {
        val builder = documentBuilderFactory.newDocumentBuilder()
        val inputSource = InputSource(StringReader(xmlText))
        return builder.parse(inputSource)
    }

    /**
     * Formats XML document to string.
     */
    private fun formatXml(document: Document, prettyPrint: Boolean): String {
        val transformer = transformerFactory.newTransformer()
        if (prettyPrint) {
            transformer.setOutputProperty(OutputKeys.INDENT, "yes")
            transformer.setOutputProperty("{http://xml.apache.org/xslt}indent-amount", "2")
        }
        transformer.setOutputProperty(OutputKeys.OMIT_XML_DECLARATION, "no")
        transformer.setOutputProperty(OutputKeys.METHOD, "xml")

        val writer = StringWriter()
        transformer.transform(DOMSource(document), StreamResult(writer))
        return writer.toString()
    }

    /**
     * Sorts lines alphabetically.
     */
    fun sortLines(text: String): String {
        return text.split("\n").sorted().joinToString("\n")
    }

    /**
     * Removes duplicate lines.
     */
    fun deduplicateLines(text: String): String {
        return text.split("\n").distinct().joinToString("\n")
    }

    /**
     * Reverses line order.
     */
    fun reverseLines(text: String): String {
        return text.split("\n").reversed().joinToString("\n")
    }

    /**
     * Encodes HTML entities.
     */
    fun encodeHtml(text: String): String {
        return text
            .replace("&", "&amp;")
            .replace("<", "&lt;")
            .replace(">", "&gt;")
            .replace("\"", "&quot;")
            .replace("'", "&#39;")
    }

    /**
     * Decodes HTML entities.
     */
    fun decodeHtml(text: String): String {
        return text
            .replace("&amp;", "&")
            .replace("&lt;", "<")
            .replace("&gt;", ">")
            .replace("&quot;", "\"")
            .replace("&#39;", "'")
    }

    /**
     * Generates MD5 hash.
     */
    fun md5Hash(text: String): String {
        return generateHash(text, "MD5")
    }

    /**
     * Generates SHA-1 hash.
     */
    fun sha1Hash(text: String): String {
        return generateHash(text, "SHA-1")
    }

    /**
     * Generates SHA-256 hash.
     */
    fun sha256Hash(text: String): String {
        return generateHash(text, "SHA-256")
    }

    /**
     * Generates hash using specified algorithm.
     */
    private fun generateHash(text: String, algorithm: String): String {
        return try {
            val digest = MessageDigest.getInstance(algorithm)
            val hash = digest.digest(text.toByteArray(StandardCharsets.UTF_8))
            hash.joinToString("") { "%02x".format(it) }
        } catch (e: Exception) {
            "Error generating $algorithm hash: ${e.message}\n\n$text"
        }
    }

    /**
     * Escapes Unicode characters.
     */
    fun escapeUnicode(text: String): String {
        val sb = StringBuilder()
        for (c in text) {
            if (c.code > 127) {
                sb.append("\\u${c.code.toString(16).padStart(4, '0')}")
            } else {
                sb.append(c)
            }
        }
        return sb.toString()
    }

    /**
     * Unescapes Unicode characters.
     */
    fun unescapeUnicode(text: String): String {
        val regex = Regex("\\\\u([0-9a-fA-F]{4})")
        return regex.replace(text) { matchResult ->
            val hexValue = matchResult.groupValues[1]
            val unicodeValue = hexValue.toInt(16).toChar().toString()
            unicodeValue
        }
    }

    /**
     * Converts JSON to YAML.
     * Note: This is a simplified implementation. For a real app, you'd want to use a library like SnakeYAML.
     */
    fun jsonToYaml(jsonText: String): String {
        return try {
            val jsonElement = Json.parseToJsonElement(jsonText)
            jsonElementToYaml(jsonElement, 0)
        } catch (e: Exception) {
            "Error converting JSON to YAML: ${e.message}\n\n$jsonText"
        }
    }

    /**
     * Converts a JsonElement to YAML format.
     */
    private fun jsonElementToYaml(element: JsonElement, indent: Int): String {
        val indentStr = " ".repeat(indent)
        return when (element) {
            is JsonObject -> {
                if (element.isEmpty()) return "{}"
                element.entries.joinToString("\n") { (key, value) ->
                    when (value) {
                        is JsonArray, is JsonObject -> {
                            "$indentStr$key:\n${jsonElementToYaml(value, indent + 2)}"
                        }
                        else -> "$indentStr$key: ${jsonElementToYaml(value, 0)}"
                    }
                }
            }
            is JsonArray -> {
                if (element.isEmpty()) return "[]"
                element.joinToString("\n") { value ->
                    when (value) {
                        is JsonArray, is JsonObject -> {
                            "$indentStr- \n${jsonElementToYaml(value, indent + 2)}"
                        }
                        else -> "$indentStr- ${jsonElementToYaml(value, 0)}"
                    }
                }
            }
            is JsonPrimitive -> {
                if (element.isString) "\"${element.content}\"" else element.content
            }
            else -> element.toString()
        }
    }

    /**
     * Converts Spring Boot properties to YAML.
     * Note: This is a simplified implementation. For a real app, you'd want to use a dedicated library.
     */
    fun propertiesToYaml(propertiesText: String): String {
        return try {
            val properties = mutableMapOf<String, String>()
            propertiesText.split("\n").forEach { line ->
                val trimmedLine = line.trim()
                if (trimmedLine.isNotEmpty() && !trimmedLine.startsWith("#")) {
                    val parts = trimmedLine.split("=", limit = 2)
                    if (parts.size == 2) {
                        properties[parts[0].trim()] = parts[1].trim()
                    }
                }
            }

            // Convert flat properties to hierarchical YAML
            val yamlMap = mutableMapOf<String, Any>()
            properties.forEach { (key, value) ->
                val parts = key.split(".")
                var current = yamlMap
                for (i in 0 until parts.size - 1) {
                    val part = parts[i]
                    if (!current.containsKey(part)) {
                        current[part] = mutableMapOf<String, Any>()
                    }
                    @Suppress("UNCHECKED_CAST")
                    current = current[part] as MutableMap<String, Any>
                }
                current[parts.last()] = value
            }

            // Convert map to YAML string
            mapToYaml(yamlMap, 0)
        } catch (e: Exception) {
            "Error converting properties to YAML: ${e.message}\n\n$propertiesText"
        }
    }

    /**
     * Converts a Map to YAML format.
     */
    private fun mapToYaml(map: Map<String, Any>, indent: Int): String {
        val indentStr = " ".repeat(indent)
        return map.entries.joinToString("\n") { (key, value) ->
            when (value) {
                is Map<*, *> -> {
                    @Suppress("UNCHECKED_CAST")
                    "$indentStr$key:\n${mapToYaml(value as Map<String, Any>, indent + 2)}"
                }
                else -> "$indentStr$key: $value"
            }
        }
    }
}
