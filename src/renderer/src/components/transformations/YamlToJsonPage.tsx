import React from 'react'
import BaseTransformationPage from './BaseTransformationPage'
import { yamlToJson } from '../../transformations/conversion'

interface YamlToJsonPageProps {
  tabId: string
}

const YamlToJsonPage: React.FC<YamlToJsonPageProps> = ({ tabId }) => {
  return (
    <BaseTransformationPage
      tabId={tabId}
      transformationName="YAML to JSON"
      transformationDescription="Convert YAML to JSON format"
      inputPlaceholder="Enter YAML to convert to JSON..."
      outputPlaceholder="JSON will appear here..."
      transformButtonText="Convert"
      transformFunction={async (text) => yamlToJson(text)}
    />
  )
}

export default YamlToJsonPage
