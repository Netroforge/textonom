import { describe, expect, it } from 'vitest'
import { backslashEscape, backslashUnescape } from '@renderer/transformations/escape'

describe('backslash transformations', () => {
  it('escapes and restores common control characters and quotes', async () => {
    const input = 'line 1\n\t\'quoted\' "text" \\ path'
    const escaped = await backslashEscape(input)

    expect(escaped).toBe('line 1\\n\\t\\\'quoted\\\' \\"text\\" \\\\ path')
    expect(await backslashUnescape(escaped)).toBe(input)
  })

  it('supports hexadecimal and Unicode code point escapes', async () => {
    expect(await backslashUnescape('\\x41\\u0042\\u{1F389}')).toBe('AB🎉')
  })

  it('rejects malformed escapes', async () => {
    await expect(backslashUnescape('\\u12')).rejects.toThrow('Invalid hexadecimal escape')
    await expect(backslashUnescape('\\q')).rejects.toThrow('Unknown backslash escape')
  })
})
