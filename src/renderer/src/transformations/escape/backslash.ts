import type { TransformationFunction } from '../../types/transformation'

const backslashEscape: TransformationFunction = async (text: string): Promise<string> => {
  let output = ''

  for (const character of text) {
    const codePoint = character.codePointAt(0) ?? 0
    switch (character) {
      case '\\':
        output += '\\\\'
        break
      case '"':
        output += '\\"'
        break
      case "'":
        output += "\\'"
        break
      case '\n':
        output += '\\n'
        break
      case '\r':
        output += '\\r'
        break
      case '\t':
        output += '\\t'
        break
      case '\b':
        output += '\\b'
        break
      case '\f':
        output += '\\f'
        break
      case '\v':
        output += '\\v'
        break
      case '\0':
        output += '\\0'
        break
      default:
        output +=
          codePoint < 0x20 || codePoint === 0x7f
            ? `\\u${codePoint.toString(16).padStart(4, '0')}`
            : character
    }
  }

  return output
}

const readHex = (input: string, start: number, length: number): number => {
  const value = input.slice(start, start + length)
  if (value.length !== length || !new RegExp(`^[0-9a-fA-F]{${length}}$`).test(value)) {
    throw new Error(`Invalid hexadecimal escape at position ${start - 2}`)
  }
  return Number.parseInt(value, 16)
}

const backslashUnescape: TransformationFunction = async (text: string): Promise<string> => {
  let output = ''

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index]
    if (character !== '\\') {
      output += character
      continue
    }

    if (index === text.length - 1) {
      throw new Error('Input ends with an incomplete backslash escape')
    }

    const escape = text[++index]
    const simple: Record<string, string> = {
      '\\': '\\',
      '"': '"',
      "'": "'",
      '/': '/',
      n: '\n',
      r: '\r',
      t: '\t',
      b: '\b',
      f: '\f',
      v: '\v',
      0: '\0'
    }

    if (simple[escape] !== undefined) {
      output += simple[escape]
      continue
    }

    if (escape === 'x') {
      output += String.fromCharCode(readHex(text, index + 1, 2))
      index += 2
      continue
    }

    if (escape === 'u') {
      if (text[index + 1] === '{') {
        const end = text.indexOf('}', index + 2)
        const value = end === -1 ? '' : text.slice(index + 2, end)
        if (!/^[0-9a-fA-F]{1,6}$/.test(value)) {
          throw new Error(`Invalid Unicode code point escape at position ${index - 1}`)
        }
        const codePoint = Number.parseInt(value, 16)
        if (codePoint > 0x10ffff) {
          throw new Error(`Unicode code point is out of range at position ${index - 1}`)
        }
        output += String.fromCodePoint(codePoint)
        index = end
      } else {
        output += String.fromCharCode(readHex(text, index + 1, 4))
        index += 4
      }
      continue
    }

    throw new Error(`Unknown backslash escape \\${escape} at position ${index - 1}`)
  }

  return output
}

export { backslashEscape, backslashUnescape }
