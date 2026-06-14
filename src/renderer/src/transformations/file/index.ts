// File Transformation System
import type { TransformationFunction } from '../../types/transformation'

export interface FileTransformOptions {
  transformationId: string
  parameters?: Record<string, string | number | boolean>
  encoding?: string
}

export interface FileTransformResult {
  fileName: string
  success: boolean
  output?: string
  error?: string
}

// Read file as text
export const readFileAsText = (file: File, encoding: string = 'utf-8'): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target?.result as string)
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsText(file, encoding)
  })
}

// Process a single file with a transformation
export const processFile = async (
  file: File,
  options: FileTransformOptions,
  transformations: Record<string, TransformationFunction>
): Promise<FileTransformResult> => {
  try {
    const text = await readFileAsText(file, options.encoding)

    const transformationFn = transformations[options.transformationId]
    if (!transformationFn) {
      throw new Error(`Transformation "${options.transformationId}" not found`)
    }

    const output = await transformationFn(text, options.parameters ?? {})

    return {
      fileName: file.name,
      success: true,
      output
    }
  } catch (error) {
    return {
      fileName: file.name,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Process multiple files
export const processFiles = async (
  files: File[],
  options: FileTransformOptions,
  transformations: Record<string, TransformationFunction>,
  onProgress?: (completed: number, total: number, currentFile: string) => void
): Promise<FileTransformResult[]> => {
  const results: FileTransformResult[] = []

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    onProgress?.(i, files.length, file.name)

    const result = await processFile(file, options, transformations)
    results.push(result)
  }

  onProgress?.(files.length, files.length, '')
  return results
}

// Download multiple files as a zip (simplified - just downloads each)
export const downloadResults = (
  results: FileTransformResult[],
  suffix: string = '_transformed'
): void => {
  results
    .filter((r) => r.success && r.output)
    .forEach((result) => {
      const blob = new Blob([result.output!], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      const nameParts = result.fileName.split('.')
      const ext = nameParts.length > 1 ? '.' + nameParts.pop() : '.txt'
      const baseName = nameParts.join('.')
      a.download = `${baseName}${suffix}${ext}`
      a.click()
      URL.revokeObjectURL(url)
    })
}

// Create a combined output file
export const createCombinedOutput = (
  results: FileTransformResult[],
  separator: string = '\n---\n'
): string => {
  return results
    .filter((r) => r.success && r.output)
    .map((r) => `// ${r.fileName}\n${r.output}`)
    .join(separator)
}

// Validate file types
export const validateFiles = (
  files: File[],
  allowedExtensions?: string[]
): { valid: File[]; invalid: { file: File; reason: string }[] } => {
  if (!allowedExtensions || allowedExtensions.length === 0) {
    return { valid: Array.from(files), invalid: [] }
  }

  const valid: File[] = []
  const invalid: { file: File; reason: string }[] = []

  for (const file of files) {
    const ext = '.' + file.name.split('.').pop()?.toLowerCase()
    if (allowedExtensions.includes(ext)) {
      valid.push(file)
    } else {
      invalid.push({
        file,
        reason: `File extension ${ext} not allowed. Allowed: ${allowedExtensions.join(', ')}`
      })
    }
  }

  return { valid, invalid }
}

// Get available transformations for file processing (exclude generators, etc)
export const getFileProcessableTransformations = (
  allTransformations: Record<string, TransformationFunction>
): Array<{ id: string; name: string }> => {
  return Object.entries(allTransformations)
    .filter(
      ([id]) =>
        !id.startsWith('custom_') &&
        ![
          'uuidGenerate',
          'ulidGenerate',
          'tokenGenerate',
          'loremGenerate',
          'pipelineTransform',
          'customTransformationBuilder'
        ].includes(id)
    )
    .map(([id]) => ({ id, name: id }))
}
