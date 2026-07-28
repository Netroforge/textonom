import { describe, expect, it } from 'vitest'
import { gzipCompress, gzipDecompress } from '@renderer/transformations/compression'

describe('GZIP transformations', () => {
  it('round-trips Unicode text through Base64 GZIP data', async () => {
    const input = 'Textonom keeps data local 🎉\nSecond line'
    expect(await gzipDecompress(await gzipCompress(input))).toBe(input)
  })

  it('returns an empty string for empty input', async () => {
    expect(await gzipCompress('')).toBe('')
    expect(await gzipDecompress('')).toBe('')
  })

  it('handles input larger than stream backpressure buffers', async () => {
    const input = 'large payload 🎉\n'.repeat(100_000)
    expect(await gzipDecompress(await gzipCompress(input))).toBe(input)
  })

  it('rejects data that is not a GZIP stream', async () => {
    await expect(gzipDecompress('bm90IGd6aXA=')).rejects.toThrow(
      'Failed to decompress Base64 GZIP data'
    )
  })
})
