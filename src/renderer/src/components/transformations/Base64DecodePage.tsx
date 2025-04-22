import React from 'react'
import BaseTransformationPage from './BaseTransformationPage'
import { base64Decode } from '../../transformations/base64'

interface Base64DecodePageProps {
  tabId: string
}

const Base64DecodePage: React.FC<Base64DecodePageProps> = ({ tabId }) => {
  return (
    <BaseTransformationPage
      tabId={tabId}
      transformationName="Base64 Decode"
      transformationDescription="Decode Base64 encoded text"
      inputPlaceholder="Enter Base64 encoded text to decode..."
      outputPlaceholder="Decoded text will appear here..."
      transformButtonText="Decode"
      transformFunction={async (text) => base64Decode(text)}
    />
  )
}

export default Base64DecodePage
