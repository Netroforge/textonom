import { describe, expect, it } from 'vitest'
import { PNG } from 'pngjs'
import {
  calculateImageDimensions,
  decodeQrPixels,
  qrDecode,
  qrGenerate
} from '@renderer/transformations/media'

describe('QR transformations', () => {
  it('generates a local PNG data URI', async () => {
    const output = await qrGenerate('https://textonom.dev', {
      errorCorrectionLevel: 'H',
      size: 256,
      margin: 2
    })
    expect(output).toMatch(/^data:image\/png;base64,/)
    expect(output.length).toBeGreaterThan(500)
  })

  it('decodes pixels produced by the generator', async () => {
    const expected = 'Textonom QR round trip'
    const output = await qrGenerate(expected, { size: 256, margin: 4 })
    const png = PNG.sync.read(Buffer.from(output.split(',')[1], 'base64'))
    const pixels = new Uint8ClampedArray(png.data.buffer, png.data.byteOffset, png.data.byteLength)

    expect(decodeQrPixels(pixels, png.width, png.height)).toBe(expected)
  })

  it('validates generation and decode inputs', async () => {
    await expect(qrGenerate('text', { errorCorrectionLevel: 'invalid' })).rejects.toThrow(
      'L, M, Q, or H'
    )
    await expect(qrDecode('not an image')).rejects.toThrow('image data URI')
  })
})

describe('image conversion helpers', () => {
  it('preserves aspect ratio while fitting within both bounds', () => {
    expect(calculateImageDimensions(4000, 2000, 1000, 800)).toEqual({
      width: 1000,
      height: 500
    })
    expect(calculateImageDimensions(1000, 2000, 800, 600)).toEqual({
      width: 300,
      height: 600
    })
  })

  it('does not upscale and rejects invalid source dimensions', () => {
    expect(calculateImageDimensions(320, 200, 1000, 1000)).toEqual({
      width: 320,
      height: 200
    })
    expect(() => calculateImageDimensions(0, 200, 100, 100)).toThrow('must be positive')
  })
})
