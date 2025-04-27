import React, { useState, useEffect } from 'react'
import { bcryptHash } from '../../transformations/hash'
import { useTabsContentStore } from '../../stores/tabsContentStore'
import { useSettingsStore } from '../../stores/settingsStore'
import TransformationAnimation from '../TransformationAnimation'
import './TransformationPage.css'

interface BcryptHashPageProps {
  tabId: string
}

const BcryptHashPage: React.FC<BcryptHashPageProps> = ({ tabId }): React.ReactElement => {
  const { settings } = useSettingsStore()
  const { getTabContent, saveTabContent } = useTabsContentStore()

  // Get initial state from tab content store
  const initialContent = getTabContent(tabId)

  // Reactive state
  const [inputText, setInputText] = useState(initialContent.inputText)
  const [outputText, setOutputText] = useState(initialContent.outputText)
  const [rounds, setRounds] = useState(
    initialContent.paramValues?.rounds
      ? Number(initialContent.paramValues.rounds)
      : settings.bcryptRounds || 12
  )
  const [isTransforming, setIsTransforming] = useState(false)

  // Apply the transformation
  const applyTransformation = async (): Promise<void> => {
    if (!inputText) return

    // Validate rounds parameter
    if (rounds < 1 || rounds > 20) {
      setOutputText('Error: Rounds must be between 1 and 20')
      return
    }

    // Start transformation and show overlay
    setIsTransforming(true)

    try {
      // Apply the transformation
      const result = await bcryptHash(inputText, rounds)
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
      paramValues: { rounds }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabId, inputText, outputText, rounds])

  return (
    <div className="transformation-page">
      <div className="transformation-header">
        <h1>Bcrypt Hash</h1>
        <p className="transformation-description">
          Generate bcrypt hash of text (secure password hashing)
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
              <label htmlFor="rounds-input">Rounds (Cost Factor)</label>
              <input
                id="rounds-input"
                type="number"
                min="1"
                max="20"
                className="parameter-input"
                value={rounds}
                onChange={(e) => setRounds(Number(e.target.value))}
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
            {isTransforming && <TransformationAnimation transformationName="Bcrypt Hash" />}
            <textarea
              id="output-textarea"
              value={outputText}
              readOnly
              className="transformation-textarea"
              placeholder="Bcrypt hash will appear here..."
              spellCheck="false"
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BcryptHashPage
