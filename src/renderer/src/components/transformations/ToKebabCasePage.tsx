import React from 'react'
import BaseTransformationPage from './BaseTransformationPage'
import { toKebabCase } from '../../transformations/case'

interface ToKebabCasePageProps {
  tabId: string
}

const ToKebabCasePage: React.FC<ToKebabCasePageProps> = ({ tabId }) => {
  return (
    <BaseTransformationPage
      tabId={tabId}
      transformationName="To kebab-case"
      transformationDescription="Convert text to kebab-case (lowercase with hyphens)"
      inputPlaceholder="Enter text to convert to kebab-case..."
      outputPlaceholder="Text in kebab-case will appear here..."
      transformButtonText="Convert"
      transformFunction={async (text) => toKebabCase(text)}
    />
  )
}

export default ToKebabCasePage
