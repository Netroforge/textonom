import { describe, it, expect } from 'vitest'
import markdownToHtml from '@renderer/transformations/markdown/to-html'

describe('markdownToHtml', () => {
  it('returns empty string for empty input', async () => {
    expect(await markdownToHtml('')).toBe('')
  })

  it('converts headings', async () => {
    expect(await markdownToHtml('# Hello')).toContain('<h1>Hello</h1>')
  })

  it('converts inline emphasis', async () => {
    const result = await markdownToHtml('**bold** and *italic*')
    expect(result).toContain('<strong>bold</strong>')
    expect(result).toContain('<em>italic</em>')
  })
})
