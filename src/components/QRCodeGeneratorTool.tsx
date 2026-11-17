import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { 
  QrCode, 
  Download, 
  Copy, 
  Check, 
  ExternalLink, 
  Sparkles, 
  Layers, 
  Palette, 
  Sliders, 
  FileText, 
  Share2, 
  RefreshCw,
  Plus,
  Zap,
  Tag,
  Cross,
  Ticket,
  Video,
  MessageCircle,
  MapPin,
  Globe,
  Music,
  DollarSign,
  Upload,
  Eye,
  ArrowRight,
  Info,
  ShieldCheck,
  Clock,
  Smartphone,
  Tv,
  Image as ImageIcon
} from 'lucide-react';
import { AttachedOrderPhoto, QRCodeCustomization } from '../types';
import { sound } from '../lib/soundFx';
import churchFlyer1 from '../assets/images/real_church_flyer_1787906566871.jpg';

export interface QRCodeGeneratorToolProps {
  initialUrl?: string;
  initialCallout?: string;
  orderRef?: string;
  clientName?: string;
  projectTitle?: string;
  categoryName?: string;
  mockupImageUrl?: string;
  onAttachToOrder?: (photo: AttachedOrderPhoto) => void;
  onClose?: () => void;
  onOpenMockupViewer?: (imageUrl: string, title: string) => void;
  onOpenProofingPortal?: () => void;
  onOpenOrderTracker?: () => void;
  className?: string;
  isEmbedded?: boolean;
}

// Mockup & Asset Portal Presets (Primary Workflow)
const MOCKUP_TARGET_PRESETS = [
  {
    id: 'mockup_3d',
    label: '3D Design Mockup Stage',
    badge: 'Interactive 3D',
    icon: Eye,
    description: 'Realistic simulation on Sanctuary LED, City Billboard, Gold Art Frame & iPhone Feed.',
    defaultCallout: 'SCAN TO VIEW 3D DESIGN MOCKUP',
    pathSuffix: 'view=mockup',
    centerIcon: 'eye' as const
  },
  {
    id: 'proofing',
    label: 'Live Client Proofing Portal',
    badge: 'Revision & Approval',
    icon: ShieldCheck,
    description: 'Side-by-side CMYK drafts, revision feedback notes & one-click client sign-off.',
    defaultCallout: 'SCAN TO APPROVE FINAL DRAFT',
    pathSuffix: 'view=proofing',
    centerIcon: 'shield' as const
  },
  {
    id: 'progress_tracker',
    label: 'Real-Time Order & Dispatch Tracker',
    badge: 'Live Progress',
    icon: Clock,
    description: 'Real-time production timeline: Brief confirmed → 3D Design → Review → Final delivery.',
    defaultCallout: 'SCAN TO TRACK ORDER PROGRESS',
    pathSuffix: 'view=tracker',
    centerIcon: 'clock' as const
  },
  {
    id: 'asset_vault',
    label: '300 DPI Asset Vault & Deliverables',
    badge: 'High-Res Assets',
    icon: Download,
    description: 'Instant download link for 300 DPI CMYK PDFs, vector SVG assets & transparent PNG cutouts.',
    defaultCallout: 'SCAN TO ACCESS PRODUCTION ASSETS',
    pathSuffix: 'view=assets',
    centerIcon: 'download' as const
  },
  {
    id: 'custom_mockup',
    label: 'Custom Cloud Mockup / Portfolio Link',
    badge: 'Google Drive / Figma',
    icon: Globe,
    description: 'Direct link to your shared Google Drive folder, Figma canvas, Dropbox, or client portal.',
    defaultCallout: 'SCAN FOR DESIGN ASSETS & MOCKUP',
    pathSuffix: '',
    centerIcon: 'globe' as const
  }
];

// Event & Flyer Promotional Presets (Secondary Workflow)
const EVENT_PRESET_CATEGORIES = [
  { id: 'tickets', label: 'Ticket & Registration', icon: Ticket, defaultCallout: 'SCAN TO REGISTER / GET TICKETS', sampleUrl: 'https://eventbrite.com/e/conference-tickets' },
  { id: 'rsvp', label: 'Church RSVP & Service', icon: Cross, defaultCallout: 'SCAN TO RSVP / JOIN SERVICE', sampleUrl: 'https://churchwebsite.org/events/praise-night' },
  { id: 'livestream', label: 'YouTube / Livestream', icon: Video, defaultCallout: 'WATCH LIVE ON YOUTUBE', sampleUrl: 'https://youtube.com/live/stream-id' },
  { id: 'location', label: 'Venue GPS & Directions', icon: MapPin, defaultCallout: 'SCAN FOR GPS DIRECTIONS', sampleUrl: 'https://maps.google.com/?q=-17.82485,31.05303' },
  { id: 'whatsapp', label: 'WhatsApp Community', icon: MessageCircle, defaultCallout: 'JOIN WHATSAPP GROUP', sampleUrl: 'https://chat.whatsapp.com/invite-code' },
  { id: 'giving', label: 'Giving / EcoCash / Donations', icon: DollarSign, defaultCallout: 'SCAN TO GIVE / DONATE', sampleUrl: 'https://paynow.co.zw/payment-link' },
  { id: 'social', label: 'Instagram / Spotify', icon: Music, defaultCallout: 'FOLLOW US / LISTEN NOW', sampleUrl: 'https://instagram.com/rtson_creations' },
  { id: 'custom', label: 'Custom Website URL', icon: Globe, defaultCallout: 'SCAN HERE FOR MORE INFO', sampleUrl: 'https://rtsoncreations.co.zw' },
];

const THEME_PRESETS: {
  id: QRCodeCustomization['themePreset'];
  label: string;
  fg: string;
  bg: string;
  border: string;
  bannerBg: string;
  bannerText: string;
  description: string;
}[] = [
  {
    id: 'gold_navy',
    label: 'Royal Gold & Midnight',
    fg: '#f59e0b',
    bg: '#040e22',
    border: '#d97706',
    bannerBg: 'linear-gradient(135deg, #f59e0b, #d97706)',
    bannerText: '#040e22',
    description: 'Executive studio aesthetic for high-end design reviews'
  },
  {
    id: 'monochrome',
    label: 'Ultra High-Contrast Print (B&W)',
    fg: '#000000',
    bg: '#ffffff',
    border: '#000000',
    bannerBg: '#000000',
    bannerText: '#ffffff',
    description: '100% reliable scan rate across all screens & print'
  },
  {
    id: 'electric_neon',
    label: 'Electric Cyan & Deep Slate',
    fg: '#06b6d4',
    bg: '#020617',
    border: '#0891b2',
    bannerBg: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
    bannerText: '#ffffff',
    description: 'Modern tech aesthetic for web & digital apps'
  },
  {
    id: 'emerald_luxury',
    label: 'Emerald Velvet & Gold',
    fg: '#34d399',
    bg: '#022c22',
    border: '#059669',
    bannerBg: 'linear-gradient(135deg, #10b981, #059669)',
    bannerText: '#ffffff',
    description: 'Luxury corporate galas & awards branding'
  },
  {
    id: 'ruby_champagne',
    label: 'Ruby Crimson & Rose',
    fg: '#fb7185',
    bg: '#4c0519',
    border: '#e11d48',
    bannerBg: 'linear-gradient(135deg, #f43f5e, #be123c)',
    bannerText: '#ffffff',
    description: 'Dynamic red for nightlife, fashion & festivals'
  },
  {
    id: 'custom',
    label: 'Custom Studio Palette',
    fg: '#fbbf24',
    bg: '#0f172a',
    border: '#f59e0b',
    bannerBg: '#f59e0b',
    bannerText: '#0f172a',
    description: 'Pick any custom hex colors'
  }
];

const MOCKUP_CALLOUT_PRESETS = [
  'SCAN TO VIEW 3D DESIGN MOCKUP',
  'SCAN TO ACCESS PRODUCTION ASSETS',
  'SCAN TO TRACK ORDER PROGRESS',
  'SCAN TO APPROVE FINAL DRAFT',
  'CLIENT DESIGN REVIEW & PROOFING',
  '300 DPI PRINT-READY MASTER FILES',
  'SCAN FOR CLIENT ASSET VAULT'
];

export const QRCodeGeneratorTool: React.FC<QRCodeGeneratorToolProps> = ({
  initialUrl = '',
  initialCallout = 'SCAN TO VIEW 3D DESIGN MOCKUP',
  orderRef,
  clientName = 'Valued Client',
  projectTitle = 'Finalized Artwork Mockup',
  categoryName = 'Graphic Design',
  mockupImageUrl,
  onAttachToOrder,
  onClose,
  onOpenMockupViewer,
  onOpenProofingPortal,
  onOpenOrderTracker,
  className = '',
  isEmbedded = false
}) => {
  // Base App URL detection
  const baseUrl = typeof window !== 'undefined' 
    ? (window.location.origin.includes('localhost') || window.location.origin.includes('run.app') ? window.location.origin : 'https://rtsoncreations.co.zw')
    : 'https://rtsoncreations.co.zw';

  const cleanOrderRef = orderRef || `RC-${Math.floor(100000 + Math.random() * 900000)}`;

  // Mode: 'mockup_share' (Requested feature) vs 'event_flyer' (Promotional flyer link)
  const [toolMode, setToolMode] = useState<'mockup_share' | 'event_flyer'>('mockup_share');

  // Mockup Target Selection
  const [mockupTarget, setMockupTarget] = useState<string>('mockup_3d');

  // Simulated Environment for Mockup Preview
  const [mockupEnvPreview, setMockupEnvPreview] = useState<'church_led' | 'street_billboard' | 'gallery_frame' | 'iphone_feed'>('church_led');

  // URL & Banner State
  const defaultMockupUrl = `${baseUrl}/?view=mockup&order=${cleanOrderRef}&title=${encodeURIComponent(projectTitle)}`;
  const [url, setUrl] = useState<string>(initialUrl || defaultMockupUrl);
  const [calloutText, setCalloutText] = useState<string>(initialCallout);
  const [category, setCategory] = useState<string>('mockup');
  
  // Customization
  const [themePreset, setThemePreset] = useState<QRCodeCustomization['themePreset']>('gold_navy');
  const [customFg, setCustomFg] = useState('#f59e0b');
  const [customBg, setCustomBg] = useState('#040e22');
  const [frameStyle, setFrameStyle] = useState<'banner_top' | 'banner_bottom' | 'minimal_card' | 'plain'>('banner_top');
  const [centerIcon, setCenterIcon] = useState<QRCodeCustomization['centerIconType']>('eye');
  const [customLogoDataUrl, setCustomLogoDataUrl] = useState<string | null>(null);

  // Notifications & Render
  const [renderedDataUrl, setRenderedDataUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [copiedLinkNotification, setCopiedLinkNotification] = useState<boolean>(false);
  const [copiedImageNotification, setCopiedImageNotification] = useState<boolean>(false);
  const [attachedNotification, setAttachedNotification] = useState<boolean>(false);
  const [whatsAppNotification, setWhatsAppNotification] = useState<boolean>(false);

  const compositeCanvasRef = useRef<HTMLCanvasElement>(null);

  const activeTheme = THEME_PRESETS.find(t => t.id === themePreset) || THEME_PRESETS[0];
  const fgColor = themePreset === 'custom' ? customFg : activeTheme.fg;
  const bgColor = themePreset === 'custom' ? customBg : activeTheme.bg;

  // Active mockup image: use passed image, or fallback high-res flyer
  const activeMockupImage = mockupImageUrl || churchFlyer1;

  // Switch URL and Callout when Mockup Target changes
  const handleSelectMockupTarget = (presetId: string) => {
    sound.playClick();
    setMockupTarget(presetId);
    const target = MOCKUP_TARGET_PRESETS.find(p => p.id === presetId);
    if (!target) return;

    setCalloutText(target.defaultCallout);
    setCenterIcon(target.centerIcon);

    if (presetId === 'mockup_3d') {
      setUrl(`${baseUrl}/?view=mockup&order=${cleanOrderRef}&title=${encodeURIComponent(projectTitle)}`);
      setCategory('mockup');
    } else if (presetId === 'proofing') {
      setUrl(`${baseUrl}/?view=proofing&order=${cleanOrderRef}`);
      setCategory('proofing');
    } else if (presetId === 'progress_tracker') {
      setUrl(`${baseUrl}/?view=tracker&order=${cleanOrderRef}`);
      setCategory('tracker');
    } else if (presetId === 'asset_vault') {
      setUrl(`${baseUrl}/?view=assets&order=${cleanOrderRef}`);
      setCategory('assets');
    } else if (presetId === 'custom_mockup') {
      setCategory('custom');
      if (url.includes('view=') || url === defaultMockupUrl) {
        setUrl('https://drive.google.com/drive/folders/client-design-assets');
      }
    }
  };

  // Generate QR Code with high-res Canvas compositor
  useEffect(() => {
    let isSubscribed = true;

    const generateCompositeQR = async () => {
      if (!url.trim()) return;
      setIsGenerating(true);

      try {
        const qrSize = 800; // 300 DPI high resolution
        const qrCanvas = document.createElement('canvas');
        qrCanvas.width = qrSize;
        qrCanvas.height = qrSize;

        await QRCode.toCanvas(qrCanvas, url, {
          width: qrSize,
          margin: 2,
          color: {
            dark: fgColor,
            light: bgColor
          },
          errorCorrectionLevel: 'H'
        });

        const composite = compositeCanvasRef.current || document.createElement('canvas');
        const ctx = composite.getContext('2d');
        if (!ctx) return;

        let totalWidth = qrSize + 120;
        let totalHeight = qrSize + 120;
        let qrOffsetY = 60;
        const bannerHeight = 84;

        if (frameStyle === 'banner_top') {
          totalHeight = qrSize + bannerHeight + 110;
          qrOffsetY = bannerHeight + 55;
        } else if (frameStyle === 'banner_bottom') {
          totalHeight = qrSize + bannerHeight + 110;
          qrOffsetY = 55;
        } else if (frameStyle === 'plain') {
          totalWidth = qrSize;
          totalHeight = qrSize;
          qrOffsetY = 0;
        }

        composite.width = totalWidth;
        composite.height = totalHeight;

        // Background Frame
        if (frameStyle !== 'plain') {
          ctx.fillStyle = bgColor;
          ctx.beginPath();
          ctx.roundRect(0, 0, totalWidth, totalHeight, 36);
          ctx.fill();

          // Border stroke
          ctx.strokeStyle = fgColor;
          ctx.lineWidth = 6;
          ctx.stroke();

          // Outer hairline
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.roundRect(6, 6, totalWidth - 12, totalHeight - 12, 30);
          ctx.stroke();
        }

        // Draw QR Code
        const qrDrawX = (totalWidth - qrSize) / 2;
        ctx.drawImage(qrCanvas, qrDrawX, qrOffsetY, qrSize, qrSize);

        // Center Emblem / Icon Overlay
        if (centerIcon !== 'none' || customLogoDataUrl) {
          const iconSize = qrSize * 0.22;
          const iconX = (totalWidth - iconSize) / 2;
          const iconY = qrOffsetY + (qrSize - iconSize) / 2;

          // Emblem background
          ctx.fillStyle = bgColor;
          ctx.beginPath();
          ctx.roundRect(iconX - 8, iconY - 8, iconSize + 16, iconSize + 16, 22);
          ctx.fill();

          ctx.strokeStyle = fgColor;
          ctx.lineWidth = 4;
          ctx.stroke();

          if (customLogoDataUrl) {
            const logoImg = new Image();
            logoImg.src = customLogoDataUrl;
            await new Promise((resolve) => {
              logoImg.onload = () => {
                ctx.drawImage(logoImg, iconX, iconY, iconSize, iconSize);
                resolve(null);
              };
              logoImg.onerror = () => resolve(null);
            });
          } else {
            // Stylized vector glyphs
            ctx.fillStyle = fgColor;
            ctx.font = `bold ${Math.floor(iconSize * 0.44)}px 'Plus Jakarta Sans', sans-serif, system-ui`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            let symbol = '3D';
            if (centerIcon === 'eye') symbol = '3D';
            else if (centerIcon === 'download') symbol = 'HD';
            else if (centerIcon === 'shield') symbol = '✓';
            else if (centerIcon === 'clock') symbol = 'LIVE';
            else if (centerIcon === 'smartphone') symbol = 'APP';
            else if (centerIcon === 'ticket') symbol = 'T';
            else if (centerIcon === 'cross') symbol = '+';
            else if (centerIcon === 'youtube') symbol = 'YT';
            else if (centerIcon === 'whatsapp') symbol = 'WA';
            else if (centerIcon === 'location') symbol = 'GPS';
            else if (centerIcon === 'globe') symbol = 'WEB';
            else if (centerIcon === 'dollar') symbol = '$';

            ctx.fillText(symbol, iconX + iconSize / 2, iconY + iconSize / 2 + 1);
          }
        }

        // Draw Banner Text
        if ((frameStyle === 'banner_top' || frameStyle === 'banner_bottom' || frameStyle === 'minimal_card') && calloutText.trim()) {
          const bannerY = frameStyle === 'banner_top' ? 28 : totalHeight - bannerHeight - 34;
          const bannerW = totalWidth - 70;
          const bannerX = 35;

          // Banner fill
          ctx.fillStyle = fgColor;
          ctx.beginPath();
          ctx.roundRect(bannerX, bannerY, bannerW, bannerHeight, 20);
          ctx.fill();

          // Text
          ctx.fillStyle = bgColor;
          ctx.font = `900 ${Math.floor(bannerHeight * 0.38)}px 'Plus Jakarta Sans', sans-serif, system-ui`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(calloutText.toUpperCase(), totalWidth / 2, bannerY + bannerHeight / 2);
        }

        // Subtext Footer
        if (frameStyle !== 'plain') {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
          ctx.font = `600 16px monospace`;
          ctx.textAlign = 'center';
          const footerY = frameStyle === 'banner_bottom' ? 36 : totalHeight - 18;
          ctx.fillText(`R'TSON CREATIONS • #${cleanOrderRef} • 300 DPI PRE-PRESS`, totalWidth / 2, footerY);
        }

        const dataUrl = composite.toDataURL('image/png');
        if (isSubscribed) {
          setRenderedDataUrl(dataUrl);
          setIsGenerating(false);
        }
      } catch (err) {
        console.error('Error generating QR code:', err);
        if (isSubscribed) setIsGenerating(false);
      }
    };

    generateCompositeQR();

    return () => {
      isSubscribed = false;
    };
  }, [url, calloutText, themePreset, customFg, customBg, frameStyle, centerIcon, customLogoDataUrl, cleanOrderRef]);

  // Actions
  const handleCopyLink = () => {
    sound.playClick();
    navigator.clipboard.writeText(url);
    setCopiedLinkNotification(true);
    setTimeout(() => setCopiedLinkNotification(false), 2500);
  };

  const handleCopyImage = async () => {
    if (!renderedDataUrl) return;
    sound.playClick();
    try {
      const response = await fetch(renderedDataUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
      setCopiedImageNotification(true);
      setTimeout(() => setCopiedImageNotification(false), 2500);
    } catch (err) {
      navigator.clipboard.writeText(renderedDataUrl);
      setCopiedImageNotification(true);
      setTimeout(() => setCopiedImageNotification(false), 2500);
    }
  };

  const handleDownloadPNG = () => {
    if (!renderedDataUrl) return;
    sound.playSuccess();
    const link = document.createElement('a');
    link.download = `mockup_qr_${cleanOrderRef}_${calloutText.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}.png`;
    link.href = renderedDataUrl;
    link.click();
  };

  const handleShareToWhatsApp = () => {
    sound.playChime();
    setWhatsAppNotification(true);
    setTimeout(() => setWhatsAppNotification(false), 3000);

    const message = `*FINALIZED DESIGN MOCKUP & PRODUCTION ASSET LINK — R'TSON CREATIONS*
━━━━━━━━━━━━━━━━━━━━━
• *Order Ref:* #${cleanOrderRef}
• *Client:* ${clientName || 'Valued Client'}
• *Project:* ${projectTitle} (${categoryName})
• *Access Portal:* ${calloutText}

🔗 *Tap to view your 3D design mockup & production assets:*
${url}

━━━━━━━━━━━━━━━━━━━━━
*(Scan the attached QR code with your phone camera or open the link above to view your artwork in 3D, inspect proofing drafts, or download 300 DPI master assets.)*`;

    const waUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
  };

  const handleAttachToOrder = () => {
    if (!renderedDataUrl || !onAttachToOrder) return;
    sound.playSuccess();

    const sizeBytes = Math.floor((renderedDataUrl.length * 3) / 4);
    const attachedPhoto: AttachedOrderPhoto = {
      id: `qr_mockup_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      name: `mockup_qr_share_${cleanOrderRef}.png`,
      dataUrl: renderedDataUrl,
      sizeBytes: sizeBytes,
      sizeFormatted: `${(sizeBytes / 1024).toFixed(1)} KB`,
      type: 'image/png',
      role: 'qr_code',
      roleLabel: 'Finalized Mockup & Asset QR',
      instructions: `Position this QR code on artwork/brief. Scans directly to finalized 3D mockup & asset portal (${calloutText}). Target: ${url}`,
      retouchRequested: false,
      dimensions: { width: 800, height: 900 },
      uploadedAt: new Date().toISOString(),
      qrMetadata: {
        linkUrl: url,
        calloutText: calloutText,
        category: category
      }
    };

    onAttachToOrder(attachedPhoto);
    setAttachedNotification(true);
    setTimeout(() => setAttachedNotification(false), 3000);
  };

  const handleOpenMockupViewerDirectly = () => {
    sound.playClick();
    if (onOpenMockupViewer) {
      onOpenMockupViewer(activeMockupImage, projectTitle);
    } else {
      window.open(url, '_blank');
    }
  };

  return (
    <div className={`rounded-3xl bg-[#040e22] border border-[#1e3a8a]/70 shadow-2xl overflow-hidden ${className}`}>
      
      {/* Header Bar */}
      <div className="p-4 sm:p-5 bg-[#030917] border-b border-[#1e3a8a]/60 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#d4f15d] flex items-center justify-center text-slate-950 font-black shadow-lg shadow-[#d4f15d]/20">
            <QrCode className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-white tracking-wide">
                Finalized Design Mockup & Asset QR Studio
              </h3>
              <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/40">
                300 DPI Pre-Press
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Generate an instant scannable link & QR code for clients to preview their finalized design in 3D, track progress, or access master assets.
            </p>
          </div>
        </div>

        {/* Mode Selector Tabs & Close Button */}
        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 bg-[#06142e] border border-[#1e3a8a]/60 rounded-xl">
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setToolMode('mockup_share');
                handleSelectMockupTarget('mockup_3d');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                toolMode === 'mockup_share'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Mockup & Assets</span>
            </button>
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setToolMode('event_flyer');
                setCalloutText('SCAN TO REGISTER');
                setCenterIcon('ticket');
                setCategory('tickets');
                setUrl('https://eventbrite.com/e/conference-tickets');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                toolMode === 'event_flyer'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Ticket className="w-3.5 h-3.5" />
              <span>Flyer / Event Link</span>
            </button>
          </div>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
            >
              Done
            </button>
          )}
        </div>
      </div>

      <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Link Target, Mockup Stage, & Styling (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* ========================================================================= */}
          {/* TAB 1: FINALIZED DESIGN MOCKUP & ASSET PORTAL WORKFLOW (REQUESTED)        */}
          {/* ========================================================================= */}
          {toolMode === 'mockup_share' ? (
            <div className="space-y-4">
              
              {/* Step 1: Select What Clients Will Access When Scanning */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-amber-300">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    1. Select Mockup & Client Asset Target:
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono">Order Ref: #{cleanOrderRef}</span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {MOCKUP_TARGET_PRESETS.map((preset) => {
                    const Icon = preset.icon;
                    const isSelected = mockupTarget === preset.id;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => handleSelectMockupTarget(preset.id)}
                        className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer relative ${
                          isSelected
                            ? 'bg-amber-500/15 border-amber-400 text-white shadow-md shadow-amber-950/30 ring-1 ring-amber-400'
                            : 'bg-[#081733] border-[#1e3a8a]/50 text-slate-300 hover:border-slate-500 hover:bg-[#0c2452]'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <div className="flex items-center gap-2">
                            <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300'}`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <span className="text-xs font-bold leading-tight text-white">{preset.label}</span>
                          </div>
                          <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full shrink-0 ${isSelected ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                            {preset.badge}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 line-clamp-2">{preset.description}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Live Mockup Simulated Mini-Stage Card */}
              <div className="p-4 rounded-2xl bg-[#06142e] border border-amber-500/40 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-amber-400" />
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>Finalized Design Mockup Preview</span>
                        <span className="text-[9px] bg-amber-500/20 text-amber-300 font-bold px-1.5 py-0.2 rounded border border-amber-500/30">
                          Interactive 3D Stage
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {projectTitle} • Linked to #{cleanOrderRef}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleOpenMockupViewerDirectly}
                    className="px-3 py-1.5 rounded-xl bg-[#d4f15d] hover:bg-[#bef264] text-slate-950 font-black text-[11px] flex items-center gap-1.5 cursor-pointer shadow-md shadow-[#d4f15d]/20 transition-all active:scale-95"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-950" />
                    <span>Launch 3D Stage</span>
                  </button>
                </div>

                {/* Simulated 3D Mockup Container */}
                <div className="relative w-full aspect-[16/9] max-h-56 rounded-xl bg-black border border-slate-700/80 overflow-hidden flex items-center justify-center p-3 shadow-inner group">
                  {/* Environment Backdrop Simulation */}
                  {mockupEnvPreview === 'church_led' && (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-t from-blue-950/80 via-black to-slate-950 pointer-events-none" />
                      <div className="absolute top-0 inset-x-0 h-10 flex justify-around opacity-60 pointer-events-none">
                        <div className="w-16 h-28 bg-amber-400/40 blur-xl"></div>
                        <div className="w-20 h-28 bg-blue-500/40 blur-xl"></div>
                        <div className="w-16 h-28 bg-[#d4f15d]/30 blur-xl"></div>
                      </div>
                    </>
                  )}
                  {mockupEnvPreview === 'street_billboard' && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-slate-900 to-indigo-950 pointer-events-none" />
                  )}
                  {mockupEnvPreview === 'gallery_frame' && (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#1c1813] to-[#0e0c0a] pointer-events-none" />
                  )}
                  {mockupEnvPreview === 'iphone_feed' && (
                    <div className="absolute inset-0 bg-[#0c101d] pointer-events-none" />
                  )}

                  {/* Artwork Image Frame */}
                  <div className={`relative z-10 h-full max-w-[70%] rounded-lg overflow-hidden shadow-2xl transition-transform duration-300 group-hover:scale-105 flex items-center justify-center ${
                    mockupEnvPreview === 'gallery_frame' ? 'border-4 border-amber-600/70 p-1 bg-black shadow-[0_0_20px_rgba(217,119,6,0.3)]' :
                    mockupEnvPreview === 'iphone_feed' ? 'border-2 border-slate-700 rounded-2xl bg-black' : 'border border-slate-600'
                  }`}>
                    <img
                      src={activeMockupImage}
                      alt={projectTitle}
                      className="w-full h-full object-contain filter drop-shadow-[0_0_20px_rgba(0,0,0,0.8)]"
                    />
                  </div>

                  {/* Environment Switcher Overlay Chips */}
                  <div className="absolute bottom-2 inset-x-2 z-20 flex items-center justify-center gap-1.5">
                    {[
                      { id: 'church_led' as const, label: 'LED Sanctuary Screen', icon: Tv },
                      { id: 'street_billboard' as const, label: 'Night Billboard', icon: Sparkles },
                      { id: 'gallery_frame' as const, label: 'Gold Art Frame', icon: ImageIcon },
                      { id: 'iphone_feed' as const, label: 'iPhone Feed', icon: Smartphone },
                    ].map((env) => {
                      const Icon = env.icon;
                      const isActive = mockupEnvPreview === env.id;
                      return (
                        <button
                          key={env.id}
                          type="button"
                          onClick={() => {
                            sound.playClick();
                            setMockupEnvPreview(env.id);
                          }}
                          className={`px-2 py-1 rounded-md text-[9px] font-bold flex items-center gap-1 cursor-pointer transition-all ${
                            isActive
                              ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                              : 'bg-black/75 backdrop-blur-md text-slate-300 hover:text-white border border-white/10'
                          }`}
                        >
                          <Icon className="w-3 h-3" />
                          <span className="hidden sm:inline">{env.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

            </div>
          ) : (
            /* ========================================================================= */
            /* TAB 2: PROMOTIONAL EVENT POSTER QR CODE PRESETS                          */
            /* ========================================================================= */
            <div className="space-y-4">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                Select Event Purpose & Destination Preset:
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {EVENT_PRESET_CATEGORIES.map((preset) => {
                  const Icon = preset.icon;
                  const isSelected = category === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setCategory(preset.id);
                        setCalloutText(preset.defaultCallout);
                        setUrl(preset.sampleUrl);
                        if (preset.id === 'rsvp') setCenterIcon('cross');
                        else if (preset.id === 'tickets') setCenterIcon('ticket');
                        else if (preset.id === 'livestream') setCenterIcon('youtube');
                        else if (preset.id === 'location') setCenterIcon('location');
                        else if (preset.id === 'whatsapp') setCenterIcon('whatsapp');
                        else if (preset.id === 'giving') setCenterIcon('dollar');
                        else setCenterIcon('globe');
                      }}
                      className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-amber-500/20 border-amber-400 text-white shadow-md shadow-amber-950/40 ring-1 ring-amber-400'
                          : 'bg-[#081733] border-[#1e3a8a]/50 text-slate-300 hover:border-slate-500'
                      }`}
                    >
                      <Icon className={`w-4 h-4 mb-1.5 ${isSelected ? 'text-amber-400' : 'text-slate-400'}`} />
                      <span className="text-[11px] font-bold leading-tight">{preset.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 2. Destination URL & Callout Headline Configuration */}
          <div className="p-4 rounded-2xl bg-[#081733] border border-[#1e3a8a]/60 space-y-3.5">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-amber-400" />
                  <span>Encoded Shareable Link (Destination):</span>
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="text-[10px] text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    {copiedLinkNotification ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-300">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy Link</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (url) window.open(url.startsWith('http') ? url : `https://${url}`, '_blank');
                    }}
                    className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[10px] text-slate-300 flex items-center gap-1 cursor-pointer"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>Test Link</span>
                  </button>
                </div>
              </div>

              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://rtsoncreations.co.zw/?view=mockup"
                className="w-full px-3 py-2.5 rounded-xl bg-[#040e22] border border-[#1e3a8a] text-white text-xs font-mono focus:border-amber-400 focus:outline-none"
              />
              <span className="text-[10px] text-slate-400 block mt-1">
                Clients scanning this QR code from mobile cameras will open this verified destination.
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-white mb-1.5 flex items-center justify-between">
                <span>Poster & Card Callout Banner:</span>
                <span className="text-[10px] text-slate-400">Headline printed on top/bottom of QR</span>
              </label>
              <input
                type="text"
                value={calloutText}
                onChange={(e) => setCalloutText(e.target.value)}
                placeholder="e.g. SCAN TO VIEW 3D DESIGN MOCKUP"
                className="w-full px-3 py-2 rounded-xl bg-[#040e22] border border-[#1e3a8a] text-white text-xs font-bold uppercase tracking-wider focus:border-amber-400 focus:outline-none"
              />

              {/* Quick suggestions chips */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {MOCKUP_CALLOUT_PRESETS.slice(0, 5).map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setCalloutText(preset);
                    }}
                    className="px-2 py-0.5 rounded-md bg-[#040e22] hover:bg-amber-500/20 text-slate-300 hover:text-amber-300 border border-[#1e3a8a] text-[10px] font-semibold cursor-pointer transition-colors"
                  >
                    + {preset}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 3. Visual Styling & Color Themes */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-amber-400" />
              2. Design Theme & High-Resolution Aesthetics:
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {THEME_PRESETS.map((t) => {
                const isSelected = themePreset === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setThemePreset(t.id);
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-400 ring-1 ring-amber-400'
                        : 'bg-[#081733] border-[#1e3a8a]/50 hover:border-slate-500'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div
                        className="w-5 h-5 rounded-md border border-white/20 shadow-inner shrink-0"
                        style={{ backgroundColor: t.fg }}
                      />
                      <div
                        className="w-5 h-5 rounded-md border border-white/20 shadow-inner shrink-0 -ml-3"
                        style={{ backgroundColor: t.bg }}
                      />
                      <span className="text-[11px] font-bold text-white truncate">{t.label}</span>
                    </div>
                    <span className="text-[9px] text-slate-400 line-clamp-1">{t.description}</span>
                  </button>
                );
              })}
            </div>

            {themePreset === 'custom' && (
              <div className="p-3 rounded-xl bg-[#081733] border border-amber-500/40 grid grid-cols-2 gap-3 animate-in fade-in">
                <div>
                  <label className="text-[10px] font-bold text-slate-300 block mb-1">QR Pattern Color (Foreground):</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={customFg}
                      onChange={(e) => setCustomFg(e.target.value)}
                      className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                    />
                    <input
                      type="text"
                      value={customFg}
                      onChange={(e) => setCustomFg(e.target.value)}
                      className="w-24 px-2 py-1 rounded bg-[#040e22] border border-[#1e3a8a] text-xs font-mono text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-300 block mb-1">Card Background Color:</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={customBg}
                      onChange={(e) => setCustomBg(e.target.value)}
                      className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                    />
                    <input
                      type="text"
                      value={customBg}
                      onChange={(e) => setCustomBg(e.target.value)}
                      className="w-24 px-2 py-1 rounded bg-[#040e22] border border-[#1e3a8a] text-xs font-mono text-white"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 4. Frame Layout & Center Icon Overlay */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-2xl bg-[#081733] border border-[#1e3a8a]/60 space-y-2">
              <label className="text-[11px] font-bold text-white block">Frame Layout:</label>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: 'banner_top', label: 'Top Banner Bar' },
                  { id: 'banner_bottom', label: 'Bottom Banner' },
                  { id: 'minimal_card', label: 'Border Frame' },
                  { id: 'plain', label: 'Raw QR Only' }
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setFrameStyle(f.id as any);
                    }}
                    className={`py-1.5 px-2 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer ${
                      frameStyle === f.id
                        ? 'bg-amber-500 text-slate-950 border-amber-400 font-black'
                        : 'bg-[#040e22] text-slate-300 border-[#1e3a8a] hover:bg-slate-800'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-[#081733] border border-[#1e3a8a]/60 space-y-2">
              <label className="text-[11px] font-bold text-white block">Center Icon / Emblem:</label>
              <div className="flex flex-wrap gap-1">
                {[
                  { id: 'eye', label: '3D Mockup' },
                  { id: 'download', label: 'Assets (HD)' },
                  { id: 'shield', label: 'Proof (✓)' },
                  { id: 'clock', label: 'Progress' },
                  { id: 'smartphone', label: 'Mobile' },
                  { id: 'ticket', label: 'Ticket' },
                  { id: 'none', label: 'None' }
                ].map((ic) => (
                  <button
                    key={ic.id}
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setCenterIcon(ic.id as any);
                      setCustomLogoDataUrl(null);
                    }}
                    className={`py-1 px-2 rounded-md text-[10px] font-bold border transition-colors cursor-pointer ${
                      centerIcon === ic.id && !customLogoDataUrl
                        ? 'bg-amber-500 text-slate-950 border-amber-400 font-black'
                        : 'bg-[#040e22] text-slate-300 border-[#1e3a8a]'
                    }`}
                  >
                    {ic.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Live High-Res Pre-Press Preview & Client Share Actions (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-between space-y-4">
          
          <div className="w-full flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-amber-400" />
              Live 300 DPI Render
            </span>
            <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
              <Check className="w-3 h-3" /> Error Correction: High (30%)
            </span>
          </div>

          {/* QR Render Canvas Display Card */}
          <div className="w-full max-w-[320px] sm:max-w-[360px] p-4 rounded-3xl bg-black/60 border border-[#1e3a8a] shadow-2xl flex flex-col items-center justify-center relative group">
            {renderedDataUrl ? (
              <img
                src={renderedDataUrl}
                alt="Generated Mockup QR Code"
                className="w-full h-auto object-contain rounded-2xl shadow-lg border border-white/10"
              />
            ) : (
              <div className="w-64 h-64 flex items-center justify-center text-slate-500 text-xs">
                Rendering High-Res QR Code...
              </div>
            )}

            {/* Floating Scan Test Info Badge */}
            <div className="mt-3 w-full p-2.5 rounded-xl bg-[#040e22] border border-[#1e3a8a]/60 text-center space-y-0.5">
              <div className="text-[11px] font-bold text-white truncate">
                {projectTitle || 'Artwork Design Mockup'}
              </div>
              <div className="text-[9px] text-slate-400 truncate">
                Scans directly to: <span className="text-amber-400 font-mono">{url}</span>
              </div>
            </div>
          </div>

          {/* Action Hub for Clients & Designers */}
          <div className="w-full space-y-2.5">
            
            {/* Primary Action 1: Share to WhatsApp */}
            <button
              type="button"
              onClick={handleShareToWhatsApp}
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-600 to-emerald-600 hover:brightness-110 active:scale-[0.98] text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-xl shadow-emerald-950/50 transition-all"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Share Mockup Link & Details on WhatsApp</span>
            </button>

            {/* Primary Action 2: Attach to Order */}
            {onAttachToOrder && (
              <button
                type="button"
                onClick={handleAttachToOrder}
                className="w-full py-2.5 px-4 rounded-xl bg-[#d4f15d] hover:bg-[#bef264] active:scale-[0.98] text-slate-950 font-black text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xl shadow-[#d4f15d]/30 transition-all"
              >
                {attachedNotification ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-950" />
                    <span>Attached to Order & Production Assets!</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Attach Mockup QR to Order Brief</span>
                  </>
                )}
              </button>
            )}

            {/* Quick Utility Actions Row */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={handleCopyLink}
                className="py-2 px-2 rounded-xl bg-[#081733] hover:bg-[#0c2452] border border-[#1e3a8a] text-white font-bold text-[11px] flex items-center justify-center gap-1 cursor-pointer transition-colors"
                title="Copy direct web link"
              >
                {copiedLinkNotification ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-300">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-blue-400" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleDownloadPNG}
                className="py-2 px-2 rounded-xl bg-[#081733] hover:bg-[#0c2452] border border-[#1e3a8a] text-white font-bold text-[11px] flex items-center justify-center gap-1 cursor-pointer transition-colors"
                title="Download 300 DPI high resolution PNG"
              >
                <Download className="w-3.5 h-3.5 text-amber-400" />
                <span>Save PNG</span>
              </button>

              <button
                type="button"
                onClick={handleOpenMockupViewerDirectly}
                className="py-2 px-2 rounded-xl bg-[#081733] hover:bg-[#0c2452] border border-[#1e3a8a] text-white font-bold text-[11px] flex items-center justify-center gap-1 cursor-pointer transition-colors"
                title="Open interactive 3D mockup viewer"
              >
                <Eye className="w-3.5 h-3.5 text-cyan-400" />
                <span>Test 3D</span>
              </button>
            </div>

            {/* Context Note */}
            <div className="p-2.5 rounded-xl bg-blue-950/40 border border-blue-500/30 text-[10px] text-blue-200 flex items-start gap-2">
              <Info className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
              <span>
                Clients can scan this QR code with any iPhone or Android camera to immediately inspect their design mockup simulated in 3D, check production status, or access deliverables.
              </span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
