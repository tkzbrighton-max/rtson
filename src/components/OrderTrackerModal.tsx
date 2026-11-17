import React, { useState } from 'react';
import { Search, X, CheckCircle2, Clock, MessageSquare, Mail } from 'lucide-react';

interface OrderTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface DemoOrder {
  id: string;
  clientName: string;
  itemTitle: string;
  category: string;
  currentStep: number;
  statusLabel: string;
  turnaroundEstimate: string;
  lastUpdate: string;
}

const DEMO_ORDERS: Record<string, DemoOrder> = {
  'RTS-10492': {
    id: 'RTS-10492',
    clientName: 'Pastor Emmanuel',
    itemTitle: 'Night of Glory Church Conference Flyer',
    category: 'Church Flyer ($10 Package)',
    currentStep: 3,
    statusLabel: 'Draft Sent for Client Review',
    turnaroundEstimate: 'Delivered in 2 Hours',
    lastUpdate: 'Today at 09:30 AM'
  },
  'RTS-20841': {
    id: 'RTS-20841',
    clientName: 'DJ Blaze',
    itemTitle: 'Cyber Summer Neon Club Poster',
    category: 'Event Poster ($15 Package)',
    currentStep: 2,
    statusLabel: '3D Typography & Photoshop Retouching in Progress',
    turnaroundEstimate: 'Est. Delivery Today 4:00 PM',
    lastUpdate: 'Today at 11:15 AM'
  }
};

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [trackedOrder, setTrackedOrder] = useState<DemoOrder | null>(null);
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    const clean = searchQuery.trim().toUpperCase();
    if (DEMO_ORDERS[clean]) {
      setTrackedOrder(DEMO_ORDERS[clean]);
    } else if (clean.length > 2) {
      setTrackedOrder({
        id: clean.startsWith('RTS-') ? clean : `RTS-${clean}`,
        clientName: 'Valued Client',
        itemTitle: 'Custom Graphic Design Order',
        category: 'Flyer Design Studio',
        currentStep: 2,
        statusLabel: 'Designer R\'tson is actively creating your custom flyer',
        turnaroundEstimate: 'Standard Turnaround: 12 - 24 Hours',
        lastUpdate: 'Recently Updated in Studio'
      });
    } else {
      setTrackedOrder(null);
    }
  };

  const steps = [
    { step: 1, title: 'Brief & Speaker Photos Confirmed', desc: 'Requirements & references loaded into studio' },
    { step: 2, title: 'Photoshop 3D Design in Progress', desc: 'Typography, lighting & color grading underway' },
    { step: 3, title: 'Draft Review & Feedback', desc: 'Proof sent to client for review' },
    { step: 4, title: 'Final HD Print Files Delivered', desc: '300 DPI PDF & Ultra HD PNG files transferred' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#141720] border border-white/10 shadow-2xl overflow-hidden my-auto space-y-4 text-white max-h-[90vh] flex flex-col">
        
        {/* Terminal Header */}
        <div className="px-5 py-4 bg-[#181c24] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff6b00] inline-block animate-pulse"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-neutral-700 inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-white inline-block"></span>
            <span className="text-xs font-mono font-bold text-slate-300 ml-2">
              DISPATCH // LIVE ORDER STATUS TRACKER
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-[#1e232d] hover:bg-[#252b37] text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto">
          {/* Search Box */}
          <form onSubmit={handleSearch} className="space-y-2">
            <label className="text-xs font-bold text-slate-300 block">
              Enter Your Order Confirmation Reference (e.g. RTS-10492)
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="RTS-XXXXX"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#101318] border border-white/10 text-xs font-mono text-white focus:outline-none focus:border-[#ff6b00] uppercase tracking-wider"
                />
              </div>
              <button
                type="submit"
                className="py-2.5 px-4 rounded-xl bg-[#ff6b00] hover:bg-[#ff7a00] text-black font-black text-xs transition-colors cursor-pointer min-h-[42px]"
              >
                Track
              </button>
            </div>
          </form>

          {/* Tracked Order Details */}
          {trackedOrder ? (
            <div className="space-y-4 pt-1">
              <div className="p-4 rounded-2xl bg-[#181c24] border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#ff8800]">{trackedOrder.id}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#ff6b00] text-black font-black">
                    {trackedOrder.turnaroundEstimate}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white">{trackedOrder.itemTitle}</h4>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-white/10">
                  <span>Client: <strong className="text-slate-200">{trackedOrder.clientName}</strong></span>
                  <span>{trackedOrder.lastUpdate}</span>
                </div>
              </div>

              {/* Progress Milestones */}
              <div className="space-y-3 p-4 rounded-2xl bg-[#181c24] border border-white/10">
                <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                  Production Milestones:
                </span>
                <div className="space-y-3">
                  {steps.map((s) => {
                    const isDone = s.step < trackedOrder.currentStep;
                    const isCurrent = s.step === trackedOrder.currentStep;

                    return (
                      <div key={s.step} className="flex items-start gap-3">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 ${
                          isDone 
                            ? 'bg-[#ff6b00] text-black font-black' 
                            : isCurrent 
                            ? 'bg-[#ff6b00] text-black font-black animate-pulse' 
                            : 'bg-neutral-800 text-slate-400'
                        }`}>
                          {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : s.step}
                        </div>
                        <div>
                          <span className={`text-xs font-bold block ${isCurrent ? 'text-[#ff8800]' : isDone ? 'text-white' : 'text-slate-400'}`}>
                            {s.title}
                          </span>
                          <span className="text-[11px] text-slate-400">{s.desc}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action: Send message to info email */}
              <a
                href={`mailto:info@rtsoncreations.co.zw?subject=${encodeURIComponent(`Order Status Inquiry - Ref: #${trackedOrder.id}`)}&body=${encodeURIComponent(`Hello R'tson Creations Studio Desk,\n\nI am inquiring about the status of my order #${trackedOrder.id} (${trackedOrder.itemTitle}).\n\nPlease let me know the current progress.\n\nThank you!`)}`}
                className="w-full min-h-[44px] py-3 px-4 rounded-2xl bg-[#ff6b00] hover:bg-[#ff7a00] text-black font-black text-xs transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-[#ff6b00]/20"
                title="Send inquiry to info@rtsoncreations.co.zw"
              >
                <Mail className="w-4 h-4 text-black" />
                <span>Email Info Desk for Quick Proof / Update</span>
              </a>
            </div>
          ) : hasSearched && (
            <div className="p-4 rounded-2xl bg-[#181c24] border border-white/10 text-center space-y-2">
              <span className="text-xs text-slate-300 block">No automated record found for this reference.</span>
              <p className="text-[11px] text-slate-400">
                You can inquire directly with our studio team via email.
              </p>
              <a
                href={`mailto:info@rtsoncreations.co.zw?subject=${encodeURIComponent(`Order Inquiry - Ref: #${searchQuery}`)}&body=${encodeURIComponent(`Hello R'tson Creations Studio Desk,\n\nI am checking on my order reference #${searchQuery}.\n\nThank you!`)}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#ff6b00] hover:bg-[#ff7a00] text-black font-black text-xs mt-2"
                title="Send inquiry to info@rtsoncreations.co.zw"
              >
                <Mail className="w-3.5 h-3.5 text-black" />
                <span>Inquire at <span className="lowercase font-mono">info@rtsoncreations.co.zw</span></span>
              </a>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
