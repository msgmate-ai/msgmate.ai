import React from 'react';

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}

const LogoSvg: React.FC<LogoProps> = ({ className, width = 300, height = 150 }) => {
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 600 300" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Speech bubble with heart */}
      <g>
        <path 
          d="M180 50C141.34 50 110 81.34 110 120V160C110 198.66 141.34 230 180 230H200L185 260C183.333 263.333 185.4 268 190 268C191.6 268 193 267.333 194 266L238 230H250C288.66 230 320 198.66 320 160V120C320 81.34 288.66 50 250 50H180Z" 
          fill="transparent" 
          stroke="currentColor" 
          strokeWidth="15"
        />
        <path 
          d="M215 100C198.431 100 185 113.431 185 130C185 146.569 198.431 160 215 160C231.569 160 245 146.569 245 130C245 113.431 231.569 100 215 100Z" 
          fill="#ff6b6b" 
        />
      </g>
      
      {/* "Msg" text */}
      <text x="350" y="130" fontSize="80" fontWeight="bold" fill="currentColor">Msg</text>
      
      {/* "Mate.AI" text */}
      <text x="350" y="210" fontSize="80" fontWeight="bold" fill="currentColor">Mate.AI</text>
      
      {/* Subtitle */}
      <text x="125" y="290" fontSize="30" fontWeight="500" fill="currentColor">Your personal AI Wingmate</text>
    </svg>
  );
};

export default LogoSvg;