import React from 'react'
import { twMerge } from 'tailwind-merge'

interface ParameterCheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
}

const ParameterCheckbox: React.FC<ParameterCheckboxProps> = ({
  label,
  className = '',
  ...props
}) => {
  // Base classes
  const containerClasses = twMerge('flex items-center mb-3', className)

  const checkboxClasses = twMerge(
    'w-4 h-4 mr-2',
    props.disabled ? 'opacity-50 cursor-not-allowed' : ''
  )

  return (
    <div className={containerClasses}>
      <input type="checkbox" className={checkboxClasses} id={props.id} {...props} />
      <label className="font-bold text-[0.9rem] cursor-pointer" htmlFor={props.id}>
        {label}
      </label>
    </div>
  )
}

export default ParameterCheckbox
