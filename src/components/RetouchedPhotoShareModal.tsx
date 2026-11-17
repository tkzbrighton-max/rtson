import React, { useState, useEffect } from 'react';
import { 
  X, 
  MessageSquare, 
  Share2, 
  Copy, 
  Check, 
  Download, 
  ExternalLink, 
  Sparkles, 
  Info, 
  ShieldCheck, 
  Image as ImageIcon,
  ArrowRight,
  UploadCloud,
  CheckCircle2,
  Smartphone,
  Laptop
} from 'lucide-react';
import { 
  canShareFiles, 
  dataUrlToBlob, 
  dataUrlToFile, 
  copyImageToClipboard, 
  uploadRetouchedPhoto, 
  downloadImageFile,
  createWhatsAppChatUrl
} from '../lib/imageShareHelper';
import { useTheme } from '../context/ThemeContext';
import { sound } from '../lib/soundFx';

interface RetouchedPhotoShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageDataUrl: string | null;
  specificationsText?: string;
  onUseInOrder?: () => void;
  clientPhone?: string;
  sourcePhotoName?: string;
}

export const RetouchedPhotoShareModal: React.FC<RetouchedPhotoShareModalProps> = ({
  isOpen,
  onClose,
  imageDataUrl,
  specificationsText,
  onUseInOrder,
  clientPhone = '',
  sourcePhotoName = 'retouched_studio_portrait.png'
}) => {
  const { theme } = useTheme();
  const [isWebShareSupported, setIsWebShareSupported] = useState<boolean>(false);
  const [isCopying, setIsCopying] = useState<boolean>(false);
  const [copiedSuccess, setCopiedSuccess] = useState<boolean>(false);
  const [isUploadingCloud, setIsUploadingCloud] = useState<boolean>(false);
  const [cloudLink, setCloudLink] = useState<{ directImageUrl: string; viewUrl: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'mobile' | 'desktop'>('mobile');
  const [shareStatusMessage, setShareStatusMessage] = useState<string | null>(null);

  // Check Web Share API capability
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const supported = canShareFiles();
      setIsWebShareSupported(supported);
      if (!supported) {
        setActiveTab('desktop');
      }
    }
  }, []);

  // Pre-upload in background so link is instantly ready
  useEffect(() => {
    if (isOpen && imageDataUrl && !cloudLink && !isUploadingCloud) {
      setIsUploadingCloud(true);
      uploadRetouchedPhoto(imageDataUrl, sourcePhotoName, { source: 'retouch_desk' })
        .then(result => {
          if (result) {
            setCloudLink(result);
          }
        })
        .finally(() => {
          setIsUploadingCloud(false);
        });
    }
  }, [isOpen, imageDataUrl]);

  if (!isOpen || !imageDataUrl) return null;

  const buildWhatsAppMessage = (directUrl?: string) => {
    let msg = `*CLIENT PHOTO RETOUCH & STUDIO CALIBRATION — R'TSON CREATIONS*\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `Hello Brighton! I have retouched and color-graded this photo on the R'tson Creations Studio Desk and would like to use it for my design project.\n\n`;

    if (specificationsText) {
      msg += `*Specifications & Calibration:*\n${specificationsText}\n\n`;
    }

    if (directUrl) {
      msg += `*🖼️ Direct High-Res Image Link:*\n${directUrl}\n\n`;
    }

    msg += `• *Quality:* 300 DPI Pre-Press Ready\n`;
    msg += `• *Format:* Lossless PNG Studio Cutout\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `Please review the retouched photo and let me know when we can proceed with the design!`;
    return msg;
  };

  // Method 1: Native Web Share (Sends the actual image file to WhatsApp)
  const handleNativeShare = async () => {
    sound.playChime();
    setShareStatusMessage(null);

    try {
      const file = dataUrlToFile(imageDataUrl, `rtson_${Date.now()}.png`);
      const fullText = buildWhatsAppMessage(cloudLink?.viewUrl);

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: "R'tson Retouched Studio Photo",
          text: fullText,
          files: [file]
        });
        sound.playSuccess();
        setShareStatusMessage("✓ Picture shared successfully via your device's share sheet!");
        return;
      } else {
        throw new Error('Device cannot share files via native share sheet.');
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        // User closed the share sheet
        console.log('Share canceled by user');
        return;
      }
      console.warn('Native share failed, falling back to copy & web link:', err);
      // Automatically fallback to Clipboard Copy + WhatsApp open
      handleCopyAndOpenWhatsApp();
    }
  };

  // Method 2: Copy image to clipboard + open WhatsApp Web
  const handleCopyAndOpenWhatsApp = async () => {
    sound.playClick();
    setIsCopying(true);
    setShareStatusMessage(null);

    try {
      const blob = dataUrlToBlob(imageDataUrl);
      const res = await copyImageToClipboard(blob);

      if (res.success) {
        setCopiedSuccess(true);
        sound.playSuccess();
        setShareStatusMessage("✓ Image copied to clipboard! Opening WhatsApp... Just press Ctrl+V to paste the picture!");
      } else {
        // Download as fallback
        downloadImageFile(imageDataUrl, `rtson-retouched-${Date.now()}.png`);
        setShareStatusMessage("✓ Image saved to your device. Opening WhatsApp chat now...");
      }

      // Also ensure file is downloaded so user has it immediately
      downloadImageFile(imageDataUrl, `rtson-retouched-${Date.now()}.png`);

      const text = buildWhatsAppMessage(cloudLink?.viewUrl);
      const url = createWhatsAppChatUrl(clientPhone, text);

      setTimeout(() => {
        window.open(url, '_blank');
        setIsCopying(false);
      }, 700);

    } catch (e: any) {
      console.error('Copy & open failed:', e);
      setIsCopying(false);
      const text = buildWhatsAppMessage(cloudLink?.viewUrl);
      window.open(createWhatsAppChatUrl(clientPhone, text), '_blank');
    }
  };

  // Method 3: Cloud Link WhatsApp Share
  const handleSendCloudLink = async () => {
    sound.playClick();
    let currentLink = cloudLink;
    if (!currentLink) {
      setIsUploadingCloud(true);
      currentLink = await uploadRetouchedPhoto(imageDataUrl, sourcePhotoName);
      setIsUploadingCloud(false);
      if (currentLink) setCloudLink(currentLink);
    }

    const text = buildWhatsAppMessage(currentLink?.viewUrl || currentLink?.directImageUrl);
    const url = createWhatsAppChatUrl(clientPhone, text);
    window.open(url, '_blank');
  };

  // Method 4: Direct Download PNG
  const handleDownloadPNG = () => {
    sound.playSuccess();
    downloadImageFile(imageDataUrl, `rtson-retouched-${Date.now()}.png`);
    setShareStatusMessage("✓ 300 DPI Retouched PNG saved to your downloads!");
  };

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-in fade-in select-none">
      <div 
        className="max-w-xl w-full rounded-3xl bg-[#030919] border text-white p-5 sm:p-7 space-y-5 shadow-2xl relative"
        style={{ borderColor: `${theme.swatchHex}50` }}
      >
        {/* Close Button */}
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
            <MessageSquare className="w-6 h-6 fill-emerald-400/20" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
              Send Retouched Photo to WhatsApp
            </h2>
            <p className="text-xs text-slate-400">
              Direct delivery to R'tson Creations Studio Desk (info@rtsoncreations.co.zw)
            </p>
          </div>
        </div>

        {/* Retouched Photo Visual Preview Card */}
        <div className="relative rounded-2xl bg-[#06122d] border border-white/10 p-3 flex flex-col sm:flex-row items-center gap-4 overflow-hidden">
          <div className="relative w-36 h-36 sm:w-40 sm:h-40 rounded-xl bg-black/60 border border-white/15 flex items-center justify-center overflow-hidden shrink-0 shadow-inner group">
            {/* Checkerboard Pattern for Transparency */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:8px_8px]" />
            <img 
              src={imageDataUrl} 
              alt="Retouched Preview" 
              className="relative max-w-full max-h-full object-contain drop-shadow-xl"
            />
            <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-mono font-bold text-amber-400 border border-amber-400/30">
              300 DPI
            </div>
          </div>

          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-bold text-emerald-300">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Studio Retouch Ready</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Lossless PNG with transparency cutout, lighting balance, and sharpness filters applied.
            </p>
            {cloudLink && (
              <div className="flex items-center gap-1.5 text-[11px] text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg">
                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Cloud Preview Link Generated</span>
              </div>
            )}
          </div>
        </div>

        {/* Device Mode Switcher */}
        <div className="grid grid-cols-2 p-1 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-bold">
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('mobile');
            }}
            className={`py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'mobile' 
                ? 'bg-emerald-600 text-white shadow-md' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Mobile Phone (Direct)</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('desktop');
            }}
            className={`py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'desktop' 
                ? 'bg-[#d4f15d] text-slate-950 shadow-md font-black' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Laptop className="w-4 h-4" />
            <span>PC / WhatsApp Web</span>
          </button>
        </div>

        {/* Status / Instruction Notification */}
        {shareStatusMessage ? (
          <div className="p-3 rounded-xl bg-neutral-900 border border-[#d4f15d]/40 text-xs text-[#bef264] flex items-center gap-2 animate-in fade-in">
            <Check className="w-4 h-4 shrink-0 text-[#bef264]" />
            <span className="font-medium">{shareStatusMessage}</span>
          </div>
        ) : (
          <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-slate-300 flex items-start gap-2.5">
            <Info className="w-4 h-4 shrink-0 text-[#bef264] mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold text-white">
                Why standard web links only send text:
              </p>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                WhatsApp's web protocol restricts URL parameters to text only. To send the <strong>actual picture</strong>, choose either native mobile sharing or 1-click clipboard paste below!
              </p>
            </div>
          </div>
        )}

        {/* Action Controls for Mobile vs Desktop */}
        <div className="space-y-2.5">
          {activeTab === 'mobile' ? (
            <>
              {/* Native Web Share Button (Shares the real image file) */}
              <button
                onClick={handleNativeShare}
                className="w-full py-3.5 px-4 rounded-xl bg-[#d4f15d] hover:bg-[#bef264] text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-black/50 cursor-pointer transition-all active:scale-[0.98]"
              >
                <Share2 className="w-4 h-4" />
                <span>📱 Tap to Send Picture via WhatsApp Sheet</span>
              </button>

              <button
                onClick={handleCopyAndOpenWhatsApp}
                className="w-full py-3 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-[#d4f15d] text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
              >
                <Download className="w-4 h-4 text-[#bef264]" />
                <span>Save to Gallery &amp; Open WhatsApp Chat</span>
              </button>
            </>
          ) : (
            <>
              {/* Copy Image Button & Open WhatsApp Web */}
              <button
                onClick={handleCopyAndOpenWhatsApp}
                disabled={isCopying}
                className="w-full py-3.5 px-4 rounded-xl bg-[#d4f15d] hover:bg-[#bef264] text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-black/50 cursor-pointer transition-all active:scale-[0.98]"
              >
                {copiedSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>Copied! Opening WhatsApp Web (Press Ctrl+V to paste)</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>📋 Copy Image & Open WhatsApp (Paste with Ctrl+V)</span>
                  </>
                )}
              </button>

              <button
                onClick={handleSendCloudLink}
                disabled={isUploadingCloud}
                className="w-full py-3 px-4 rounded-xl bg-[#0b1b3a] hover:bg-[#0f244e] border border-white/15 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
              >
                <ExternalLink className="w-4 h-4 text-amber-400" />
                <span>🌐 Open WhatsApp with Rich Photo Cloud Link</span>
              </button>
            </>
          )}

          {/* Secondary Action Row */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={handleDownloadPNG}
              className="py-2.5 px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-bold text-slate-300 hover:text-white flex items-center justify-center gap-1.5 cursor-pointer transition-all"
            >
              <Download className="w-3.5 h-3.5 text-blue-400" />
              <span>Download PNG</span>
            </button>

            {onUseInOrder && (
              <button
                onClick={() => {
                  sound.playSuccess();
                  onUseInOrder();
                  onClose();
                }}
                className={`py-2.5 px-3 rounded-xl ${theme.buttonPrimary} text-xs font-bold text-white flex items-center justify-center gap-1.5 shadow-lg cursor-pointer transition-all`}
              >
                <span>Use in Design Order</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
