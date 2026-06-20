import type { TransformationFunction } from '../types/transformation'

const EMAIL_RE = /[\w.!#$%&'*+/=?^`{|}~-]+@[\w.-]+\.\w{2,}/g
const URL_RE = /https?:\/\/[^\s<>"']+|(?:www\.)[^\s<>"']+/g
const IP_RE = /\b(?:\d{1,3}\.){3}\d{1,3}\b/g
const NUMBER_RE = /\b\d+(?:\.\d+)?\b/g

export const extractEmails: TransformationFunction = async (text: string) => {
  if (!text) return ''
  const matches = text.match(EMAIL_RE)
  return matches ? matches.join('\n') : ''
}

export const extractUrls: TransformationFunction = async (text: string) => {
  if (!text) return ''
  const matches = text.match(URL_RE)
  return matches ? matches.join('\n') : ''
}

export const extractIps: TransformationFunction = async (text: string) => {
  if (!text) return ''
  const matches = text.match(IP_RE)
  return matches
    ? matches.filter((ip) => ip.split('.').every((o) => Number(o) <= 255)).join('\n')
    : ''
}

export const extractNumbers: TransformationFunction = async (text: string) => {
  if (!text) return ''
  const matches = text.match(NUMBER_RE)
  return matches ? matches.join('\n') : ''
}
