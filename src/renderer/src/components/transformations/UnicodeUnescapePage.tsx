import React from 'react'
import BaseTransformationPage from './BaseTransformationPage'
import { unicodeUnescape } from '../../transformations/unicode'

interface UnicodeUnescapePageProps {
  tabId: string
}

const UnicodeUnescapePage: React.FC<UnicodeUnescapePageProps> = ({ tabId }) => {
  return (
    <BaseTransformationPage
      tabId={tabId}
      transformationName="Unicode Unescape"
      transformationDescription="Convert \\uXXXX format to actual Unicode characters"
      inputPlaceholder="Enter Unicode escaped text to unescape..."
      outputPlaceholder="Unicode unescaped text will appear here..."
      transformButtonText="Unescape"
      transformFunction={async (text) => unicodeUnescape(text)}
    />
  )
}

export default UnicodeUnescapePage
