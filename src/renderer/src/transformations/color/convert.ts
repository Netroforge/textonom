import type { TransformationFunction } from '../../types/transformation'

interface RGB {
  r: number
  g: number
  b: number
}

const parseHex = (input: string): RGB | null => {
  const hex = input.replace(/^#/, '').trim()
  if (/^[0-9a-fA-F]{3}$/.test(hex)) {
    return {
      r: parseInt(hex[0] + hex[0], 16),
      g: parseInt(hex[1] + hex[1], 16),
      b: parseInt(hex[2] + hex[2], 16)
    }
  }
  if (/^[0-9a-fA-F]{6}$/.test(hex)) {
    return {
      r: parseInt(hex.slice(0, 2), 16),
      g: parseInt(hex.slice(2, 4), 16),
      b: parseInt(hex.slice(4, 6), 16)
    }
  }
  return null
}

const parseRgb = (input: string): RGB | null => {
  const m = input.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*[\d.]+\s*)?\)$/i)
  if (!m) return null
  const r = Number(m[1])
  const g = Number(m[2])
  const b = Number(m[3])
  if ([r, g, b].some((v) => v < 0 || v > 255)) return null
  return { r, g, b }
}

const parseHsl = (input: string): RGB | null => {
  const m = input.match(
    /^hsla?\(\s*(-?\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)%\s*,\s*(\d+(?:\.\d+)?)%\s*(?:,\s*[\d.]+\s*)?\)$/i
  )
  if (!m) return null
  let h = Number(m[1]) % 360
  if (h < 0) h += 360
  const s = Number(m[2]) / 100
  const l = Number(m[3]) / 100
  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const mAdj = l - c / 2
  let rp = 0
  let gp = 0
  let bp = 0
  if (h < 60) [rp, gp, bp] = [c, x, 0]
  else if (h < 120) [rp, gp, bp] = [x, c, 0]
  else if (h < 180) [rp, gp, bp] = [0, c, x]
  else if (h < 240) [rp, gp, bp] = [0, x, c]
  else if (h < 300) [rp, gp, bp] = [x, 0, c]
  else [rp, gp, bp] = [c, 0, x]
  return {
    r: Math.round((rp + mAdj) * 255),
    g: Math.round((gp + mAdj) * 255),
    b: Math.round((bp + mAdj) * 255)
  }
}

const toHex = (rgb: RGB): string => {
  const h = (n: number): string => n.toString(16).padStart(2, '0')
  return `#${h(rgb.r)}${h(rgb.g)}${h(rgb.b)}`
}

const toRgbString = (rgb: RGB): string => `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`

const toHslString = (rgb: RGB): string => {
  const r = rgb.r / 255
  const g = rgb.g / 255
  const b = rgb.b / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2
  let h = 0
  let s = 0
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) * 60
        break
      case g:
        h = ((b - r) / d + 2) * 60
        break
      case b:
        h = ((r - g) / d + 4) * 60
        break
    }
  }
  return `hsl(${Math.round(h)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`
}

const colorConvert: TransformationFunction = async (text: string): Promise<string> => {
  if (text === '') return ''
  const lines = text.split('\n')
  const out: string[] = []
  for (const raw of lines) {
    const line = raw.trim()
    if (!line) {
      out.push('')
      continue
    }
    const rgb = parseHex(line) || parseRgb(line) || parseHsl(line)
    if (!rgb) {
      throw new Error(`Unrecognized color: "${line}". Use #hex, rgb(), or hsl().`)
    }
    out.push(`${toHex(rgb)}\t${toRgbString(rgb)}\t${toHslString(rgb)}`)
  }
  return out.join('\n')
}

export default colorConvert
