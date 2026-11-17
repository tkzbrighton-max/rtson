import React, { useState, useRef } from 'react';
import { 
  Sliders, 
  Sparkles, 
  Wand2, 
  MessageSquare, 
  Mail,
  CheckCircle2, 
  ArrowRight, 
  Upload, 
  X, 
  Eye, 
  ShieldCheck 
} from 'lucide-react';
import { fastCompressImageFile } from '../lib/imageProcessing';
import { sound } from '../lib/soundFx';
import { RetouchedPhotoShareModal } from './RetouchedPhotoShareModal';

export interface RetouchShowcaseCatalogue {
  id: string;
  title: string;
  category: string;
  turnaround: string;
  price: string;
  description: string;
  highlights: string[];
}

export const RETOUCH_SHOWCASE_CATALOGUES: RetouchShowcaseCatalogue[] = [
  {
    id: 'church-speaker',
    title: 'Church Conference Speaker Retouch & 3D Typography',
    category: 'Church & Ministry',
    turnaround: '24 Hours',
    price: '$5.00',
    description: 'Raw smartphone speaker photo transformed into a high-impact, 300 DPI church conference flyer with studio lighting and 3D typography.',
    highlights: ['Skin Blemish Retouching & Studio Light Cutout', '3D Embossed Heading Composition', 'Cinematic Solid Atmosphere']
  },
  {
    id: 'club-event',
    title: 'Nightclub & Event Poster Color Grading',
    category: 'Events & Parties',
    turnaround: '12 Hours',
    price: '$4.50',
    description: 'Flat ambient DJ shot enhanced with vibrant lighting, lens flares, and high-energy club typography.',
    highlights: ['High-Contrast Glow Overlays', 'Dynamic Particle Dust & Flares', 'Eye-Catching Social Media Layout']
  },
  {
    id: 'corporate-brand',
    title: 'Executive Business Summit & Personal Branding',
    category: 'Corporate & Branding',
    turnaround: '24 Hours',
    price: '$5.00',
    description: 'Casual headshot elevated into an ultra-clean corporate seminar banner with premium minimalist typography.',
    highlights: ['Clean Neutral Studio Backdrop', 'Precision Text Hierarchy', 'Print-Ready Vector Alignment']
  },
  {
    id: 'background-removal',
    title: 'Transparent PNG Extraction & Edge Smoothing',
    category: 'Subject Extraction',
    turnaround: '6 Hours',
    price: '$3.50',
    description: 'High-precision background extraction with edge feathering and hair protection for products, people, or e-commerce.',
    highlights: ['Transparent Alpha PNG', 'Hair & Silhouette Preservation', 'Zero Artifact Border']
  },
  {
    id: 'clothes-shift',
    title: 'Wardrobe & Garment Attire Color Shifting',
    category: 'Fashion & Attire',
    turnaround: '8 Hours',
    price: '$4.00',
    description: 'Recolor shirts, suits, and dresses to match corporate guidelines or flyer color palettes while keeping realistic creases.',
    highlights: ['Realistic Folds & Shading', 'Targeted Mask Isolation', 'Studio Gamut Balancing']
  }
];

interface RetouchingShowcaseProps {
  onNavigate?: (page: 'home' | 'about' | 'products' | 'retouch' | 'contact' | 'order') => void;
  onSelectPhotoForRetouch?: (dataUrl: string) => void;
}

export const RetouchingShowcase: React.FC<RetouchingShowcaseProps> = ({
  onNavigate,
  onSelectPhotoForRetouch
}) => {
  const [activeTab, setActiveTab] = useState<string>('church-speaker');
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [uploadedPhoto, setUploadedPhoto] = useState<{ name: string; dataUrl: string } | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isDraggingOver, setIsDraggingOver] = useState<boolean>(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);

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
      let dataUrl = '';
      try {
        dataUrl = await fastCompressImageFile(file, 1200);
      } catch {
        const reader = new FileReader();
        dataUrl = await new Promise<string>((resolve) => {
          reader.onload = (e) => resolve((e.target?.result as string) || '');
          reader.onerror = () => resolve('');
          reader.readAsDataURL(file);
        });
      }

      if (dataUrl) {
        setUploadedPhoto({
          name: file.name,
          dataUrl
        });
        setActiveTab('custom-upload');
        setSliderPosition(50);
        sound.playSuccess();
      }
    } catch (err) {
      console.error('Failed to load showcase photo', err);
      sound.playPop();
    } finally {
      setIsUploading(false);
    }
  };

  const handleCustomUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await processIncomingFile(file);
      e.target.value = '';
    }
  };

  const currentCatalogue = RETOUCH_SHOWCASE_CATALOGUES.find(s => s.id === activeTab) || RETOUCH_SHOWCASE_CATALOGUES[0];

  const currentSample = uploadedPhoto
    ? {
        id: 'custom-upload',
        title: `Your Photo: ${uploadedPhoto.name}`,
        category: currentCatalogue.category,
        turnaround: currentCatalogue.turnaround,
        price: currentCatalogue.price,
        description: currentCatalogue.description,
        beforeLabel: 'Your Raw Photo',
        afterLabel: '300 DPI Studio Retouch',
        beforeImg: uploadedPhoto.dataUrl,
        afterImg: uploadedPhoto.dataUrl,
        highlights: currentCatalogue.highlights
      }
    : {
        id: currentCatalogue.id,
        title: currentCatalogue.title,
        category: currentCatalogue.category,
        turnaround: currentCatalogue.turnaround,
        price: currentCatalogue.price,
        description: currentCatalogue.description,
        beforeLabel: 'Raw Client Photo',
        afterLabel: '300 DPI Studio Output',
        beforeImg: '',
        afterImg: '',
        highlights: currentCatalogue.highlights
      };

  const handleSliderMove = (clientX: number, rect: DOMRect) => {
    const offsetX = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (offsetX / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (e.touches[0]) {
      handleSliderMove(e.touches[0].clientX, rect);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging || e.buttons === 1) {
      const rect = e.currentTarget.getBoundingClientRect();
      handleSliderMove(e.clientX, rect);
    }
  };

  return (
    <section id="before-after-section" className="py-6 sm:py-8 bg-transparent text-white">
      <div className="max-w-5xl mx-auto px-2 sm:px-4 space-y-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#d4f15d]">
            PHOTO RETOUCHING &amp; CUTOUTS
          </span>

          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Flawless Studio Finishing
          </h2>

          <p className="text-xs text-slate-300 max-w-md mx-auto">
            Select a catalogue or upload your photo to preview high-precision retouching and background removal.
          </p>

          {/* Retouch Catalogues Dropdown & Upload Action */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            
            {/* Catalogues Drop Down Option */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#d4f15d]">Catalogue:</span>
              <select
                value={activeTab}
                onChange={(e) => {
                  sound.playClick();
                  setActiveTab(e.target.value);
                }}
                className="px-3.5 py-2 rounded-xl bg-slate-900 text-white border border-white/20 text-xs font-bold cursor-pointer focus:outline-hidden focus:border-[#d4f15d] shadow-md"
              >
                {RETOUCH_SHOWCASE_CATALOGUES.map((cat) => (
                  <option key={cat.id} value={cat.id} className="bg-slate-900 text-white">
                    {cat.title} ({cat.price})
                  </option>
                ))}
              </select>
            </div>

            {/* Upload Button */}
            <button
              id="showcase-upload-photo-btn"
              onClick={() => {
                sound.playClick();
                fileInputRef.current?.click();
              }}
              className="px-3.5 py-2 rounded-xl bg-[#d4f15d] hover:bg-[#bef264] text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition-all active:scale-95"
              title="Upload your own photo"
            >
              <Upload className="w-3.5 h-3.5 text-slate-950" />
              <span>{uploadedPhoto ? 'Upload Another Photo' : 'Upload Photo'}</span>
            </button>
            <input
              ref={fileInputRef}
              id="showcase-photo-uploader"
              type="file"
              accept="image/*,image/png,image/jpeg,image/jpg,image/webp,image/heic,image/heif"
              onChange={handleCustomUpload}
              className="hidden"
            />

            {/* Custom Uploaded Badge */}
            {uploadedPhoto && (
              <div className="flex items-center rounded-xl bg-[#d4f15d]/20 border border-[#d4f15d]/60 pl-2.5 pr-1.5 py-1 text-xs">
                <span className="text-[#d4f15d] font-bold max-w-[120px] truncate mr-1.5">{uploadedPhoto.name}</span>
                <button
                  onClick={() => {
                    sound.playPop();
                    setUploadedPhoto(null);
                  }}
                  className="p-0.5 text-slate-300 hover:text-red-400 cursor-pointer"
                  title="Remove uploaded photo"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}

          </div>
        </div>

        {/* Main Transformation Container - Clean Minimalist Glass */}
        <div className="rounded-3xl bg-white/[0.03] border border-white/10 shadow-2xl backdrop-blur-xl overflow-hidden max-w-4xl mx-auto">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 sm:p-6 items-center">
            
            {/* Interactive Split Slider */}
            <div className="lg:col-span-7">
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDraggingOver(true);
                }}
                onDragLeave={() => setIsDraggingOver(false)}
                onDrop={async (e) => {
                  e.preventDefault();
                  setIsDraggingOver(false);
                  const file = e.dataTransfer.files?.[0];
                  if (file) {
                    await processIncomingFile(file);
                  }
                }}
                className={`relative aspect-[4/5] sm:aspect-square w-full max-w-sm mx-auto rounded-2xl overflow-hidden border select-none cursor-ew-resize bg-black/40 shadow-inner touch-none transition-all ${
                  isDraggingOver ? 'border-[#d4f15d] bg-[#d4f15d]/10 scale-[1.01]' : 'border-white/20'
                }`}
                onMouseDown={() => setIsDragging(true)}
                onMouseUp={() => setIsDragging(false)}
                onMouseLeave={() => setIsDragging(false)}
                onMouseMove={handleMouseMove}
                onTouchStart={() => setIsDragging(true)}
                onTouchEnd={() => setIsDragging(false)}
                onTouchMove={handleTouchMove}
              >
                {/* Drag Overlay */}
                {isDraggingOver && (
                  <div className="absolute inset-0 z-40 bg-black/90 backdrop-blur-sm border-2 border-dashed border-[#d4f15d] rounded-2xl flex flex-col items-center justify-center p-4 text-center pointer-events-none">
                    <Upload className="w-8 h-8 text-[#d4f15d] mb-2" />
                    <span className="text-xs font-bold text-white">Drop Photo Here to Compare</span>
                  </div>
                )}

                {/* Uploading Spinner */}
                {isUploading && (
                  <div className="absolute inset-0 z-40 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center pointer-events-none">
                    <Sparkles className="w-7 h-7 text-[#d4f15d] animate-spin mb-2" />
                    <span className="text-xs font-bold text-white">Optimizing photo...</span>
                  </div>
                )}

                {!uploadedPhoto ? (
                  <div className="w-full h-full min-h-[300px] flex flex-col items-center justify-center p-6 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-[#d4f15d]/15 border border-[#d4f15d]/40 text-[#d4f15d] flex items-center justify-center mb-3">
                      <Upload className="w-7 h-7" />
                    </div>
                    <h4 className="text-sm font-black text-white">No Photo Loaded</h4>
                    <p className="text-xs text-slate-300 max-w-xs mt-1 mb-4 leading-relaxed">
                      Upload your photo to test live studio retouching. As per your studio settings, no demo images are shown without upload.
                    </p>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 rounded-xl bg-[#d4f15d] hover:bg-[#bef264] text-slate-950 font-black text-xs flex items-center gap-2 cursor-pointer shadow-md"
                    >
                      <Upload className="w-4 h-4 text-slate-950" />
                      <span>Upload Photo to Test</span>
                    </button>
                  </div>
                ) : (
                  <>
                    {/* After Image */}
                    <img
                      src={uploadedPhoto.dataUrl}
                      alt="Studio Retouched Simulation"
                      style={{
                        filter: 'contrast(125%) brightness(108%) saturate(120%) drop-shadow(0 0 12px rgba(212, 241, 93, 0.45))',
                        transition: 'filter 0.2s ease'
                      }}
                      className="absolute inset-0 w-full h-full object-cover"
                    />

                    {/* Before Image */}
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
                        WebkitClipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`
                      }}
                    >
                      <img
                        src={uploadedPhoto.dataUrl}
                        alt="Your Raw Photo"
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      
                      {/* Left Label */}
                      <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-slate-200 text-[10px] font-bold border border-white/20 shadow">
                        Raw Photo
                      </span>
                    </div>

                    {/* Right Label */}
                    <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-[#d4f15d] text-slate-950 font-black text-[10px] shadow border border-[#bef264] pointer-events-none">
                      Retouched
                    </span>

                    {/* Slider Divider Line */}
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-white cursor-ew-resize z-20 shadow-md pointer-events-none"
                      style={{ left: `${sliderPosition}%` }}
                    >
                      <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-[#d4f15d] text-slate-950 border-2 border-slate-950 shadow-xl flex items-center justify-center pointer-events-auto">
                        <Sliders className="w-3 h-3 text-slate-950" />
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 px-4 font-mono">
                <span>↔ Drag slider to compare</span>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-[#d4f15d] hover:text-[#bef264] underline font-bold cursor-pointer"
                >
                  Upload your photo
                </button>
              </div>
            </div>

            {/* Breakdown & Highlights */}
            <div className="lg:col-span-5 space-y-3.5">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#d4f15d] block mb-0.5">
                  {currentSample.category}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  {currentSample.title}
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {currentSample.description}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 space-y-1.5 backdrop-blur-md">
                <span className="text-[11px] font-bold text-white block mb-1">
                  Deliverable Highlights:
                </span>
                {currentSample.highlights.map((h, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 text-xs text-slate-200">
                    <CheckCircle2 className="w-3 h-3 text-[#d4f15d] shrink-0" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>

              {/* Action CTAs */}
              <div className="space-y-2">
                {onNavigate && (
                  <button
                    onClick={() => {
                      sound.playClick();
                      if (uploadedPhoto && onSelectPhotoForRetouch) {
                        onSelectPhotoForRetouch(uploadedPhoto.dataUrl);
                      }
                      onNavigate('retouch');
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:brightness-110 text-white font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-black/40 active:scale-95"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Open in Full Studio Retouch Desk</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}

                <button
                  onClick={() => {
                    sound.playClick();
                    if (uploadedPhoto) {
                      setIsShareModalOpen(true);
                    } else {
                      window.location.href = `mailto:info@rtsoncreations.co.zw?subject=Photo%20Retouching%20Inquiry&body=${encodeURIComponent("Hello R'tson Creations Studio Desk,\n\nI have photos I need retouched and designed into a flyer.\n\nPlease find my requirements attached.\n\nThank you!")}`;
                    }
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#d4f15d] hover:bg-[#bef264] text-slate-950 font-black text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-black/40 active:scale-95"
                  title="Send photos to info@rtsoncreations.co.zw"
                >
                  <Mail className="w-3.5 h-3.5 text-slate-950" />
                  <span>Email Photos to <span className="lowercase font-mono">info@rtsoncreations.co.zw</span></span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-950" />
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>

      {uploadedPhoto && (
        <RetouchedPhotoShareModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          imageDataUrl={uploadedPhoto.dataUrl}
          specificationsText={`• Photo: ${uploadedPhoto.name}\n• Ready for Studio Retouch or Flyer Design`}
          sourcePhotoName={uploadedPhoto.name}
          onUseInOrder={() => {
            if (onSelectPhotoForRetouch) {
              onSelectPhotoForRetouch(uploadedPhoto.dataUrl);
            }
            onNavigate('order');
          }}
        />
      )}
    </section>
  );
};
