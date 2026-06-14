// Import transformations from category modules
import { base64Decode, base64Encode } from './base64'
import { base32Decode, base32Encode } from './base32'
import { binaryDecode, binaryEncode } from './binary'
import { morseDecode, morseEncode } from './morse'
import { jsonCompact, jsonPrettify, sortJsonKeys } from './json'
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
import {
  bcryptHash,
  hmacHash,
  md5Hash,
  pbkdf2Hash,
  ripemd160Hash,
  sha1Hash,
  sha256Hash,
  sha3Hash,
  sha512Hash
} from './hash'
import { unicodeEscape, unicodeUnescape } from './unicode'
import {
  csvToJson,
  jsonToCsv,
  jsonToYaml,
  propertiesFileToYaml,
  yamlToJson,
  yamlToPropertiesFile,
  jsonToToml,
  tomlToJson,
  yamlToToml,
  tomlToYaml,
  jsonToXml,
  xmlToJson,
  htmlToMarkdown,
  queryStringToJson,
  jsonToQueryString,
  romanToNumber,
  numberToRoman,
  cronToHuman
} from './conversion'
import { jwtDecode } from './jwt'
import { hexEncode, hexDecode } from './hex'
import { markdownToHtml } from './markdown'
import {
  removeDuplicateWords,
  slugify,
  reverseString,
  textStatistics,
  rot13,
  caesarCipher,
  natoAlphabet,
  stripHtmlTags
} from './text'
import { tabsToSpaces, spacesToTabs, trimLines } from './whitespace'
import { sqlFormat, htmlFormat, cssFormat, jsFormat, xmlFormat, codeFormat } from './formatting'
import { uuidGenerate } from './uuid'
import { ulidGenerate } from './ulid'
import { tokenGenerate } from './token'
import { isoToTimestamp, timestampToIso } from './timestamp'
import { loremGenerate } from './lorem'
import { colorConvert } from './color'
import { baseConvert } from './numeric'
import { regexReplace, regexTest } from './regex'
import { aesEncrypt, aesDecrypt } from './aes'
import { pipelineTransform, pipelinePreview } from './pipeline'
import {
  getCustomTransformations,
  createCustomTransformationMetadata,
  addCustomTransformation,
  updateCustomTransformation,
  deleteCustomTransformation,
  generateCustomId,
  validateCustomCode
} from './custom'
// Custom Transformation Builder (placeholder - actual function is handled by the page component)
const customTransformationBuilder = async (): Promise<string> => {
  return 'Open the Custom Transformation Builder to create and test transformations.'
}

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
  baseConvert,
  regexReplace,
  regexTest,
  aesEncrypt,
  aesDecrypt,
  base32Encode,
  base32Decode,
  binaryEncode,
  binaryDecode,
  morseEncode,
  morseDecode,
  sha3Hash,
  ripemd160Hash,
  reverseString,
  textStatistics,
  rot13,
  caesarCipher,
  natoAlphabet,
  stripHtmlTags,
  tabsToSpaces,
  spacesToTabs,
  trimLines,
  sortJsonKeys,
  jsonToToml,
  tomlToJson,
  yamlToToml,
  tomlToYaml,
  jsonToXml,
  xmlToJson,
  htmlToMarkdown,
  queryStringToJson,
  jsonToQueryString,
  romanToNumber,
  numberToRoman,
  cronToHuman,
  ulidGenerate,
  tokenGenerate,
  pipelineTransform,
  pipelinePreview,
  customTransformationBuilder
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
  baseConvert,
  regexReplace,
  regexTest,
  aesEncrypt,
  aesDecrypt,
  base32Encode,
  base32Decode,
  binaryEncode,
  binaryDecode,
  morseEncode,
  morseDecode,
  sha3Hash,
  ripemd160Hash,
  reverseString,
  textStatistics,
  rot13,
  caesarCipher,
  natoAlphabet,
  stripHtmlTags,
  tabsToSpaces,
  spacesToTabs,
  trimLines,
  sortJsonKeys,
  jsonToToml,
  tomlToJson,
  yamlToToml,
  tomlToYaml,
  jsonToXml,
  xmlToJson,
  htmlToMarkdown,
  queryStringToJson,
  jsonToQueryString,
  romanToNumber,
  numberToRoman,
  cronToHuman,
  ulidGenerate,
  tokenGenerate,
  pipelineTransform,
  pipelinePreview,
  customTransformationBuilder
}

export default transformations

// Initialize custom transformations - call this at app startup
export const initializeCustomTransformations = (): void => {
  const customTransforms = getCustomTransformations()
  for (const custom of customTransforms) {
    const metadata = createCustomTransformationMetadata(custom)
    // Add to transformations object so it's available for use
    ;(transformations as Record<string, unknown>)[custom.id] = metadata.fn
  }
}

// Refresh custom transformations (call after adding/removing)
export const refreshCustomTransformations = (): void => {
  // Remove old custom transformations
  const customTransforms = getCustomTransformations()
  for (const custom of customTransforms) {
    delete (transformations as Record<string, unknown>)[custom.id]
  }
  // Re-add current ones
  initializeCustomTransformations()
}

// Re-export custom transformation functions
export {
  getCustomTransformations,
  addCustomTransformation,
  updateCustomTransformation,
  deleteCustomTransformation,
  generateCustomId,
  validateCustomCode
}
