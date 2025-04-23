import React from 'react'
import { twMerge } from 'tailwind-merge'

interface TextAreaWithLabelProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  fullWidth?: boolean
  wordWrap?: boolean
}

const TextAreaWithLabel: React.FC<TextAreaWithLabelProps> = ({
  label,
  fullWidth = true,
  wordWrap = true,
  className = '',
  ...props
}) => {
  // Base classes
  const containerClasses = twMerge(
    'textarea-container flex flex-col flex-1 min-h-0 h-full',
    fullWidth ? 'w-full' : '',
    className
  )

  const textareaClasses = twMerge(
    'transformation-textarea flex-1 h-full min-h-[200px] p-3 border border-[#ff00ff] rounded bg-[#12122a] text-[#00ffff] font-[var(--fontFamily)] text-[var(--fontSize)] resize-none focus:outline-none focus:border-[#ff00ff] focus:ring-1 focus:ring-[#ff00ff]',
    wordWrap ? 'whitespace-pre-wrap break-words' : 'whitespace-pre overflow-auto',
    props.disabled ? 'opacity-50 cursor-not-allowed' : ''
  )

  return (
    <div className={containerClasses}>
      <label className="block mb-2 font-bold text-[#00ffff]">{label}</label>
      <div className="textarea-wrapper relative flex-1 flex flex-col h-full">
        <textarea className={textareaClasses} {...props} />
        {props.children}
      </div>
    </div>
  )
}

export default TextAreaWithLabel
