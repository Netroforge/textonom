// Custom Transformation System
import type { TransformationParameter, Transformation } from '../../types/transformation'

export interface CustomTransformation {
  id: string
  name: string
  description: string
  category: string
  parameters: TransformationParameter[]
  code: string // JavaScript function code
  createdAt: string
  updatedAt: string
}

const CUSTOM_TRANSFORMATIONS_KEY = 'customTransformations'

// Get stored custom transformations
export const getCustomTransformations = (): CustomTransformation[] => {
  try {
    const stored = localStorage.getItem(CUSTOM_TRANSFORMATIONS_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch {
    // Ignore parse errors
  }
  return []
}

// Save custom transformations
export const saveCustomTransformations = (transformations: CustomTransformation[]): void => {
  localStorage.setItem(CUSTOM_TRANSFORMATIONS_KEY, JSON.stringify(transformations, null, 2))
}

// Add a custom transformation
export const addCustomTransformation = (transformation: CustomTransformation): void => {
  const existing = getCustomTransformations()
  existing.push(transformation)
  saveCustomTransformations(existing)
}

// Update a custom transformation
export const updateCustomTransformation = (
  id: string,
  updates: Partial<CustomTransformation>
): void => {
  const existing = getCustomTransformations()
  const index = existing.findIndex((t) => t.id === id)
  if (index >= 0) {
    existing[index] = { ...existing[index], ...updates, updatedAt: new Date().toISOString() }
    saveCustomTransformations(existing)
  }
}

// Delete a custom transformation
export const deleteCustomTransformation = (id: string): void => {
  const existing = getCustomTransformations()
  const filtered = existing.filter((t) => t.id !== id)
  saveCustomTransformations(filtered)
}

// Execute a custom transformation
export const executeCustomTransformation = async (
  text: string,
  customTransform: CustomTransformation,
  params: Record<string, string | number | boolean>
): Promise<string> => {
  try {
    // Create a function from the user's code
    // The code should define a function that takes (text, params) and returns string
    const func = new Function(
      'text',
      'params',
      customTransform.code + '\nreturn transform(text, params);'
    )
    return await func(text, params)
  } catch (error) {
    throw new Error(
      `Custom transformation error: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}

// Generate a unique ID for custom transformations
export const generateCustomId = (): string => {
  return `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Validate custom transformation code
export const validateCustomCode = (code: string): { valid: boolean; error?: string } => {
  try {
    // Check if code can be parsed as a function
    new Function('text', 'params', code + '\nreturn transform(text, params);')
    return { valid: true }
  } catch (error) {
    return { valid: false, error: error instanceof Error ? error.message : 'Invalid code' }
  }
}

// Create a transformation object for the registry from custom transformation
export const createCustomTransformationMetadata = (
  custom: CustomTransformation
): Transformation => {
  return {
    id: custom.id,
    name: custom.name,
    description: custom.description,
    category: custom.category,
    parameters: custom.parameters,
    fn: async (text: string, params: Record<string, string | number | boolean>) => {
      return executeCustomTransformation(text, custom, params)
    }
  }
}
