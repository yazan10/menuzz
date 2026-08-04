import React from 'react';

interface FavoriteButtonProps {
  isFavorite: boolean;
  onToggle: () => void;
  id?: string;
  option1Text?: string;
  option2Text?: string;
  className?: string;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  isFavorite,
  onToggle,
  id,
  option1Text = 'أضف للمفضلة',
  option2Text = 'في المفضلة ✨',
  className = '',
}) => {
  const uniqueId = id || `fav-check-${Math.random().toString(36).substring(2, 9)}`;

  return (
    <div className={`inline-block ${className}`}>
      <input
        type="checkbox"
        id={uniqueId}
        className="favorite-checkbox"
        checked={isFavorite}
        onChange={onToggle}
      />
      <label htmlFor={uniqueId} className="favorite-btn-label">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="feather feather-heart text-slate-400 shrink-0 transition-colors duration-300"
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
        </svg>
        <div className="action">
          <span className="option-1">{option1Text}</span>
          <span className="option-2">{option2Text}</span>
        </div>
      </label>
    </div>
  );
};
