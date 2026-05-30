import { describe, it, expect } from 'vitest'
import { aesEncrypt, aesDecrypt } from '@renderer/transformations/aes'

describe('aesEncrypt', () => {
  it('returns empty string for empty input', async () => {
    expect(await aesEncrypt('', { key: 'secret' })).toBe('')
  })

  it('throws when no key is provided', async () => {
    await expect(aesEncrypt('data', {})).rejects.toThrow('Encryption key is required')
  })

  it('produces base64 output by default', async () => {
    const result = await aesEncrypt('hello', { key: 'secret' })
    expect(result).toMatch(/^U2FsdGVkX1/) // CryptoJS "Salted__" prefix in base64
  })

  it('produces hex output when requested', async () => {
    const result = await aesEncrypt('hello', { key: 'secret', output: 'hex' })
    expect(result).toMatch(/^[0-9a-f]+$/)
  })
})

describe('aesDecrypt', () => {
  it('returns empty string for empty input', async () => {
    expect(await aesDecrypt('', { key: 'secret' })).toBe('')
  })

  it('throws when no key is provided', async () => {
    await expect(aesDecrypt('data', {})).rejects.toThrow('Decryption key is required')
  })

  it('round-trips with the encrypter', async () => {
    const cipher = await aesEncrypt('hello world', { key: 'secret' })
    expect(await aesDecrypt(cipher, { key: 'secret' })).toBe('hello world')
  })

  it('throws when the key is wrong', async () => {
    const cipher = await aesEncrypt('hello world', { key: 'secret' })
    await expect(aesDecrypt(cipher, { key: 'wrong' })).rejects.toThrow()
  })
})
