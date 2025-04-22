import React from 'react'
import BaseTransformationPage from './BaseTransformationPage'
import { xmlCompact } from '../../transformations/xml'

interface XmlCompactPageProps {
  tabId: string
}

const XmlCompactPage: React.FC<XmlCompactPageProps> = ({ tabId }) => {
  return (
    <BaseTransformationPage
      tabId={tabId}
      transformationName="XML Compact"
      transformationDescription="Compact XML by removing whitespace"
      inputPlaceholder="Enter XML to compact..."
      outputPlaceholder="Compacted XML will appear here..."
      transformButtonText="Compact"
      transformFunction={async (text) => xmlCompact(text)}
    />
  )
}

export default XmlCompactPage
