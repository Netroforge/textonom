import { describe, it, expect } from 'vitest'
import baseConvert from '@renderer/transformations/numeric/base-convert'

describe('baseConvert', () => {
  it('returns empty string for empty input', async () => {
    expect(await baseConvert('')).toBe('')
  })

  it('converts decimal to hex by default', async () => {
    expect(await baseConvert('255')).toBe('ff')
  })

  it('converts hex to decimal', async () => {
    expect(await baseConvert('ff', { fromBase: 16, toBase: 10 })).toBe('255')
  })

  it('converts binary to decimal, stripping a 0b prefix', async () => {
    expect(await baseConvert('0b1010', { fromBase: 2, toBase: 10 })).toBe('10')
  })

  it('processes each line and preserves blanks', async () => {
    expect(await baseConvert('255\n\n16', { fromBase: 10, toBase: 16 })).toBe('ff\n\n10')
  })

  it('throws on an unsupported base', async () => {
    await expect(baseConvert('10', { fromBase: 3 })).rejects.toThrow(
      'Bases must be 2, 8, 10, or 16'
    )
  })

  it('throws when a value is invalid for the source base', async () => {
    await expect(baseConvert('xyz', { fromBase: 10, toBase: 16 })).rejects.toThrow(
      'is not a valid base-10 number'
    )
  })
})
