import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  ArrowUpRight, 
  Briefcase, 
  Sparkles, 
  Code2, 
  Layers,
  Flame,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock
} from 'lucide-react';
import { sound } from '../lib/soundFx';

// Photorealistic assets
import realBizFlyerImg from '../assets/images/real_business_flyer_1787906598188.jpg';
import realChurchFlyerImg from '../assets/images/real_church_flyer_1787906566871.jpg';
import webSolutionsImg from '../assets/images/web_solutions_showcase_1791468102626.jpg';

const ROTATING_SERVICE_TAGS = [
  'And Scale Your Brand',
  'And Command Market Authority',
  'With 300 DPI Pre-Press Mastery',
  'With Sub-Second Web Speed'
];

interface OptibizServicesSectionProps {
  onNavigate: (page: 'home' | 'about' | 'products' | 'retouch' | 'contact' | 'order') => void;
}

export const OptibizServicesSection: React.FC<OptibizServicesSectionProps> = ({
  onNavigate
}) => {
  const [tagIdx, setTagIdx] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTagIdx(prev => (prev + 1) % ROTATING_SERVICE_TAGS.length);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  const [expandedServiceId, setExpandedServiceId] = useState<string | null>('corporate_branding');

  const services = [
    {
      id: 'corporate_branding',
      kicker: 'Corporate Production',
      title: 'Corporate Branding & Business Flyers',
      subtitle: 'Executive pre-press collateral, product launch flyers & identity suites',
      fullDescription: 'Tailored corporate identity suites, executive annual summit programs, and high-conversion promotional flyers calibrated for flawless 300 DPI pre-press printing and responsive mobile distribution.',
      deliverables: ['300 DPI CMYK Print PDF', 'Vector Master Logo & Assets', 'Multi-Platform Social Feeds', 'Commercial Print Clearance'],
      image: realBizFlyerImg,
      icon: Briefcase,
      page: 'products' as const,
      specs: '300 DPI CMYK · Print Ready PDF & Web Formats'
    },
    {
      id: 'church_posters',
      kicker: 'Sacred Artistry',
      title: '3D Gospel & Church Revival Posters',
      subtitle: 'Sculpted 3D gold typography, dynamic speaker cutouts & conference banners',
      fullDescription: 'Sculpted 3D metallic gold typography, non-destructive minister portrait isolation, volumetric studio backlighting, and commanding conference banners designed for maximum attendance.',
      deliverables: ['3D Metallic Title Geometry', 'Speaker Cutout Extractions', 'Square (1:1) & Story (9:16)', 'Full Commercial Rights'],
      image: realChurchFlyerImg,
      icon: Flame,
      page: 'products' as const,
      specs: 'Volumetric Studio Lighting · Multi-Speaker Isolation'
    },
    {
      id: 'web_platforms',
      kicker: 'Digital Architecture',
      title: 'Custom Web Systems & Digital Portals',
      subtitle: 'Fast responsive portals, booking systems & client proofing desks',
      fullDescription: 'Custom web platforms and interactive client portals built with sub-second page loads, automated regional mobile payments, real-time client proofing desks, and hardened security.',
      deliverables: ['Fast React & Vite Architecture', 'EcoCash Multi-Currency Rails', 'Direct WhatsApp Workbenches', 'Full Source Code & Admin Access'],
      image: webSolutionsImg,
      icon: Code2,
      page: 'products' as const,
      specs: 'Full-Stack React · Vite Architecture · Ultra-Fast Load'
    }
  ];

  return (
    <section 
      id="services-optibiz-section"
      className="relative w-full bg-[#f8fafc] text-slate-900 py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-slate-200 select-none"
    >
      <div className="max-w-7xl mx-auto space-y-12 sm:space-y-16">
        
        {/* ===================================================================== */}
        {/* SECTION HEADER: TITLE LEFT, DESCRIPTION & "LEARN MORE" RIGHT          */}
        {/* ===================================================================== */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 text-left">
          
          <div className="space-y-3 max-w-2xl">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f2fbce] border border-[#d4f15d] text-slate-900 font-mono text-xs font-black tracking-wide">
              <span>Our Services</span>
            </div>

            <div className="space-y-1 min-h-[90px] sm:min-h-[110px]">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight leading-[1.1]">
                Creative Services To Grow <br className="hidden sm:block" />
                <div className="relative inline-block overflow-hidden py-1">
                  <AnimatePresence mode="wait">
                    <motion.span 
                      key={tagIdx}
                      initial={{ opacity: 0, y: 16, filter: 'blur(4px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, y: -16, filter: 'blur(4px)' }}
                      transition={{ duration: 0.45 }}
                      className="text-transparent bg-clip-text bg-gradient-to-r from-teal-900 via-cyan-600 to-[#65a30d] block"
                    >
                      {ROTATING_SERVICE_TAGS[tagIdx]}
                    </motion.span>
                  </AnimatePresence>
                </div>
              </h2>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 shrink-0 max-w-md">
            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.65, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed"
            >
              Every design is calibrated for pre-press perfection, volumetric depth, and high conversion in both digital and print feeds.
            </motion.p>

            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onNavigate('products');
              }}
              className="px-5 py-2.5 rounded-full bg-[#d4f15d] hover:bg-[#bef264] text-slate-950 font-black text-xs uppercase tracking-wider transition-all cursor-pointer shrink-0 flex items-center gap-2 shadow-sm"
            >
              <span>Learn More</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* ===================================================================== */}
        {/* INTERACTIVE SERVICE LIST (CLICK REVEALS PHOTOGRAPHIC WIDGET & SPECS)   */}
        {/* ===================================================================== */}
        <div className="space-y-4">
          {services.map((service) => {
            const Icon = service.icon;
            const isExpanded = expandedServiceId === service.id;

            return (
              <div
                key={service.id}
                className={`rounded-3xl border transition-all duration-300 overflow-hidden ${
                  isExpanded 
                    ? 'border-[#102a1b] bg-white shadow-xl ring-2 ring-[#d4f15d]/40' 
                    : 'border-slate-200 bg-white/90 hover:border-slate-300 hover:bg-white shadow-sm'
                }`}
              >
                {/* Scannable Row Header */}
                <div
                  onClick={() => {
                    sound.playClick();
                    setExpandedServiceId(prev => prev === service.id ? null : service.id);
                  }}
                  className="p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer select-none transition-colors"
                >
                  <div className="flex items-start sm:items-center gap-4 flex-1">
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${
                      isExpanded 
                        ? 'bg-[#102a1b] text-[#d4f15d] shadow-md' 
                        : 'bg-slate-100 text-slate-800'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="space-y-1 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-800 px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200/80">
                          {service.kicker}
                        </span>
                        <span className="text-[10px] font-mono text-slate-600 px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
                          {service.specs}
                        </span>
                      </div>

                      <h3 className="text-lg sm:text-xl font-bold text-[#102a1b] tracking-tight hover:text-black transition-colors">
                        {service.title}
                      </h3>

                      <p className="text-xs text-slate-500 font-normal line-clamp-1 sm:line-clamp-none">
                        {service.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end md:self-center shrink-0">
                    <button
                      type="button"
                      className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-2 border cursor-pointer ${
                        isExpanded 
                          ? 'bg-[#102a1b] text-[#d4f15d] border-[#102a1b]' 
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      <span>{isExpanded ? 'Collapse Widget' : 'Inspect Widget'}</span>
                      {isExpanded ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Expanded Photographic Service Widget */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden border-t border-slate-200 bg-slate-50/70 p-6 sm:p-8"
                    >
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                        
                        {/* Left: Photographic Card Preview */}
                        <div className="lg:col-span-5 relative h-[280px] sm:h-[340px] rounded-3xl overflow-hidden shadow-lg border border-slate-200 bg-slate-950 flex flex-col justify-end p-6 text-left group">
                          <img 
                            src={service.image} 
                            alt={service.title}
                            referrerPolicy="no-referrer"
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
                          <div className="relative z-10 space-y-2">
                            <span className="text-[10px] font-mono font-bold text-[#d4f15d] uppercase tracking-wider">
                              {service.specs}
                            </span>
                            <h4 className="text-xl font-bold text-white tracking-tight leading-snug">
                              {service.title}
                            </h4>
                          </div>
                        </div>

                        {/* Right: Full Description, Deliverables, and Navigation Action */}
                        <div className="lg:col-span-7 flex flex-col justify-between space-y-6 text-left bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm">
                          
                          <div className="space-y-4">
                            <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-800 uppercase tracking-wider">
                              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                              <span>{service.kicker} Production Blueprint</span>
                            </div>

                            <div className="space-y-2">
                              <h4 className="text-xl sm:text-2xl font-black text-[#102a1b] tracking-tight">
                                {service.title}
                              </h4>
                              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                                {service.fullDescription}
                              </p>
                            </div>

                            {/* Production Deliverables */}
                            <div className="space-y-2 pt-2">
                              <span className="text-xs font-mono font-bold text-[#102a1b] uppercase tracking-wider block">
                                Deliverable Package:
                              </span>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {service.deliverables.map((item, dIdx) => (
                                  <div key={dIdx} className="flex items-center gap-2 text-xs text-slate-700">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                    <span>{item}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Action Button */}
                          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                            <button
                              type="button"
                              onClick={() => {
                                sound.playClick();
                                onNavigate(service.page);
                              }}
                              className="px-6 py-3 rounded-2xl bg-[#102a1b] hover:bg-black text-[#d4f15d] font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md hover:scale-105 active:scale-95"
                            >
                              <span>Explore Full Pre-Press Catalogue</span>
                              <ArrowRight className="w-4 h-4" />
                            </button>
                          </div>

                        </div>

                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
