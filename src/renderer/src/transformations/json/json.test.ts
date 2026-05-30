import { describe, it, expect } from 'vitest'
import jsonPrettify from '@renderer/transformations/json/prettify'
import jsonCompact from '@renderer/transformations/json/compact'
import sortJsonKeys from '@renderer/transformations/json/sort-keys'

describe('jsonPrettify', () => {
  it('formats JSON with 2-space indentation', async () => {
    expect(await jsonPrettify('{"a":1,"b":[2,3]}')).toBe(
      '{\n  "a": 1,\n  "b": [\n    2,\n    3\n  ]\n}'
    )
  })

  it('throws on invalid JSON', async () => {
    await expect(jsonPrettify('{not json}')).rejects.toThrow('Invalid JSON format')
  })
})

describe('jsonCompact', () => {
  it('removes all insignificant whitespace', async () => {
    expect(await jsonCompact('{\n  "a": 1,\n  "b": 2\n}')).toBe('{"a":1,"b":2}')
  })

  it('throws on invalid JSON', async () => {
    await expect(jsonCompact('{not json}')).rejects.toThrow('Invalid JSON format')
  })
})

describe('sortJsonKeys', () => {
  it('returns empty string for empty input', async () => {
    expect(await sortJsonKeys('')).toBe('')
  })

  it('sorts object keys alphabetically and re-indents', async () => {
    expect(await sortJsonKeys('{"b":1,"a":2}')).toBe('{\n  "a": 2,\n  "b": 1\n}')
  })

  it('sorts nested object keys but preserves array order', async () => {
    const result = await sortJsonKeys('{"z":{"y":1,"x":2},"a":[3,1,2]}')
    expect(JSON.parse(result)).toEqual({ a: [3, 1, 2], z: { x: 2, y: 1 } })
    expect(result.indexOf('"a"')).toBeLessThan(result.indexOf('"z"'))
    expect(result.indexOf('"x"')).toBeLessThan(result.indexOf('"y"'))
  })

  it('throws on invalid JSON', async () => {
    await expect(sortJsonKeys('{bad}')).rejects.toThrow('Invalid JSON format')
  })
})
