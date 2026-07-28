import { describe, expect, it } from 'vitest'
import { jsonPathQuery, jsonSchemaValidate } from '@renderer/transformations/structured'

describe('jsonPathQuery', () => {
  const store = '{"store":{"books":[{"title":"One","price":8},{"title":"Two","price":12}]}}'

  it('returns matching values and their count', async () => {
    const result = JSON.parse(await jsonPathQuery(store, { path: '$.store.books[*].title' }))
    expect(result).toEqual({
      path: '$.store.books[*].title',
      count: 2,
      matches: ['One', 'Two']
    })
  })

  it('supports filter expressions', async () => {
    const result = JSON.parse(await jsonPathQuery(store, { path: '$..books[?(@.price < 10)]' }))
    expect(result.matches).toEqual([{ title: 'One', price: 8 }])
  })

  it('rejects invalid JSON', async () => {
    await expect(jsonPathQuery('{bad}', { path: '$' })).rejects.toThrow('valid JSON')
  })
})

describe('jsonSchemaValidate', () => {
  const schema = JSON.stringify({
    type: 'object',
    required: ['email'],
    properties: { email: { type: 'string', format: 'email' } },
    additionalProperties: false
  })

  it('reports valid input', async () => {
    expect(JSON.parse(await jsonSchemaValidate('{"email":"dev@example.com"}', { schema }))).toEqual(
      {
        valid: true,
        errors: []
      }
    )
  })

  it('returns all useful validation errors', async () => {
    const result = JSON.parse(
      await jsonSchemaValidate('{"email":"not-an-email","extra":true}', { schema })
    )
    expect(result.valid).toBe(false)
    expect(result.errors.map((error: { keyword: string }) => error.keyword)).toEqual(
      expect.arrayContaining(['format', 'additionalProperties'])
    )
  })
})
