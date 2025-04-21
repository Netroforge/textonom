// Transformation types and interfaces

// Transformation function type
export type TransformationFunction = (text: string, ...args: unknown[]) => Promise<string>

// Parameter definition for transformations
export interface TransformationParameter {
  name: string
  type: 'number' | 'string' | 'boolean'
  description: string
  default?: number | string | boolean
  min?: number
  max?: number
}

// Transformation metadata interface
export interface TransformationMetadata {
  id: string
  name: string
  description: string
  category: string
  parameters?: TransformationParameter[]
}

// Complete transformation interface
export interface Transformation extends TransformationMetadata {
  fn: TransformationFunction
}

// Category interface
export interface TransformationCategory {
  id: string
  name: string
  description: string
  transformations: Transformation[]
}

// Parameter values type for transformation pages
export type TransformationParamValues = Record<string, string | number | boolean>
