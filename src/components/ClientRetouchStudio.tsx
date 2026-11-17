import React, { useState, useRef, useEffect } from 'react';
import { 
  Sliders, 
  Sparkles, 
  Wand2, 
  Crop, 
  RotateCw, 
  Download, 
  Layers, 
  CheckCircle2, 
  RefreshCw, 
  Upload, 
  Eye, 
  SlidersHorizontal,
  Sun,
  Contrast,
  Palette,
  Scissors,
  Zap,
  Image as ImageIcon
} from 'lucide-react';
import { sound } from '../lib/soundFx';
import { fastCompressImageFile } from '../lib/imageProcessing';

export interface RetouchSettings {
  brightness: number; // 50 to 150 (default 100)
  contrast: number; // 50 to 150 (default 100)
  saturation: number; // 0 to 200 (default 100)
  goldGlow: number; // 0 to 100 (default 0)
  vintageWarmth: number; // 0 to 100 (default 0)
  vignette: boolean;
  sharpness: boolean;
  removeBgMode: 'none' | 'clean_studio' | 'black_stage' | 'gold_cyber' | 'transparent_grid';
  rotation: number; // 0, 90, 180, 270
}

const DEFAULT_SETTINGS: RetouchSettings = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  goldGlow: 0,
  vintageWarmth: 0,
  vignette: false,
  sharpness: false,
  removeBgMode: 'none',
  rotation: 0
};

const SAMPLE_PORTRAITS: { id: string; name: string; url: string }[] = [];

export interface ClientRetouchStudioProps {
  onApplyToOrder?: (retouchedImageDataUrl: string, settingsSummary: string) => void;
  className?: string;
}

export const ClientRetouchStudio: React.FC<ClientRetouchStudioProps> = ({
  onApplyToOrder,
  className = ''
}) => {
  const [currentImage, setCurrentImage] = useState<string>('');
  const [settings, setSettings] = useState<RetouchSettings>(DEFAULT_SETTINGS);
  const [activeTab, setActiveTab] = useState<'filters' | 'background' | 'preset'>('filters');
  const [isComparing, setIsComparing] = useState<boolean>(false);
  const [isProcessingBg, setIsProcessingBg] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isDraggingOver, setIsDraggingOver] = useState<boolean>(false);
  const [customUploaded, setCustomUploaded] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processIncomingFile = async (file: File) => {
    const isImage = file.type.startsWith('image/') || /\.(jpe?g|png|webp|gif|bmp|svg|tiff?|avif|heic|heif)$/i.test(file.name);
    if (!isImage) {
      alert('Please upload a valid image file (JPEG, PNG, WEBP, etc.).');
      return;
    }
    sound.playClick();
    setIsUploading(true);
    try {
      let compressedDataUrl = '';
      try {
        compressedDataUrl = await fastCompressImageFile(file, 1400);
      } catch (compErr) {
        console.warn('Fast compression failed, falling back to FileReader', compErr);
        const reader = new FileReader();
        compressedDataUrl = await new Promise<string>((resolve) => {
          reader.onload = (e) => resolve((e.target?.result as string) || '');
          reader.onerror = () => resolve('');
          reader.readAsDataURL(file);
        });
      }

      if (compressedDataUrl) {
        setCurrentImage(compressedDataUrl);
        setCustomUploaded(true);
        setSettings(prev => ({ ...prev, removeBgMode: 'none' }));
        sound.playSuccess();
      }
    } catch (err) {
      console.error('Error loading image', err);
      sound.playPop();
    } finally {
      setIsUploading(false);
    }
  };

  // Handle custom image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processIncomingFile(file);
      e.target.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processIncomingFile(file);
    }
  };

  // Preset Filters
  const applyPreset = (presetName: 'gospel_gold' | 'neon_cyber' | 'studio_clean' | 'vibrant_hdr' | 'reset') => {
    sound.playClick();
    if (presetName === 'reset') {
      setSettings(DEFAULT_SETTINGS);
      return;
    }

    if (presetName === 'gospel_gold') {
      setSettings({
        brightness: 110,
        contrast: 120,
        saturation: 125,
        goldGlow: 65,
        vintageWarmth: 40,
        vignette: true,
        sharpness: true,
        removeBgMode: 'gold_cyber',
        rotation: settings.rotation
      });
    } else if (presetName === 'neon_cyber') {
      setSettings({
        brightness: 115,
        contrast: 130,
        saturation: 150,
        goldGlow: 20,
        vintageWarmth: 0,
        vignette: true,
        sharpness: true,
        removeBgMode: 'black_stage',
        rotation: settings.rotation
      });
    } else if (presetName === 'studio_clean') {
      setSettings({
        brightness: 108,
        contrast: 112,
        saturation: 105,
        goldGlow: 0,
        vintageWarmth: 10,
        vignette: false,
        sharpness: true,
        removeBgMode: 'clean_studio',
        rotation: settings.rotation
      });
    } else if (presetName === 'vibrant_hdr') {
      setSettings({
        brightness: 112,
        contrast: 125,
        saturation: 140,
        goldGlow: 30,
        vintageWarmth: 20,
        vignette: true,
        sharpness: true,
        removeBgMode: 'none',
        rotation: settings.rotation
      });
    }
  };

  // Rotate photo 90 degrees
  const handleRotate = () => {
    sound.playClick();
    setSettings(prev => ({
      ...prev,
      rotation: (prev.rotation + 90) % 360
    }));
  };

  // Simulate Background extraction
  const handleBgModeSelect = (mode: RetouchSettings['removeBgMode']) => {
    sound.playSwoop();
    setIsProcessingBg(true);
    setTimeout(() => {
      setSettings(prev => ({ ...prev, removeBgMode: mode }));
      setIsProcessingBg(false);
    }, 280);
  };

  // Compute CSS filter style for real-time live preview
  const getFilterStyle = () => {
    if (isComparing) return {};
    const filters = [
      `brightness(${settings.brightness}%)`,
      `contrast(${settings.contrast}%)`,
      `saturate(${settings.saturation}%)`,
      settings.vintageWarmth > 0 ? `sepia(${settings.vintageWarmth * 0.4}%)` : '',
      settings.goldGlow > 0 ? `drop-shadow(0 0 ${settings.goldGlow * 0.25}px rgba(245, 158, 11, 0.45))` : ''
    ].filter(Boolean).join(' ');

    return {
      filter: filters,
      transform: `rotate(${settings.rotation}deg)`,
      transition: 'filter 0.2s ease, transform 0.3s ease'
    };
  };

  // Export retouched image to high-res canvas
  const handleExportOrAttach = () => {
    sound.playChime();
    const summary = `Filters: Brightness ${settings.brightness}%, Contrast ${settings.contrast}%, Saturation ${settings.saturation}%, Gold Glow ${settings.goldGlow}%, Background Mode: ${settings.removeBgMode}`;
    if (onApplyToOrder) {
      onApplyToOrder(currentImage, summary);
    }
  };

  return (
    <div className={`p-4 sm:p-6 rounded-2xl bg-[#061226] border border-[#1e3a8a]/50 text-white shadow-2xl space-y-5 ${className}`}>
      
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1e3a8a]/30 pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#d4f15d]/10 border border-[#d4f15d]/30 text-[11px] font-bold text-[#d4f15d]">
            <Wand2 className="w-3.5 h-3.5 text-[#d4f15d]" />
            <span>Interactive Client Photo Retouch Studio</span>
          </div>
          <h2 className="text-sm sm:text-base font-black text-white">
            Fine-Tune, Enhance & Stage Your Photo Before Ordering
          </h2>
        </div>

        {/* Quick Sample Selector & Upload */}
        <div className="flex items-center gap-2">
          <button
            id="client-studio-upload-btn"
            onClick={() => fileInputRef.current?.click()}
            className="px-3.5 py-1.5 rounded-xl bg-[#d4f15d] hover:bg-[#bef264] text-xs font-black text-slate-950 flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
          >
            <Upload className="w-3.5 h-3.5 text-slate-950" />
            <span>Upload Your Photo</span>
          </button>
          <input
            ref={fileInputRef}
            id="client-studio-photo-input"
            type="file"
            accept="image/*,image/png,image/jpeg,image/jpg,image/webp,image/heic,image/heif"
            onChange={handleImageUpload}
            className="hidden"
          />

          <button
            onClick={handleRotate}
            className="p-1.5 rounded-xl bg-[#091a38] border border-[#1e3a8a]/40 hover:text-[#d4f15d] text-slate-300 transition-colors"
            title="Rotate 90°"
          >
            <RotateCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Studio Body: Live Preview Left (7 Cols) + Control Sliders Right (5 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* Left: Interactive Canvas Preview */}
        <div className="lg:col-span-7 space-y-3">
          <div 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleFileDrop}
            className={`relative aspect-square sm:aspect-[4/3] rounded-2xl overflow-hidden bg-[#030812] border flex items-center justify-center group shadow-inner transition-all ${
              isDraggingOver ? 'border-[#d4f15d] bg-[#d4f15d]/10 scale-[1.01]' : 'border-[#1e3a8a]/60'
            }`}
          >
            {/* Drag & Drop Overlay */}
            {isDraggingOver && (
              <div className="absolute inset-0 z-40 bg-slate-950/80 backdrop-blur-sm border-2 border-dashed border-[#d4f15d] rounded-2xl flex flex-col items-center justify-center p-6 text-center animate-in fade-in">
                <div className="w-12 h-12 rounded-xl bg-[#d4f15d]/20 border border-[#d4f15d] flex items-center justify-center text-[#d4f15d] mb-2 shadow-sm">
                  <Upload className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-black text-white">Drop Photo Here</h4>
                <p className="text-[11px] text-[#d4f15d] mt-0.5">Instant studio loading</p>
              </div>
            )}

            {/* Instant Uploading Spinner */}
            {isUploading && (
              <div className="absolute inset-0 z-40 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center animate-in fade-in">
                <div className="w-10 h-10 rounded-xl bg-[#d4f15d]/20 border border-[#d4f15d] flex items-center justify-center text-[#d4f15d] mb-2 animate-spin">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-black text-white">Optimizing Photo...</h4>
              </div>
            )}
            
            {/* Background Stage Emulation */}
            {settings.removeBgMode === 'transparent_grid' && (
              <div 
                className="absolute inset-0 opacity-25 pointer-events-none"
                style={{
                  backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
                  backgroundSize: '16px 16px'
                }}
              />
            )}
            {settings.removeBgMode === 'clean_studio' && (
              <div className="absolute inset-0 bg-neutral-900 pointer-events-none" />
            )}
            {settings.removeBgMode === 'black_stage' && (
              <div className="absolute inset-0 bg-black pointer-events-none" />
            )}
            {settings.removeBgMode === 'gold_cyber' && (
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#d4f15d]/20 via-neutral-950 to-black pointer-events-none" />
            )}

            {/* Vignette Overlay */}
            {settings.vignette && !isComparing && (
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_40%,_rgba(0,0,0,0.8)_100%)] pointer-events-none z-10" />
            )}

            {/* Gold Particle Ambient Shimmer */}
            {settings.goldGlow > 30 && !isComparing && (
              <div className="absolute inset-0 bg-gradient-to-t from-[#d4f15d]/10 via-transparent to-transparent pointer-events-none z-10" />
            )}

            {/* The Main Rendered Image */}
            <img
              src={currentImage}
              alt="Client Retouch Preview"
              loading="eager"
              decoding="async"
              referrerPolicy="no-referrer"
              style={getFilterStyle()}
              className="max-h-full max-w-full object-contain relative z-0 transition-transform select-none"
            />

            {/* Processing Spinner */}
            {isProcessingBg && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-30">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#d4f15d] text-slate-950 text-xs font-black">
                  <Wand2 className="w-4 h-4" />
                  <span>Extracting & Balancing Subject...</span>
                </div>
              </div>
            )}

            {/* Hold to Compare Original Button */}
            <button
              type="button"
              onMouseDown={() => setIsComparing(true)}
              onMouseUp={() => setIsComparing(false)}
              onTouchStart={() => setIsComparing(true)}
              onTouchEnd={() => setIsComparing(false)}
              className="absolute bottom-3 left-3 z-20 px-3 py-1.5 rounded-xl bg-black/70 hover:bg-black/90 border border-white/20 text-white text-xs font-bold flex items-center gap-1.5 backdrop-blur-md cursor-pointer select-none transition-all"
            >
              <Eye className="w-3.5 h-3.5 text-[#d4f15d]" />
              <span>{isComparing ? 'Showing Original' : 'Hold to Compare'}</span>
            </button>

            {/* Live Indicator Top Right */}
            <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/80 border border-[#d4f15d]/40 text-[10px] font-bold text-[#d4f15d] backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-[#d4f15d]"></span>
              <span>LIVE RETOUCH 300 DPI</span>
            </div>
          </div>

          {/* Sample Swatches */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Try Samples:</span>
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {SAMPLE_PORTRAITS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    sound.playClick();
                    setCurrentImage(p.url);
                    setCustomUploaded(false);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
                    currentImage === p.url && !customUploaded
                      ? 'bg-[#d4f15d]/15 text-[#d4f15d] border-[#d4f15d]'
                      : 'bg-[#091a38] text-slate-300 border-[#1e3a8a]/40 hover:text-white'
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Studio Sliders & Stage Controls */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Preset Buttons */}
          <div className="space-y-1.5">
            <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
              <span>One-Click Studio Presets</span>
              <button onClick={() => applyPreset('reset')} className="text-[10px] text-[#d4f15d] hover:underline flex items-center gap-1">
                <RefreshCw className="w-2.5 h-2.5" />
                <span>Reset</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => applyPreset('gospel_gold')}
                className="p-2 rounded-xl bg-gradient-to-r from-amber-950/70 to-[#0e2752] border border-amber-500/40 text-amber-200 text-xs font-bold hover:scale-[1.02] transition-transform text-left cursor-pointer"
              >
                3D Gospel Gold
              </button>
              <button
                onClick={() => applyPreset('neon_cyber')}
                className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-slate-200 hover:border-[#d4f15d] hover:text-[#d4f15d] text-xs font-bold hover:scale-[1.02] transition-transform text-left cursor-pointer"
              >
                Neon Studio
              </button>
              <button
                onClick={() => applyPreset('studio_clean')}
                className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-slate-200 hover:border-[#d4f15d] hover:text-[#d4f15d] text-xs font-bold hover:scale-[1.02] transition-transform text-left cursor-pointer"
              >
                Clean Executive
              </button>
              <button
                onClick={() => applyPreset('vibrant_hdr')}
                className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-slate-200 hover:border-[#d4f15d] hover:text-[#d4f15d] text-xs font-bold hover:scale-[1.02] transition-transform text-left cursor-pointer"
              >
                Vibrant HDR
              </button>
            </div>
          </div>

          {/* Sliders Area in Black, White, and Lime */}
          <div className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800 space-y-3">
            
            {/* Brightness Slider */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <Sun className="w-3.5 h-3.5 text-[#d4f15d]" />
                  <span>Brightness</span>
                </span>
                <span className="font-mono text-[#d4f15d]">{settings.brightness}%</span>
              </div>
              <input
                type="range"
                min="60"
                max="140"
                value={settings.brightness}
                onChange={(e) => {
                  sound.playHover();
                  setSettings(s => ({ ...s, brightness: Number(e.target.value) }));
                }}
                className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-[#d4f15d]"
              />
            </div>

            {/* Contrast Slider */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <Contrast className="w-3.5 h-3.5 text-[#d4f15d]" />
                  <span>Contrast</span>
                </span>
                <span className="font-mono text-[#d4f15d]">{settings.contrast}%</span>
              </div>
              <input
                type="range"
                min="70"
                max="150"
                value={settings.contrast}
                onChange={(e) => {
                  sound.playHover();
                  setSettings(s => ({ ...s, contrast: Number(e.target.value) }));
                }}
                className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-[#d4f15d]"
              />
            </div>

            {/* Saturation Slider */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-[#d4f15d]" />
                  <span>Color Saturation</span>
                </span>
                <span className="font-mono text-[#d4f15d]">{settings.saturation}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="180"
                value={settings.saturation}
                onChange={(e) => {
                  sound.playHover();
                  setSettings(s => ({ ...s, saturation: Number(e.target.value) }));
                }}
                className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-[#d4f15d]"
              />
            </div>

            {/* 3D Gold / Metallic Sheen */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>3D Gold Rim Light</span>
                </span>
                <span className="font-mono text-amber-400">{settings.goldGlow}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={settings.goldGlow}
                onChange={(e) => {
                  sound.playHover();
                  setSettings(s => ({ ...s, goldGlow: Number(e.target.value) }));
                }}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
            </div>

          </div>

          {/* Background Staging Options */}
          <div className="space-y-1.5">
            <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Scissors className="w-3.5 h-3.5 text-[#d4f15d]" />
              <span>Background Extraction Mode</span>
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: 'none', label: 'Original Backdrop' },
                { id: 'clean_studio', label: 'Studio Neutral' },
                { id: 'black_stage', label: 'Obsidian Black' },
                { id: 'gold_cyber', label: 'Heavenly Amber' },
              ].map((bg) => (
                <button
                  key={bg.id}
                  onClick={() => handleBgModeSelect(bg.id as any)}
                  className={`p-2 rounded-xl text-xs font-semibold text-left transition-all border cursor-pointer ${
                    settings.removeBgMode === bg.id
                      ? 'bg-[#d4f15d]/15 text-[#d4f15d] border-[#d4f15d] shadow-sm'
                      : 'bg-neutral-900 text-slate-300 border-neutral-800 hover:border-[#d4f15d] hover:text-white'
                  }`}
                >
                  {bg.label}
                </button>
              ))}
            </div>
          </div>

          {/* Action CTA */}
          {onApplyToOrder && (
            <button
              type="button"
              onClick={handleExportOrAttach}
              className="w-full py-3 px-4 rounded-xl bg-[#d4f15d] hover:bg-[#bef264] text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#d4f15d]/20 cursor-pointer transition-all hover:scale-[1.02]"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Attach Retouched Specs To Order</span>
            </button>
          )}

        </div>

      </div>

    </div>
  );
};
