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
import Sha512HashPage from './Sha512HashPage'
import HmacHashPage from './HmacHashPage'
import Argon2HashPage from './Argon2HashPage'
import UnicodeEscapePage from './UnicodeEscapePage'
import UnicodeUnescapePage from './UnicodeUnescapePage'
import JsonToYamlPage from './JsonToYamlPage'
import YamlToJsonPage from './YamlToJsonPage'
import PropertiesFileToYamlPage from './PropertiesFileToYamlPage'
import YamlToPropertiesFilePage from './YamlToPropertiesFilePage'
import JwtDecodePage from './JwtDecodePage'
import HexEncodePage from './HexEncodePage'
import HexDecodePage from './HexDecodePage'
import MarkdownToHtmlPage from './MarkdownToHtmlPage'
import CsvToJsonPage from './CsvToJsonPage'
import JsonToCsvPage from './JsonToCsvPage'
import RemoveEmptyLinesPage from './RemoveEmptyLinesPage'
import RemoveDuplicateWordsPage from './RemoveDuplicateWordsPage'
import ToSnakeCasePage from './ToSnakeCasePage'
import ToCamelCasePage from './ToCamelCasePage'
import ToKebabCasePage from './ToKebabCasePage'
import SqlFormatPage from './SqlFormatPage'
import CodeFormatPage from './CodeFormatPage'

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
  Sha512HashPage,
  HmacHashPage,
  Argon2HashPage,
  UnicodeEscapePage,
  UnicodeUnescapePage,
  JsonToYamlPage,
  YamlToJsonPage,
  PropertiesFileToYamlPage,
  YamlToPropertiesFilePage,
  JwtDecodePage,
  HexEncodePage,
  HexDecodePage,
  MarkdownToHtmlPage,
  CsvToJsonPage,
  JsonToCsvPage,
  RemoveEmptyLinesPage,
  RemoveDuplicateWordsPage,
  ToSnakeCasePage,
  ToCamelCasePage,
  ToKebabCasePage,
  SqlFormatPage,
  CodeFormatPage
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
  codeFormat: CodeFormatPage
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
