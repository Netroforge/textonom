import { describe, it, expect } from 'vitest'
import unicodeEscape from '@renderer/transformations/unicode/escape'
import unicodeUnescape from '@renderer/transformations/unicode/unescape'

describe('unicodeEscape', () => {
  it('escapes non-ASCII characters to \\uXXXX', async () => {
    expect(await unicodeEscape('café')).toBe('caf\\u00e9')
  })

  it('leaves ASCII characters untouched', async () => {
    expect(await unicodeEscape('ABC 123')).toBe('ABC 123')
  })
})

describe('unicodeUnescape', () => {
  it('converts \\uXXXX sequences to characters', async () => {
    expect(await unicodeUnescape('caf\\u00e9')).toBe('café')
  })

  it('round-trips with the escaper', async () => {
    const original = 'héllo — 世界'
    expect(await unicodeUnescape(await unicodeEscape(original))).toBe(original)
  })
})
