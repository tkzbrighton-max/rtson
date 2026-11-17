import React, { useState, useRef } from 'react';
import { 
  Camera, 
  UploadCloud, 
  Wand2, 
  Trash2, 
  Eye, 
  Download, 
  CheckCircle2, 
  Sparkles, 
  Sliders, 
  Image as ImageIcon, 
  Info, 
  User, 
  ShieldCheck, 
  FileText, 
  X, 
  ZoomIn, 
  RotateCw,
  Plus,
  Layers,
  QrCode
} from 'lucide-react';
import { sound } from '../lib/soundFx';
import { AttachedOrderPhoto } from '../types';
import samplePortraitImg from '../assets/images/real_church_flyer_1787906566871.jpg';

export interface OrderPhotoAttachmentManagerProps {
  photos: AttachedOrderPhoto[];
  onAddPhotos: (newPhotos: AttachedOrderPhoto[]) => void;
  onUpdatePhoto: (id: string, updates: Partial<AttachedOrderPhoto>) => void;
  onRemovePhoto: (id: string) => void;
  onOpenSelfieCamera?: () => void;
  onOpenRetouchStudio?: () => void;
  onOpenQRGenerator?: () => void;
  onEditInRetouchDesk?: (dataUrl: string) => void;
  className?: string;
  themeColorHex?: string;
}

const PHOTO_ROLE_OPTIONS: { id: AttachedOrderPhoto['role']; label: string; description: string }[] = [
  { id: 'main_speaker', label: 'Main Speaker / Minister', description: 'Hero cutout for flyer centerpiece' },
  { id: 'guest_minister', label: 'Guest Minister / Preacher', description: 'Supporting speaker cutout' },
  { id: 'host', label: 'Host / MC / Moderator', description: 'Host portrait or convenor' },
  { id: 'artist', label: 'Artist / Musician / Performer', description: 'Musical guest or performer' },
  { id: 'logo', label: 'Church / Company Logo', description: 'Vector / PNG logo emblem' },
  { id: 'qr_code', label: 'Event QR Code / Link', description: 'Scannable registration, ticket or GPS code' },
  { id: 'reference', label: 'Design Reference / Style Sample', description: 'Inspiration or preferred layout' },
  { id: 'background', label: 'Background / Venue Photo', description: 'Building, stage, or texture' },
  { id: 'studio_selfie', label: 'Studio Live Selfie', description: 'Calibrated live webcam portrait' },
  { id: 'other', label: 'Other Artwork Asset', description: 'Sponsor logo, badge or graphic' },
];

export const OrderPhotoAttachmentManager: React.FC<OrderPhotoAttachmentManagerProps> = ({
  photos,
  onAddPhotos,
  onUpdatePhoto,
  onRemovePhoto,
  onOpenSelfieCamera,
  onOpenRetouchStudio,
  onOpenQRGenerator,
  onEditInRetouchDesk,
  className = '',
  themeColorHex = '#d4f15d'
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [lightboxPhoto, setLightboxPhoto] = useState<AttachedOrderPhoto | null>(null);
  const [lightboxZoom, setLightboxZoom] = useState(1);
  const [lightboxRotation, setLightboxRotation] = useState(0);
  const [isReadingFiles, setIsReadingFiles] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Convert uploaded files to AttachedOrderPhoto objects
  const processFiles = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;
    sound.playClick();
    setIsReadingFiles(true);

    const newPhotoPromises: Promise<AttachedOrderPhoto>[] = Array.from(files).map((file, idx) => {
      return new Promise((resolve) => {
        const sizeBytes = file.size;
        let sizeFormatted = `${(sizeBytes / 1024).toFixed(1)} KB`;
        if (sizeBytes >= 1024 * 1024) {
          sizeFormatted = `${(sizeBytes / (1024 * 1024)).toFixed(2)} MB`;
        }

        let defaultRole: AttachedOrderPhoto['role'] = 'main_speaker';
        const lowerName = file.name.toLowerCase();
        if (lowerName.includes('logo')) defaultRole = 'logo';
        else if (lowerName.includes('guest') || lowerName.includes('pastor')) defaultRole = 'guest_minister';
        else if (lowerName.includes('host') || lowerName.includes('mc')) defaultRole = 'host';
        else if (lowerName.includes('ref') || lowerName.includes('sample')) defaultRole = 'reference';
        else if (lowerName.includes('bg') || lowerName.includes('venue')) defaultRole = 'background';
        else if (photos.length > 0) defaultRole = 'guest_minister';

        const roleOption = PHOTO_ROLE_OPTIONS.find(r => r.id === defaultRole);

        const reader = new FileReader();
        reader.onload = (e) => {
          const dataUrl = (e.target?.result as string) || '';
          const img = new Image();
          img.onload = () => {
            resolve({
              id: `photo_${Date.now()}_${idx}_${Math.random().toString(36).slice(2, 7)}`,
              name: file.name,
              dataUrl,
              sizeBytes,
              sizeFormatted,
              type: file.type || 'image/jpeg',
              role: defaultRole,
              roleLabel: roleOption ? roleOption.label : 'Main Speaker / Minister',
              instructions: '',
              retouchRequested: true,
              dimensions: { width: img.width, height: img.height },
              uploadedAt: new Date().toISOString()
            });
          };
          img.onerror = () => {
            resolve({
              id: `photo_${Date.now()}_${idx}_${Math.random().toString(36).slice(2, 7)}`,
              name: file.name,
              dataUrl,
              sizeBytes,
              sizeFormatted,
              type: file.type || 'image/jpeg',
              role: defaultRole,
              roleLabel: roleOption ? roleOption.label : 'Main Speaker / Minister',
              instructions: '',
              retouchRequested: true,
              uploadedAt: new Date().toISOString()
            });
          };
          img.src = dataUrl;
        };
        reader.onerror = () => {
          resolve({
            id: `photo_${Date.now()}_${idx}_${Math.random().toString(36).slice(2, 7)}`,
            name: file.name,
            dataUrl: '',
            sizeBytes,
            sizeFormatted,
            type: file.type || 'image/jpeg',
            role: defaultRole,
            roleLabel: 'Main Speaker / Minister',
            instructions: '',
            retouchRequested: true,
            uploadedAt: new Date().toISOString()
          });
        };
        reader.readAsDataURL(file);
      });
    });

    const resolvedPhotos = await Promise.all(newPhotoPromises);
    onAddPhotos(resolvedPhotos);
    setIsReadingFiles(false);
    sound.playSuccess();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
    // Reset value so same file can be uploaded again if needed
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Add sample studio portrait
  const handleAddSamplePortrait = () => {
    sound.playClick();
    const samplePhoto: AttachedOrderPhoto = {
      id: `photo_sample_${Date.now()}`,
      name: 'sample_speaker_portrait.jpg',
      dataUrl: samplePortraitImg,
      sizeBytes: 1420000,
      sizeFormatted: '1.42 MB',
      type: 'image/jpeg',
      role: 'main_speaker',
      roleLabel: 'Main Speaker / Minister',
      instructions: 'Extract background, smooth skin tones, and place on right side of flyer with 3D spotlight.',
      retouchRequested: true,
      dimensions: { width: 1200, height: 1600 },
      uploadedAt: new Date().toISOString()
    };
    onAddPhotos([samplePhoto]);
    sound.playSuccess();
  };

  // Download attached photo
  const handleDownloadPhoto = (photo: AttachedOrderPhoto) => {
    sound.playClick();
    const a = document.createElement('a');
    a.href = photo.dataUrl;
    a.download = photo.name || 'attached_studio_photo.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const totalBytes = photos.reduce((acc, p) => acc + (p.sizeBytes || 0), 0);
  let totalFormattedSize = `${(totalBytes / 1024).toFixed(1)} KB`;
  if (totalBytes >= 1024 * 1024) {
    totalFormattedSize = `${(totalBytes / (1024 * 1024)).toFixed(2)} MB`;
  }

  return (
    <div className={`space-y-4 ${className}`}>
      
      {/* Header & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#06142e] border border-[#1e3a8a]/70">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-[#d4f15d]" />
            <h3 className="text-xs sm:text-sm font-black text-white uppercase tracking-wider">
              Attach Photos, Speaker Cutouts & Logos
            </h3>
            {photos.length > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-[#d4f15d]/15 border border-[#d4f15d]/40 text-[#d4f15d] text-[10px] font-bold">
                {photos.length} Attached ({totalFormattedSize})
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-300">
            Attach raw minister photos, logos, and references. Free background removal & 3D tone calibration included with every order.
          </p>
        </div>

        {/* Quick Launchers */}
        <div className="flex flex-wrap items-center gap-2">
          {onOpenQRGenerator && (
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onOpenQRGenerator();
              }}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:brightness-110 text-slate-950 text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-md shadow-amber-950/40 active:scale-95 transition-all"
              title="Generate a custom flyer QR Code for registration, livestream, or tickets"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Event QR Code Studio</span>
            </button>
          )}

          {onOpenSelfieCamera && (
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onOpenSelfieCamera();
              }}
              className="px-3 py-1.5 rounded-xl bg-[#d4f15d] hover:bg-[#bef264] text-slate-950 text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-md shadow-black/40 active:scale-95 transition-all"
              title="Take a live calibrated webcam portrait for your flyer"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Studio Selfie Cam</span>
            </button>
          )}

          {onOpenRetouchStudio && (
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onOpenRetouchStudio();
              }}
              className="px-2.5 py-1.5 rounded-xl bg-[#d4f15d]/15 hover:bg-[#d4f15d]/25 border border-[#d4f15d]/40 text-[#d4f15d] hover:text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Wand2 className="w-3.5 h-3.5 text-[#d4f15d]" />
              <span>Retouch Studio</span>
            </button>
          )}
        </div>
      </div>

      {/* Free Retouching Commitment Banner */}
      <div className="p-3 rounded-xl bg-neutral-950 border border-[#d4f15d]/30 flex items-start gap-2.5 text-[11px] text-slate-300">
        <CheckCircle2 className="w-4 h-4 text-[#d4f15d] shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-bold text-white">
            Complimentary Studio Background Cutout & Lighting Retouching Included:
          </span>
          <p className="text-slate-300">
            You do not need to worry about un-retouched or cluttered camera backgrounds. Our studio will isolate the subject, enhance skin tones, balance color temperatures, and place them seamlessly into the 3D flyer layout.
          </p>
        </div>
      </div>

      {/* Drag & Drop / Upload Dropzone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative border-2 border-dashed rounded-2xl p-5 text-center transition-all ${
          isDragging
            ? 'border-[#d4f15d] bg-[#d4f15d]/10 scale-[1.01]'
            : 'border-[#d4f15d]/40 hover:border-[#d4f15d]/80 bg-neutral-950'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,.pdf"
          onChange={handleFileInputChange}
          className="hidden"
          id="order-photos-file-input"
        />

        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-[#d4f15d]/15 border border-[#d4f15d]/40 flex items-center justify-center text-[#d4f15d] shadow-md">
            {isReadingFiles ? (
              <RotateCw className="w-5 h-5 animate-spin" />
            ) : (
              <UploadCloud className="w-5 h-5" />
            )}
          </div>

          <div>
            <div className="text-xs sm:text-sm font-bold text-white flex items-center justify-center gap-1.5">
              <span>Drag & drop photos here, or</span>
              <label
                htmlFor="order-photos-file-input"
                className="text-[#d4f15d] underline hover:text-[#bef264] cursor-pointer font-black"
              >
                browse files
              </label>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Supports high-resolution PNG, JPG, WEBP, HEIC, TIFF & PDF (Multiple files supported)
            </p>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <label
              htmlFor="order-photos-file-input"
              className="px-3.5 py-1.5 rounded-xl bg-[#d4f15d] hover:bg-[#bef264] text-slate-950 text-xs font-black cursor-pointer shadow transition-transform active:scale-95 flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Select Photos & Logos</span>
            </label>

            <button
              type="button"
              onClick={handleAddSamplePortrait}
              className="px-2.5 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-slate-200 hover:text-white text-[11px] font-bold cursor-pointer transition-colors"
            >
              + Add Sample Speaker Photo
            </button>
          </div>
        </div>
      </div>

      {/* Attached Photos List / Cards */}
      {photos.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#d4f15d]" />
              <span>Attached Photos & Assets ({photos.length})</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              Configure photo roles & placement notes below
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {photos.map((photo, index) => {
              const currentRole = PHOTO_ROLE_OPTIONS.find(r => r.id === photo.role) || PHOTO_ROLE_OPTIONS[0];

              return (
                <div
                  key={photo.id}
                  className="p-3.5 rounded-2xl bg-[#081838] border border-[#1e3a8a]/80 hover:border-[#d4f15d]/60 transition-all space-y-3 relative group"
                >
                  {/* Photo Top Header: Thumbnail + File Info + Action Buttons */}
                  <div className="flex items-start gap-3">
                    
                    {/* Thumbnail Preview with Lightbox Trigger */}
                    <div 
                      onClick={() => {
                        sound.playClick();
                        setLightboxPhoto(photo);
                        setLightboxZoom(1);
                        setLightboxRotation(0);
                      }}
                      className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-black/60 border border-white/10 shrink-0 cursor-pointer group/thumb shadow-inner"
                      title="Click to inspect photo in high-resolution lightbox"
                    >
                      {photo.dataUrl ? (
                        <img
                          src={photo.dataUrl}
                          alt={photo.name}
                          className="w-full h-full object-cover transition-transform group-hover/thumb:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-500">
                          <ImageIcon className="w-6 h-6" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center text-white">
                        <ZoomIn className="w-4 h-4" />
                      </div>
                      <span className="absolute bottom-1 right-1 px-1 py-0.2 rounded bg-black/80 text-[8px] font-mono text-slate-300">
                        #{index + 1}
                      </span>
                    </div>

                    {/* File Details & Role */}
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div className="flex items-start justify-between gap-1">
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-white truncate" title={photo.name}>
                            {photo.name}
                          </div>
                          <div className="text-[10px] text-slate-400 flex items-center gap-1.5">
                            <span className="font-mono text-emerald-400">{photo.sizeFormatted}</span>
                            {photo.dimensions && (
                              <>
                                <span>•</span>
                                <span>{photo.dimensions.width}×{photo.dimensions.height}px</span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Top Action Buttons */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              sound.playClick();
                              setLightboxPhoto(photo);
                              setLightboxZoom(1);
                              setLightboxRotation(0);
                            }}
                            className="p-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
                            title="Zoom & Preview Full Photo"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDownloadPhoto(photo)}
                            className="p-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
                            title="Download this photo"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              sound.playPop();
                              onRemovePhoto(photo.id);
                            }}
                            className="p-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-slate-400 hover:text-[#d4f15d] transition-colors cursor-pointer"
                            title="Remove photo"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Photo Role Selector Dropdown */}
                      <div>
                        <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                          Photo Purpose / Role:
                        </label>
                        <select
                          value={photo.role}
                          onChange={(e) => {
                            sound.playClick();
                            const newRole = e.target.value as AttachedOrderPhoto['role'];
                            const matched = PHOTO_ROLE_OPTIONS.find(r => r.id === newRole);
                            onUpdatePhoto(photo.id, {
                              role: newRole,
                              roleLabel: matched ? matched.label : newRole
                            });
                          }}
                          className="w-full px-2.5 py-1 rounded-lg bg-neutral-900 border border-neutral-700 text-xs font-bold text-[#d4f15d] focus:outline-none focus:border-[#d4f15d] cursor-pointer"
                        >
                          {PHOTO_ROLE_OPTIONS.map((opt) => (
                            <option key={opt.id} value={opt.id}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                  </div>

                  {/* Retouching Toggle & Custom Instruction Note */}
                  <div className="pt-2 border-t border-neutral-800 space-y-2">
                    
                    <div className="flex items-center justify-between text-[11px]">
                      <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 hover:text-white select-none">
                        <input
                          type="checkbox"
                          checked={photo.retouchRequested ?? true}
                          onChange={(e) => {
                            sound.playClick();
                            onUpdatePhoto(photo.id, { retouchRequested: e.target.checked });
                          }}
                          className="w-3.5 h-3.5 rounded accent-[#d4f15d] cursor-pointer"
                        />
                        <span className="font-semibold text-[#d4f15d]">Complimentary Background Removal & 3D Lighting</span>
                      </label>

                      {onEditInRetouchDesk && photo.dataUrl && (
                        <button
                          type="button"
                          onClick={() => onEditInRetouchDesk(photo.dataUrl)}
                          className="text-[10px] text-[#d4f15d] hover:text-[#bef264] font-bold underline cursor-pointer"
                        >
                          Tune in Desk →
                        </button>
                      )}
                    </div>

                    {/* Custom Placement & Retouch Note Field */}
                    <div>
                      <input
                        type="text"
                        value={photo.instructions || ''}
                        onChange={(e) => onUpdatePhoto(photo.id, { instructions: e.target.value })}
                        placeholder="Specific instructions: e.g. 'Crop from waist up', 'Place on left side', 'Keep microphone'"
                        className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-[11px] text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-[#d4f15d]"
                      />
                    </div>

                  </div>

                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Lightbox / Zoom Modal */}
      {lightboxPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative max-w-4xl w-full bg-neutral-950 border border-[#d4f15d]/40 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
            
            {/* Modal Header */}
            <div className="p-4 bg-black border-b border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#d4f15d]" />
                <div>
                  <div className="text-xs font-bold text-white truncate max-w-[280px] sm:max-w-md">
                    {lightboxPhoto.name}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Role: <span className="text-[#d4f15d] font-bold">{lightboxPhoto.roleLabel}</span> • Size: {lightboxPhoto.sizeFormatted}
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setLightboxZoom(prev => Math.min(prev + 0.25, 3))}
                  className="px-2.5 py-1 rounded-lg bg-[#091c3d] hover:bg-[#102d61] text-xs text-white font-bold cursor-pointer"
                  title="Zoom In"
                >
                  +
                </button>
                <button
                  type="button"
                  onClick={() => setLightboxZoom(prev => Math.max(prev - 0.25, 0.5))}
                  className="px-2.5 py-1 rounded-lg bg-[#091c3d] hover:bg-[#102d61] text-xs text-white font-bold cursor-pointer"
                  title="Zoom Out"
                >
                  -
                </button>
                <button
                  type="button"
                  onClick={() => setLightboxRotation(prev => (prev + 90) % 360)}
                  className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white cursor-pointer"
                  title="Rotate 90 deg"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDownloadPhoto(lightboxPhoto)}
                  className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-[#d4f15d] cursor-pointer"
                  title="Download photo"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setLightboxPhoto(null)}
                  className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-slate-300 hover:text-white cursor-pointer ml-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body: Image Viewport */}
            <div className="flex-1 p-6 overflow-auto flex items-center justify-center bg-black min-h-[320px]">
              <img
                src={lightboxPhoto.dataUrl}
                alt={lightboxPhoto.name}
                style={{
                  transform: `scale(${lightboxZoom}) rotate(${lightboxRotation}deg)`,
                  transition: 'transform 0.2s ease-out'
                }}
                className="max-h-[60vh] max-w-full object-contain rounded-xl shadow-2xl"
              />
            </div>

            {/* Modal Footer: Instructions */}
            <div className="p-3.5 bg-neutral-950 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
              <div className="text-slate-300 text-[11px] truncate">
                {lightboxPhoto.instructions ? (
                  <span>Notes: <strong className="text-white">"{lightboxPhoto.instructions}"</strong></span>
                ) : (
                  <span className="text-slate-400">No custom notes specified for this photo.</span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setLightboxPhoto(null)}
                className="px-4 py-1.5 rounded-xl bg-[#d4f15d] hover:bg-[#bef264] text-slate-950 font-black text-xs cursor-pointer"
              >
                Close Preview
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
