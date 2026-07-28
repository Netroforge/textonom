import { describe, expect, it } from 'vitest'
import { detectText } from './smartDetection'

const suggestedIds = (input: string): string[] =>
  detectText(input).suggestions.map((suggestion) => suggestion.transformationId)

describe('smart clipboard detection', () => {
  it('recognizes JSON and prioritizes formatting and exploration', () => {
    const result = detectText('{"name":"Textonom","private":true}')

    expect(result.kind).toBe('JSON')
    expect(suggestedIds('{"name":"Textonom"}').slice(0, 2)).toEqual([
      'jsonPrettify',
      'dataExplorer'
    ])
  })

  it('recognizes a structurally valid JWT', () => {
    const token = 'eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJzdWIiOiIxMjMiLCJuYW1lIjoiVGV4dG9ub20ifQ.'

    expect(detectText(token).kind).toBe('JSON Web Token')
    expect(suggestedIds(token)[0]).toBe('jwtDecode')
  })

  it('recognizes readable Base64 without treating arbitrary words as encoded data', () => {
    expect(suggestedIds('SGVsbG8sIFRleHRvbm9tIQ==')[0]).toBe('base64Decode')
    expect(suggestedIds('test')).not.toContain('base64Decode')
  })

  it('recognizes timestamps, ISO dates, query strings, and delimited rows', () => {
    expect(suggestedIds('1753660800')[0]).toBe('timestampToIso')
    expect(suggestedIds('2026-07-28T09:30:00Z')[0]).toBe('isoToTimestamp')
    expect(suggestedIds('name=Textonom&mode=local')[0]).toBe('queryStringToJson')
    expect(suggestedIds('name,mode\nTextonom,local')[0]).toBe('csvToJson')
  })

  it('recognizes URLs and defanged indicators', () => {
    expect(suggestedIds('https://example.com/path?name=value')[0]).toBe('urlParser')
    expect(suggestedIds('hxxps[://]example[.]com')[0]).toBe('fangIndicators')
  })

  it('recognizes certificates, CIDR ranges, hashes, and PHP serialized data', () => {
    expect(suggestedIds('-----BEGIN CERTIFICATE-----\nMIIB\n-----END CERTIFICATE-----')[0]).toBe(
      'x509Inspect'
    )
    expect(suggestedIds('192.168.1.20/24')[0]).toBe('ipv4CidrInspect')
    expect(suggestedIds('d41d8cd98f00b204e9800998ecf8427e')[0]).toBe('hashIdentify')
    expect(suggestedIds('a:1:{s:4:"name";s:8:"Textonom";}')[0]).toBe('phpUnserialize')
  })

  it('falls back to useful general text tools', () => {
    const result = detectText('Textonom makes local text tools convenient')

    expect(result.kind).toBe('Plain text')
    expect(result.suggestions.length).toBeGreaterThan(0)
    expect(result.suggestions[0].transformationId).toBe('textStatistics')
  })

  it('returns no tools for an empty clipboard', () => {
    expect(detectText('   ')).toEqual({
      kind: 'Empty clipboard',
      summary: 'Copy some text and try again',
      suggestions: []
    })
  })
})
