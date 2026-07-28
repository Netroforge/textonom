import type { TransformationFunction, TransformationParamValues } from '../../types/transformation'

const atbashCipher: TransformationFunction = async (text: string): Promise<string> =>
  text.replace(/[A-Za-z]/g, (character) => {
    const base = character <= 'Z' ? 65 : 97
    return String.fromCharCode(base + 25 - (character.charCodeAt(0) - base))
  })

const parseXorKey = (params?: TransformationParamValues): Uint8Array<ArrayBuffer> => {
  const key = String(params?.key ?? '')
  if (!key) throw new Error('A non-empty XOR key is required')

  if (params?.keyEncoding === 'hex') {
    const compact = key.replace(/\s+/g, '')
    if (!/^(?:[0-9a-fA-F]{2})+$/.test(compact)) {
      throw new Error('Hex keys must contain an even number of hexadecimal digits')
    }
    return Uint8Array.from(compact.match(/.{2}/g) ?? [], (byte) => Number.parseInt(byte, 16))
  }

  return new TextEncoder().encode(key)
}

const xorBytes = (input: Uint8Array<ArrayBuffer>, key: Uint8Array<ArrayBuffer>): Uint8Array => {
  const output = new Uint8Array(input.length)
  input.forEach((value, index) => {
    output[index] = value ^ key[index % key.length]
  })
  return output
}

const xorEncrypt: TransformationFunction = async (
  text: string,
  params?: TransformationParamValues
): Promise<string> => {
  const encrypted = xorBytes(new TextEncoder().encode(text), parseXorKey(params))
  return [...encrypted].map((value) => value.toString(16).padStart(2, '0')).join('')
}

const xorDecrypt: TransformationFunction = async (
  text: string,
  params?: TransformationParamValues
): Promise<string> => {
  const compact = text.replace(/\s+/g, '')
  if (!/^(?:[0-9a-fA-F]{2})*$/.test(compact)) {
    throw new Error('Encrypted input must be hexadecimal bytes')
  }
  const encrypted = Uint8Array.from(compact.match(/.{2}/g) ?? [], (byte) =>
    Number.parseInt(byte, 16)
  )
  return new TextDecoder('utf-8', { fatal: true }).decode(xorBytes(encrypted, parseXorKey(params)))
}

export { atbashCipher, xorEncrypt, xorDecrypt }
