import React from 'react';
import { generateCode128Modules } from '../../lib/barcode';

interface BarcodeSVGComponentProps {
  value: string;
  width?: number; // module width in px
  height?: number; // height of bars in px
  barColor?: string;
  bgColor?: string;
  showText?: boolean;
  className?: string;
}

export const BarcodeSVGComponent: React.FC<BarcodeSVGComponentProps> = ({
  value,
  width = 2,
  height = 70,
  barColor = '#000000',
  bgColor = '#ffffff',
  showText = true,
  className = '',
}) => {
  const modules = generateCode128Modules(value || 'MENUZ-1001');
  const quietZone = 20; // left/right quiet zone in px
  const svgWidth = modules.length * width + quietZone * 2;
  const svgHeight = height + (showText ? 30 : 10);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      className={`max-w-full h-auto ${className}`}
      style={{ backgroundColor: bgColor }}
    >
      <rect width={svgWidth} height={svgHeight} fill={bgColor} />
      
      {/* Draw Barcode Modules */}
      <g transform={`translate(${quietZone}, 5)`}>
        {modules.split('').map((char, index) => {
          if (char === '1') {
            return (
              <rect
                key={index}
                x={index * width}
                y={0}
                width={width}
                height={height}
                fill={barColor}
              />
            );
          }
          return null;
        })}
      </g>

      {/* Human Readable Text */}
      {showText && (
        <text
          x={svgWidth / 2}
          y={height + 22}
          textAnchor="middle"
          fill={barColor}
          fontSize={14}
          fontWeight="bold"
          fontFamily="monospace"
        >
          {value}
        </text>
      )}
    </svg>
  );
};
