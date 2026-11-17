import React, { useState } from 'react';
import { 
  CheckCircle2, 
  X, 
  Send, 
  Phone, 
  DollarSign, 
  ShieldCheck, 
  Clock, 
  FileText, 
  Sparkles, 
  AlertCircle,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { sound } from '../lib/soundFx';
import { updateLocalInquiryNegotiation } from '../lib/cms';

export interface PhoneApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  quoteRef: string;
  clientName?: string;
  clientPhone?: string;
  standardPrice: number;
  proposedPrice: number;
  flyerTitle?: string;
  clientNote?: string;
  onApproved?: (approvedPrice: number) => void;
  onNavigateToOrder?: () => void;
}

export const PhoneApprovalModal: React.FC<PhoneApprovalModalProps> = ({
  isOpen,
  onClose,
  quoteRef,
  clientName = 'Valued Client',
  clientPhone = 'WhatsApp',
  standardPrice,
  proposedPrice,
  flyerTitle = 'Graphic Design & Flyer Project',
  clientNote = '',
  onApproved,
  onNavigateToOrder
}) => {
  if (!isOpen) return null;

  const [counterPriceInput, setCounterPriceInput] = useState<string>('');
  const [showCounterInput, setShowCounterInput] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [approvalOutcome, setApprovalOutcome] = useState<'approved' | 'countered' | 'declined' | null>(null);
  const [finalPrice, setFinalPrice] = useState<number>(proposedPrice);

  const priceDiff = standardPrice - proposedPrice;

  // 1. APPROVE PROPOSED PRICE (Studio Director Brighton)
  const handleApprove = async () => {
    sound.playSuccess();
    setIsProcessing(true);
    setApprovalOutcome('approved');
    setFinalPrice(proposedPrice);

    // Save to server
    try {
      await fetch(`/api/inquiries/${quoteRef}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'approved',
          negotiationStatus: 'approved',
          approvedPrice: proposedPrice
        })
      });
    } catch (e) {
      console.warn('Server status update note:', e);
    }

    // Save to localStorage
    updateLocalInquiryNegotiation(quoteRef, 'approved');

    if (onApproved) {
      onApproved(proposedPrice);
    }
    setIsProcessing(false);
  };

  // 2. COUNTER OFFER
  const handleSendCounter = async () => {
    const numericCounter = parseFloat(counterPriceInput);
    if (!numericCounter || numericCounter <= 0) {
      alert('Please enter a valid counter price amount in USD.');
      return;
    }

    sound.playClick();
    setIsProcessing(true);
    setApprovalOutcome('countered');
    setFinalPrice(numericCounter);

    try {
      await fetch(`/api/inquiries/${quoteRef}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'countered',
          negotiationStatus: 'countered',
          counterPrice: numericCounter
        })
      });
    } catch (e) {
      console.warn('Server status update note:', e);
    }

    updateLocalInquiryNegotiation(quoteRef, 'countered', numericCounter);

    if (onApproved) {
      onApproved(numericCounter);
    }
    setIsProcessing(false);
  };

  // 3. DECLINE
  const handleDecline = async () => {
    sound.playClick();
    setIsProcessing(true);
    setApprovalOutcome('declined');

    try {
      await fetch(`/api/inquiries/${quoteRef}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'declined',
          negotiationStatus: 'declined'
        })
      });
    } catch (e) {
      console.warn('Server status update note:', e);
    }

    updateLocalInquiryNegotiation(quoteRef, 'declined');
    setIsProcessing(false);
  };

  // Pre-filled WhatsApp notification back to the client
  const handleSendWhatsAppConfirmation = () => {
    sound.playClick();
    const cleanPhone = clientPhone.replace(/[^0-9]/g, '');
    let text = '';

    if (approvalOutcome === 'approved') {
      text = 
        `*RTSON CREATIONS — QUOTATION APPROVED!* ✅\n\n` +
        `Hello ${clientName}!\n` +
        `Takudzwa Brighton here from R'tson Creations Studio Desk (info@rtsoncreations.co.zw).\n\n` +
        `I have reviewed your gauged price offer of *$${proposedPrice}.00 USD* for quotation *${quoteRef}* (${flyerTitle}) and *I HAVE APPROVED IT!* 🎉\n\n` +
        `• Standard Rate: $${standardPrice}.00 USD\n` +
        `• Approved Client Rate: *$${proposedPrice}.00 USD*\n` +
        `• Delivery: 12–24 Hours Express (300 DPI Pre-Press CMYK + Digital RGB)\n\n` +
        `You can now download your official approved quotation PDF or send your briefing materials so we can start designing right away!`;
    } else if (approvalOutcome === 'countered') {
      text = 
        `*RTSON CREATIONS — QUOTATION COUNTER-OFFER* 🤝\n\n` +
        `Hello ${clientName}!\n` +
        `Takudzwa Brighton here from R'tson Creations.\n\n` +
        `Regarding quotation *${quoteRef}* (${flyerTitle}):\n` +
        `• Standard Rate: $${standardPrice}.00 USD\n` +
        `• Your Offer: $${proposedPrice}.00 USD\n` +
        `• *Brighton's Counter-Offer: $${finalPrice}.00 USD*\n\n` +
        `Does $${finalPrice}.00 USD work for your project? Let me know so we can confirm commencement!`;
    } else {
      text = 
        `Hello ${clientName}, Takudzwa Brighton here regarding quotation ${quoteRef}. I would like to discuss the scope and pricing to find the best arrangement for your project.`;
    }

    if (cleanPhone.length > 5) {
      window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#141720] border border-white/10 rounded-3xl shadow-2xl overflow-hidden my-auto animate-scaleUp">
        
        {/* Top Header Strip */}
        <div className="px-5 py-4 bg-[#181c24] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#ff6b00] text-black flex items-center justify-center shrink-0 shadow-sm font-black text-xs">
              077
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#ff8800] block">
                DIRECT STUDIO APPROVAL PORTAL
              </span>
              <h3 className="text-sm font-black text-white">
                Review Client Proposed Price
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-[#1e232d] hover:bg-[#252b37] text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 text-xs text-slate-200">
          
          {/* Document Reference Pill */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-[#181c24] border border-white/10">
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">Quotation Document</span>
              <span className="font-mono font-black text-[#ff6b00] text-sm">{quoteRef}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">Client</span>
              <span className="font-bold text-white text-xs">{clientName}</span>
              <span className="text-[10px] font-mono text-slate-400 block">{clientPhone}</span>
            </div>
          </div>

          {/* Project Details */}
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">Project Commission</span>
            <div className="p-3 rounded-xl bg-[#181c24] border border-white/10">
              <span className="font-bold text-white block">{flyerTitle}</span>
              {clientNote && (
                <p className="text-[11px] text-[#ff8800] italic mt-1 pt-1 border-t border-white/10">
                  Client note: "{clientNote}"
                </p>
              )}
            </div>
          </div>

          {/* PRICE COMPARISON CARD */}
          <div className="p-4 rounded-2xl bg-[#181c24] border border-white/10 space-y-3">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">Price Comparison &amp; Negotiation</span>
            
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 rounded-xl bg-[#101318] border border-white/10">
                <span className="text-[10px] text-slate-400 uppercase block">Standard Studio Rate</span>
                <span className="text-base font-black text-slate-300 font-mono">${standardPrice}.00 USD</span>
              </div>

              <div className="p-3 rounded-xl bg-[#ff6b00]/15 border border-[#ff6b00]/40">
                <span className="text-[10px] text-[#ff8800] uppercase font-bold block">Client Proposed Offer</span>
                <span className="text-lg font-black text-white font-mono">${proposedPrice}.00 USD</span>
              </div>
            </div>

            {priceDiff > 0 ? (
              <div className="text-center text-[11px] text-amber-300 font-medium">
                Client is requesting a <strong className="text-white">${priceDiff}.00 USD discount</strong> ({Math.round((priceDiff / standardPrice) * 100)}% off).
              </div>
            ) : priceDiff < 0 ? (
              <div className="text-center text-[11px] text-emerald-400 font-medium">
                Client offered <strong className="text-white">+${Math.abs(priceDiff)}.00 USD</strong> above standard rate.
              </div>
            ) : (
              <div className="text-center text-[11px] text-emerald-400 font-medium">
                Client proposed standard studio calculated price.
              </div>
            )}
          </div>

          {/* APPROVAL STATUS FEEDBACK */}
          {approvalOutcome && (
            <div className={`p-4 rounded-2xl border text-center space-y-2 animate-fadeIn ${
              approvalOutcome === 'approved' 
                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300' 
                : approvalOutcome === 'countered'
                  ? 'bg-blue-500/20 border-blue-500/50 text-blue-300'
                  : 'bg-red-500/20 border-red-500/50 text-red-300'
            }`}>
              <div className="flex items-center justify-center gap-1.5 font-black text-sm">
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {approvalOutcome === 'approved' && `Quotation Approved at $${proposedPrice}.00 USD!`}
                  {approvalOutcome === 'countered' && `Counter-Offer of $${finalPrice}.00 USD Set!`}
                  {approvalOutcome === 'declined' && `Proposed Price Declined.`}
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                Takudzwa Brighton's official verification has been registered for document {quoteRef}.
              </p>

              <button
                type="button"
                onClick={handleSendWhatsAppConfirmation}
                className="w-full min-h-[44px] py-2.5 px-3 rounded-xl bg-white text-black font-black text-xs transition-transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer shadow-md mt-2"
              >
                <Send className="w-3.5 h-3.5 text-[#ff6b00]" />
                <span>Send Confirmation to Client on WhatsApp</span>
              </button>
            </div>
          )}

          {/* ACTION BUTTONS (FOR STUDIO LEAD) */}
          {!approvalOutcome && (
            <div className="space-y-2.5 pt-1">
              
              {/* PRIMARY 1-TAP APPROVE BUTTON */}
              <button
                type="button"
                onClick={handleApprove}
                disabled={isProcessing}
                className="w-full min-h-[48px] py-3.5 px-4 rounded-2xl bg-[#ff6b00] hover:bg-[#ff7a00] text-black font-black text-xs uppercase tracking-wider shadow-lg shadow-[#ff6b00]/25 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-black" />
                <span>Approve Proposed Price (${proposedPrice}.00 USD)</span>
              </button>

              {/* COUNTER OFFER EXPANDER */}
              {!showCounterInput ? (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setShowCounterInput(true)}
                    className="min-h-[44px] py-2.5 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-slate-300 border border-white/10 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Counter-Offer</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDecline}
                    className="min-h-[44px] py-2.5 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-red-400 border border-white/10 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Decline Offer</span>
                  </button>
                </div>
              ) : (
                <div className="p-3 rounded-2xl bg-neutral-900 border border-white/10 space-y-2">
                  <span className="text-[10px] text-slate-400 font-bold block">Enter Your Counter-Offer (USD):</span>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-2 text-slate-500 font-mono">$</span>
                      <input
                        type="number"
                        min="1"
                        step="1"
                        value={counterPriceInput}
                        onChange={(e) => setCounterPriceInput(e.target.value)}
                        placeholder="e.g. 18"
                        className="w-full pl-7 pr-3 py-1.5 rounded-xl bg-black border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-[#ff6b00]"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleSendCounter}
                      className="px-4 py-1.5 rounded-xl bg-[#ff6b00] hover:bg-[#ff7a00] text-black font-black text-xs cursor-pointer min-h-[40px]"
                    >
                      Send Counter
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCounterInput(false)}
                      className="px-2 py-1.5 text-slate-400 hover:text-white text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* View Full Document Link */}
              {onNavigateToOrder && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onNavigateToOrder();
                  }}
                  className="w-full py-2 text-center text-[11px] text-slate-400 hover:text-[#ff6b00] font-medium transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>View Full Quotation &amp; PDF on Website</span>
                </button>
              )}

            </div>
          )}

          {/* Quick Notice */}
          <div className="text-center text-[10px] text-slate-500 font-mono">
            Studio Official Email: info@rtsoncreations.co.zw • Harare, Zimbabwe
          </div>

        </div>

      </div>
    </div>
  );
};
