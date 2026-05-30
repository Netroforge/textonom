import { describe, it, expect } from 'vitest'
import uuidGenerate from '@renderer/transformations/uuid/generate'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

describe('uuidGenerate', () => {
  it('generates a single uuid by default', async () => {
    const result = await uuidGenerate('')
    expect(result).toMatch(UUID_RE)
    expect(result.split('\n')).toHaveLength(1)
  })

  it('generates the requested count, one per line', async () => {
    const result = await uuidGenerate('', { count: 5 })
    const lines = result.split('\n')
    expect(lines).toHaveLength(5)
    lines.forEach((line) => expect(line).toMatch(UUID_RE))
  })

  it('produces unique values', async () => {
    const lines = (await uuidGenerate('', { count: 10 })).split('\n')
    expect(new Set(lines).size).toBe(10)
  })

  it('uppercases when requested', async () => {
    const result = await uuidGenerate('', { count: 1, uppercase: true })
    expect(result).toBe(result.toUpperCase())
    expect(result).toMatch(UUID_RE)
  })

  it('clamps the count to at least 1', async () => {
    expect((await uuidGenerate('', { count: 0 })).split('\n')).toHaveLength(1)
  })
})
