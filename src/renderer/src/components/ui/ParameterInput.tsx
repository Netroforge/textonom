import React from 'react'
import { twMerge } from 'tailwind-merge'

interface ParameterInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  fullWidth?: boolean
}

const ParameterInput: React.FC<ParameterInputProps> = ({
  label,
  fullWidth = true,
  className = '',
  ...props
}) => {
  // Base classes
  const containerClasses = twMerge('flex flex-col mb-3', fullWidth ? 'w-full' : '', className)

  const inputClasses = twMerge(
    'p-2 border border-border rounded bg-input-background text-text w-full',
    props.disabled ? 'opacity-50 cursor-not-allowed' : ''
  )

  return (
    <div className={containerClasses}>
      <label className="mb-1 font-bold text-[0.9rem]" htmlFor={props.id}>
        {label}
      </label>
      <input className={inputClasses} {...props} />
    </div>
  )
}

export default ParameterInput
