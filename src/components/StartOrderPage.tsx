import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  CheckCircle2, 
  Send, 
  Copy, 
  Check, 
  Printer, 
  Download,
  Sparkles, 
  Video, 
  Globe, 
  Layers, 
  Clock, 
  ShieldCheck, 
  Phone, 
  FileText, 
  ChevronRight, 
  DollarSign,
  HandCoins,
  AlertCircle
} from 'lucide-react';
import jsPDF from 'jspdf';
import { toPng } from 'html-to-image';
import { PortfolioItem } from '../types';
import { saveClientInquiry } from '../lib/cms';
import { sound } from '../lib/soundFx';
import { RtsonLogo } from './RtsonLogo';
import { PhoneApprovalModal } from './PhoneApprovalModal';

interface StartOrderPageProps {
  initialItem?: PortfolioItem | null;
  initialCategory?: string;
  initialProposedPrice?: number | null;
  initialRetouchedImage?: string | null;
  initialRetouchedSummary?: string;
  onOrderCompleted?: () => void;
  onNavigateToRetouchDesk?: () => void;
  onOpenLiveProofing?: () => void;
  onOpenInvoiceGenerator?: () => void;
  onOpenOrderTracker?: () => void;
  onOpenSelfieStudio?: () => void;
  onOpenMockupViewer?: (imageUrl: string, title: string) => void;
}

// Streamlined Flyer Types with Transparent Studio Pricing
const FLYER_TYPES = [
  {
    id: 'church_gospel',
    title: 'Church & Gospel Conference Flyer',
    category: 'Sacred & Ministry',
    basePrice: 15,
    turnaround: '12–24h Express',
    description: '3D metallic gold sculpting, 300 DPI pre-press CMYK, minister portrait framing, RGB digital ready.',
    badge: 'Most Commissioned'
  },
  {
    id: 'business_corporate',
    title: 'Business & Corporate Flyer',
    category: 'Corporate & Brand',
    basePrice: 20,
    turnaround: '12–24h Express',
    description: 'Swiss typography, enterprise summit layouts, pitch deck graphics, and high-conversion collateral.',
    badge: 'Corporate Standard'
  },
  {
    id: 'event_club_nightlife',
    title: 'Event, Club & Entertainment Flyer',
    category: 'Nightlife & Concert',
    basePrice: 20,
    turnaround: '12–24h Express',
    description: 'High-voltage club lighting, DJ/artiste billing, VIP nightlife promo, electrifying visual contrast.',
    badge: 'High Voltage'
  },
  {
    id: 'birthday_celebration',
    title: 'Birthday & Milestone Celebration',
    category: 'Social & Celebration',
    basePrice: 15,
    turnaround: '12–24h Express',
    description: 'Royal jubilee portrait styling, milestone celebration frames, personalized typography.',
    badge: 'Express'
  },
  {
    id: 'funeral_memorial',
    title: 'Funeral & Memorial Program Flyer',
    category: 'Memorial & Tribute',
    basePrice: 15,
    turnaround: '12–24h Express',
    description: 'Dignified tribute framing, order of service layout, angel-wing / golden ascension styling.',
    badge: 'Priority Sprint'
  },
  {
    id: 'product_launch',
    title: 'Product Launch & Sale Promo Flyer',
    category: 'Retail & E-Commerce',
    basePrice: 15,
    turnaround: '12–24h Express',
    description: 'Catalog product spotlight, price discount badges, call-to-action triggers, social feed ratios.',
    badge: 'Sales Booster'
  },
  {
    id: 'custom_flyer',
    title: 'Custom Bespoke Flyer Design',
    category: 'Creative Brief',
    basePrice: 20,
    turnaround: '12–24h Express',
    description: 'Bespoke design tailored specifically to your unique requirements and aesthetic direction.',
    badge: 'Custom'
  }
];

// Quick suggestions for Website types
const WEBSITE_TYPE_SUGGESTIONS = [
  'Church & Ministry Portal',
  'Corporate Company Profile',
  'E-Commerce Online Store',
  'Creative Portfolio & Bio',
  'Event & Ticket Landing Page',
  'Restaurant & Menu Web App'
];

export const StartOrderPage: React.FC<StartOrderPageProps> = ({
  initialItem,
  initialCategory,
  initialProposedPrice,
  onNavigateToRetouchDesk
}) => {
  const quotationPrintRef = useRef<HTMLDivElement>(null);

  // Stable Quotation Reference
  const [quoteRef] = useState<string>(() => `RC-QUOTE-${Math.floor(100000 + Math.random() * 900000)}`);
  const [currentDateFormatted] = useState<string>(() => new Date().toLocaleDateString('en-GB'));

  // 1. Flyer Selection
  const defaultFlyerId = initialItem?.category === 'branding' || initialItem?.category === 'brochure'
    ? 'business_corporate'
    : initialCategory === 'club_event' || initialItem?.category === 'event_poster'
      ? 'event_club_nightlife'
      : 'church_gospel';

  const [selectedFlyerId, setSelectedFlyerId] = useState<string>(defaultFlyerId);
  const [customFlyerTitle, setCustomFlyerTitle] = useState<string>(
    initialItem ? initialItem.title : ''
  );

  // 2. Video Generation Toggle ("tick again")
  const [needVideoGeneration, setNeedVideoGeneration] = useState<boolean>(false);
  const [videoFormat, setVideoFormat] = useState<'9:16' | '1:1' | '16:9'>('9:16');
  const videoGenerationPrice = 15;

  // 3. Website Requirement ("type a type they need")
  const [needWebsite, setNeedWebsite] = useState<boolean>(false);
  const [websiteType, setWebsiteType] = useState<string>('');
  const websiteBasePrice = 80;

  // Client Details
  const [clientName, setClientName] = useState<string>('');
  const [clientWhatsApp, setClientWhatsApp] = useState<string>('');
  const [clientEmail, setClientEmail] = useState<string>('');
  const [projectNotes, setProjectNotes] = useState<string>('');

  // 4. PRICE NEGOTIATION MECHANISM (Client gauges/proposes price first)
  const selectedFlyer = FLYER_TYPES.find(f => f.id === selectedFlyerId) || FLYER_TYPES[0];
  const flyerCost = selectedFlyer.basePrice;
  const videoCost = needVideoGeneration ? videoGenerationPrice : 0;
  const websiteCost = needWebsite && websiteType.trim() ? websiteBasePrice : 0;
  const standardTotal = flyerCost + videoCost + websiteCost;

  // Client-proposed price state (initialized from prefilled client-selected amount if available)
  const [clientProposedPrice, setClientProposedPrice] = useState<string>(() => 
    initialProposedPrice ? String(initialProposedPrice) : String(standardTotal)
  );
  const [negotiationNote, setNegotiationNote] = useState<string>('');

  useEffect(() => {
    if (initialProposedPrice) {
      setClientProposedPrice(String(initialProposedPrice));
    }
  }, [initialProposedPrice]);

  // Parsed proposed amount
  const numericProposedPrice = parseFloat(clientProposedPrice) || standardTotal;
  const isNegotiated = numericProposedPrice !== standardTotal;

  // UI Feedback States
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);
  const [submissionFeedback, setSubmissionFeedback] = useState<string | null>(null);

  // Studio Director Phone Approval & Negotiation State
  const [approvalStatus, setApprovalStatus] = useState<'pending' | 'approved' | 'countered' | 'declined'>('pending');
  const [approvedPrice, setApprovedPrice] = useState<number>(() => numericProposedPrice);
  const [counterPrice, setCounterPrice] = useState<number | null>(null);
  const [isPhoneApprovalModalOpen, setIsPhoneApprovalModalOpen] = useState<boolean>(false);

  // Sync approval status from local orders storage
  useEffect(() => {
    const checkStatus = () => {
      try {
        const orders = JSON.parse(localStorage.getItem('rtson_client_orders') || '[]');
        const current = orders.find((o: any) => o.orderRef === quoteRef || o.id === quoteRef);
        if (current) {
          if (current.negotiationStatus === 'approved') {
            setApprovalStatus('approved');
            if (current.agreedPrice || current.proposedPrice) {
              setApprovedPrice(current.agreedPrice || current.proposedPrice);
            }
          } else if (current.negotiationStatus === 'countered') {
            setApprovalStatus('countered');
            if (current.counterPrice) {
              setCounterPrice(current.counterPrice);
            }
          } else if (current.negotiationStatus === 'declined') {
            setApprovalStatus('declined');
          }
        }
      } catch (e) {
        console.warn('Storage sync check:', e);
      }
    };

    checkStatus();
    window.addEventListener('storage', checkStatus);
    return () => window.removeEventListener('storage', checkStatus);
  }, [quoteRef]);

  // When standard pricing changes, auto-suggest if user hasn't explicitly customized
  const handleFlyerChange = (flyerId: string) => {
    setSelectedFlyerId(flyerId);
    const newFlyer = FLYER_TYPES.find(f => f.id === flyerId) || FLYER_TYPES[0];
    const newStandard = newFlyer.basePrice + (needVideoGeneration ? videoGenerationPrice : 0) + (needWebsite && websiteType.trim() ? websiteBasePrice : 0);
    setClientProposedPrice(String(newStandard));
  };

  // Structured WhatsApp Message (Formatted for quick phone review & 1-tap approval by Studio Director)
  const getWhatsAppMessage = () => {
    const videoDetails = needVideoGeneration 
      ? `YES (+$${videoGenerationPrice}, Ratio: ${videoFormat} Motion Reel)` 
      : 'No';

    const webDetails = needWebsite && websiteType.trim()
      ? `YES (+$${websiteBasePrice} - Scope: ${websiteType.trim()})`
      : 'No';

    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://rtsoncreations.co.zw';
    const oneTapApprovalLink = `${origin}/?approve_quote=${quoteRef}&std=${standardTotal}&price=${numericProposedPrice}&client=${encodeURIComponent(clientName || 'Client')}&flyer=${encodeURIComponent(selectedFlyer.title)}`;

    return (
      `*RTSON CREATIONS - OFFICIAL QUOTATION & PRICE PROPOSAL*\n` +
      `Reference: ${quoteRef}\n` +
      `Date: ${currentDateFormatted}\n\n` +
      `*1. CLIENT INFORMATION:*\n` +
      `• Registered Name: ${clientName || 'Valued Client'}\n` +
      `• WhatsApp/Phone: ${clientWhatsApp || 'Direct'}\n` +
      (clientEmail ? `• Email: ${clientEmail}\n` : '') +
      `\n*2. SPECIFIED PRODUCTION SCOPE:*\n` +
      `• Flyer Type: ${selectedFlyer.title} (Standard: $${flyerCost})\n` +
      (customFlyerTitle ? `  Theme / Title: "${customFlyerTitle}"\n` : '') +
      `• Kinetic Video Reel: ${videoDetails}\n` +
      `• Full-Stack Website: ${webDetails}\n` +
      (projectNotes ? `• Project Notes: "${projectNotes}"\n` : '') +
      `\n----------------------------------------\n` +
      `*3. PRICING & NEGOTIATION BREAKDOWN:*\n` +
      `• Studio Standard Price: $${standardTotal}.00 USD\n` +
      `• *CLIENT PROPOSED PRICE: $${numericProposedPrice}.00 USD* 👈\n` +
      (isNegotiated ? `• Price Difference: ${numericProposedPrice < standardTotal ? `-$${standardTotal - numericProposedPrice}` : `+$${numericProposedPrice - standardTotal}`}\n` : '• Standard rate accepted by client\n') +
      (negotiationNote ? `• Client's Negotiation Note: "${negotiationNote}"\n` : '') +
      `• Status: ${approvalStatus === 'approved' ? 'APPROVED BY STUDIO DIRECTOR ✅' : 'PENDING STUDIO DIRECTOR PHONE APPROVAL ⏳'}\n` +
      `----------------------------------------\n` +
      `📲 *STUDIO DIRECTOR ONE-TAP PHONE APPROVAL LINK:*\n` +
      `Tap here on your phone to instantly approve or counter:\n` +
      `${oneTapApprovalLink}\n` +
      `----------------------------------------\n` +
      `*BRIGHTON'S PHONE QUICK REPLIES:*\n` +
      `Reply with:\n` +
      `✅ *APPROVE $${numericProposedPrice}* - Confirm order at proposed price\n` +
      `🤝 *COUNTER $[AMOUNT]* - Suggest compromise\n` +
      `❌ *STANDARD $${standardTotal}* - Maintain studio price\n\n` +
      `Hello Brighton! I have gauged and submitted this quotation on your website. Please confirm if agreeable.`
    );
  };

  const handleSendWhatsApp = () => {
    sound.playClick();

    // Auto-register into database & local orders so Brighton can review anytime
    saveClientInquiry({
      orderRef: quoteRef,
      name: clientName || 'Valued Client',
      contact: clientWhatsApp || 'WhatsApp Direct',
      clientPhone: clientWhatsApp,
      clientEmail: clientEmail,
      designType: selectedFlyer.title,
      standardPrice: standardTotal,
      proposedPrice: numericProposedPrice,
      agreedPrice: numericProposedPrice,
      negotiationStatus: 'pending_approval',
      negotiationNote: negotiationNote,
      details: 
        `[OFFICIAL QUOTATION WITH NEGOTIATION]\n` +
        `Flyer: ${selectedFlyer.title} ($${flyerCost})\n` +
        `Video Reel: ${needVideoGeneration ? `Yes (${videoFormat}) +$${videoCost}` : 'No'}\n` +
        `Website: ${needWebsite ? `${websiteType} +$${websiteCost}` : 'No'}\n` +
        `Standard Total: $${standardTotal}\n` +
        `Client Proposed Price: $${numericProposedPrice}\n` +
        `Negotiation Note: ${negotiationNote || 'Standard Rate'}\n` +
        `Notes: ${projectNotes || 'None'}`,
      createdAt: new Date().toISOString()
    }).catch(err => console.warn('Auto-save notice:', err));

    const message = getWhatsAppMessage();
    const encoded = encodeURIComponent(message);
    const subject = encodeURIComponent(`[Studio Quotation #${quoteRef}] ${selectedFlyer.title} - $${numericProposedPrice} USD`);
    window.location.href = `mailto:info@rtsoncreations.co.zw?subject=${subject}&body=${encoded}`;
  };

  const handleCopyQuote = () => {
    sound.playClick();
    const message = getWhatsAppMessage();
    navigator.clipboard.writeText(message);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  // Real PDF Download Mechanism using jsPDF & html-to-image
  const handleDownloadPdf = async () => {
    if (!quotationPrintRef.current) return;
    sound.playClick();
    setIsGeneratingPdf(true);

    try {
      // Capture element at high quality (pixelRatio: 2.5)
      const dataUrl = await toPng(quotationPrintRef.current, {
        quality: 0.98,
        pixelRatio: 2.5,
        backgroundColor: '#ffffff'
      });

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth(); // 210mm
      const pdfHeight = pdf.internal.pageSize.getHeight(); // 297mm

      const img = new Image();
      img.src = dataUrl;
      await new Promise((resolve) => {
        img.onload = resolve;
      });

      const margin = 10;
      const printableWidth = pdfWidth - (margin * 2);
      const printableHeight = pdfHeight - (margin * 2);

      let renderWidth = printableWidth;
      let renderHeight = (img.height * renderWidth) / img.width;

      if (renderHeight > printableHeight) {
        const ratio = printableHeight / renderHeight;
        renderWidth = renderWidth * ratio;
        renderHeight = printableHeight;
      }

      const x = (pdfWidth - renderWidth) / 2;
      const y = margin;

      pdf.addImage(dataUrl, 'PNG', x, y, renderWidth, renderHeight);
      pdf.save(`${quoteRef}_Rtson_Creations_Official_Quotation.pdf`);
      setSubmissionFeedback('Official PDF downloaded successfully!');
      setTimeout(() => setSubmissionFeedback(null), 4000);
    } catch (err) {
      console.error('PDF generation error:', err);
      // Fallback: trigger browser print dialog to save as PDF
      window.print();
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Printing Mechanism
  const handlePrint = () => {
    sound.playClick();
    window.print();
  };

  // Save to Firebase / LocalStorage
  const handleSubmitToDesk = async () => {
    if (!clientName.trim() || !clientWhatsApp.trim()) {
      alert('Please provide your Name and WhatsApp number so we can register your quotation.');
      return;
    }
    sound.playClick();
    setIsSubmitting(true);
    setSubmissionFeedback(null);

    try {
      await saveClientInquiry({
        orderRef: quoteRef,
        name: clientName,
        contact: clientWhatsApp,
        clientPhone: clientWhatsApp,
        clientEmail: clientEmail,
        designType: selectedFlyer.title,
        standardPrice: standardTotal,
        proposedPrice: numericProposedPrice,
        agreedPrice: numericProposedPrice,
        negotiationStatus: isNegotiated ? 'pending_approval' : 'approved',
        negotiationNote: negotiationNote,
        details: 
          `[OFFICIAL QUOTATION WITH NEGOTIATION]\n` +
          `Flyer: ${selectedFlyer.title} ($${flyerCost})\n` +
          `Video Reel: ${needVideoGeneration ? `Yes (${videoFormat}) +$${videoCost}` : 'No'}\n` +
          `Website: ${needWebsite ? `${websiteType} +$${websiteCost}` : 'No'}\n` +
          `Standard Total: $${standardTotal}\n` +
          `Client Proposed Price: $${numericProposedPrice}\n` +
          `Negotiation Note: ${negotiationNote || 'Standard Rate'}\n` +
          `Notes: ${projectNotes || 'None'}`,
        createdAt: new Date().toISOString()
      });

      setSubmissionFeedback(
        isNegotiated 
          ? 'Quotation submitted! Brighton has received your proposed price and will review directly on his phone.' 
          : 'Quotation registered successfully with the studio order desk!'
      );
      setTimeout(() => setSubmissionFeedback(null), 6000);
    } catch (e) {
      console.warn('Submission notice:', e);
      setSubmissionFeedback('Saved locally! Click "Send via WhatsApp" for instant studio confirmation.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#12151a] text-white selection:bg-[#ff6b00] selection:text-black py-10 px-4 sm:px-6 lg:px-8">
      
      {/* Ambient Radial Studio Lighting */}
      <div className="absolute top-16 right-1/4 w-[600px] h-[600px] bg-[#ff6b00]/10 rounded-full blur-[140px] pointer-events-none no-print" />
      <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-[#ff8800]/5 rounded-full blur-[140px] pointer-events-none no-print" />

      <div className="relative z-10 max-w-6xl mx-auto space-y-10">
        
        {/* ========================================================================= */}
        {/* TOP HEADER: RAPID & NON-DEMANDING QUOTATION WITH NEGOTIATION               */}
        {/* ========================================================================= */}
        <div className="text-center space-y-3 max-w-3xl mx-auto no-print">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ff6b00]/15 border border-[#ff6b00]/40 text-[#ff6b00] text-xs font-black uppercase tracking-wider"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Quotation &amp; Price Negotiation Desk</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight"
          >
            Official Studio <span className="text-[#ff6b00]">Quotation Generator</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-xs sm:text-sm text-zinc-300 font-medium"
          >
            Pick your flyer type, tick for kinetic video, type your website scope, and propose your negotiated price. All prices can be gauged by you—Takudzwa Brighton reviews and approves directly from his phone.
          </motion.p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-[#ff6b00] pt-1">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> 12–24H Express Delivery
            </span>
            <span className="text-zinc-600">&bull;</span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> 300 DPI Pre-Press Guarantee
            </span>
            <span className="text-zinc-600">&bull;</span>
            <span className="flex items-center gap-1.5">
              <HandCoins className="w-3.5 h-3.5" /> Direct Price Negotiation
            </span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* MAIN WORKBENCH: CONFIGURATION CONTROLS (TOP/LEFT) + ECONET-STYLE QUOTE     */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ======================================================================= */}
          {/* LEFT 5 COLUMNS: INTERACTIVE SELECTION & PRICE GAUGING CONTROLS          */}
          {/* ======================================================================= */}
          <div className="lg:col-span-5 space-y-6 no-print">
            
            {/* 1. PICK FLYER TYPE */}
            <div className="p-5 rounded-3xl bg-[#181c24] border border-white/10 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#ff6b00] text-black font-black text-xs flex items-center justify-center">
                    1
                  </div>
                  <h3 className="text-sm font-black text-white">Pick Flyer Type</h3>
                </div>
                <span className="text-xs font-mono font-bold text-[#ff6b00]">
                  From ${selectedFlyer.basePrice}
                </span>
              </div>

              <div className="space-y-2">
                {FLYER_TYPES.map((flyer) => {
                  const isSelected = selectedFlyerId === flyer.id;
                  return (
                    <div
                      key={flyer.id}
                      onClick={() => {
                        sound.playClick();
                        handleFlyerChange(flyer.id);
                      }}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between min-h-[44px] ${
                        isSelected 
                          ? 'bg-[#1e232d] border-[#ff6b00] shadow-md ring-1 ring-[#ff6b00]' 
                          : 'bg-[#141720] border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="space-y-0.5 pr-2 text-left">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">{flyer.title}</span>
                          <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-white/10 text-zinc-300">
                            {flyer.category}
                          </span>
                        </div>
                        <span className="text-[10px] text-zinc-400 block">{flyer.turnaround} &bull; 300 DPI Pre-Press</span>
                      </div>
                      <span className="font-mono font-black text-xs text-[#ff6b00] shrink-0">
                        ${flyer.basePrice}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div>
                <label className="text-[11px] font-bold text-zinc-300 block mb-1 text-left">
                  Specific Project / Flyer Title (Optional):
                </label>
                <input
                  type="text"
                  value={customFlyerTitle}
                  onChange={(e) => setCustomFlyerTitle(e.target.value)}
                  placeholder="e.g. 2026 Annual Faith Summit, Club Neon Night..."
                  className="w-full px-3 py-2.5 rounded-xl bg-[#141720] border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#ff6b00] min-h-[40px]"
                />
              </div>
            </div>

            {/* 2. VIDEO GENERATION ("TICK AGAIN") */}
            <div className={`p-5 rounded-3xl border transition-all space-y-3 shadow-xl ${
              needVideoGeneration ? 'bg-[#181c24] border-[#ff6b00] shadow-[0_0_20px_rgba(255,107,0,0.2)]' : 'bg-[#181c24] border-white/10'
            }`}>
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <div className="flex items-center gap-2.5">
                  <div className={`w-7 h-7 rounded-lg font-black text-xs flex items-center justify-center ${
                    needVideoGeneration ? 'bg-[#ff6b00] text-black' : 'bg-[#141720] text-zinc-300'
                  }`}>
                    2
                  </div>
                  <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                    <span>Need Video Generation?</span>
                    <span className="text-[10px] font-mono text-[#ff6b00] font-bold">(+${videoGenerationPrice})</span>
                  </h3>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={needVideoGeneration}
                    onChange={(e) => {
                      sound.playClick();
                      const checked = e.target.checked;
                      setNeedVideoGeneration(checked);
                      const newStandard = flyerCost + (checked ? videoGenerationPrice : 0) + (needWebsite && websiteType.trim() ? websiteBasePrice : 0);
                      setClientProposedPrice(String(newStandard));
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-12 h-6 bg-[#141720] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ff6b00]"></div>
                </label>
              </div>

              {needVideoGeneration && (
                <div className="space-y-2 pt-1 animate-fadeIn">
                  <span className="text-[10px] font-mono font-bold text-[#ff6b00] uppercase tracking-wider block">
                    Choose Ratio:
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: '9:16', label: '9:16 Reel', sub: 'WhatsApp' },
                      { id: '1:1', label: '1:1 Square', sub: 'Feed' },
                      { id: '16:9', label: '16:9 Wide', sub: 'Screens' }
                    ].map((ratio) => (
                      <button
                        key={ratio.id}
                        type="button"
                        onClick={() => {
                          sound.playClick();
                          setVideoFormat(ratio.id as any);
                        }}
                        className={`p-2 rounded-xl border text-center transition-all cursor-pointer min-h-[44px] ${
                          videoFormat === ratio.id
                            ? 'bg-[#ff6b00] text-black border-[#ff6b00] font-black'
                            : 'bg-[#141720] text-zinc-300 border-white/10'
                        }`}
                      >
                        <span className="text-xs font-black block">{ratio.label}</span>
                        <span className="text-[9px] opacity-80 block">{ratio.sub}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 3. WEBSITE REQUIREMENT ("TYPE A TYPE THEY NEED") */}
            <div className={`p-5 rounded-3xl border transition-all space-y-3 shadow-xl ${
              needWebsite ? 'bg-[#181c24] border-[#ff6b00] shadow-[0_0_20px_rgba(255,107,0,0.2)]' : 'bg-[#181c24] border-white/10'
            }`}>
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <div className="flex items-center gap-2.5">
                  <div className={`w-7 h-7 rounded-lg font-black text-xs flex items-center justify-center ${
                    needWebsite ? 'bg-[#ff6b00] text-black' : 'bg-[#141720] text-zinc-300'
                  }`}>
                    3
                  </div>
                  <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                    <span>Need a Website?</span>
                    <span className="text-[10px] font-mono text-[#ff6b00] font-bold">(+${websiteBasePrice})</span>
                  </h3>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={needWebsite}
                    onChange={(e) => {
                      sound.playClick();
                      const checked = e.target.checked;
                      setNeedWebsite(checked);
                      if (checked && !websiteType) {
                        setWebsiteType('Church & Ministry Portal');
                      }
                      const newStandard = flyerCost + (needVideoGeneration ? videoGenerationPrice : 0) + (checked ? websiteBasePrice : 0);
                      setClientProposedPrice(String(newStandard));
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-12 h-6 bg-[#141720] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ff6b00]"></div>
                </label>
              </div>

              {needWebsite && (
                <div className="space-y-2 pt-1 animate-fadeIn">
                  <label className="text-[11px] font-mono font-bold text-[#ff6b00] uppercase tracking-wider block">
                    Type the type of website you need:
                  </label>
                  <input
                    type="text"
                    value={websiteType}
                    onChange={(e) => setWebsiteType(e.target.value)}
                    placeholder="e.g. Church Ministry Portal, E-Commerce Store, Corporate Site..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#141720] border-2 border-[#ff6b00] text-xs text-white placeholder-zinc-500 focus:outline-none font-bold min-h-[40px]"
                  />

                  <div className="flex flex-wrap gap-1 pt-1">
                    {WEBSITE_TYPE_SUGGESTIONS.map((sug, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          sound.playClick();
                          setWebsiteType(sug);
                        }}
                        className={`text-[10px] px-2 py-1 rounded-md font-bold transition-all min-h-[30px] ${
                          websiteType === sug ? 'bg-[#ff6b00] text-black font-black' : 'bg-[#141720] text-zinc-300 border border-white/10 hover:border-white/20'
                        }`}
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 4. CLIENT PRICE GAUGING & NEGOTIATION CARD */}
            <div className="p-5 rounded-3xl bg-[#181c24] border-2 border-[#ff6b00] shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <div className="flex items-center gap-2">
                  <HandCoins className="w-5 h-5 text-[#ff6b00]" />
                  <h3 className="text-sm font-black text-white">Client Price Gauging &amp; Negotiation</h3>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#ff6b00]/20 text-[#ff6b00] border border-[#ff6b00]/40 font-bold">
                  Propose First
                </span>
              </div>

              <p className="text-[11px] text-slate-300 leading-relaxed">
                Standard Studio Price is <strong className="text-white font-mono">${standardTotal}.00 USD</strong>. As requested, you can propose your own negotiated price first. Once quotation is sent, Takudzwa Brighton will review and approve directly from his phone via WhatsApp.
              </p>

              {/* Proposed Price Input Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-[#ff8800] uppercase tracking-wider block">
                  Your Proposed / Negotiated Price (USD):
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base font-black text-[#ff6b00] font-mono">
                    $
                  </span>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={clientProposedPrice}
                    onChange={(e) => setClientProposedPrice(e.target.value)}
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-[#141720] border-2 border-[#ff6b00] text-lg font-black text-white font-mono focus:outline-none shadow-inner"
                    placeholder="Enter proposed price"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400 font-bold">
                    USD
                  </span>
                </div>
              </div>

              {/* Quick Negotiation Price Chips */}
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-slate-400 block">Quick price suggestions:</span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    standardTotal,
                    Math.max(10, Math.round(standardTotal * 0.8)),
                    Math.max(10, Math.round(standardTotal * 0.7)),
                    15,
                    20,
                    25,
                    30
                  ].filter((v, i, a) => a.indexOf(v) === i).map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setClientProposedPrice(String(amt));
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                        numericProposedPrice === amt 
                          ? 'bg-[#ff6b00] text-black font-black shadow-sm' 
                          : 'bg-[#141720] text-slate-300 hover:bg-[#1e232d] border border-white/10'
                      }`}
                    >
                      ${amt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Negotiation Note / Reason */}
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">
                  Negotiation Reason / Budget Justification (Optional):
                </label>
                <input
                  type="text"
                  value={negotiationNote}
                  onChange={(e) => setNegotiationNote(e.target.value)}
                  placeholder="e.g. Non-profit church ministry / repeat order partnership / urgent sprint..."
                  className="w-full px-3 py-2 rounded-xl bg-[#141720] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#ff6b00]"
                />
              </div>

              {/* Price comparison status badge */}
              <div className={`p-2.5 rounded-xl border text-xs flex items-center justify-between ${
                isNegotiated 
                  ? 'bg-[#ff6b00]/10 border-[#ff6b00]/40 text-[#ff8800]' 
                  : 'bg-[#141720] border-white/10 text-slate-300'
              }`}>
                <span>Negotiation Status:</span>
                <strong className="font-mono font-bold">
                  {isNegotiated 
                    ? `Pending Studio Director Approval ($${numericProposedPrice})` 
                    : `Standard Studio Rate ($${standardTotal})`}
                </strong>
              </div>
            </div>

            {/* 5. CLIENT CONTACT INFORMATION */}
            <div className="p-4 sm:p-5 rounded-3xl bg-[#181c24] border border-white/10 space-y-3 shadow-xl">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#ff8800]">
                Registered Client Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    Your Full Name <span className="text-[#ff6b00]">*</span>
                  </label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. Pastor Simbarashe / Sarah"
                    className="w-full px-3 py-2 rounded-xl bg-[#141720] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#ff6b00]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    WhatsApp / Phone <span className="text-[#ff6b00]">*</span>
                  </label>
                  <input
                    type="text"
                    value={clientWhatsApp}
                    onChange={(e) => setClientWhatsApp(e.target.value)}
                    placeholder="e.g. 0778330393 / +263 7..."
                    className="w-full px-3 py-2 rounded-xl bg-[#141720] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#ff6b00] font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    Email Address (Optional):
                  </label>
                  <input
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="client@gmail.com"
                    className="w-full px-3 py-2 rounded-xl bg-[#141720] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#ff6b00]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    Special Text / Scriptures / Venue Notes:
                  </label>
                  <textarea
                    rows={2}
                    value={projectNotes}
                    onChange={(e) => setProjectNotes(e.target.value)}
                    placeholder="Any key text to include on the design..."
                    className="w-full px-3 py-1.5 rounded-xl bg-[#141720] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#ff6b00] resize-none"
                  />
                </div>
              </div>
            </div>

            {/* ACTION BUTTONS TOOLBAR */}
            <div className="space-y-2.5 pt-2">
              <button
                type="button"
                onClick={handleSendWhatsApp}
                className="w-full min-h-[48px] py-3.5 px-4 rounded-2xl bg-[#ff6b00] hover:bg-[#ff7a00] text-black font-black text-xs uppercase tracking-wider shadow-lg shadow-[#ff6b00]/25 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4 text-black" />
                <span>Submit Quotation &amp; Proposed Price to <span className="lowercase normal-case font-mono">info@rtsoncreations.co.zw</span></span>
              </button>

              {/* STUDIO DIRECTOR PHONE APPROVAL QUICK ACCESS */}
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setIsPhoneApprovalModalOpen(true);
                }}
                className={`w-full min-h-[44px] py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
                  approvalStatus === 'approved'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                    : 'bg-[#ff6b00]/15 text-[#ff8800] border-[#ff6b00]/30 hover:bg-[#ff6b00]/25'
                }`}
              >
                <Phone className="w-3.5 h-3.5 text-[#ff6b00]" />
                <span>
                  {approvalStatus === 'approved' 
                    ? `✓ Approved by Studio Director ($${approvedPrice}.00 USD) — Manage Proposal` 
                    : `Studio Director Phone Approval Desk — Review & Confirm ($${numericProposedPrice})`}
                </span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  disabled={isGeneratingPdf}
                  className="min-h-[44px] py-2.5 px-3 rounded-xl bg-[#181c24] hover:bg-[#1e232d] text-white border border-white/10 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Download className="w-3.5 h-3.5 text-[#ff6b00]" />
                  <span>{isGeneratingPdf ? 'Generating PDF...' : 'Download PDF'}</span>
                </button>

                <button
                  type="button"
                  onClick={handlePrint}
                  className="min-h-[44px] py-2.5 px-3 rounded-xl bg-[#181c24] hover:bg-[#1e232d] text-white border border-white/10 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Printer className="w-3.5 h-3.5 text-[#ff6b00]" />
                  <span>Print Quotation</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleCopyQuote}
                  className="min-h-[44px] py-2 px-3 rounded-xl bg-[#181c24] hover:bg-[#1e232d] text-slate-300 border border-white/10 text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5 text-[#ff6b00]" /> : <Copy className="w-3.5 h-3.5 text-[#ff6b00]" />}
                  <span>{isCopied ? 'Copied to Clipboard' : 'Copy Quote Text'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleSubmitToDesk}
                  disabled={isSubmitting}
                  className="min-h-[44px] py-2 px-3 rounded-xl bg-[#181c24] hover:bg-[#1e232d] text-slate-300 border border-white/10 text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-[#ff6b00]" />
                  <span>{isSubmitting ? 'Registering...' : 'Register to Desk'}</span>
                </button>
              </div>

              {submissionFeedback && (
                <div className="p-3 rounded-xl bg-[#ff6b00]/20 border border-[#ff6b00]/40 text-[#ff8800] text-xs text-center font-bold animate-fadeIn">
                  {submissionFeedback}
                </div>
              )}
            </div>

          </div>

          {/* ======================================================================= */}
          {/* RIGHT 7 COLUMNS: THE OFFICIAL QUOTATION DOCUMENT (ECONET STYLE)         */}
          {/* Exact Logo Top-Left, Dividing Line, Structured Tables & Declaration      */}
          {/* ======================================================================= */}
          <div className="lg:col-span-7 sticky top-6">
            
            {/* Download/Print Header Strip */}
            <div className="mb-2 flex items-center justify-between text-xs text-slate-400 px-1 no-print">
              <span className="font-mono text-[11px] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#ff6b00] animate-pulse" />
                Official Document Preview (Formatted for A4 PDF &amp; Print)
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadPdf}
                  className="text-[#ff8800] hover:text-[#ff6b00] font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" /> PDF
                </button>
                <span>&bull;</span>
                <button
                  onClick={handlePrint}
                  className="text-slate-300 hover:text-white font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" /> Print
                </button>
              </div>
            </div>

            {/* =================================================================== */}
            {/* THE FORMAL QUOTATION DOCUMENT CONTAINER                             */}
            {/* Designed exactly following the provided PDF:                        */}
            {/* Top-Left Logo, Horizontal Rule, Form Tables, Declaration & Sign-off */}
            {/* =================================================================== */}
            <div 
              ref={quotationPrintRef}
              className="print-document-container w-full bg-white text-black p-8 sm:p-10 rounded-2xl shadow-2xl border border-slate-300 font-sans space-y-6 print:p-0 print:border-0 print:shadow-none print:rounded-none"
              style={{ minHeight: '850px' }}
            >
              
              {/* OFFICIAL STUDIO DIRECTOR APPROVAL BANNER (WHEN APPROVED BY PHONE) */}
              {approvalStatus === 'approved' && (
                <div className="p-3 bg-emerald-50 border-2 border-emerald-600 rounded-xl flex items-center justify-between shadow-xs animate-fadeIn">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-black text-xs uppercase tracking-wider text-emerald-950 block">
                        OFFICIALLY APPROVED BY TAKUDZWA BRIGHTON
                      </span>
                      <span className="text-[10px] text-emerald-800 block">
                        Verified via Studio Production Desk &bull; Rate Confirmed for Production
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] font-mono uppercase text-emerald-700 font-bold block">
                      Confirmed Rate
                    </span>
                    <span className="text-base font-mono font-black text-emerald-900">
                      ${approvedPrice}.00 USD
                    </span>
                  </div>
                </div>
              )}

              {/* ----------------------------------------------------------------- */}
              {/* HEADER: TOP-LEFT LOGO & HORIZONTAL DIVIDING LINE (ECONET STYLE)   */}
              {/* ----------------------------------------------------------------- */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  {/* Top-Left Logo Positioning as requested */}
                  <div className="flex items-center gap-2.5">
                    <RtsonLogo size="sm" textColor="dark" showSubtitle={false} />
                    <div className="border-l border-slate-300 pl-2.5">
                      <span className="text-[10px] font-mono font-black uppercase tracking-wider text-slate-800 block">
                        RTSON CREATIONS (PVT) LTD
                      </span>
                      <span className="text-[9px] font-sans text-slate-500 block">
                        Graphic Design &bull; 300 DPI Pre-Press &bull; Web Architecture
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block">
                      DOCUMENT NO:
                    </span>
                    <span className="text-xs font-mono font-black text-black">
                      {quoteRef}
                    </span>
                  </div>
                </div>

                {/* Horizontal dividing line across the page underneath logo */}
                <div className="w-full h-[1.5px] bg-slate-900" />
              </div>

              {/* ----------------------------------------------------------------- */}
              {/* DOCUMENT TITLE & PERIOD (CENTERED LIKE PDF PAGE 1)                */}
              {/* ----------------------------------------------------------------- */}
              <div className="text-center py-2 space-y-1">
                <h2 className="text-base sm:text-lg font-black tracking-wider uppercase text-black">
                  OFFICIAL STUDIO QUOTATION &amp; SPECIFICATION PROPOSAL
                </h2>
                <p className="text-[11px] font-semibold text-slate-700">
                  Graphic Design &bull; Kinetic Motion Video &bull; Full-Stack Web Development
                </p>
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block pt-0.5">
                  2026 / 2027 PRODUCTION TERM &bull; DATE ISSUED: {currentDateFormatted}
                </span>
              </div>

              {/* ----------------------------------------------------------------- */}
              {/* 1. PERSONAL & PRODUCTION INFORMATION (TABLE MATCHING PDF PAGE 2)  */}
              {/* ----------------------------------------------------------------- */}
              <div className="space-y-1.5">
                <h3 className="text-xs font-black uppercase tracking-wider text-black">
                  1. PERSONAL &amp; PRODUCTION INFORMATION
                </h3>

                <div className="border border-slate-900 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 border-b border-slate-900">
                    <div className="p-2 border-b sm:border-b-0 sm:border-r border-slate-900 flex justify-between">
                      <span className="font-bold text-slate-700">Registered Client Name:</span>
                      <span className="font-black text-black">{clientName || 'Simbarashe Winter Muserengi'}</span>
                    </div>
                    <div className="p-2 flex justify-between">
                      <span className="font-bold text-slate-700">Phone / WhatsApp Number:</span>
                      <span className="font-mono font-black text-black">{clientWhatsApp || '0778330393'}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 border-b border-slate-900">
                    <div className="p-2 border-b sm:border-b-0 sm:border-r border-slate-900 flex justify-between">
                      <span className="font-bold text-slate-700">Project / Flyer Title:</span>
                      <span className="font-bold text-black">{customFlyerTitle || selectedFlyer.title}</span>
                    </div>
                    <div className="p-2 flex justify-between">
                      <span className="font-bold text-slate-700">Email Address:</span>
                      <span className="font-mono text-slate-800">{clientEmail || 'info@rtsoncreations.co.zw'}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2">
                    <div className="p-2 border-b sm:border-b-0 sm:border-r border-slate-900 flex justify-between">
                      <span className="font-bold text-slate-700">Studio Lead Designer:</span>
                      <span className="font-black text-black">Takudzwa Brighton Zvandaziva</span>
                    </div>
                    <div className="p-2 flex justify-between">
                      <span className="font-bold text-slate-700">District / Province:</span>
                      <span className="font-bold text-black">Harare, Zimbabwe</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ----------------------------------------------------------------- */}
              {/* 2. SPECIFIED PRODUCTION SCOPE (TABLE MATCHING PDF CROPPING TABLE) */}
              {/* ----------------------------------------------------------------- */}
              <div className="space-y-1.5">
                <h3 className="text-xs font-black uppercase tracking-wider text-black">
                  2. PRODUCTION SCOPE &amp; SPECIFICATIONS
                </h3>

                <table className="w-full border-collapse border border-slate-900 text-xs">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-900">
                      <th className="border-r border-slate-900 p-2 text-left font-black w-10">Item</th>
                      <th className="border-r border-slate-900 p-2 text-left font-black">Service Description &amp; Technical Specs</th>
                      <th className="border-r border-slate-900 p-2 text-left font-black w-28">Turnaround</th>
                      <th className="p-2 text-right font-black w-24">Standard Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Flyer Row */}
                    <tr className="border-b border-slate-900">
                      <td className="border-r border-slate-900 p-2 font-mono text-center font-bold">01</td>
                      <td className="border-r border-slate-900 p-2">
                        <strong className="block font-black">{selectedFlyer.title}</strong>
                        <span className="text-[10px] text-slate-600 block">
                          300 DPI Pre-Press CMYK (Print Ready) + RGB Master (WhatsApp Status &amp; Social Media). Express Delivery.
                        </span>
                      </td>
                      <td className="border-r border-slate-900 p-2 font-mono text-slate-700">
                        12–24 Hours
                      </td>
                      <td className="p-2 text-right font-mono font-bold">
                        ${flyerCost}.00
                      </td>
                    </tr>

                    {/* Video Generation Row */}
                    <tr className="border-b border-slate-900">
                      <td className="border-r border-slate-900 p-2 font-mono text-center font-bold">02</td>
                      <td className="border-r border-slate-900 p-2">
                        <strong className="block font-black">
                          {needVideoGeneration ? 'Kinetic Video Motion Flyer (CapCut Reel Promo)' : 'Kinetic Video Generation Reel'}
                        </strong>
                        <span className="text-[10px] text-slate-600 block">
                          {needVideoGeneration 
                            ? `Format: ${videoFormat} Ratio &bull; Beat-synced typography &amp; sound effects` 
                            : 'Not commissioned for this order'}
                        </span>
                      </td>
                      <td className="border-r border-slate-900 p-2 font-mono text-slate-700">
                        {needVideoGeneration ? '12–24 Hours' : '—'}
                      </td>
                      <td className="p-2 text-right font-mono font-bold">
                        {needVideoGeneration ? `+$${videoCost}.00` : '$0.00'}
                      </td>
                    </tr>

                    {/* Website Row */}
                    <tr className="border-b border-slate-900">
                      <td className="border-r border-slate-900 p-2 font-mono text-center font-bold">03</td>
                      <td className="border-r border-slate-900 p-2">
                        <strong className="block font-black">
                          {needWebsite && websiteType.trim() ? `Full-Stack Website: ${websiteType.trim()}` : 'Website Development'}
                        </strong>
                        <span className="text-[10px] text-slate-600 block">
                          {needWebsite && websiteType.trim() 
                            ? 'Custom responsive web solution, SEO metadata, mobile optimized &amp; WhatsApp integration' 
                            : 'Not commissioned for this order'}
                        </span>
                      </td>
                      <td className="border-r border-slate-900 p-2 font-mono text-slate-700">
                        {needWebsite && websiteType.trim() ? '3–5 Days' : '—'}
                      </td>
                      <td className="p-2 text-right font-mono font-bold">
                        {needWebsite && websiteType.trim() ? `+$${websiteCost}.00` : '$0.00'}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* ----------------------------------------------------------------- */}
              {/* 3. PRICE GAUGING & CLIENT NEGOTIATION TABLE (PDF CLAIM/VALUE STYLE) */}
              {/* ----------------------------------------------------------------- */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-wider text-black">
                    3. PRICE GAUGING &amp; CLIENT NEGOTIATION SUMMARY
                  </h3>
                  <span className="text-[10px] font-mono text-slate-600">
                    Currency: United States Dollars (USD)
                  </span>
                </div>

                <table className="w-full border-collapse border border-slate-900 text-xs">
                  <tbody>
                    <tr className="border-b border-slate-900">
                      <td className="border-r border-slate-900 p-2 font-bold bg-slate-50 w-2/3">
                        Studio Standard Calculated Total Rate:
                      </td>
                      <td className="p-2 text-right font-mono font-bold">
                        ${standardTotal}.00 USD
                      </td>
                    </tr>

                    <tr className="border-b border-slate-900 bg-orange-50/70">
                      <td className="border-r border-slate-900 p-2 font-black text-black flex items-center justify-between">
                        <span>CLIENT PROPOSED / NEGOTIATED PRICE (GAUGED):</span>
                        <span className="text-[10px] font-mono bg-black text-white px-2 py-0.5 rounded font-normal">
                          Client Offer
                        </span>
                      </td>
                      <td className="p-2 text-right font-mono font-black text-sm text-black">
                        ${numericProposedPrice}.00 USD
                      </td>
                    </tr>

                    <tr className="border-b border-slate-900">
                      <td className="border-r border-slate-900 p-2 text-slate-700">
                        Negotiation Approval State:
                      </td>
                      <td className="p-2 text-right font-mono text-[11px] font-bold">
                        {approvalStatus === 'approved' ? (
                          <span className="text-emerald-700 font-black">✓ APPROVED BY STUDIO DIRECTOR (STUDIO DESK VERIFIED)</span>
                        ) : approvalStatus === 'countered' ? (
                          <span className="text-blue-700 font-black">● STUDIO DIRECTOR COUNTER-OFFER: ${counterPrice || approvedPrice}.00 USD</span>
                        ) : isNegotiated ? (
                          <span className="text-amber-700 font-bold">● PENDING STUDIO DIRECTOR APPROVAL</span>
                        ) : (
                          <span className="text-emerald-700">● STANDARD STUDIO RATE CONFIRMED</span>
                        )}
                      </td>
                    </tr>

                    {negotiationNote && (
                      <tr>
                        <td className="border-r border-slate-900 p-2 text-slate-600 italic">
                          Client Negotiation Note / Justification:
                        </td>
                        <td className="p-2 font-mono text-[10px] text-slate-800">
                          "{negotiationNote}"
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* ----------------------------------------------------------------- */}
              {/* 4. PRE-PRESS STANDARDS & TERMS OF COMMENCEMENT                    */}
              {/* ----------------------------------------------------------------- */}
              <div className="p-3 bg-slate-50 border border-slate-300 rounded-lg space-y-1 text-[10px] text-slate-700 leading-relaxed">
                <span className="font-bold text-black uppercase tracking-wider block">
                  Studio Deliverables &amp; Turnaround Agreement:
                </span>
                <p>
                  1. All designs are produced at <strong className="text-black">300 DPI CMYK</strong> resolution with 3mm bleed margin, guaranteed print-shop compatible.
                </p>
                <p>
                  2. Express turnaround is guaranteed within <strong className="text-black">12–24 Hours</strong> from project brief and asset receipt.
                </p>
                <p>
                  3. Client proposed price is subject to studio director approval via Studio Desk (info@rtsoncreations.co.zw). Final deliverables are released upon completion.
                </p>
              </div>

              {/* ----------------------------------------------------------------- */}
              {/* 5. DECLARATION & SIGNATURES (MATCHING PAGE 5 OF THE PDF)          */}
              {/* ----------------------------------------------------------------- */}
              <div className="pt-2 space-y-3">
                <span className="text-xs font-black uppercase tracking-wider text-black block border-b border-slate-900 pb-1">
                  DECLARATION &amp; MUTUAL SIGN-OFF
                </span>

                <div className="grid grid-cols-2 gap-8 text-xs pt-1">
                  
                  {/* Left: Studio Lead Signature */}
                  <div className="space-y-3">
                    <div className="h-10 flex items-end">
                      {/* Stylized Digital Signature Stamp */}
                      <span className="font-serif italic font-bold text-base text-slate-900 underline decoration-slate-400">
                        Takudzwa Brighton Zvandaziva
                      </span>
                    </div>
                    <div className="border-t border-slate-900 pt-1 space-y-0.5">
                      <span className="font-black text-black block">TAKUDZWA BRIGHTON ZVANDAZIVA</span>
                      <span className="text-[10px] text-slate-600 block">Creative Director &amp; Principal Lead, Rtson Creations</span>
                      {approvalStatus === 'approved' && (
                        <span className="text-[10px] font-mono text-emerald-700 font-black block">
                          ✓ VERIFIED &amp; APPROVED VIA STUDIO DESK (info@rtsoncreations.co.zw)
                        </span>
                      )}
                      <span className="text-[10px] font-mono text-slate-500 block">Date: {currentDateFormatted}</span>
                    </div>
                  </div>

                  {/* Right: Client / Proposer Acceptance */}
                  <div className="space-y-3">
                    <div className="h-10 flex items-end">
                      <span className="font-serif italic text-sm text-slate-700">
                        {clientName ? `${clientName} (Proposed)` : 'Client Signature Line'}
                      </span>
                    </div>
                    <div className="border-t border-slate-900 pt-1 space-y-0.5">
                      <span className="font-black text-black block">
                        {clientName ? clientName.toUpperCase() : 'REGISTERED CLIENT / PROPOSER'}
                      </span>
                      <span className="text-[10px] text-slate-600 block">
                        Client Proposed Price: ${numericProposedPrice}.00 USD
                      </span>
                      <span className="text-[10px] font-mono text-slate-500 block">Date: {currentDateFormatted}</span>
                    </div>
                  </div>

                </div>
              </div>

              {/* ----------------------------------------------------------------- */}
              {/* 6. PAYMENT SETTLEMENT CHANNELS (ZIMBABWE & INTERNATIONAL)         */}
              {/* ----------------------------------------------------------------- */}
              <div className="p-3 bg-slate-50 border border-slate-300 rounded-lg space-y-2 text-[10px]">
                <span className="font-bold text-black uppercase tracking-wider block">
                  6. Official Payment Settlement Channels (Zimbabwe &amp; International):
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-700">
                  <div className="p-2 bg-white border border-slate-200 rounded">
                    <strong className="block text-slate-900 font-bold">EcoCash Zimbabwe</strong>
                    <span className="font-mono text-black font-bold">Provided on Invoice</span>
                    <span className="block text-[9px] text-slate-500">EcoCash Merchant</span>
                  </div>
                  <div className="p-2 bg-white border border-slate-200 rounded">
                    <strong className="block text-slate-900 font-bold">InnBucks Express</strong>
                    <span className="font-mono text-black font-bold">Provided on Invoice</span>
                    <span className="block text-[9px] text-slate-500">USD Transfer</span>
                  </div>
                  <div className="p-2 bg-white border border-slate-200 rounded">
                    <strong className="block text-slate-900 font-bold">ZIPIT / Bank</strong>
                    <span className="block text-[9px] text-slate-600">CABS / Stanbic</span>
                    <span className="block text-[9px] text-slate-500">On request</span>
                  </div>
                  <div className="p-2 bg-white border border-slate-200 rounded">
                    <strong className="block text-slate-900 font-bold">PayPal Global</strong>
                    <span className="font-mono text-[9px] text-black">info@rtsoncreations.co.zw</span>
                  </div>
                </div>
              </div>

              {/* ----------------------------------------------------------------- */}
              {/* FOOTER: PAGE NUMBER & STUDIO CONTACT (MATCHING PDF FOOTER)        */}
              {/* ----------------------------------------------------------------- */}
              <div className="pt-6 border-t border-slate-900 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                <span>Rtson Creations Official Quotation &bull; Harare, Zimbabwe &bull; info@rtsoncreations.co.zw</span>
                <span>Page 1 of 1</span>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* STUDIO DIRECTOR PHONE APPROVAL MODAL */}
      <PhoneApprovalModal
        isOpen={isPhoneApprovalModalOpen}
        onClose={() => setIsPhoneApprovalModalOpen(false)}
        quoteRef={quoteRef}
        clientName={clientName}
        clientPhone={clientWhatsApp}
        standardPrice={standardTotal}
        proposedPrice={numericProposedPrice}
        flyerTitle={selectedFlyer.title}
        clientNote={negotiationNote}
        onApproved={(newPrice) => {
          setApprovalStatus('approved');
          setApprovedPrice(newPrice);
          setClientProposedPrice(String(newPrice));
        }}
      />

    </div>
  );
};
