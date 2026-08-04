import React, { useState, useEffect } from 'react';
import { Dices, Sparkles, Clock, CheckCircle2, Trophy, X } from 'lucide-react';

interface DiceGameWidgetProps {
  restaurantId: string;
  currency: string;
  onApplyDiscount?: (amount: number) => void;
  onClose?: () => void;
}

export const DiceGameWidget: React.FC<DiceGameWidgetProps> = ({
  restaurantId,
  currency,
  onApplyDiscount,
  onClose,
}) => {
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [dice1, setDice1] = useState<number>(5);
  const [dice2, setDice2] = useState<number>(3);
  const [totalScore, setTotalScore] = useState<number | null>(null);
  const [canRoll, setCanRoll] = useState<boolean>(true);
  const [nextRollTime, setNextRollTime] = useState<string>('');
  const [hasWon, setHasWon] = useState<boolean>(false);

  const storageKey = `menuz_dice_last_roll_${restaurantId}`;

  useEffect(() => {
    checkCooldown();
  }, [restaurantId]);

  const checkCooldown = () => {
    const lastRoll = localStorage.getItem(storageKey);
    if (lastRoll) {
      const lastRollDate = new Date(lastRoll).getTime();
      const now = new Date().getTime();
      const hoursPassed = (now - lastRollDate) / (1000 * 60 * 60);

      if (hoursPassed < 48) {
        setCanRoll(false);
        const remainingHours = Math.floor(48 - hoursPassed);
        const remainingMinutes = Math.floor(((48 - hoursPassed) % 1) * 60);
        setNextRollTime(`${remainingHours} ساعة و ${remainingMinutes} دقيقة`);
      } else {
        setCanRoll(true);
      }
    } else {
      setCanRoll(true);
    }
  };

  const handleToggleRoll = () => {
    if (!canRoll) return;

    if (!isRolling) {
      setIsRolling(true);
      setTotalScore(null);
      setHasWon(false);
    } else {
      setIsRolling(false);
      const res1 = Math.floor(Math.random() * 6) + 1;
      const res2 = Math.floor(Math.random() * 6) + 1;
      setDice1(res1);
      setDice2(res2);
      const total = res1 + res2;
      setTotalScore(total);
      setHasWon(true);

      localStorage.setItem(storageKey, new Date().toISOString());
      setCanRoll(false);

      setTimeout(() => {
        checkCooldown();
      }, 500);
    }
  };

  const handleClaim = () => {
    if (totalScore && onApplyDiscount) {
      onApplyDiscount(totalScore);
    }
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl max-w-md w-full mx-auto relative overflow-hidden dir-rtl">
      <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center font-black">
            <Dices className="w-5 h-5 animate-bounce" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-1.5">
              لعبة حجار نيرد 🎲
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bold">
              ارمي النرد واربح خصم فوري لنقاط طاولتك!
            </p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {!canRoll && (
        <div className="mb-4 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-bold flex items-center gap-2">
          <Clock className="w-4 h-4 shrink-0 text-amber-500" />
          <span>
            مسموح رمي النرد مرة واحدة كل 48 ساعة. يمكنك اللعب مجدداً بعد:{' '}
            <strong className="font-mono underline">{nextRollTime}</strong>
          </span>
        </div>
      )}

      <div className="dice-game-card my-4">
        <input
          type="checkbox"
          id="rollToggle"
          className="roll-toggle"
          checked={isRolling}
          onChange={() => {}}
        />

        <div className={`result ${totalScore !== null ? 'show-result' : ''}`}>
          {totalScore}
        </div>

        <div className="dice-area">
          <div className="dice dice1">
            <div className={`face ${dice1 === 1 ? 'front' : dice1 === 2 ? 'back' : dice1 === 3 ? 'right' : dice1 === 4 ? 'left' : dice1 === 5 ? 'top' : 'bottom'}`} data-value={dice1}>
              <div className="dots">
                {Array.from({ length: dice1 }).map((_, i) => (
                  <span key={i} />
                ))}
              </div>
            </div>
            <div className="face front" data-value="1">
              <div className="dots"><span></span></div>
            </div>
            <div className="face back" data-value="2">
              <div className="dots"><span></span><span></span></div>
            </div>
            <div className="face right" data-value="3">
              <div className="dots"><span></span><span></span><span></span></div>
            </div>
            <div className="face left" data-value="4">
              <div className="dots"><span></span><span></span><span></span><span></span></div>
            </div>
            <div className="face top" data-value="5">
              <div className="dots"><span></span><span></span><span></span><span></span><span></span></div>
            </div>
            <div className="face bottom" data-value="6">
              <div className="dots"><span></span><span></span><span></span><span></span><span></span><span></span></div>
            </div>
          </div>

          <div className="dice dice2">
            <div className={`face ${dice2 === 1 ? 'front' : dice2 === 2 ? 'back' : dice2 === 3 ? 'right' : dice2 === 4 ? 'left' : dice2 === 5 ? 'top' : 'bottom'}`} data-value={dice2}>
              <div className="dots">
                {Array.from({ length: dice2 }).map((_, i) => (
                  <span key={i} />
                ))}
              </div>
            </div>
            <div className="face front" data-value="1">
              <div className="dots"><span></span></div>
            </div>
            <div className="face back" data-value="2">
              <div className="dots"><span></span><span></span></div>
            </div>
            <div className="face right" data-value="3">
              <div className="dots"><span></span><span></span><span></span></div>
            </div>
            <div className="face left" data-value="4">
              <div className="dots"><span></span><span></span><span></span><span></span></div>
            </div>
            <div className="face top" data-value="5">
              <div className="dots"><span></span><span></span><span></span><span></span><span></span></div>
            </div>
            <div className="face bottom" data-value="6">
              <div className="dots"><span></span><span></span><span></span><span></span><span></span><span></span></div>
            </div>
          </div>
        </div>

        <div className="controls">
          <label
            onClick={handleToggleRoll}
            className={`btn ${!canRoll && !isRolling ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
          >
            <span className="btn-text">{isRolling ? 'STOP' : 'ROLL'}</span>
          </label>
        </div>
      </div>

      {hasWon && totalScore !== null && (
        <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 text-center animate-fade-in space-y-3">
          <div className="flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400 font-black text-base">
            <Trophy className="w-5 h-5 text-amber-500 animate-bounce" />
            <span>مبروك! نتيجتك هي {totalScore} نقطة 🎉</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 font-bold">
            حصلت على خصم بمقدار <span className="font-black text-emerald-600 dark:text-emerald-400 font-mono text-sm">{totalScore} {currency}</span> على طلبك الحالي في المطعم!
          </p>

          <button
            onClick={handleClaim}
            className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            تطبيق الخصم على الفاتورة الحالية
          </button>
        </div>
      )}

      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 text-center font-bold flex items-center justify-center gap-1">
        <Sparkles className="w-3.5 h-3.5 text-orange-500" />
        <span>قواعد اللعبة: مجموع حجري النرد يمنحك خصماً مباشراً للطاولة.</span>
      </div>
    </div>
  );
};
