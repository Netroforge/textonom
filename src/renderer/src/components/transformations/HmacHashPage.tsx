import React, { useState, useEffect } from 'react'
import { hmacHash } from '../../transformations/hash'
import { useTabsContentStore } from '../../stores/tabsContentStore'
import TransformationAnimation from '../TransformationAnimation'
import './TransformationPage.css'

interface HmacHashPageProps {
  tabId: string
}

const HmacHashPage: React.FC<HmacHashPageProps> = ({ tabId }): React.ReactElement => {
  const { getTabContent, saveTabContent } = useTabsContentStore()

  // Get initial state from tab content store
  const initialContent = getTabContent(tabId)

  // Reactive state
  const [inputText, setInputText] = useState(initialContent.inputText)
  const [outputText, setOutputText] = useState(initialContent.outputText)
  const [secretKey, setSecretKey] = useState(initialContent.paramValues?.key || '')
  const [algorithm, setAlgorithm] = useState(initialContent.paramValues?.algorithm || 'SHA256')
  const [isTransforming, setIsTransforming] = useState(false)

  // Apply the transformation
  const applyTransformation = async (): Promise<void> => {
    if (!inputText) return
    if (!secretKey) {
      setOutputText('Error: Secret key is required')
      return
    }

    // Start transformation and show overlay
    setIsTransforming(true)

    try {
      // Apply the transformation
      const result = await hmacHash(inputText, { key: secretKey, algorithm })
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
      paramValues: { key: secretKey, algorithm }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabId, inputText, outputText, secretKey, algorithm])

  return (
    <div className="transformation-page">
      <div className="transformation-header">
        <h1>HMAC Hash</h1>
        <p className="transformation-description">
          Generate HMAC (Hash-based Message Authentication Code) using various algorithms
        </p>
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
              placeholder="Enter text to hash..."
              spellCheck="false"
            ></textarea>
          </div>
        </div>

        <div className="actions-container">
          <div className="parameters-container">
            <div className="parameter">
              <label htmlFor="secret-key-input">Secret Key</label>
              <input
                id="secret-key-input"
                type="text"
                className="parameter-input"
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                disabled={isTransforming}
                placeholder="Enter secret key"
              />
            </div>
            <div className="parameter">
              <label htmlFor="algorithm-select">Algorithm</label>
              <select
                id="algorithm-select"
                className="parameter-input"
                value={algorithm}
                onChange={(e) => setAlgorithm(e.target.value)}
                disabled={isTransforming}
              >
                <option value="SHA256">SHA-256</option>
                <option value="SHA512">SHA-512</option>
              </select>
            </div>
          </div>

          <button
            className="action-button transform-button"
            disabled={isTransforming}
            onClick={applyTransformation}
          >
            Generate HMAC
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
            {isTransforming && <TransformationAnimation transformationName="HMAC Hash" />}
            <textarea
              id="output-textarea"
              value={outputText}
              readOnly
              className="transformation-textarea"
              placeholder="HMAC hash will appear here..."
              spellCheck="false"
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HmacHashPage
