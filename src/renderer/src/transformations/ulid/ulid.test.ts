import { describe, it, expect } from 'vitest'
import ulidGenerate from '@renderer/transformations/ulid/generate'

// 26 chars from Crockford's Base32 alphabet (excludes I, L, O, U)
const ULID_RE = /^[0-9A-HJKMNP-TV-Z]{26}$/

describe('ulidGenerate', () => {
  it('generates a single ULID by default', async () => {
    const result = await ulidGenerate('')
    expect(result).toMatch(ULID_RE)
    expect(result.split('\n')).toHaveLength(1)
  })

  it('generates the requested count, one per line', async () => {
    const lines = (await ulidGenerate('', { count: 5 })).split('\n')
    expect(lines).toHaveLength(5)
    lines.forEach((line) => expect(line).toMatch(ULID_RE))
  })

  it('produces unique values', async () => {
    const lines = (await ulidGenerate('', { count: 20 })).split('\n')
    expect(new Set(lines).size).toBe(20)
  })

  it('clamps the count to at least 1', async () => {
    expect((await ulidGenerate('', { count: 0 })).split('\n')).toHaveLength(1)
  })
})
