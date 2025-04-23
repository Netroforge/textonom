import React from 'react'

interface TransformationAnimationProps {
  transformationName: string
}

const TransformationAnimationTailwind: React.FC<TransformationAnimationProps> = ({
  transformationName
}) => {
  return (
    <div className="absolute inset-0 flex justify-center items-center z-10 overflow-hidden rounded-lg">
      <div className="absolute inset-0 bg-black bg-opacity-85 backdrop-blur-sm animate-fadeIn"></div>
      <div className="relative flex flex-col items-center gap-8 animate-scaleIn">
        <div className="w-[120px] h-[120px] flex justify-center items-center">
          <div className="relative w-[100px] h-[100px] animate-[rotate_4s_linear_infinite]">
            <div className="absolute w-full h-full rounded-lg bg-transparent border-3 border-primary opacity-70 animate-[pulse_2s_ease-in-out_infinite] rotate-0 animation-delay-0"></div>
            <div className="absolute w-full h-full rounded-lg bg-transparent border-3 border-primary opacity-70 animate-[pulse_2s_ease-in-out_infinite] rotate-[60deg] animation-delay-500"></div>
            <div className="absolute w-full h-full rounded-lg bg-transparent border-3 border-primary opacity-70 animate-[pulse_2s_ease-in-out_infinite] rotate-[120deg] animation-delay-1000"></div>
          </div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div
            className="crt-glitch text-primary text-2xl font-bold relative animate-[glitch_1s_infinite] before:content-[attr(data-text)] before:absolute before:inset-0 before:text-[#0ff] before:-z-10 before:animate-[glitch-offset_2s_infinite] after:content-[attr(data-text)] after:absolute after:inset-0 after:text-[#f0f] after:-z-20 after:animate-[glitch-offset_1s_infinite_reverse]"
            data-text="TRANSFORMING"
          >
            TRANSFORMING
          </div>
          <div className="text-button-text text-lg opacity-0 animate-[fadeIn_0.5s_ease-out_0.5s_forwards]">
            {transformationName}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TransformationAnimationTailwind
