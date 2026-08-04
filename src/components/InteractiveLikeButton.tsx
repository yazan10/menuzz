import React, { useState } from 'react';

interface InteractiveLikeButtonProps {
  initialCount?: number;
  label?: string;
  onLikeToggle?: (liked: boolean) => void;
  className?: string;
}

export const InteractiveLikeButton: React.FC<InteractiveLikeButtonProps> = ({
  initialCount = 124,
  label = 'إعجاب بالمنصة',
  onLikeToggle,
  className = '',
}) => {
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number>(initialCount);

  const handleClick = () => {
    const nextState = !isLiked;
    setIsLiked(nextState);
    setLikeCount((prev) => (nextState ? prev + 1 : prev - 1));
    if (onLikeToggle) {
      onLikeToggle(nextState);
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center gap-1 ${className}`}>
      <div
        onClick={handleClick}
        className="overflow-x-visible relative w-14 h-14 overflow-y-clip group text-center cursor-pointer select-none"
        title={label}
      >
        <div
          className={`flex justify-center items-center w-14 h-14 rounded-full transition-all duration-300 absolute top-0 group-hover:scale-[.60] group-hover:origin-top ${
            isLiked
              ? 'bg-amber-400 text-slate-950 ring-4 ring-amber-300 shadow-lg shadow-amber-500/50 scale-105'
              : 'bg-yellow-300 text-slate-950 hover:bg-yellow-400'
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="26.463"
            height="26.647"
            viewBox="0 0 26.463 26.647"
            className={`transition-transform ${isLiked ? 'scale-110' : ''}`}
          >
            <g id="Grupo_3793" data-name="Grupo 3793" transform="translate(1.5 1.5)">
              <path
                id="Trazado_28219"
                data-name="Trazado 28219"
                d="M7,10V24.188"
                transform="translate(-1.088 -0.541)"
                fill="none"
                stroke="#000"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
              ></path>
              <path
                id="Trazado_28220"
                data-name="Trazado 28220"
                d="M17.37,6.587l-1.182,4.871h6.893a2.365,2.365,0,0,1,2.27,3.027L22.6,23.944a2.365,2.365,0,0,1-2.27,1.7H4.365A2.365,2.365,0,0,1,2,23.282V13.823a2.365,2.365,0,0,1,2.365-2.365H7.628a2.365,2.365,0,0,0,2.116-1.312L13.823,2A3.7,3.7,0,0,1,17.37,6.587Z"
                transform="translate(-2 -2)"
                fill={isLiked ? '#000' : 'none'}
                stroke="#000"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
              ></path>
            </g>
          </svg>
        </div>
        <div className="absolute text-white font-black -bottom-10 left-1/2 text-xs text-center whitespace-nowrap transition-all duration-300 transform -translate-x-1/2 group-hover:bottom-0 bg-slate-900/90 px-2 py-0.5 rounded-full border border-slate-700 shadow-md">
          {isLiked ? 'تم الإعجاب! ❤️' : 'إعجاب'}
        </div>
      </div>
      <span className="text-[11px] font-bold text-slate-400">
        {likeCount} إعجاب
      </span>
    </div>
  );
};
