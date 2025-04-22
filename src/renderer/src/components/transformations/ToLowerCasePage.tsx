import React from 'react'
import BaseTransformationPage from './BaseTransformationPage'
import { toLowerCase } from '../../transformations/case'

interface ToLowerCasePageProps {
  tabId: string
}

const ToLowerCasePage: React.FC<ToLowerCasePageProps> = ({ tabId }) => {
  return (
    <BaseTransformationPage
      tabId={tabId}
      transformationName="To Lowercase"
      transformationDescription="Convert text to lowercase"
      inputPlaceholder="Enter text to convert to lowercase..."
      outputPlaceholder="Lowercase text will appear here..."
      transformButtonText="Convert"
      transformFunction={async (text) => toLowerCase(text)}
    />
  )
}

export default ToLowerCasePage
