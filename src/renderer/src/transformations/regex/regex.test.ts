import { describe, it, expect } from 'vitest'
import { regexReplace, regexTest } from '@renderer/transformations/regex'

describe('regexReplace', () => {
  it('returns empty string for empty input', async () => {
    expect(await regexReplace('', { pattern: 'a' })).toBe('')
  })

  it('replaces all matches by default (g flag)', async () => {
    expect(await regexReplace('foo boo', { pattern: 'o', replacement: '0' })).toBe('f00 b00')
  })

  it('supports capture-group references in the replacement', async () => {
    expect(await regexReplace('John Doe', { pattern: '(\\w+) (\\w+)', replacement: '$2 $1' })).toBe(
      'Doe John'
    )
  })

  it('throws when no pattern is provided', async () => {
    await expect(regexReplace('text', {})).rejects.toThrow('Find pattern is required')
  })

  it('throws on an invalid pattern', async () => {
    await expect(regexReplace('text', { pattern: '(' })).rejects.toThrow('Invalid regex')
  })
})

describe('regexTest', () => {
  it('returns empty string for empty input', async () => {
    expect(await regexTest('', { pattern: '\\d' })).toBe('')
  })

  it('reports a message when there are no matches', async () => {
    expect(await regexTest('abc', { pattern: '\\d' })).toBe('No matches found.')
  })

  it('lists matches with their index', async () => {
    const result = await regexTest('a1b2', { pattern: '\\d' })
    expect(result).toContain('[0] "1" at index 1')
    expect(result).toContain('[1] "2" at index 3')
  })

  it('includes named groups when present', async () => {
    const result = await regexTest('2021', { pattern: '(?<year>\\d{4})' })
    expect(result).toContain('groups: {"year":"2021"}')
  })
})
