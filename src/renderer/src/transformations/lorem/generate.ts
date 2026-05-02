import type { TransformationFunction } from '../../types/transformation'
import { TransformationParamValues } from '../../types/transformation'

const WORDS = [
  'lorem',
  'ipsum',
  'dolor',
  'sit',
  'amet',
  'consectetur',
  'adipiscing',
  'elit',
  'sed',
  'do',
  'eiusmod',
  'tempor',
  'incididunt',
  'ut',
  'labore',
  'et',
  'dolore',
  'magna',
  'aliqua',
  'enim',
  'ad',
  'minim',
  'veniam',
  'quis',
  'nostrud',
  'exercitation',
  'ullamco',
  'laboris',
  'nisi',
  'aliquip',
  'ex',
  'ea',
  'commodo',
  'consequat',
  'duis',
  'aute',
  'irure',
  'in',
  'reprehenderit',
  'voluptate',
  'velit',
  'esse',
  'cillum',
  'fugiat',
  'nulla',
  'pariatur',
  'excepteur',
  'sint',
  'occaecat',
  'cupidatat',
  'non',
  'proident',
  'sunt',
  'culpa',
  'qui',
  'officia',
  'deserunt',
  'mollit',
  'anim',
  'id',
  'est',
  'laborum'
]

const pick = (): string => WORDS[Math.floor(Math.random() * WORDS.length)]

const sentence = (): string => {
  const wordCount = 6 + Math.floor(Math.random() * 12)
  const words: string[] = []
  for (let i = 0; i < wordCount; i++) words.push(pick())
  words[0] = words[0][0].toUpperCase() + words[0].slice(1)
  return words.join(' ') + '.'
}

const paragraph = (): string => {
  const sentenceCount = 3 + Math.floor(Math.random() * 5)
  const sentences: string[] = []
  for (let i = 0; i < sentenceCount; i++) sentences.push(sentence())
  return sentences.join(' ')
}

const loremGenerate: TransformationFunction = async (
  _text: string,
  params?: TransformationParamValues
): Promise<string> => {
  const unit = String(params?.unit ?? 'paragraphs')
  const count = Math.max(1, Math.min(100, Number(params?.count ?? 3)))

  if (unit === 'words') {
    const words: string[] = []
    for (let i = 0; i < count; i++) words.push(pick())
    if (words.length > 0) words[0] = words[0][0].toUpperCase() + words[0].slice(1)
    return words.join(' ')
  }
  if (unit === 'sentences') {
    const sentences: string[] = []
    for (let i = 0; i < count; i++) sentences.push(sentence())
    return sentences.join(' ')
  }
  const paragraphs: string[] = []
  for (let i = 0; i < count; i++) paragraphs.push(paragraph())
  return paragraphs.join('\n\n')
}

export default loremGenerate
