import React from 'react'
import BaseTransformationPage from './BaseTransformationPage'
import { toCamelCase } from '../../transformations/case'

interface ToCamelCasePageProps {
  tabId: string
}

const ToCamelCasePage: React.FC<ToCamelCasePageProps> = ({ tabId }) => {
  return (
    <BaseTransformationPage
      tabId={tabId}
      transformationName="To camelCase"
      transformationDescription="Convert text to camelCase (no spaces, first word lowercase, others capitalized)"
      inputPlaceholder="Enter text to convert to camelCase..."
      outputPlaceholder="Text in camelCase will appear here..."
      transformButtonText="Convert"
      transformFunction={async (text) => toCamelCase(text)}
    />
  )
}

export default ToCamelCasePage
