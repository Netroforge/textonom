import { describe, it, expect } from 'vitest'
import { getAllTransformations, getAllCategories } from '@renderer/transformations/registry'

describe('transformation registry', () => {
  const all = getAllTransformations()
  const categoryIds = new Set(getAllCategories().map((c) => c.id))

  it('has a unique id for every transformation', () => {
    const ids = all.map((t) => t.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('wires a callable function for every transformation', () => {
    for (const t of all) {
      expect(typeof t.fn, `${t.id} should have a function`).toBe('function')
    }
  })

  it('assigns every transformation to a known category', () => {
    for (const t of all) {
      expect(categoryIds.has(t.category), `${t.id} -> ${t.category}`).toBe(true)
    }
  })

  it('gives parameters sensible defaults within their declared bounds', () => {
    for (const t of all) {
      for (const param of t.parameters ?? []) {
        if (param.type === 'number' && typeof param.default === 'number') {
          if (param.min !== undefined) expect(param.default).toBeGreaterThanOrEqual(param.min)
          if (param.max !== undefined) expect(param.default).toBeLessThanOrEqual(param.max)
        }
      }
    }
  })
})
