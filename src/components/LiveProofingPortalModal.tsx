import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Check,
  Clock, 
  MessageSquare, 
  Eye, 
  Send, 
  Sparkles, 
  X, 
  Download, 
  ShieldCheck, 
  FileCheck, 
  ZoomIn, 
  RotateCcw,
  Layers,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { sound } from '../lib/soundFx';
import churchFlyer1 from '../assets/images/real_church_flyer_1787906566871.jpg';
import campMeetingFlyer from '../assets/images/sda_camp_meeting_flyer_1785486978976.jpg';

interface LiveProofingPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LiveProofingPortalModal: React.FC<LiveProofingPortalModalProps> = ({
  isOpen,
  onClose
}) => {
  const [orderQuery, setOrderQuery] = useState('RTS-89421');
  const [selectedProofVersion, setSelectedProofVersion] = useState<'v1' | 'v2'>('v2');
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [zoomScale, setZoomScale] = useState(1);

  if (!isOpen) return null;

  const demoProofs = {
    orderId: 'RTS-89421',
    eventTitle: '3D Gold Praise & Worship Revival Summit',
    clientName: 'Pastor Emmanuel Moyo',
    status: isApproved ? 'Approved for 300 DPI CMYK Master Export' : 'Client Proofing & Revisions Active',
    currentStage: isApproved ? 3 : 2, // 1 = Designing, 2 = Proofing, 3 = Approved/Dispatch
    turnaroundRemaining: '4 Hours Remaining',
    v1Url: churchFlyer1,
    v2Url: campMeetingFlyer,
    v2Notes: 'Updated speaker cutout masking, enhanced 3D gold extrusion, and adjusted worship time to 6:00 PM.'
  };

  const handleApprove = () => {
    sound.playSuccess();
    setIsApproved(true);
  };

  const handleSendFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;
    sound.playClick();
    setFeedbackSent(true);
    
    // Auto-open WhatsApp with feedback note
    const msg = `*CLIENT PROOF REVISION FEEDBACK - #${demoProofs.orderId}*
----------------------------------------
*Project:* ${demoProofs.eventTitle}
*Proof Version Inspected:* ${selectedProofVersion.toUpperCase()}
*Revision Notes:*
${feedbackText}
----------------------------------------
Hello Studio Team, please apply these adjustments to my flyer proof.`;
    const emailSubject = encodeURIComponent(`[Proof Revision Feedback - #${demoProofs.orderId}] ${demoProofs.eventTitle}`);
    window.location.href = `mailto:info@rtsoncreations.co.zw?subject=${emailSubject}&body=${encodeURIComponent(msg)}`;

    setTimeout(() => {
      setFeedbackText('');
      setFeedbackSent(false);
    }, 4000);
  };

  const activeImageUrl = selectedProofVersion === 'v1' ? demoProofs.v1Url : demoProofs.v2Url;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 overflow-y-auto backdrop-blur-md">
      <div className="relative w-full max-w-5xl bg-[#141720] border border-white/10 rounded-3xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]">
        
        {/* Modal Top Header */}
        <div className="px-5 sm:px-6 py-4 bg-[#181c24] border-b border-white/10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#ff6b00] text-black font-black shadow-xs">
              <FileCheck className="w-5 h-5 text-black" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase text-[#ff8800] bg-[#ff6b00]/10 px-2 py-0.5 rounded border border-[#ff6b00]/30">
                  LIVE CLIENT PROOFING &amp; REVISION PORTAL
                </span>
                <span className="text-xs text-slate-400 font-mono">#{demoProofs.orderId}</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                {demoProofs.eventTitle}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="p-2 rounded-xl bg-[#1e232d] hover:bg-[#252b37] text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Progress Pipeline Ribbon */}
        <div className="px-5 sm:px-6 py-3 bg-[#181c24]/80 border-b border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-1.5 font-bold ${demoProofs.currentStage >= 1 ? 'text-[#ff8800]' : 'text-slate-500'}`}>
              <span className="w-5 h-5 rounded-full bg-[#ff6b00]/20 border border-[#ff6b00] flex items-center justify-center text-[10px] text-[#ff8800]">1</span>
              <span>Drafting</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
            <div className={`flex items-center gap-1.5 font-bold ${demoProofs.currentStage >= 2 ? 'text-[#ff8800]' : 'text-slate-500'}`}>
              <span className="w-5 h-5 rounded-full bg-[#ff6b00]/20 border border-[#ff6b00] flex items-center justify-center text-[10px] text-[#ff8800]">2</span>
              <span>Client Proofing</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
            <div className={`flex items-center gap-1.5 font-bold ${isApproved ? 'text-[#ff8800]' : 'text-slate-500'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${isApproved ? 'bg-[#ff6b00] text-black font-black' : 'bg-neutral-800 border border-neutral-700'}`}>3</span>
              <span>300 DPI Export</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-[#ff8800]" />
            <span className="text-slate-300 font-mono text-[11px] font-bold">
              Turnaround: <strong className="text-white">{demoProofs.turnaroundRemaining}</strong>
            </span>
          </div>
        </div>

        {/* Main Proof Inspection Stage */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-6 bg-[#12151a]">
          
          {/* Left Column: Proof Viewer with Zoom & Watermark */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Version Switcher Bar */}
            <div className="flex items-center justify-between p-2 rounded-xl bg-[#181c24] border border-white/10 text-xs">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setSelectedProofVersion('v1');
                  }}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    selectedProofVersion === 'v1'
                      ? 'bg-neutral-800 text-white border border-neutral-700'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Draft v1.0 (Initial)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setSelectedProofVersion('v2');
                  }}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    selectedProofVersion === 'v2'
                      ? 'bg-[#ff6b00] text-black font-black shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Draft v2.0 (Latest)</span>
                </button>
              </div>

              {/* Zoom Controls */}
              <div className="flex items-center gap-1 text-slate-400">
                <button
                  type="button"
                  onClick={() => setZoomScale(Math.max(1, zoomScale - 0.2))}
                  className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-slate-200 cursor-pointer text-xs"
                >
                  -
                </button>
                <span className="text-[10px] font-mono w-10 text-center">{Math.round(zoomScale * 100)}%</span>
                <button
                  type="button"
                  onClick={() => setZoomScale(Math.min(2.5, zoomScale + 0.2))}
                  className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-slate-200 cursor-pointer text-xs"
                >
                  +
                </button>
              </div>
            </div>

            {/* Proof Card with Security Watermark */}
            <div className="relative aspect-[4/5] w-full rounded-2xl bg-[#181c24] border-2 border-white/10 shadow-2xl overflow-hidden flex items-center justify-center p-3 group">
              
              {/* Semi-transparent Studio Watermark Overlay (Removed upon approval) */}
              {!isApproved && (
                <div className="absolute inset-0 z-20 pointer-events-none flex flex-col items-center justify-center opacity-30 select-none">
                  <div className="transform -rotate-45 text-center space-y-1">
                    <span className="text-2xl sm:text-4xl font-black text-white tracking-widest block drop-shadow-md">
                      R'TSON CREATIONS PROOF
                    </span>
                    <span className="text-xs font-mono font-bold text-[#ff8800]">
                      PREVIEW ONLY • 300 DPI MASTER ISSUED UPON APPROVAL
                    </span>
                  </div>
                </div>
              )}

              {/* Approved Orange Badge Overlay */}
              {isApproved && (
                <div className="absolute top-4 right-4 z-30 px-3.5 py-1.5 rounded-full bg-[#ff6b00] text-black text-xs font-black shadow-lg flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>300 DPI Master Approved</span>
                </div>
              )}

              <div 
                className="w-full h-full flex items-center justify-center transition-transform duration-200"
                style={{ transform: `scale(${zoomScale})` }}
              >
                <img
                  src={activeImageUrl}
                  alt="Proof Artwork"
                  loading="eager"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain rounded-xl"
                />
              </div>

            </div>

            <p className="text-[11px] text-slate-400 italic text-center">
              {demoProofs.v2Notes}
            </p>

          </div>

          {/* Right Column: Approval & Revision Feedback Desk */}
          <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
            
            <div className="space-y-4">
              
              {/* Status Card */}
              <div className="p-4 rounded-2xl bg-[#181c24] border border-white/10 space-y-2">
                <span className="text-[10px] uppercase font-bold text-[#ff8800] tracking-wider block">
                  Proofing Status
                </span>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${isApproved ? 'bg-[#ff6b00]' : 'bg-[#ff6b00] animate-pulse'}`}></span>
                  <span>{demoProofs.status}</span>
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Review the spelling of names, event times, scripture verses, and speaker masks. Request unlimited adjustments or approve for print output.
                </p>
              </div>

              {/* Revision Feedback Form */}
              <form onSubmit={handleSendFeedback} className="p-4 rounded-2xl bg-[#181c24] border border-white/10 space-y-3">
                <span className="text-xs font-bold text-white block flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-[#ff8800]" />
                  <span>Request Specific Adjustments</span>
                </span>

                <textarea
                  rows={3}
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="e.g., Please change minister title from 'Rev' to 'Bishop', and brighten the gold title text."
                  className="w-full px-3 py-2 rounded-xl bg-[#101318] border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-[#ff6b00]"
                />

                <button
                  type="submit"
                  className="w-full min-h-[44px] py-2.5 rounded-xl bg-[#1e232d] hover:bg-[#252b37] text-slate-200 hover:text-white font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-2 border border-white/10"
                >
                  <Send className="w-3.5 h-3.5 text-[#ff6b00]" />
                  <span>{feedbackSent ? 'Revision Sent To Designer!' : 'Submit Revision Request'}</span>
                </button>
              </form>

            </div>

            {/* Approval Action Box */}
            <div className="p-5 rounded-2xl bg-[#181c24] border border-[#ff6b00]/30 space-y-3">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-6 h-6 text-[#ff6b00] shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-white">Pre-Press 300 DPI Release</h4>
                  <p className="text-[11px] text-slate-300">
                    Approving triggers the generation of high-resolution unwatermarked PDF, CMYK, and PNG master bundles.
                  </p>
                </div>
              </div>

              {!isApproved ? (
                <button
                  type="button"
                  onClick={handleApprove}
                  className="w-full min-h-[44px] py-3.5 rounded-xl bg-[#ff6b00] hover:bg-[#ff7a00] text-black font-black text-xs transition-all shadow-lg shadow-[#ff6b00]/25 cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.02]"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve Design (Ready for 300 DPI Export)</span>
                </button>
              ) : (
                <div className="p-3 rounded-xl bg-neutral-900 border border-[#ff6b00]/40 text-center space-y-2">
                  <span className="text-xs font-bold text-[#ff8800] flex items-center justify-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#ff8800]" />
                    <span>Design Approved &amp; Verified!</span>
                  </span>
                  <div className="flex flex-col sm:flex-row items-center gap-2 justify-center">
                    <a
                      href={`mailto:info@rtsoncreations.co.zw?subject=${encodeURIComponent(`[Proof Approved - #${demoProofs.orderId}] ${demoProofs.eventTitle}`)}&body=${encodeURIComponent(`Hello R'tson Creations Studio Team,\n\nI have reviewed and approved my flyer proof #${demoProofs.orderId} (${demoProofs.eventTitle}) for 300 DPI Pre-Press Export.\n\nPlease proceed with final packaging.\n\nThank you!`)}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#ff6b00] hover:bg-[#ff7a00] text-black font-black text-xs transition-colors"
                      title="Send approval to info@rtsoncreations.co.zw"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Email Approval to <span className="lowercase font-mono">info@rtsoncreations.co.zw</span></span>
                    </a>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
