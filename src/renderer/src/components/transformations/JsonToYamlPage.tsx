import React from 'react'
import BaseTransformationPage from './BaseTransformationPage'
import { jsonToYaml } from '../../transformations/conversion'

interface JsonToYamlPageProps {
  tabId: string
}

const JsonToYamlPage: React.FC<JsonToYamlPageProps> = ({ tabId }) => {
  return (
    <BaseTransformationPage
      tabId={tabId}
      transformationName="JSON to YAML"
      transformationDescription="Convert JSON to YAML format"
      inputPlaceholder="Enter JSON to convert to YAML..."
      outputPlaceholder="YAML will appear here..."
      transformButtonText="Convert"
      transformFunction={async (text) => jsonToYaml(text)}
    />
  )
}

export default JsonToYamlPage
