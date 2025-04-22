import React from 'react'
import BaseTransformationPage from './BaseTransformationPage'
import { jsonCompact } from '../../transformations/json'

interface JsonCompactPageProps {
  tabId: string
}

const JsonCompactPage: React.FC<JsonCompactPageProps> = ({ tabId }) => {
  return (
    <BaseTransformationPage
      tabId={tabId}
      transformationName="JSON Compact"
      transformationDescription="Compact JSON by removing whitespace"
      inputPlaceholder="Enter JSON to compact..."
      outputPlaceholder="Compacted JSON will appear here..."
      transformButtonText="Compact"
      transformFunction={async (text) => jsonCompact(text)}
    />
  )
}

export default JsonCompactPage
