import type { TransformationFunction, TransformationParamValues } from '../../types/transformation'
import { loadImage } from './browser-image'

const supportedFormats = new Set(['image/png', 'image/jpeg', 'image/webp'])

const calculateImageDimensions = (
  sourceWidth: number,
  sourceHeight: number,
  maxWidth: number,
  maxHeight: number
): { width: number; height: number } => {
  if (sourceWidth <= 0 || sourceHeight <= 0) {
    throw new Error('Image dimensions must be positive')
  }
  const boundedWidth = Math.max(1, Math.min(16384, maxWidth))
  const boundedHeight = Math.max(1, Math.min(16384, maxHeight))
  const scale = Math.min(1, boundedWidth / sourceWidth, boundedHeight / sourceHeight)
  return {
    width: Math.max(1, Math.round(sourceWidth * scale)),
    height: Math.max(1, Math.round(sourceHeight * scale))
  }
}

const imageConvertCompress: TransformationFunction = async (
  text: string,
  params?: TransformationParamValues
): Promise<string> => {
  if (text.trim() === '') return ''
  if (!/^data:image\//i.test(text.trim())) {
    throw new Error('Input must be an image data URI')
  }

  const format = String(params?.format ?? 'image/webp').toLowerCase()
  if (!supportedFormats.has(format)) {
    throw new Error('Output format must be image/png, image/jpeg, or image/webp')
  }

  const image = await loadImage(text.trim())
  const sourceWidth = image.naturalWidth || image.width
  const sourceHeight = image.naturalHeight || image.height
  const maxWidth = Math.max(1, Math.min(16384, Number(params?.maxWidth ?? sourceWidth)))
  const maxHeight = Math.max(1, Math.min(16384, Number(params?.maxHeight ?? sourceHeight)))
  const { width, height } = calculateImageDimensions(sourceWidth, sourceHeight, maxWidth, maxHeight)

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext('2d')
  if (!context) throw new Error('Canvas is unavailable')
  context.imageSmoothingEnabled = true
  context.imageSmoothingQuality = 'high'
  context.drawImage(image, 0, 0, width, height)

  const quality = Math.max(0.05, Math.min(1, Number(params?.quality ?? 0.82)))
  return canvas.toDataURL(format, quality)
}

export { calculateImageDimensions }
export default imageConvertCompress
