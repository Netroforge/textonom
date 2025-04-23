import React from 'react'
import { twMerge } from 'tailwind-merge'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}) => {
  // Base classes
  const baseClasses =
    'rounded focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors duration-200 px-4 py-2 font-bold'

  // Variant classes
  const variantClasses = {
    primary: 'bg-[#ff00ff] text-black border border-[#ff00ff] hover:bg-[#cc00cc] focus:ring-[#ff00ff]',
    secondary: 'bg-[#1a1a2e] text-[#00ffff] border border-[#ff00ff] hover:bg-[#2a2a4e] focus:ring-[#ff00ff]',
    outline: 'bg-transparent text-[#00ffff] border border-[#ff00ff] hover:bg-[#1a1a2e] focus:ring-[#ff00ff]',
    danger: 'bg-[#ff0055] text-white border border-[#ff0055] hover:opacity-90 focus:ring-[#ff0055]'
  }

  // Size classes
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-4 py-2',
    lg: 'text-base px-6 py-3'
  }

  // Disabled classes
  const disabledClasses = props.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'

  // Combine all classes
  const buttonClasses = twMerge(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    disabledClasses,
    className
  )

  return (
    <button className={buttonClasses} {...props}>
      {children}
    </button>
  )
}

export default Button
