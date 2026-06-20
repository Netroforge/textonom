import type { TransformationFunction } from '../types/transformation'

export const base64ToImage: TransformationFunction = async (text: string) => {
  if (!text) return ''
  const stripped = text.replace(/^data:image\/\w+;base64,/, '')
  try {
    atob(stripped)
    return text.startsWith('data:') ? text : `data:image/png;base64,${stripped}`
  } catch {
    throw new Error('Invalid Base64 input')
  }
}

export const imageToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsDataURL(file)
  })
}
