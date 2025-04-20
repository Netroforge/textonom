// Import transformations from category modules
import { base64Encode, base64Decode } from './base64'
import { jsonPrettify, jsonCompact } from './json'
import { urlEncode, urlDecode } from './url'
import { toUpperCase, toLowerCase, toTitleCase } from './case'
import { xmlPrettify, xmlCompact } from './xml'
import { sortLines, deduplicateLines, reverseLines } from './lines'
import { htmlEncode, htmlDecode } from './html'
import { md5Hash, sha1Hash, sha256Hash, bcryptHash } from './hash'
import { unicodeEscape, unicodeUnescape } from './unicode'
import { jsonToYaml, yamlToJson, propertiesFileToYaml, yamlToPropertiesFile } from './conversion'

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

  // XML
  xmlPrettify,
  xmlCompact,

  // Lines
  sortLines,
  deduplicateLines,
  reverseLines,

  // HTML
  htmlEncode,
  htmlDecode,

  // Hash
  md5Hash,
  sha1Hash,
  sha256Hash,
  bcryptHash,

  // Unicode
  unicodeEscape,
  unicodeUnescape,

  // Conversion
  jsonToYaml,
  yamlToJson,
  propertiesFileToYaml,
  yamlToPropertiesFile
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
  xmlPrettify,
  xmlCompact,
  sortLines,
  deduplicateLines,
  reverseLines,
  htmlEncode,
  htmlDecode,
  md5Hash,
  sha1Hash,
  sha256Hash,
  bcryptHash,
  unicodeEscape,
  unicodeUnescape,
  jsonToYaml,
  yamlToJson,
  propertiesFileToYaml,
  yamlToPropertiesFile
}

// Also export as default for easier importing
export default transformations
