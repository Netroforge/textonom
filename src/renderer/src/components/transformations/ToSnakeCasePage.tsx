import React from 'react'
import BaseTransformationPage from './BaseTransformationPage'
import { toSnakeCase } from '../../transformations/case'

interface ToSnakeCasePageProps {
  tabId: string
}

const ToSnakeCasePage: React.FC<ToSnakeCasePageProps> = ({ tabId }) => {
  return (
    <BaseTransformationPage
      tabId={tabId}
      transformationName="To snake_case"
      transformationDescription="Convert text to snake_case (lowercase with underscores)"
      inputPlaceholder="Enter text to convert to snake_case..."
      outputPlaceholder="Text in snake_case will appear here..."
      transformButtonText="Convert"
      transformFunction={async (text) => toSnakeCase(text)}
    />
  )
}

export default ToSnakeCasePage
