import React from 'react'
import BaseTransformationPage from './BaseTransformationPage'
import { urlEncode } from '../../transformations/url'

interface UrlEncodePageProps {
  tabId: string
}

const UrlEncodePage: React.FC<UrlEncodePageProps> = ({ tabId }) => {
  return (
    <BaseTransformationPage
      tabId={tabId}
      transformationName="URL Encode"
      transformationDescription="Encode text for use in URLs"
      inputPlaceholder="Enter text to URL encode..."
      outputPlaceholder="URL encoded text will appear here..."
      transformButtonText="Encode"
      transformFunction={async (text) => urlEncode(text)}
    />
  )
}

export default UrlEncodePage
