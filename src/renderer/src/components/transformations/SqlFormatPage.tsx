import React, { useState, useEffect } from 'react'
import { sqlFormat } from '../../transformations/formatting'
import { useTabsContentStore } from '../../stores/tabsContentStore'
import TransformationAnimation from '../TransformationAnimation'
import './TransformationPage.css'

interface SqlFormatPageProps {
  tabId: string
}

const SqlFormatPage: React.FC<SqlFormatPageProps> = ({ tabId }): React.ReactElement => {
  const { getTabContent, saveTabContent } = useTabsContentStore()

  // Get initial state from tab content store
  const initialContent = getTabContent(tabId)

  // Reactive state
  const [inputText, setInputText] = useState(initialContent.inputText)
  const [outputText, setOutputText] = useState(initialContent.outputText)
  const [dialect, setDialect] = useState(initialContent.paramValues?.dialect || 'sql')
  const [indentSize, setIndentSize] = useState(Number(initialContent.paramValues?.indentSize ?? 2))
  const [uppercase, setUppercase] = useState(initialContent.paramValues?.uppercase === true)
  const [isTransforming, setIsTransforming] = useState(false)

  // Apply the transformation
  const applyTransformation = async (): Promise<void> => {
    if (!inputText) return

    // Start transformation and show overlay
    setIsTransforming(true)

    try {
      // Apply the transformation
      const result = await sqlFormat(inputText, { dialect, indentSize, uppercase })
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
      paramValues: { dialect, indentSize, uppercase }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabId, inputText, outputText, dialect, indentSize, uppercase])

  return (
    <div className="transformation-page">
      <div className="transformation-header">
        <h1>SQL Formatter</h1>
        <p className="transformation-description">
          Format SQL queries with proper indentation and syntax
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
              placeholder="Enter SQL query to format..."
              spellCheck="false"
            ></textarea>
          </div>
        </div>

        <div className="actions-container">
          <div className="parameters-container">
            <div className="parameter">
              <label htmlFor="dialect-select">SQL Dialect</label>
              <select
                id="dialect-select"
                className="parameter-input"
                value={dialect}
                onChange={(e) => setDialect(e.target.value)}
                disabled={isTransforming}
              >
                <option value="sql">Standard SQL</option>
                <option value="mysql">MySQL</option>
                <option value="postgresql">PostgreSQL</option>
                <option value="tsql">T-SQL (SQL Server)</option>
                <option value="plsql">PL/SQL (Oracle)</option>
                <option value="sqlite">SQLite</option>
                <option value="bigquery">BigQuery</option>
                <option value="redshift">Redshift</option>
                <option value="spark">Spark SQL</option>
              </select>
            </div>
            <div className="parameter">
              <label htmlFor="indent-size-input">Indent Size</label>
              <input
                id="indent-size-input"
                type="number"
                min="1"
                max="8"
                className="parameter-input"
                value={indentSize}
                onChange={(e) => setIndentSize(Number(e.target.value))}
                disabled={isTransforming}
                style={{ width: '50px' }}
              />
            </div>
            <div className="parameter">
              <label htmlFor="uppercase-checkbox" className="checkbox-label">
                <input
                  id="uppercase-checkbox"
                  type="checkbox"
                  checked={uppercase}
                  onChange={(e) => setUppercase(e.target.checked)}
                  disabled={isTransforming}
                />
                Uppercase Keywords
              </label>
            </div>
          </div>

          <button
            className="action-button transform-button"
            disabled={isTransforming}
            onClick={applyTransformation}
          >
            Format SQL
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
            {isTransforming && <TransformationAnimation transformationName="SQL Format" />}
            <textarea
              id="output-textarea"
              value={outputText}
              readOnly
              className="transformation-textarea"
              placeholder="Formatted SQL will appear here..."
              spellCheck="false"
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SqlFormatPage
