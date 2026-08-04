import React from 'react';

interface GooeySearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const GooeySearchBar: React.FC<GooeySearchBarProps> = ({
  value,
  onChange,
  placeholder = 'بحث في المنيو والوجبات...',
  className = '',
}) => {
  return (
    <div className={`search-orb-container ${className}`}>
      <div className="gooey-background-layer">
        <div className="gooey-blob gooey-blob-1"></div>
        <div className="gooey-blob gooey-blob-2"></div>
        <div className="gooey-blob gooey-blob-3"></div>
        <div className="gooey-blob-bridge"></div>
      </div>

      <div className="search-input-overlay">
        <div className="gooey-search-icon-wrapper">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4 text-white"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="gooey-search-input dir-rtl"
          placeholder={placeholder}
        />
        <div className="gooey-focus-indicator"></div>
      </div>

      <svg className="gooey-svg-filter" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="enhanced-goo">
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="12"
              result="blur"
            ></feGaussianBlur>
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10"
              result="goo"
            ></feColorMatrix>
            <feComposite in="SourceGraphic" in2="goo" operator="atop"></feComposite>
          </filter>
        </defs>
      </svg>
    </div>
  );
};
