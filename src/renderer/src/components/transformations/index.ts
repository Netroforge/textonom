// Import all transformation pages
import { Component } from 'vue'
import Base64EncodePage from './Base64EncodePage.vue'
import Base64DecodePage from './Base64DecodePage.vue'
import JsonPrettifyPage from './JsonPrettifyPage.vue'
import JsonCompactPage from './JsonCompactPage.vue'
import UrlEncodePage from './UrlEncodePage.vue'
import UrlDecodePage from './UrlDecodePage.vue'
import BcryptHashPage from './BcryptHashPage.vue'
import JsonToYamlPage from './JsonToYamlPage.vue'
import YamlToJsonPage from './YamlToJsonPage.vue'
import ToUpperCasePage from './ToUpperCasePage.vue'
import ToLowerCasePage from './ToLowerCasePage.vue'
import ToTitleCasePage from './ToTitleCasePage.vue'
import XmlPrettifyPage from './XmlPrettifyPage.vue'
import XmlCompactPage from './XmlCompactPage.vue'
import SortLinesPage from './SortLinesPage.vue'
import DeduplicateLinesPage from './DeduplicateLinesPage.vue'
import ReverseLinesPage from './ReverseLinesPage.vue'
import HtmlEncodePage from './HtmlEncodePage.vue'
import HtmlDecodePage from './HtmlDecodePage.vue'
import Md5HashPage from './Md5HashPage.vue'
import Sha1HashPage from './Sha1HashPage.vue'
import Sha256HashPage from './Sha256HashPage.vue'
import UnicodeEscapePage from './UnicodeEscapePage.vue'
import UnicodeUnescapePage from './UnicodeUnescapePage.vue'
import PropertiesFileToYamlPage from './PropertiesFileToYamlPage.vue'
import YamlToPropertiesFilePage from './YamlToPropertiesFilePage.vue'

// Export all transformation pages
export {
  Base64EncodePage,
  Base64DecodePage,
  JsonPrettifyPage,
  JsonCompactPage,
  UrlEncodePage,
  UrlDecodePage,
  BcryptHashPage,
  JsonToYamlPage,
  YamlToJsonPage,
  ToUpperCasePage,
  ToLowerCasePage,
  ToTitleCasePage,
  XmlPrettifyPage,
  XmlCompactPage,
  SortLinesPage,
  DeduplicateLinesPage,
  ReverseLinesPage,
  HtmlEncodePage,
  HtmlDecodePage,
  Md5HashPage,
  Sha1HashPage,
  Sha256HashPage,
  UnicodeEscapePage,
  UnicodeUnescapePage,
  PropertiesFileToYamlPage,
  YamlToPropertiesFilePage
}

// Define type for transformation page components
export type TransformationPageComponent = Component

// Map transformation IDs to their respective components
export const transformationPageMap: Record<string, TransformationPageComponent> = {
  base64Encode: Base64EncodePage,
  base64Decode: Base64DecodePage,
  jsonPrettify: JsonPrettifyPage,
  jsonCompact: JsonCompactPage,
  urlEncode: UrlEncodePage,
  urlDecode: UrlDecodePage,
  bcryptHash: BcryptHashPage,
  jsonToYaml: JsonToYamlPage,
  yamlToJson: YamlToJsonPage,
  toUpperCase: ToUpperCasePage,
  toLowerCase: ToLowerCasePage,
  toTitleCase: ToTitleCasePage,
  xmlPrettify: XmlPrettifyPage,
  xmlCompact: XmlCompactPage,
  sortLines: SortLinesPage,
  deduplicateLines: DeduplicateLinesPage,
  reverseLines: ReverseLinesPage,
  htmlEncode: HtmlEncodePage,
  htmlDecode: HtmlDecodePage,
  md5Hash: Md5HashPage,
  sha1Hash: Sha1HashPage,
  sha256Hash: Sha256HashPage,
  unicodeEscape: UnicodeEscapePage,
  unicodeUnescape: UnicodeUnescapePage,
  propertiesFileToYaml: PropertiesFileToYamlPage,
  yamlToPropertiesFile: YamlToPropertiesFilePage
}

// Get transformation page component by ID
export const getTransformationPageByTransformationId = (
  id: string
): TransformationPageComponent | undefined => {
  return transformationPageMap[id as keyof typeof transformationPageMap]
}
