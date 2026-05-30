import { describe, it, expect } from 'vitest'
import urlEncode from '@renderer/transformations/url/encode'
import urlDecode from '@renderer/transformations/url/decode'

describe('urlEncode', () => {
  it('percent-encodes reserved characters', async () => {
    expect(await urlEncode('a b&c=d')).toBe('a%20b%26c%3Dd')
  })
})

describe('urlDecode', () => {
  it('decodes percent-encoded text', async () => {
    expect(await urlDecode('a%20b%26c%3Dd')).toBe('a b&c=d')
  })

  it('throws on malformed input', async () => {
    await expect(urlDecode('%')).rejects.toThrow('Failed to URL decode text')
  })

  it('round-trips with the encoder', async () => {
    const original = 'https://example.com/path?q=hello world&x=1'
    expect(await urlDecode(await urlEncode(original))).toBe(original)
  })
})
