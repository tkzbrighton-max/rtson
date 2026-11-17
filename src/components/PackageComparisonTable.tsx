import React from 'react';
import { PRICING_PACKAGES } from '../data/pricingData';
import { Check, Clock, ArrowRight } from 'lucide-react';
import { DesignCategory, PricingPackage } from '../types';

interface PackageComparisonTableProps {
  packages?: PricingPackage[];
  onSelectCategoryForOrder: (cat: DesignCategory) => void;
}

export const PackageComparisonTable: React.FC<PackageComparisonTableProps> = ({
  packages,
  onSelectCategoryForOrder
}) => {
  const activePackages = packages && packages.length > 0 ? packages : PRICING_PACKAGES;

  return (
    <section id="pricing-packages-section" className="py-16 bg-gradient-to-b from-[#050c18] via-[#081832] to-[#050c18] text-white border-t border-[#1e3a8a]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#08151c] to-[#0c1f24] border border-[#d4f15d]/40 text-[#d4f15d] text-xs font-bold mb-3 shadow-md shadow-black/40">
            <span>Design Specifications & Features</span>
            <span className="w-2 h-2 rounded-full bg-gradient-to-r from-[#d4f15d] to-[#bef264] inline-block"></span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Artwork Styles & Deliverables Breakdown
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-2">
            Detailed breakdown of what is included in each design category. Use the Price Estimator below to calculate figures, accept rates, or propose custom budget negotiations.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {activePackages.map((pkg) => (
            <div
              key={pkg.id}
              className={`relative rounded-2xl p-5 border flex flex-col justify-between transition-all ${
                pkg.popular
                  ? 'bg-gradient-to-b from-[#0e2752] to-[#081735] border-[#d4f15d] shadow-xl shadow-[#d4f15d]/10'
                  : 'bg-gradient-to-b from-[#091b38] to-[#061226] border-[#1e3a8a]/40 hover:border-blue-400/60 shadow-lg'
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded bg-[#d4f15d] text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-md">
                  Most Popular
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-white">{pkg.name}</h3>
                  <p className="text-[11px] text-slate-300 mt-2 leading-relaxed min-h-[44px]">
                    {pkg.description}
                  </p>
                </div>

                <div className="p-2.5 rounded-lg bg-[#050c18] border border-[#1e3a8a]/30 text-[11px] text-slate-200 flex items-center justify-between">
                  <span className="text-slate-400">Turnaround:</span>
                  <span className="font-bold text-[#d4f15d] flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {pkg.turnaroundHours} Hours
                  </span>
                </div>

                <div className="space-y-2 pt-2 border-t border-[#1e3a8a]/30">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">What's Included:</span>
                  <ul className="space-y-2">
                    {pkg.includedFeatures.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-[11px] text-slate-300">
                        <Check className="w-3.5 h-3.5 text-[#d4f15d] shrink-0 mt-0.5" />
                        <span className="leading-tight">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => onSelectCategoryForOrder(pkg.category)}
                  className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    pkg.popular
                      ? 'bg-[#d4f15d] hover:bg-[#bef264] text-slate-950 font-black shadow-lg shadow-[#d4f15d]/20'
                      : 'bg-gradient-to-r from-[#0d234a] to-[#153466] hover:from-[#153466] hover:to-[#1e4687] text-white border border-[#1e3a8a]/40 shadow-sm'
                  }`}
                >
                  <span>Estimate {pkg.name}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
