import React from 'react'
import BaseTransformationPage from './BaseTransformationPage'
import { sortLines } from '../../transformations/lines'

interface SortLinesPageProps {
  tabId: string
}

const SortLinesPage: React.FC<SortLinesPageProps> = ({ tabId }) => {
  return (
    <BaseTransformationPage
      tabId={tabId}
      transformationName="Sort Lines"
      transformationDescription="Sort lines alphabetically"
      inputPlaceholder="Enter text with multiple lines to sort..."
      outputPlaceholder="Sorted lines will appear here..."
      transformButtonText="Sort"
      transformFunction={async (text) => sortLines(text)}
    />
  )
}

export default SortLinesPage
