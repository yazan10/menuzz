import React from 'react';

interface KineticGreenLoaderProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

export const KineticGreenLoader: React.FC<KineticGreenLoaderProps> = ({
  title = 'جاري التحميل المعالج المتقدم',
  subtitle = 'يتم تحديث البيانات ومعالجة طلبك بأسلوب ديناميكي...',
  className = '',
}) => {
  return (
    <div className={`kinetic-green-wrapper ${className}`}>
      <div className="text-center mb-6 relative z-10">
        {title && (
          <h3 className="text-xl font-black text-amber-300 drop-shadow-md">
            {title}
          </h3>
        )}
        {subtitle && (
          <p className="text-xs text-emerald-100/80 mt-1 font-medium">
            {subtitle}
          </p>
        )}
      </div>

      <div className="kinetic-main">
        <div className="kinetic-up">
          <div className="kinetic-loaders">
            <div className="kinetic-loader"></div>
            <div className="kinetic-loader"></div>
            <div className="kinetic-loader"></div>
            <div className="kinetic-loader"></div>
            <div className="kinetic-loader"></div>
            <div className="kinetic-loader"></div>
            <div className="kinetic-loader"></div>
            <div className="kinetic-loader"></div>
            <div className="kinetic-loader"></div>
          </div>
          <div className="kinetic-loadersB">
            <div className="kinetic-loaderA">
              <div className="kinetic-ball0"></div>
            </div>
            <div className="kinetic-loaderA">
              <div className="kinetic-ball1"></div>
            </div>
            <div className="kinetic-loaderA">
              <div className="kinetic-ball2"></div>
            </div>
            <div className="kinetic-loaderA">
              <div className="kinetic-ball3"></div>
            </div>
            <div className="kinetic-loaderA">
              <div className="kinetic-ball4"></div>
            </div>
            <div className="kinetic-loaderA">
              <div className="kinetic-ball5"></div>
            </div>
            <div className="kinetic-loaderA">
              <div className="kinetic-ball6"></div>
            </div>
            <div className="kinetic-loaderA">
              <div className="kinetic-ball7"></div>
            </div>
            <div className="kinetic-loaderA">
              <div className="kinetic-ball8"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
