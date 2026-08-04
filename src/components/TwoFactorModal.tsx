import React, { useState, useRef } from 'react';

interface TwoFactorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (code: string) => void;
  title?: string;
  description?: string;
}

export const TwoFactorModal: React.FC<TwoFactorModalProps> = ({
  isOpen,
  onClose,
  onVerify,
  title = 'Two-Factor Verification',
  description = 'Enter the two-factor authentication code provided by the authenticator app',
}) => {
  const [digits, setDigits] = useState<string[]>(['', '', '', '']);
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  if (!isOpen) return null;

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newDigits = [...digits];
    newDigits[index] = value.slice(-1);
    setDigits(newDigits);

    if (value && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.preventDefault();
    setDigits(['', '', '', '']);
    inputRefs[0].current?.focus();
  };

  const handleVerify = (e: React.MouseEvent) => {
    e.preventDefault();
    const code = digits.join('');
    if (code.length === 4) {
      onVerify(code);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <form className="twofa-form">
        <span className="close" onClick={onClose} title="إغلاق">
          X
        </span>
        <div className="info">
          <span className="title">{title}</span>
          <p className="description">{description}</p>
        </div>
        <div className="input-fields">
          {digits.map((digit, idx) => (
            <input
              key={idx}
              ref={inputRefs[idx]}
              type="tel"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              placeholder=""
              autoFocus={idx === 0}
            />
          ))}
        </div>
        <div className="action-btns">
          <a className="verify" href="#" onClick={handleVerify}>
            Verify
          </a>
          <a className="clear" href="#" onClick={handleClear}>
            Clear
          </a>
        </div>
      </form>
    </div>
  );
};
