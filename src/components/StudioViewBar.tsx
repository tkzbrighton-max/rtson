import React, { useState } from 'react';
import { 
  Eye, 
  ChevronDown, 
  Layers, 
  Calculator, 
  Layout, 
  Wand2, 
  PlaySquare, 
  FileCheck, 
  Award, 
  Maximize2, 
  Minimize2,
  ShieldCheck
} from 'lucide-react';

interface StudioViewBarProps {
  activeView: string;
  onSelectView: (viewId: string) => void;
  allExpanded: boolean;
  onToggleExpandAll: () => void;
}

export const StudioViewBar: React.FC<StudioViewBarProps> = ({
  activeView,
  onSelectView,
  allExpanded,
  onToggleExpandAll
}) => {
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

  const views = [
    { id: 'portfolio', label: 'Design Portfolio Showcase', description: 'Browse flyers, brochures, slides & social art', icon: Layers },
    { id: 'calculator', label: 'Interactive Price Calculator', description: 'Build packages, add-ons & live quote', icon: Calculator },
    { id: 'dimensions', label: 'Dimensions & Print Cheat-Sheet', description: 'Pixel resolutions, 300 DPI bleed & margins', icon: Layout },
    { id: 'retouching', label: 'Before & After Retouching Slider', description: 'Inspect 300 DPI portrait cutouts & 3D text', icon: Wand2 },
    { id: 'video', label: 'Video & Motion Workstation', description: 'Watch Photoshop design workflows & motion flyers', icon: PlaySquare },
    { id: 'comparison', label: 'Deliverables & Specs Breakdown', description: 'Turnaround matrix, file formats & revisions', icon: FileCheck },
    { id: 'reviews', label: 'Client Reviews & Testimonials', description: '500+ past client ratings & verified feedback', icon: Award },
  ];

  const currentView = views.find(v => v.id === activeView) || views[0];
  const CurrentIcon = currentView.icon;

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 mt-6 mb-2">
      <div className="p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-[#091b38] via-[#0b244d] to-[#1c0c05] border border-[#1e3a8a]/60 shadow-lg shadow-black/40 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        
        {/* Active View Dropdown Selector */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider hidden md:inline">
            Studio Navigation:
          </span>

          <div className="relative flex-1 sm:flex-initial">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full sm:w-auto flex items-center justify-between sm:justify-start gap-2.5 px-4 py-2 rounded-xl bg-[#061226] hover:bg-[#081832] border border-[#1e3a8a]/50 hover:border-[#d4f15d]/50 text-white font-bold text-xs shadow-inner transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2 truncate">
                <CurrentIcon className="w-4 h-4 text-[#d4f15d] shrink-0" />
                <span className="truncate">{currentView.label}</span>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform shrink-0 ${dropdownOpen ? 'rotate-180 text-[#d4f15d]' : ''}`} />
            </button>

            {dropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-72 sm:w-80 bg-[#061226] border border-[#1e3a8a]/80 rounded-2xl p-2 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1.5 border-b border-[#1e3a8a]/30 mb-1 flex items-center justify-between">
                  <span>Switch Studio View / Section</span>
                  <span className="text-[#bef264]">Quick Dropdown</span>
                </div>
                <div className="space-y-1">
                  {views.map((v) => {
                    const Icon = v.icon;
                    const isSelected = activeView === v.id;

                    return (
                      <button
                        key={v.id}
                        onClick={() => {
                          onSelectView(v.id);
                          setDropdownOpen(false);
                        }}
                        className={`w-full text-left p-2 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-gradient-to-r from-[#1e3a8a] to-[#2563eb] text-white shadow-sm'
                            : 'text-slate-300 hover:bg-[#0a1e42] hover:text-white'
                        }`}
                      >
                        <div className="p-1.5 rounded-lg bg-black/30 border border-[#1e3a8a]/40 shrink-0">
                          <Icon className="w-3.5 h-3.5 text-[#d4f15d]" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="truncate">{v.label}</div>
                          <div className="text-[10px] text-slate-400 truncate">{v.description}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Expand/Collapse All Sections Toggle */}
        <div className="flex items-center justify-between sm:justify-end gap-2">
          <span className="text-[11px] text-slate-400 hidden lg:inline">
            Swipe-down organized with dropdowns
          </span>

          <button
            onClick={onToggleExpandAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#061226] hover:bg-[#081832] border border-[#1e3a8a]/40 text-slate-300 hover:text-white text-xs font-bold transition-colors cursor-pointer"
          >
            {allExpanded ? (
              <>
                <Minimize2 className="w-3.5 h-3.5 text-[#d4f15d]" />
                <span>Compact Dropdown Mode</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5 text-blue-400" />
                <span>Expand All Dropdowns</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
