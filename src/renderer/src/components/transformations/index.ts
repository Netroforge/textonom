// Import all transformation pages
import { ComponentType } from 'react'
import Base64EncodePage from './Base64EncodePage'
import Base64DecodePage from './Base64DecodePage'
import BcryptHashPage from './BcryptHashPage'
import JSONFormatPage from './JSONFormatPage'
import HmacHashPage from './HmacHashPage'
import Md5HashPage from './Md5HashPage'
import Sha1HashPage from './Sha1HashPage'
import Sha256HashPage from './Sha256HashPage'
import Sha512HashPage from './Sha512HashPage'
import UrlEncodePage from './UrlEncodePage'
import UrlDecodePage from './UrlDecodePage'
import HtmlEncodePage from './HtmlEncodePage'
import HtmlDecodePage from './HtmlDecodePage'
import JsonCompactPage from './JsonCompactPage'
import XmlFormatPage from './XmlFormatPage'
import XmlCompactPage from './XmlCompactPage'
import XmlPrettifyPage from './XmlPrettifyPage'
import JsonToYamlPage from './JsonToYamlPage'
import YamlToJsonPage from './YamlToJsonPage'
import ToUpperCasePage from './ToUpperCasePage'
import ToLowerCasePage from './ToLowerCasePage'
import ToTitleCasePage from './ToTitleCasePage'
import ToSnakeCasePage from './ToSnakeCasePage'
import ToCamelCasePage from './ToCamelCasePage'
import ToKebabCasePage from './ToKebabCasePage'
import UnicodeEscapePage from './UnicodeEscapePage'
import UnicodeUnescapePage from './UnicodeUnescapePage'
import SqlFormatPage from './SqlFormatPage'
import HtmlFormatPage from './HtmlFormatPage'
import CssFormatPage from './CssFormatPage'
import JsFormatPage from './JsFormatPage'
import SortLinesPage from './SortLinesPage'
import DeduplicateLinesPage from './DeduplicateLinesPage'
import ReverseLinesPage from './ReverseLinesPage'
import RemoveEmptyLinesPage from './RemoveEmptyLinesPage'
import RemoveDuplicateWordsPage from './RemoveDuplicateWordsPage'
import JsonPrettifyPage from './JsonPrettifyPage'
import HexEncodePage from './HexEncodePage'
import HexDecodePage from './HexDecodePage'
import JwtDecodePage from './JwtDecodePage'
import MarkdownToHtmlPage from './MarkdownToHtmlPage'
import JsonToCsvPage from './JsonToCsvPage'
import CsvToJsonPage from './CsvToJsonPage'
import PropertiesFileToYamlPage from './PropertiesFileToYamlPage'
import YamlToPropertiesFilePage from './YamlToPropertiesFilePage'
import Argon2HashPage from './Argon2HashPage'

// Export all transformation pages
export {
  Base64EncodePage,
  Base64DecodePage,
  BcryptHashPage,
  JSONFormatPage,
  HmacHashPage,
  Md5HashPage,
  Sha1HashPage,
  Sha256HashPage,
  Sha512HashPage,
  UrlEncodePage,
  UrlDecodePage,
  HtmlEncodePage,
  HtmlDecodePage,
  JsonCompactPage,
  XmlFormatPage,
  XmlCompactPage,
  XmlPrettifyPage,
  JsonToYamlPage,
  YamlToJsonPage,
  ToUpperCasePage,
  ToLowerCasePage,
  ToTitleCasePage,
  ToSnakeCasePage,
  ToCamelCasePage,
  ToKebabCasePage,
  UnicodeEscapePage,
  UnicodeUnescapePage,
  SqlFormatPage,
  HtmlFormatPage,
  CssFormatPage,
  JsFormatPage,
  SortLinesPage,
  DeduplicateLinesPage,
  ReverseLinesPage,
  RemoveEmptyLinesPage,
  RemoveDuplicateWordsPage,
  JsonPrettifyPage,
  HexEncodePage,
  HexDecodePage,
  JwtDecodePage,
  MarkdownToHtmlPage,
  JsonToCsvPage,
  CsvToJsonPage,
  PropertiesFileToYamlPage,
  YamlToPropertiesFilePage,
  Argon2HashPage
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
  sha512Hash: Sha512HashPage,
  hmacHash: HmacHashPage,
  argon2Hash: Argon2HashPage,
  unicodeEscape: UnicodeEscapePage,
  unicodeUnescape: UnicodeUnescapePage,
  jsonToYaml: JsonToYamlPage,
  yamlToJson: YamlToJsonPage,
  propertiesFileToYaml: PropertiesFileToYamlPage,
  yamlToPropertiesFile: YamlToPropertiesFilePage,
  jwtDecode: JwtDecodePage,
  hexEncode: HexEncodePage,
  hexDecode: HexDecodePage,
  markdownToHtml: MarkdownToHtmlPage,
  csvToJson: CsvToJsonPage,
  jsonToCsv: JsonToCsvPage,
  removeEmptyLines: RemoveEmptyLinesPage,
  removeDuplicateWords: RemoveDuplicateWordsPage,
  toSnakeCase: ToSnakeCasePage,
  toCamelCase: ToCamelCasePage,
  toKebabCase: ToKebabCasePage,
  sqlFormat: SqlFormatPage,
  htmlFormat: HtmlFormatPage,
  cssFormat: CssFormatPage,
  jsFormat: JsFormatPage,
  xmlFormat: XmlFormatPage
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
