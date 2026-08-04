import React from 'react';
import { Home, Utensils, ArrowRight } from 'lucide-react';

interface NotFoundScreenProps {
  onNavigateHome: () => void;
  onNavigateMenu: () => void;
}

export const NotFoundScreen: React.FC<NotFoundScreenProps> = ({
  onNavigateHome,
  onNavigateMenu,
}) => {
  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center px-4 py-12 text-center select-none dir-rtl">
      {/* Retro TV 404 Wrapper */}
      <div className="tv-404-container scale-90 sm:scale-100 transition-all duration-300">
        <div className="main_wrapper">
          <div className="main">
            <div className="antenna">
              <div className="antenna_shadow"></div>
              <div className="a1"></div>
              <div className="a1d"></div>
              <div className="a2"></div>
              <div className="a2d"></div>
              <div className="a_base"></div>
            </div>
            <div className="tv">
              <div className="cruve">
                <svg
                  className="curve_svg"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 189.929 189.929"
                  xmlSpace="preserve"
                >
                  <path
                    d="M70.343,70.343c-30.554,30.553-44.806,72.7-39.102,115.635l-29.738,3.951C-5.442,137.659,11.917,86.34,49.129,49.13
                C86.34,11.918,137.664-5.445,189.928,1.502l-3.95,29.738C143.041,25.54,100.895,39.789,70.343,70.343z"
                  ></path>
                </svg>
              </div>
              <div className="display_div">
                <div className="screen_out">
                  <div className="screen_out1">
                    <div className="screen">
                      <span className="notfound_text">NOT FOUND</span>
                    </div>
                    <div className="screenM">
                      <span className="notfound_text">NOT FOUND</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="lines">
                <div className="line1"></div>
                <div className="line2"></div>
                <div className="line3"></div>
              </div>
              <div className="buttons_div">
                <div className="b1">
                  <div></div>
                </div>
                <div className="b2"></div>
                <div className="speakers">
                  <div className="g1">
                    <div className="g11"></div>
                    <div className="g12"></div>
                    <div className="g13"></div>
                  </div>
                  <div className="g"></div>
                  <div className="g"></div>
                </div>
              </div>
            </div>
            <div className="bottom">
              <div className="base1"></div>
              <div className="base2"></div>
              <div className="base3"></div>
            </div>
          </div>
          <div className="text_404">
            <div className="text_4041">4</div>
            <div className="text_4042">0</div>
            <div className="text_4043">4</div>
          </div>
        </div>
      </div>

      {/* Descriptive Text & Back Actions */}
      <div className="max-w-md mx-auto mt-2 space-y-3">
        <span className="inline-block px-3 py-1 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold text-xs border border-orange-500/20">
          خطأ 404 - الصفحة غير متوفرة 📺
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
          عذراً، الرابط غير صحيح!
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
          الصفحة التي تحاول الوصول إليها قد تكون حُذفت، أو تم تغيير عنوانها، أو غير متوفرة حالياً.
        </p>

        <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={onNavigateHome}
            className="px-5 py-2.5 rounded-2xl bg-orange-500 hover:bg-orange-600 text-slate-950 text-xs sm:text-sm font-black shadow-md shadow-orange-500/20 hover:shadow-lg transition-all flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            العودة للرئيسية
          </button>
          <button
            onClick={onNavigateMenu}
            className="px-5 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-black transition-all flex items-center gap-2 border border-slate-200 dark:border-slate-700"
          >
            <Utensils className="w-4 h-4" />
            تصفح المنيو
          </button>
        </div>
      </div>
    </div>
  );
};
