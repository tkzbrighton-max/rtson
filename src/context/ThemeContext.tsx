import React, { createContext, useContext, useState, useEffect } from 'react';
import { sound } from '../lib/soundFx';

export type ThemeId = 'blaze-orange' | 'solar-amber' | 'monochrome-orange' | 'deep-terracotta' | 'pure-obsidian';

export interface StudioTheme {
  id: ThemeId;
  name: string;
  subtitle: string;
  swatchHex: string;
  secondaryHex: string;
  
  // Heading Styling
  headingGradient: string;
  headingAccent: string;
  subheadingColor: string;
  
  // Motto Highlights
  visionsClass: string;
  realitiesClass: string;
  
  // Badges, Borders & Highlights
  badgeClass: string;
  borderAccent: string;
  borderGlow: string;
  haloColor: string;
  
  // Buttons & Active Tabs
  buttonPrimary: string;
  buttonSecondary: string;
  activeNavClass: string;
  activeDeskTab: string;
  
  // Glow / Ring Colors
  ringAccent: string;
  iconAccent: string;
}

// All themes are strictly mapped to Black, White, and Orange variations per user mandate
export const STUDIO_THEMES: Record<ThemeId, StudioTheme> = {
  'blaze-orange': {
    id: 'blaze-orange',
    name: 'Electric Studio Orange',
    subtitle: 'Signature Atelier Orange & Obsidian',
    swatchHex: '#ff6b00',
    secondaryHex: '#ff8800',
    headingGradient: 'bg-gradient-to-r from-white via-orange-100 to-[#ff6b00] bg-clip-text text-transparent',
    headingAccent: 'text-[#ff6b00]',
    subheadingColor: 'text-orange-200/90',
    visionsClass: 'text-[#ff6b00] font-bold',
    realitiesClass: 'text-[#ff8800] font-extrabold',
    badgeClass: 'bg-[#ff6b00]/10 text-[#ff6b00] border-[#ff6b00]/30',
    borderAccent: 'border-[#ff6b00]/30',
    borderGlow: 'shadow-[#ff6b00]/25',
    haloColor: 'rgba(255, 107, 0, 0.25)',
    buttonPrimary: 'bg-[#ff6b00] hover:bg-[#ff7a00] text-black font-black shadow-md shadow-[#ff6b00]/20',
    buttonSecondary: 'bg-[#141720] hover:bg-[#1e232d] text-white border border-[#ff6b00]/30',
    activeNavClass: 'bg-[#181c24] text-[#ff6b00] border-[#ff6b00]/50 shadow-sm',
    activeDeskTab: 'bg-[#181c24] border-[#ff6b00]/60 text-[#ff6b00]',
    ringAccent: 'focus:ring-[#ff6b00]/40',
    iconAccent: 'text-[#ff6b00]'
  },
  'solar-amber': {
    id: 'solar-amber',
    name: 'Sunset Flame Orange',
    subtitle: 'Warm Radiant Flame',
    swatchHex: '#f97316',
    secondaryHex: '#fb923c',
    headingGradient: 'bg-gradient-to-r from-white via-amber-100 to-[#f97316] bg-clip-text text-transparent',
    headingAccent: 'text-[#f97316]',
    subheadingColor: 'text-orange-100',
    visionsClass: 'text-[#f97316] font-bold',
    realitiesClass: 'text-[#fb923c] font-extrabold',
    badgeClass: 'bg-[#f97316]/10 text-[#f97316] border-[#f97316]/30',
    borderAccent: 'border-[#f97316]/30',
    borderGlow: 'shadow-[#f97316]/20',
    haloColor: 'rgba(249, 115, 22, 0.25)',
    buttonPrimary: 'bg-[#f97316] hover:bg-[#ea580c] text-black font-black shadow-md shadow-[#f97316]/20',
    buttonSecondary: 'bg-[#141720] hover:bg-[#1e232d] text-white border border-[#f97316]/30',
    activeNavClass: 'bg-[#181c24] text-[#f97316] border-[#f97316]/40',
    activeDeskTab: 'bg-[#181c24] border-[#f97316]/50 text-[#f97316]',
    ringAccent: 'focus:ring-[#f97316]/40',
    iconAccent: 'text-[#f97316]'
  },
  'monochrome-orange': {
    id: 'monochrome-orange',
    name: 'Obsidian, Pure White & Orange',
    subtitle: 'High-Contrast Monochrome & Pop',
    swatchHex: '#ff5500',
    secondaryHex: '#ffffff',
    headingGradient: 'bg-gradient-to-r from-white via-neutral-200 to-[#ff5500] bg-clip-text text-transparent',
    headingAccent: 'text-[#ff5500]',
    subheadingColor: 'text-neutral-300',
    visionsClass: 'text-white font-bold',
    realitiesClass: 'text-[#ff5500] font-extrabold',
    badgeClass: 'bg-[#ff5500]/10 text-[#ff5500] border-[#ff5500]/30',
    borderAccent: 'border-[#ff5500]/30',
    borderGlow: 'shadow-[#ff5500]/20',
    haloColor: 'rgba(255, 85, 0, 0.25)',
    buttonPrimary: 'bg-white hover:bg-neutral-200 text-black font-black shadow-md',
    buttonSecondary: 'bg-[#141720] hover:bg-[#1e232d] text-[#ff5500] border border-[#ff5500]/30',
    activeNavClass: 'bg-[#181c24] text-white border-white/40',
    activeDeskTab: 'bg-[#181c24] border-white/50 text-[#ff5500]',
    ringAccent: 'focus:ring-white/40',
    iconAccent: 'text-[#ff5500]'
  },
  'deep-terracotta': {
    id: 'deep-terracotta',
    name: 'Deep Copper & Ember',
    subtitle: 'Rich Burnished Studio Tones',
    swatchHex: '#ea580c',
    secondaryHex: '#f97316',
    headingGradient: 'bg-gradient-to-r from-white via-orange-100 to-[#ea580c] bg-clip-text text-transparent',
    headingAccent: 'text-[#ea580c]',
    subheadingColor: 'text-orange-200/80',
    visionsClass: 'text-[#ea580c] font-bold',
    realitiesClass: 'text-[#f97316] font-extrabold',
    badgeClass: 'bg-[#ea580c]/10 text-[#ea580c] border-[#ea580c]/30',
    borderAccent: 'border-[#ea580c]/30',
    borderGlow: 'shadow-[#ea580c]/25',
    haloColor: 'rgba(234, 88, 12, 0.25)',
    buttonPrimary: 'bg-[#ea580c] hover:bg-[#c2410c] text-white font-black shadow-md',
    buttonSecondary: 'bg-[#141720] hover:bg-[#1e232d] text-orange-200 border border-[#ea580c]/30',
    activeNavClass: 'bg-[#181c24] text-[#ea580c] border-[#ea580c]/40',
    activeDeskTab: 'bg-[#181c24] border-[#ea580c]/50 text-[#ea580c]',
    ringAccent: 'focus:ring-[#ea580c]/40',
    iconAccent: 'text-[#ea580c]'
  },
  'pure-obsidian': {
    id: 'pure-obsidian',
    name: 'Pure Obsidian & Neon Orange',
    subtitle: 'Stark Jet Black & Hot Orange',
    swatchHex: '#ff6b00',
    secondaryHex: '#ffffff',
    headingGradient: 'bg-gradient-to-r from-white via-neutral-100 to-[#ff6b00] bg-clip-text text-transparent',
    headingAccent: 'text-[#ff6b00]',
    subheadingColor: 'text-neutral-200/90',
    visionsClass: 'text-white font-bold',
    realitiesClass: 'text-[#ff6b00] font-extrabold',
    badgeClass: 'bg-[#ff6b00]/15 text-[#ff6b00] border-[#ff6b00]/40',
    borderAccent: 'border-[#ff6b00]/40',
    borderGlow: 'shadow-[#ff6b00]/30',
    haloColor: 'rgba(255, 107, 0, 0.3)',
    buttonPrimary: 'bg-[#ff6b00] hover:bg-[#ff7a00] text-black font-black shadow-md',
    buttonSecondary: 'bg-[#141720] hover:bg-[#1e232d] text-white border border-[#ff6b00]/40',
    activeNavClass: 'bg-[#181c24] text-[#ff6b00] border-[#ff6b00]/50',
    activeDeskTab: 'bg-[#181c24] border-[#ff6b00]/60 text-[#ff6b00]',
    ringAccent: 'focus:ring-[#ff6b00]/50',
    iconAccent: 'text-[#ff6b00]'
  }
};

export const THEME_LIST: StudioTheme[] = Object.values(STUDIO_THEMES);

interface ThemeContextType {
  theme: StudioTheme;
  themeId: ThemeId;
  setThemeId: (id: ThemeId, silent?: boolean) => void;
  cycleNextTheme: () => void;
  isThemePickerOpen: boolean;
  setIsThemePickerOpen: (open: boolean) => void;
  openThemeModal: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeId, setThemeIdState] = useState<ThemeId>('blaze-orange');

  // Enforce Orange, Black and White palette across all sessions
  useEffect(() => {
    try {
      localStorage.setItem('rtson_studio_theme', 'blaze-orange');
    } catch {
      // Ignore
    }
  }, []);

  const [isThemePickerOpen, setIsThemePickerOpen] = useState<boolean>(false);

  const setThemeId = (id: ThemeId, silent = false) => {
    if (!silent) {
      sound.playPop();
    }
    const safeId = STUDIO_THEMES[id] ? id : 'blaze-orange';
    setThemeIdState(safeId);
    try {
      localStorage.setItem('rtson_studio_theme', safeId);
    } catch {
      // Ignore
    }
  };

  const cycleNextTheme = () => {
    const list: ThemeId[] = ['blaze-orange', 'solar-amber', 'monochrome-orange', 'deep-terracotta', 'pure-obsidian'];
    const nextIdx = (list.indexOf(themeId) + 1) % list.length;
    setThemeId(list[nextIdx]);
  };

  const openThemeModal = () => {
    sound.playPop();
    setIsThemePickerOpen(true);
  };

  const theme = STUDIO_THEMES[themeId] || STUDIO_THEMES['blaze-orange'];

  return (
    <ThemeContext.Provider
      value={{
        theme,
        themeId,
        setThemeId,
        cycleNextTheme,
        isThemePickerOpen,
        setIsThemePickerOpen,
        openThemeModal
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    return {
      theme: STUDIO_THEMES['blaze-orange'],
      themeId: 'blaze-orange',
      setThemeId: () => {},
      cycleNextTheme: () => {},
      isThemePickerOpen: false,
      setIsThemePickerOpen: () => {},
      openThemeModal: () => {}
    };
  }
  return context;
};
