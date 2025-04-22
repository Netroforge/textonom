import React from 'react'
import BaseTransformationPage from './BaseTransformationPage'
import { toTitleCase } from '../../transformations/case'

interface ToTitleCasePageProps {
  tabId: string
}

const ToTitleCasePage: React.FC<ToTitleCasePageProps> = ({ tabId }) => {
  return (
    <BaseTransformationPage
      tabId={tabId}
      transformationName="To Title Case"
      transformationDescription="Convert text to title case (first letter of each word capitalized)"
      inputPlaceholder="Enter text to convert to title case..."
      outputPlaceholder="Title case text will appear here..."
      transformButtonText="Convert"
      transformFunction={async (text) => toTitleCase(text)}
    />
  )
}

export default ToTitleCasePage
