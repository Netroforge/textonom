import React from 'react'
import BaseTransformationPage from './BaseTransformationPage'
import { removeEmptyLines } from '../../transformations/lines'

interface RemoveEmptyLinesPageProps {
  tabId: string
}

const RemoveEmptyLinesPage: React.FC<RemoveEmptyLinesPageProps> = ({ tabId }) => {
  return (
    <BaseTransformationPage
      tabId={tabId}
      transformationName="Remove Empty Lines"
      transformationDescription="Remove all empty lines from text"
      inputPlaceholder="Enter text with empty lines to remove..."
      outputPlaceholder="Text with empty lines removed will appear here..."
      transformButtonText="Remove Empty Lines"
      transformFunction={async (text) => removeEmptyLines(text)}
    />
  )
}

export default RemoveEmptyLinesPage
