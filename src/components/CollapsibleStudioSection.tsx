import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

interface CollapsibleStudioSectionProps {
  id: string;
  title: string;
  subtitle: string;
  badgeText?: string;
  badgeColor?: string;
  icon: React.ReactNode;
  defaultOpen?: boolean;
  isOpenControlled?: boolean;
  onToggle?: (isOpen: boolean) => void;
  children: React.ReactNode;
}

export const CollapsibleStudioSection: React.FC<CollapsibleStudioSectionProps> = ({
  id,
  title,
  subtitle,
  badgeText,
  badgeColor = 'text-[#d4f15d] bg-[#0a1f42] border-[#d4f15d]/40',
  icon,
  defaultOpen = false,
  isOpenControlled,
  onToggle,
  children
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(defaultOpen);

  useEffect(() => {
    if (isOpenControlled !== undefined) {
      setIsOpen(isOpenControlled);
    }
  }, [isOpenControlled]);

  const handleToggle = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    if (onToggle) onToggle(nextState);
  };

  return (
    <div id={id} className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 my-6 sm:my-8 transition-all">
      <div className={`rounded-3xl border transition-all duration-300 overflow-hidden shadow-2xl ${
        isOpen 
          ? 'bg-gradient-to-b from-[#091b38] via-[#06142a] to-[#040c1a] border-[#1e3a8a]/60 shadow-blue-950/40' 
          : 'bg-[#061124]/90 hover:bg-[#081832] border-[#1e3a8a]/40 hover:border-[#d4f15d]/40 shadow-black/60'
      }`}>
        
        {/* Accordion Dropdown Toggle Bar */}
        <button
          onClick={handleToggle}
          className="w-full p-4 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer group transition-colors"
          aria-expanded={isOpen}
        >
          <div className="flex items-center gap-3.5 sm:gap-5 min-w-0">
            
            {/* Section Icon Box */}
            <div className={`w-11 h-11 sm:w-13 sm:h-13 rounded-2xl flex items-center justify-center shrink-0 border transition-all ${
              isOpen
                ? 'bg-gradient-to-br from-[#1e3a8a] to-[#0a2348] border-[#d4f15d]/50 shadow-lg shadow-black/40 text-[#d4f15d]'
                : 'bg-[#091834] group-hover:bg-[#0d2248] border-[#1e3a8a]/50 text-slate-300 group-hover:text-white'
            }`}>
              {icon}
            </div>

            {/* Title & Subtitle */}
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-0.5">
                <h3 className="text-base sm:text-lg font-black text-white group-hover:text-[#d4f15d] transition-colors tracking-tight truncate">
                  {title}
                </h3>
                {badgeText && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${badgeColor}`}>
                    {badgeText}
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-slate-400 group-hover:text-slate-300 transition-colors line-clamp-1">
                {subtitle}
              </p>
            </div>

          </div>

          {/* Expand/Collapse Dropdown Indicator */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="hidden md:inline-block text-xs font-bold text-slate-400 group-hover:text-[#d4f15d] transition-colors">
              {isOpen ? 'Collapse Section' : 'Expand Dropdown'}
            </span>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all ${
              isOpen 
                ? 'bg-[#d4f15d] border-[#bef264] text-slate-950 shadow-md' 
                : 'bg-[#091834] group-hover:bg-[#0f2752] border-[#1e3a8a]/40 text-slate-300 group-hover:text-white'
            }`}>
              {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />}
            </div>
          </div>
        </button>

        {/* Expandable Content Body */}
        {isOpen && (
          <div className="border-t border-[#1e3a8a]/40 animate-in fade-in slide-in-from-top-4 duration-300">
            {children}
          </div>
        )}

      </div>
    </div>
  );
};
