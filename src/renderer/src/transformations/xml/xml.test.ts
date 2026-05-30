import { describe, it, expect } from 'vitest'
import xmlPrettify from '@renderer/transformations/xml/prettify'
import xmlCompact from '@renderer/transformations/xml/compact'

describe('xmlPrettify', () => {
  it('indents nested elements onto separate lines', async () => {
    const result = await xmlPrettify('<root><child>value</child></root>')
    expect(result.split(/\r?\n/).length).toBeGreaterThan(1)
    expect(result).toContain('<root>')
    expect(result).toContain('<child>')
    expect(result).toContain('value')
  })

  it('throws on unparseable XML', async () => {
    await expect(xmlPrettify('just plain text')).rejects.toThrow('Failed to prettify XML')
  })
})

describe('xmlCompact', () => {
  it('collapses whitespace between elements', async () => {
    const result = await xmlCompact('<root>\n  <child>value</child>\n</root>')
    expect(result).toBe('<root><child>value</child></root>')
  })
})
