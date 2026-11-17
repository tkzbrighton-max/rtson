import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Globe, 
  Layers, 
  Smartphone, 
  Wand2, 
  Clock, 
  DollarSign, 
  MessageSquare,
  ShieldCheck,
  Check
} from 'lucide-react';
import { sound } from '../lib/soundFx';

interface QuatroProjectEstimatorProps {
  onStartOrderWithScope: (category: string, title: string, proposedAmount: number) => void;
  atelierPhone?: string;
}

const DISCIPLINES = [
  {
    id: 'web_development',
    categoryKey: 'web_design',
    label: 'Web Systems & E-Commerce',
    icon: Globe,
    tagline: 'Custom React/Next.js, EcoCash & Zimswitch payment gateways, ultra-fast UX',
    defaultDeliverables: [
      'Responsive Mobile-First Architecture',
      'Local & Global Payment Gateway Integration',
      'SEO & Performance Tuning (95+ Lighthouse)',
      'Direct CMS Admin Dashboard'
    ]
  },
  {
    id: 'graphic_design',
    categoryKey: 'simple_flyer',
    label: '300 DPI Pre-Press & 3D Flyers',
    icon: Layers,
    tagline: 'Sculpted metallic typography, press-calibrated CMYK, conference banners',
    defaultDeliverables: [
      '300 DPI CMYK Bleed-Proof Print PDF',
      '1080x1080 Square & 9:16 WhatsApp Feeds',
      '3D Metallic Volumetric Depth Effects',
      '24-Hour Express Turnaround SLA'
    ]
  },
  {
    id: 'mobile_apps',
    categoryKey: 'corporate_stationery',
    label: 'Mobile Apps & Client Portals',
    icon: Smartphone,
    tagline: 'Cross-platform mobile apps, client proofing desks, cloud synchronized data',
    defaultDeliverables: [
      'Cross-Platform Android & iOS Screens',
      'Cloud Synchronization & Authentication',
      'Real-Time Status & Proofing Tracking',
      'Clean Modular UI Design System'
    ]
  },
  {
    id: 'photo_retouch',
    categoryKey: 'retouch_service',
    label: 'Studio Media & Retouching',
    icon: Wand2,
    tagline: 'Frequency separation skin retouching, background cutout, garment recoloring',
    defaultDeliverables: [
      'High-Resolution Non-Destructive PNG',
      'Studio Clean Backdrop Replacement',
      'Color Grading & Skin Lighting Tuning',
      'Garment Color Shifting with Skin Lock'
    ]
  }
];

const VELOCITIES = [
  { id: 'express', label: '12–24h Express Turnaround', badge: 'Fastest Delivery', icon: Clock },
  { id: 'standard', label: 'Standard Atelier Sprint (2–4 Days)', badge: 'Recommended', icon: Sparkles },
  { id: 'enterprise', label: 'Enterprise Multi-Phase (1–2 Weeks)', badge: 'Comprehensive', icon: ShieldCheck }
];

const BUDGET_PRESETS = [15, 25, 50, 75, 120, 250, 500];

export const QuatroProjectEstimator: React.FC<QuatroProjectEstimatorProps> = ({
  onStartOrderWithScope,
  atelierPhone = ''
}) => {
  const [selectedDisciplineId, setSelectedDisciplineId] = useState<string>('web_development');
  const [selectedVelocityId, setSelectedVelocityId] = useState<string>('standard');
  const [clientBudget, setClientBudget] = useState<number>(25);
  const [customProjectTitle, setCustomProjectTitle] = useState<string>('');

  const activeDiscipline = DISCIPLINES.find(d => d.id === selectedDisciplineId) || DISCIPLINES[0];
  const activeVelocity = VELOCITIES.find(v => v.id === selectedVelocityId) || VELOCITIES[0];

  const handleLaunchProject = () => {
    sound.playSuccess();
    const finalTitle = customProjectTitle.trim() || `${activeDiscipline.label} (${activeVelocity.label})`;
    onStartOrderWithScope(activeDiscipline.categoryKey, finalTitle, clientBudget);
  };

  const handleLaunchWhatsApp = () => {
    sound.playChime();
    const cleanPhone = atelierPhone ? atelierPhone.replace(/[^0-9]/g, '') : '';
    const message = encodeURIComponent(
      `Hello R'tson Creations Studio Desk,\n\nI would like to commission a project via your Quatro Project Estimator:\n\n` +
      `• Discipline: ${activeDiscipline.label}\n` +
      `• Turnaround Velocity: ${activeVelocity.label}\n` +
      `• Proposed Budget: $${clientBudget} USD\n` +
      `• Notes/Title: ${customProjectTitle.trim() || 'New Atelier Project'}\n\n` +
      `Please let me know your availability to begin production.`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

  return (
    <section 
      id="quatro-estimator-section"
      className="relative w-full bg-[#070e14] text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-t border-teal-950 overflow-hidden select-none"
    >
      {/* Ambient Lighting Orbs */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 rounded-full bg-[#d4f15d]/5 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 -left-20 w-96 h-96 rounded-full bg-teal-500/5 blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0d222b] border border-[#d4f15d]/40 text-[#d4f15d] text-xs font-mono font-bold tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>QUATRO DIGITAL CONFIGURATOR</span>
          </div>
          
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Configure Your Project. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#e2fd69] to-[#d4f15d]">
              Choose Your Scope &amp; Budget.
            </span>
          </h2>
          
          <p className="text-xs sm:text-sm text-zinc-400 font-medium leading-relaxed max-w-xl mx-auto">
            Zero rigid rate cards. Select your discipline, choose your turnaround velocity, define your required amount, and collaborate directly with our Harare studio team.
          </p>
        </div>

        {/* 2-Column Interactive Studio Desk */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT 7 COLS: STEP-BY-STEP CONFIGURATOR */}
          <div className="lg:col-span-7 space-y-8 bg-[#0b1820] border border-teal-900/60 rounded-3xl p-6 sm:p-8 shadow-2xl">
            
            {/* Step 1: Select Discipline */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#d4f15d] text-slate-950 flex items-center justify-center text-[10px] font-black">
                    1
                  </span>
                  Select Primary Discipline
                </span>
                <span className="text-[11px] font-mono text-[#d4f15d]">
                  {activeDiscipline.label}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {DISCIPLINES.map((d) => {
                  const Icon = d.icon;
                  const isSelected = d.id === selectedDisciplineId;
                  return (
                    <motion.button
                      key={d.id}
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        sound.playClick();
                        setSelectedDisciplineId(d.id);
                      }}
                      className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[110px] ${
                        isSelected 
                          ? 'bg-[#122731] border-[#d4f15d] text-white shadow-lg shadow-[#d4f15d]/10 ring-1 ring-[#d4f15d]/50' 
                          : 'bg-[#09151c] border-teal-950 text-zinc-400 hover:text-white hover:border-teal-800'
                      }`}
                    >
                      <div className="flex items-center justify-between pb-2">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                          isSelected ? 'bg-[#d4f15d] text-slate-950' : 'bg-white/5 text-zinc-400'
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        {isSelected && (
                          <CheckCircle2 className="w-4 h-4 text-[#d4f15d]" />
                        )}
                      </div>
                      <div>
                        <div className="text-xs font-black text-white">{d.label}</div>
                        <div className="text-[10px] text-zinc-400 line-clamp-1 mt-0.5">{d.tagline}</div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Select Delivery Velocity */}
            <div className="space-y-3 pt-4 border-t border-teal-950">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#d4f15d] text-slate-950 flex items-center justify-center text-[10px] font-black">
                  2
                </span>
                Choose Turnaround Velocity
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {VELOCITIES.map((v) => {
                  const Icon = v.icon;
                  const isSelected = v.id === selectedVelocityId;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setSelectedVelocityId(v.id);
                      }}
                      className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected 
                          ? 'bg-[#122731] border-[#d4f15d] text-white shadow-md shadow-[#d4f15d]/10' 
                          : 'bg-[#09151c] border-teal-950 text-zinc-400 hover:text-white hover:border-teal-800'
                      }`}
                    >
                      <div className="flex items-center justify-between pb-2">
                        <Icon className={`w-4 h-4 ${isSelected ? 'text-[#d4f15d]' : 'text-zinc-500'}`} />
                        <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                          isSelected ? 'bg-[#d4f15d]/20 text-[#d4f15d]' : 'bg-white/5 text-zinc-500'
                        }`}>
                          {v.badge}
                        </span>
                      </div>
                      <div className="text-xs font-bold leading-tight text-white">{v.label}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Client Defined Budget Amount */}
            <div className="space-y-3 pt-4 border-t border-teal-950">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#d4f15d] text-slate-950 flex items-center justify-center text-[10px] font-black">
                    3
                  </span>
                  Your Allocated Budget Amount
                </span>
                <span className="text-xs font-mono font-black text-[#d4f15d]">
                  ${clientBudget} USD
                </span>
              </div>

              {/* Presets Chips */}
              <div className="flex flex-wrap items-center gap-2">
                {BUDGET_PRESETS.map((amt) => {
                  const isSelected = clientBudget === amt;
                  return (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setClientBudget(amt);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                        isSelected 
                          ? 'bg-[#d4f15d] text-slate-950 shadow-md font-black' 
                          : 'bg-white/5 text-zinc-300 border border-teal-950 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      ${amt}
                    </button>
                  );
                })}
                
                {/* Custom Number Input */}
                <div className="flex items-center gap-1.5 px-3 py-1 bg-[#09151c] border border-teal-900 rounded-xl">
                  <span className="text-zinc-500 text-xs font-mono font-bold">$</span>
                  <input 
                    type="number"
                    min="1"
                    max="10000"
                    value={clientBudget}
                    onChange={(e) => {
                      const val = Math.max(1, parseInt(e.target.value) || 1);
                      setClientBudget(val);
                    }}
                    className="w-16 bg-transparent text-white font-mono font-bold text-xs focus:outline-hidden text-center"
                    placeholder="Custom"
                  />
                  <span className="text-[10px] text-zinc-500 font-mono">USD</span>
                </div>
              </div>

              {/* Project Brief / Title Input */}
              <div className="pt-2">
                <input 
                  type="text"
                  value={customProjectTitle}
                  onChange={(e) => setCustomProjectTitle(e.target.value)}
                  placeholder="Optional brief or project name (e.g. Believers Revival Summit, E-Commerce Store)"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#09151c] border border-teal-900/80 text-white placeholder-zinc-500 text-xs font-medium focus:outline-hidden focus:border-[#d4f15d]"
                />
              </div>

            </div>

          </div>

          {/* RIGHT 5 COLS: REAL-TIME SCOPE SUMMARY CARD */}
          <div className="lg:col-span-5 bg-[#0e222c] border-2 border-[#d4f15d]/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-left relative overflow-hidden">
            
            {/* Top Badge */}
            <div className="flex items-center justify-between pb-3 border-b border-teal-900/80">
              <span className="text-[10px] font-mono text-[#d4f15d] font-bold uppercase tracking-wider">
                Live Studio Quote Proposal
              </span>
              <span className="text-[10px] font-mono text-zinc-400">
                Harare Atelier Direct
              </span>
            </div>

            {/* Big Scope Title & Selected Price */}
            <div>
              <div className="text-xl sm:text-2xl font-black text-white leading-tight">
                {customProjectTitle.trim() || activeDiscipline.label}
              </div>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl sm:text-4xl font-black text-[#d4f15d] font-mono">
                  ${clientBudget}
                </span>
                <span className="text-xs text-zinc-400 font-mono">
                  USD Proposed Investment
                </span>
              </div>
              <p className="text-xs text-zinc-300 font-medium mt-1 leading-relaxed">
                {activeDiscipline.tagline}
              </p>
            </div>

            {/* Included Deliverables Guarantee */}
            <div className="space-y-2 pt-2 border-t border-teal-900/60">
              <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest block">
                Deliverables Included In This Commission:
              </span>
              <div className="space-y-2">
                {activeDiscipline.defaultDeliverables.map((deliv, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs text-zinc-200">
                    <Check className="w-3.5 h-3.5 text-[#d4f15d] shrink-0" />
                    <span>{deliv}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* SLA Pill */}
            <div className="p-3 rounded-2xl bg-[#08151c] border border-teal-900 text-xs text-zinc-300 flex items-center justify-between">
              <span className="font-mono text-[11px] text-zinc-400">Delivery Velocity:</span>
              <span className="font-bold text-[#d4f15d] text-[11px]">{activeVelocity.label}</span>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-2">
              <button
                type="button"
                onClick={handleLaunchProject}
                className="w-full py-3.5 px-6 rounded-full bg-[#d4f15d] hover:bg-[#bef264] text-slate-950 font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-xl shadow-[#d4f15d]/20 cursor-pointer hover:scale-[1.02] active:scale-95"
              >
                <span>Launch Project (${clientBudget})</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleLaunchWhatsApp}
                className="w-full py-3 px-6 rounded-full bg-[#08151c] hover:bg-white/10 text-white border border-teal-800 text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#d4f15d]" />
                <span>Discuss on WhatsApp Desk</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
