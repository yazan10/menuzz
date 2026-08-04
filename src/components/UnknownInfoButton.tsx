import React from 'react';

interface UnknownInfoButtonProps {
  tooltipText: string;
  className?: string;
  onClick?: () => void;
}

export const UnknownInfoButton: React.FC<UnknownInfoButtonProps> = ({
  tooltipText,
  className = '',
  onClick,
}) => {
  return (
    <div className={`plate-tooltip-container ${className}`} onClick={onClick}>
      <div className="tooltip-trigger" data-tooltip={tooltipText}>
        <div className="warning-symbol"></div>
      </div>
    </div>
  );
};
