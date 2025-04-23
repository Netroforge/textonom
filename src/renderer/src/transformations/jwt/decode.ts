import { jwtDecode as decodeJwt } from 'jwt-decode'
import type { TransformationFunction } from '../../types'

/**
 * Decodes a JWT token and returns its contents as formatted JSON
 * @param text - The JWT token to decode
 * @returns The decoded JWT token as formatted JSON
 * @throws Error if decoding fails
 */
const jwtDecode: TransformationFunction = async (text: string): Promise<string> => {
  // Handle empty input
  if (text === '') {
    return ''
  }

  try {
    // Remove any whitespace from the token
    const token = text.trim()

    // Basic validation for JWT format (header.payload.signature)
    // Allow for base64url encoding characters (alphanumeric, '-', '_') with padding ('=')
    if (!token.match(/^[\w\-_=]+\.[\w\-_=]+\.[\w\-_=]*$/)) {
      throw new Error('Invalid JWT format. Expected format: header.payload.signature')
    }

    // Decode the token
    const decoded = decodeJwt(token)

    // Format the decoded token as JSON with 2-space indentation
    return JSON.stringify(decoded, null, 2)
  } catch (error) {
    console.error('Error decoding JWT:', error)
    if (error instanceof Error) {
      throw new Error(`Failed to decode JWT: ${error.message}`)
    } else if (typeof error === 'string') {
      throw new Error(`Failed to decode JWT: ${error}`)
    } else {
      throw new Error('Failed to decode JWT: Invalid token format')
    }
  }
}

export default jwtDecode
