import React from 'react'
import BaseTransformationPage from './BaseTransformationPage'
import { jwtDecode } from '../../transformations/jwt'

interface JwtDecodePageProps {
  tabId: string
}

const JwtDecodePage: React.FC<JwtDecodePageProps> = ({ tabId }) => {
  return (
    <BaseTransformationPage
      tabId={tabId}
      transformationName="JWT Decode"
      transformationDescription="Decode JSON Web Token (JWT) to view its contents"
      inputPlaceholder="Enter JWT token to decode..."
      outputPlaceholder="Decoded JWT content will appear here..."
      transformButtonText="Decode"
      transformFunction={async (text) => jwtDecode(text)}
    />
  )
}

export default JwtDecodePage
