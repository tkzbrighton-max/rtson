import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Wand2, 
  Upload, 
  Download, 
  MessageSquare, 
  Sparkles, 
  Sliders, 
  Eye, 
  RefreshCw, 
  CheckCircle2, 
  Sun, 
  Contrast, 
  ArrowRight, 
  ShieldCheck, 
  Maximize2, 
  Camera, 
  Play, 
  X, 
  Layers, 
  SlidersHorizontal,
  SplitSquareVertical,
  Check,
  Zap,
  Image as ImageIcon,
  RotateCw,
  Crop,
  Scissors
} from 'lucide-react';
import { sound } from '../lib/soundFx';

// Local high-fidelity portraits for demo & processing
import executivePortraitImg from '../assets/images/retouch_executive_portrait_1793783365483.jpg';
import speakerPortraitImg from '../assets/images/retouch_speaker_portrait_1793783365797.jpg';
import brightonPortraitImg from '../assets/images/brighton_founder_laptop_1790843148910.jpg';

// Direct path to the uploaded Aftershoot AI workflow reference image
const AFTERSHOOT_REFERENCE_IMG = '/assets/aistudio/The_AI-Powered_Photography_Workflow__What_to____b9008c00.jpeg';

interface RetouchDeskPageProps {
  onNavigate: (page: 'home' | 'about' | 'products' | 'retouch' | 'contact' | 'order') => void;
  onTransferToOrder?: (dataUrl: string, summary?: string) => void;
}

// Preset model definitions
interface ModelItem {
  id: string;
  name: string;
  label: string;
  originalSrc: string;
  retouchedSrc: string;
  specs: string;
}

const DEMO_MODELS: ModelItem[] = [
  {
    id: 'aftershoot_editorial',
    name: 'Elena Rostova',
    label: 'High-Fashion Editorial Model (Aftershoot Core)',
    originalSrc: AFTERSHOOT_REFERENCE_IMG,
    retouchedSrc: AFTERSHOOT_REFERENCE_IMG,
    specs: 'Studio Chiaroscuro • 300 DPI Pre-Press Ready'
  },
  {
    id: 'gospel_speaker',
    name: 'Apostle J. Makoni',
    label: 'Gospel Conference Keynote Speaker',
    originalSrc: speakerPortraitImg,
    retouchedSrc: speakerPortraitImg,
    specs: 'Volumetric Gold Rim Light • Non-Destructive Hair Mask'
  },
  {
    id: 'corporate_exec',
    name: 'Dr. T. Sithole',
    label: 'Corporate Executive Portrait',
    originalSrc: executivePortraitImg,
    retouchedSrc: executivePortraitImg,
    specs: 'Micro-Pore Skin Texture Retention • Balanced Key Light'
  },
  {
    id: 'studio_director',
    name: 'Brighton (Director)',
    label: 'Atelier Director Portrait',
    originalSrc: brightonPortraitImg,
    retouchedSrc: brightonPortraitImg,
    specs: 'Natural Lighting Harmonization • Studio Workstation'
  }
];

// Aftershoot lens ring icon
const AftershootLensRing: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none">
    <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="2.5" className="text-zinc-600" />
    <path 
      d="M16 2 A 14 14 0 0 1 30 16" 
      stroke="#ff6b00" 
      strokeWidth="3.5" 
      strokeLinecap="round" 
    />
    <path 
      d="M30 16 A 14 14 0 0 1 16 30" 
      stroke="#06b6d4" 
      strokeWidth="3.5" 
      strokeLinecap="round" 
    />
    <circle cx="16" cy="16" r="6" fill="#ff6b00" className="animate-pulse" />
  </svg>
);

export const RetouchDeskPage: React.FC<RetouchDeskPageProps> = ({ 
  onNavigate, 
  onTransferToOrder 
}) => {
  // Selected Model / Upload
  const [selectedModel, setSelectedModel] = useState<ModelItem>(DEMO_MODELS[0]);
  const [customUploadedImg, setCustomUploadedImg] = useState<string | null>(null);

  // View Mode: 'split' | 'side_by_side' | 'retouched' | 'original'
  const [viewMode, setViewMode] = useState<'split' | 'side_by_side' | 'retouched' | 'original'>('split');
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  // Before / After Split Position (0% to 100%)
  const [splitPos, setSplitPos] = useState<number>(50);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Inspector Sliders (faithful to Aftershoot right sidebar)
  const [skinSmoothing, setSkinSmoothing] = useState<number>(85);
  const [blemishRemoval, setBlemishRemoval] = useState<number>(90);
  const [frequencySeparation, setFrequencySeparation] = useState<number>(75);
  const [eyeBrightness, setEyeBrightness] = useState<number>(80);
  const [teethWhitening, setTeethWhitening] = useState<number>(70);
  const [lipHydration, setLipHydration] = useState<number>(65);
  const [hairFlyaways, setHairFlyaways] = useState<number>(85);
  const [studioRimLight, setStudioRimLight] = useState<number>(60);
  const [cmykCalibration, setCmykCalibration] = useState<number>(95);

  // Background Isolation Mode: 'original' | 'alpha' | 'charcoal' | 'stage_lights'
  const [bgMode, setBgMode] = useState<'original' | 'alpha' | 'charcoal' | 'stage_lights'>('original');

  // Success Feedback Toast
  const [feedbackMsg, setFeedbackMsg] = useState<string>('');

  const activeImageSrc = customUploadedImg || selectedModel.originalSrc;

  // Handle Dragging Split Line across portrait
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    updateSplitPosition(e.clientX);
  };

  const handlePointerMove = useCallback((e: PointerEvent) => {
    if (!isDragging) return;
    updateSplitPosition(e.clientX);
  }, [isDragging]);

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
    } else {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    }
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isDragging, handlePointerMove, handlePointerUp]);

  const updateSplitPosition = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setSplitPos(percentage);
  };

  // Preset Configurations
  const applyPreset = (presetName: string) => {
    sound.playClick();
    if (presetName === 'gospel') {
      setSkinSmoothing(90);
      setBlemishRemoval(95);
      setFrequencySeparation(85);
      setEyeBrightness(90);
      setTeethWhitening(85);
      setLipHydration(70);
      setStudioRimLight(85);
      setHairFlyaways(90);
      setCmykCalibration(100);
      setFeedbackMsg('Applied: Gospel Speaker 300 DPI Pre-Press Preset');
    } else if (presetName === 'corporate') {
      setSkinSmoothing(65);
      setBlemishRemoval(80);
      setFrequencySeparation(90);
      setEyeBrightness(60);
      setTeethWhitening(65);
      setLipHydration(50);
      setStudioRimLight(40);
      setHairFlyaways(75);
      setCmykCalibration(95);
      setFeedbackMsg('Applied: Corporate Executive Authentic Pore Retention');
    } else if (presetName === 'editorial') {
      setSkinSmoothing(95);
      setBlemishRemoval(98);
      setFrequencySeparation(80);
      setEyeBrightness(95);
      setTeethWhitening(90);
      setLipHydration(85);
      setStudioRimLight(70);
      setHairFlyaways(95);
      setCmykCalibration(90);
      setFeedbackMsg('Applied: High-Fashion Porcelain Frequency Separation');
    }
    setTimeout(() => setFeedbackMsg(''), 3500);
  };

  const handleResetSliders = () => {
    sound.playClick();
    setSkinSmoothing(85);
    setBlemishRemoval(90);
    setFrequencySeparation(75);
    setEyeBrightness(80);
    setTeethWhitening(70);
    setLipHydration(65);
    setHairFlyaways(85);
    setStudioRimLight(60);
    setCmykCalibration(95);
    setSplitPos(50);
    setFeedbackMsg('Reset adjustments to Aftershoot default balance.');
    setTimeout(() => setFeedbackMsg(''), 3000);
  };

  // Custom User Photo Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        sound.playSuccess();
        setCustomUploadedImg(result);
        setFeedbackMsg(`Uploaded custom photo: ${file.name}`);
        setTimeout(() => setFeedbackMsg(''), 3500);
      }
    };
    reader.readAsDataURL(file);
  };

  // Direct WhatsApp Commission (Zero personal phone number exposed)
  const handleSendToWhatsApp = () => {
    sound.playClick();
    const text = encodeURIComponent(
      `Hello R'tson Creations Studio Desk! I just calibrated a portrait in the Aftershoot AI Retouch Studio with specs:\n• Model: ${selectedModel.name}\n• Skin Smoothing: ${skinSmoothing}%\n• Eye Brightness: ${eyeBrightness}%\n• Studio Rim Light: ${studioRimLight}%\n• FOGRA39 CMYK Calibration: ${cmykCalibration}%\n\nPlease review and incorporate this retouched master into my flyer artwork.`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  // Transfer to Order Flow
  const handleTransferRetouch = () => {
    sound.playSuccess();
    if (onTransferToOrder) {
      onTransferToOrder(
        activeImageSrc,
        `Aftershoot AI Retouched Portrait (${selectedModel.name}) calibrated at ${skinSmoothing}% smoothing and ${cmykCalibration}% CMYK.`
      );
    } else {
      onNavigate('order');
    }
  };

  return (
    <div className="relative w-full min-h-screen overflow-x-hidden font-sans select-none bg-[#0e1117] text-white flex flex-col">
      
      {/* ========================================================================= */}
      {/* 0. AFTERSHOOT TOP PRO WORKFLOW STRIP (Figma Image 2)                       */}
      {/* Contains Aftershoot logo, Zoom, Image Count, AI Retouch indicator, & CTAs */}
      {/* ========================================================================= */}
      <header className="w-full bg-[#141822] border-b border-white/10 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs select-none sticky top-0 z-40">
        
        {/* Left: Brand & Core Navigation */}
        <div className="flex items-center gap-3 sm:gap-5">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('home')}>
            <AftershootLensRing className="w-6 h-6" />
            <div className="flex flex-col text-left">
              <span className="font-mono font-black text-sm tracking-tight text-white flex items-center gap-1.5">
                aftershoot <span className="text-[#ff6b00] text-[10px] uppercase font-bold tracking-widest bg-[#ff6b00]/15 px-1.5 py-0.2 rounded-xs">AI Core</span>
              </span>
              <span className="text-[9px] text-zinc-400 font-medium">R'tson Pre-Press Edition</span>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-2 pl-4 border-l border-white/10 text-zinc-400 text-[11px] font-mono">
            <span>Images: <strong className="text-white">24</strong></span>
            <span>&bull;</span>
            <span>Zoom: <strong className="text-white">{zoomLevel}%</strong></span>
          </div>

          {/* View Mode Switchers */}
          <div className="hidden sm:flex items-center gap-1 bg-[#1a202c] p-0.5 rounded-lg border border-white/10">
            <button
              type="button"
              onClick={() => setViewMode('split')}
              className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                viewMode === 'split' ? 'bg-[#ff6b00] text-black font-black' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Split View
            </button>
            <button
              type="button"
              onClick={() => setViewMode('side_by_side')}
              className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                viewMode === 'side_by_side' ? 'bg-[#ff6b00] text-black font-black' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Side-by-Side
            </button>
            <button
              type="button"
              onClick={() => setViewMode('retouched')}
              className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                viewMode === 'retouched' ? 'bg-[#ff6b00] text-black font-black' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Retouched
            </button>
          </div>
        </div>

        {/* Center: Rating stars & Color labels (Exact match to Aftershoot top strip) */}
        <div className="hidden md:flex items-center gap-2 font-mono text-[11px] text-zinc-400">
          <div className="flex items-center gap-1 text-amber-400">
            <span>★</span>
            <span className="text-white font-bold">5.0</span>
          </div>
          <span className="text-white/20">|</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" title="Color Label Red" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" title="Color Label Yellow" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" title="Color Label Green" />
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" title="Color Label Cyan" />
          </div>
          <span className="text-white/20">|</span>
          <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 font-bold text-[10px] border border-emerald-500/30">
            AI Retouch Ready
          </span>
        </div>

        {/* Right: Upload custom & Export Actions */}
        <div className="flex items-center gap-2">
          <label className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer border border-white/15 transition-colors">
            <Upload className="w-3.5 h-3.5 text-[#ff6b00]" />
            <span className="hidden sm:inline">Upload Photo</span>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileUpload} 
              className="hidden" 
            />
          </label>

          <button
            type="button"
            onClick={handleTransferRetouch}
            className="px-4 py-1.5 rounded-lg bg-[#ff6b00] hover:bg-[#ff7a00] text-black font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-[#ff6b00]/25 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span>Transfer to Order</span>
            <ArrowRight className="w-3.5 h-3.5 text-black" />
          </button>
        </div>

      </header>

      {/* Optional Feedback Toast */}
      {feedbackMsg && (
        <div className="w-full bg-[#ff6b00] text-black text-xs font-black py-1 px-4 text-center tracking-wide animate-fadeIn">
          {feedbackMsg}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. WORKBENCH: 2-COLUMN PRO RETOUCH DESK                                    */}
      {/* Left/Center: Interactive Split Slider Portrait Canvas                     */}
      {/* Right: Aftershoot Pro Inspector with sliders & subject detection          */}
      {/* ========================================================================= */}
      <div className="flex-1 w-full grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden">
        
        {/* ======================================================================= */}
        {/* LEFT / CENTER STAGE (8 to 9 cols): THE SPLIT SLIDER CANVAS             */}
        {/* ======================================================================= */}
        <div className="lg:col-span-8 xl:col-span-9 p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-between bg-[#0e1117] relative select-none">
          
          {/* Top Canvas Controls Bar */}
          <div className="w-full max-w-4xl flex items-center justify-between pb-3 text-xs text-zinc-400">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-300">Active Subject:</span>
              <span className="font-bold text-white bg-white/10 px-2.5 py-0.5 rounded-md">
                {customUploadedImg ? 'Custom User Upload' : selectedModel.name}
              </span>
              <span className="hidden sm:inline text-zinc-500 font-mono text-[10px]">
                ({selectedModel.specs})
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[11px] font-mono text-zinc-400 hidden sm:inline">
                Drag divider left &bull; right
              </span>
              <div className="flex items-center gap-1 bg-[#161b24] p-1 rounded-md border border-white/10">
                <button 
                  type="button" 
                  onClick={() => setZoomLevel(Math.max(75, zoomLevel - 15))}
                  className="px-2 py-0.5 hover:text-white font-mono font-bold"
                  title="Zoom Out"
                >
                  -
                </button>
                <span className="font-mono text-[10px] text-white px-1">{zoomLevel}%</span>
                <button 
                  type="button" 
                  onClick={() => setZoomLevel(Math.min(150, zoomLevel + 15))}
                  className="px-2 py-0.5 hover:text-white font-mono font-bold"
                  title="Zoom In"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* THE INTERACTIVE BEFORE / AFTER SPLIT VIEWER (Exact Match to Image 2) */}
          <div 
            ref={containerRef}
            onPointerDown={handlePointerDown}
            className="relative w-full max-w-3xl aspect-[4/3] sm:aspect-[16/10] md:aspect-[16/11] rounded-2xl overflow-hidden shadow-2xl border border-white/15 bg-black cursor-ew-resize group touch-none select-none"
            style={{
              transform: `scale(${zoomLevel / 100})`,
              transformOrigin: 'center center',
              transition: isDragging ? 'none' : 'transform 0.2s ease-out'
            }}
          >
            
            {/* 1. RETOUCHED LAYER (FULL BACKGROUND LAYER) */}
            <div className="absolute inset-0 w-full h-full">
              <img 
                src={activeImageSrc} 
                alt="Retouched Layer" 
                className="w-full h-full object-cover object-center"
                style={{
                  filter: `
                    contrast(${100 + eyeBrightness * 0.12}%)
                    brightness(${100 + studioRimLight * 0.08}%)
                    saturate(${100 + lipHydration * 0.15}%)
                  `
                }}
              />

              {/* High-frequency smoothing overlay simulating AI Aftershoot pore-retaining finish */}
              <div 
                className="absolute inset-0 pointer-events-none mix-blend-soft-light"
                style={{
                  backgroundColor: 'rgba(255, 230, 210, 0.15)',
                  opacity: skinSmoothing / 100
                }}
              />

              {/* Studio Rim Light Effect */}
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at 75% 30%, rgba(255,107,0,${studioRimLight * 0.0035}) 0%, transparent 60%)`
                }}
              />

              {/* Tag Label: AI Retouched Right */}
              <div className="absolute top-3 sm:top-4 right-3 sm:right-4 z-20 pointer-events-none">
                <span className="px-2.5 sm:px-3 py-1 rounded-full bg-emerald-500/90 text-black font-mono font-black text-[9px] sm:text-[10px] uppercase tracking-wider shadow-lg">
                  AI Retouched &bull; 300 DPI
                </span>
              </div>
            </div>

            {/* 2. ORIGINAL RAW LAYER (PERFECT 1:1 CLIPPED WITH GPU CLIP-PATH) */}
            <div 
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{
                clipPath: `inset(0 ${100 - splitPos}% 0 0)`
              }}
            >
              <img 
                src={activeImageSrc} 
                alt="Original Raw Layer" 
                className="w-full h-full object-cover object-center filter grayscale-[15%] contrast-95 brightness-95"
              />

              {/* Tag Label: Raw Original Left */}
              <div className="absolute top-3 sm:top-4 left-3 sm:left-4 z-20 pointer-events-none">
                <span className="px-2.5 sm:px-3 py-1 rounded-full bg-black/80 text-white font-mono font-bold text-[9px] sm:text-[10px] uppercase tracking-wider border border-white/20 backdrop-blur-xs">
                  Raw Original
                </span>
              </div>
            </div>

            {/* 3. SPLIT HANDLE LINE (Exact Red/Cyan Split from Image 2 with 48px touch target) */}
            <div 
              className="absolute top-0 bottom-0 z-30 pointer-events-none -translate-x-1/2 flex flex-col items-center justify-center"
              style={{ left: `${splitPos}%` }}
            >
              {/* Vertical line with cyan top & orange bottom gradient */}
              <div className="w-0.5 h-full bg-gradient-to-b from-[#06b6d4] via-white to-[#ff6b00] shadow-[0_0_10px_rgba(6,182,212,0.8)]" />

              {/* Center Handle Icon Circle (min 44px touch target) */}
              <div className="absolute w-10 h-10 sm:w-8 sm:h-8 rounded-full bg-[#141822] border-2 border-white text-white flex items-center justify-center shadow-2xl pointer-events-auto cursor-ew-resize hover:scale-110 active:scale-95 transition-transform touch-none">
                <SplitSquareVertical className="w-4 h-4 text-[#ff6b00]" />
              </div>
            </div>

          </div>

          {/* Model Selector Bar below canvas */}
          <div className="w-full max-w-4xl pt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest shrink-0">Demo Subjects:</span>
              {DEMO_MODELS.map((model) => (
                <button
                  key={model.id}
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setSelectedModel(model);
                    setCustomUploadedImg(null);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    selectedModel.id === model.id && !customUploadedImg
                      ? 'bg-[#ff6b00] text-black font-black shadow-md'
                      : 'bg-[#181d26] text-zinc-300 hover:text-white border border-white/10'
                  }`}
                >
                  {model.name}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={handleSendToWhatsApp}
              className="px-4 py-2 rounded-lg bg-[#25D366] hover:bg-[#20ba59] text-black font-black text-xs flex items-center gap-1.5 shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Direct WhatsApp Review</span>
            </button>
          </div>

        </div>

        {/* ======================================================================= */}
        {/* RIGHT INSPECTOR PANEL (3 to 4 cols): AFTERSHOOT PRO ADJUSTMENT CONTROLS  */}
        {/* ======================================================================= */}
        <aside className="lg:col-span-4 xl:col-span-3 bg-[#131720] border-l border-white/10 p-5 space-y-6 overflow-y-auto text-left select-none max-h-[calc(100vh-60px)]">
          
          {/* Inspector Header: Subject Selection */}
          <div className="border-b border-white/10 pb-4 space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-black text-white flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#ff6b00]" />
                <span>Subject Selection</span>
              </h2>
              <button 
                type="button" 
                onClick={handleResetSliders}
                className="text-[10px] font-mono font-bold text-zinc-400 hover:text-[#ff6b00] transition-colors cursor-pointer"
              >
                Reset
              </button>
            </div>
            
            {/* AI Detected Segments Badges */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="px-2 py-0.5 rounded-md bg-white/10 text-white font-mono text-[9px] font-bold flex items-center gap-1">
                <Check className="w-2.5 h-2.5 text-emerald-400" /> Face Detected
              </span>
              <span className="px-2 py-0.5 rounded-md bg-white/10 text-white font-mono text-[9px] font-bold flex items-center gap-1">
                <Check className="w-2.5 h-2.5 text-emerald-400" /> Eyes &amp; Teeth
              </span>
              <span className="px-2 py-0.5 rounded-md bg-white/10 text-white font-mono text-[9px] font-bold flex items-center gap-1">
                <Check className="w-2.5 h-2.5 text-emerald-400" /> Hair Boundary
              </span>
            </div>
          </div>

          {/* 1-Click Studio Presets */}
          <div className="space-y-2">
            <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-400">
              1-Click Aftershoot Presets
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => applyPreset('gospel')}
                className="p-2 rounded-lg bg-[#1a202c] hover:bg-[#ff6b00] hover:text-black border border-white/10 text-[10px] font-bold text-center transition-all cursor-pointer"
              >
                Gospel 3D
              </button>
              <button
                type="button"
                onClick={() => applyPreset('corporate')}
                className="p-2 rounded-lg bg-[#1a202c] hover:bg-[#ff6b00] hover:text-black border border-white/10 text-[10px] font-bold text-center transition-all cursor-pointer"
              >
                Corporate
              </button>
              <button
                type="button"
                onClick={() => applyPreset('editorial')}
                className="p-2 rounded-lg bg-[#1a202c] hover:bg-[#ff6b00] hover:text-black border border-white/10 text-[10px] font-bold text-center transition-all cursor-pointer"
              >
                Editorial
              </button>
            </div>
          </div>

          {/* Group 1: Complexion & Skin Smoothing */}
          <div className="space-y-3.5 pt-2 border-t border-white/10">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-300">
              Skin &amp; Complexion
            </span>

            {/* Skin Smoothing Slider */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-300">Skin Smoothing</span>
                <span className="font-mono text-[#ff6b00] font-bold">{skinSmoothing}%</span>
              </div>
              <input 
                type="range" 
                min={0} 
                max={100} 
                value={skinSmoothing}
                onChange={(e) => setSkinSmoothing(Number(e.target.value))}
                className="w-full accent-[#ff6b00] h-1.5 bg-neutral-700 rounded-lg"
              />
            </div>

            {/* Blemish Removal Slider */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-300">Blemish Removal</span>
                <span className="font-mono text-[#ff6b00] font-bold">{blemishRemoval}%</span>
              </div>
              <input 
                type="range" 
                min={0} 
                max={100} 
                value={blemishRemoval}
                onChange={(e) => setBlemishRemoval(Number(e.target.value))}
                className="w-full accent-[#ff6b00] h-1.5 bg-neutral-700 rounded-lg"
              />
            </div>

            {/* Frequency Separation Texture */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-300">Frequency Separation</span>
                <span className="font-mono text-[#ff6b00] font-bold">{frequencySeparation}%</span>
              </div>
              <input 
                type="range" 
                min={0} 
                max={100} 
                value={frequencySeparation}
                onChange={(e) => setFrequencySeparation(Number(e.target.value))}
                className="w-full accent-[#ff6b00] h-1.5 bg-neutral-700 rounded-lg"
              />
            </div>
          </div>

          {/* Group 2: Facial Features */}
          <div className="space-y-3.5 pt-2 border-t border-white/10">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-300">
              Facial Features
            </span>

            {/* Eye Brightening & Iris Boost */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-300">Eye Brightness &amp; Iris</span>
                <span className="font-mono text-[#ff6b00] font-bold">{eyeBrightness}%</span>
              </div>
              <input 
                type="range" 
                min={0} 
                max={100} 
                value={eyeBrightness}
                onChange={(e) => setEyeBrightness(Number(e.target.value))}
                className="w-full accent-[#ff6b00] h-1.5 bg-neutral-700 rounded-lg"
              />
            </div>

            {/* Teeth Whitening */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-300">Teeth Whitening</span>
                <span className="font-mono text-[#ff6b00] font-bold">{teethWhitening}%</span>
              </div>
              <input 
                type="range" 
                min={0} 
                max={100} 
                value={teethWhitening}
                onChange={(e) => setTeethWhitening(Number(e.target.value))}
                className="w-full accent-[#ff6b00] h-1.5 bg-neutral-700 rounded-lg"
              />
            </div>

            {/* Lip Hydration */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-300">Lip Hydration</span>
                <span className="font-mono text-[#ff6b00] font-bold">{lipHydration}%</span>
              </div>
              <input 
                type="range" 
                min={0} 
                max={100} 
                value={lipHydration}
                onChange={(e) => setLipHydration(Number(e.target.value))}
                className="w-full accent-[#ff6b00] h-1.5 bg-neutral-700 rounded-lg"
              />
            </div>
          </div>

          {/* Group 3: Lighting & Pre-Press Calibration */}
          <div className="space-y-3.5 pt-2 border-t border-white/10">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-300">
              Lighting &amp; Pre-Press
            </span>

            {/* Studio Rim Light */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-300">Studio Rim Glow</span>
                <span className="font-mono text-[#ff6b00] font-bold">{studioRimLight}%</span>
              </div>
              <input 
                type="range" 
                min={0} 
                max={100} 
                value={studioRimLight}
                onChange={(e) => setStudioRimLight(Number(e.target.value))}
                className="w-full accent-[#ff6b00] h-1.5 bg-neutral-700 rounded-lg"
              />
            </div>

            {/* CMYK FOGRA39 Tone Pass */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-300">FOGRA39 Press Pass</span>
                <span className="font-mono text-[#ff6b00] font-bold">{cmykCalibration}%</span>
              </div>
              <input 
                type="range" 
                min={0} 
                max={100} 
                value={cmykCalibration}
                onChange={(e) => setCmykCalibration(Number(e.target.value))}
                className="w-full accent-[#ff6b00] h-1.5 bg-neutral-700 rounded-lg"
              />
            </div>
          </div>

          {/* Bottom Execution Button */}
          <div className="pt-4 border-t border-white/10 space-y-2">
            <button
              type="button"
              onClick={handleTransferRetouch}
              className="w-full py-3 rounded-xl bg-[#ff6b00] hover:bg-[#ff7a00] text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#ff6b00]/30 transition-transform hover:scale-[1.02] active:scale-95 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 stroke-[3]" />
              <span>Use Portrait on Flyer</span>
            </button>

            <button
              type="button"
              onClick={handleSendToWhatsApp}
              className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#ff6b00]" />
              <span>Send Specs to Studio Desk</span>
            </button>
          </div>

        </aside>

      </div>

    </div>
  );
};
