import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Camera, 
  RefreshCw, 
  X, 
  Sparkles, 
  CheckCircle2, 
  Download, 
  Wand2, 
  Sun, 
  Contrast, 
  Smile, 
  Clock, 
  FlipHorizontal, 
  Zap, 
  ShieldCheck, 
  ShoppingBag,
  Send,
  RotateCcw,
  Palette,
  Upload,
  Image as ImageIcon,
  AlertTriangle,
  HelpCircle,
  Video
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { sound } from '../lib/soundFx';
import samplePortraitImg from '../assets/images/real_church_flyer_1787906566871.jpg';
import { RetouchedPhotoShareModal } from './RetouchedPhotoShareModal';

interface SelfieStudioCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPhotoCaptured?: (dataUrl: string, summary?: string) => void;
  onSendToRetouchDesk?: (dataUrl: string) => void;
  onSendToStartOrder?: (dataUrl: string, summary?: string) => void;
}

type AspectRatioMode = '4:5' | '9:16' | '1:1' | '4:3' | 'full';
type FramingGuide = 'oval' | 'grid' | 'crosshair' | 'none';
type TonePreset = 'neutral' | 'warm_golden' | 'cool_led' | 'high_contrast' | 'vintage_glow' | 'bw_studio';

interface VideoDevice {
  deviceId: string;
  label: string;
}

export const SelfieStudioCaptureModal: React.FC<SelfieStudioCaptureModalProps> = ({
  isOpen,
  onClose,
  onPhotoCaptured,
  onSendToRetouchDesk,
  onSendToStartOrder
}) => {
  // Video Stream & Camera States
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<{ message: string; type: 'permission' | 'device' | 'busy' | 'generic' } | null>(null);
  const [isStartingCamera, setIsStartingCamera] = useState<boolean>(false);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [isMirrored, setIsMirrored] = useState<boolean>(true);
  const [availableDevices, setAvailableDevices] = useState<VideoDevice[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');

  // Studio Adjustments (Live & Post-Capture)
  const [brightness, setBrightness] = useState<number>(104); // 70 to 140
  const [contrast, setContrast] = useState<number>(106); // 70 to 150
  const [skinSmooth, setSkinSmooth] = useState<number>(35); // 0 to 100
  const [warmth, setWarmth] = useState<number>(10); // -40 (cool) to +40 (warm)
  const [saturation, setSaturation] = useState<number>(110); // 0 to 150
  const [activeTonePreset, setActiveTonePreset] = useState<TonePreset>('warm_golden');
  
  // Studio Lighting & Helpers
  const [screenRingLight, setScreenRingLight] = useState<boolean>(false);
  const [ringLightColor, setRingLightColor] = useState<'warm' | 'white' | 'gold'>('warm');
  const [aspectRatio, setAspectRatio] = useState<AspectRatioMode>('4:5');
  const [framingGuide, setFramingGuide] = useState<FramingGuide>('oval');
  const [timerDuration, setTimerDuration] = useState<number>(0); // 0 (off), 3, 5, 10
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isFlashing, setIsFlashing] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'adjust' | 'lighting' | 'guides' | 'presets'>('adjust');
  const [isDraggingFile, setIsDraggingFile] = useState<boolean>(false);

  // Captured Photo State
  const [capturedDataUrl, setCapturedDataUrl] = useState<string | null>(null);
  const [isProcessingCapture, setIsProcessingCapture] = useState<boolean>(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);

  // Enumerate available video devices
  const refreshDevices = useCallback(async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoInputs = devices
          .filter(d => d.kind === 'videoinput')
          .map((d, i) => ({
            deviceId: d.deviceId,
            label: d.label || `Camera ${i + 1} (${d.deviceId.slice(0, 5)}...)`
          }));
        setAvailableDevices(videoInputs);
        if (videoInputs.length > 0 && !selectedDeviceId) {
          setSelectedDeviceId(videoInputs[0].deviceId);
        }
      }
    } catch (e) {
      console.warn('Unable to enumerate camera devices:', e);
    }
  }, [selectedDeviceId]);

  // Stop Camera helper
  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => {
        try {
          track.stop();
        } catch (err) {
          console.warn('Track stop error', err);
        }
      });
      setStream(null);
    }
    setIsCameraActive(false);
    setIsStartingCamera(false);
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, [stream]);

  // Initialize Camera Stream with Progressive Fallbacks
  const startCamera = useCallback(async (deviceIdOverride?: string) => {
    setIsStartingCamera(true);
    setCameraError(null);
    
    // Stop any existing stream
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }

    const deviceToUse = deviceIdOverride !== undefined ? deviceIdOverride : selectedDeviceId;

    // Progressive constraints ladder
    const constraintTiers: MediaStreamConstraints[] = [];

    if (deviceToUse) {
      constraintTiers.push({
        video: {
          deviceId: { exact: deviceToUse },
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      });
      constraintTiers.push({
        video: { deviceId: { exact: deviceToUse } },
        audio: false
      });
    }

    // FacingMode constraints
    constraintTiers.push({
      video: {
        facingMode: { ideal: facingMode },
        width: { ideal: 1920 },
        height: { ideal: 1080 }
      },
      audio: false
    });

    constraintTiers.push({
      video: {
        facingMode: facingMode
      },
      audio: false
    });

    // Basic permissive video
    constraintTiers.push({
      video: true,
      audio: false
    });

    let acquiredStream: MediaStream | null = null;
    let lastError: any = null;

    for (const constraints of constraintTiers) {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          acquiredStream = await navigator.mediaDevices.getUserMedia(constraints);
          if (acquiredStream) break;
        } else if ((navigator as any).getUserMedia) {
          acquiredStream = await new Promise<MediaStream>((resolve, reject) => {
            (navigator as any).getUserMedia(constraints, resolve, reject);
          });
          if (acquiredStream) break;
        } else if ((navigator as any).webkitGetUserMedia) {
          acquiredStream = await new Promise<MediaStream>((resolve, reject) => {
            (navigator as any).webkitGetUserMedia(constraints, resolve, reject);
          });
          if (acquiredStream) break;
        }
      } catch (err: any) {
        lastError = err;
        console.warn('Constraint attempt failed, falling back:', constraints, err);
      }
    }

    if (acquiredStream) {
      setStream(acquiredStream);
      setIsCameraActive(true);
      setIsStartingCamera(false);
      setCameraError(null);

      // Re-enumerate to get labeled camera names after permission granted
      refreshDevices();
    } else {
      setIsCameraActive(false);
      setIsStartingCamera(false);
      
      let type: 'permission' | 'device' | 'busy' | 'generic' = 'generic';
      let message = 'Unable to access your camera. Please check your camera permissions or upload a portrait directly.';

      if (lastError) {
        if (lastError.name === 'NotAllowedError' || lastError.name === 'PermissionDeniedError') {
          type = 'permission';
          message = 'Camera permission was denied. Please click the lock or camera icon in your browser address bar to allow camera access.';
        } else if (lastError.name === 'NotFoundError' || lastError.name === 'DevicesNotFoundError') {
          type = 'device';
          message = 'No camera device detected on this system. You can easily upload any portrait file from your device.';
        } else if (lastError.name === 'NotReadableError' || lastError.name === 'TrackStartError') {
          type = 'busy';
          message = 'Camera is currently in use by another app (e.g. Zoom, Google Meet, Microsoft Teams). Please close the other app and retry.';
        } else if (lastError.name === 'OverconstrainedError') {
          type = 'device';
          message = 'The requested camera resolution is not supported by your hardware.';
        }
      }

      setCameraError({ message, type });
    }
  }, [facingMode, selectedDeviceId, refreshDevices, stream]);

  // Attach Stream to Video Element safely whenever stream or ref mounts
  useEffect(() => {
    if (!videoRef.current || !stream) return;
    const video = videoRef.current;
    
    if (video.srcObject !== stream) {
      video.srcObject = stream;
    }

    const handleLoadedMetadata = () => {
      video.play().catch(err => {
        console.warn('Video play warning:', err);
      });
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.play().catch(() => {});

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [stream, isCameraActive, capturedDataUrl]);

  // Start on modal open, stop on close
  useEffect(() => {
    if (isOpen && !capturedDataUrl) {
      startCamera();
      refreshDevices();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, capturedDataUrl]);

  // Reset states when closed
  const handleClose = () => {
    sound.playClick();
    stopCamera();
    setCapturedDataUrl(null);
    setCountdown(null);
    onClose();
  };

  // Switch camera facing mode
  const handleToggleFacingMode = () => {
    sound.playClick();
    const nextFacing = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(nextFacing);
    // If user has enumerated devices, try next device
    if (availableDevices.length > 1) {
      const currentIndex = availableDevices.findIndex(d => d.deviceId === selectedDeviceId);
      const nextIndex = (currentIndex + 1) % availableDevices.length;
      setSelectedDeviceId(availableDevices[nextIndex].deviceId);
      startCamera(availableDevices[nextIndex].deviceId);
    } else {
      startCamera();
    }
  };

  // Tone Presets Application
  const applyPreset = (preset: TonePreset) => {
    sound.playPop();
    setActiveTonePreset(preset);
    switch (preset) {
      case 'neutral':
        setBrightness(100);
        setContrast(100);
        setSkinSmooth(15);
        setWarmth(0);
        setSaturation(100);
        break;
      case 'warm_golden':
        setBrightness(106);
        setContrast(108);
        setSkinSmooth(40);
        setWarmth(20);
        setSaturation(115);
        break;
      case 'cool_led':
        setBrightness(104);
        setContrast(112);
        setSkinSmooth(25);
        setWarmth(-15);
        setSaturation(105);
        break;
      case 'high_contrast':
        setBrightness(102);
        setContrast(130);
        setSkinSmooth(20);
        setWarmth(5);
        setSaturation(125);
        break;
      case 'vintage_glow':
        setBrightness(108);
        setContrast(95);
        setSkinSmooth(50);
        setWarmth(35);
        setSaturation(90);
        break;
      case 'bw_studio':
        setBrightness(105);
        setContrast(135);
        setSkinSmooth(30);
        setWarmth(0);
        setSaturation(0);
        break;
    }
  };

  // CSS Filter string calculation for live video feed
  const getFilterStyle = () => {
    let filterStr = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
    if (warmth > 0) {
      filterStr += ` sepia(${warmth * 0.4}%) hue-rotate(-${warmth * 0.3}deg)`;
    } else if (warmth < 0) {
      filterStr += ` hue-rotate(${Math.abs(warmth) * 0.5}deg)`;
    }
    if (skinSmooth > 0) {
      const blurPx = (skinSmooth / 100) * 0.4;
      if (blurPx > 0.05) {
        filterStr += ` blur(${blurPx}px)`;
      }
    }
    return filterStr;
  };

  // Trigger Snapshot with optional timer countdown
  const triggerCaptureFlow = () => {
    if (timerDuration === 0) {
      executeSnapshot();
    } else {
      sound.playPop();
      setCountdown(timerDuration);
    }
  };

  // Countdown timer handler
  useEffect(() => {
    if (countdown === null) return;
    if (countdown > 0) {
      sound.playPop();
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setCountdown(null);
      executeSnapshot();
    }
  }, [countdown]);

  // Actual high-resolution canvas snapshot rendering
  const executeSnapshot = () => {
    const video = videoRef.current;
    if (!video || !video.videoWidth) {
      // Fallback: If no live video stream active, use sample portrait
      loadSamplePortrait();
      return;
    }

    sound.playCameraShutter();
    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 200);
    setIsProcessingCapture(true);

    const videoW = video.videoWidth;
    const videoH = video.videoHeight;

    // Calculate crop dimensions based on aspect ratio
    let targetW = videoW;
    let targetH = videoH;
    let startX = 0;
    let startY = 0;

    if (aspectRatio === '4:5') {
      const targetRatio = 4 / 5;
      if (videoW / videoH > targetRatio) {
        targetW = videoH * targetRatio;
        startX = (videoW - targetW) / 2;
      } else {
        targetH = videoW / targetRatio;
        startY = (videoH - targetH) / 2;
      }
    } else if (aspectRatio === '9:16') {
      const targetRatio = 9 / 16;
      if (videoW / videoH > targetRatio) {
        targetW = videoH * targetRatio;
        startX = (videoW - targetW) / 2;
      } else {
        targetH = videoW / targetRatio;
        startY = (videoH - targetH) / 2;
      }
    } else if (aspectRatio === '1:1') {
      const minDim = Math.min(videoW, videoH);
      targetW = minDim;
      targetH = minDim;
      startX = (videoW - minDim) / 2;
      startY = (videoH - minDim) / 2;
    } else if (aspectRatio === '4:3') {
      const targetRatio = 4 / 3;
      if (videoW / videoH > targetRatio) {
        targetW = videoH * targetRatio;
        startX = (videoW - targetW) / 2;
      } else {
        targetH = videoW / targetRatio;
        startY = (videoH - targetH) / 2;
      }
    }

    // High resolution render canvas
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(targetW);
    canvas.height = Math.round(targetH);
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) {
      setIsProcessingCapture(false);
      return;
    }

    ctx.save();
    // If selfie mirror is active, flip horizontally
    if (isMirrored && facingMode === 'user') {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }

    // Apply color correction filter directly to canvas context
    ctx.filter = getFilterStyle();

    // Draw cropped video frame
    ctx.drawImage(
      video,
      startX, startY, targetW, targetH,
      0, 0, canvas.width, canvas.height
    );
    ctx.restore();

    // Beauty skin smoothing pass if requested
    if (skinSmooth > 15) {
      try {
        const smoothCanvas = document.createElement('canvas');
        smoothCanvas.width = canvas.width;
        smoothCanvas.height = canvas.height;
        const sCtx = smoothCanvas.getContext('2d');
        if (sCtx) {
          sCtx.filter = `blur(${Math.round((skinSmooth / 100) * 3)}px) brightness(102%)`;
          sCtx.drawImage(canvas, 0, 0);
          
          // Blend with soft overlay opacity
          ctx.save();
          ctx.globalAlpha = Math.min(0.45, (skinSmooth / 100) * 0.5);
          ctx.globalCompositeOperation = 'soft-light';
          ctx.drawImage(smoothCanvas, 0, 0);
          ctx.restore();
        }
      } catch (e) {
        console.error('Skin blend pass error', e);
      }
    }

    const dataUrl = canvas.toDataURL('image/png', 0.95);
    setCapturedDataUrl(dataUrl);
    setIsProcessingCapture(false);
    stopCamera();
    sound.playSuccess();
  };

  // Upload Photo from Device Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    sound.playPop();
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setCapturedDataUrl(result);
        stopCamera();
        sound.playSuccess();
      }
    };
    reader.readAsDataURL(file);
  };

  // Drop File Handler
  const handleDropFile = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    sound.playPop();
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setCapturedDataUrl(result);
        stopCamera();
        sound.playSuccess();
      }
    };
    reader.readAsDataURL(file);
  };

  // Load Sample Studio Portrait for immediate zero-friction testing
  const loadSamplePortrait = () => {
    sound.playSuccess();
    setCapturedDataUrl(samplePortraitImg);
    stopCamera();
  };

  // Retake photo
  const handleRetake = () => {
    sound.playClick();
    setCapturedDataUrl(null);
    startCamera();
  };

  // Download high-resolution PNG locally
  const handleDownload = () => {
    if (!capturedDataUrl) return;
    sound.playChime();
    const link = document.createElement('a');
    link.href = capturedDataUrl;
    link.download = `rtson-studio-portrait-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Send to Start Order Page
  const handleAttachToOrder = () => {
    if (!capturedDataUrl) return;
    sound.playSuccess();
    const summary = `Studio Portrait Captured (${aspectRatio} ratio, ${activeTonePreset} tone preset, beauty-smooth: ${skinSmooth}%)`;
    if (onPhotoCaptured) {
      onPhotoCaptured(capturedDataUrl, summary);
    }
    if (onSendToStartOrder) {
      onSendToStartOrder(capturedDataUrl, summary);
    }
    handleClose();
  };

  // Send to Retouch Desk
  const handleTransferToRetouchDesk = () => {
    if (!capturedDataUrl) return;
    sound.playSuccess();
    if (onSendToRetouchDesk) {
      onSendToRetouchDesk(capturedDataUrl);
    }
    handleClose();
  };

  // Direct WhatsApp Send (Shares the actual photo file & link)
  const handleSendViaWhatsApp = () => {
    if (!capturedDataUrl) return;
    sound.playChime();
    setIsShareModalOpen(true);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] overflow-y-auto bg-black/90 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 animate-in fade-in select-none"
      onDragOver={(e) => { e.preventDefault(); setIsDraggingFile(true); }}
      onDragLeave={() => setIsDraggingFile(false)}
      onDrop={handleDropFile}
    >
      
      {/* Hidden File Input for Direct Upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileUpload}
      />

      {/* Screen Ring Light / Fill Illumination Border */}
      {screenRingLight && !capturedDataUrl && (
        <div 
          className={`fixed inset-0 pointer-events-none z-50 transition-all duration-300 border-[28px] sm:border-[45px] ${
            ringLightColor === 'warm' 
              ? 'border-amber-300/60 shadow-[inset_0_0_100px_rgba(251,191,36,0.5)]' 
              : ringLightColor === 'gold'
              ? 'border-[#bef264]/70 shadow-[inset_0_0_100px_rgba(212,241,93,0.5)]'
              : 'border-white/70 shadow-[inset_0_0_100px_rgba(255,255,255,0.6)]'
          }`} 
        />
      )}

      {/* Main Studio Modal Frame */}
      <motion.div
        initial={{ scale: 0.94, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.94, opacity: 0, y: 15 }}
        className="relative w-full max-w-5xl rounded-3xl bg-black border border-[#d4f15d]/40 shadow-[0_0_60px_rgba(212,241,93,0.25)] text-white overflow-hidden flex flex-col max-h-[94vh]"
      >
        {/* Top Studio Header Bar */}
        <div className="p-3.5 sm:px-6 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#d4f15d] p-0.5 shadow-lg flex items-center justify-center">
              <div className="w-full h-full rounded-[14px] bg-black flex items-center justify-center">
                <Camera className="w-5 h-5 text-[#d4f15d]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-black text-white tracking-tight">
                  Studio Live Selfie & Portrait Cam
                </h3>
                <span className="text-[9px] sm:text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#d4f15d]/20 border border-[#d4f15d]/40 text-[#bef264] font-bold hidden xs:inline-block">
                  300 DPI PRE-PRESS
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Capture high-resolution flyer portraits with calibrated lighting, beauty skin-smoothing & guides
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Upload Button */}
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                fileInputRef.current?.click();
              }}
              className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#081733] hover:bg-[#0d2654] border border-slate-700 hover:border-sky-400/60 text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
              title="Upload existing portrait image file"
            >
              <Upload className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden sm:inline">Upload Photo</span>
            </button>

            {/* Flash Simulation / Fill Light Toggle */}
            {!capturedDataUrl && isCameraActive && (
              <button
                type="button"
                onClick={() => {
                  sound.playPop();
                  setScreenRingLight(!screenRingLight);
                }}
                className={`px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  screenRingLight 
                    ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-[0_0_20px_rgba(251,191,36,0.6)]' 
                    : 'bg-[#081733] border-slate-700 text-slate-300 hover:text-white'
                }`}
                title="Toggle soft screen ring light glow for low-light environments"
              >
                <Zap className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Ring Light</span>
              </button>
            )}

            {/* Close Button */}
            <button
              type="button"
              onClick={handleClose}
              className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-400 hover:text-white cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Two Columns (Camera/Preview Stage on Left, Studio Adjustments on Right) */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-y-auto min-h-0 divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
          
          {/* ========================================================================= */}
          {/* LEFT: LIVE CAMERA / CAPTURED PHOTO VIEWPORT                                */}
          {/* ========================================================================= */}
          <div className="lg:col-span-7 p-3 sm:p-5 flex flex-col items-center justify-center bg-[#02050f] relative min-h-[340px] sm:min-h-[440px]">
            
            {/* Live Camera Viewfinder or Frozen Snapshot Stage */}
            <div 
              className={`relative rounded-3xl overflow-hidden bg-black border-2 border-blue-500/50 shadow-2xl flex items-center justify-center w-full max-w-md mx-auto transition-all ${
                aspectRatio === '4:5' ? 'aspect-[4/5]' :
                aspectRatio === '9:16' ? 'aspect-[9/16] max-h-[480px]' :
                aspectRatio === '1:1' ? 'aspect-square' :
                aspectRatio === '4:3' ? 'aspect-[4/3]' : 'aspect-[4/5]'
              }`}
            >
              {/* Drag over overlay */}
              {isDraggingFile && (
                <div className="absolute inset-0 z-50 bg-blue-950/90 border-2 border-dashed border-sky-400 flex flex-col items-center justify-center text-center p-4">
                  <Upload className="w-10 h-10 text-sky-400 mb-2" />
                  <p className="text-sm font-bold text-white">Drop your portrait image here</p>
                </div>
              )}

              {/* Flash burst effect on snap */}
              {isFlashing && (
                <div className="absolute inset-0 z-50 bg-white animate-out fade-out duration-200 pointer-events-none" />
              )}

              {/* Countdown overlay */}
              {countdown !== null && (
                <div className="absolute inset-0 z-40 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center animate-in zoom-in-50">
                  <span className="text-8xl font-black text-amber-400 drop-shadow-[0_0_30px_rgba(251,191,36,0.9)] animate-pulse">
                    {countdown}
                  </span>
                  <span className="text-xs text-white uppercase tracking-widest mt-2 font-bold">
                    Get Ready for Snapshot
                  </span>
                </div>
              )}

              {/* Loading camera state */}
              {isStartingCamera && !capturedDataUrl && !cameraError && (
                <div className="absolute inset-0 z-30 bg-[#040e24]/90 flex flex-col items-center justify-center p-6 text-center space-y-3">
                  <div className="w-10 h-10 rounded-full border-3 border-[#d4f15d] border-t-transparent animate-spin" />
                  <p className="text-xs font-bold text-white">Initializing Studio HD Camera...</p>
                  <p className="text-[11px] text-slate-400">Calibrating sensor & lighting adjustments</p>
                </div>
              )}

              {/* LIVE VIDEO FEED */}
              {!capturedDataUrl && (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className={`w-full h-full object-cover transition-all ${
                      isMirrored && facingMode === 'user' ? 'scale-x-[-1]' : ''
                    }`}
                    style={{
                      filter: getFilterStyle()
                    }}
                    onLoadedMetadata={() => {
                      videoRef.current?.play().catch(() => {});
                    }}
                  />

                  {/* Camera Error / Permission Fallback Interface */}
                  {cameraError && (
                    <div className="absolute inset-0 p-5 bg-[#040e24]/95 backdrop-blur-md flex flex-col items-center justify-center text-center space-y-3 z-30 overflow-y-auto">
                      <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                        {cameraError.type === 'permission' ? (
                          <AlertTriangle className="w-6 h-6" />
                        ) : (
                          <Camera className="w-6 h-6" />
                        )}
                      </div>
                      
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-white">
                          {cameraError.type === 'permission' 
                            ? 'Camera Permission Required' 
                            : cameraError.type === 'busy'
                            ? 'Camera in Use'
                            : 'Camera Setup Helper'}
                        </h4>
                        <p className="text-xs text-slate-300 max-w-xs leading-relaxed">
                          {cameraError.message}
                        </p>
                      </div>

                      {/* Diagnostic Actions */}
                      <div className="flex flex-col gap-2 w-full max-w-xs pt-1">
                        <button
                          type="button"
                          onClick={() => startCamera()}
                          className="w-full py-2 px-3 rounded-xl bg-[#d4f15d] hover:bg-[#bef264] active:scale-98 text-xs font-black text-slate-950 flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-all"
                        >
                          <RefreshCw className="w-3.5 h-3.5 text-slate-950" />
                          <span>Retry Camera Connection</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full py-2 px-3 rounded-xl bg-[#091e42] hover:bg-[#0f2e63] border border-sky-400/40 text-xs font-bold text-sky-300 flex items-center justify-center gap-2 cursor-pointer transition-all"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload Photo from Device</span>
                        </button>

                        <button
                          type="button"
                          onClick={loadSamplePortrait}
                          className="w-full py-2 px-3 rounded-xl bg-[#061226] hover:bg-[#0b1d3d] border border-slate-700 text-xs font-bold text-slate-300 hover:text-white flex items-center justify-center gap-2 cursor-pointer transition-all"
                        >
                          <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                          <span>Use Sample Studio Portrait</span>
                        </button>
                      </div>

                      {cameraError.type === 'permission' && (
                        <p className="text-[10px] text-slate-400 pt-1 flex items-center gap-1">
                          <HelpCircle className="w-3 h-3 text-sky-400" />
                          <span>Look for the lock icon in the browser address bar to enable camera</span>
                        </p>
                      )}
                    </div>
                  )}

                  {/* COMPOSITION GUIDES OVERLAY */}
                  {framingGuide === 'oval' && !cameraError && (
                    <div className="absolute inset-0 pointer-events-none z-20 flex flex-col items-center justify-center">
                      <div className="w-[62%] h-[68%] rounded-[50%] border-2 border-dashed border-amber-400/60 shadow-[0_0_15px_rgba(251,191,36,0.3)] flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-amber-400/70" />
                      </div>
                      <span className="text-[9px] font-mono font-bold text-amber-300/90 bg-black/60 px-2 py-0.5 rounded-full mt-2 backdrop-blur-sm">
                        ALIGN FACE & SHOULDERS FOR FLYER
                      </span>
                    </div>
                  )}

                  {framingGuide === 'grid' && !cameraError && (
                    <div className="absolute inset-0 pointer-events-none z-20 grid grid-cols-3 grid-rows-3 border border-white/20">
                      <div className="border-r border-b border-white/20" />
                      <div className="border-r border-b border-white/20" />
                      <div className="border-b border-white/20" />
                      <div className="border-r border-b border-white/20" />
                      <div className="border-r border-b border-white/20" />
                      <div className="border-b border-white/20" />
                      <div className="border-r border-white/20" />
                      <div className="border-r border-white/20" />
                      <div />
                    </div>
                  )}

                  {framingGuide === 'crosshair' && !cameraError && (
                    <div className="absolute inset-0 pointer-events-none z-20 flex items-center justify-center">
                      <div className="w-12 h-12 border border-sky-400/60 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-sky-400 rounded-full" />
                      </div>
                    </div>
                  )}

                  {/* Top Live Badge */}
                  {isCameraActive && (
                    <div className="absolute top-3 left-3 z-30 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-bold text-emerald-400">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      <span>STUDIO LIVE CAM</span>
                    </div>
                  )}
                </>
              )}

              {/* FROZEN CAPTURED IMAGE */}
              {capturedDataUrl && (
                <div className="relative w-full h-full">
                  <img
                    src={capturedDataUrl}
                    alt="Captured Studio Portrait"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 z-30 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/80 backdrop-blur-md border border-emerald-500/50 text-[10px] font-bold text-emerald-300 shadow-md">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>PORTRAIT READY</span>
                  </div>
                </div>
              )}
            </div>

            {/* In-View Controls Bar (Below Viewfinder) */}
            <div className="w-full max-w-md mt-3.5 flex items-center justify-between gap-2">
              {!capturedDataUrl ? (
                <>
                  {/* Flip / Mirror Button */}
                  <button
                    type="button"
                    onClick={() => {
                      sound.playPop();
                      setIsMirrored(!isMirrored);
                    }}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
                      isMirrored 
                        ? 'bg-blue-950 border-blue-500/50 text-sky-300' 
                        : 'bg-[#081733] border-slate-700 text-slate-400'
                    }`}
                    title="Mirror / Flip Selfie horizontally"
                  >
                    <FlipHorizontal className="w-4 h-4" />
                  </button>

                  {/* Switch Front/Rear Camera or Switch Camera Device */}
                  <button
                    type="button"
                    onClick={handleToggleFacingMode}
                    className="p-2.5 rounded-xl bg-[#081733] hover:bg-[#0c224c] border border-slate-700 text-slate-300 hover:text-white cursor-pointer transition-colors"
                    title="Switch Camera (Front/Rear/External)"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>

                  {/* Timer Selector (0, 3s, 5s, 10s) */}
                  <button
                    type="button"
                    onClick={() => {
                      sound.playPop();
                      setTimerDuration(prev => prev === 0 ? 3 : prev === 3 ? 5 : prev === 5 ? 10 : 0);
                    }}
                    className={`px-3 py-2 rounded-xl border text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                      timerDuration > 0
                        ? 'bg-amber-950/80 border-amber-500/60 text-amber-300'
                        : 'bg-[#081733] border-slate-700 text-slate-400'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>{timerDuration > 0 ? `${timerDuration}s` : 'Timer'}</span>
                  </button>

                  {/* Primary SHUTTER CAPTURE BUTTON */}
                  <button
                    type="button"
                    disabled={countdown !== null || isStartingCamera}
                    onClick={triggerCaptureFlow}
                    className="flex-1 py-2.5 sm:py-3 px-4 rounded-2xl bg-gradient-to-r from-[#d4f15d] via-[#bef264] to-[#a3e635] hover:brightness-110 active:scale-95 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(212,241,93,0.6)] cursor-pointer transition-all disabled:opacity-50"
                  >
                    <Camera className="w-4 h-4 text-slate-950" />
                    <span>{countdown !== null ? `Snapping in ${countdown}s...` : 'Take Studio Photo'}</span>
                  </button>
                </>
              ) : (
                /* Captured Actions */
                <div className="w-full flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleRetake}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-[#081733] hover:bg-[#0c224c] border border-slate-700 text-xs font-bold text-white flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                    <span>Retake / Restart Cam</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="py-2.5 px-3 rounded-xl bg-[#081733] hover:bg-[#0c224c] border border-slate-700 text-xs font-bold text-sky-300 hover:text-white flex items-center justify-center gap-1.5 cursor-pointer"
                    title="Upload Different Photo"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Change File</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDownload}
                    className="p-2.5 rounded-xl bg-[#081733] hover:bg-[#0c224c] border border-slate-700 text-xs font-bold text-slate-300 hover:text-white cursor-pointer"
                    title="Download High-Res PNG"
                  >
                    <Download className="w-4 h-4 text-sky-400" />
                  </button>
                </div>
              )}
            </div>

          </div>

          {/* ========================================================================= */}
          {/* RIGHT: PERFECT CAMERA SETTINGS & STUDIO ADJUSTMENTS PANEL                 */}
          {/* ========================================================================= */}
          <div className="lg:col-span-5 p-3.5 sm:p-5 bg-[#030919] flex flex-col justify-between space-y-4">
            
            <div className="space-y-3.5">
              
              {/* Multiple Camera Device Selector if available */}
              {availableDevices.length > 1 && !capturedDataUrl && (
                <div className="p-2.5 rounded-xl bg-[#061226] border border-slate-800 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-xs text-slate-300 font-bold">
                    <Video className="w-3.5 h-3.5 text-sky-400" />
                    <span>Active Camera:</span>
                  </div>
                  <select
                    value={selectedDeviceId}
                    onChange={(e) => {
                      setSelectedDeviceId(e.target.value);
                      startCamera(e.target.value);
                    }}
                    className="bg-[#081733] border border-slate-700 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-[#d4f15d]"
                  >
                    {availableDevices.map((d) => (
                      <option key={d.deviceId} value={d.deviceId}>
                        {d.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Tabs for Adjustment Categories */}
              <div className="grid grid-cols-4 gap-1 p-1 bg-[#061226] rounded-2xl border border-slate-800 text-[11px] font-bold">
                <button
                  type="button"
                  onClick={() => { sound.playPop(); setActiveTab('adjust'); }}
                  className={`py-1.5 rounded-xl transition-all cursor-pointer ${
                    activeTab === 'adjust' ? 'bg-[#d4f15d] text-slate-950 font-black shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Exposure
                </button>
                <button
                  type="button"
                  onClick={() => { sound.playPop(); setActiveTab('presets'); }}
                  className={`py-1.5 rounded-xl transition-all cursor-pointer ${
                    activeTab === 'presets' ? 'bg-[#d4f15d] text-slate-950 font-black shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Tone Looks
                </button>
                <button
                  type="button"
                  onClick={() => { sound.playPop(); setActiveTab('lighting'); }}
                  className={`py-1.5 rounded-xl transition-all cursor-pointer ${
                    activeTab === 'lighting' ? 'bg-[#d4f15d] text-slate-950 font-black shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Lighting
                </button>
                <button
                  type="button"
                  onClick={() => { sound.playPop(); setActiveTab('guides'); }}
                  className={`py-1.5 rounded-xl transition-all cursor-pointer ${
                    activeTab === 'guides' ? 'bg-[#d4f15d] text-slate-950 font-black shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Framing
                </button>
              </div>

              {/* TAB 1: EXPOSURE & SKIN SMOOTHING SLIDERS */}
              {activeTab === 'adjust' && (
                <div className="space-y-3 animate-in fade-in">
                  
                  {/* Skin Smoothing / Beauty Radiance */}
                  <div className="p-3 rounded-2xl bg-[#06142e] border border-[#d4f15d]/30 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-amber-300 flex items-center gap-1.5">
                        <Smile className="w-3.5 h-3.5 text-amber-400" />
                        <span>Beauty Skin Smooth & Radiance</span>
                      </span>
                      <span className="font-mono text-amber-400 font-bold">{skinSmooth}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={skinSmooth}
                      onChange={(e) => setSkinSmooth(Number(e.target.value))}
                      className="w-full accent-amber-400 cursor-pointer"
                    />
                    <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                      <span>Natural Sharp</span>
                      <span>Studio Glow</span>
                      <span>Airbrush Soft</span>
                    </div>
                  </div>

                  {/* Brightness / Exposure Slider */}
                  <div className="p-3 rounded-2xl bg-[#061226] border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                        <Sun className="w-3.5 h-3.5 text-amber-400" />
                        <span>Studio Brightness / Exposure</span>
                      </span>
                      <span className="font-mono text-slate-400 font-bold">{brightness}%</span>
                    </div>
                    <input
                      type="range"
                      min="70"
                      max="140"
                      value={brightness}
                      onChange={(e) => setBrightness(Number(e.target.value))}
                      className="w-full accent-[#d4f15d] cursor-pointer"
                    />
                  </div>

                  {/* Contrast Slider */}
                  <div className="p-3 rounded-2xl bg-[#061226] border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                        <Contrast className="w-3.5 h-3.5 text-blue-400" />
                        <span>Depth & Contrast Punch</span>
                      </span>
                      <span className="font-mono text-slate-400 font-bold">{contrast}%</span>
                    </div>
                    <input
                      type="range"
                      min="70"
                      max="150"
                      value={contrast}
                      onChange={(e) => setContrast(Number(e.target.value))}
                      className="w-full accent-blue-500 cursor-pointer"
                    />
                  </div>

                  {/* Warmth / Color Temperature Slider */}
                  <div className="p-3 rounded-2xl bg-[#061226] border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                        <Palette className="w-3.5 h-3.5 text-[#d4f15d]" />
                        <span>Warm / Cool Color Temp</span>
                      </span>
                      <span className="font-mono text-slate-400 font-bold">
                        {warmth > 0 ? `+${warmth} (Warm)` : warmth < 0 ? `${warmth} (Cool)` : 'Neutral'}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="-40"
                      max="40"
                      value={warmth}
                      onChange={(e) => setWarmth(Number(e.target.value))}
                      className="w-full accent-[#d4f15d] cursor-pointer"
                    />
                  </div>

                </div>
              )}

              {/* TAB 2: TONE LOOKS & PRESETS */}
              {activeTab === 'presets' && (
                <div className="grid grid-cols-2 gap-2 animate-in fade-in">
                  {[
                    { id: 'warm_golden', label: 'Golden Hour Glow', desc: 'Flattering warm skin tone', color: '#f59e0b' },
                    { id: 'neutral', label: 'Crisp Studio Neutral', desc: 'Accurate commercial color', color: '#38bdf8' },
                    { id: 'cool_led', label: 'Modern LED Punch', desc: 'Cool contrast & punch', color: '#06b6d4' },
                    { id: 'high_contrast', label: 'Editorial Poster', desc: 'Deep shadows, vibrant pop', color: '#ec4899' },
                    { id: 'vintage_glow', label: 'Soft Warm Vintage', desc: 'Gentle dream-like tone', color: '#bef264' },
                    { id: 'bw_studio', label: 'Monochrome High-Art', desc: 'Timeless black & white', color: '#94a3b8' }
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => applyPreset(p.id as TonePreset)}
                      className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer space-y-1 ${
                        activeTonePreset === p.id 
                          ? 'bg-[#0d264e] border-[#d4f15d] shadow-md ring-1 ring-[#d4f15d]' 
                          : 'bg-[#061226] border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">{p.label}</span>
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                      </div>
                      <p className="text-[10px] text-slate-400 line-clamp-1">{p.desc}</p>
                    </button>
                  ))}
                </div>
              )}

              {/* TAB 3: STUDIO LIGHTING & SCREEN FILL LIGHT */}
              {activeTab === 'lighting' && (
                <div className="space-y-3 animate-in fade-in">
                  <div className="p-3.5 rounded-2xl bg-[#06142e] border border-amber-500/30 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-amber-400" />
                        <span>Soft Screen Ring Light</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          sound.playPop();
                          setScreenRingLight(!screenRingLight);
                        }}
                        className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition-colors ${
                          screenRingLight ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {screenRingLight ? 'ON' : 'OFF'}
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-300">
                      Illuminates your face using soft screen borders — perfect for dim rooms and night shoots!
                    </p>

                    {screenRingLight && (
                      <div className="flex items-center gap-2 pt-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Light Hue:</span>
                        {(['warm', 'white', 'gold'] as const).map((color) => (
                          <button
                            key={color}
                            type="button"
                            onClick={() => { sound.playPop(); setRingLightColor(color); }}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold border capitalize cursor-pointer ${
                              ringLightColor === color 
                                ? 'bg-amber-500 border-amber-400 text-slate-950' 
                                : 'bg-[#081733] border-slate-700 text-slate-300'
                            }`}
                          >
                            {color}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Saturation Tuning */}
                  <div className="p-3 rounded-2xl bg-[#061226] border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-300">Color Vibrance & Saturation</span>
                      <span className="font-mono text-slate-400 font-bold">{saturation}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="150"
                      value={saturation}
                      onChange={(e) => setSaturation(Number(e.target.value))}
                      className="w-full accent-emerald-400 cursor-pointer"
                    />
                  </div>
                </div>
              )}

              {/* TAB 4: FRAMING GUIDES & ASPECT RATIO */}
              {activeTab === 'guides' && (
                <div className="space-y-3 animate-in fade-in">
                  
                  {/* Aspect Ratio Picker */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 block">
                      Target Artwork Aspect Ratio:
                    </label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {[
                        { id: '4:5', label: '4:5 Flyer', desc: 'Instagram / Poster' },
                        { id: '9:16', label: '9:16 Story', desc: 'Full Banner' },
                        { id: '1:1', label: '1:1 Square', desc: 'Feed / Badge' },
                        { id: '4:3', label: '4:3 Classic', desc: 'Landscape / ID' }
                      ].map((ratio) => (
                        <button
                          key={ratio.id}
                          type="button"
                          onClick={() => { sound.playPop(); setAspectRatio(ratio.id as AspectRatioMode); }}
                          className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                            aspectRatio === ratio.id 
                              ? 'bg-blue-900 border-sky-400 text-white font-bold' 
                              : 'bg-[#061226] border-slate-800 text-slate-400'
                          }`}
                        >
                          <div className="text-xs font-bold">{ratio.label}</div>
                          <div className="text-[9px] text-slate-500 truncate">{ratio.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Framing Overlay Picker */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 block">
                      Flyer Alignment Guide Overlay:
                    </label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {[
                        { id: 'oval', label: 'Face Oval' },
                        { id: 'grid', label: 'Rule of 3rds' },
                        { id: 'crosshair', label: 'Center Target' },
                        { id: 'none', label: 'Clean' }
                      ].map((guide) => (
                        <button
                          key={guide.id}
                          type="button"
                          onClick={() => { sound.playPop(); setFramingGuide(guide.id as FramingGuide); }}
                          className={`p-2 rounded-xl border text-center text-xs font-bold transition-all cursor-pointer ${
                            framingGuide === guide.id 
                              ? 'bg-amber-500 border-amber-400 text-slate-950' 
                              : 'bg-[#061226] border-slate-800 text-slate-400'
                          }`}
                        >
                          {guide.label}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              )}

            </div>

            {/* Bottom Actions Area (When Photo is Captured vs Live) */}
            <div className="pt-3 border-t border-slate-800 space-y-2">
              {capturedDataUrl ? (
                <>
                  <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center gap-2 text-xs text-emerald-300">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Portrait ready at 300 DPI pre-press calibration!</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {/* Attach to Flyer Order */}
                    <button
                      type="button"
                      onClick={handleAttachToOrder}
                      className="py-3 px-4 rounded-xl bg-[#d4f15d] hover:bg-[#bef264] text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg cursor-pointer transition-all hover:scale-[1.02]"
                    >
                      <ShoppingBag className="w-4 h-4 text-slate-950" />
                      <span>Attach to Flyer Order</span>
                    </button>

                    {/* Send to Retouch Desk */}
                    <button
                      type="button"
                      onClick={handleTransferToRetouchDesk}
                      className="py-3 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-[#d4f15d] font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
                    >
                      <Wand2 className="w-4 h-4 text-[#d4f15d]" />
                      <span>Retouch in Desk</span>
                    </button>
                  </div>

                  {/* Send to WhatsApp Direct */}
                  <button
                    type="button"
                    onClick={handleSendViaWhatsApp}
                    className="w-full py-2.5 px-3 rounded-xl bg-[#d4f15d] hover:bg-[#bef264] text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-md"
                  >
                    <Send className="w-3.5 h-3.5 text-slate-950" />
                    <span>Send Photo to Studio Desk</span>
                  </button>
                </>
              ) : (
                <div className="text-center space-y-1">
                  <p className="text-[11px] text-slate-400">
                    Align your head inside the guide and press <strong className="text-amber-400">Take Studio Photo</strong>.
                  </p>
                  <p className="text-[10px] text-slate-500">
                    You can also drag & drop or upload an existing photo at any time.
                  </p>
                </div>
              )}
            </div>

          </div>

        </div>
      </motion.div>

      {/* Retouched / Studio Selfie Photo Share Modal */}
      <RetouchedPhotoShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        imageDataUrl={capturedDataUrl}
        specificationsText={`• Studio Selfie Portrait\n• Aspect Ratio: ${aspectRatio}\n• Tone Preset: ${activeTonePreset}\n• Quality: 300 DPI Pre-Press Ready`}
        sourcePhotoName="studio_selfie_portrait.png"
      />

    </div>
  );
};
