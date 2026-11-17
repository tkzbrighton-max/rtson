import React, { useState } from 'react';
import { 
  X, 
  Eye, 
  Tv, 
  Smartphone, 
  Sparkles, 
  Maximize2, 
  Compass, 
  CheckCircle2, 
  Download,
  Share2,
  Heart,
  MessageCircle,
  Send,
  Building2,
  Image as ImageIcon
} from 'lucide-react';
import { sound } from '../lib/soundFx';

interface PhotorealisticMockupViewerProps {
  flyerImageUrl: string;
  flyerTitle: string;
  categoryLabel?: string;
  isOpen?: boolean;
  onClose: () => void;
  onOrderThisStyle?: () => void;
}

type MockupEnvironment = 'church_led' | 'billboard_night' | 'gallery_frame' | 'iphone_feed';

export const PhotorealisticMockupViewer: React.FC<PhotorealisticMockupViewerProps> = ({
  flyerImageUrl,
  flyerTitle,
  categoryLabel,
  isOpen,
  onClose,
  onOrderThisStyle
}) => {
  const [activeEnv, setActiveEnv] = useState<MockupEnvironment>('church_led');

  if (isOpen === false) {
    return null;
  }

  const environments: { id: MockupEnvironment; label: string; icon: any; desc: string }[] = [
    {
      id: 'church_led',
      label: 'Church LED Stage Screen',
      icon: Tv,
      desc: 'Simulated 4K worship auditorium LED video wall with ambient stage truss lighting'
    },
    {
      id: 'billboard_night',
      label: 'Highway Night Billboard',
      icon: Building2,
      desc: 'High-contrast commercial outdoor lightbox with night reflections'
    },
    {
      id: 'gallery_frame',
      label: 'Studio Gallery Frame',
      icon: ImageIcon,
      desc: 'Museum-grade luxury wall frame with directional spotlighting'
    },
    {
      id: 'iphone_feed',
      label: 'Instagram iPhone Feed',
      icon: Smartphone,
      desc: 'Mobile social media engagement preview with crisp OLED rendering'
    }
  ];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-5xl bg-[#141720] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Header */}
        <div className="px-5 sm:px-6 py-4 bg-[#181c24] border-b border-white/10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#ff6b00] text-black">
              <Eye className="w-5 h-5 text-black" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase text-[#ff8800] bg-[#ff6b00]/10 px-2 py-0.5 rounded border border-[#ff6b00]/30">
                  3D PHOTOREALISTIC MOCKUP SUITE
                </span>
                <span className="text-xs text-slate-400 font-mono">• {categoryLabel || '300 DPI Pre-Press'}</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                {flyerTitle}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOrderThisStyle && (
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onClose();
                  onOrderThisStyle();
                }}
                className="px-4 py-2 rounded-xl bg-[#ff6b00] hover:bg-[#ff7a00] text-black text-xs font-black transition-all shadow-md cursor-pointer min-h-[40px]"
              >
                Order This Design ($10+)
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="p-2 rounded-xl bg-[#1e232d] hover:bg-[#252b37] text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Environment Selection Tabs */}
        <div className="px-5 sm:px-6 py-3 bg-[#181c24]/80 border-b border-white/10 flex flex-wrap items-center justify-center sm:justify-start gap-2">
          {environments.map((env) => {
            const Icon = env.icon;
            const isActive = activeEnv === env.id;
            return (
              <button
                key={env.id}
                type="button"
                onClick={() => {
                  sound.playClick();
                  setActiveEnv(env.id);
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer min-h-[38px] ${
                  isActive
                    ? 'bg-[#ff6b00] text-black font-black shadow-md shadow-[#ff6b00]/20'
                    : 'bg-[#141720] text-slate-400 hover:text-white hover:bg-[#1e232d] border border-white/10'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{env.label}</span>
              </button>
            );
          })}
        </div>

        {/* Main 3D Mockup Stage Display */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto flex flex-col items-center justify-center bg-[#12151a] min-h-[360px] sm:min-h-[420px] relative">
          
          {/* ======================================================== */}
          {/* 1. CHURCH LED STAGE SCREEN MOCKUP                        */}
          {/* ======================================================== */}
          {activeEnv === 'church_led' && (
            <div className="relative w-full max-w-3xl aspect-[16/9] rounded-2xl bg-black border-4 border-neutral-900 shadow-2xl flex items-center justify-center overflow-hidden p-4 sm:p-6">
              {/* Church Sanctuary Stage Background Lighting */}
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-30"
                style={{
                  backgroundImage: 'radial-gradient(ellipse at center, rgba(255, 107, 0, 0.4) 0%, rgba(0, 0, 0, 0.95) 80%)'
                }}
              />
              
              {/* Overhead Altar Stage Lights */}
              <div className="absolute top-0 inset-x-0 h-16 flex justify-around opacity-75 pointer-events-none">
                <div className="w-24 h-48 bg-gradient-to-b from-amber-400/40 to-transparent blur-xl transform -rotate-12"></div>
                <div className="w-32 h-64 bg-gradient-to-b from-[#ff6b00]/40 to-transparent blur-2xl"></div>
                <div className="w-24 h-48 bg-gradient-to-b from-orange-500/30 to-transparent blur-xl transform rotate-12"></div>
              </div>

              {/* Massive LED Screen Truss Rigging Frame */}
              <div className="relative z-10 max-h-[88%] aspect-[4/5] sm:aspect-auto sm:h-[88%] rounded-xl overflow-hidden shadow-2xl border-2 border-neutral-700 bg-black flex items-center justify-center">
                {/* LED Pixel Grid Scanline Shader Overlay */}
                <div 
                  className="absolute inset-0 z-20 pointer-events-none opacity-25 mix-blend-overlay"
                  style={{
                    backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.6) 0px, rgba(0,0,0,0.6) 1px, transparent 1px, transparent 2px)'
                  }}
                />

                <img
                  src={flyerImageUrl}
                  alt={flyerTitle}
                  loading="eager"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain filter brightness-110 contrast-105"
                />

                {/* Subdued Stadium Screen Glow */}
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/40 via-transparent to-white/10 pointer-events-none" />
              </div>

              {/* Speaker Rig Silhouette & Stage Base */}
              <div className="absolute bottom-0 inset-x-0 h-10 bg-gradient-to-t from-black via-black/80 to-transparent flex items-center justify-between px-4 sm:px-8 text-[11px] font-mono text-slate-500">
                <span>STAGE LEFT RIGGING</span>
                <span className="text-[#ff8800] flex items-center gap-1 font-bold">
                  <span className="w-2 h-2 rounded-full bg-[#ff6b00] animate-pulse"></span>
                  4K 60HZ ACTIVE FEED
                </span>
                <span>STAGE RIGHT RIGGING</span>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* 2. HIGHWAY NIGHT BILLBOARD                               */}
          {/* ======================================================== */}
          {activeEnv === 'billboard_night' && (
            <div className="relative w-full max-w-3xl aspect-[16/9] rounded-2xl bg-[#030712] border-4 border-neutral-900 shadow-2xl flex items-center justify-center overflow-hidden p-4 sm:p-6">
              {/* Dark City Night Skyline Gradient */}
              <div 
                className="absolute inset-0 opacity-40"
                style={{
                  backgroundImage: 'radial-gradient(circle at 50% 20%, #1c0e00 0%, #030712 90%)'
                }}
              />

              {/* Billboard Overhead Floodlights */}
              <div className="absolute top-2 inset-x-0 flex justify-center gap-16 pointer-events-none z-20">
                <div className="w-4 h-4 rounded-full bg-white shadow-[0_0_40px_15px_rgba(255,255,255,0.7)]"></div>
                <div className="w-4 h-4 rounded-full bg-white shadow-[0_0_40px_15px_rgba(255,255,255,0.7)]"></div>
                <div className="w-4 h-4 rounded-full bg-white shadow-[0_0_40px_15px_rgba(255,255,255,0.7)]"></div>
              </div>

              {/* Heavy Steel Billboard Frame */}
              <div className="relative z-10 max-h-[85%] aspect-[4/5] sm:aspect-auto sm:h-[85%] rounded-lg p-2.5 bg-neutral-900 border-4 border-neutral-700 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.9)] flex items-center justify-center">
                <div className="relative w-full h-full overflow-hidden rounded bg-black">
                  <img
                    src={flyerImageUrl}
                    alt={flyerTitle}
                    loading="eager"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain filter contrast-110"
                  />
                  {/* Night Floodlight Gradient Sheen */}
                  <div 
                    className="absolute inset-0 pointer-events-none opacity-30"
                    style={{
                      background: 'linear-gradient(175deg, rgba(255,255,255,0.6) 0%, transparent 60%)'
                    }}
                  />
                </div>
              </div>

              <div className="absolute bottom-3 left-4 z-20">
                <span className="text-[10px] font-mono font-bold bg-black/90 text-[#ff8800] px-2 py-0.5 rounded border border-white/10">
                  Illuminated City Night Billboard
                </span>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* 3. VIP GALLERY FRAME                                     */}
          {/* ======================================================== */}
          {activeEnv === 'gallery_frame' && (
            <div className="relative w-full max-w-2xl aspect-[4/3] rounded-2xl bg-[#141720] border-4 border-neutral-800 shadow-2xl flex items-center justify-center overflow-hidden p-6 sm:p-8">
              {/* Museum Gallery Spotlight down */}
              <div className="absolute top-0 w-64 h-80 bg-gradient-to-b from-orange-400/20 via-amber-300/5 to-transparent blur-2xl pointer-events-none"></div>
              
              {/* Ornate Wood Frame */}
              <div className="relative z-10 h-[90%] aspect-[4/5] p-3 rounded-xl bg-gradient-to-br from-amber-600 via-orange-400 to-amber-700 shadow-2xl shadow-black/80 flex items-center justify-center">
                {/* Inner Black Matte Passe-partout */}
                <div className="w-full h-full p-2.5 rounded-lg bg-black shadow-inner flex items-center justify-center">
                  <img
                    src={flyerImageUrl}
                    alt={flyerTitle}
                    loading="eager"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain rounded"
                  />
                </div>
              </div>

              <div className="absolute bottom-3 left-4 z-20">
                <span className="text-[10px] font-mono font-bold bg-black/90 text-[#ff8800] px-2 py-0.5 rounded border border-white/10">
                  Museum Studio Gallery Frame • High Gloss
                </span>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* 4. INSTAGRAM IPHONE 16 PRO FEED                          */}
          {/* ======================================================== */}
          {activeEnv === 'iphone_feed' && (
            <div className="relative w-full max-w-xs aspect-[9/16] max-h-[460px] rounded-[36px] bg-black border-[5px] border-neutral-700 shadow-2xl overflow-hidden flex flex-col p-3 text-white">
              {/* Dynamic Island Pill */}
              <div className="w-20 h-4 rounded-full bg-neutral-900 mx-auto mb-2 shrink-0 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-black mr-2"></div>
              </div>

              {/* Instagram Feed Header */}
              <div className="flex items-center justify-between pb-2 border-b border-white/10 px-1 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#ff6b00] to-orange-400 p-0.5">
                    <div className="w-full h-full rounded-full bg-black"></div>
                  </div>
                  <span className="font-bold text-[11px]">rtson_creations</span>
                </div>
                <span className="text-[10px] text-slate-400">Sponsored</span>
              </div>

              {/* Flyer Feed Image */}
              <div className="flex-1 rounded-xl overflow-hidden my-2 bg-black flex items-center justify-center">
                <img
                  src={flyerImageUrl}
                  alt={flyerTitle}
                  loading="eager"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Social Engagement Actions */}
              <div className="space-y-1 px-1 text-[11px] pb-1">
                <div className="flex items-center gap-4 text-xs font-bold text-slate-300">
                  <span className="flex items-center gap-1 text-[#ff6b00]">
                    <Heart className="w-3.5 h-3.5 fill-[#ff6b00]" />
                    <span>4,821</span>
                  </span>
                  <span className="flex items-center gap-1 text-slate-300">
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>284</span>
                  </span>
                  <span className="flex items-center gap-1 text-slate-300">
                    <Send className="w-3.5 h-3.5" />
                    <span>1,120</span>
                  </span>
                </div>
                <p className="text-[10px] text-slate-300 line-clamp-1">
                  <strong className="text-white">rtson_creations</strong> 300 DPI Pre-Press Graphic Design • Order Now
                </p>
              </div>

            </div>
          )}

        </div>

        {/* Bottom Specs Footer */}
        <div className="px-5 sm:px-6 py-4 bg-[#181c24] border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-400 space-y-0.5 text-center sm:text-left">
            <span className="font-bold text-slate-200">
              Guaranteed 300 DPI CMYK Pre-Press &amp; RGB High-Res Output
            </span>
            <p className="text-[11px] text-slate-500">
              Every graphic is precision-crafted for flawless reproduction on LED stage screens, social feeds, and commercial print shops.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onClose();
                if (onOrderThisStyle) onOrderThisStyle();
              }}
              className="px-5 py-2.5 rounded-xl bg-[#ff6b00] hover:bg-[#ff7a00] text-black font-black text-xs transition-all shadow-md cursor-pointer flex items-center gap-1.5 min-h-[42px]"
            >
              <Sparkles className="w-4 h-4 text-black" />
              <span>Proceed With This Style</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
