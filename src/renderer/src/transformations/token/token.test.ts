import { describe, it, expect } from 'vitest'
import tokenGenerate from '@renderer/transformations/token/generate'

describe('tokenGenerate', () => {
  it('generates a 32-character token by default', async () => {
    expect(await tokenGenerate('')).toHaveLength(32)
  })

  it('honours the requested length', async () => {
    expect(await tokenGenerate('', { length: 64 })).toHaveLength(64)
  })

  it('restricts the output to the enabled character sets', async () => {
    const result = await tokenGenerate('', {
      length: 200,
      uppercase: false,
      lowercase: false,
      numbers: true,
      symbols: false
    })
    expect(result).toMatch(/^[0-9]+$/)
  })

  it('includes symbols only when requested', async () => {
    const onlySymbols = await tokenGenerate('', {
      length: 200,
      uppercase: false,
      lowercase: false,
      numbers: false,
      symbols: true
    })
    expect(onlySymbols).toMatch(/^[!@#$%^&*()\-_=+[\]{};:,.<>?]+$/)
  })

  it('throws when every character set is disabled', async () => {
    await expect(
      tokenGenerate('', { uppercase: false, lowercase: false, numbers: false, symbols: false })
    ).rejects.toThrow('At least one character set')
  })
})
