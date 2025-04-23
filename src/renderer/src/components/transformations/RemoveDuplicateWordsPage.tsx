import React from 'react'
import BaseTransformationPage from './BaseTransformationPage'
import { removeDuplicateWords } from '../../transformations/text'

interface RemoveDuplicateWordsPageProps {
  tabId: string
}

const RemoveDuplicateWordsPage: React.FC<RemoveDuplicateWordsPageProps> = ({ tabId }) => {
  return (
    <BaseTransformationPage
      tabId={tabId}
      transformationName="Remove Duplicate Words"
      transformationDescription="Remove duplicate words from text (case-insensitive)"
      inputPlaceholder="Enter text with duplicate words to remove..."
      outputPlaceholder="Text with duplicate words removed will appear here..."
      transformButtonText="Remove Duplicates"
      transformFunction={async (text) => removeDuplicateWords(text)}
    />
  )
}

export default RemoveDuplicateWordsPage
