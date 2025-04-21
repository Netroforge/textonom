// Import transformations from category modules
import { base64Decode, base64Encode } from './base64'
import { jsonCompact, jsonPrettify } from './json'
import { urlDecode, urlEncode } from './url'
import { toLowerCase, toTitleCase, toUpperCase } from './case'
import { xmlCompact, xmlPrettify } from './xml'
import { deduplicateLines, reverseLines, sortLines } from './lines'
import { htmlDecode, htmlEncode } from './html'
import { bcryptHash, md5Hash, sha1Hash, sha256Hash } from './hash'
import { unicodeEscape, unicodeUnescape } from './unicode'
import { jsonToYaml, propertiesFileToYaml, yamlToJson, yamlToPropertiesFile } from './conversion'

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
