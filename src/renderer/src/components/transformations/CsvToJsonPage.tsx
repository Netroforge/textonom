import React, { useState, useEffect } from 'react'
import { csvToJson } from '../../transformations/conversion'
import { useAppStore } from '../../stores/appStore'
import TransformationAnimation from '../TransformationAnimation'
import './TransformationPage.css'

interface CsvToJsonPageProps {
  tabId: string
}

const CsvToJsonPage: React.FC<CsvToJsonPageProps> = ({ tabId }): React.ReactElement => {
  const { getTabContent, saveTabContent } = useAppStore()

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
    <div className="transformation-page">
      <div className="transformation-header">
        <h1>CSV to JSON</h1>
        <p className="transformation-description">Convert CSV data to JSON format</p>
      </div>

      <div className="transformation-content">
        <div className="textarea-container">
          <label htmlFor="input-textarea">Input</label>
          <div className="textarea-wrapper">
            <textarea
              id="input-textarea"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="transformation-textarea"
              placeholder="Enter CSV data to convert to JSON..."
              spellCheck="false"
            ></textarea>
          </div>
        </div>

        <div className="actions-container">
          <div className="parameters-container">
            <div className="parameter">
              <label htmlFor="delimiter-input">Delimiter</label>
              <input
                id="delimiter-input"
                type="text"
                className="parameter-input"
                value={delimiter}
                onChange={(e) => setDelimiter(e.target.value)}
                disabled={isTransforming}
                maxLength={1}
                style={{ width: '40px', textAlign: 'center' }}
              />
            </div>
            <div className="parameter">
              <label htmlFor="has-header-checkbox" className="checkbox-label">
                <input
                  id="has-header-checkbox"
                  type="checkbox"
                  checked={hasHeader}
                  onChange={(e) => setHasHeader(e.target.checked)}
                  disabled={isTransforming}
                />
                Has Header Row
              </label>
            </div>
          </div>

          <button
            className="action-button transform-button"
            disabled={isTransforming}
            onClick={applyTransformation}
          >
            Convert
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
            {isTransforming && <TransformationAnimation transformationName="CSV to JSON" />}
            <textarea
              id="output-textarea"
              value={outputText}
              readOnly
              className="transformation-textarea"
              placeholder="JSON output will appear here..."
              spellCheck="false"
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CsvToJsonPage
