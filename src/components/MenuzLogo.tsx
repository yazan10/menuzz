import React from 'react';

interface MenuzLogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  textColor?: string;
}

export const MenuzLogo: React.FC<MenuzLogoProps> = ({ 
  className = '', 
  size = 'md',
  showText = true,
  textColor = 'text-white'
}) => {
  const iconSizes = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const fontSizes = {
    xs: 'text-lg',
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl',
  };

  return (
    <div className={`flex items-center gap-2.5 font-['IBM_Plex_Sans_Arabic',sans-serif] font-bold ${className}`}>
      {/* Icon with orange background and exact Z° mark */}
      <div className={`${iconSizes[size]} rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center p-1.5 shadow-md shadow-orange-500/30 overflow-hidden relative shrink-0 transition-transform hover:scale-105`}>
        <svg viewBox="0 0 100 100" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          {/* Top Right Floating Dot */}
          <circle cx="78" cy="20" r="6.5" fill="#ffffff" />
          
          {/* Upper Blade of stylized Z */}
          <path 
            fill="#ffffff" 
            d="M 16,38 C 22,23 34,22 66,22 C 70,22 71,25 68,29 L 38,68 C 36,71 35,72 35,72 L 21,78 C 22,76 48,40 48,40 L 23,40 C 17,40 15,38 16,38 Z" 
          />
          
          {/* Lower Blade of stylized Z */}
          <path 
            fill="#ffffff" 
            d="M 21,78 L 40,52 C 41,50 44,51 46,54 L 70,61 C 72,57 73,62 71,66 C 67,73 53,78 35,78 L 21,78 Z" 
          />
        </svg>
      </div>

      {/* Brand Name Text */}
      {showText && (
        <span className={`${fontSizes[size]} font-black tracking-tight ${textColor} flex items-center`}>
          menuz<span className="text-orange-500 font-extrabold">.</span>
        </span>
      )}
    </div>
  );
};
