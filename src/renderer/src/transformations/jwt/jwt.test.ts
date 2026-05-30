import { describe, it, expect } from 'vitest'
import jwtDecode from '@renderer/transformations/jwt/decode'

// Standard example token: { sub: '1234567890', name: 'John Doe', iat: 1516239022 }
const TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
  'eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.' +
  'SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'

describe('jwtDecode', () => {
  it('returns empty string for empty input', async () => {
    expect(await jwtDecode('')).toBe('')
  })

  it('decodes the payload to formatted JSON', async () => {
    const result = await jwtDecode(TOKEN)
    expect(JSON.parse(result)).toEqual({ sub: '1234567890', name: 'John Doe', iat: 1516239022 })
  })

  it('throws on a token that is not in header.payload.signature form', async () => {
    await expect(jwtDecode('not-a-jwt')).rejects.toThrow('Invalid JWT format')
  })
})
