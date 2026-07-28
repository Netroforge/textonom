import type { TransformationFunction } from '../../types/transformation'

const DISPLAY_NAMES: Record<string, string> = {
  ' ': 'SPACE',
  '\n': 'LINE FEED',
  '\r': 'CARRIAGE RETURN',
  '\t': 'TAB',
  '\0': 'NULL'
}

const stringInspector: TransformationFunction = async (text: string): Promise<string> => {
  const rows = ['Index\tCharacter\tCode point\tUTF-8 bytes\tEscape']
  let offset = 0

  for (const character of text) {
    const codePoint = character.codePointAt(0) ?? 0
    const bytes = [...new TextEncoder().encode(character)]
      .map((byte) => byte.toString(16).padStart(2, '0').toUpperCase())
      .join(' ')
    const label = DISPLAY_NAMES[character] ?? character
    const escape =
      codePoint <= 0xffff
        ? `\\u${codePoint.toString(16).padStart(4, '0').toUpperCase()}`
        : `\\u{${codePoint.toString(16).toUpperCase()}}`

    rows.push(
      `${offset}\t${label}\tU+${codePoint.toString(16).padStart(4, '0').toUpperCase()}\t${bytes}\t${escape}`
    )
    offset += character.length
  }

  return rows.join('\n')
}

export default stringInspector
