import React from 'react'
import BaseTransformationPage from './BaseTransformationPage'
import { sha512Hash } from '../../transformations/hash'

interface Sha512HashPageProps {
  tabId: string
}

const Sha512HashPage: React.FC<Sha512HashPageProps> = ({ tabId }) => {
  return (
    <BaseTransformationPage
      tabId={tabId}
      transformationName="SHA-512 Hash"
      transformationDescription="Generate SHA-512 hash of text (stronger than SHA-256)"
      inputPlaceholder="Enter text to hash..."
      outputPlaceholder="SHA-512 hash will appear here..."
      transformButtonText="Hash"
      transformFunction={async (text) => sha512Hash(text)}
    />
  )
}

export default Sha512HashPage
