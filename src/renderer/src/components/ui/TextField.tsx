import React from 'react'
import { twMerge } from 'tailwind-merge'

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  fullWidth?: boolean
}

const TextField: React.FC<TextFieldProps> = ({
  label,
  error,
  fullWidth = false,
  className = '',
  ...props
}) => {
  // Base classes
  const containerClasses = twMerge('flex flex-col', fullWidth ? 'w-full' : '', className)

  const inputClasses = twMerge(
    'bg-input-background text-text border border-border rounded p-2 focus:outline-none focus:border-primary transition-colors',
    error ? 'border-error' : '',
    fullWidth ? 'w-full' : '',
    props.disabled ? 'opacity-50 cursor-not-allowed' : ''
  )

  return (
    <div className={containerClasses}>
      {label && <label className="mb-1 text-sm font-medium">{label}</label>}
      <input className={inputClasses} {...props} />
      {error && <p className="mt-1 text-xs text-error">{error}</p>}
    </div>
  )
}

export default TextField
