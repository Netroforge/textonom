import React from 'react'
import BaseTransformationPage from './BaseTransformationPage'
import { markdownToHtml } from '../../transformations/markdown'

interface MarkdownToHtmlPageProps {
  tabId: string
}

const MarkdownToHtmlPage: React.FC<MarkdownToHtmlPageProps> = ({ tabId }) => {
  return (
    <BaseTransformationPage
      tabId={tabId}
      transformationName="Markdown to HTML"
      transformationDescription="Convert Markdown text to HTML"
      inputPlaceholder="Enter Markdown text to convert to HTML..."
      outputPlaceholder="HTML output will appear here..."
      transformButtonText="Convert"
      transformFunction={async (text) => markdownToHtml(text)}
    />
  )
}

export default MarkdownToHtmlPage
