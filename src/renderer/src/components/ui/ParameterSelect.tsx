import React from 'react'
import { twMerge } from 'tailwind-merge'

interface ParameterSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  options: Array<{ value: string | number; label: string }>
  fullWidth?: boolean
}

const ParameterSelect: React.FC<ParameterSelectProps> = ({
  label,
  options,
  fullWidth = true,
  className = '',
  ...props
}) => {
  // Base classes
  const containerClasses = twMerge('flex flex-col mb-3', fullWidth ? 'w-full' : '', className)

  const selectClasses = twMerge(
    'p-2 border border-border rounded bg-input-background text-text w-full',
    props.disabled ? 'opacity-50 cursor-not-allowed' : ''
  )

  return (
    <div className={containerClasses}>
      <label className="mb-1 font-bold text-[0.9rem]" htmlFor={props.id}>
        {label}
      </label>
      <select className={selectClasses} {...props}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default ParameterSelect
