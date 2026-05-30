import { describe, it, expect } from 'vitest'
import tabsToSpaces from '@renderer/transformations/whitespace/tabs-to-spaces'
import spacesToTabs from '@renderer/transformations/whitespace/spaces-to-tabs'
import trimLines from '@renderer/transformations/whitespace/trim-lines'

describe('tabsToSpaces', () => {
  it('returns empty string for empty input', async () => {
    expect(await tabsToSpaces('')).toBe('')
  })

  it('replaces tabs with the default 4 spaces', async () => {
    expect(await tabsToSpaces('\tx')).toBe('    x')
  })

  it('honours a custom tab size', async () => {
    expect(await tabsToSpaces('\tx', { tabSize: 2 })).toBe('  x')
  })

  it('throws on an out-of-range tab size', async () => {
    await expect(tabsToSpaces('\tx', { tabSize: 0 })).rejects.toThrow('between 1 and 16')
  })
})

describe('spacesToTabs', () => {
  it('converts a full indent run to a tab', async () => {
    expect(await spacesToTabs('    x', { tabSize: 4 })).toBe('\tx')
  })

  it('leaves a remainder of spaces after whole tabs', async () => {
    expect(await spacesToTabs('      x', { tabSize: 4 })).toBe('\t  x')
  })

  it('only converts leading indentation', async () => {
    expect(await spacesToTabs('a    b', { tabSize: 4 })).toBe('a    b')
  })
})

describe('trimLines', () => {
  it('strips trailing whitespace from each line', async () => {
    expect(await trimLines('a  \nb\t\nc')).toBe('a\nb\nc')
  })

  it('leaves leading whitespace intact', async () => {
    expect(await trimLines('  a  ')).toBe('  a')
  })
})
