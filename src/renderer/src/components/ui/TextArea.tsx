import React from 'react'
import { twMerge } from 'tailwind-merge'

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  fullWidth?: boolean
  wordWrap?: boolean
}

const TextArea: React.FC<TextAreaProps> = ({
  label,
  error,
  fullWidth = false,
  wordWrap = true,
  className = '',
  ...props
}) => {
  // Base classes
  const containerClasses = twMerge('flex flex-col', fullWidth ? 'w-full' : '', className)

  const textareaClasses = twMerge(
    'bg-input-background text-text border border-border rounded p-2 focus:outline-none focus:border-primary transition-colors',
    wordWrap ? 'whitespace-pre-wrap break-words' : 'whitespace-pre',
    error ? 'border-error' : '',
    fullWidth ? 'w-full' : '',
    props.disabled ? 'opacity-50 cursor-not-allowed' : ''
  )

  return (
    <div className={containerClasses}>
      {label && <label className="mb-1 text-sm font-medium">{label}</label>}
      <textarea className={textareaClasses} {...props} />
      {error && <p className="mt-1 text-xs text-error">{error}</p>}
    </div>
  )
}

export default TextArea
