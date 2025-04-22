import React from 'react'
import BaseTransformationPage from './BaseTransformationPage'
import { sha256Hash } from '../../transformations/hash'

interface Sha256HashPageProps {
  tabId: string
}

const Sha256HashPage: React.FC<Sha256HashPageProps> = ({ tabId }) => {
  return (
    <BaseTransformationPage
      tabId={tabId}
      transformationName="SHA-256 Hash"
      transformationDescription="Generate SHA-256 hash of text"
      inputPlaceholder="Enter text to hash..."
      outputPlaceholder="SHA-256 hash will appear here..."
      transformButtonText="Hash"
      transformFunction={async (text) => sha256Hash(text)}
    />
  )
}

export default Sha256HashPage
