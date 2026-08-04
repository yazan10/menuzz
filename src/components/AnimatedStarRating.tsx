import React from 'react';

interface AnimatedStarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
  name?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const AnimatedStarRating: React.FC<AnimatedStarRatingProps> = ({
  value,
  onChange,
  readOnly = false,
  name = 'star-radio',
  size = 'md',
}) => {
  const scaleClass =
    size === 'sm' ? 'scale-75' : size === 'lg' ? 'scale-125' : 'scale-100';

  return (
    <div className={`uiverse-rating ${scaleClass} ${readOnly ? 'pointer-events-none' : ''}`}>
      {[5, 4, 3, 2, 1].map((star) => {
        const id = `${name}-${star}`;
        return (
          <React.Fragment key={star}>
            <input
              type="radio"
              id={id}
              name={name}
              value={`star-${star}`}
              checked={value === star}
              onChange={() => !readOnly && onChange?.(star)}
              disabled={readOnly}
            />
            <label htmlFor={id}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path
                  pathLength="360"
                  d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"
                ></path>
              </svg>
            </label>
          </React.Fragment>
        );
      })}
    </div>
  );
};
