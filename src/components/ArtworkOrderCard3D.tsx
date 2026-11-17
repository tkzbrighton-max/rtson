import React, { useState, useRef, useEffect } from 'react';
import QRCode from 'qrcode';
import JSZip from 'jszip';
import { 
  CheckCircle2, 
  Copy, 
  Check, 
  MessageSquare, 
  Download, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  Layers, 
  Printer, 
  Share2, 
  FileText,
  Palette,
  QrCode,
  DollarSign,
  User,
  Phone,
  Mail,
  Award,
  Eye,
  Rotate3d,
  Maximize2,
  Paperclip,
  ZoomIn,
  X,
  Archive,
  CheckCheck,
  ScanLine,
  Image as ImageIcon
} from 'lucide-react';
import { sound } from '../lib/soundFx';
import { AttachedOrderPhoto } from '../types';

export interface OrderArtworkDetails {
  orderRef: string;
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  categoryName: string;
  projectTitle: string;
  projectDetails: string;
  selectedAddOns: string[];
  totalAmount: number;
  isNegotiated?: boolean;
  negotiatedOffer?: number | null;
  negotiationReason?: string | null;
  turnaround: string;
  preferredColors?: string;
  deadlineDate?: string;
  createdAt?: string;
  attachedPhotos?: AttachedOrderPhoto[];
}

interface ArtworkOrderCard3DProps {
  details: OrderArtworkDetails;
  onClose?: () => void;
}

export const ArtworkOrderCard3D: React.FC<ArtworkOrderCard3DProps> = ({
  details,
  onClose
}) => {
  const [copied, setCopied] = useState(false);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const [activeFoil, setActiveFoil] = useState<'gold' | 'holographic' | 'obsidian'>('gold');
  const [showQrModal, setShowQrModal] = useState(false);
  const [lightboxPhoto, setLightboxPhoto] = useState<AttachedOrderPhoto | null>(null);
  const [lightboxZoom, setLightboxZoom] = useState(1);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [isPackagingZip, setIsPackagingZip] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const effectivePrice = details.isNegotiated && details.negotiatedOffer 
    ? details.negotiatedOffer 
    : details.totalAmount;

  // Generate crisp QR code data URL on mount or detail change
  useEffect(() => {
    const rawQrPayload = `mailto:info@rtsoncreations.co.zw?subject=${encodeURIComponent(`[Artwork Verification #${details.orderRef}]`)}&body=${encodeURIComponent(
      `ARTWORK VERIFICATION — R'TSON CREATIONS\n` +
      `• Order Ref: #${details.orderRef}\n` +
      `• Project: ${details.projectTitle || details.categoryName}\n` +
      `• Client: ${details.clientName || 'Valued Client'}\n` +
      `• Budget: $${effectivePrice} USD\n` +
      `• Status: Pre-Press Specification Verified\n` +
      `• Official Email: info@rtsoncreations.co.zw`
    )}`;

    QRCode.toDataURL(rawQrPayload, {
      width: 400,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#ffffff'
      },
      errorCorrectionLevel: 'H'
    }).then(url => {
      setQrCodeDataUrl(url);
    }).catch(err => {
      console.error('Failed to generate 3D card QR code:', err);
    });
  }, [details.orderRef, details.projectTitle, details.clientName, effectivePrice]);

  // Handle 3D perspective tilt & light reflection on mouse move
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rX = ((y - centerY) / centerY) * -12; // Max tilt 12 deg
    const rY = ((x - centerX) / centerX) * 14;

    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    setRotateX(rX);
    setRotateY(rY);
    setGlarePos({ x: glareX, y: glareY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
    setGlarePos({ x: 50, y: 50 });
  };

  // Generate Concise Artwork Order Message referencing PNG card
  const generateArtisticOrderMessage = (): string => {
    return `*ARTWORK ORDER BRIEF — R'TSON CREATIONS*\n` +
      `━━━━━━━━━━━━━━━━━━━━━\n` +
      `• *Order Ref:* #${details.orderRef}\n` +
      `• *Client:* ${details.clientName || 'Valued Client'}\n` +
      (details.clientPhone ? `• *Contact:* ${details.clientPhone}\n` : '') +
      (details.clientEmail ? `• *Email:* ${details.clientEmail}\n` : '') +
      `• *Project:* ${details.projectTitle || details.categoryName} (${details.categoryName})\n` +
      `• *Agreed Budget:* $${effectivePrice} USD (50% Deposit on Concept Approval)\n` +
      `• *Turnaround:* ${details.turnaround}\n` +
      (details.attachedPhotos && details.attachedPhotos.length > 0 ? `• *Attached Assets:* ${details.attachedPhotos.length} photo/visual item(s)\n` : '') +
      `━━━━━━━━━━━━━━━━━━━━━\n` +
      `*(High-Res 300 DPI Artwork Order Card PNG attached)*\n` +
      `Hello Brighton! I am placing this design order with the attached artwork order card.`;
  };

  // Generate High-Resolution Visual Order Card Image
  const generateCardCanvas = async (): Promise<HTMLCanvasElement> => {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 1550;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');

    // 1. Deep Midnight Background
    const bgGrad = ctx.createLinearGradient(0, 0, 1200, 1550);
    bgGrad.addColorStop(0, '#020713');
    bgGrad.addColorStop(0.35, '#07152b');
    bgGrad.addColorStop(0.7, '#0b1f3d');
    bgGrad.addColorStop(1, '#02050d');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1200, 1550);

    // 2. Subtle Geometric Grid Pattern
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.05)';
    ctx.lineWidth = 1;
    for (let x = 40; x < 1200; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 1550);
      ctx.stroke();
    }
    for (let y = 40; y < 1550; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(1200, y);
      ctx.stroke();
    }

    // 3. Metallic Gold Outer Border & Corner Accents
    ctx.save();
    const borderGrad = ctx.createLinearGradient(40, 40, 1160, 1510);
    borderGrad.addColorStop(0, '#d97706');
    borderGrad.addColorStop(0.25, '#fbbf24');
    borderGrad.addColorStop(0.5, '#fef08a');
    borderGrad.addColorStop(0.75, '#f59e0b');
    borderGrad.addColorStop(1, '#b45309');

    ctx.strokeStyle = borderGrad;
    ctx.lineWidth = 3;
    ctx.strokeRect(36, 36, 1128, 1478);

    ctx.strokeStyle = 'rgba(251, 191, 36, 0.3)';
    ctx.lineWidth = 1;
    ctx.strokeRect(44, 44, 1112, 1462);

    // Corner Filigree Ornaments
    const drawCorner = (cx: number, cy: number) => {
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(cx, cy, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(cx, cy, 14, 0, Math.PI * 2);
      ctx.stroke();
    };
    drawCorner(56, 56);
    drawCorner(1144, 56);
    drawCorner(56, 1494);
    drawCorner(1144, 1494);
    ctx.restore();

    // 4. Studio Header Banner
    ctx.textAlign = 'center';
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.letterSpacing = '4px';
    ctx.fillText("R'TSON CREATIONS GRAPHIC & VECTOR DESIGN STUDIO", 600, 100);

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 36px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.letterSpacing = '-0.5px';
    ctx.fillText("OFFICIAL ARTWORK ORDER CERTIFICATE", 600, 145);

    // 300 DPI Gold Verification Badge
    const badgeGrad = ctx.createLinearGradient(400, 165, 800, 195);
    badgeGrad.addColorStop(0, '#f59e0b');
    badgeGrad.addColorStop(1, '#d97706');
    ctx.fillStyle = badgeGrad;
    ctx.beginPath();
    ctx.roundRect(380, 165, 440, 32, 16);
    ctx.fill();

    ctx.fillStyle = '#020617';
    ctx.font = '900 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.letterSpacing = '1px';
    ctx.fillText("300 DPI PRE-PRESS VERIFIED // MASTER PRODUCTION", 600, 186);

    // 5. Metadata Cards (Token, Date, Turnaround, Client)
    const drawCard = (x: number, y: number, w: number, h: number, title: string, val: string, sub?: string) => {
      ctx.fillStyle = 'rgba(6, 18, 38, 0.85)';
      ctx.strokeStyle = 'rgba(30, 58, 138, 0.6)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, 14);
      ctx.fill();
      ctx.stroke();

      ctx.textAlign = 'left';
      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText(title.toUpperCase(), x + 16, y + 26);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText(val, x + 16, y + 54);

      if (sub) {
        ctx.fillStyle = '#38bdf8';
        ctx.font = '11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.fillText(sub, x + 16, y + 74);
      }
    };

    drawCard(70, 220, 250, 90, "Order Token", `#${details.orderRef}`, "Cryptographically Logged");
    drawCard(340, 220, 250, 90, "Issue Date", new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }), "Official Studio Record");
    drawCard(610, 220, 250, 90, "Lead Turnaround", details.turnaround, "Standard Pre-Press Queue");
    drawCard(880, 220, 250, 90, "Client / Org", details.clientName || 'Valued Client', details.clientPhone || 'WhatsApp Direct');

    // 6. Project Specification Block
    ctx.fillStyle = 'rgba(6, 18, 38, 0.85)';
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.4)';
    ctx.beginPath();
    ctx.roundRect(70, 335, 1060, 280, 16);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#38bdf8';
    ctx.font = '900 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText("1. PROJECT SCOPE & CREATIVE ART DIRECTION", 95, 370);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(details.projectTitle || 'Custom Graphic Design Artwork', 95, 410);

    ctx.fillStyle = '#cbd5e1';
    ctx.font = '14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(`Design Category: ${details.categoryName}`, 95, 442);
    ctx.fillText("Pre-Press Output: 300 DPI CMYK Print PDF (ISO Coated v2) + Ultra HD RGB Web (1080x1350 & 1080x1920)", 95, 470);
    ctx.fillText(`Client Event / Brief: ${(details.projectDetails || 'Details provided directly via chat').substring(0, 130)}...`, 95, 498);
    if (details.preferredColors) {
      ctx.fillText(`Preferred Aesthetics: ${details.preferredColors}`, 95, 526);
    }

    // 7. Selected Add-ons & Features
    ctx.fillStyle = 'rgba(6, 18, 38, 0.85)';
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
    ctx.beginPath();
    ctx.roundRect(70, 635, 1060, 220, 16);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#f59e0b';
    ctx.font = '900 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText("2. INCLUDED ENHANCEMENTS & PRODUCTION ADD-ONS", 95, 670);

    const addons = details.selectedAddOns && details.selectedAddOns.length > 0
      ? details.selectedAddOns
      : ['300 DPI CMYK Separation', 'Ultra HD Social Formats (4:5 / 9:16)', 'Dedicated Revision Cycle', 'Studio Master Handover'];

    addons.slice(0, 6).forEach((addon, idx) => {
      const ax = 95 + (idx % 2) * 500;
      const ay = 710 + Math.floor(idx / 2) * 36;
      ctx.fillStyle = '#10b981';
      ctx.font = '900 14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText("+", ax, ay);
      ctx.fillStyle = '#f1f5f9';
      ctx.font = 'bold 14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText(addon, ax + 20, ay);
    });

    // 8. Financial Investment Box (Big Gold Badge)
    const investGrad = ctx.createLinearGradient(70, 875, 1130, 1075);
    investGrad.addColorStop(0, '#040d1e');
    investGrad.addColorStop(0.5, '#071736');
    investGrad.addColorStop(1, '#030814');
    ctx.fillStyle = investGrad;
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(70, 875, 1060, 190, 20);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText("TOTAL CLIENT PROPOSED INVESTMENT", 100, 915);

    ctx.fillStyle = '#38bdf8';
    ctx.font = '900 52px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(`$${effectivePrice} USD`, 100, 975);

    ctx.fillStyle = '#e2e8f0';
    ctx.font = '13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText("50% Deposit on Concept Approval  •  50% on Pre-Press Master File Handover", 100, 1025);

    // 9. Payment Gateways & Large QR Code Matrix Section
    ctx.fillStyle = 'rgba(6, 18, 38, 0.85)';
    ctx.strokeStyle = 'rgba(30, 58, 138, 0.6)';
    ctx.beginPath();
    ctx.roundRect(70, 1085, 730, 240, 16);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#38bdf8';
    ctx.font = '900 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText("3. OFFICIAL STUDIO PAYMENT GATEWAYS", 95, 1120);

    const drawPayMethod = (px: number, py: number, name: string, num: string, note: string) => {
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText(name, px, py);
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 15px monospace';
      ctx.fillText(num, px, py + 24);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText(note, px, py + 46);
    };

    drawPayMethod(95, 1160, "EcoCash Zimbabwe", "Prompt on Invoice", "Direct Merchant Transfer");
    drawPayMethod(450, 1160, "InnBucks Express", "Paycode on Invoice", "Instant USD Wallet");
    drawPayMethod(95, 1245, "PayPal / International", "info@rtsoncreations.co.zw", "Worldwide Payments");

    // Large Scannable QR Code Panel on the Right
    ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.8)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(820, 1085, 310, 240, 16);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#fbbf24';
    ctx.font = '900 11px monospace';
    ctx.fillText("SCAN TO VERIFY / OPEN", 840, 1115);

    if (qrCodeDataUrl) {
      try {
        const qrImg = new Image();
        qrImg.crossOrigin = 'anonymous';
        await new Promise((resolve) => {
          qrImg.onload = resolve;
          qrImg.onerror = resolve;
          qrImg.src = qrCodeDataUrl;
        });
        // White QR code backdrop for maximum contrast & scanning
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.roundRect(870, 1125, 180, 180, 8);
        ctx.fill();
        ctx.drawImage(qrImg, 875, 1130, 170, 170);
      } catch (e) {
        console.error('Failed to draw QR image on canvas', e);
      }
    }

    // 10. Studio Footer Guarantee & Contacts
    ctx.textAlign = 'center';
    ctx.fillStyle = '#64748b';
    ctx.font = '12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText("R'tson Creations Graphic & Vector Design Studio • Harare, Zimbabwe • Global Delivery", 600, 1380);
    ctx.fillText("Official Contact Email: info@rtsoncreations.co.zw • Web: www.rtsoncreations.co.zw", 600, 1405);

    // Official Stamp Simulation
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.6)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(600, 1465, 36, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 10px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText("R'TSON", 600, 1460);
    ctx.fillText("CERTIFIED", 600, 1475);

    return canvas;
  };

  const handleDownloadCardImage = async () => {
    sound.playSuccess();
    setIsGeneratingImage(true);
    try {
      const canvas = await generateCardCanvas();
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Rtson_Artwork_Order_Card_${details.orderRef}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 'image/png');
    } catch (e) {
      console.error('Error generating card image:', e);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleShareCardImage = async () => {
    sound.playClick();
    setIsGeneratingImage(true);
    try {
      const canvas = await generateCardCanvas();
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], `Rtson_Order_Card_${details.orderRef}.png`, { type: 'image/png' });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: `R'tson Creations Order Card #${details.orderRef}`,
            text: `Artwork Order Certificate for ${details.projectTitle || details.categoryName}`,
            files: [file]
          });
        } else {
          // Fallback to downloading image
          handleDownloadCardImage();
        }
      }, 'image/png');
    } catch (e) {
      console.error('Error sharing card image:', e);
      handleDownloadCardImage();
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleCopyMessage = () => {
    sound.playClick();
    const text = generateArtisticOrderMessage();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSendWhatsApp = async () => {
    sound.playSuccess();
    setIsGeneratingImage(true);
    try {
      const canvas = await generateCardCanvas();
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const cardFile = new File([blob], `Rtson_Artwork_Order_Card_${details.orderRef}.png`, { type: 'image/png' });
        const text = generateArtisticOrderMessage();

        // Convert attached photos into files if present
        const filesToShare: File[] = [cardFile];
        if (details.attachedPhotos && details.attachedPhotos.length > 0) {
          for (let i = 0; i < details.attachedPhotos.length; i++) {
            const photo = details.attachedPhotos[i];
            if (photo.dataUrl) {
              try {
                const res = await fetch(photo.dataUrl);
                const photoBlob = await res.blob();
                const photoFile = new File([photoBlob], photo.name || `attached_asset_${i + 1}.jpg`, {
                  type: photoBlob.type || 'image/jpeg'
                });
                filesToShare.push(photoFile);
              } catch (err) {
                console.warn('Could not package photo for sharing', err);
              }
            }
          }
        }

        // 1. Try Web Share API (first multi-file, then single card file)
        let shareSuccess = false;
        if (typeof navigator !== 'undefined' && navigator.canShare) {
          if (filesToShare.length > 1 && navigator.canShare({ files: filesToShare })) {
            try {
              await navigator.share({
                title: `R'tson Creations Artwork Order #${details.orderRef}`,
                text: text,
                files: filesToShare
              });
              shareSuccess = true;
            } catch (e: any) {
              if (e.name === 'AbortError') return;
              console.log('Multi-file share canceled or unsupported, trying single card file:', e);
            }
          }

          if (!shareSuccess && navigator.canShare({ files: [cardFile] })) {
            try {
              await navigator.share({
                title: `R'tson Creations Artwork Order #${details.orderRef}`,
                text: text,
                files: [cardFile]
              });
              shareSuccess = true;
            } catch (e: any) {
              if (e.name === 'AbortError') return;
              console.log('Single card share canceled or unsupported:', e);
            }
          }
        }

        if (shareSuccess) return;

        // 2. Copy image to clipboard for easy paste into WhatsApp Web
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ]);
        } catch (clipErr) {
          console.log('Clipboard copy skipped');
        }

        // 3. Upload to cloud for rich WhatsApp preview
        let finalMsg = text;
        try {
          const reader = new FileReader();
          const dataUrlPromise = new Promise<string>((resolve) => {
            reader.onload = () => resolve(reader.result as string);
            reader.readAsDataURL(blob);
          });
          const cardDataUrl = await dataUrlPromise;
          const uploadRes = await fetch('/api/retouched/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              image: cardDataUrl,
              name: `Rtson_Artwork_Order_Card_${details.orderRef}.png`,
              specs: { orderRef: details.orderRef }
            })
          });
          if (uploadRes.ok) {
            const uploadData = await uploadRes.json();
            if (uploadData?.viewUrl) {
              finalMsg += `\n\n*View Artwork Order Card Online:*\n${uploadData.viewUrl}`;
            }
          }
        } catch (cloudErr) {
          console.log('Cloud upload skipped');
        }

        // 4. Trigger automatic PNG download so user has the card ready
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Rtson_Artwork_Order_Card_${details.orderRef}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        // 5. Open email client with clean order summary & link
        const emailSubject = encodeURIComponent(`[Artwork Order Card #${details.orderRef}] ${details.projectTitle || details.categoryName}`);
        window.location.href = `mailto:info@rtsoncreations.co.zw?subject=${emailSubject}&body=${encodeURIComponent(finalMsg)}`;
      }, 'image/png');
    } catch (e) {
      console.error('Error generating and sending card to email:', e);
      const text = generateArtisticOrderMessage();
      const emailSubject = encodeURIComponent(`[Artwork Order Card #${details.orderRef}]`);
      window.location.href = `mailto:info@rtsoncreations.co.zw?subject=${emailSubject}&body=${encodeURIComponent(text)}`;
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleDownloadAllZip = async () => {
    sound.playSuccess();
    setIsPackagingZip(true);
    try {
      const zip = new JSZip();
      
      // 1. Generate PNG Card
      const canvas = await generateCardCanvas();
      const cardBlob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png'));
      if (cardBlob) {
        zip.file(`Rtson_Artwork_Order_Card_${details.orderRef}.png`, cardBlob);
      }

      // 2. Add text summary
      zip.file(`ORDER_SPECIFICATION_${details.orderRef}.txt`, generateArtisticOrderMessage());

      // 3. Add attached production photos in a dedicated assets folder
      if (details.attachedPhotos && details.attachedPhotos.length > 0) {
        const assetsFolder = zip.folder('production_assets');
        for (let i = 0; i < details.attachedPhotos.length; i++) {
          const photo = details.attachedPhotos[i];
          if (photo.dataUrl) {
            try {
              const res = await fetch(photo.dataUrl);
              const photoBlob = await res.blob();
              const ext = photo.name.includes('.') ? photo.name.split('.').pop() : 'jpg';
              assetsFolder?.file(`${i + 1}_${photo.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`, photoBlob);
            } catch (err) {
              console.warn('Could not add photo to zip', err);
            }
          }
        }
      }

      // 4. Generate and download zip package
      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Rtson_Order_Package_${details.orderRef}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to generate ZIP package:', err);
    } finally {
      setIsPackagingZip(false);
    }
  };

  const handlePrintCertificate = () => {
    sound.playClick();
    window.print();
  };

  // Foil style configs
  const foilThemes = {
    gold: {
      borderGradient: 'from-amber-300 via-amber-500 to-yellow-600',
      glowShadow: 'shadow-amber-500/30',
      badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      crestBorder: 'from-amber-400 via-yellow-300 to-amber-600',
      accentColor: 'text-amber-400'
    },
    holographic: {
      borderGradient: 'from-cyan-400 via-purple-500 to-pink-500',
      glowShadow: 'shadow-purple-500/30',
      badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
      crestBorder: 'from-cyan-400 via-purple-400 to-pink-500',
      accentColor: 'text-purple-400'
    },
    obsidian: {
      borderGradient: 'from-slate-700 via-blue-500 to-slate-800',
      glowShadow: 'shadow-blue-500/20',
      badgeBg: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
      crestBorder: 'from-slate-600 via-blue-400 to-slate-700',
      accentColor: 'text-blue-400'
    }
  };

  const activeTheme = foilThemes[activeFoil];

  return (
    <div className="space-y-6">
      
      {/* Top Floating Master Certificate Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-amber-500/40 text-slate-200 text-xs shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#d4f15d]/15 border border-[#d4f15d]/40 flex items-center justify-center text-[#d4f15d] shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="font-extrabold text-white text-sm flex items-center gap-2">
              <span>3D Masterpiece Order Certificate</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#d4f15d]/15 text-[#d4f15d] border border-[#d4f15d]/40 font-bold">
                Pre-Press Slot Reserved
              </span>
            </div>
            <span className="text-[11px] text-slate-400">
              Interactive 3D Physical Card with Real-time Light & Gyro Simulation. Tilt with cursor to inspect security seals.
            </span>
          </div>
        </div>

        {/* Foil Finish Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900/80 rounded-xl border border-slate-800 text-[11px] font-bold">
          <span className="text-slate-400 px-2 text-[10px] uppercase tracking-wider">Foil Finish:</span>
          {(['gold', 'holographic', 'obsidian'] as const).map((foil) => (
            <button
              key={foil}
              type="button"
              onClick={() => setActiveFoil(foil)}
              className={`px-2.5 py-1 rounded-lg capitalize transition-all cursor-pointer ${
                activeFoil === foil
                  ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {foil}
            </button>
          ))}
        </div>
      </div>

      {/* 3D Tilted Interactive Card Container */}
      <div 
        className="perspective-1000 flex justify-center py-4"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
      >
        <div
          ref={cardRef}
          style={{
            transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${isHovered ? 1.025 : 1})`,
            transition: isHovered ? 'transform 0.08s ease-out' : 'transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)',
            transformStyle: 'preserve-3d'
          }}
          className={`relative w-full max-w-2xl rounded-[28px] p-[2.5px] bg-gradient-to-br ${activeTheme.borderGradient} shadow-2xl ${activeTheme.glowShadow} cursor-pointer select-none transition-shadow`}
        >
          {/* Inner Card Body */}
          <div className="relative rounded-[25px] bg-gradient-to-b from-[#060c18] via-[#09152b] to-[#040812] p-6 sm:p-9 text-white overflow-hidden space-y-6">
            
            {/* Guilloché Geometric Wave Security Pattern in Card Background */}
            <div 
              className="absolute inset-0 opacity-[0.07] pointer-events-none"
              style={{
                backgroundImage: `
                  radial-gradient(circle at 50% 50%, rgba(245, 158, 11, 0.4) 0%, transparent 60%),
                  repeating-linear-gradient(45deg, rgba(255, 255, 255, 0.1) 0, rgba(255, 255, 255, 0.1) 1px, transparent 0, transparent 20px),
                  repeating-linear-gradient(-45deg, rgba(245, 158, 11, 0.1) 0, rgba(245, 158, 11, 0.1) 1px, transparent 0, transparent 20px)
                `,
                backgroundSize: '100% 100%, 40px 40px, 40px 40px'
              }}
            />

            {/* Dynamic Holographic Light Glare Reflection */}
            <div 
              className="absolute inset-0 pointer-events-none mix-blend-overlay transition-opacity duration-300"
              style={{
                opacity: isHovered ? 0.75 : 0.2,
                background: `radial-gradient(circle 450px at ${glarePos.x}% ${glarePos.y}%, rgba(255, 255, 255, 0.35), transparent 70%)`
              }}
            />

            {/* Micro-dot Hologram Border Strip */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-amber-400/80 to-transparent pointer-events-none" />

            {/* Certificate Top Header Section */}
            <div 
              className="flex items-start justify-between gap-4 border-b border-slate-800/90 pb-5 relative z-10"
              style={{ transform: 'translateZ(30px)' }}
            >
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full ${activeTheme.badgeBg} text-[10px] font-mono font-black tracking-widest uppercase`}>
                    OFFICIAL PRE-PRESS CERTIFICATE
                  </span>
                  <span className="text-xs font-mono text-amber-300 font-bold bg-slate-900/90 px-2.5 py-0.5 rounded-md border border-slate-800">
                    TOKEN: #{details.orderRef}
                  </span>
                </div>
                
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
                  <span>R'tson Creations</span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#d4f15d] text-slate-950 font-black tracking-wider uppercase">
                    Studio Master
                  </span>
                </h3>
                
                <p className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                  <span>3D Graphic Design & Advertising Pre-Press Specification</span>
                  <span className="text-[#d4f15d]">•</span>
                  <span className="text-slate-400">Harare, Zimbabwe</span>
                </p>
              </div>

              {/* Embossed Royal Studio Holographic Seal */}
              <div 
                className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${activeTheme.crestBorder} p-0.5 shadow-2xl ${activeTheme.glowShadow} flex items-center justify-center shrink-0`}
                style={{ transform: 'translateZ(45px)' }}
              >
                <div className="w-full h-full rounded-[14px] bg-gradient-to-b from-slate-900 to-slate-950 flex flex-col items-center justify-center text-center p-1 border border-white/10 relative overflow-hidden">
                  <div className="absolute inset-0 bg-[#d4f15d]/5 pointer-events-none" />
                  <Award className="w-7 h-7 text-[#d4f15d] drop-shadow-md" />
                  <span className="text-[8px] font-black text-[#d4f15d] uppercase tracking-tighter leading-tight mt-0.5">
                    VERIFIED MASTER
                  </span>
                  <span className="text-[7px] font-mono text-slate-400 leading-none">
                    300 DPI
                  </span>
                </div>
              </div>
            </div>

            {/* Specification Matrix Grid */}
            <div 
              className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 relative z-10"
              style={{ transform: 'translateZ(25px)' }}
            >
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                  <Layers className="w-3 h-3 text-blue-400" />
                  Discipline
                </span>
                <span className="text-xs font-bold text-white block truncate">
                  {details.categoryName}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#d4f15d]" />
                  Turnaround
                </span>
                <span className="text-xs font-bold text-amber-300 block truncate">
                  {details.turnaround}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                  <Printer className="w-3 h-3 text-emerald-400" />
                  Print Density
                </span>
                <span className="text-xs font-bold text-emerald-300 block truncate">
                  300 DPI CMYK
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                  <Palette className="w-3 h-3 text-purple-400" />
                  RGB Web Master
                </span>
                <span className="text-xs font-bold text-purple-300 block truncate">
                  Ultra HD 4K
                </span>
              </div>
            </div>

            {/* Client Information & Detailed Project Scope Card */}
            <div 
              className="p-4 sm:p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3 relative z-10"
              style={{ transform: 'translateZ(20px)' }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs border-b border-slate-800/80 pb-3">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                    <User className="w-3 h-3 text-amber-400" /> Client Name
                  </span>
                  <span className="font-extrabold text-white text-sm block">
                    {details.clientName || 'Direct Client'}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                    <Phone className="w-3 h-3 text-blue-400" /> Client Contact / WhatsApp
                  </span>
                  <span className="font-mono text-slate-300 text-xs block truncate">
                    {details.clientPhone || details.clientEmail || 'Provided on WhatsApp'}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Project Title / Event Headline
                </span>
                <p className="text-sm font-black text-amber-300 leading-snug">
                  {details.projectTitle || 'Custom Graphic Design Brief'}
                </p>
              </div>

              <div className="space-y-1 pt-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Client Brief Requirements & Text
                </span>
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 font-mono leading-relaxed max-h-24 overflow-y-auto whitespace-pre-wrap">
                  {details.projectDetails || 'Will supply exact headline, scriptures, dates, venue & speaker photo cutouts directly in chat.'}
                </div>
              </div>

              {/* Attached Studio Photos & Production Assets */}
              {details.attachedPhotos && details.attachedPhotos.length > 0 && (
                <div className="pt-2 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-amber-400 flex items-center gap-1.5">
                      <ImageIcon className="w-3 h-3" /> Attached Production Photos & Assets ({details.attachedPhotos.length}):
                    </span>
                    <span className="text-[9px] text-emerald-400 font-mono flex items-center gap-1">
                      <Check className="w-3 h-3" /> Complimentary 3D Cutout & Lighting Included
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {details.attachedPhotos.map((photo, i) => (
                      <div
                        key={photo.id || i}
                        onClick={() => {
                          sound.playClick();
                          setLightboxPhoto(photo);
                          setLightboxZoom(1);
                        }}
                        className="p-2 rounded-xl bg-slate-950/90 border border-slate-800 hover:border-amber-500/50 transition-all flex items-center gap-2.5 cursor-pointer group/item"
                      >
                        {photo.dataUrl ? (
                          <div className="w-11 h-11 rounded-lg overflow-hidden bg-black/60 border border-white/10 shrink-0 relative">
                            <img
                              src={photo.dataUrl}
                              alt={photo.name}
                              className="w-full h-full object-cover group-hover/item:scale-110 transition-transform"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/item:opacity-100 flex items-center justify-center text-white transition-opacity">
                              <ZoomIn className="w-3.5 h-3.5" />
                            </div>
                          </div>
                        ) : (
                          <div className="w-11 h-11 rounded-lg bg-slate-900 flex items-center justify-center text-slate-500 shrink-0">
                            <ImageIcon className="w-5 h-5" />
                          </div>
                        )}

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-[11px] font-bold text-white truncate">
                              {photo.name}
                            </span>
                            <span className="text-[9px] font-mono text-emerald-400 shrink-0">
                              {photo.sizeFormatted}
                            </span>
                          </div>
                          <div className="text-[10px] text-amber-300 font-semibold truncate">
                            {photo.roleLabel}
                          </div>
                          {photo.instructions && (
                            <div className="text-[9px] text-slate-400 truncate italic">
                              "{photo.instructions}"
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {details.selectedAddOns && details.selectedAddOns.length > 0 && (
                <div className="pt-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">
                    Selected Production Enhancements:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {details.selectedAddOns.map((addon, i) => (
                      <span 
                        key={i} 
                        className="text-[11px] px-2.5 py-1 rounded-lg bg-neutral-900 border border-[#d4f15d]/40 text-[#d4f15d] font-bold flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3 h-3 text-[#d4f15d]" />
                        <span>{addon}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Financial Investment Breakdown & Payment Gateways with Large QR Code */}
            <div 
              className="grid grid-cols-1 md:grid-cols-12 gap-4 p-5 rounded-2xl bg-neutral-950 border border-[#d4f15d]/40 relative z-10"
              style={{ transform: 'translateZ(35px)' }}
            >
              {/* Financial & Gateways (Left 8 cols) */}
              <div className="md:col-span-8 flex flex-col justify-between space-y-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#d4f15d]">
                      Client Proposed Budget
                    </span>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#d4f15d]/20 text-[#d4f15d] border border-[#d4f15d]/40 font-bold">
                      Client Offer
                    </span>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                      ${effectivePrice}
                    </span>
                    <span className="text-xs font-bold text-slate-400 uppercase">
                      USD Proposed
                    </span>
                  </div>

                  {details.negotiationReason && (
                    <p className="text-[11px] text-[#d4f15d]/90 font-medium">
                      Note: {details.negotiationReason}
                    </p>
                  )}
                </div>

                {/* Supported Payment Channels Pill List */}
                <div className="space-y-1.5 pt-2 border-t border-neutral-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">
                    Official Payment Gateways
                  </span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-black text-[#d4f15d] border border-[#d4f15d]/40">
                      EcoCash: Prompt on Invoice
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-black text-white border border-neutral-700">
                      InnBucks: Paycode on Request
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-black text-[#d4f15d] border border-[#d4f15d]/30">
                      PayPal / ZIPIT
                    </span>
                  </div>
                </div>
              </div>

              {/* Large Scannable QR Code Column (Right 4 cols) */}
              <div className="md:col-span-4 flex flex-col items-center justify-center p-3 rounded-xl bg-slate-950/90 border-2 border-amber-500/40 text-center relative overflow-hidden shadow-inner">
                <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-amber-400 uppercase tracking-tight mb-2">
                  <ScanLine className="w-3.5 h-3.5 text-amber-400" />
                  <span>Scan / RSVP QR</span>
                </div>

                {qrCodeDataUrl ? (
                  <div className="p-2 bg-white rounded-xl shadow-lg border border-white/20 relative group/qr">
                    <img 
                      src={qrCodeDataUrl} 
                      alt="Official Order & Event QR Code" 
                      className="w-28 h-28 sm:w-32 sm:h-32 object-contain block"
                    />
                    <div className="absolute inset-0 bg-slate-950/80 opacity-0 group-hover/qr:opacity-100 flex flex-col items-center justify-center transition-opacity rounded-xl p-1 text-white">
                      <QrCode className="w-5 h-5 text-amber-400 mb-1" />
                      <span className="text-[9px] font-mono font-bold">Studio Verified</span>
                    </div>
                  </div>
                ) : (
                  <div className="w-28 h-28 sm:w-32 sm:h-32 bg-slate-900 rounded-xl flex items-center justify-center text-slate-500">
                    <QrCode className="w-8 h-8 animate-pulse text-amber-400" />
                  </div>
                )}

                <span className="text-[9px] font-mono text-slate-400 mt-2">
                  Pre-Press Spec #{details.orderRef}
                </span>
              </div>
            </div>

            {/* Bottom Security Hologram Strip & Guarantee Seal */}
            <div 
              className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-3 border-t border-slate-800/90 text-[10px] text-slate-400 font-mono relative z-10"
              style={{ transform: 'translateZ(15px)' }}
            >
              <div className="flex items-center gap-2 text-amber-300">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span className="font-bold">100% PRE-PRESS CERTIFIED & LAYERED PSD HANDOVER</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <span>R'TSON CREATIONS STUDIO • HARARE, ZW</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Action Buttons Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
        
        {/* Download Visual Order Card Image (PNG) */}
        <button
          type="button"
          onClick={handleDownloadCardImage}
          disabled={isGeneratingImage}
          className="px-3.5 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 font-black text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98]"
        >
          <Download className="w-4 h-4 text-slate-950 shrink-0" />
          <span>{isGeneratingImage ? 'Exporting...' : 'Download Card (PNG)'}</span>
        </button>

        {/* Send Direct to WhatsApp with PNG Card + Attached Assets */}
        <button
          type="button"
          onClick={handleSendWhatsApp}
          disabled={isGeneratingImage}
          className="px-3.5 py-3 rounded-xl bg-[#d4f15d] hover:bg-[#bef264] text-slate-950 font-black text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-black/40 hover:scale-[1.02] active:scale-[0.98]"
        >
          <MessageSquare className="w-4 h-4 fill-slate-950 text-slate-950 shrink-0" />
          <span>{isGeneratingImage ? 'Processing...' : 'Send Card to WhatsApp'}</span>
        </button>

        {/* Download ZIP Package (Flyer PNG + All Photos + Text) */}
        <button
          type="button"
          onClick={handleDownloadAllZip}
          disabled={isPackagingZip}
          className="px-3.5 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-[#d4f15d] text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md hover:scale-[1.02] active:scale-[0.98]"
        >
          <Archive className="w-4 h-4 text-[#d4f15d] shrink-0" />
          <span>{isPackagingZip ? 'Packaging...' : 'Download ZIP Package'}</span>
        </button>

        {/* Share Visual Card Image */}
        <button
          type="button"
          onClick={handleShareCardImage}
          disabled={isGeneratingImage}
          className="px-3.5 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-[#d4f15d] text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md hover:scale-[1.02] active:scale-[0.98]"
        >
          <Share2 className="w-4 h-4 text-white shrink-0" />
          <span>Share Visual Card</span>
        </button>

        {/* Copy Order Details */}
        <button
          type="button"
          onClick={handleCopyMessage}
          className={`px-3.5 py-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            copied
              ? 'bg-[#d4f15d] border-[#d4f15d] text-slate-950 font-black shadow-lg'
              : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-200 hover:border-[#d4f15d]/40'
          }`}
        >
          {copied ? <Check className="w-4 h-4 text-slate-950" /> : <Copy className="w-4 h-4 text-[#d4f15d]" />}
          <span>{copied ? 'Copied!' : 'Copy Order'}</span>
        </button>

      </div>

      {/* Photo Zoom Lightbox Modal */}
      {lightboxPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-150">
          <div className="relative max-w-3xl w-full bg-[#07132b] border border-[#1e3a8a] rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-3.5 bg-[#040b1a] border-b border-[#1e3a8a]/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#d4f15d]" />
                <span className="text-xs font-bold text-white truncate max-w-xs">{lightboxPhoto.name}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#d4f15d]/20 text-[#d4f15d] border border-[#d4f15d]/40 font-bold">
                  {lightboxPhoto.roleLabel}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setLightboxPhoto(null)}
                className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 p-4 flex items-center justify-center bg-[#020612] overflow-auto">
              <img
                src={lightboxPhoto.dataUrl}
                alt={lightboxPhoto.name}
                style={{ transform: `scale(${lightboxZoom})`, transition: 'transform 0.2s ease' }}
                className="max-h-[60vh] max-w-full object-contain rounded-lg"
              />
            </div>
            <div className="p-3 bg-black border-t border-neutral-800 flex items-center justify-between text-xs">
              <span className="text-slate-400 text-[11px]">
                {lightboxPhoto.instructions ? `Notes: "${lightboxPhoto.instructions}"` : 'Studio Pre-Press Asset'}
              </span>
              <button
                type="button"
                onClick={() => setLightboxPhoto(null)}
                className="px-3.5 py-1 rounded-lg bg-[#d4f15d] hover:bg-[#bef264] text-slate-950 font-black text-xs cursor-pointer transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
