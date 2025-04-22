import React from 'react'
import BaseTransformationPage from './BaseTransformationPage'
import { deduplicateLines } from '../../transformations/lines'

interface DeduplicateLinesPageProps {
  tabId: string
}

const DeduplicateLinesPage: React.FC<DeduplicateLinesPageProps> = ({ tabId }) => {
  return (
    <BaseTransformationPage
      tabId={tabId}
      transformationName="Deduplicate Lines"
      transformationDescription="Remove duplicate lines"
      inputPlaceholder="Enter text with duplicate lines to remove..."
      outputPlaceholder="Deduplicated lines will appear here..."
      transformButtonText="Deduplicate"
      transformFunction={async (text) => deduplicateLines(text)}
    />
  )
}

export default DeduplicateLinesPage
