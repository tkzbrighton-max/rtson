import React from 'react';
import { X, Clock, CheckCircle2, ArrowRight, MessageSquare, Mail } from 'lucide-react';
import { PortfolioItem } from '../types';

interface LightboxModalProps {
  item: PortfolioItem | null;
  onClose: () => void;
  onOrderThisStyle: (item: PortfolioItem) => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  item,
  onClose,
  onOrderThisStyle
}) => {
  if (!item) return null;

  return (
    <div id="lightbox-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/90 overflow-y-auto">
      
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-auto">
        
        {/* Terminal Header */}
        <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-500 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-[#d4f15d] inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-white inline-block"></span>
            <span className="text-xs font-mono font-bold text-slate-300 ml-2">
              TERMINAL // ARTWORK INSPECTOR
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 max-h-[85vh] overflow-y-auto scrollbar-none">
          
          {/* Left Artwork Column */}
          <div className="md:col-span-7 bg-slate-950 p-4 sm:p-6 flex items-center justify-center border-b md:border-b-0 md:border-r border-slate-800 relative min-h-[260px] sm:min-h-[360px]">
            <div className="relative max-h-[500px] w-full flex items-center justify-center">
              <img
                src={item.imageUrl}
                alt={item.title}
                loading="eager"
                decoding="async"
                referrerPolicy="no-referrer"
                className="max-h-[380px] sm:max-h-[500px] w-auto max-w-full object-contain rounded-xl shadow-2xl border border-slate-800"
              />
            </div>
            
            {/* Dimensions Badge */}
            <div className="absolute bottom-3 left-3 px-2.5 sm:px-3 py-1 rounded-md bg-slate-900/90 backdrop-blur-sm border border-slate-800 text-[10px] sm:text-[11px] text-slate-300 font-mono">
              Format: {item.dimensionsLabel || 'High Resolution Digital & Print'}
            </div>
          </div>

          {/* Right Specs Column */}
          <div className="md:col-span-5 p-6 flex flex-col justify-between space-y-6 bg-slate-900">
            
            <div className="space-y-4">
              
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded bg-[#102a1b] text-[#d4f15d] border border-[#d4f15d]/30 text-[10px] font-bold uppercase tracking-wider">
                  {item.categoryLabel}
                </span>
                <span className="text-xs font-bold text-[#bef264] flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {item.turnaroundHours}h Delivery
                </span>
              </div>

              <div>
                <h2 className="text-xl font-bold text-white leading-snug">
                  {item.title}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Designed for <span className="text-slate-200 font-semibold">{item.clientType}</span>
                </p>
              </div>

              {/* Deliverable Specifications Callout */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider font-bold block">
                    Style Deliverable Specs
                  </span>
                  <span className="text-xs font-bold text-[#bef264]">
                    High Resolution Print & Social
                  </span>
                </div>
                <div className="text-right text-[11px] text-slate-400">
                  <span className="block text-[#d4f15d] font-bold">2 Revisions Included</span>
                  <span>Calculated via Estimator</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {item.description}
              </p>

              {/* Features List */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-white uppercase tracking-wider block">
                  Included In This Style Package:
                </span>
                <ul className="space-y-1.5">
                  {item.features.map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#d4f15d] shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-slate-800 space-y-2">
              <button
                onClick={() => {
                  onClose();
                  onOrderThisStyle(item);
                }}
                className="w-full py-3 px-4 rounded-xl bg-[#d4f15d] hover:bg-[#bef264] text-slate-950 font-black text-xs transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-lg"
              >
                <span>Order This Style In Price Estimator</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </button>

              <a
                href={`mailto:info@rtsoncreations.co.zw?subject=${encodeURIComponent(`Design Inquiry: ${item.title}`)}&body=${encodeURIComponent(`Hello R'tson Creations Studio Team,\n\nI really like your design "${item.title}" (${item.category}) and would like to inquire about ordering something similar.\n\nThank you!`)}`}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
                title="Send inquiry to info@rtsoncreations.co.zw"
              >
                <Mail className="w-4 h-4 text-[#d4f15d]" />
                <span>Inquire at <span className="lowercase font-mono">info@rtsoncreations.co.zw</span></span>
              </a>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
