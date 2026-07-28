export interface SmartSuggestion {
  transformationId: string
  reason: string
  confidence: number
}

export interface SmartDetectionResult {
  kind: string
  summary: string
  suggestions: SmartSuggestion[]
}

const isProbablyJwt = (value: string): boolean => {
  const parts = value.split('.')
  if (parts.length !== 3 || !parts[0] || !parts[1]) return false
  if (!parts.every((part) => /^[A-Za-z0-9_-]*$/.test(part))) return false

  try {
    for (const part of parts.slice(0, 2)) {
      const normalized = part.replace(/-/g, '+').replace(/_/g, '/')
      const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=')
      JSON.parse(atob(padded))
    }
    return true
  } catch {
    return false
  }
}

const isProbablyBase64 = (value: string): boolean => {
  const compact = value.replace(/\s/g, '')
  if (compact.length < 8 || compact.length % 4 !== 0) return false
  if (!/^[A-Za-z0-9+/]+={0,2}$/.test(compact)) return false

  try {
    const binary = atob(compact)
    const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0))
    const decoded = new TextDecoder('utf-8', { fatal: true }).decode(bytes)
    if (!decoded.trim()) return false

    const printableCharacters = [...decoded].filter((character) => {
      const codePoint = character.codePointAt(0) ?? 0
      return character === '\n' || character === '\r' || character === '\t' || codePoint >= 32
    }).length

    return printableCharacters / [...decoded].length > 0.9
  } catch {
    return false
  }
}

const detectDelimitedText = (value: string): { delimiter: string; columns: number } | null => {
  const lines = value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)

  if (lines.length < 2) return null

  for (const delimiter of [',', '\t', ';']) {
    const counts = lines.slice(0, 8).map((line) => line.split(delimiter).length)
    if (counts[0] >= 2 && counts.every((count) => count === counts[0])) {
      return { delimiter, columns: counts[0] }
    }
  }

  return null
}

const addSuggestion = (
  suggestions: SmartSuggestion[],
  transformationId: string,
  reason: string,
  confidence: number
): void => {
  if (suggestions.some((suggestion) => suggestion.transformationId === transformationId)) return
  suggestions.push({ transformationId, reason, confidence })
}

export const detectText = (input: string): SmartDetectionResult => {
  const value = input.trim()
  const suggestions: SmartSuggestion[] = []
  let kind = 'Plain text'
  let summary = 'General text tools'

  if (!value) {
    return { kind: 'Empty clipboard', summary: 'Copy some text and try again', suggestions }
  }

  if (isProbablyJwt(value)) {
    kind = 'JSON Web Token'
    summary = 'A three-part JWT with decodable JSON'
    addSuggestion(suggestions, 'jwtDecode', 'Inspect the token header and payload', 1)
  }

  if (
    (value.startsWith('{') && value.endsWith('}')) ||
    (value.startsWith('[') && value.endsWith(']'))
  ) {
    try {
      JSON.parse(value)
      kind = 'JSON'
      summary = 'Valid JSON data'
      addSuggestion(suggestions, 'jsonPrettify', 'Format it for easier reading', 0.99)
      addSuggestion(suggestions, 'dataExplorer', 'Explore nested values as a tree', 0.96)
      addSuggestion(suggestions, 'sortJsonKeys', 'Sort object keys consistently', 0.88)
      addSuggestion(suggestions, 'jsonPathQuery', 'Query nested values with JSONPath', 0.78)
      addSuggestion(suggestions, 'jsonSchemaValidate', 'Validate it against a JSON Schema', 0.7)
    } catch {
      // Keep looking for formats with similar opening characters.
    }
  }

  if (/^<([A-Za-z_][\w:.-]*)(?:\s[^>]*)?>[\s\S]*<\/\1>$/.test(value)) {
    kind = 'XML'
    summary = 'XML document'
    addSuggestion(suggestions, 'xmlPrettify', 'Format the XML structure', 0.98)
    addSuggestion(suggestions, 'xmlToJson', 'Convert the document to JSON', 0.9)
  }

  if (/-----BEGIN CERTIFICATE-----[\s\S]+-----END CERTIFICATE-----/.test(value)) {
    kind = 'X.509 certificate'
    summary = 'PEM-encoded certificate'
    addSuggestion(suggestions, 'x509Inspect', 'Inspect identity, validity, keys, and extensions', 1)
  }

  if (/^(?:\d{1,3}\.){3}\d{1,3}\/(?:[0-9]|[12][0-9]|3[0-2])$/.test(value)) {
    kind = 'IPv4 CIDR'
    summary = 'IPv4 address and network prefix'
    addSuggestion(suggestions, 'ipv4CidrInspect', 'Calculate the network and host range', 0.98)
  }

  if (
    /^(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{32}|[0-9a-fA-F]{40}|[0-9a-fA-F]{56}|[0-9a-fA-F]{64}|[0-9a-fA-F]{96}|[0-9a-fA-F]{128})$/.test(
      value
    ) ||
    /^\$(?:2[aby]|argon2(?:id|i|d))\$/.test(value)
  ) {
    kind = 'Hash digest'
    summary = 'Digest-like value'
    addSuggestion(suggestions, 'hashIdentify', 'Suggest possible hash families', 0.96)
  }

  if (/^(?:N;|[bidsaOC]:)/.test(value) && /[;}]$/.test(value)) {
    kind = 'PHP serialized data'
    summary = 'PHP serialization syntax'
    addSuggestion(suggestions, 'phpUnserialize', 'Convert the value to JSON', 0.96)
  }

  if (/^\d{10}$|^\d{13}$/.test(value)) {
    const milliseconds = value.length === 10 ? Number(value) * 1000 : Number(value)
    const year = new Date(milliseconds).getUTCFullYear()
    if (year >= 2000 && year <= 2100) {
      kind = 'Unix timestamp'
      summary = `${value.length === 10 ? 'Seconds' : 'Milliseconds'} since the Unix epoch`
      addSuggestion(suggestions, 'timestampToIso', 'Convert it to a readable ISO date', 0.98)
    }
  }

  if (
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}:\d{2})$/.test(value) &&
    !Number.isNaN(Date.parse(value))
  ) {
    kind = 'ISO 8601 date'
    summary = 'A machine-readable date and time'
    addSuggestion(suggestions, 'isoToTimestamp', 'Convert it to a Unix timestamp', 0.98)
  }

  const delimited = detectDelimitedText(value)
  if (delimited) {
    kind = delimited.delimiter === '\t' ? 'Tabular data' : 'CSV-like data'
    summary = `${delimited.columns} consistently delimited columns`
    addSuggestion(suggestions, 'csvToJson', 'Convert rows into JSON objects', 0.91)
  }

  if (/^[^?#\s=]+=[^&\s]*(?:&[^&\s=]+=[^&\s]*)+$/.test(value)) {
    kind = 'Query string'
    summary = 'URL query parameters'
    addSuggestion(suggestions, 'queryStringToJson', 'Convert parameters to JSON', 0.94)
    addSuggestion(suggestions, 'urlDecode', 'Decode percent-encoded characters', 0.82)
  } else if (/%[0-9A-Fa-f]{2}/.test(value)) {
    try {
      if (decodeURIComponent(value) !== value) {
        kind = 'URL-encoded text'
        summary = 'Contains percent-encoded characters'
        addSuggestion(suggestions, 'urlDecode', 'Decode the escaped characters', 0.93)
      }
    } catch {
      // Invalid percent encoding should not surface a decode recommendation.
    }
  }

  if (/^https?:\/\/[^\s]+$/i.test(value)) {
    kind = 'URL'
    summary = 'Absolute web URL'
    addSuggestion(suggestions, 'urlParser', 'Inspect every URL component', 0.97)
    if (/%[0-9A-Fa-f]{2}/.test(value)) {
      addSuggestion(suggestions, 'urlDecode', 'Decode percent-encoded characters', 0.86)
    }
    addSuggestion(suggestions, 'defangIndicators', 'Make the URL safe to share', 0.72)
  }

  if (
    /\bhxxps?(?:\[?:\/\/\]?|:\/\/)/i.test(value) ||
    /\[(?:\.|dot)\]|\((?:\.|dot)\)/i.test(value)
  ) {
    kind = 'Defanged indicator'
    summary = 'A URL, domain, or IP address in safe sharing notation'
    addSuggestion(suggestions, 'fangIndicators', 'Restore the original indicator', 0.96)
  }

  if (isProbablyBase64(value) && !isProbablyJwt(value)) {
    kind = 'Base64'
    summary = 'Valid Base64 containing readable text'
    addSuggestion(suggestions, 'base64Decode', 'Decode it to readable text', 0.92)
  }

  const lines = value.split(/\r?\n/).filter((line) => line.length > 0)
  if (lines.length > 1) {
    if (new Set(lines).size < lines.length) {
      addSuggestion(suggestions, 'deduplicateLines', 'Remove repeated lines', 0.78)
    }
    addSuggestion(suggestions, 'sortLines', 'Sort the lines alphabetically', 0.62)
    addSuggestion(suggestions, 'textStatistics', 'Measure lines, words, and characters', 0.58)
  }

  if (suggestions.length === 0) {
    addSuggestion(suggestions, 'textStatistics', 'Measure words, lines, and characters', 0.55)
    if (value.length <= 160) {
      addSuggestion(suggestions, 'slugify', 'Turn it into a URL-friendly slug', 0.48)
      addSuggestion(suggestions, 'toTitleCase', 'Normalize it as a title', 0.44)
    }
  }

  suggestions.sort((left, right) => right.confidence - left.confidence)
  return { kind, summary, suggestions: suggestions.slice(0, 4) }
}
