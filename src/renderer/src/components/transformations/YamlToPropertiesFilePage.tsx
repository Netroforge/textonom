import React from 'react'
import BaseTransformationPage from './BaseTransformationPage'
import { yamlToPropertiesFile } from '../../transformations/conversion'

interface YamlToPropertiesFilePageProps {
  tabId: string
}

const YamlToPropertiesFilePage: React.FC<YamlToPropertiesFilePageProps> = ({ tabId }) => {
  return (
    <BaseTransformationPage
      tabId={tabId}
      transformationName="YAML to Properties"
      transformationDescription="Convert YAML to Java properties file format"
      inputPlaceholder="Enter YAML to convert to properties file format..."
      outputPlaceholder="Properties file content will appear here..."
      transformButtonText="Convert"
      transformFunction={async (text) => yamlToPropertiesFile(text)}
    />
  )
}

export default YamlToPropertiesFilePage
