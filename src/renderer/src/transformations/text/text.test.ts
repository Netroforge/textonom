import { describe, it, expect } from 'vitest'
import removeDuplicateWords from '@renderer/transformations/text/remove-duplicate-words'
import slugify from '@renderer/transformations/text/slugify'

describe('removeDuplicateWords', () => {
  it('returns empty string for empty input', async () => {
    expect(await removeDuplicateWords('')).toBe('')
  })

  it('removes repeated words case-insensitively', async () => {
    const result = await removeDuplicateWords('apple Apple banana apple banana')
    expect(result.split(/\s+/).filter(Boolean)).toEqual(['apple', 'banana'])
  })
})

describe('slugify', () => {
  it('returns empty string for empty input', async () => {
    expect(await slugify('')).toBe('')
  })

  it('lowercases, strips punctuation, and hyphenates spaces', async () => {
    expect(await slugify('Hello, World!')).toBe('hello-world')
  })

  it('strips diacritics', async () => {
    expect(await slugify('Café déjà vu')).toBe('cafe-deja-vu')
  })
})
