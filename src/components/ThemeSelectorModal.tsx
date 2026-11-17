import React from 'react';
import { Palette, Check, Sparkles, X } from 'lucide-react';
import { useTheme, THEME_LIST } from '../context/ThemeContext';
import { sound } from '../lib/soundFx';

export const ThemeSelectorModal: React.FC = () => {
  const { theme, themeId, setThemeId, isThemePickerOpen, setIsThemePickerOpen } = useTheme();

  if (!isThemePickerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      
      {/* Backdrop Dismiss */}
      <div 
        className="absolute inset-0" 
        onClick={() => setIsThemePickerOpen(false)} 
      />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-md rounded-3xl bg-[#141720] border border-[#ff6b00]/40 shadow-2xl p-5 sm:p-6 space-y-4 sm:space-y-5 text-white animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2.5">
            <div 
              className="w-8 h-8 rounded-xl flex items-center justify-center shadow-md transition-colors bg-[#ff6b00] text-black font-black"
            >
              <Palette className="w-4 h-4 font-bold text-black" />
            </div>
            <div>
              <h2 className="text-base font-black text-white">
                Studio Color Palette
              </h2>
              <p className="text-[11px] text-slate-400">
                Electric Studio Orange, Slate Charcoal, and White
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              setIsThemePickerOpen(false);
            }}
            className="p-1.5 rounded-lg bg-[#181c24] hover:bg-[#1e232d] text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Theme List Selection */}
        <div className="space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
          {THEME_LIST.map((t) => {
            const isSelected = t.id === themeId;

            return (
              <button
                key={t.id}
                onClick={() => {
                  setThemeId(t.id);
                }}
                onMouseEnter={() => sound.playHover()}
                className={`w-full p-3.5 rounded-2xl flex items-center justify-between gap-3 text-left transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-[#1e232d] border-2 border-[#ff6b00] shadow-[0_0_20px_rgba(255,107,0,0.3)]'
                    : 'bg-[#181c24] hover:bg-[#1e232d] border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Visual Color Pill */}
                  <div className="flex items-center -space-x-1 shrink-0">
                    <div 
                      className="w-6 h-6 rounded-full border-2 border-black shadow"
                      style={{ backgroundColor: t.swatchHex }}
                    />
                    <div 
                      className="w-5 h-5 rounded-full border-2 border-black shadow opacity-85"
                      style={{ backgroundColor: t.secondaryHex }}
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-black ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                        {t.name}
                      </span>
                      {isSelected && (
                        <span 
                          className="text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider bg-[#ff6b00]/20 text-[#ff8800] border border-[#ff6b00]/40"
                        >
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {t.subtitle}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {isSelected ? (
                    <div 
                      className="w-6 h-6 rounded-full flex items-center justify-center bg-[#ff6b00] text-black font-black shadow-xs"
                    >
                      <Check className="w-3.5 h-3.5 font-bold text-black" />
                    </div>
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-neutral-700" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5 text-[11px]">
            <Sparkles className="w-3.5 h-3.5 text-[#ff8800]" />
            <span>Electric Orange &amp; Atelier Standards</span>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              setIsThemePickerOpen(false);
            }}
            className="px-4 py-2 rounded-xl bg-[#ff6b00] hover:bg-[#ff7a00] text-black font-black text-xs transition-colors cursor-pointer min-h-[40px]"
          >
            Apply &amp; Close
          </button>
        </div>

      </div>
    </div>
  );
};
