import React from 'react'
import BaseTransformationPage from './BaseTransformationPage'
import { htmlEncode } from '../../transformations/html'

interface HtmlEncodePageProps {
  tabId: string
}

const HtmlEncodePage: React.FC<HtmlEncodePageProps> = ({ tabId }) => {
  return (
    <BaseTransformationPage
      tabId={tabId}
      transformationName="HTML Encode"
      transformationDescription="Encode special characters for HTML"
      inputPlaceholder="Enter text to HTML encode..."
      outputPlaceholder="HTML encoded text will appear here..."
      transformButtonText="Encode"
      transformFunction={async (text) => htmlEncode(text)}
    />
  )
}

export default HtmlEncodePage
