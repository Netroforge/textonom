import { describe, it, expect } from 'vitest'
import binaryEncode from '@renderer/transformations/binary/encode'
import binaryDecode from '@renderer/transformations/binary/decode'

describe('binaryEncode', () => {
  it('returns empty string for empty input', async () => {
    expect(await binaryEncode('')).toBe('')
  })

  it('encodes text to space-separated bytes', async () => {
    expect(await binaryEncode('Hi')).toBe('01001000 01101001')
  })
})

describe('binaryDecode', () => {
  it('returns empty string for empty input', async () => {
    expect(await binaryDecode('')).toBe('')
  })

  it('decodes space-separated bytes', async () => {
    expect(await binaryDecode('01001000 01101001')).toBe('Hi')
  })

  it('decodes a continuous bit stream', async () => {
    expect(await binaryDecode('0100100001101001')).toBe('Hi')
  })

  it('throws on non-binary characters', async () => {
    await expect(binaryDecode('0102')).rejects.toThrow('only 0s and 1s')
  })

  it('throws when the bit count is not a multiple of 8', async () => {
    await expect(binaryDecode('0100100')).rejects.toThrow('multiple of 8')
  })

  it('round-trips with the encoder', async () => {
    expect(await binaryDecode(await binaryEncode('café'))).toBe('café')
  })
})
