import React from 'react'
import BaseTransformationPage from './BaseTransformationPage'
import { htmlDecode } from '../../transformations/html'

interface HtmlDecodePageProps {
  tabId: string
}

const HtmlDecodePage: React.FC<HtmlDecodePageProps> = ({ tabId }) => {
  return (
    <BaseTransformationPage
      tabId={tabId}
      transformationName="HTML Decode"
      transformationDescription="Decode HTML encoded text"
      inputPlaceholder="Enter HTML encoded text to decode..."
      outputPlaceholder="Decoded text will appear here..."
      transformButtonText="Decode"
      transformFunction={async (text) => htmlDecode(text)}
    />
  )
}

export default HtmlDecodePage
