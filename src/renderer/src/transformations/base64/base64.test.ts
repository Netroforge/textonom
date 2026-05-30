import { describe, it, expect } from 'vitest'
import base64Encode from '@renderer/transformations/base64/encode'
import base64Decode from '@renderer/transformations/base64/decode'

describe('base64Encode', () => {
  it('returns empty string for empty input', async () => {
    expect(await base64Encode('')).toBe('')
  })

  it('encodes ASCII text', async () => {
    expect(await base64Encode('Hello')).toBe('SGVsbG8=')
  })

  it('encodes unicode text', async () => {
    expect(await base64Encode('café ☕')).toBe('Y2Fmw6kg4piV')
  })
})

describe('base64Decode', () => {
  it('decodes ASCII text', async () => {
    expect(await base64Decode('SGVsbG8=')).toBe('Hello')
  })

  it('round-trips with the encoder', async () => {
    const original = 'The quick brown fox — café ☕'
    expect(await base64Decode(await base64Encode(original))).toBe(original)
  })
})
