import React, { useState } from 'react';

interface FeedbackWidgetProps {
  onSendFeedback?: (feedback: string, sentiment: 'happy' | 'sad') => void;
  className?: string;
}

export const FeedbackWidget: React.FC<FeedbackWidgetProps> = ({
  onSendFeedback,
  className = '',
}) => {
  const [feedbackText, setFeedbackText] = useState('');
  const [sentiment, setSentiment] = useState<'happy' | 'sad' | null>(null);
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;
    if (onSendFeedback) {
      onSendFeedback(feedbackText, sentiment || 'happy');
    }
    setSentSuccess(true);
    setTimeout(() => {
      setFeedbackText('');
      setSentiment(null);
      setSentSuccess(false);
    }, 3000);
  };

  return (
    <div className={`bg-slate-900/90 border border-slate-700/80 grid grid-cols-6 gap-2 rounded-xl p-4 text-sm shadow-xl backdrop-blur-md ${className}`}>
      <h3 className="text-center text-slate-100 text-base sm:text-lg font-bold col-span-6 flex items-center justify-center gap-2">
        <span>إرسال تقييمك وملاحظاتك للمنصة Send Feedback</span>
        <span>💬</span>
      </h3>
      <textarea
        value={feedbackText}
        onChange={(e) => setFeedbackText(e.target.value)}
        placeholder="اكتب اقتراحك، ملاحظاتك أو أي استفسار للمنصة..."
        className="bg-slate-800 text-slate-100 h-28 placeholder:text-slate-400 placeholder:opacity-70 border border-slate-700 col-span-6 resize-none outline-none rounded-lg p-3 duration-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-xs sm:text-sm"
      ></textarea>

      {/* Happy Sentiment Button */}
      <button
        type="button"
        onClick={() => setSentiment('happy')}
        title="سعيد ومقتنع"
        className={`col-span-1 flex justify-center items-center rounded-lg p-2 duration-300 border transition-all cursor-pointer ${
          sentiment === 'happy'
            ? 'bg-amber-500/30 border-amber-400 fill-amber-300 scale-105'
            : 'bg-slate-800 hover:border-amber-500 border-slate-700 fill-slate-300'
        }`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 0 512 512">
          <path d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm177.6 62.1C192.8 334.5 218.8 352 256 352s63.2-17.5 78.4-33.9c9-9.7 24.2-10.4 33.9-1.4s10.4 24.2 1.4 33.9c-22 23.8-60 49.4-113.6 49.4s-91.7-25.5-113.6-49.4c-9-9.7-8.4-24.9 1.4-33.9s24.9-8.4 33.9 1.4zM144.4 208a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm192-32a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"></path>
        </svg>
      </button>

      {/* Sad Sentiment Button */}
      <button
        type="button"
        onClick={() => setSentiment('sad')}
        title="يحتاج تحسين"
        className={`col-span-1 flex justify-center items-center rounded-lg p-2 duration-300 border transition-all cursor-pointer ${
          sentiment === 'sad'
            ? 'bg-rose-500/30 border-rose-400 fill-rose-300 scale-105'
            : 'bg-slate-800 hover:border-slate-500 border-slate-700 fill-slate-300'
        }`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 0 512 512">
          <path d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zM174.6 384.1c-4.5 12.5-18.2 18.9-30.7 14.4s-18.9-18.2-14.4-30.7C146.9 319.4 198.9 288 256 288s109.1 31.4 126.6 79.9c4.5 12.5-2 26.2-14.4 30.7s-26.2-2-30.7-14.4C328.2 358.5 297.2 336 256 336s-72.2 22.5-81.4 48.1zM144.4 208a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm192-32a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"></path>
        </svg>
      </button>

      <span className="col-span-2"></span>

      {/* Submit Button */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={sentSuccess}
        className="bg-amber-500 hover:bg-amber-400 text-slate-950 stroke-slate-950 border border-amber-400 col-span-2 flex items-center justify-center gap-1.5 rounded-lg p-2 font-black duration-300 cursor-pointer shadow-md shadow-amber-500/20 disabled:opacity-50"
      >
        {sentSuccess ? (
          <span className="text-xs text-slate-950 font-black">تم الإرسال! ✓</span>
        ) : (
          <svg fill="none" viewBox="0 0 24 24" height="24px" width="24px" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" stroke="currentColor" d="M7.39999 6.32003L15.89 3.49003C19.7 2.22003 21.77 4.30003 20.51 8.11003L17.68 16.6C15.78 22.31 12.66 22.31 10.76 16.6L9.91999 14.08L7.39999 13.24C1.68999 11.34 1.68999 8.23003 7.39999 6.32003Z"></path>
            <path strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" stroke="currentColor" d="M10.11 13.6501L13.69 10.0601"></path>
          </svg>
        )}
      </button>
    </div>
  );
};
