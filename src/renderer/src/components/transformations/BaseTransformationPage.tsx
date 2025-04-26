import React, { useState, useEffect } from 'react'
import { useAppStore } from '../../stores/appStore'
import { TransformationParamValues } from '../../types/transformation'
import TransformationAnimation from '../TransformationAnimation'
import './TransformationPage.css'

interface BaseTransformationPageProps {
  tabId: string
  transformationName: string
  transformationDescription: string
  inputPlaceholder: string
  outputPlaceholder: string
  transformButtonText: string

  transformFunction: (_text: string, _params?: TransformationParamValues) => Promise<string>
  parameters?: React.ReactNode
}

const BaseTransformationPage: React.FC<BaseTransformationPageProps> = ({
  tabId,
  transformationName,
  transformationDescription,
  inputPlaceholder,
  outputPlaceholder,
  transformButtonText,
  transformFunction,
  parameters
}): React.ReactElement => {
  const { getTabContent, saveTabContent } = useAppStore()

  // Get initial state from tab content store
  const initialContent = getTabContent(tabId)

  // Reactive state
  const [inputText, setInputText] = useState(initialContent.inputText)
  const [outputText, setOutputText] = useState(initialContent.outputText)
  const [paramValues, setParamValues] = useState<TransformationParamValues>(
    initialContent.paramValues
  )
  const [isTransforming, setIsTransforming] = useState(false)

  // Apply the transformation
  const applyTransformation = async (): Promise<void> => {
    if (!inputText) return

    // Start transformation and show overlay
    setIsTransforming(true)

    try {
      // Apply the transformation
      const result = await transformFunction(inputText, paramValues)
      setOutputText(result)

      // End transformation after a short delay to show the animation
      setTimeout(() => {
        setIsTransforming(false)
      }, 100)
    } catch (error) {
      console.error('Transformation error:', error)
      // Improve error handling with more specific error messages
      if (error instanceof Error) {
        setOutputText(`Error: ${error.message}`)
      } else if (typeof error === 'string') {
        setOutputText(`Error: ${error}`)
      } else {
        setOutputText('An unknown error occurred during transformation')
      }
      setIsTransforming(false)
    }
  }

  // Clear input
  const clearInput = (): void => {
    setInputText('')
    setOutputText('')
  }

  // Copy output to clipboard
  const copyOutput = async (): Promise<void> => {
    if (!outputText) return

    try {
      await navigator.clipboard.writeText(outputText)
      // Could add a success notification here
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
      // Handle clipboard errors more gracefully
      alert('Failed to copy to clipboard. Please try again or copy manually.')
    }
  }

  // This function is intentionally not used directly in this component
  // It's defined here for potential use in child components that extend this base component
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const updateParamValue = (name: string, value: string | number | boolean): void => {
    setParamValues((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  // Save tab state when input, output, or parameters change
  useEffect(() => {
    saveTabContent(tabId, {
      inputText,
      outputText,
      paramValues
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabId, inputText, outputText, paramValues])

  return (
    <div className="transformation-page">
      <div className="transformation-header">
        <h1>{transformationName}</h1>
        <p className="transformation-description">{transformationDescription}</p>
      </div>

      {parameters && <div className="parameters-container">{parameters}</div>}

      <div className="transformation-content">
        <div className="textarea-container">
          <label htmlFor="input-textarea">Input</label>
          <div className="textarea-wrapper">
            <textarea
              id="input-textarea"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="transformation-textarea"
              placeholder={inputPlaceholder}
              spellCheck="false"
            ></textarea>
          </div>
        </div>

        <div className="actions-container">
          <button
            className="action-button transform-button"
            disabled={isTransforming}
            onClick={applyTransformation}
          >
            {transformButtonText}
          </button>
          <button
            className="action-button clear-button"
            disabled={isTransforming || !inputText}
            onClick={clearInput}
          >
            Clear Input
          </button>
          <button
            className="action-button copy-button"
            disabled={isTransforming || !outputText}
            onClick={copyOutput}
          >
            Copy Output
          </button>
        </div>

        <div className="textarea-container">
          <label htmlFor="output-textarea">Output</label>
          <div className="textarea-wrapper">
            {/* Transformation Animation */}
            {isTransforming && <TransformationAnimation transformationName={transformationName} />}
            <textarea
              id="output-textarea"
              value={outputText}
              readOnly
              className="transformation-textarea"
              placeholder={outputPlaceholder}
              spellCheck="false"
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BaseTransformationPage
