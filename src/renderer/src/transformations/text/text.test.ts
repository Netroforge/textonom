import { describe, it, expect } from 'vitest'
import removeDuplicateWords from '@renderer/transformations/text/remove-duplicate-words'
import slugify from '@renderer/transformations/text/slugify'
import reverseString from '@renderer/transformations/text/reverse-string'
import textStatistics from '@renderer/transformations/text/statistics'
import rot13 from '@renderer/transformations/text/rot13'
import caesarCipher from '@renderer/transformations/text/caesar-cipher'
import natoAlphabet from '@renderer/transformations/text/nato-alphabet'
import stripHtmlTags from '@renderer/transformations/text/strip-html'

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

describe('reverseString', () => {
  it('returns empty string for empty input', async () => {
    expect(await reverseString('')).toBe('')
  })

  it('reverses characters', async () => {
    expect(await reverseString('abc')).toBe('cba')
  })

  it('handles astral-plane code points', async () => {
    expect(await reverseString('a🎉b')).toBe('b🎉a')
  })
})

describe('textStatistics', () => {
  it('reports zeroed counts for empty input', async () => {
    expect(await textStatistics('')).toContain('Words: 0')
  })

  it('counts characters, words, lines, and bytes', async () => {
    const result = await textStatistics('hello world\nsecond line')
    expect(result).toContain('Words: 4')
    expect(result).toContain('Lines: 2')
    expect(result).toContain('Characters: 23')
    expect(result).toContain('Bytes (UTF-8): 23')
  })
})

describe('rot13', () => {
  it('rotates letters by 13', async () => {
    expect(await rot13('Hello')).toBe('Uryyb')
  })

  it('is its own inverse', async () => {
    expect(await rot13(await rot13('The quick brown fox'))).toBe('The quick brown fox')
  })

  it('leaves non-letters unchanged', async () => {
    expect(await rot13('abc 123!')).toBe('nop 123!')
  })
})

describe('caesarCipher', () => {
  it('shifts by the default of 3', async () => {
    expect(await caesarCipher('abc')).toBe('def')
  })

  it('wraps around the alphabet and preserves case', async () => {
    expect(await caesarCipher('XYZ', { shift: 3 })).toBe('ABC')
  })

  it('decodes with a negative shift', async () => {
    expect(await caesarCipher('def', { shift: -3 })).toBe('abc')
  })
})

describe('natoAlphabet', () => {
  it('spells out letters and digits', async () => {
    expect(await natoAlphabet('A1')).toBe('Alfa One')
  })

  it('keeps unknown characters as-is', async () => {
    expect(await natoAlphabet('Hi!')).toBe('Hotel India !')
  })
})

describe('stripHtmlTags', () => {
  it('returns empty string for empty input', async () => {
    expect(await stripHtmlTags('')).toBe('')
  })

  it('removes tags but keeps text content', async () => {
    expect(await stripHtmlTags('<p>Hello <b>world</b></p>')).toBe('Hello world')
  })
})
