import { describe, it, expect } from 'vitest'
import htmlEncode from '@renderer/transformations/html/encode'
import htmlDecode from '@renderer/transformations/html/decode'

describe('htmlEncode', () => {
  it('escapes angle brackets', async () => {
    expect(await htmlEncode('<div>')).toBe('&lt;div&gt;')
  })

  it('escapes ampersands', async () => {
    expect(await htmlEncode('a & b')).toBe('a &amp; b')
  })
})

describe('htmlDecode', () => {
  it('decodes entities back to characters', async () => {
    expect(await htmlDecode('&lt;div&gt;')).toBe('<div>')
  })

  it('round-trips with the encoder', async () => {
    const original = '<p class="x">a & b</p>'
    expect(await htmlDecode(await htmlEncode(original))).toBe(original)
  })
})
