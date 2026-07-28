import jsQR from 'jsqr'
import QRCode from 'qrcode'
import type { TransformationFunction, TransformationParamValues } from '../../types/transformation'
import { imageData, loadImage } from './browser-image'

const decodeQrPixels = (data: Uint8ClampedArray, width: number, height: number): string => {
  const result = jsQR(data, width, height, {
    inversionAttempts: 'attemptBoth'
  })
  if (!result) throw new Error('No QR code was found in the image')
  return result.data
}

const qrGenerate: TransformationFunction = async (
  text: string,
  params?: TransformationParamValues
): Promise<string> => {
  if (text === '') return ''

  const errorCorrectionLevel = String(params?.errorCorrectionLevel ?? 'M').toUpperCase()
  if (!['L', 'M', 'Q', 'H'].includes(errorCorrectionLevel)) {
    throw new Error('Error correction level must be L, M, Q, or H')
  }

  return QRCode.toDataURL(text, {
    errorCorrectionLevel: errorCorrectionLevel as 'L' | 'M' | 'Q' | 'H',
    margin: Math.max(0, Math.min(20, Number(params?.margin ?? 4))),
    width: Math.max(128, Math.min(2048, Number(params?.size ?? 384)))
  })
}

const qrDecode: TransformationFunction = async (text: string): Promise<string> => {
  if (text.trim() === '') return ''
  if (!/^data:image\//i.test(text.trim())) {
    throw new Error('Input must be an image data URI')
  }

  const image = await loadImage(text.trim())
  const pixels = imageData(image)
  return decodeQrPixels(pixels.data, pixels.width, pixels.height)
}

export { decodeQrPixels, qrDecode, qrGenerate }
