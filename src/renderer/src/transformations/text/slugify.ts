import type { TransformationFunction } from '../../types/transformation'

const slugify: TransformationFunction = async (text: string): Promise<string> => {
  if (text === '') return ''
  return text
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/[\s-]+/g, '-')
}

export default slugify
