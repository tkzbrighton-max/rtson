import React from 'react';
import { Eye, Clock, CheckCircle2, ArrowRight, DollarSign, Sparkles, Tag, MessageSquare } from 'lucide-react';
import { PortfolioItem } from '../types';
import studioWorkstationBg from '../assets/images/rtson_website_purple.svg';

interface PortfolioGridProps {
  items: PortfolioItem[];
  onSelectDesign: (item: PortfolioItem) => void;
  onOrderDesign: (item: PortfolioItem) => void;
}

export const PortfolioGrid: React.FC<PortfolioGridProps> = ({
  items,
  onSelectDesign,
  onOrderDesign
}) => {
  if (items.length === 0) {
    return (
      <div id="portfolio-grid-empty" className="py-20 text-center bg-[#050c18] text-slate-400">
        <Tag className="w-12 h-12 text-slate-600 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-white mb-1">No Designs Found</h3>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          No graphic design samples match your selected category or search filter. Try clearing your search query.
        </p>
      </div>
    );
  }

  return (
    <section id="portfolio-grid-section" className="relative py-12 bg-gradient-to-b from-[#050c18] via-[#081730] to-[#040a16] text-white min-h-[600px] overflow-hidden border-b border-[#1e3a8a]/30">
      
      {/* Background Tint */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-15 mix-blend-luminosity pointer-events-none"
        style={{ backgroundImage: `url(${studioWorkstationBg})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-[#050c18]/95 via-[#081832]/90 to-[#1f0c04]/80 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              Latest Graphic Design Works
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-gradient-to-r from-[#1e3a8a] to-[#2563eb] text-white shadow-sm">
                {items.length} Samples
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Click any artwork to inspect high-resolution details, print specifications, or calculate your custom rate.
            </p>
          </div>
        </div>

        {/* Masonry / Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="group relative bg-gradient-to-b from-[#091b38] to-[#061226] rounded-xl border border-[#1e3a8a]/40 hover:border-[#d4f15d]/70 transition-all duration-200 flex flex-col overflow-hidden shadow-lg shadow-black/40 hover:shadow-[#d4f15d]/10"
            >
              
              {/* Image Container */}
              <div 
                className="relative cursor-pointer overflow-hidden bg-[#040813] aspect-[3/4]"
                onClick={() => onSelectDesign(item)}
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />

                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-[#050c18]/40 group-hover:bg-[#050c18]/15 transition-colors" />

                {/* Badges */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                  <span className="px-2.5 py-1 rounded bg-[#050c18]/90 text-white text-[10px] font-bold uppercase tracking-wider border border-[#1e3a8a]/50 shadow-sm">
                    {item.categoryLabel}
                  </span>
                  <span className="px-2.5 py-1 rounded bg-[#0d222b] text-[#d4f15d] border border-teal-800/60 text-[10px] font-bold flex items-center gap-1 shadow-sm font-mono">
                    <Clock className="w-3 h-3 text-[#d4f15d]" />
                    {item.turnaroundHours}h Delivery
                  </span>
                </div>

                {/* Quick Inspect Button on Hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-[#050c18]/70">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectDesign(item);
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#0d234a] to-[#1e40af] text-white text-xs font-bold border border-blue-400 hover:to-[#2563eb] transition-all cursor-pointer shadow-lg shadow-blue-950/60"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View High-Res Artwork</span>
                  </button>
                </div>
              </div>

              {/* Content Body */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3 bg-gradient-to-b from-[#091b38] to-[#061226]">
                <div>
                  <h3 
                    onClick={() => onSelectDesign(item)}
                    className="font-bold text-white text-sm hover:text-[#d4f15d] transition-colors cursor-pointer line-clamp-1"
                  >
                    {item.title}
                  </h3>
                  <p className="text-slate-300 text-xs mt-1 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Feature Tags */}
                <div className="flex flex-wrap gap-1">
                  {item.tags.slice(0, 3).map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-[#050c18] text-slate-300 text-[10px] font-mono border border-[#1e3a8a]/30"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Action Footer */}
                <div className="pt-3 border-t border-[#1e3a8a]/30 flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold text-blue-300">
                    300 DPI Print Ready
                  </span>

                  <button
                    onClick={() => onOrderDesign(item)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#d4f15d] hover:bg-[#bef264] text-slate-950 font-black text-xs transition-all cursor-pointer shadow-md shadow-[#d4f15d]/20"
                  >
                    <span>Order Design</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-950" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
