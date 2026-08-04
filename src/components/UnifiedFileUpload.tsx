import React from 'react';

interface UnifiedFileUploadProps {
  onFileSelect: (fileOrBase64: string, fileObject?: File) => void;
  accept?: string;
  label?: string;
  className?: string;
}

export const UnifiedFileUpload: React.FC<UnifiedFileUploadProps> = ({
  onFileSelect,
  accept = 'image/*',
  label = 'رفع صورة / ملف',
  className = '',
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          onFileSelect(reader.result, file);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <div className="neon-file-upload">
        <input
          className="neon-input"
          name="file"
          type="file"
          accept={accept}
          onChange={handleChange}
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          strokeLinejoin="round"
          strokeLinecap="round"
          viewBox="0 0 24 24"
          strokeWidth="2"
          fill="none"
          stroke="currentColor"
          className="neon-icon"
        >
          <polyline points="16 16 12 12 8 16"></polyline>
          <line y2="21" x2="12" y1="12" x1="12"></line>
          <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"></path>
          <polyline points="16 16 12 12 8 16"></polyline>
        </svg>
      </div>
      {label && (
        <span className="text-[11px] font-black text-slate-700 dark:text-slate-300 text-center">
          {label}
        </span>
      )}
    </div>
  );
};
