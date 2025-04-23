import React, { useState, useEffect } from 'react'
import { useTabsContentStore } from '../../stores/tabsContentStore'
import { TransformationParamValues } from '../../types/transformation'
import TransformationAnimation from '../TransformationAnimation'
import TextAreaWithLabel from '../ui/TextAreaWithLabel'
import Button from '../ui/Button'

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
  const { getTabContent, saveTabContent } = useTabsContentStore()

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
    <div className="flex flex-col h-full p-4 bg-[#0a0a16] text-[#00ffff] overflow-y-auto">
      <div className="mb-6 pb-4 border-b border-[#ff00ff]">
        <h1 className="mb-2 text-[1.8rem] text-[#00ffff] font-normal">{transformationName}</h1>
        <p className="text-[#00ffff] text-base font-normal">{transformationDescription}</p>
      </div>

      {parameters && (
        <div className="flex flex-col gap-2 mb-4 p-3 border border-[#ff00ff] rounded bg-[#1a1a2e]">
          {parameters}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 flex-1 min-h-0">
        {/* Input column - takes 5/12 of the space on medium screens and up */}
        <div className="md:col-span-5 flex flex-col min-h-0">
          <TextAreaWithLabel
            label="Input"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={inputPlaceholder}
            spellCheck="false"
            className="h-full"
          />
        </div>

        {/* Middle column with buttons - takes 2/12 of the space on medium screens and up */}
        <div className="md:col-span-2 flex flex-row md:flex-col justify-center items-center gap-4 py-2">
          <Button
            variant="primary"
            className="bg-[#ff00ff] hover:bg-[#cc00cc] text-black border-[#ff00ff] w-full"
            disabled={isTransforming}
            onClick={applyTransformation}
          >
            {transformButtonText}
          </Button>
          <Button
            variant="secondary"
            className="bg-[#1a1a2e] text-[#00ffff] border-[#ff00ff] hover:bg-[#2a2a4e] w-full"
            disabled={isTransforming || !inputText}
            onClick={clearInput}
          >
            Clear Input
          </Button>
          <Button
            variant="primary"
            className="bg-[#00ffff] hover:bg-[#00cccc] text-black border-[#00ffff] w-full"
            disabled={isTransforming || !outputText}
            onClick={copyOutput}
          >
            Copy Output
          </Button>
        </div>

        {/* Output column - takes 5/12 of the space on medium screens and up */}
        <div className="md:col-span-5 flex flex-col min-h-0">
          <TextAreaWithLabel
            label="Output"
            value={outputText}
            readOnly
            placeholder={outputPlaceholder}
            spellCheck="false"
            className="h-full"
          >
            {isTransforming && <TransformationAnimation transformationName={transformationName} />}
          </TextAreaWithLabel>
        </div>
      </div>
    </div>
  )
}

export default BaseTransformationPage
