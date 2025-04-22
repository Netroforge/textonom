import React from 'react'
import BaseTransformationPage from './BaseTransformationPage'
import { urlDecode } from '../../transformations/url'

interface UrlDecodePageProps {
  tabId: string
}

const UrlDecodePage: React.FC<UrlDecodePageProps> = ({ tabId }) => {
  return (
    <BaseTransformationPage
      tabId={tabId}
      transformationName="URL Decode"
      transformationDescription="Decode URL encoded text"
      inputPlaceholder="Enter URL encoded text to decode..."
      outputPlaceholder="Decoded text will appear here..."
      transformButtonText="Decode"
      transformFunction={async (text) => urlDecode(text)}
    />
  )
}

export default UrlDecodePage
