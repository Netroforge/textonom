import { describe, it, expect } from 'vitest'
import sortLines from '@renderer/transformations/lines/sort'
import deduplicateLines from '@renderer/transformations/lines/deduplicate'
import reverseLines from '@renderer/transformations/lines/reverse'
import removeEmptyLines from '@renderer/transformations/lines/remove-empty'

describe('sortLines', () => {
  it('sorts lines alphabetically', async () => {
    expect(await sortLines('banana\napple\ncherry')).toBe('apple\nbanana\ncherry')
  })

  it('normalizes CRLF and CR newlines to LF', async () => {
    expect(await sortLines('b\r\na\rc')).toBe('a\nb\nc')
  })

  it('passes empty input through', async () => {
    expect(await sortLines('')).toBe('')
  })
})

describe('deduplicateLines', () => {
  it('removes duplicate lines, keeping first occurrence order', async () => {
    expect(await deduplicateLines('a\nb\na\nc\nb')).toBe('a\nb\nc')
  })
})

describe('reverseLines', () => {
  it('reverses the order of lines', async () => {
    expect(await reverseLines('a\nb\nc')).toBe('c\nb\na')
  })
})

describe('removeEmptyLines', () => {
  it('returns empty string for empty input', async () => {
    expect(await removeEmptyLines('')).toBe('')
  })

  it('drops blank and whitespace-only lines', async () => {
    expect(await removeEmptyLines('a\n\n  \nb\n')).toBe('a\nb')
  })
})
