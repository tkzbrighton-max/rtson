import React, { useRef, useState, useEffect } from 'react';
import { 
  Download, 
  Copy, 
  Check, 
  Sparkles, 
  Share2, 
  QrCode, 
  CheckCircle2, 
  ShieldCheck, 
  Calendar, 
  Clock, 
  DollarSign, 
  Image as ImageIcon, 
  User, 
  FileText, 
  Layers, 
  Zap, 
  Palette, 
  Loader2, 
  Printer, 
  ExternalLink,
  MessageSquare,
  MapPin,
  Archive,
  Maximize2
} from 'lucide-react';
import { toPng, toBlob } from 'html-to-image';
import QRCode from 'qrcode';
import JSZip from 'jszip';
import { AttachedOrderPhoto } from '../types';
import { sound } from '../lib/soundFx';

export interface OrderDesignedVisualCardProps {
  orderData: {
    orderRef: string;
    clientName: string;
    clientEmail?: string;
    clientPhone?: string;
    category: string;
    projectTitle: string;
    targetEventDate?: string;
    venueDetails?: string;
    turnaround: string;
    proposedBudget: number | string;
    preferredPaymentMethod?: string;
    specialInstructions?: string;
    selectedAddOns?: string[];
    attachedPhotos?: AttachedOrderPhoto[];
    themeScripture?: string;
    qrCodeMetadata?: {
      url: string;
      calloutText: string;
    };
    aiCreativeDirection?: {
      visualTheme: string;
      colorPalette: { primary: string; secondary: string; accent: string };
      typographyStyle: string;
      layoutConcept: string;
    };
  };
  onClose?: () => void;
  className?: string;
}

export const OrderDesignedVisualCard: React.FC<OrderDesignedVisualCardProps> = ({
  orderData,
  onClose,
  className = ''
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [copiedImage, setCopiedImage] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [zipSuccess, setZipSuccess] = useState(false);
  const [whatsAppSuccess, setWhatsAppSuccess] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiDirection, setAiDirection] = useState(orderData.aiCreativeDirection);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');

  const priceFormatted = typeof orderData.proposedBudget === 'number' 
    ? `$${orderData.proposedBudget} USD` 
    : orderData.proposedBudget.startsWith('$') ? orderData.proposedBudget : `$${orderData.proposedBudget} USD`;

  // Determine or Generate High-Resolution Scannable Flyer QR Code
  useEffect(() => {
    const prepareQrCode = async () => {
      // 1. Check if an attached photo is already an uploaded/custom QR Code
      const attachedQr = orderData.attachedPhotos?.find(p => p.role === 'qr_code' && p.dataUrl);
      if (attachedQr && attachedQr.dataUrl) {
        setQrCodeDataUrl(attachedQr.dataUrl);
        return;
      }

      // 2. Generate crisp QR code URL
      const qrTarget = orderData.qrCodeMetadata?.url || 
        `mailto:info@rtsoncreations.co.zw?subject=${encodeURIComponent(`[Artwork Verification #${orderData.orderRef}]`)}`;

      try {
        const generated = await QRCode.toDataURL(qrTarget, {
          width: 600,
          margin: 2,
          errorCorrectionLevel: 'H',
          color: {
            dark: '#030816',
            light: '#ffffff'
          }
        });
        setQrCodeDataUrl(generated);
      } catch (err) {
        console.error('Failed to generate high-res QR code for card:', err);
      }
    };

    prepareQrCode();
  }, [orderData]);

  // Convert Base64 Data URL to a native File object
  const dataUrlToFile = (dataUrl: string, filename: string): File => {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  // 1. Download High-Resolution PNG Poster Flyer Card
  const handleDownloadImage = async () => {
    if (!cardRef.current) return;
    try {
      sound.playClick();
      setIsExporting(true);

      const dataUrl = await toPng(cardRef.current, {
        quality: 0.98,
        pixelRatio: 2.5,
        backgroundColor: '#030816',
        cacheBust: true,
      });

      const link = document.createElement('a');
      link.download = `Rtson_Artwork_Flyer_Card_${orderData.orderRef || 'Order'}.png`;
      link.href = dataUrl;
      link.click();

      sound.playSuccess();
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error('Error exporting order card image:', err);
    } finally {
      setIsExporting(false);
    }
  };

  // 2. Download Complete ZIP Package (Flyer Info Card + All Attached Images)
  const handleDownloadAllZip = async () => {
    if (!cardRef.current) return;
    try {
      sound.playClick();
      setIsExporting(true);

      const zip = new JSZip();

      // Render Card PNG
      const cardBlob = await toBlob(cardRef.current, {
        quality: 0.98,
        pixelRatio: 2.5,
        backgroundColor: '#030816',
        cacheBust: true,
      });

      if (cardBlob) {
        zip.file(`00_Rtson_Artwork_Flyer_Card_${orderData.orderRef || 'Order'}.png`, cardBlob);
      }

      // Add all attached image files
      if (orderData.attachedPhotos && orderData.attachedPhotos.length > 0) {
        const photosFolder = zip.folder("production_assets");
        orderData.attachedPhotos.forEach((photo, idx) => {
          if (photo.dataUrl) {
            const base64Data = photo.dataUrl.split(',')[1];
            const cleanName = `${String(idx + 1).padStart(2, '0')}_${(photo.roleLabel || 'Asset').replace(/\s+/g, '_')}_${photo.name || 'image.png'}`;
            photosFolder?.file(cleanName, base64Data, { base64: true });
          }
        });
      }

      // Add structured order specification text file
      const summaryText = `=====================================================
R'TSON CREATIONS GRAPHIC & VECTOR DESIGN STUDIO
OFFICIAL ARTWORK & EVENT PRODUCTION SPECIFICATION
=====================================================
ORDER REF: #${orderData.orderRef}
DATE: ${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
CLIENT: ${orderData.clientName || 'Valued Client'}
PHONE/WHATSAPP: ${orderData.clientPhone || 'Direct'}
EMAIL: ${orderData.clientEmail || 'Direct'}

PROJECT: ${orderData.projectTitle}
CATEGORY: ${orderData.category}
TARGET DATE: ${orderData.targetEventDate || 'Standard Delivery'}
VENUE/DETAILS: ${orderData.venueDetails || 'N/A'}
THEME / SCRIPTURE: ${orderData.themeScripture || 'N/A'}

AGREED INVESTMENT: ${priceFormatted} via ${(orderData.preferredPaymentMethod || 'EcoCash').toUpperCase()}
TURNAROUND TARGET: ${orderData.turnaround}
SPECIAL INSTRUCTIONS: ${orderData.specialInstructions || 'Full creative direction requested.'}

ATTACHED ASSETS: ${orderData.attachedPhotos?.length || 0} production photo/logo item(s)
=====================================================
Official Studio Email: info@rtsoncreations.co.zw
Website: www.rtsoncreations.co.zw
=====================================================`;

      zip.file("ORDER_DETAILS.txt", summaryText);

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Rtson_Order_Package_${orderData.orderRef || 'RC'}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      sound.playSuccess();
      setZipSuccess(true);
      setTimeout(() => setZipSuccess(false), 3500);
    } catch (err) {
      console.error('Error generating zip package:', err);
    } finally {
      setIsExporting(false);
    }
  };

  // 3. Copy Flyer PNG Image to Clipboard
  const handleCopyImageToClipboard = async () => {
    if (!cardRef.current) return;
    try {
      sound.playClick();
      setIsExporting(true);

      const blob = await toBlob(cardRef.current, {
        quality: 0.95,
        pixelRatio: 2,
        backgroundColor: '#030816',
        cacheBust: true,
      });

      if (blob) {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        sound.playSuccess();
        setCopiedImage(true);
        setTimeout(() => setCopiedImage(false), 3000);
      }
    } catch (err) {
      console.warn('Direct image clipboard copy not supported, generating download instead:', err);
      handleDownloadImage();
    } finally {
      setIsExporting(false);
    }
  };

  // 4. Send Flyer Info Card + All Attached Images directly to WhatsApp
  const handleSendCardAndPhotosToWhatsApp = async () => {
    if (!cardRef.current) return;
    try {
      sound.playSuccess();
      setIsExporting(true);

      // Render crisp PNG blob of the flyer card
      const cardBlob = await toBlob(cardRef.current, {
        quality: 0.98,
        pixelRatio: 2.5,
        backgroundColor: '#030816',
        cacheBust: true,
      });

      if (!cardBlob) return;

      const cardFileName = `Rtson_Artwork_Flyer_Card_${orderData.orderRef || 'Order'}.png`;
      const cardFile = new File([cardBlob], cardFileName, { type: 'image/png' });

      // Build complete files array with Card PNG + all attached photos
      const filesToSend: File[] = [cardFile];
      if (orderData.attachedPhotos && orderData.attachedPhotos.length > 0) {
        orderData.attachedPhotos.forEach((photo, idx) => {
          if (photo.dataUrl) {
            const fileName = `${String(idx + 1).padStart(2, '0')}_${(photo.roleLabel || 'Asset').replace(/\s+/g, '_')}_${photo.name || 'image.png'}`;
            try {
              filesToSend.push(dataUrlToFile(photo.dataUrl, fileName));
            } catch (fileErr) {
              console.log('Error converting photo dataUrl to File:', fileErr);
            }
          }
        });
      }

      const totalPhotosCount = orderData.attachedPhotos?.length || 0;

      // Clean, concise WhatsApp message
      const cleanMsg = `*ARTWORK ORDER & PRODUCTION BRIEF — R'TSON CREATIONS*\n` +
        `━━━━━━━━━━━━━━━━━━━━━\n` +
        `• *Order Ref:* #${orderData.orderRef || 'RC-ORDER'}\n` +
        `• *Client:* ${orderData.clientName || 'Studio Client'}\n` +
        `• *Project:* ${orderData.projectTitle} (${orderData.category.replace(/_/g, ' ')})\n` +
        (orderData.targetEventDate ? `• *Event Date:* ${orderData.targetEventDate}\n` : '') +
        `• *Agreed Budget:* ${priceFormatted} via ${(orderData.preferredPaymentMethod || 'EcoCash').toUpperCase()}\n` +
        `• *Turnaround:* ${orderData.turnaround}\n` +
        (totalPhotosCount > 0 ? `• *Attached Production Assets:* ${totalPhotosCount} photo/logo item(s)\n` : '') +
        `━━━━━━━━━━━━━━━━━━━━━\n` +
        `*(High-Res 300 DPI Artwork Flyer Card PNG & ${totalPhotosCount} attached photo/reference image(s) dispatched)*\n` +
        `Hello Brighton! I am sending this design order with the attached artwork flyer card and reference images.`;

      // Try native multi-file or single-file Web Share if supported (Mobile / Supported Browsers)
      let sharedSuccessfully = false;
      if (typeof navigator !== 'undefined' && navigator.canShare) {
        if (filesToSend.length > 1 && navigator.canShare({ files: filesToSend })) {
          try {
            await navigator.share({
              title: `R'tson Artwork Order #${orderData.orderRef}`,
              text: cleanMsg,
              files: filesToSend
            });
            sharedSuccessfully = true;
          } catch (shareErr: any) {
            if (shareErr.name === 'AbortError') return;
            console.log('Multi-file share failed, trying single card file share:', shareErr);
          }
        }

        if (!sharedSuccessfully && navigator.canShare({ files: [cardFile] })) {
          try {
            await navigator.share({
              title: `R'tson Artwork Order #${orderData.orderRef}`,
              text: cleanMsg,
              files: [cardFile]
            });
            sharedSuccessfully = true;
          } catch (shareErr: any) {
            if (shareErr.name === 'AbortError') return;
            console.log('Single file share cancelled or fallback required:', shareErr);
          }
        }
      }

      if (sharedSuccessfully) {
        setWhatsAppSuccess(true);
        setTimeout(() => setWhatsAppSuccess(false), 3500);
        return;
      }

      // Desktop / Fallback flow:
      // 1. Copy Flyer PNG to clipboard
      try {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': cardBlob })
        ]);
        setCopiedImage(true);
      } catch (clipErr) {
        console.log('Clipboard copy skipped');
      }

      // 2. Upload card to Studio cloud for rich WhatsApp preview link
      let cloudMsg = cleanMsg;
      try {
        const reader = new FileReader();
        const dataUrlPromise = new Promise<string>((resolve) => {
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(cardBlob);
        });
        const cardDataUrl = await dataUrlPromise;
        const uploadRes = await fetch('/api/retouched/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            image: cardDataUrl,
            name: cardFileName,
            specs: { orderRef: orderData.orderRef, category: orderData.category }
          })
        });
        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          if (uploadData?.viewUrl) {
            cloudMsg += `\n\n*View Artwork Card Online:*\n${uploadData.viewUrl}`;
          }
        }
      } catch (cloudErr) {
        console.log('Cloud card upload skipped');
      }

      // 3. Download the card image automatically
      const downloadUrl = URL.createObjectURL(cardBlob);
      const link = document.createElement('a');
      link.download = cardFileName;
      link.href = downloadUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);

      // 4. Open email client with clean message & link
      const emailSubject = encodeURIComponent(`[Artwork Order Card #${orderData.orderRef}] ${orderData.projectTitle || orderData.category}`);
      window.location.href = `mailto:info@rtsoncreations.co.zw?subject=${emailSubject}&body=${encodeURIComponent(cloudMsg)}`;

      setWhatsAppSuccess(true);
      setTimeout(() => setWhatsAppSuccess(false), 3500);
    } catch (err) {
      console.error('Error sharing PNG card and photos to WhatsApp:', err);
    } finally {
      setIsExporting(false);
    }
  };

  // Studio Creative Direction Preset Generator
  const handleGenerateAICreativeEnhancement = () => {
    sound.playClick();
    setAiDirection({
      visualTheme: orderData.projectTitle ? `${orderData.projectTitle} — Signature Studio Edition` : 'Royal Obsidian & Radiant Gold Divine Elevation',
      colorPalette: { primary: '#f59e0b', secondary: '#040e22', accent: '#38bdf8' },
      typographyStyle: 'Monumental 3D Extruded Gold Display + Clean Swiss Typography',
      layoutConcept: 'High-contrast focal composition with balanced typography hierarchy and verified scannable QR portal.'
    });
    sound.playSuccess();
  };

  const qrCalloutLabel = orderData.qrCodeMetadata?.calloutText || 
    (orderData.category.toLowerCase().includes('church') || orderData.category.toLowerCase().includes('flyer') || orderData.category.toLowerCase().includes('event')
      ? 'SCAN FOR EVENT RSVP / TICKETS / GPS'
      : 'SCAN TO VERIFY ARTWORK WITH STUDIO');

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Action Toolbar Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#040e22] border border-[#1e3a8a]/70 shadow-xl">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
            <QrCode className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs sm:text-sm font-black text-white flex items-center gap-2">
              <span>Artwork & Event Production Flyer Card</span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-mono border border-emerald-500/40 font-bold">
                High-Res Flyer + Large QR
              </span>
            </div>
            <p className="text-[11px] text-slate-300">
              Send directly with attached photos to WhatsApp or download as high-res 300 DPI PNG / ZIP.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Send PNG Card + Images to WhatsApp */}
          <button
            type="button"
            onClick={handleSendCardAndPhotosToWhatsApp}
            disabled={isExporting}
            className="px-4 py-2.5 rounded-xl bg-[#d4f15d] hover:bg-[#bef264] active:scale-95 text-slate-950 text-xs font-black flex items-center gap-2 cursor-pointer shadow-lg shadow-[#d4f15d]/20 transition-all"
          >
            {isExporting ? (
              <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
            ) : whatsAppSuccess ? (
              <Check className="w-4 h-4 text-slate-950" />
            ) : (
              <MessageSquare className="w-4 h-4 fill-slate-950 text-slate-950" />
            )}
            <span>{whatsAppSuccess ? 'Sent to WhatsApp!' : 'Send Info Card & Images to WhatsApp'}</span>
          </button>

          {/* Download All as ZIP (Card + Images) */}
          <button
            type="button"
            onClick={handleDownloadAllZip}
            disabled={isExporting}
            className="px-3.5 py-2.5 rounded-xl bg-[#091a3e] hover:bg-[#0e275c] border border-blue-400/40 text-blue-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md transition-colors"
            title="Download ZIP package containing the high-res Flyer Card, all attached photos, and order specs"
          >
            {zipSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300">ZIP Saved!</span>
              </>
            ) : (
              <>
                <Archive className="w-3.5 h-3.5 text-blue-400" />
                <span>Download All (ZIP)</span>
              </>
            )}
          </button>

          {/* Download Flyer Card PNG */}
          <button
            type="button"
            onClick={handleDownloadImage}
            disabled={isExporting}
            className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-[#d4f15d] via-[#bef264] to-[#a3e635] hover:brightness-110 text-slate-950 text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-lg shadow-[#d4f15d]/30 active:scale-95 transition-all"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Rendering...</span>
              </>
            ) : downloadSuccess ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Downloaded!</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Download Flyer (PNG)</span>
              </>
            )}
          </button>

          {/* Copy Flyer Image */}
          <button
            type="button"
            onClick={handleCopyImageToClipboard}
            disabled={isExporting}
            className="px-3 py-2.5 rounded-xl bg-[#081733] hover:bg-[#0c2452] border border-blue-500/40 text-blue-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            {copiedImage ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-blue-400" />
                <span>Copy Image</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* The Printable / Exportable High-Fidelity Flyer Poster Card */}
      <div className="overflow-x-auto p-1">
        <div
          ref={cardRef}
          id="designed-artwork-flyer-card-export"
          className="w-full max-w-[860px] mx-auto rounded-3xl bg-gradient-to-b from-[#06142e] via-[#030919] to-[#01040d] border-2 border-amber-500/60 shadow-2xl overflow-hidden relative text-white select-none"
          style={{ fontFamily: "'Montserrat', 'Inter', system-ui, sans-serif" }}
        >
          {/* Top Metallic Gold Foil Accents */}
          <div className="h-2.5 w-full bg-gradient-to-r from-amber-600 via-yellow-300 to-amber-500 shadow-md" />

          {/* Holographic Watermark Pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:24px_24px] opacity-5 pointer-events-none" />

          {/* Header Section */}
          <div className="p-6 sm:p-8 border-b border-[#1e3a8a]/60 relative">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xl sm:text-2xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500">
                    R'TSON CREATIONS
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[10px] font-black uppercase tracking-widest border border-amber-500/40">
                    OFFICIAL ARTWORK & EVENT FLYER POSTER
                  </span>
                </div>
                <div className="text-xs text-slate-300 font-semibold tracking-wide flex flex-wrap items-center gap-2">
                  <span>PRE-PRESS ARTWORK SPECIFICATIONS & PRODUCTION PROPOSAL</span>
                  <span className="text-amber-400">•</span>
                  <span className="text-emerald-400">300 DPI CMYK VERIFIED</span>
                </div>
              </div>

              {/* Order Ref & Hologram Stamp */}
              <div className="text-right space-y-1">
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  ORDER CERTIFICATE NO.
                </div>
                <div className="font-mono text-base sm:text-lg font-black text-amber-400 tracking-widest px-3 py-1 rounded-xl bg-black/70 border border-amber-500/40 inline-block shadow-inner">
                  #{orderData.orderRef || 'RC-2026-ORDER'}
                </div>
                <div className="text-[9px] text-slate-400 font-mono">
                  {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
              </div>
            </div>

            {/* Project Title & Hero Flyer Headline Banner */}
            <div className="mt-5 p-5 rounded-2xl bg-gradient-to-r from-[#0a234f] via-[#061838] to-[#041026] border border-amber-500/40 shadow-xl flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1 max-w-xl">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase text-amber-400 tracking-widest px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30">
                    {orderData.category.replace(/_/g, ' ').toUpperCase()} • MASTER PRODUCTION
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-100 to-amber-300 tracking-wide leading-tight">
                  {orderData.projectTitle || 'Special Event / Church Graphic Masterpiece'}
                </h1>
                {orderData.themeScripture && (
                  <p className="text-xs sm:text-sm text-amber-200/90 italic font-serif pt-0.5">
                    "{orderData.themeScripture}"
                  </p>
                )}
              </div>

              <div className="flex flex-col items-end gap-1.5 shrink-0">
                <div className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-950/40 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 fill-slate-950" />
                  <span>{orderData.turnaround || '12-24 Hours Delivery'}</span>
                </div>
                <span className="text-[10px] text-emerald-400 font-bold font-mono flex items-center gap-1">
                  <Check className="w-3 h-3 text-emerald-400" /> Priority Pre-Press Queue
                </span>
              </div>
            </div>
          </div>

          {/* Main Flyer Body: Details Matrix & Big QR Code */}
          <div className="p-6 sm:p-8 space-y-6">
            {/* 2-Column Section: Core Specs Left + Big QR Code Right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              {/* Left Column: Client, Date/Venue, and Investment (7 cols) */}
              <div className="lg:col-span-7 space-y-4 flex flex-col justify-between">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Client Info */}
                  <div className="p-4 rounded-2xl bg-[#051126] border border-[#1e3a8a]/60 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <User className="w-3 h-3 text-amber-400" /> Client Profile:
                    </span>
                    <div className="text-sm font-black text-white truncate">
                      {orderData.clientName || 'Valued Studio Client'}
                    </div>
                    <div className="text-xs text-slate-300 font-mono truncate">
                      {orderData.clientPhone || orderData.clientEmail || 'WhatsApp Direct Dispatch'}
                    </div>
                  </div>

                  {/* Target Event Date & Venue */}
                  <div className="p-4 rounded-2xl bg-[#051126] border border-[#1e3a8a]/60 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-emerald-400" /> Target Event Date:
                    </span>
                    <div className="text-sm font-black text-emerald-300">
                      {orderData.targetEventDate ? new Date(orderData.targetEventDate).toLocaleDateString('en-US', { dateStyle: 'medium' }) : 'ASAP / This Week'}
                    </div>
                    {orderData.venueDetails ? (
                      <div className="text-xs text-slate-300 truncate flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                        <span className="truncate">{orderData.venueDetails}</span>
                      </div>
                    ) : (
                      <div className="text-[11px] text-slate-400 font-mono">
                        Confirmed Studio Slot
                      </div>
                    )}
                  </div>
                </div>

                {/* Investment & Payment Method Banner */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-[#041026] via-[#071a3d] to-[#020b1c] border-2 border-amber-500/50 shadow-lg flex flex-wrap items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5" /> Agreed Total Investment:
                    </span>
                    <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-200">
                      {priceFormatted}
                    </div>
                    <div className="text-[10px] text-slate-300">
                      50% Deposit on Concept Approval • 50% on Final Pre-Press Release
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">Payment Channel:</div>
                    <div className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 font-black text-xs uppercase border border-amber-500/40 inline-block mt-0.5">
                      {orderData.preferredPaymentMethod || 'EcoCash / InnBucks'}
                    </div>
                    <div className="text-[9px] text-slate-400 font-mono mt-0.5">
                      Prompt on Invoice / Info Desk
                    </div>
                  </div>
                </div>

                {/* Pre-Press Guarantee Badges */}
                <div className="p-3.5 rounded-2xl bg-[#040e22] border border-[#1e3a8a]/50 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                  <span className="font-bold text-slate-300 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    300 DPI CMYK Print Master (PDF-X1a)
                  </span>
                  <span className="font-bold text-slate-300 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                    Ultra HD Social 4:5 & 9:16 RGB
                  </span>
                  <span className="font-bold text-slate-300 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                    Layered Studio Handover
                  </span>
                </div>
              </div>

              {/* Right Column: LARGE, HIGH-CONTRAST FLYER QR CODE CENTERPIECE (5 cols) */}
              <div className="lg:col-span-5 flex flex-col items-center justify-center p-5 rounded-3xl bg-gradient-to-b from-[#071a3d] via-[#041026] to-[#020814] border-2 border-amber-400/60 shadow-2xl relative">
                {/* Corner Targeting Accents */}
                <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-amber-400" />
                <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-amber-400" />
                <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-amber-400" />
                <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-amber-400" />

                {/* Scan Header Badge */}
                <div className="mb-3 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black text-[11px] uppercase tracking-wider shadow-md flex items-center gap-1.5">
                  <QrCode className="w-3.5 h-3.5" />
                  <span>SCAN WITH PHONE CAMERA</span>
                </div>

                {/* Large QR Code Display Box (Crisp High-Contrast White Background) */}
                <div className="w-48 sm:w-56 h-48 sm:h-56 bg-white p-2.5 rounded-2xl border-4 border-amber-400 shadow-2xl flex items-center justify-center relative overflow-hidden group">
                  {qrCodeDataUrl ? (
                    <img 
                      src={qrCodeDataUrl} 
                      alt="Event & Order QR Code" 
                      className="w-full h-full object-contain rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-900 gap-2">
                      <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
                      <span className="text-[10px] font-bold">Generating QR...</span>
                    </div>
                  )}
                </div>

                {/* Callout Text & Subtitle */}
                <div className="mt-3 text-center space-y-0.5">
                  <div className="text-xs font-black text-amber-300 uppercase tracking-wide">
                    {qrCalloutLabel}
                  </div>
                  <div className="text-[10px] text-slate-300 font-mono">
                    Instant Event RSVP • GPS Location • Tickets • WhatsApp
                  </div>
                </div>
              </div>
            </div>

            {/* Studio Art Direction & Style Blueprint */}
            {aiDirection && (
              <div className="p-4 rounded-2xl bg-neutral-900 border border-[#d4f15d]/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-black tracking-widest text-[#bef264] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#d4f15d]" />
                    Creative Art Direction & Color Specification Blueprint:
                  </span>
                  <span className="text-[9px] text-[#bef264] font-mono">Studio Art Director</span>
                </div>
                <div className="text-xs font-bold text-white">
                  Theme: <span className="text-[#d4f15d] font-normal">{aiDirection.visualTheme}</span>
                </div>
                <div className="text-[11px] text-slate-300">
                  Concept: <span className="italic">{aiDirection.layoutConcept}</span>
                </div>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-[10px] font-bold text-slate-400">Palette:</span>
                  {Object.entries(aiDirection.colorPalette).map(([key, val]) => (
                    <span key={key} className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-black/60 border border-white/10 text-[10px] font-mono text-slate-200">
                      <span className="w-2.5 h-2.5 rounded-full border border-white/30" style={{ backgroundColor: val }} />
                      <span>{val}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Attached Production Assets & Images Showcase */}
            {orderData.attachedPhotos && orderData.attachedPhotos.length > 0 && (
              <div className="space-y-3 p-4 rounded-2xl bg-[#040e22] border border-[#1e3a8a]/70">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-amber-400 tracking-wider flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4" />
                    Attached Production Assets & Photos ({orderData.attachedPhotos.length} Items):
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono font-bold flex items-center gap-1">
                    <Check className="w-3 h-3" /> High-Res Isolation & Retouching Included
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {orderData.attachedPhotos.map((photo, idx) => (
                    <div
                      key={photo.id || idx}
                      className="p-2.5 rounded-xl bg-[#030919] border border-[#1e3a8a]/80 flex items-center gap-2.5 overflow-hidden shadow-md hover:border-amber-500/50 transition-colors"
                    >
                      {photo.dataUrl ? (
                        <img
                          src={photo.dataUrl}
                          alt={photo.name}
                          className="w-12 h-12 rounded-lg object-cover bg-black/80 border border-white/15 shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-slate-900 flex items-center justify-center text-slate-500 shrink-0">
                          <ImageIcon className="w-6 h-6" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="text-[10px] font-bold text-white truncate">{photo.name}</div>
                        <div className="text-[9px] text-amber-300 font-bold truncate">{photo.roleLabel}</div>
                        <div className="text-[8px] text-emerald-400 font-mono">{photo.sizeFormatted}</div>
                        {photo.instructions && (
                          <div className="text-[8px] text-slate-400 truncate italic">"{photo.instructions}"</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Client Instructions & Brief Text */}
            {orderData.specialInstructions && (
              <div className="p-4 rounded-2xl bg-[#051126] border border-[#1e3a8a]/50 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Design Brief & Event Details:
                </span>
                <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap font-sans">
                  {orderData.specialInstructions}
                </p>
              </div>
            )}

            {/* Selected Production Features & Addons */}
            {orderData.selectedAddOns && orderData.selectedAddOns.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase mr-1">Included Specs:</span>
                {orderData.selectedAddOns.map((addon, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-0.5 rounded-lg bg-[#0b2247] border border-blue-500/40 text-[10px] font-bold text-blue-200 flex items-center gap-1"
                  >
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>{addon}</span>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Footer Pre-press Seal & Barcode */}
          <div className="p-6 bg-[#020612] border-t border-[#1e3a8a]/70 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <div className="font-bold text-white text-[11px]">
                  R'tson Creations Master Design Studio • Harare, Zimbabwe
                </div>
                <div className="text-[10px] text-slate-400">
                  Official Email: info@rtsoncreations.co.zw • Global Delivery
                </div>
              </div>
            </div>

            {/* Authenticated Barcode */}
            <div className="text-right space-y-1">
              <div className="font-mono text-slate-300 font-bold tracking-[4px] text-xs">
                ||| | |||| | || |||| | | |||| ||
              </div>
              <div className="text-[9px] text-slate-400 font-mono uppercase">
                AUTHENTICATED PRODUCTION FLYER CARD
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
