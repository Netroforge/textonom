import type { TransformationFunction } from '../../types/transformation'

export interface PipelineStep {
  transformationId: string
  name: string
  parameters?: Record<string, string | number | boolean>
  enabled: boolean
}

export interface PipelineConfig {
  steps: PipelineStep[]
}

async function executeStep(
  transformationFn: TransformationFunction,
  input: string,
  params: Record<string, string | number | boolean>
): Promise<string> {
  return transformationFn(input, params)
}

export const pipelineTransform = async (
  text: string,
  params?: Record<string, string | number | boolean>
): Promise<string> => {
  if (!text) return ''

  const pipelineConfig = params?.pipeline as PipelineConfig | undefined
  if (!pipelineConfig || !pipelineConfig.steps || pipelineConfig.steps.length === 0) {
    throw new Error('No pipeline steps configured')
  }

  let currentText = text
  const enabledSteps = pipelineConfig.steps.filter((step) => step.enabled)

  for (const step of enabledSteps) {
    // Import the transformation function dynamically
    const transformationsModule = await import('../index')
    const transformationFn = transformationsModule[step.transformationId]

    if (!transformationFn) {
      throw new Error(`Transformation "${step.name}" (${step.transformationId}) not found`)
    }

    try {
      currentText = await executeStep(
        transformationFn as TransformationFunction,
        currentText,
        step.parameters ?? {}
      )
    } catch (error) {
      throw new Error(
        `Step "${step.name}" failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  return currentText
}

export const pipelinePreview = async (
  text: string,
  params?: Record<string, string | number | boolean>
): Promise<string> => {
  if (!text) return 'Enter text to preview pipeline output...'

  const pipelineConfig = params?.pipeline as PipelineConfig | undefined
  if (!pipelineConfig || !pipelineConfig.steps || pipelineConfig.steps.length === 0) {
    return 'No pipeline steps configured. Add steps to see preview.'
  }

  let currentText = text
  const enabledSteps = pipelineConfig.steps.filter((step) => step.enabled)
  const logs: string[] = []

  if (enabledSteps.length === 0) {
    return 'All steps are disabled. Enable at least one step to see preview.'
  }

  logs.push(`Input: ${text.length > 100 ? text.substring(0, 100) + '...' : text}`)
  logs.push('')

  for (const step of enabledSteps) {
    const transformationsModule = await import('../index')
    const transformationFn = transformationsModule[step.transformationId]

    if (!transformationFn) {
      logs.push(`⚠ Step "${step.name}" (${step.transformationId}): NOT FOUND`)
      continue
    }

    try {
      const beforeLength = currentText.length
      currentText = await executeStep(
        transformationFn as TransformationFunction,
        currentText,
        step.parameters ?? {}
      )
      const afterLength = currentText.length
      const diff = afterLength - beforeLength
      const diffStr = diff >= 0 ? `+${diff}` : `${diff}`
      logs.push(
        `✓ ${step.name} (${step.transformationId}): ${beforeLength} → ${afterLength} chars (${diffStr})`
      )
      logs.push(
        `  Output preview: ${currentText.length > 80 ? currentText.substring(0, 80) + '...' : currentText}`
      )
    } catch (error) {
      logs.push(
        `✗ ${step.name} (${step.transformationId}): ERROR - ${error instanceof Error ? error.message : 'Unknown error'}`
      )
      // Continue with previous output
    }
    logs.push('')
  }

  logs.push(`Final output (${currentText.length} chars):`)
  logs.push(currentText.length > 500 ? currentText.substring(0, 500) + '...' : currentText)

  return logs.join('\n')
}

// Helper to get all available transformations for the step selector
export const getAvailableTransformations = async (): Promise<
  Array<{ id: string; name: string; category: string }>
> => {
  const { getAllTransformations } = await import('../registry')
  const registryTransforms = getAllTransformations()
  const allTransformations: Array<{ id: string; name: string; category: string }> = []

  for (const trans of registryTransforms) {
    if (trans.id !== 'pipelineTransform') {
      allTransformations.push({
        id: trans.id,
        name: trans.name,
        category: trans.category
      })
    }
  }

  return allTransformations.sort((a, b) => a.name.localeCompare(b.name))
}
