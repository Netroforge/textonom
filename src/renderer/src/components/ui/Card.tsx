import React from 'react'
import { twMerge } from 'tailwind-merge'

interface CardProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  active?: boolean
}

const Card: React.FC<CardProps> = ({ children, className = '', onClick, active = false }) => {
  const cardClasses = twMerge(
    'bg-[#1a1a2e] border border-[#ff00ff] rounded-lg overflow-hidden transition-all duration-200',
    active ? 'border-[#ff00ff] bg-opacity-15 bg-[#2a2a4e] transform -translate-y-0.5' : '',
    onClick ? 'cursor-pointer hover:border-[#ff00ff] hover:bg-[#2a2a4e] hover:transform hover:-translate-y-0.5' : '',
    className
  )

  return (
    <div className={cardClasses} onClick={onClick}>
      {active && (
        <div className="absolute top-2 right-2 bg-[#ff00ff] text-black text-xs font-bold py-0.5 px-1.5 rounded">
          ✓ Open
        </div>
      )}
      {children}
    </div>
  )
}

export default Card
