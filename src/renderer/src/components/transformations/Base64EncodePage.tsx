import React from 'react'
import BaseTransformationPage from './BaseTransformationPage'
import { base64Encode } from '../../transformations/base64'

interface Base64EncodePageProps {
  tabId: string
}

const Base64EncodePage: React.FC<Base64EncodePageProps> = ({ tabId }) => {
  return (
    <BaseTransformationPage
      tabId={tabId}
      transformationName="Base64 Encode"
      transformationDescription="Encode text to Base64 format"
      inputPlaceholder="Enter text to encode to Base64..."
      outputPlaceholder="Base64 encoded text will appear here..."
      transformButtonText="Encode"
      transformFunction={async (text) => base64Encode(text)}
    />
  )
}

export default Base64EncodePage
