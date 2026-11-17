import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  ArrowUpRight, 
  Sparkles, 
  CheckCircle2, 
  TrendingUp, 
  ShieldCheck, 
  Layers, 
  ExternalLink,
  X,
  Clock,
  Activity
} from 'lucide-react';
import { sound } from '../lib/soundFx';

// Photorealistic assets
import webSolutionsImg from '../assets/images/web_solutions_showcase_1791468102626.jpg';
import graphicDesignImg from '../assets/images/graphic_design_showcase_1791468112170.jpg';
import realChurchFlyerImg from '../assets/images/real_church_flyer_1787906566871.jpg';
import realBizFlyerImg from '../assets/images/real_business_flyer_1787906598188.jpg';
import realEventFlyerImg from '../assets/images/real_event_flyer_1787906580291.jpg';
import studioDeskImg from '../assets/images/studio_creative_desk_1791468122004.jpg';

interface QuatroFeaturedShowcaseProps {
  onNavigateToOrder: (category?: string, title?: string, proposedAmount?: number) => void;
  onPreviewMockup?: (imageUrl: string, title: string) => void;
}

interface CaseStudy {
  id: string;
  category: 'web' | 'ecommerce' | 'prepress' | 'mobile';
  categoryLabel: string;
  client: string;
  industry: string;
  title: string;
  headline: string;
  description: string;
  image: string;
  metrics: { label: string; value: string }[];
  deliverables: string[];
  suggestedBudget: number;
}

const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'zb_financial',
    category: 'web',
    categoryLabel: 'Enterprise Web Portal',
    client: 'ZB Financial Holdings',
    industry: 'Banking & Financial Services',
    title: 'ZB Banking Cloud Redesign',
    headline: 'Next-Generation Corporate Banking & Web Portal Architecture',
    description: 'Engineered a lightning-fast responsive banking portal with bank-grade security, instant branch locators, and seamless digital service onboarding.',
    image: webSolutionsImg,
    metrics: [
      { label: 'Lighthouse Performance', value: '98/100' },
      { label: 'Mobile Conversion', value: '+42.5%' },
      { label: 'Page Load Speed', value: '0.8s' }
    ],
    deliverables: ['Responsive Web Portal', 'Design System Architecture', 'Security Hardened Front-End', 'Branch Finder API'],
    suggestedBudget: 120
  },
  {
    id: 'tm_pnp',
    category: 'ecommerce',
    categoryLabel: 'E-Commerce Logistics',
    client: 'TM Pick n Pay',
    industry: 'Retail & Supermarket Webstore',
    title: 'Multi-Store E-Commerce & Delivery Engine',
    headline: 'High-Volume Online Grocery Webstore with Local Payments',
    description: 'Architected a conversion-optimized web store with real-time inventory synchronization across Harare and Bulawayo stores, integrated with EcoCash, Zimswitch, and Visa/Mastercard gateways.',
    image: graphicDesignImg,
    metrics: [
      { label: 'Order Processing Velocity', value: '3x Faster' },
      { label: 'Cart Checkout Rate', value: '88.4%' },
      { label: 'Payment Gateway SLA', value: '99.9%' }
    ],
    deliverables: ['Custom E-Commerce Platform', 'EcoCash/Zimswitch Gateway', 'Inventory Sync Engine', 'Admin Order Tracking'],
    suggestedBudget: 250
  },
  {
    id: 'sacred_revival',
    category: 'prepress',
    categoryLabel: '3D Pre-Press Mastery',
    client: 'Sacred Believers International',
    industry: 'Global Faith Ministry',
    title: '3D Gospel Summit Master Poster',
    headline: 'Volumetric Gold Typography & 300 DPI Pre-Press Billboard System',
    description: 'Sculpted 3D metallic gold title crests, isolated high-contrast speaker photography, and calibrated CMYK print files for a 15,000-seat stadium summit.',
    image: realChurchFlyerImg,
    metrics: [
      { label: 'Print Resolution', value: '300 DPI CMYK' },
      { label: 'Stage Banner Span', value: '12 Meters' },
      { label: 'Express Turnaround', value: '18 Hours' }
    ],
    deliverables: ['Stage Billboard Master (CMYK)', 'A4 / A3 Poster Print PDFs', 'WhatsApp Square Feeds', 'Instagram 9:16 Motion Story'],
    suggestedBudget: 25
  },
  {
    id: 'gramia_lms',
    category: 'mobile',
    categoryLabel: 'Web & Mobile App',
    client: 'Gramia Learning Systems',
    industry: 'EdTech & Digital Education',
    title: 'Cloud Learning Management App',
    headline: 'Interactive Student Classroom & Live Grading Web Portal',
    description: 'Developed an engaging mobile-first learning app enabling remote students across Southern Africa to stream lectures, submit assignments, and track grades with offline caching.',
    image: studioDeskImg,
    metrics: [
      { label: 'Active Students', value: '12,000+' },
      { label: 'Offline Mode Cache', value: '100% Valid' },
      { label: 'Student Engagement', value: '+68%' }
    ],
    deliverables: ['Cross-Platform Mobile App', 'Interactive Quiz Engine', 'Student Progress Dashboard', 'Offline Media Sync'],
    suggestedBudget: 150
  },
  {
    id: 'corporate_exec',
    category: 'prepress',
    categoryLabel: 'Corporate Identity',
    client: 'Southern Africa Trade Forum',
    industry: 'B2B Trade & Diplomacy',
    title: 'Executive Summit Collateral Suite',
    headline: 'Swiss Grid Identity, Foil Stamp Guides & Investor Brochure',
    description: 'Designed comprehensive summit collateral with precision bleed margins, spot UV ink specifications, and corporate identity guidelines.',
    image: realBizFlyerImg,
    metrics: [
      { label: 'FOGRA39 Calibrated', value: '100%' },
      { label: 'Investor Reach', value: '2,500 VIPs' },
      { label: 'Pre-Press Zero Rejects', value: '0 Error' }
    ],
    deliverables: ['Corporate Brochure (Tri-Fold)', 'VIP Pass Badges', 'Executive Presentation Deck', 'Vector Brand Manual'],
    suggestedBudget: 35
  },
  {
    id: 'neon_festival',
    category: 'prepress',
    categoryLabel: 'Event & Festival Visuals',
    client: 'Harare Lights Festival',
    industry: 'Nightlife, Music & Arts',
    title: 'Kinetic Neon Festival Showcase',
    headline: 'High-Impact Volumetric Nightclub & Festival Artwork',
    description: 'Created dynamic event flyers with laser light streaks, sculpted glowing typography, and high-energy artist lineup graphics for digital feeds and city billboards.',
    image: realEventFlyerImg,
    metrics: [
      { label: 'Social Engagement', value: '450k Impressions' },
      { label: 'Ticket Sellout Velocity', value: '4 Days' },
      { label: 'Color Space Calibrated', value: 'RGB + CMYK' }
    ],
    deliverables: ['Digital Social Media Pack', 'A2 Street Poster Master', 'VIP Table Bottle Menus', 'LED Screen Motion Loop'],
    suggestedBudget: 20
  }
];

const FILTER_TABS = [
  { id: 'all', label: 'All Projects' },
  { id: 'web', label: 'Web Systems' },
  { id: 'ecommerce', label: 'E-Commerce' },
  { id: 'prepress', label: '300 DPI Pre-Press' },
  { id: 'mobile', label: 'Mobile & Cloud' }
];

const ROTATING_SHOWCASE_TAGS = [
  'Target: 1,000 High-Velocity Digital & Pre-Press Case Studies',
  'Target: Zero-Defect CMYK Offset Pre-Press SLA Benchmark',
  'Target: Flawless Zimbabwean Local Payments Integration',
  'Target: Sub-Second Responsive Web Portals Across Africa'
];

export const QuatroFeaturedShowcase: React.FC<QuatroFeaturedShowcaseProps> = ({
  onNavigateToOrder,
  onPreviewMockup
}) => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<CaseStudy | null>(null);
  const [secondTick, setSecondTick] = useState<number>(1);
  const [tagIdx, setTagIdx] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondTick(prev => (prev % 60) + 1);
    }, 1000);

    const tTimer = setInterval(() => {
      setTagIdx(prev => (prev + 1) % ROTATING_SHOWCASE_TAGS.length);
    }, 4200);

    return () => {
      clearInterval(timer);
      clearInterval(tTimer);
    };
  }, []);

  const filteredStudies = activeTab === 'all' 
    ? CASE_STUDIES 
    : CASE_STUDIES.filter(cs => cs.category === activeTab);

  const handleOpenDetail = (study: CaseStudy) => {
    sound.playClick();
    setSelectedCaseStudy(study);
  };

  const handleCommissionSimilar = (study: CaseStudy) => {
    sound.playSuccess();
    setSelectedCaseStudy(null);
    onNavigateToOrder(
      study.category === 'web' || study.category === 'ecommerce' ? 'web_design' : 'simple_flyer',
      `Similar to ${study.title} (${study.client})`,
      study.suggestedBudget
    );
  };

  return (
    <section 
      id="quatro-case-studies-section"
      className="relative w-full bg-[#050b10] text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-t border-teal-950 select-none"
    >
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header & Filter Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 text-left">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0d222b] border border-[#d4f15d]/40 text-[#d4f15d] text-xs font-mono font-bold tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>SELECTED WORKS &amp; CASE STUDIES</span>
              </div>
            </div>
            
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Crafted For Industry Leaders. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#e2fd69] to-[#d4f15d]">
                Engineered For Measurable Results.
              </span>
            </h2>

            {/* Dynamic Animated Showcase Tag Changing From Now and Then */}
            <div className="h-6 flex items-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={tagIdx}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.35 }}
                  className="text-xs sm:text-sm font-mono text-[#d4f15d] font-bold flex items-center gap-1.5"
                >
                  <Activity className="w-3 h-3 text-[#d4f15d]" />
                  <span>{ROTATING_SHOWCASE_TAGS[tagIdx]}</span>
                </motion.div>
              </AnimatePresence>
            </div>
            
            <p className="text-xs sm:text-sm text-zinc-400 font-medium leading-relaxed">
              Explore how we empower enterprises, financial institutions, supermarket chains, and sacred ministries across Southern Africa with world-class digital and pre-press solutions.
            </p>
          </div>

          {/* Interactive Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl bg-[#09151c] border border-teal-900/80 self-start md:self-end">
            {FILTER_TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setActiveTab(tab.id);
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    isActive 
                      ? 'bg-[#d4f15d] text-slate-950 shadow-md font-black' 
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3-Column Responsive Case Study Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <AnimatePresence mode="popLayout">
            {filteredStudies.map((study, idx) => (
              <motion.div
                key={study.id}
                layout
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -8, scale: 1.015 }}
                className="group relative bg-[#091720] border border-teal-900/60 hover:border-[#d4f15d]/70 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between transition-colors duration-300 cursor-pointer"
                onClick={() => handleOpenDetail(study)}
              >
                {/* Image Container with Smooth Zoom */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
                  <img 
                    src={study.image} 
                    alt={study.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#091720] via-transparent to-transparent" />
                  
                  {/* Category Pill Tag */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full text-[10px] font-mono font-black uppercase tracking-wider bg-slate-950/80 backdrop-blur-md text-[#d4f15d] border border-[#d4f15d]/30 shadow-md">
                      {study.categoryLabel}
                    </span>
                  </div>

                  {/* Corner Arrow Action */}
                  <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-950/80 text-white border border-white/20 flex items-center justify-center transition-all duration-300 group-hover:bg-[#d4f15d] group-hover:text-slate-950 group-hover:rotate-45 shadow-md">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>

                {/* Card Content Body */}
                <div className="p-6 space-y-4 text-left flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="text-[11px] font-mono font-bold text-zinc-400 uppercase tracking-wider">
                      {study.client} · {study.industry}
                    </div>
                    
                    <h3 className="text-xl font-black text-white group-hover:text-[#d4f15d] transition-colors leading-tight">
                      {study.title}
                    </h3>
                    
                    <p className="text-xs text-zinc-300 font-medium leading-relaxed line-clamp-2">
                      {study.description}
                    </p>
                  </div>

                  {/* Key Metrics Strip */}
                  <div className="pt-3 border-t border-teal-950 grid grid-cols-3 gap-2">
                    {study.metrics.map((m, mIdx) => (
                      <div key={mIdx} className="space-y-0.5">
                        <div className="text-xs font-black text-[#d4f15d] font-mono">{m.value}</div>
                        <div className="text-[9px] text-zinc-400 font-sans leading-tight line-clamp-1">{m.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Bottom Action Strip */}
                  <div className="pt-3 border-t border-teal-950 flex items-center justify-between text-xs font-bold">
                    <span className="text-[#d4f15d] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      <span>View Case Study</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400">
                      Flexible Budget
                    </span>
                  </div>

                </div>

              </motion.div>
            ))}
          </AnimatePresence>
        </div>

      </div>

      {/* Case Study Detail Modal */}
      <AnimatePresence>
        {selectedCaseStudy && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-[#091922] border-2 border-[#d4f15d]/50 rounded-3xl p-6 sm:p-8 text-left text-white shadow-2xl max-h-[90vh] overflow-y-auto space-y-6"
            >
              {/* Close Button */}
              <button 
                type="button"
                onClick={() => {
                  sound.playClick();
                  setSelectedCaseStudy(null);
                }}
                className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                aria-label="Close Case Study"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Header */}
              <div className="space-y-2 pr-8">
                <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-[#d4f15d]/20 text-[#d4f15d] border border-[#d4f15d]/40">
                  {selectedCaseStudy.categoryLabel}
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                  {selectedCaseStudy.headline}
                </h3>
                <div className="text-xs font-mono text-zinc-400">
                  Client: <strong className="text-white">{selectedCaseStudy.client}</strong> ({selectedCaseStudy.industry})
                </div>
              </div>

              {/* Image Preview */}
              <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-slate-950 border border-teal-900">
                <img 
                  src={selectedCaseStudy.image} 
                  alt={selectedCaseStudy.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Full Description */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#d4f15d]">
                  Executive Overview &amp; Execution
                </h4>
                <p className="text-xs sm:text-sm text-zinc-300 font-medium leading-relaxed">
                  {selectedCaseStudy.description}
                </p>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-[#061016] border border-teal-900/60">
                {selectedCaseStudy.metrics.map((m, idx) => (
                  <div key={idx} className="space-y-0.5 text-center">
                    <div className="text-lg sm:text-xl font-black text-[#d4f15d] font-mono">{m.value}</div>
                    <div className="text-[10px] text-zinc-400">{m.label}</div>
                  </div>
                ))}
              </div>

              {/* Deliverables List */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">
                  Scope Deliverables
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedCaseStudy.deliverables.map((deliv, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-zinc-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#d4f15d] shrink-0" />
                      <span>{deliv}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-teal-950 flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleCommissionSimilar(selectedCaseStudy)}
                  className="w-full sm:flex-1 py-3.5 px-6 rounded-full bg-[#d4f15d] hover:bg-[#bef264] text-slate-950 font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#d4f15d]/20"
                >
                  <span>Commission Project Like This</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setSelectedCaseStudy(null);
                  }}
                  className="w-full sm:w-auto py-3.5 px-6 rounded-full bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-bold transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
};
