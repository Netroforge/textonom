import React, { useState, useEffect } from 'react'
import { argon2Hash } from '../../transformations/hash'
import { useTabsContentStore } from '../../stores/tabsContentStore'
import TransformationAnimation from '../TransformationAnimation'
import './TransformationPage.css'

interface Argon2HashPageProps {
  tabId: string
}

const Argon2HashPage: React.FC<Argon2HashPageProps> = ({ tabId }): React.ReactElement => {
  const { getTabContent, saveTabContent } = useTabsContentStore()

  // Get initial state from tab content store
  const initialContent = getTabContent(tabId)

  // Reactive state
  const [inputText, setInputText] = useState(initialContent.inputText)
  const [outputText, setOutputText] = useState(initialContent.outputText)
  const [type, setType] = useState(Number(initialContent.paramValues?.type ?? 2))
  const [memoryCost, setMemoryCost] = useState(
    Number(initialContent.paramValues?.memoryCost ?? 1024)
  )
  const [timeCost, setTimeCost] = useState(Number(initialContent.paramValues?.timeCost ?? 3))
  const [parallelism, setParallelism] = useState(
    Number(initialContent.paramValues?.parallelism ?? 1)
  )
  const [isTransforming, setIsTransforming] = useState(false)

  // Apply the transformation
  const applyTransformation = async (): Promise<void> => {
    if (!inputText) return

    // Start transformation and show overlay
    setIsTransforming(true)

    try {
      // Apply the transformation
      const result = await argon2Hash(inputText, {
        type,
        memoryCost,
        timeCost,
        parallelism
      })
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
      paramValues: { type, memoryCost, timeCost, parallelism }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabId, inputText, outputText, type, memoryCost, timeCost, parallelism])

  return (
    <div className="transformation-page">
      <div className="transformation-header">
        <h1>Argon2 Hash</h1>
        <p className="transformation-description">
          Generate Argon2-like hash of text (simulated using PBKDF2 for browser compatibility)
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
              <label htmlFor="type-select">Argon2 Variant</label>
              <select
                id="type-select"
                className="parameter-input"
                value={type}
                onChange={(e) => setType(Number(e.target.value))}
                disabled={isTransforming}
              >
                <option value={0}>argon2d</option>
                <option value={1}>argon2i</option>
                <option value={2}>argon2id (recommended)</option>
              </select>
            </div>
            <div className="parameter">
              <label htmlFor="memory-cost-input">Memory Cost (KiB)</label>
              <input
                id="memory-cost-input"
                type="number"
                min="256"
                max="4096"
                step="256"
                className="parameter-input"
                value={memoryCost}
                onChange={(e) => setMemoryCost(Number(e.target.value))}
                disabled={isTransforming}
              />
            </div>
            <div className="parameter">
              <label htmlFor="time-cost-input">Time Cost (Iterations)</label>
              <input
                id="time-cost-input"
                type="number"
                min="1"
                max="10"
                className="parameter-input"
                value={timeCost}
                onChange={(e) => setTimeCost(Number(e.target.value))}
                disabled={isTransforming}
              />
            </div>
            <div className="parameter">
              <label htmlFor="parallelism-input">Parallelism</label>
              <input
                id="parallelism-input"
                type="number"
                min="1"
                max="16"
                className="parameter-input"
                value={parallelism}
                onChange={(e) => setParallelism(Number(e.target.value))}
                disabled={isTransforming}
              />
            </div>
          </div>

          <button
            className="action-button transform-button"
            disabled={isTransforming}
            onClick={applyTransformation}
          >
            Hash
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
            {isTransforming && <TransformationAnimation transformationName="Argon2 Hash" />}
            <textarea
              id="output-textarea"
              value={outputText}
              readOnly
              className="transformation-textarea"
              placeholder="Argon2 hash will appear here..."
              spellCheck="false"
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Argon2HashPage
