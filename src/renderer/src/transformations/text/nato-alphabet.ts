import type { TransformationFunction } from '../../types/transformation'

const NATO: Record<string, string> = {
  A: 'Alfa',
  B: 'Bravo',
  C: 'Charlie',
  D: 'Delta',
  E: 'Echo',
  F: 'Foxtrot',
  G: 'Golf',
  H: 'Hotel',
  I: 'India',
  J: 'Juliett',
  K: 'Kilo',
  L: 'Lima',
  M: 'Mike',
  N: 'November',
  O: 'Oscar',
  P: 'Papa',
  Q: 'Quebec',
  R: 'Romeo',
  S: 'Sierra',
  T: 'Tango',
  U: 'Uniform',
  V: 'Victor',
  W: 'Whiskey',
  X: 'Xray',
  Y: 'Yankee',
  Z: 'Zulu',
  '0': 'Zero',
  '1': 'One',
  '2': 'Two',
  '3': 'Three',
  '4': 'Four',
  '5': 'Five',
  '6': 'Six',
  '7': 'Seven',
  '8': 'Eight',
  '9': 'Nine'
}

/**
 * Spells out the text using the NATO phonetic alphabet. Letters and digits are
 * converted to their code words; any other character is kept as-is.
 */
const natoAlphabet: TransformationFunction = async (text: string): Promise<string> => {
  if (text === '') {
    return ''
  }

  return Array.from(text)
    .map((char) => NATO[char.toUpperCase()] ?? char)
    .join(' ')
}

export default natoAlphabet
