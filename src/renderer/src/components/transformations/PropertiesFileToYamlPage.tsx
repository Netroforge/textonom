import React from 'react'
import BaseTransformationPage from './BaseTransformationPage'
import { propertiesFileToYaml } from '../../transformations/conversion'

interface PropertiesFileToYamlPageProps {
  tabId: string
}

const PropertiesFileToYamlPage: React.FC<PropertiesFileToYamlPageProps> = ({ tabId }) => {
  return (
    <BaseTransformationPage
      tabId={tabId}
      transformationName="Properties to YAML"
      transformationDescription="Convert Java properties file to YAML"
      inputPlaceholder="Enter properties file content to convert to YAML..."
      outputPlaceholder="YAML will appear here..."
      transformButtonText="Convert"
      transformFunction={async (text) => propertiesFileToYaml(text)}
    />
  )
}

export default PropertiesFileToYamlPage
