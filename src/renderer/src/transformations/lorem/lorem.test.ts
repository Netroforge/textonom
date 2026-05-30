import { describe, it, expect } from 'vitest'
import loremGenerate from '@renderer/transformations/lorem/generate'

describe('loremGenerate', () => {
  it('generates the requested number of words', async () => {
    const result = await loremGenerate('', { unit: 'words', count: 5 })
    expect(result.split(' ')).toHaveLength(5)
    expect(result[0]).toBe(result[0].toUpperCase())
  })

  it('generates the requested number of sentences', async () => {
    const result = await loremGenerate('', { unit: 'sentences', count: 3 })
    expect(result.match(/\./g)).toHaveLength(3)
  })

  it('generates the requested number of paragraphs', async () => {
    const result = await loremGenerate('', { unit: 'paragraphs', count: 4 })
    expect(result.split('\n\n')).toHaveLength(4)
  })

  it('clamps the count to at least 1', async () => {
    const result = await loremGenerate('', { unit: 'words', count: 0 })
    expect(result.split(' ')).toHaveLength(1)
  })
})
