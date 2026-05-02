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
import { bcryptHash, hmacHash, md5Hash, pbkdf2Hash, sha1Hash, sha256Hash, sha512Hash } from './hash'
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
import { removeDuplicateWords, slugify } from './text'
import { sqlFormat, htmlFormat, cssFormat, jsFormat, xmlFormat, codeFormat } from './formatting'
import { uuidGenerate } from './uuid'
import { isoToTimestamp, timestampToIso } from './timestamp'
import { loremGenerate } from './lorem'
import { colorConvert } from './color'
import { baseConvert } from './numeric'

// Export individual transformations
export {
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
  pbkdf2Hash,
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
  slugify,
  sqlFormat,
  htmlFormat,
  cssFormat,
  jsFormat,
  xmlFormat,
  codeFormat,
  uuidGenerate,
  timestampToIso,
  isoToTimestamp,
  loremGenerate,
  colorConvert,
  baseConvert
}

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
  pbkdf2Hash,
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
  slugify,
  sqlFormat,
  htmlFormat,
  cssFormat,
  jsFormat,
  xmlFormat,
  codeFormat,
  uuidGenerate,
  timestampToIso,
  isoToTimestamp,
  loremGenerate,
  colorConvert,
  baseConvert
}

export default transformations
