import React from 'react'
import BaseTransformationPage from './BaseTransformationPage'
import { xmlPrettify } from '../../transformations/xml'

interface XmlPrettifyPageProps {
  tabId: string
}

const XmlPrettifyPage: React.FC<XmlPrettifyPageProps> = ({ tabId }) => {
  return (
    <BaseTransformationPage
      tabId={tabId}
      transformationName="XML Prettify"
      transformationDescription="Format XML with proper indentation"
      inputPlaceholder="Enter XML to format..."
      outputPlaceholder="Formatted XML will appear here..."
      transformButtonText="Format"
      transformFunction={async (text) => xmlPrettify(text)}
    />
  )
}

export default XmlPrettifyPage
