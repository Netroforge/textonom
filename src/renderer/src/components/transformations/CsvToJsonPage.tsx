import React, { useState, useEffect } from 'react'
import { csvToJson } from '../../transformations/conversion'
import { useTabsContentStore } from '../../stores/tabsContentStore'
import TransformationAnimation from '../TransformationAnimation'
import TextAreaWithLabel from '../ui/TextAreaWithLabel'
import ParameterInput from '../ui/ParameterInput'
import ParameterCheckbox from '../ui/ParameterCheckbox'
import Button from '../ui/Button'

interface CsvToJsonPageProps {
  tabId: string
}

const CsvToJsonPage: React.FC<CsvToJsonPageProps> = ({ tabId }): React.ReactElement => {
  const { getTabContent, saveTabContent } = useTabsContentStore()

  // Get initial state from tab content store
  const initialContent = getTabContent(tabId)

  // Reactive state
  const [inputText, setInputText] = useState(initialContent.inputText)
  const [outputText, setOutputText] = useState(initialContent.outputText)
  const [delimiter, setDelimiter] = useState(initialContent.paramValues?.delimiter || ',')
  const [hasHeader, setHasHeader] = useState(
    initialContent.paramValues?.hasHeader !== false // Default to true
  )
  const [isTransforming, setIsTransforming] = useState(false)

  // Apply the transformation
  const applyTransformation = async (): Promise<void> => {
    if (!inputText) return

    // Start transformation and show overlay
    setIsTransforming(true)

    try {
      // Apply the transformation
      const result = await csvToJson(inputText, { delimiter, hasHeader })
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
      paramValues: { delimiter, hasHeader }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabId, inputText, outputText, delimiter, hasHeader])

  return (
    <div className="flex flex-col h-full p-4 bg-background text-text overflow-y-auto">
      <div className="mb-6 pb-4 border-b border-border">
        <h1 className="mb-2 text-[1.8rem]">CSV to JSON</h1>
        <p className="text-text text-base">Convert CSV data to JSON format</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 flex-1 min-h-0">
        <TextAreaWithLabel
          label="Input"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Enter CSV data to convert to JSON..."
          spellCheck="false"
        />

        <div className="flex md:flex-col justify-center items-center gap-2 py-4 md:py-0 md:px-4">
          <div className="flex flex-col gap-2 mb-4 p-3 border border-border rounded bg-surface w-full">
            <ParameterInput
              id="delimiter-input"
              label="Delimiter"
              type="text"
              value={delimiter}
              onChange={(e) => setDelimiter(e.target.value)}
              disabled={isTransforming}
              maxLength={1}
              className="w-16 text-center"
            />
            <ParameterCheckbox
              id="has-header-checkbox"
              label="Has Header Row"
              checked={hasHeader}
              onChange={(e) => setHasHeader(e.target.checked)}
              disabled={isTransforming}
            />
          </div>

          <Button variant="primary" disabled={isTransforming} onClick={applyTransformation}>
            Convert
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
            placeholder="JSON will appear here..."
            spellCheck="false"
          />
          {isTransforming && <TransformationAnimation transformationName="CSV to JSON" />}
        </div>
      </div>
    </div>
  )
}

export default CsvToJsonPage
