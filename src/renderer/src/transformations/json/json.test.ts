import { describe, it, expect } from 'vitest'
import jsonPrettify from '@renderer/transformations/json/prettify'
import jsonCompact from '@renderer/transformations/json/compact'

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
