import { describe, it, expect } from 'vitest'
import hexEncode from '@renderer/transformations/hex/encode'
import hexDecode from '@renderer/transformations/hex/decode'

describe('hexEncode', () => {
  it('returns empty string for empty input', async () => {
    expect(await hexEncode('')).toBe('')
  })

  it('encodes ASCII text to hex', async () => {
    expect(await hexEncode('Hi')).toBe('4869')
  })
})

describe('hexDecode', () => {
  it('returns empty string for empty input', async () => {
    expect(await hexDecode('')).toBe('')
  })

  it('decodes hex to text', async () => {
    expect(await hexDecode('4869')).toBe('Hi')
  })

  it('ignores whitespace and is case-insensitive', async () => {
    expect(await hexDecode('48 69')).toBe('Hi')
  })

  it('throws on invalid hex characters', async () => {
    await expect(hexDecode('zz')).rejects.toThrow('invalid hexadecimal characters')
  })

  it('throws on an odd number of digits', async () => {
    await expect(hexDecode('486')).rejects.toThrow('even number of digits')
  })

  it('round-trips with the encoder', async () => {
    expect(await hexDecode(await hexEncode('Hello'))).toBe('Hello')
  })
})
