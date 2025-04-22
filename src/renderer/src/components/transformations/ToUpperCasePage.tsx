import React from 'react'
import BaseTransformationPage from './BaseTransformationPage'
import { toUpperCase } from '../../transformations/case'

interface ToUpperCasePageProps {
  tabId: string
}

const ToUpperCasePage: React.FC<ToUpperCasePageProps> = ({ tabId }) => {
  return (
    <BaseTransformationPage
      tabId={tabId}
      transformationName="To Uppercase"
      transformationDescription="Convert text to uppercase"
      inputPlaceholder="Enter text to convert to uppercase..."
      outputPlaceholder="Uppercase text will appear here..."
      transformButtonText="Convert"
      transformFunction={async (text) => toUpperCase(text)}
    />
  )
}

export default ToUpperCasePage
