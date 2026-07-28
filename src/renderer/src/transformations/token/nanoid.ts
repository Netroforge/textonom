import type { TransformationFunction, TransformationParamValues } from '../../types/transformation'

const NANO_ID_ALPHABET = '_-0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

const nanoIdGenerate: TransformationFunction = async (
  _text: string,
  params?: TransformationParamValues
): Promise<string> => {
  const length = Math.max(1, Math.min(256, Number(params?.length ?? 21)))
  const count = Math.max(1, Math.min(1000, Number(params?.count ?? 1)))
  const ids: string[] = []

  for (let item = 0; item < count; item += 1) {
    const random = new Uint8Array(length)
    crypto.getRandomValues(random)
    let id = ''
    for (const value of random) {
      id += NANO_ID_ALPHABET[value & 63]
    }
    ids.push(id)
  }

  return ids.join('\n')
}

export default nanoIdGenerate
