import React, { useState, useEffect } from 'react'
import { argon2Hash } from '../../transformations/hash'
import { useTabsContentStore } from '../../stores/tabsContentStore'
import TransformationAnimation from '../TransformationAnimation'
import TextAreaWithLabel from '../ui/TextAreaWithLabel'
import ParameterInput from '../ui/ParameterInput'
import ParameterSelect from '../ui/ParameterSelect'
import Button from '../ui/Button'

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
    <div className="flex flex-col h-full p-4 bg-background text-text overflow-y-auto">
      <div className="mb-6 pb-4 border-b border-border">
        <h1 className="mb-2 text-[1.8rem]">Argon2 Hash</h1>
        <p className="text-text text-base">
          Generate Argon2-like hash of text (simulated using PBKDF2 for browser compatibility)
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 flex-1 min-h-0">
        <TextAreaWithLabel
          label="Input"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Enter text to hash..."
          spellCheck="false"
        />

        <div className="flex md:flex-col justify-center items-center gap-2 py-4 md:py-0 md:px-4">
          <div className="flex flex-col gap-2 mb-4 p-3 border border-border rounded bg-surface w-full">
            <ParameterSelect
              id="type-select"
              label="Argon2 Variant"
              value={type}
              onChange={(e) => setType(Number(e.target.value))}
              disabled={isTransforming}
              options={[
                { value: 0, label: 'argon2d' },
                { value: 1, label: 'argon2i' },
                { value: 2, label: 'argon2id (recommended)' }
              ]}
            />
            <ParameterInput
              id="memory-cost-input"
              label="Memory Cost (KiB)"
              type="number"
              min="256"
              max="4096"
              step="256"
              value={memoryCost}
              onChange={(e) => setMemoryCost(Number(e.target.value))}
              disabled={isTransforming}
            />
            <ParameterInput
              id="time-cost-input"
              label="Time Cost (Iterations)"
              type="number"
              min="1"
              max="10"
              value={timeCost}
              onChange={(e) => setTimeCost(Number(e.target.value))}
              disabled={isTransforming}
            />
            <ParameterInput
              id="parallelism-input"
              label="Parallelism"
              type="number"
              min="1"
              max="16"
              value={parallelism}
              onChange={(e) => setParallelism(Number(e.target.value))}
              disabled={isTransforming}
            />
          </div>

          <Button variant="primary" disabled={isTransforming} onClick={applyTransformation}>
            Hash
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
            placeholder="Argon2 hash will appear here..."
            spellCheck="false"
          />
          {isTransforming && <TransformationAnimation transformationName="Argon2 Hash" />}
        </div>
      </div>
    </div>
  )
}

export default Argon2HashPage
