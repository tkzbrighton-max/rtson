import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Clock, DollarSign, Send, Loader2, AlertCircle, MessageSquare, Sparkles, Image as ImageIcon, Mail } from 'lucide-react';
import { DesignCategory, PortfolioItem, AttachedOrderPhoto } from '../types';
import { collection, addDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { ArtworkOrderCard3D } from './ArtworkOrderCard3D';
import { OrderPhotoAttachmentManager } from './OrderPhotoAttachmentManager';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialItem?: PortfolioItem | null;
  initialCalculatorData?: {
    category: DesignCategory;
    categoryName: string;
    basePrice: number;
    selectedAddOns: string[];
    turnaround: string;
    totalAmount: number;
  } | null;
  onOrderSubmitted: () => void;
}

export const OrderModal: React.FC<OrderModalProps> = ({
  isOpen,
  onClose,
  initialItem,
  initialCalculatorData,
  onOrderSubmitted
}) => {
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<DesignCategory>('church_flyer');
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDetails, setProjectDetails] = useState('');
  const [preferredColors, setPreferredColors] = useState('');
  const [deadlineDate, setDeadlineDate] = useState('');
  
  const [proposedBudget, setProposedBudget] = useState('15');
  const [budgetNote, setBudgetNote] = useState('');
  const [attachedPhotos, setAttachedPhotos] = useState<AttachedOrderPhoto[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [confirmationCode, setConfirmationCode] = useState<string | null>(null);

  useEffect(() => {
    if (initialItem) {
      setSelectedCategory(initialItem.category);
      setProjectTitle(`Order based on style: ${initialItem.title}`);
      setProjectDetails(`I would like a flyer similar in style and quality to "${initialItem.title}".`);
    } else if (initialCalculatorData) {
      setSelectedCategory(initialCalculatorData.category);
      setProjectTitle(`Custom Package: ${initialCalculatorData.categoryName}`);
    }
  }, [initialItem, initialCalculatorData]);

  if (!isOpen) return null;

  let turnaroundLabel = '24 Hours';
  let addonList: string[] = [];

  if (initialItem) {
    turnaroundLabel = `${initialItem.turnaroundHours} Hours`;
  } else if (initialCalculatorData) {
    turnaroundLabel = initialCalculatorData.turnaround;
    addonList = initialCalculatorData.selectedAddOns;
  }

  const clientProposedPrice = parseFloat(proposedBudget) > 0 ? parseFloat(proposedBudget) : 15;

  const handleAddPhotos = (newPhotos: AttachedOrderPhoto[]) => {
    setAttachedPhotos(prev => [...prev, ...newPhotos]);
  };

  const handleUpdatePhoto = (id: string, updates: Partial<AttachedOrderPhoto>) => {
    setAttachedPhotos(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const handleRemovePhoto = (id: string) => {
    setAttachedPhotos(prev => prev.filter(p => p.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientEmail || !projectDetails) {
      setErrorMsg('Please fill in your name, email, and project details.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const orderData = {
        designerEmail: 'info@rtsoncreations.co.zw',
        clientName,
        clientEmail,
        clientPhone: clientPhone || '',
        selectedStyleCategory: selectedCategory,
        specificItemTitle: projectTitle || 'Custom Graphic Design Order',
        projectDetails,
        selectedAddOns: addonList,
        totalEstimate: clientProposedPrice,
        isNegotiated: true,
        negotiatedOffer: clientProposedPrice,
        negotiationReason: budgetNote || 'Client Proposed Budget',
        turnaround: turnaroundLabel,
        colorPalette: preferredColors,
        deadlineDate,
        attachedPhotos: attachedPhotos,
        createdAt: new Date().toISOString(),
        status: 'pending'
      };

      let refId = `RTS-${Date.now().toString().slice(-6)}`;
      try {
        const docRef = await addDoc(collection(db, 'inquiries'), orderData);
        refId = `RTS-${docRef.id.slice(0, 6).toUpperCase()}`;
      } catch (fsErr) {
        handleFirestoreError(fsErr, OperationType.CREATE, 'inquiries');
      }

      fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      }).catch(() => {});

      setConfirmationCode(refId);
      onOrderSubmitted();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit order. Please retry or contact directly on WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDirectWhatsAppOrder = () => {
    let msg = `*ARTWORK ORDER BRIEF — R'TSON CREATIONS*\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `• *Client:* ${clientName || 'Studio Client'}\n`;
    if (clientPhone) msg += `• *Phone / WhatsApp:* ${clientPhone}\n`;
    if (clientEmail) msg += `• *Email:* ${clientEmail}\n`;
    msg += `• *Category:* ${selectedCategory}\n`;
    msg += `• *Project:* ${projectTitle || selectedCategory}\n`;
    msg += `• *Agreed Budget:* $${clientProposedPrice} USD\n`;
    if (budgetNote) msg += `• *Budget Note:* ${budgetNote}\n`;
    msg += `• *Turnaround:* ${turnaroundLabel}\n`;
    if (attachedPhotos.length > 0) {
      msg += `• *Attached Assets:* ${attachedPhotos.length} photo(s)\n`;
    }
    msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `Hello R'tson Creations Studio Team! I am placing this design order and budget proposal via your website portal.`;

    const subject = encodeURIComponent(`[New Design Order] ${projectTitle || selectedCategory} - ${clientName || 'Client'}`);
    window.location.href = `mailto:info@rtsoncreations.co.zw?subject=${subject}&body=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/90 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Terminal Header */}
        <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-500 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-[#d4f15d] inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-white inline-block"></span>
            <span className="text-xs font-mono font-bold text-slate-300 ml-2">
              TERMINAL // CLIENT ORDER DISPATCH
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          
          {confirmationCode ? (
            <div className="space-y-4">
              <ArtworkOrderCard3D
                details={{
                  orderRef: confirmationCode,
                  clientName: clientName || 'Valued Client',
                  clientEmail: clientEmail,
                  clientPhone: clientPhone,
                  categoryName: initialCalculatorData?.categoryName || initialItem?.category || selectedCategory,
                  projectTitle: projectTitle || 'Custom Graphic Design',
                  projectDetails: projectDetails,
                  selectedAddOns: addonList,
                  totalAmount: clientProposedPrice,
                  isNegotiated: true,
                  negotiatedOffer: clientProposedPrice,
                  negotiationReason: budgetNote || 'Client Proposed Budget',
                  turnaround: turnaroundLabel,
                  preferredColors: preferredColors,
                  deadlineDate: deadlineDate,
                  attachedPhotos: attachedPhotos
                }}
              />

              <div className="text-center pt-2">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors cursor-pointer"
                >
                  Close & Return To Studio
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Order Scope Header */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-amber-400 block">Design Scope & Deliverables</span>
                  <span className="text-xs font-bold text-white">{projectTitle || 'Graphic Design Brief'}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-400 block">{turnaroundLabel} Delivery</span>
                  <span className="text-[10px] text-slate-400">Custom Artwork</span>
                </div>
              </div>

              {/* Client Proposed Budget Section */}
              <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/40 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase text-amber-300 tracking-wider flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-amber-400" />
                    <span>Your Proposed Budget / Offer ($ USD) *</span>
                  </label>
                  <span className="text-[10px] text-emerald-400 font-bold">Flexible Client Pricing</span>
                </div>

                <div className="relative">
                  <DollarSign className="w-4 h-4 absolute left-3 top-3 text-amber-400" />
                  <input
                    type="number"
                    required
                    min="5"
                    value={proposedBudget}
                    onChange={(e) => setProposedBudget(e.target.value)}
                    placeholder="e.g. 15, 25, 50"
                    className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-amber-500/50 rounded-xl text-base text-amber-300 font-bold focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>

                {/* Quick Presets */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Presets:</span>
                  {['10', '15', '25', '35', '50'].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setProposedBudget(val)}
                      className={`px-2 py-0.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                        proposedBudget === val
                          ? 'bg-amber-500 border-amber-400 text-slate-950'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                      }`}
                    >
                      ${val} USD
                    </button>
                  ))}
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">Budget Notes / Proposal Details (Optional)</label>
                  <input
                    type="text"
                    value={budgetNote}
                    onChange={(e) => setBudgetNote(e.target.value)}
                    placeholder="e.g. Church ministry discount / Multiple designs bundle / Startup budget"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-900/30 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. John Doe / Pastor Emmanuel"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="e.g. client@example.com"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">WhatsApp / Phone</label>
                  <input
                    type="tel"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="e.g. Your WhatsApp number"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Target Event Date / Deadline</label>
                  <input
                    type="date"
                    value={deadlineDate}
                    onChange={(e) => setDeadlineDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Project Details */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Flyer Text & Details (Headlines, Date, Time, Venue, Speakers) *</label>
                <textarea
                  rows={4}
                  required
                  value={projectDetails}
                  onChange={(e) => setProjectDetails(e.target.value)}
                  placeholder="Paste all flyer text here: Main Title, Theme, Date & Time, Venue Address, Speaker Name(s)..."
                  className="w-full p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Preferred Color Scheme / Aesthetic</label>
                <input
                  type="text"
                  value={preferredColors}
                  onChange={(e) => setPreferredColors(e.target.value)}
                  placeholder="e.g. Royal Blue & Gold / High Contrast Cyber / Clean Minimalist"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Photos & Graphic Cutout Attachments */}
              <div className="pt-2">
                <OrderPhotoAttachmentManager
                  photos={attachedPhotos}
                  onAddPhotos={handleAddPhotos}
                  onUpdatePhoto={handleUpdatePhoto}
                  onRemovePhoto={handleRemovePhoto}
                />
              </div>

              <div className="pt-2 space-y-2.5">
                <button
                  type="button"
                  onClick={handleDirectWhatsAppOrder}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#d4f15d] hover:bg-[#bef264] text-slate-950 font-black text-xs sm:text-sm shadow transition-colors cursor-pointer flex items-center justify-center gap-2 text-center"
                >
                  <Mail className="w-4 h-4 text-slate-950 shrink-0" />
                  <span>Send Brief & Proposed Budget (${clientProposedPrice} USD) to info@rtsoncreations.co.zw</span>
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 text-center"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white shrink-0" />
                      <span>Sending Order & Proposal...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-white shrink-0" />
                      <span>
                        Submit Order Brief with Proposed Budget (${clientProposedPrice} USD)
                      </span>
                    </>
                  )}
                </button>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
};
