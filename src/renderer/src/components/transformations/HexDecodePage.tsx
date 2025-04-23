import React from 'react'
import BaseTransformationPage from './BaseTransformationPage'
import { hexDecode } from '../../transformations/hex'

interface HexDecodePageProps {
  tabId: string
}

const HexDecodePage: React.FC<HexDecodePageProps> = ({ tabId }) => {
  return (
    <BaseTransformationPage
      tabId={tabId}
      transformationName="Hex Decode"
      transformationDescription="Decode hexadecimal text to plain text"
      inputPlaceholder="Enter hexadecimal text to decode..."
      outputPlaceholder="Decoded text will appear here..."
      transformButtonText="Decode"
      transformFunction={async (text) => hexDecode(text)}
    />
  )
}

export default HexDecodePage
