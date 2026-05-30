import { describe, it, expect } from 'vitest'
import morseEncode from '@renderer/transformations/morse/encode'
import morseDecode from '@renderer/transformations/morse/decode'

describe('morseEncode', () => {
  it('returns empty string for empty input', async () => {
    expect(await morseEncode('')).toBe('')
  })

  it('encodes letters separated by spaces', async () => {
    expect(await morseEncode('SOS')).toBe('... --- ...')
  })

  it('separates words with " / "', async () => {
    expect(await morseEncode('HI ME')).toBe('.... .. / -- .')
  })

  it('throws on characters it cannot encode', async () => {
    expect(await morseEncode('A!')).toBe('.- -.-.--')
    await expect(morseEncode('日')).rejects.toThrow('Cannot encode character')
  })
})

describe('morseDecode', () => {
  it('returns empty string for empty input', async () => {
    expect(await morseDecode('')).toBe('')
  })

  it('decodes a word', async () => {
    expect(await morseDecode('... --- ...')).toBe('SOS')
  })

  it('decodes word separators', async () => {
    expect(await morseDecode('.... .. / -- .')).toBe('HI ME')
  })

  it('throws on an invalid sequence', async () => {
    await expect(morseDecode('........')).rejects.toThrow('Cannot decode Morse sequence')
  })

  it('round-trips with the encoder', async () => {
    expect(await morseDecode(await morseEncode('HELLO WORLD'))).toBe('HELLO WORLD')
  })
})
