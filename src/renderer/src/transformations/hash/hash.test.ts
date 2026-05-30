import { describe, it, expect, vi, beforeEach } from 'vitest'

// bcrypt/pbkdf2 delegate to a Web Worker that isn't available under the test
// runner, so we stub the worker client and assert the wrapper's validation and
// delegation logic instead.
vi.mock('@renderer/workers/hashWorkerClient', () => ({
  bcryptInWorker: vi.fn(async (text: string, rounds: number) => `bcrypt(${rounds}):${text}`),
  pbkdf2InWorker: vi.fn(
    async (text: string, algorithm: string, iterations: number, keyLength: number, salt: string) =>
      `pbkdf2(${algorithm},${iterations},${keyLength},${salt}):${text}`
  )
}))

import md5Hash from '@renderer/transformations/hash/md5'
import sha1Hash from '@renderer/transformations/hash/sha1'
import sha256Hash from '@renderer/transformations/hash/sha256'
import sha512Hash from '@renderer/transformations/hash/sha512'
import bcryptHash from '@renderer/transformations/hash/bcrypt'
import pbkdf2Hash from '@renderer/transformations/hash/pbkdf2'
import hmacHash from '@renderer/transformations/hash/hmac'
import { bcryptInWorker, pbkdf2InWorker } from '@renderer/workers/hashWorkerClient'

describe('md5Hash', () => {
  it('hashes a known value', async () => {
    expect(await md5Hash('abc')).toBe('900150983cd24fb0d6963f7d28e17f72')
  })
})

describe('sha1Hash', () => {
  it('hashes a known value', async () => {
    expect(await sha1Hash('abc')).toBe('a9993e364706816aba3e25717850c26c9cd0d89d')
  })
})

describe('sha256Hash', () => {
  it('hashes a known value', async () => {
    expect(await sha256Hash('abc')).toBe(
      'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad'
    )
  })
})

describe('sha512Hash', () => {
  it('returns empty string for empty input', async () => {
    expect(await sha512Hash('')).toBe('')
  })

  it('hashes a known value', async () => {
    expect(await sha512Hash('abc')).toBe(
      'ddaf35a193617abacc417349ae20413112e6fa4e89a97ea20a9eeee64b55d39a2192992a274fc1a836ba3c23a3feebbd454d4423643ce80e2a9ac94fa54ca49f'
    )
  })
})

describe('hmacHash', () => {
  it('returns empty string for empty input', async () => {
    expect(await hmacHash('', { key: 'secret' })).toBe('')
  })

  it('throws when the key is missing', async () => {
    await expect(hmacHash('data', {})).rejects.toThrow('Secret key is required')
  })

  it('computes a known HMAC-SHA256', async () => {
    // RFC-style vector: HMAC-SHA256("The quick brown fox jumps over the lazy dog", "key")
    expect(await hmacHash('The quick brown fox jumps over the lazy dog', { key: 'key' })).toBe(
      'f7bc83f430538424b13298e6aa6fb143ef4d59a14946175997479dbc2d1a3cd8'
    )
  })

  it('throws on an unsupported algorithm', async () => {
    await expect(hmacHash('data', { key: 'k', algorithm: 'MD5' })).rejects.toThrow(
      'Unsupported algorithm: MD5'
    )
  })
})

describe('bcryptHash', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns empty string for empty input', async () => {
    expect(await bcryptHash('')).toBe('')
  })

  it('delegates to the worker with the default cost factor', async () => {
    expect(await bcryptHash('secret')).toBe('bcrypt(12):secret')
    expect(bcryptInWorker).toHaveBeenCalledWith('secret', 12)
  })

  it('passes a custom cost factor through', async () => {
    await bcryptHash('secret', 8)
    expect(bcryptInWorker).toHaveBeenCalledWith('secret', 8)
  })

  it('rejects out-of-range cost factors', async () => {
    await expect(bcryptHash('secret', 21)).rejects.toThrow('Cost factor must be between 1 and 20')
  })
})

describe('pbkdf2Hash', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns empty string for empty input', async () => {
    expect(await pbkdf2Hash('')).toBe('')
  })

  it('delegates to the worker with defaults', async () => {
    await pbkdf2Hash('secret')
    expect(pbkdf2InWorker).toHaveBeenCalledWith('secret', 'SHA256', 100000, 32, '')
  })

  it('passes custom parameters through', async () => {
    await pbkdf2Hash('secret', { algorithm: 'sha512', iterations: 5000, keyLength: 64, salt: 's' })
    expect(pbkdf2InWorker).toHaveBeenCalledWith('secret', 'SHA512', 5000, 64, 's')
  })

  it('rejects an invalid algorithm', async () => {
    await expect(pbkdf2Hash('secret', { algorithm: 'md5' })).rejects.toThrow(
      'Algorithm must be SHA1, SHA256, or SHA512'
    )
  })

  it('rejects an out-of-range key length', async () => {
    await expect(pbkdf2Hash('secret', { keyLength: 4 })).rejects.toThrow(
      'Key length must be between 8 and 128 bytes'
    )
  })
})
