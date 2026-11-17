import React from 'react';
import { 
  Shirt, 
  Pipette, 
  Eye, 
  RefreshCw 
} from 'lucide-react';
import { sound } from '../../lib/soundFx';

export const CLOTHES_COLOR_PALETTE = [
  { id: 'none', name: 'Original Color', hex: 'transparent', border: 'border-slate-500' },
  { id: 'orange', name: 'Electric Studio Orange', hex: '#ff6b00', hue: 25, sat: 100, light: 50 },
  { id: 'gold', name: 'Royal 24K Gold', hex: '#f59e0b', hue: 45, sat: 95, light: 52 },
  { id: 'navy', name: 'Midnight Navy', hex: '#1d4ed8', hue: 220, sat: 85, light: 45 },
  { id: 'crimson', name: 'Crimson Red', hex: '#dc2626', hue: 0, sat: 85, light: 48 },
  { id: 'emerald', name: 'Emerald Green', hex: '#059669', hue: 155, sat: 85, light: 42 },
  { id: 'purple', name: 'Imperial Purple', hex: '#7c3aed', hue: 270, sat: 85, light: 55 },
  { id: 'white', name: 'Crisp White', hex: '#f8fafc', hue: 0, sat: 5, light: 92 },
  { id: 'black', name: 'Obsidian Black', hex: '#0f172a', hue: 220, sat: 20, light: 15 },
  { id: 'pink', name: 'Vivid Magenta', hex: '#db2777', hue: 330, sat: 85, light: 50 },
  { id: 'cyan', name: 'Electric Cyan', hex: '#06b6d4', hue: 190, sat: 90, light: 45 },
];

interface ClothesShifterPanelProps {
  targetClothesColor: string;
  onSelectClothesColor: (swatch: typeof CLOTHES_COLOR_PALETTE[0]) => void;
  clothesIntensity: number;
  onSetClothesIntensity: (val: number) => void;
  clothesTolerance: number;
  onSetClothesTolerance: (val: number) => void;
  isEyedropperActive: boolean;
  onToggleEyedropper: () => void;
  showGarmentMask: boolean;
  onToggleGarmentMask: () => void;
  themeSwatchHex: string;
}

export const ClothesShifterPanel: React.FC<ClothesShifterPanelProps> = ({
  targetClothesColor,
  onSelectClothesColor,
  clothesIntensity,
  onSetClothesIntensity,
  clothesTolerance,
  onSetClothesTolerance,
  isEyedropperActive,
  onToggleEyedropper,
  showGarmentMask,
  onToggleGarmentMask
}) => {
  const activeSwatch = CLOTHES_COLOR_PALETTE.find(s => s.id === targetClothesColor) || CLOTHES_COLOR_PALETTE[0];

  const toleranceOptions = [
    { value: 35, label: 'Narrow Range (35%)' },
    { value: 55, label: 'Balanced (55%)' },
    { value: 75, label: 'Broad Range (75%)' }
  ];

  const intensityOptions = [
    { value: 50, label: 'Subtle Tint (50%)' },
    { value: 85, label: 'Rich Color (85%)' },
    { value: 100, label: 'Vibrant Solid (100%)' }
  ];

  return (
    <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-xl space-y-4 text-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
        <div className="flex items-center gap-2">
          <Shirt className="w-4 h-4 text-[#ff6b00]" />
          <h3 className="text-xs font-bold text-white">
            Garment Recoloring
          </h3>
        </div>
        <button 
          type="button"
          onClick={() => {
            onSelectClothesColor(CLOTHES_COLOR_PALETTE[0]);
          }}
          className="text-[10px] text-[#ff6b00] hover:underline flex items-center gap-1 cursor-pointer"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Target Color Dropdown */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-bold text-zinc-300">Target Fabric Color</label>
        <div className="relative">
          <select
            value={targetClothesColor}
            onChange={(e) => {
              sound.playClick();
              const found = CLOTHES_COLOR_PALETTE.find(s => s.id === e.target.value);
              if (found) onSelectClothesColor(found);
            }}
            className="w-full py-2.5 pl-9 pr-8 rounded-xl bg-neutral-900 border border-white/15 text-xs font-bold text-white focus:outline-none focus:border-[#ff6b00] cursor-pointer appearance-none min-h-[44px]"
          >
            {CLOTHES_COLOR_PALETTE.map((swatch) => (
              <option key={swatch.id} value={swatch.id}>
                {swatch.name}
              </option>
            ))}
          </select>
          
          {/* Swatch preview dot */}
          <div 
            className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border border-white/40 pointer-events-none"
            style={{ backgroundColor: activeSwatch.hex === 'transparent' ? '#64748b' : activeSwatch.hex }}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400 text-xs">
            ▼
          </div>
        </div>
      </div>

      {/* Quick Color Swatches Grid (compact) */}
      <div className="flex flex-wrap items-center gap-1.5 pt-1">
        {CLOTHES_COLOR_PALETTE.map((swatch) => (
          <button
            key={swatch.id}
            type="button"
            onClick={() => {
              sound.playClick();
              onSelectClothesColor(swatch);
            }}
            className={`w-6 h-6 rounded-lg border transition-all cursor-pointer ${
              targetClothesColor === swatch.id
                ? 'ring-2 ring-[#ff6b00] scale-110 shadow-md'
                : 'hover:scale-105 opacity-80 hover:opacity-100'
            }`}
            style={{ backgroundColor: swatch.hex === 'transparent' ? '#334155' : swatch.hex }}
            title={swatch.name}
          />
        ))}
      </div>

      {/* Pipette & Mask Controls */}
      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10">
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            onToggleEyedropper();
          }}
          className={`py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all border min-h-[40px] ${
            isEyedropperActive
              ? 'bg-[#ff6b00] text-black font-black border-[#ff6b00]'
              : 'bg-white/[0.04] text-zinc-200 border-white/15 hover:bg-white/[0.08]'
          }`}
        >
          <Pipette className={`w-3.5 h-3.5 ${isEyedropperActive ? 'text-black' : 'text-[#ff6b00]'}`} />
          <span>{isEyedropperActive ? 'Picking...' : 'Pick Fabric'}</span>
        </button>

        <button
          type="button"
          onClick={() => {
            sound.playClick();
            onToggleGarmentMask();
          }}
          className={`py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all border ${
            showGarmentMask
              ? 'bg-emerald-600 text-white border-emerald-400'
              : 'bg-white/[0.04] text-slate-200 border-white/15 hover:bg-white/[0.08]'
          }`}
        >
          <Eye className="w-3.5 h-3.5 text-emerald-400" />
          <span>{showGarmentMask ? 'Hide Mask' : 'View Mask'}</span>
        </button>
      </div>

      {/* Tolerance & Intensity Dropdowns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-white/10">
        <div className="space-y-1">
          <label className="text-[10px] text-slate-400 font-bold">Detection Range</label>
          <div className="relative">
            <select
              value={clothesTolerance}
              onChange={(e) => {
                sound.playClick();
                onSetClothesTolerance(Number(e.target.value));
              }}
              className="w-full py-1.5 px-2.5 rounded-lg bg-slate-900 border border-white/15 text-xs font-bold text-white focus:outline-none cursor-pointer appearance-none"
            >
              {toleranceOptions.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
              {!toleranceOptions.some(o => o.value === clothesTolerance) && (
                <option value={clothesTolerance}>Custom ({clothesTolerance}%)</option>
              )}
            </select>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
              ▼
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] text-slate-400 font-bold">Color Intensity</label>
          <div className="relative">
            <select
              value={clothesIntensity}
              onChange={(e) => {
                sound.playClick();
                onSetClothesIntensity(Number(e.target.value));
              }}
              className="w-full py-1.5 px-2.5 rounded-lg bg-slate-900 border border-white/15 text-xs font-bold text-white focus:outline-none cursor-pointer appearance-none"
            >
              {intensityOptions.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
              {!intensityOptions.some(o => o.value === clothesIntensity) && (
                <option value={clothesIntensity}>Custom ({clothesIntensity}%)</option>
              )}
            </select>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
              ▼
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
