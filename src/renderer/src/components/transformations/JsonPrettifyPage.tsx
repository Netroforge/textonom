import React from 'react'
import BaseTransformationPage from './BaseTransformationPage'
import { jsonPrettify } from '../../transformations/json'

interface JsonPrettifyPageProps {
  tabId: string
}

const JsonPrettifyPage: React.FC<JsonPrettifyPageProps> = ({ tabId }) => {
  return (
    <BaseTransformationPage
      tabId={tabId}
      transformationName="JSON Prettify"
      transformationDescription="Format JSON with proper indentation"
      inputPlaceholder="Enter JSON to format..."
      outputPlaceholder="Formatted JSON will appear here..."
      transformButtonText="Format"
      transformFunction={async (text) => jsonPrettify(text)}
    />
  )
}

export default JsonPrettifyPage
