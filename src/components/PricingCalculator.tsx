import React, { useState } from 'react';
import { 
  Calculator, 
  CheckCircle2, 
  Zap, 
  DollarSign, 
  ArrowRight, 
  ShieldCheck, 
  Plus, 
  MessageSquare, 
  Handshake, 
  Check, 
  X, 
  Send, 
  Mail, 
  Loader2, 
  AlertCircle, 
  Sparkles,
  Clock,
  Layers
} from 'lucide-react';
import { PRICING_PACKAGES, ADD_ON_OPTIONS } from '../data/pricingData';
import { DesignCategory, PricingPackage, AddOnOption } from '../types';
import { collection, addDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { ArtworkOrderCard3D, OrderArtworkDetails } from './ArtworkOrderCard3D';

interface PricingCalculatorProps {
  packages?: PricingPackage[];
  addOns?: AddOnOption[];
  onProceedOrder: (estimateDetails: {
    category: DesignCategory;
    categoryName: string;
    basePrice: number;
    selectedAddOns: string[];
    turnaround: string;
    totalAmount: number;
    isNegotiated?: boolean;
    negotiatedAmount?: number;
    negotiationReason?: string;
  }) => void;
}

export const PricingCalculator: React.FC<PricingCalculatorProps> = ({
  packages,
  addOns,
  onProceedOrder
}) => {
  const activePackages = packages && packages.length > 0 ? packages : PRICING_PACKAGES;
  const activeAddOns = addOns && addOns.length > 0 ? addOns : ADD_ON_OPTIONS;

  const [selectedCategory, setSelectedCategory] = useState<DesignCategory>('church_flyer');
  const [isExpressDelivery, setIsExpressDelivery] = useState<boolean>(false);
  const [selectedAddOnIds, setSelectedAddOnIds] = useState<string[]>(['addon-source']);
  const [numberOfConcepts, setNumberOfConcepts] = useState<number>(1);

  // Client Proposed Budget & Direct Proposal State
  const [proposedBudget, setProposedBudget] = useState<string>('25');
  const [negotiationReason, setNegotiationReason] = useState<string>('');
  const [clientName, setClientName] = useState<string>('');
  const [clientEmail, setClientEmail] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [flyerDetails, setFlyerDetails] = useState<string>('');

  const [isSubmittingInquiry, setIsSubmittingInquiry] = useState<boolean>(false);
  const [submittedReference, setSubmittedReference] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const selectedPkg = activePackages.find(p => p.category === selectedCategory) || activePackages[1];

  const toggleAddOn = (addonId: string) => {
    if (selectedAddOnIds.includes(addonId)) {
      setSelectedAddOnIds(selectedAddOnIds.filter(id => id !== addonId));
    } else {
      setSelectedAddOnIds([...selectedAddOnIds, addonId]);
    }
  };

  const budgetNumber = parseFloat(proposedBudget) || 25;

  const handleNegotiatedSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientEmail || !flyerDetails) {
      setErrorMsg('Please enter your name, email, and design text/brief details.');
      return;
    }

    setIsSubmittingInquiry(true);
    setErrorMsg('');

    const selectedAddonLabels = selectedAddOnIds.map(id => {
      const a = activeAddOns.find(opt => opt.id === id);
      return a ? a.label : id;
    });

    if (isExpressDelivery) {
      selectedAddonLabels.push('12-Hour Rush Express Priority Delivery');
    }

    try {
      const payload = {
        designerEmail: 'info@rtsoncreations.co.zw',
        clientName,
        clientEmail,
        clientPhone: clientPhone || '',
        selectedStyleCategory: selectedCategory,
        specificItemTitle: `${selectedPkg.name} (${numberOfConcepts} Concept${numberOfConcepts > 1 ? 's' : ''})`,
        projectDetails: flyerDetails,
        selectedAddOns: selectedAddonLabels,
        totalEstimate: budgetNumber,
        isNegotiated: true,
        negotiatedOffer: budgetNumber,
        negotiationReason: negotiationReason || 'Client Proposed Budget Proposal.',
        turnaround: isExpressDelivery ? '12 Hours Express Priority' : `${selectedPkg.turnaroundHours} Hours Guaranteed`,
        createdAt: new Date().toISOString(),
        status: 'pending'
      };

      let refId = `RTS-${Date.now().toString().slice(-5)}`;
      try {
        const docRef = await addDoc(collection(db, 'inquiries'), payload);
        refId = `RTS-${docRef.id.slice(0, 5).toUpperCase()}`;
      } catch (fsErr) {
        handleFirestoreError(fsErr, OperationType.CREATE, 'inquiries');
      }

      fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(() => {});

      setSubmittedReference(refId);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error submitting proposed budget.');
    } finally {
      setIsSubmittingInquiry(false);
    }
  };

  const handleWhatsAppQuote = () => {
    const selectedAddonLabels = selectedAddOnIds.map(id => {
      const a = activeAddOns.find(opt => opt.id === id);
      return a ? a.label : id;
    });

    if (isExpressDelivery) {
      selectedAddonLabels.push('12-Hour Rush Express Priority');
    }

    const divider = '========================================';
    const subDivider = '----------------------------------------';

    const msg = `[ ${divider} ]
    R'TSON CREATIONS GRAPHIC STUDIO
       OFFICIAL ORDER PROPOSAL BRIEF
[ ${divider} ]

INQUIRY DATE: ${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
CLIENT NAME: ${clientName || 'Direct Website Client'}
CONTACT: ${clientPhone || clientEmail || 'Direct WhatsApp'}

${subDivider}
PROJECT SPECIFICATIONS
${subDivider}
• Service Category: ${selectedPkg.name}
• Design Concepts: ${numberOfConcepts} Concept${numberOfConcepts > 1 ? 's' : ''}
• Turnaround Time: ${isExpressDelivery ? '12 Hours Express Rush' : `${selectedPkg.turnaroundHours} Hours Guaranteed`}
• Standard: 300 DPI CMYK Print Ready PDF + Ultra HD RGB Web/Social Master

${subDivider}
SELECTED PRODUCTION ENHANCEMENTS
${subDivider}
${selectedAddonLabels.length > 0 ? selectedAddonLabels.map(a => `• ${a}`).join('\n') : '• Standard Studio Production Package'}

${subDivider}
BRIEF & DESIGN TEXT
${subDivider}
${flyerDetails || 'Will send full event title, dates, speakers, venue & high-res photos directly in this chat.'}
${negotiationReason ? `• Budget Note: ${negotiationReason}\n` : ''}
${subDivider}
CLIENT PROPOSED BUDGET / OFFER
${subDivider}
• Proposed Budget: $${budgetNumber} USD (Client Proposed Offer)

Hello Studio Team! I built this design brief and budget proposal on your website. Let's discuss starting the artwork!
[ ${divider} ]
   R'tson Creations • Beyond the Ordinary
[ ${divider} ]`;

    const emailSubject = encodeURIComponent(`[Design Scope Proposal] ${selectedPkg.name} - $${budgetNumber} USD`);
    window.location.href = `mailto:info@rtsoncreations.co.zw?subject=${emailSubject}&body=${encodeURIComponent(msg)}`;
  };

  return (
    <section id="pricing-calculator-section" className="py-16 bg-gradient-to-b from-[#050c18] via-[#081832] to-[#050c18] border-t border-[#1e3a8a]/30 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#08151c] to-[#0c1f24] border border-[#d4f15d]/40 text-[#d4f15d] text-xs font-bold mb-3 shadow-md shadow-black/40">
            <Handshake className="w-3.5 h-3.5 text-[#d4f15d]" />
            <span>Design Scope & Budget Proposal Builder</span>
            <span className="w-2 h-2 rounded-full bg-gradient-to-r from-[#d4f15d] to-[#bef264] inline-block"></span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Configure Your Artwork & Propose Your Budget
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-2">
            Select your artwork style, turnaround speed, and custom deliverables. Propose your budget directly to lead designer Brighton with zero rigid pricing barriers.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Style & Options Builder */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Step 1: Select Design Style */}
            <div className="p-6 rounded-2xl bg-gradient-to-b from-[#091b38] to-[#061226] border border-[#1e3a8a]/40 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-[#d4f15d] tracking-wider block">
                  1. Select Design Style Category:
                </span>
                <span className="text-[11px] text-blue-300 font-mono">
                  {PRICING_PACKAGES.length} Production Styles
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PRICING_PACKAGES.map((pkg) => {
                  const isSelected = selectedCategory === pkg.category;
                  return (
                    <div
                      key={pkg.id}
                      onClick={() => setSelectedCategory(pkg.category)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-gradient-to-br from-[#0f2d60] to-[#0d2320] border-[#d4f15d] text-white shadow-lg shadow-black/50 ring-1 ring-[#d4f15d]/50'
                          : 'bg-[#050d1c] border-[#1e3a8a]/30 text-slate-300 hover:border-blue-400 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#d4f15d]" />}
                          {pkg.name}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-950/80 border border-blue-500/30 text-blue-300">
                          {pkg.turnaroundHours}h Delivery
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                        {pkg.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Delivery Speed & Quantity */}
            <div className="p-6 rounded-2xl bg-gradient-to-b from-[#091b38] to-[#061226] border border-[#1e3a8a]/40 shadow-xl space-y-4">
              <span className="text-xs font-bold uppercase text-[#d4f15d] tracking-wider block">
                2. Delivery Speed & Concept Count:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Standard Delivery */}
                <div
                  onClick={() => setIsExpressDelivery(false)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    !isExpressDelivery
                      ? 'bg-gradient-to-r from-[#0d2754] to-[#123674] border-blue-400 text-white shadow-md'
                      : 'bg-[#050d1c] border-[#1e3a8a]/30 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <span className="text-xs font-bold block text-white">Standard Production</span>
                    <span className="text-[11px] text-slate-400">{selectedPkg.turnaroundHours} Hours Guaranteed</span>
                  </div>
                  <span className="text-xs font-bold text-blue-300">Included</span>
                </div>

                {/* 12h Express Rush */}
                <div
                  onClick={() => setIsExpressDelivery(true)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    isExpressDelivery
                      ? 'bg-gradient-to-r from-[#17301c] via-[#214324] to-[#2d5c2e] border-[#d4f15d] text-white shadow-md shadow-black/50'
                      : 'bg-[#050d1c] border-[#1e3a8a]/30 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <span className="text-xs font-bold block text-white flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-[#d4f15d]" /> 12h Rush Express
                    </span>
                    <span className="text-[11px] text-slate-300">Priority Queue</span>
                  </div>
                  <span className="text-xs font-bold text-[#d4f15d]">Priority Slot</span>
                </div>
              </div>

              {/* Number of Variations */}
              <div className="pt-2 flex items-center justify-between p-3.5 rounded-xl bg-[#050d1c] border border-[#1e3a8a]/30">
                <div>
                  <span className="text-xs font-bold text-white block">Design Concepts / Layout Variations</span>
                  <span className="text-[11px] text-slate-400">Different creative directions to choose from</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    disabled={numberOfConcepts <= 1}
                    onClick={() => setNumberOfConcepts(Math.max(1, numberOfConcepts - 1))}
                    className="w-7 h-7 rounded-lg bg-[#0c2249] text-white text-xs font-bold disabled:opacity-30 cursor-pointer hover:bg-[#14326b] border border-[#1e3a8a]/40"
                  >
                    -
                  </button>
                  <span className="text-xs font-mono font-bold text-[#d4f15d]">{numberOfConcepts}</span>
                  <button
                    onClick={() => setNumberOfConcepts(numberOfConcepts + 1)}
                    className="w-7 h-7 rounded-lg bg-[#0c2249] text-white text-xs font-bold cursor-pointer hover:bg-[#14326b] border border-[#1e3a8a]/40"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Step 3: Optional Add-ons */}
            <div className="p-6 rounded-2xl bg-gradient-to-b from-[#091b38] to-[#061226] border border-[#1e3a8a]/40 shadow-xl space-y-4">
              <span className="text-xs font-bold uppercase text-[#d4f15d] tracking-wider block">
                3. Enhancement Deliverables & Add-ons:
              </span>

              <div className="space-y-2.5">
                {ADD_ON_OPTIONS.map((addon) => {
                  const isChecked = selectedAddOnIds.includes(addon.id);

                  return (
                    <div
                      key={addon.id}
                      onClick={() => toggleAddOn(addon.id)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                        isChecked
                          ? 'bg-gradient-to-r from-[#0d2754] to-[#123674] border-blue-400 text-white shadow'
                          : 'bg-[#050d1c] border-[#1e3a8a]/30 text-slate-300 hover:border-[#1e3a8a]/60'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded flex items-center justify-center border ${
                          isChecked ? 'bg-[#d4f15d] border-[#bef264] text-slate-950 font-black' : 'border-[#1e3a8a]/50 bg-[#071329]'
                        }`}>
                          {isChecked && <CheckCircle2 className="w-3.5 h-3.5 text-slate-950" />}
                        </div>
                        <div>
                          <span className="text-xs font-bold text-white block">{addon.label}</span>
                          <span className="text-[11px] text-slate-400">{addon.description}</span>
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${isChecked ? 'bg-[#d4f15d]/15 text-[#d4f15d] border border-[#d4f15d]/30' : 'bg-[#050d1c] text-slate-400 border border-slate-800'}`}>
                        {isChecked ? 'Included' : 'Add to Brief'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right Column: Live Terminal Proposal & Budget Dock */}
          <div className="lg:col-span-5 sticky top-28 space-y-4">
            
            <div className="rounded-2xl bg-gradient-to-b from-[#091b38] to-[#061124] border border-[#1e3a8a]/50 shadow-2xl shadow-blue-950/40 overflow-hidden">
              
              {/* Terminal Header */}
              <div className="px-4 py-3 bg-gradient-to-r from-[#060f20] via-[#091730] to-[#1f0d05] border-b border-[#1e3a8a]/40 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-blue-500 inline-block"></span>
                  <span className="w-3 h-3 rounded-full bg-[#d4f15d] inline-block"></span>
                  <span className="w-3 h-3 rounded-full bg-white inline-block"></span>
                  <span className="text-xs font-mono font-bold text-slate-200 ml-2">
                    TERMINAL // PROPOSAL DOCK
                  </span>
                </div>
                <span className="px-2.5 py-0.5 rounded bg-gradient-to-r from-[#1e3a8a] to-[#2563eb] text-white text-[10px] font-bold shadow-sm">
                  OPEN BUDGET
                </span>
              </div>

              <div className="p-6 space-y-5">
                
                {/* Line Items Summary */}
                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between text-slate-300">
                    <span>{selectedPkg.name} ({numberOfConcepts} Concept{numberOfConcepts > 1 ? 's' : ''})</span>
                    <span className="text-blue-300 font-bold">Selected Style</span>
                  </div>

                  {isExpressDelivery && (
                    <div className="flex items-center justify-between text-[#d4f15d]">
                      <span>12-Hour Rush Express Priority Delivery</span>
                      <span className="text-[#d4f15d] font-bold">Express Queue</span>
                    </div>
                  )}

                  {selectedAddOnIds.map((id) => {
                    const addon = ADD_ON_OPTIONS.find(a => a.id === id);
                    if (!addon) return null;
                    return (
                      <div key={id} className="flex items-center justify-between text-slate-400">
                        <span className="truncate max-w-[220px]">{addon.label}</span>
                        <span className="text-slate-300 font-medium">Included in Brief</span>
                      </div>
                    );
                  })}
                </div>

                {/* Proposed Budget Display Banner */}
                <div className="pt-4 border-t border-[#1e3a8a]/30 space-y-2">
                  <span className="text-[11px] uppercase tracking-wider text-slate-400 block font-bold">
                    Your Proposed Budget:
                  </span>
                  <div className="flex items-baseline justify-between p-3.5 rounded-xl bg-[#050c18] border border-[#1e3a8a]/40 shadow-inner">
                    <span className="text-3xl font-black bg-gradient-to-r from-[#d4f15d] to-[#bef264] bg-clip-text text-transparent">
                      ${budgetNumber} <span className="text-xs font-normal text-slate-400">USD (Offer)</span>
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      Turnaround: <strong className="text-white">{isExpressDelivery ? '12h Express' : `${selectedPkg.turnaroundHours}h Standard`}</strong>
                    </span>
                  </div>
                </div>

                {/* 3D Order Card or Proposal Submission Form */}
                {submittedReference ? (
                  <div className="space-y-4">
                    <ArtworkOrderCard3D
                      details={{
                        orderRef: submittedReference,
                        clientName: clientName || 'Valued Client',
                        clientEmail: clientEmail,
                        clientPhone: clientPhone,
                        categoryName: selectedPkg.name,
                        projectTitle: flyerDetails || `${selectedPkg.name} Artwork Brief`,
                        projectDetails: flyerDetails || 'Standard event and graphic design requirements',
                        selectedAddOns: selectedAddOnIds.map(id => {
                          const a = activeAddOns.find(opt => opt.id === id);
                          return a ? a.label : id;
                        }),
                        totalAmount: budgetNumber,
                        isNegotiated: true,
                        negotiatedOffer: budgetNumber,
                        negotiationReason: negotiationReason,
                        turnaround: isExpressDelivery ? '12 Hours Express Priority' : `${selectedPkg.turnaroundHours} Hours Guaranteed`
                      }}
                    />

                    <div className="text-center pt-2">
                      <button
                        onClick={() => {
                          setSubmittedReference(null);
                        }}
                        className="text-xs text-slate-400 underline hover:text-white cursor-pointer"
                      >
                        ← Propose another artwork order
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleNegotiatedSubmit} className="p-4 rounded-xl bg-[#050c18] border border-[#1e3a8a]/40 space-y-3 shadow-inner">
                    <div className="flex items-center justify-between pb-2 border-b border-[#1e3a8a]/30">
                      <span className="text-xs font-bold text-[#d4f15d] flex items-center gap-1.5">
                        <Handshake className="w-4 h-4" /> Propose Your Budget & Brief
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">info@rtsoncreations.co.zw</span>
                    </div>

                    {errorMsg && (
                      <div className="p-2.5 rounded-lg bg-red-950/50 border border-red-500/40 text-red-300 text-[11px] flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errorMsg}</span>
                      </div>
                    )}

                    {/* Quick Budget Presets & Custom Input */}
                    <div>
                      <label className="text-[11px] font-bold text-slate-300 block mb-1.5 flex items-center justify-between">
                        <span>Your Proposed Budget ($ USD) *</span>
                        <span className="text-[10px] text-[#d4f15d] font-mono">Quick Offer</span>
                      </label>

                      {/* Quick Pills */}
                      <div className="flex items-center gap-1.5 mb-2">
                        {['10', '15', '25', '35', '50'].map((preset) => (
                          <button
                            key={preset}
                            type="button"
                            onClick={() => setProposedBudget(preset)}
                            className={`flex-1 py-1 rounded-lg text-xs font-bold font-mono transition-colors cursor-pointer border ${
                              proposedBudget === preset
                                ? 'bg-[#d4f15d] text-slate-950 font-black border-[#bef264] shadow-sm'
                                : 'bg-[#091834] text-slate-300 border-[#1e3a8a]/40 hover:bg-[#112a58]'
                            }`}
                          >
                            ${preset}
                          </button>
                        ))}
                      </div>

                      <div className="relative">
                        <DollarSign className="w-3.5 h-3.5 absolute left-3 top-3 text-[#d4f15d]" />
                        <input
                          type="number"
                          required
                          min="1"
                          value={proposedBudget}
                          onChange={(e) => setProposedBudget(e.target.value)}
                          placeholder="e.g. 25"
                          className="w-full pl-8 pr-3 py-2 bg-[#091834] border border-[#1e3a8a]/40 rounded-lg text-xs text-white focus:outline-none focus:border-[#d4f15d] font-mono font-bold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-300 block mb-1">Budget Note / Scope Context</label>
                      <input
                        type="text"
                        value={negotiationReason}
                        onChange={(e) => setNegotiationReason(e.target.value)}
                        placeholder="e.g. Church ministry conference / Startup launch / Multi-flyer package"
                        className="w-full px-3 py-2 bg-[#091834] border border-[#1e3a8a]/40 rounded-lg text-xs text-white focus:outline-none focus:border-[#d4f15d]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] font-bold text-slate-300 block mb-1">Your Name *</label>
                        <input
                          type="text"
                          required
                          value={clientName}
                          onChange={(e) => setClientName(e.target.value)}
                          placeholder="Your Full Name"
                          className="w-full px-3 py-2 bg-[#091834] border border-[#1e3a8a]/40 rounded-lg text-xs text-white focus:outline-none focus:border-[#d4f15d]"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-300 block mb-1">Your Email *</label>
                        <input
                          type="email"
                          required
                          value={clientEmail}
                          onChange={(e) => setClientEmail(e.target.value)}
                          placeholder="you@example.com"
                          className="w-full px-3 py-2 bg-[#091834] border border-[#1e3a8a]/40 rounded-lg text-xs text-white focus:outline-none focus:border-[#d4f15d]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-300 block mb-1">WhatsApp / Phone Number</label>
                      <input
                        type="tel"
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        placeholder="e.g. +263 ... or client number"
                        className="w-full px-3 py-2 bg-[#091834] border border-[#1e3a8a]/40 rounded-lg text-xs text-white focus:outline-none focus:border-[#d4f15d]"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-300 block mb-1">Design Text & Brief Requirements *</label>
                      <textarea
                        rows={3}
                        required
                        value={flyerDetails}
                        onChange={(e) => setFlyerDetails(e.target.value)}
                        placeholder="Theme / Headline, Date & Time, Venue Address, Speaker Names & Titles, Color preferences..."
                        className="w-full p-2.5 bg-[#091834] border border-[#1e3a8a]/40 rounded-lg text-xs text-white focus:outline-none focus:border-[#d4f15d] font-mono"
                      />
                    </div>

                    {/* Submit Actions */}
                    <div className="space-y-2 pt-1">
                      <button
                        type="submit"
                        disabled={isSubmittingInquiry}
                        className="w-full py-3 px-3 rounded-xl bg-[#d4f15d] hover:bg-[#bef264] text-slate-950 font-black text-xs transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-[#d4f15d]/20"
                      >
                        {isSubmittingInquiry ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                            <span>Submitting 3D Proposal Brief...</span>
                          </>
                        ) : (
                          <>
                            <Mail className="w-4 h-4 text-slate-950" />
                            <span>Submit Proposed Budget (${budgetNumber} USD) to Email</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={handleWhatsAppQuote}
                        className="w-full py-3 px-3 rounded-xl bg-gradient-to-r from-[#0d2754] to-[#123674] hover:from-[#13356f] hover:to-[#1a4a9f] text-white font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-2 text-center border border-blue-500/40 shadow"
                      >
                        <Mail className="w-4 h-4 text-white shrink-0" />
                        <span>Send 3D Brief to info@rtsoncreations.co.zw</span>
                      </button>
                    </div>
                  </form>
                )}

                {/* Included Deliverables checklist */}
                <div className="p-3.5 rounded-xl bg-[#050c18] border border-[#1e3a8a]/30 space-y-2">
                  <span className="text-[11px] font-bold text-white uppercase block">
                    Guaranteed Deliverables:
                  </span>
                  <div className="space-y-1">
                    {selectedPkg.includedFeatures.slice(0, 4).map((feat, i) => (
                      <div key={i} className="flex items-center gap-2 text-[11px] text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
