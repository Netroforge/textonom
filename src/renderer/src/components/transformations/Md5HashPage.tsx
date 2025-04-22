import React from 'react'
import BaseTransformationPage from './BaseTransformationPage'
import { md5Hash } from '../../transformations/hash'

interface Md5HashPageProps {
  tabId: string
}

const Md5HashPage: React.FC<Md5HashPageProps> = ({ tabId }) => {
  return (
    <BaseTransformationPage
      tabId={tabId}
      transformationName="MD5 Hash"
      transformationDescription="Generate MD5 hash of text"
      inputPlaceholder="Enter text to hash..."
      outputPlaceholder="MD5 hash will appear here..."
      transformButtonText="Hash"
      transformFunction={async (text) => md5Hash(text)}
    />
  )
}

export default Md5HashPage
