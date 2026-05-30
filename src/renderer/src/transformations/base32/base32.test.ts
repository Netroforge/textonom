import { describe, it, expect } from 'vitest'
import base32Encode from '@renderer/transformations/base32/encode'
import base32Decode from '@renderer/transformations/base32/decode'

describe('base32Encode', () => {
  it('returns empty string for empty input', async () => {
    expect(await base32Encode('')).toBe('')
  })

  it('encodes a known RFC 4648 vector', async () => {
    expect(await base32Encode('foobar')).toBe('MZXW6YTBOI======')
  })
})

describe('base32Decode', () => {
  it('returns empty string for empty input', async () => {
    expect(await base32Decode('')).toBe('')
  })

  it('decodes a known RFC 4648 vector', async () => {
    expect(await base32Decode('MZXW6YTBOI======')).toBe('foobar')
  })

  it('is case-insensitive and ignores whitespace', async () => {
    expect(await base32Decode('mzxw6 ytboi======')).toBe('foobar')
  })

  it('throws on invalid characters', async () => {
    await expect(base32Decode('0189')).rejects.toThrow('Invalid Base32 character')
  })

  it('round-trips with the encoder', async () => {
    expect(await base32Decode(await base32Encode('Hello, World!'))).toBe('Hello, World!')
  })
})
