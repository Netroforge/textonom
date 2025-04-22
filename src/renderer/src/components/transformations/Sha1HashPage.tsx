import React from 'react'
import BaseTransformationPage from './BaseTransformationPage'
import { sha1Hash } from '../../transformations/hash'

interface Sha1HashPageProps {
  tabId: string
}

const Sha1HashPage: React.FC<Sha1HashPageProps> = ({ tabId }) => {
  return (
    <BaseTransformationPage
      tabId={tabId}
      transformationName="SHA-1 Hash"
      transformationDescription="Generate SHA-1 hash of text"
      inputPlaceholder="Enter text to hash..."
      outputPlaceholder="SHA-1 hash will appear here..."
      transformButtonText="Hash"
      transformFunction={async (text) => sha1Hash(text)}
    />
  )
}

export default Sha1HashPage
