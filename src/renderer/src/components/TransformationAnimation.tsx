import React from 'react'
import './TransformationAnimation.css'

interface TransformationAnimationProps {
  transformationName: string
}

const TransformationAnimation: React.FC<TransformationAnimationProps> = ({
  transformationName
}) => {
  return (
    <div className="transformation-animation-container">
      <div className="animation-background"></div>
      <div className="animation-content">
        <div className="animation-icon">
          <div className="hexagon-container">
            <div className="hexagon"></div>
            <div className="hexagon"></div>
            <div className="hexagon"></div>
          </div>
        </div>
        <div className="animation-text">
          <div className="glitch-text" data-text="TRANSFORMING">
            TRANSFORMING
          </div>
          <div className="transformation-name">{transformationName}</div>
        </div>
      </div>
    </div>
  )
}

export default TransformationAnimation
