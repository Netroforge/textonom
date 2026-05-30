import { describe, it, expect } from 'vitest'
import timestampToIso from '@renderer/transformations/timestamp/to-iso'
import isoToTimestamp from '@renderer/transformations/timestamp/from-iso'

describe('timestampToIso', () => {
  it('returns empty string for empty input', async () => {
    expect(await timestampToIso('')).toBe('')
  })

  it('treats small values as seconds', async () => {
    expect(await timestampToIso('1609459200')).toBe('2021-01-01T00:00:00.000Z')
  })

  it('treats large values as milliseconds', async () => {
    expect(await timestampToIso('1609459200000')).toBe('2021-01-01T00:00:00.000Z')
  })

  it('processes each line and preserves blanks', async () => {
    expect(await timestampToIso('0\n\n1609459200')).toBe(
      '1970-01-01T00:00:00.000Z\n\n2021-01-01T00:00:00.000Z'
    )
  })

  it('throws on non-numeric input', async () => {
    await expect(timestampToIso('abc')).rejects.toThrow('Not a numeric timestamp')
  })
})

describe('isoToTimestamp', () => {
  it('returns empty string for empty input', async () => {
    expect(await isoToTimestamp('')).toBe('')
  })

  it('converts ISO to unix seconds by default', async () => {
    expect(await isoToTimestamp('2021-01-01T00:00:00.000Z')).toBe('1609459200')
  })

  it('converts to milliseconds when requested', async () => {
    expect(await isoToTimestamp('2021-01-01T00:00:00.000Z', { unit: 'milliseconds' })).toBe(
      '1609459200000'
    )
  })

  it('throws on an invalid date', async () => {
    await expect(isoToTimestamp('not-a-date')).rejects.toThrow('Not a valid ISO 8601 date')
  })
})
