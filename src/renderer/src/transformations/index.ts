// Import transformations from category modules
import { base64Decode, base64Encode } from './base64'
import { jsonCompact, jsonPrettify } from './json'
import { urlDecode, urlEncode } from './url'
import {
  toCamelCase,
  toKebabCase,
  toLowerCase,
  toSnakeCase,
  toTitleCase,
  toUpperCase
} from './case'
import { xmlCompact, xmlPrettify } from './xml'
import { deduplicateLines, removeEmptyLines, reverseLines, sortLines } from './lines'
import { htmlDecode, htmlEncode } from './html'
import { argon2Hash, bcryptHash, hmacHash, md5Hash, sha1Hash, sha256Hash, sha512Hash } from './hash'
import { unicodeEscape, unicodeUnescape } from './unicode'
import {
  csvToJson,
  jsonToCsv,
  jsonToYaml,
  propertiesFileToYaml,
  yamlToJson,
  yamlToPropertiesFile
} from './conversion'
import { jwtDecode } from './jwt'
import { hexEncode, hexDecode } from './hex'
import { markdownToHtml } from './markdown'
import { removeDuplicateWords } from './text'
import { sqlFormat, htmlFormat, cssFormat, jsFormat, xmlFormat, codeFormat } from './formatting'

// Export individual transformations
export {
  // Base64
  base64Encode,
  base64Decode,

  // JSON
  jsonPrettify,
  jsonCompact,

  // URL
  urlEncode,
  urlDecode,

  // Case
  toUpperCase,
  toLowerCase,
  toTitleCase,
  toSnakeCase,
  toCamelCase,
  toKebabCase,

  // XML
  xmlPrettify,
  xmlCompact,

  // Lines
  sortLines,
  deduplicateLines,
  reverseLines,
  removeEmptyLines,

  // HTML
  htmlEncode,
  htmlDecode,

  // Hash
  md5Hash,
  sha1Hash,
  sha256Hash,
  sha512Hash,
  hmacHash,
  bcryptHash,
  argon2Hash,

  // Unicode
  unicodeEscape,
  unicodeUnescape,

  // Conversion
  jsonToYaml,
  yamlToJson,
  propertiesFileToYaml,
  yamlToPropertiesFile,
  csvToJson,
  jsonToCsv,

  // JWT
  jwtDecode,

  // Hex
  hexEncode,
  hexDecode,

  // Markdown
  markdownToHtml,

  // Text
  removeDuplicateWords,

  // Formatting
  sqlFormat,
  htmlFormat,
  cssFormat,
  jsFormat,
  xmlFormat,
  codeFormat
}

// Export all transformations as a group
export const transformations = {
  base64Encode,
  base64Decode,
  jsonPrettify,
  jsonCompact,
  urlEncode,
  urlDecode,
  toUpperCase,
  toLowerCase,
  toTitleCase,
  toSnakeCase,
  toCamelCase,
  toKebabCase,
  xmlPrettify,
  xmlCompact,
  sortLines,
  deduplicateLines,
  reverseLines,
  removeEmptyLines,
  htmlEncode,
  htmlDecode,
  md5Hash,
  sha1Hash,
  sha256Hash,
  sha512Hash,
  hmacHash,
  bcryptHash,
  argon2Hash,
  unicodeEscape,
  unicodeUnescape,
  jsonToYaml,
  yamlToJson,
  propertiesFileToYaml,
  yamlToPropertiesFile,
  csvToJson,
  jsonToCsv,
  jwtDecode,
  hexEncode,
  hexDecode,
  markdownToHtml,
  removeDuplicateWords,
  sqlFormat,
  htmlFormat,
  cssFormat,
  jsFormat,
  xmlFormat,
  codeFormat
}

// Also export as default for easier importing
export default transformations
