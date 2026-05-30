import { describe, it, expect } from 'vitest'
import colorConvert from '@renderer/transformations/color/convert'

describe('colorConvert', () => {
  it('returns empty string for empty input', async () => {
    expect(await colorConvert('')).toBe('')
  })

  it('converts a 6-digit hex color to hex/rgb/hsl', async () => {
    expect(await colorConvert('#ff0000')).toBe('#ff0000\trgb(255, 0, 0)\thsl(0, 100%, 50%)')
  })

  it('expands 3-digit shorthand hex', async () => {
    expect(await colorConvert('#0f0')).toBe('#00ff00\trgb(0, 255, 0)\thsl(120, 100%, 50%)')
  })

  it('converts an rgb() color', async () => {
    expect(await colorConvert('rgb(0, 0, 255)')).toBe(
      '#0000ff\trgb(0, 0, 255)\thsl(240, 100%, 50%)'
    )
  })

  it('converts an hsl() color', async () => {
    expect(await colorConvert('hsl(0, 100%, 50%)')).toBe(
      '#ff0000\trgb(255, 0, 0)\thsl(0, 100%, 50%)'
    )
  })

  it('throws on an unrecognized color', async () => {
    await expect(colorConvert('notacolor')).rejects.toThrow('Unrecognized color')
  })
})
