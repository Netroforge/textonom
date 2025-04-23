import React from 'react'
import BaseTransformationPage from './BaseTransformationPage'
import { hexEncode } from '../../transformations/hex'

interface HexEncodePageProps {
  tabId: string
}

const HexEncodePage: React.FC<HexEncodePageProps> = ({ tabId }) => {
  return (
    <BaseTransformationPage
      tabId={tabId}
      transformationName="Hex Encode"
      transformationDescription="Encode text to hexadecimal representation"
      inputPlaceholder="Enter text to encode to hexadecimal..."
      outputPlaceholder="Hexadecimal encoded text will appear here..."
      transformButtonText="Encode"
      transformFunction={async (text) => hexEncode(text)}
    />
  )
}

export default HexEncodePage
