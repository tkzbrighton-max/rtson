import React from 'react';
import { 
  Scissors, 
  Wand2, 
  Sparkles,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { sound } from '../../lib/soundFx';

export type BgMode = 
  | 'original'
  | 'transparent'
  | 'clean_white'
  | 'black_stage'
  | 'gospel_gold'
  | 'neon_cyber'
  | 'cathedral'
  | 'custom_color';

export type BrushMode = 'none' | 'erase' | 'restore' | 'magic_wand' | 'protect';

interface BackgroundCutoutPanelProps {
  bgMode: BgMode;
  onSetBgMode: (mode: BgMode) => void;
  bgTolerance: number;
  onSetBgTolerance: (val: number) => void;
  edgeFeather: number;
  onSetEdgeFeather: (val: number) => void;
  autoDebrisClean: boolean;
  onSetAutoDebrisClean: (val: boolean | ((prev: boolean) => boolean)) => void;
  hairProtection: boolean;
  onSetHairProtection: (val: boolean | ((prev: boolean) => boolean)) => void;
  activeBrush: BrushMode;
  onSetActiveBrush: (brush: BrushMode) => void;
  manualStrokeCount: number;
  onPurgeDebris: () => void;
  themeSwatchHex: string;
  themeButtonPrimary: string;
}

export const BackgroundCutoutPanel: React.FC<BackgroundCutoutPanelProps> = ({
  bgMode,
  onSetBgMode,
  bgTolerance,
  onSetBgTolerance,
  edgeFeather,
  onSetEdgeFeather,
  autoDebrisClean,
  onSetAutoDebrisClean,
  hairProtection,
  onSetHairProtection,
  onPurgeDebris,
  themeSwatchHex,
  themeButtonPrimary
}) => {
  const backdropOptions = [
    { value: 'original', label: 'Original Backdrop' },
    { value: 'transparent', label: 'Transparent Cutout (PNG)' },
    { value: 'clean_white', label: 'Studio White' },
    { value: 'black_stage', label: 'Obsidian Black' },
    { value: 'gospel_gold', label: '3D Gold Glow' },
    { value: 'neon_cyber', label: 'Cyber Neon' }
  ];

  const tolerancePresets = [
    { value: 25, label: 'Fine (25%)' },
    { value: 45, label: 'Standard (45%)' },
    { value: 65, label: 'Aggressive (65%)' },
    { value: 85, label: 'Maximum (85%)' }
  ];

  const featherPresets = [
    { value: 0, label: 'Sharp (0px)' },
    { value: 2, label: 'Delicate (2px)' },
    { value: 4, label: 'Smooth (4px)' },
    { value: 8, label: 'Soft Edge (8px)' }
  ];

  return (
    <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-xl space-y-4 text-white">
      
      {/* Category 1: Backdrop Mode */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
            <Scissors className="w-3.5 h-3.5" style={{ color: themeSwatchHex }} />
            <span>Backdrop Mode</span>
          </label>
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onSetBgMode(bgMode === 'original' ? 'transparent' : 'original');
            }}
            className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
              bgMode === 'original'
                ? `${themeButtonPrimary} text-white`
                : 'bg-white/10 text-slate-300'
            }`}
          >
            {bgMode === 'original' ? 'Cutout' : 'Restore'}
          </button>
        </div>

        <div className="relative">
          <select
            value={bgMode}
            onChange={(e) => {
              sound.playClick();
              onSetBgMode(e.target.value as BgMode);
            }}
            className="w-full py-2.5 px-3 rounded-xl bg-neutral-900 border border-white/15 text-xs font-bold text-white focus:outline-none focus:border-[#ff6b00] cursor-pointer appearance-none min-h-[44px]"
          >
            {backdropOptions.map(opt => (
              <option key={opt.value} value={opt.value} className="bg-neutral-900 text-white">
                {opt.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400 text-xs">
            ▼
          </div>
        </div>
      </div>

      {/* Category 2: Edge Tuning via Dropdowns & Sliders */}
      <div className="space-y-3 pt-3 border-t border-white/10">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-zinc-200">Edge Refinement</span>
          <button
            type="button"
            onClick={onPurgeDebris}
            className="text-[10px] font-bold text-[#ff6b00] hover:text-[#ff7a00] flex items-center gap-1 cursor-pointer"
            title="Clean edges"
          >
            <Wand2 className="w-3 h-3" />
            <span>Refine</span>
          </button>
        </div>

        {/* Cutout Tolerance Dropdown */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] text-zinc-300">
            <span>Sensitivity</span>
            <span className="font-mono text-[#ff6b00]">{bgTolerance}%</span>
          </div>
          <div className="relative">
            <select
              value={bgTolerance}
              onChange={(e) => {
                sound.playClick();
                onSetBgTolerance(Number(e.target.value));
              }}
              className="w-full py-2 px-3 rounded-xl bg-neutral-900 border border-white/15 text-xs font-bold text-white focus:outline-none cursor-pointer appearance-none"
            >
              {tolerancePresets.map(preset => (
                <option key={preset.value} value={preset.value}>
                  {preset.label}
                </option>
              ))}
              {!tolerancePresets.some(p => p.value === bgTolerance) && (
                <option value={bgTolerance}>Custom ({bgTolerance}%)</option>
              )}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400 text-xs">
              ▼
            </div>
          </div>
          <input
            type="range"
            min="15"
            max="85"
            value={bgTolerance}
            onChange={(e) => onSetBgTolerance(Number(e.target.value))}
            className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-[#ff6b00] mt-1"
          />
        </div>

        {/* Edge Feather Dropdown */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] text-zinc-300">
            <span>Edge Softness</span>
            <span className="font-mono text-zinc-300">{edgeFeather}px</span>
          </div>
          <div className="relative">
            <select
              value={edgeFeather}
              onChange={(e) => {
                sound.playClick();
                onSetEdgeFeather(Number(e.target.value));
              }}
              className="w-full py-2 px-3 rounded-xl bg-neutral-900 border border-white/15 text-xs font-bold text-white focus:outline-none cursor-pointer appearance-none"
            >
              {featherPresets.map(preset => (
                <option key={preset.value} value={preset.value}>
                  {preset.label}
                </option>
              ))}
              {!featherPresets.some(p => p.value === edgeFeather) && (
                <option value={edgeFeather}>Custom ({edgeFeather}px)</option>
              )}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400 text-xs">
              ▼
            </div>
          </div>
        </div>
      </div>

      {/* Category 3: Auto-Protection Toggles */}
      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/10">
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            onSetAutoDebrisClean(prev => !prev);
          }}
          className={`py-2 px-2.5 rounded-xl border text-xs font-bold flex items-center justify-between cursor-pointer transition-all ${
            autoDebrisClean 
              ? 'bg-[#ff6b00]/15 border-[#ff6b00]/40 text-[#ff6b00]' 
              : 'bg-white/[0.03] border-white/10 text-zinc-400'
          }`}
        >
          <span>Clean Artifacts</span>
          <span className={`w-2 h-2 rounded-full ${autoDebrisClean ? 'bg-[#ff6b00]' : 'bg-neutral-600'}`} />
        </button>

        <button
          type="button"
          onClick={() => {
            sound.playClick();
            onSetHairProtection(prev => !prev);
          }}
          className={`py-2 px-2.5 rounded-xl border text-xs font-bold flex items-center justify-between cursor-pointer transition-all ${
            hairProtection 
              ? 'bg-blue-500/15 border-blue-500/40 text-blue-300' 
              : 'bg-white/[0.03] border-white/10 text-slate-400'
          }`}
        >
          <span>Protect Hair</span>
          <span className={`w-2 h-2 rounded-full ${hairProtection ? 'bg-blue-400' : 'bg-slate-600'}`} />
        </button>
      </div>

    </div>
  );
};
