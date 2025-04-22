import React from 'react'
import BaseTransformationPage from './BaseTransformationPage'
import { reverseLines } from '../../transformations/lines'

interface ReverseLinesPageProps {
  tabId: string
}

const ReverseLinesPage: React.FC<ReverseLinesPageProps> = ({ tabId }) => {
  return (
    <BaseTransformationPage
      tabId={tabId}
      transformationName="Reverse Lines"
      transformationDescription="Reverse the order of lines"
      inputPlaceholder="Enter text with multiple lines to reverse..."
      outputPlaceholder="Reversed lines will appear here..."
      transformButtonText="Reverse"
      transformFunction={async (text) => reverseLines(text)}
    />
  )
}

export default ReverseLinesPage
