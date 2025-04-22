import React from 'react'
import BaseTransformationPage from './BaseTransformationPage'
import { unicodeEscape } from '../../transformations/unicode'

interface UnicodeEscapePageProps {
  tabId: string
}

const UnicodeEscapePage: React.FC<UnicodeEscapePageProps> = ({ tabId }) => {
  return (
    <BaseTransformationPage
      tabId={tabId}
      transformationName="Unicode Escape"
      transformationDescription="Escape Unicode characters to \\uXXXX format"
      inputPlaceholder="Enter text with Unicode characters to escape..."
      outputPlaceholder="Unicode escaped text will appear here..."
      transformButtonText="Escape"
      transformFunction={async (text) => unicodeEscape(text)}
    />
  )
}

export default UnicodeEscapePage
