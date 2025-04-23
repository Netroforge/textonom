import React, { useState, useEffect } from 'react'
import { jsFormat } from '../../transformations/formatting'
import { useTabsContentStore } from '../../stores/tabsContentStore'
import TransformationAnimation from '../TransformationAnimation'
import TextAreaWithLabel from '../ui/TextAreaWithLabel'
import ParameterInput from '../ui/ParameterInput'
import Button from '../ui/Button'

interface JsFormatPageProps {
  tabId: string
}

const JsFormatPage: React.FC<JsFormatPageProps> = ({ tabId }): React.ReactElement => {
  const { getTabContent, saveTabContent } = useTabsContentStore()

  // Get initial state from tab content store
  const initialContent = getTabContent(tabId)

  // Reactive state
  const [inputText, setInputText] = useState(initialContent.inputText)
  const [outputText, setOutputText] = useState(initialContent.outputText)
  const [indentSize, setIndentSize] = useState(Number(initialContent.paramValues?.indentSize ?? 2))
  const [isTransforming, setIsTransforming] = useState(false)

  // Apply the transformation
  const applyTransformation = async (): Promise<void> => {
    if (!inputText) return

    // Start transformation and show overlay
    setIsTransforming(true)

    try {
      // Apply the transformation
      const result = await jsFormat(inputText, { indentSize })
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

  // Save tab state when input, output, or parameters change
  useEffect(() => {
    saveTabContent(tabId, {
      inputText,
      outputText,
      paramValues: { indentSize }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabId, inputText, outputText, indentSize])

  return (
    <div className="flex flex-col h-full p-4 bg-background text-text overflow-y-auto">
      <div className="mb-6 pb-4 border-b border-border">
        <h1 className="mb-2 text-[1.8rem]">JavaScript Formatter</h1>
        <p className="text-text text-base">Format JavaScript code with proper indentation</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 flex-1 min-h-0">
        <TextAreaWithLabel
          label="Input"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Enter JavaScript code to format..."
          spellCheck="false"
        />

        <div className="flex md:flex-col justify-center items-center gap-2 py-4 md:py-0 md:px-4">
          <div className="flex flex-col gap-2 mb-4 p-3 border border-border rounded bg-surface w-full">
            <ParameterInput
              id="indent-size-input"
              label="Indent Size"
              type="number"
              min="1"
              max="8"
              value={indentSize}
              onChange={(e) => setIndentSize(Number(e.target.value))}
              disabled={isTransforming}
            />
          </div>

          <Button variant="primary" disabled={isTransforming} onClick={applyTransformation}>
            Format JavaScript
          </Button>
          <Button variant="secondary" disabled={isTransforming || !inputText} onClick={clearInput}>
            Clear Input
          </Button>
          <Button
            variant="primary"
            className="bg-info hover:bg-info-dark"
            disabled={isTransforming || !outputText}
            onClick={copyOutput}
          >
            Copy Output
          </Button>
        </div>

        <div className="relative flex-1 flex flex-col">
          <TextAreaWithLabel
            label="Output"
            value={outputText}
            readOnly
            placeholder="Formatted JavaScript will appear here..."
            spellCheck="false"
          />
          {isTransforming && <TransformationAnimation transformationName="JavaScript Format" />}
        </div>
      </div>
    </div>
  )
}

export default JsFormatPage
