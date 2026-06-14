import type { Component } from 'vue'
import { getTransformationById } from '../../transformations/registry'
import GenericTransformationPage from './GenericTransformationPage.vue'
import Base64EncodePage from './Base64EncodePage.vue'
import Base64DecodePage from './Base64DecodePage.vue'
import JsonPrettifyPage from './JsonPrettifyPage.vue'
import JsonCompactPage from './JsonCompactPage.vue'
import UrlEncodePage from './UrlEncodePage.vue'
import UrlDecodePage from './UrlDecodePage.vue'
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
import BcryptHashPage from './BcryptHashPage.vue'
import Md5HashPage from './Md5HashPage.vue'
import Sha1HashPage from './Sha1HashPage.vue'
import Sha256HashPage from './Sha256HashPage.vue'
import Sha512HashPage from './Sha512HashPage.vue'
import HmacHashPage from './HmacHashPage.vue'
import Pbkdf2HashPage from './Pbkdf2HashPage.vue'
import UnicodeEscapePage from './UnicodeEscapePage.vue'
import UnicodeUnescapePage from './UnicodeUnescapePage.vue'
import JsonToYamlPage from './JsonToYamlPage.vue'
import YamlToJsonPage from './YamlToJsonPage.vue'
import PropertiesFileToYamlPage from './PropertiesFileToYamlPage.vue'
import YamlToPropertiesFilePage from './YamlToPropertiesFilePage.vue'
import JwtDecodePage from './JwtDecodePage.vue'
import HexEncodePage from './HexEncodePage.vue'
import HexDecodePage from './HexDecodePage.vue'
import MarkdownToHtmlPage from './MarkdownToHtmlPage.vue'
import CsvToJsonPage from './CsvToJsonPage.vue'
import JsonToCsvPage from './JsonToCsvPage.vue'
import RemoveEmptyLinesPage from './RemoveEmptyLinesPage.vue'
import RemoveDuplicateWordsPage from './RemoveDuplicateWordsPage.vue'
import ToSnakeCasePage from './ToSnakeCasePage.vue'
import ToCamelCasePage from './ToCamelCasePage.vue'
import ToKebabCasePage from './ToKebabCasePage.vue'
import SqlFormatPage from './SqlFormatPage.vue'
import HtmlFormatPage from './HtmlFormatPage.vue'
import CssFormatPage from './CssFormatPage.vue'
import JsFormatPage from './JsFormatPage.vue'
import XmlFormatPage from './XmlFormatPage.vue'
import SlugifyPage from './SlugifyPage.vue'
import UuidGeneratePage from './UuidGeneratePage.vue'
import LoremGeneratePage from './LoremGeneratePage.vue'
import TimestampToIsoPage from './TimestampToIsoPage.vue'
import IsoToTimestampPage from './IsoToTimestampPage.vue'
import ColorConvertPage from './ColorConvertPage.vue'
import BaseConvertPage from './BaseConvertPage.vue'
import AesPage from './AesPage.vue'
import RegexReplacePage from './RegexReplacePage.vue'
import DiffPage from './DiffPage.vue'
import PipelinePage from './PipelinePage.vue'
import CustomTransformationBuilderPage from './CustomTransformationBuilderPage.vue'

const transformationPageMap: Record<string, Component> = {
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
  pbkdf2Hash: Pbkdf2HashPage,
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
  xmlFormat: XmlFormatPage,
  slugify: SlugifyPage,
  uuidGenerate: UuidGeneratePage,
  loremGenerate: LoremGeneratePage,
  timestampToIso: TimestampToIsoPage,
  isoToTimestamp: IsoToTimestampPage,
  colorConvert: ColorConvertPage,
  baseConvert: BaseConvertPage,
  textDiff: DiffPage,
  aesEncrypt: AesPage,
  aesDecrypt: AesPage,
  regexReplace: RegexReplacePage,
  pipelineTransform: PipelinePage,
  customTransformationBuilder: CustomTransformationBuilderPage
}

export const getTransformationPageComponent = (id: string): Component => {
  const component = transformationPageMap[id]
  if (component) {
    return component
  }
  // Any transformation without a bespoke page (e.g. the newer ones) is rendered
  // by the registry-driven GenericTransformationPage, which builds its UI from
  // the transformation's metadata. This keeps the page map from silently
  // falling back to the wrong page when a transformation is added.
  if (getTransformationById(id)) {
    return GenericTransformationPage
  }
  console.error(`Transformation page component not found for ID: ${id}`)
  return GenericTransformationPage
}

export default transformationPageMap
