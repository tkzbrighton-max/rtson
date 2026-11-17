import React from 'react';
import { 
  ArrowLeft, 
  Layers, 
  Calculator, 
  Layout, 
  Wand2, 
  PlaySquare, 
  FileCheck, 
  Award, 
  ChevronRight,
  X
} from 'lucide-react';

interface ActiveViewHeaderProps {
  activeView: string;
  activeCategory: string;
  activeSubType?: string;
  activeCategoryLabel?: string;
  onBackToPortfolio: () => void;
  onOpenMenu: () => void;
  onOpenCalculator: () => void;
}

export const ActiveViewHeader: React.FC<ActiveViewHeaderProps> = ({
  activeView,
  activeCategory,
  activeSubType,
  activeCategoryLabel,
  onBackToPortfolio,
  onOpenMenu,
  onOpenCalculator
}) => {
  if (activeView === 'portfolio' && activeCategory === 'all' && !activeSubType) {
    return null; // Clean default home state
  }

  const getViewDetails = () => {
    switch (activeView) {
      case 'calculator':
        return {
          title: 'Price Calculator',
          badge: 'Live Quote',
          icon: <Calculator className="w-4 h-4 text-[#ff6b00]" />
        };
      case 'dimensions':
        return {
          title: 'Print & Social Dimensions Guide',
          badge: '300 DPI Specs',
          icon: <Layout className="w-4 h-4 text-white" />
        };
      case 'retouching':
        return {
          title: 'Photo Retouching & 3D Gold Studio',
          badge: 'Before / After',
          icon: <Wand2 className="w-4 h-4 text-[#ff6b00]" />
        };
      case 'video':
        return {
          title: 'Video & Motion Showcase',
          badge: 'Speed-Arts & MP4s',
          icon: <PlaySquare className="w-4 h-4 text-[#ff8800]" />
        };
      case 'comparison':
        return {
          title: 'Package Specs & Turnaround Matrix',
          badge: 'Deliverables',
          icon: <FileCheck className="w-4 h-4 text-emerald-400" />
        };
      case 'reviews':
        return {
          title: 'Client Reviews & Ratings',
          badge: '5.0 Score (500+)',
          icon: <Award className="w-4 h-4 text-yellow-400" />
        };
      default:
        return {
          title: activeCategoryLabel || 'Filtered Designs',
          badge: 'Category View',
          icon: <Layers className="w-4 h-4 text-[#ff6b00]" />
        };
    }
  };

  const details = getViewDetails();

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-6 my-4">
      <div className="px-4 py-3 rounded-2xl bg-[#141720] border border-white/10 shadow-md flex items-center justify-between gap-3 flex-wrap">
        
        {/* Left: Clean Icon & Title */}
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-xl bg-[#181c24] border border-white/10 shrink-0">
            {details.icon}
          </div>
          
          <div className="flex items-center gap-2">
            <h2 className="text-sm sm:text-base font-black text-white">
              {details.title}
            </h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#ff6b00]/15 text-[#ff8800] border border-[#ff6b00]/30">
              {details.badge}
            </span>
          </div>
        </div>

        {/* Right: Quick Back to All Button */}
        <div className="flex items-center gap-2">
          {activeView !== 'calculator' && (
            <button
              onClick={onOpenCalculator}
              className="text-xs font-black px-3.5 py-1.5 rounded-xl bg-[#ff6b00] hover:bg-[#ff7a00] text-black shadow-sm transition-all cursor-pointer min-h-[36px]"
            >
              Get Quote
            </button>
          )}

          <button
            onClick={onBackToPortfolio}
            className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-xl bg-[#181c24] hover:bg-[#1e232d] text-slate-200 border border-white/10 hover:text-white transition-colors cursor-pointer min-h-[36px]"
          >
            <X className="w-3.5 h-3.5 text-slate-400" />
            <span>Show All</span>
          </button>
        </div>

      </div>
    </div>
  );
};
