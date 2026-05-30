import CryptoJS from 'crypto-js'

export const aesEncrypt = async (
  text: string,
  params?: Record<string, string | number | boolean>
): Promise<string> => {
  if (!text) return ''
  const key = params?.key as string | undefined
  if (!key) throw new Error('Encryption key is required')
  const outputFormat = (params?.output as string) || 'base64'

  const encrypted = CryptoJS.AES.encrypt(text, key)
  if (outputFormat === 'hex') {
    return encrypted.ciphertext.toString(CryptoJS.enc.Hex)
  }
  return encrypted.toString()
}

export const aesDecrypt = async (
  text: string,
  params?: Record<string, string | number | boolean>
): Promise<string> => {
  if (!text) return ''
  const key = params?.key as string | undefined
  if (!key) throw new Error('Decryption key is required')

  try {
    const decrypted = CryptoJS.AES.decrypt(text, key)
    const result = decrypted.toString(CryptoJS.enc.Utf8)
    if (!result) throw new Error('Decryption failed. Wrong key or invalid data.')
    return result
  } catch (error) {
    if (error instanceof Error) throw error
    throw new Error('Decryption failed. Wrong key or invalid data.')
  }
}
