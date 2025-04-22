// Import all transformation pages
import { ComponentType } from 'react'
import Base64EncodePage from './Base64EncodePage'
import Base64DecodePage from './Base64DecodePage'
import JsonPrettifyPage from './JsonPrettifyPage'
import JsonCompactPage from './JsonCompactPage'
import UrlEncodePage from './UrlEncodePage'
import UrlDecodePage from './UrlDecodePage'
import ToUpperCasePage from './ToUpperCasePage'
import ToLowerCasePage from './ToLowerCasePage'
import ToTitleCasePage from './ToTitleCasePage'
import XmlPrettifyPage from './XmlPrettifyPage'
import XmlCompactPage from './XmlCompactPage'
import SortLinesPage from './SortLinesPage'
import DeduplicateLinesPage from './DeduplicateLinesPage'
import ReverseLinesPage from './ReverseLinesPage'
import HtmlEncodePage from './HtmlEncodePage'
import HtmlDecodePage from './HtmlDecodePage'
import BcryptHashPage from './BcryptHashPage'
import Md5HashPage from './Md5HashPage'
import Sha1HashPage from './Sha1HashPage'
import Sha256HashPage from './Sha256HashPage'
import UnicodeEscapePage from './UnicodeEscapePage'
import UnicodeUnescapePage from './UnicodeUnescapePage'
import JsonToYamlPage from './JsonToYamlPage'
import YamlToJsonPage from './YamlToJsonPage'
import PropertiesFileToYamlPage from './PropertiesFileToYamlPage'
import YamlToPropertiesFilePage from './YamlToPropertiesFilePage'

// Export all transformation pages
export {
  Base64EncodePage,
  Base64DecodePage,
  JsonPrettifyPage,
  JsonCompactPage,
  UrlEncodePage,
  UrlDecodePage,
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
  BcryptHashPage,
  Md5HashPage,
  Sha1HashPage,
  Sha256HashPage,
  UnicodeEscapePage,
  UnicodeUnescapePage,
  JsonToYamlPage,
  YamlToJsonPage,
  PropertiesFileToYamlPage,
  YamlToPropertiesFilePage
}

// Define type for transformation page components
export type TransformationPageComponent = ComponentType<{ tabId: string }>

// Map transformation IDs to their respective components
const transformationPageMap: Record<string, TransformationPageComponent> = {
  base64Encode: Base64EncodePage,
  base64Decode: Base64DecodePage,
  jsonPrettify: JsonPrettifyPage,
  jsonCompact: JsonCompactPage,
  urlEncode: UrlEncodePage,
  urlDecode: UrlDecodePage,
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
  bcryptHash: BcryptHashPage,
  md5Hash: Md5HashPage,
  sha1Hash: Sha1HashPage,
  sha256Hash: Sha256HashPage,
  unicodeEscape: UnicodeEscapePage,
  unicodeUnescape: UnicodeUnescapePage,
  jsonToYaml: JsonToYamlPage,
  yamlToJson: YamlToJsonPage,
  propertiesFileToYaml: PropertiesFileToYamlPage,
  yamlToPropertiesFile: YamlToPropertiesFilePage
}

// Function to get a transformation page component by ID
export const getTransformationPageComponent = (id: string): TransformationPageComponent => {
  const component = transformationPageMap[id]
  if (!component) {
    console.error(`Transformation page component not found for ID: ${id}`)
    // Return a default component or the first one as a fallback
    return Base64EncodePage
  }
  return component
}

export default transformationPageMap
