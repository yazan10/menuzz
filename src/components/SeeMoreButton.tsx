import React from 'react';
import { ChevronLeft } from 'lucide-react';

interface SeeMoreButtonProps {
  onClick?: () => void;
  label?: string;
  className?: string;
}

export const SeeMoreButton: React.FC<SeeMoreButtonProps> = ({
  onClick,
  label = 'عرض المزيد',
  className = '',
}) => {
  return (
    <button
      onClick={onClick}
      className={`uiverse-seemore-btn group ${className}`}
      type="button"
    >
      <span className="relative z-10 font-bold">{label}</span>
      <ChevronLeft className="w-5 h-5 relative z-10 text-rose-300 transition-transform group-hover:-translate-x-1" />
    </button>
  );
};
