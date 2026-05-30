import type { TransformationFunction } from '../../types/transformation'
import { TransformationParamValues } from '../../types/transformation'

const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz'
const NUMBERS = '0123456789'
const SYMBOLS = '!@#$%^&*()-_=+[]{};:,.<>?'

/**
 * Generates a random token / password from the selected character classes
 * using a cryptographically secure source.
 * @param params.length - Token length (default: 32)
 * @param params.uppercase - Include A-Z (default: true)
 * @param params.lowercase - Include a-z (default: true)
 * @param params.numbers - Include 0-9 (default: true)
 * @param params.symbols - Include symbols (default: false)
 */
const tokenGenerate: TransformationFunction = async (
  _text: string,
  params?: TransformationParamValues
): Promise<string> => {
  const length = Math.max(1, Math.min(1024, Number(params?.length ?? 32)))

  let pool = ''
  if (params?.uppercase !== false) pool += UPPERCASE
  if (params?.lowercase !== false) pool += LOWERCASE
  if (params?.numbers !== false) pool += NUMBERS
  if (params?.symbols === true) pool += SYMBOLS

  if (pool === '') {
    throw new Error('At least one character set must be enabled')
  }

  const randomValues = new Uint32Array(length)
  crypto.getRandomValues(randomValues)

  let token = ''
  for (let i = 0; i < length; i++) {
    token += pool[randomValues[i] % pool.length]
  }
  return token
}

export default tokenGenerate
