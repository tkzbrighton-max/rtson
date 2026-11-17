import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Sparkles, Sliders, Layers, RefreshCw, Zap, Disc3, ShieldCheck, Terminal } from 'lucide-react';

export interface MotionFlyerPreset {
  id: string;
  name: string;
  category: 'church' | 'dj' | 'business' | 'gospel';
  title: string;
  subheadline: string;
  dateBadge: string;
  venue: string;
  guestSpeaker: string;
  primaryColor: string;
  accentColor: string;
  themeStyle: 'gold_luxury' | 'neon_cyber' | 'corporate_emerald' | 'heavenly_amber';
}

export const MOTION_FLYER_PRESETS: MotionFlyerPreset[] = [
  {
    id: 'praise-worship-gold',
    name: '3D Gold Gospel Flyer Reel',
    category: 'church',
    title: 'ANNUAL PRAISE & GLORY SUMMIT 2026',
    subheadline: 'AN UNFORGETTABLE NIGHT OF MIRACLES, HEALING & SUPERNATURAL BREAKTHROUGHS',
    dateBadge: 'FRI 28 AUG • 6:00 PM',
    venue: 'HARARE INTERNATIONAL CONFERENCE CENTRE',
    guestSpeaker: 'GUEST MINISTER: APOSTLE T. CHIMURENGA',
    primaryColor: '#3B82F6',
    accentColor: '#F97316',
    themeStyle: 'gold_luxury'
  },
  {
    id: 'dj-neon-party',
    name: 'DJ Concert Motion Banner',
    category: 'dj',
    title: 'NEON MIDNIGHT BASS FESTIVAL',
    subheadline: 'LIVE DJ SETS • AFROBEATS • AMAPIANO • DYNAMIC VISUAL EXPERIENCE',
    dateBadge: 'SAT 05 SEPT • 9:00 PM TILL DAWN',
    venue: 'THE VIP ARENA & ROOFTOP CLUB',
    guestSpeaker: 'FEATURING: DJ RHYTHM & SPECIAL GUEST MCs',
    primaryColor: '#2563EB',
    accentColor: '#EA580C',
    themeStyle: 'neon_cyber'
  },
  {
    id: 'gospel-healing-miracle',
    name: 'Prophetic Revival Motion Poster',
    category: 'gospel',
    title: 'NIGHT OF SIGNS & WONDERS',
    subheadline: 'EXPECT YOUR PROPHETIC RESTORATION, ANOINTING & SUPERNATURAL ELEVATION',
    dateBadge: 'SUN 12 OCT • 5:30 PM',
    venue: 'KINGDOM CITY AUDITORIUM',
    guestSpeaker: 'HOST: PROPHET E. MAKONI',
    primaryColor: '#F97316',
    accentColor: '#60A5FA',
    themeStyle: 'heavenly_amber'
  },
  {
    id: 'business-masterclass',
    name: 'Corporate Executive Masterclass',
    category: 'business',
    title: 'EXECUTIVE BRANDING & WEALTH SUMMIT',
    subheadline: 'STRATEGIC GRAPHIC DESIGN, DIGITAL MARKETING & HIGH-CONVERTING BRAND POSITIONING',
    dateBadge: 'THU 15 NOV • 9:00 AM - 4:00 PM',
    venue: 'MEIKLES HOTEL BUSINESS SUITE',
    guestSpeaker: 'FACILITATOR: R\'TSON CREATIONS LEAD DIRECTORS',
    primaryColor: '#1D4ED8',
    accentColor: '#FFFFFF',
    themeStyle: 'corporate_emerald'
  }
];

interface InteractiveMotionFlyerCanvasProps {
  presetId?: string;
  customHeadline?: string;
  aspectRatio?: '1:1' | '9:16' | '16:9';
  className?: string;
  autoPlay?: boolean;
  onOrderThisMotion?: (preset: MotionFlyerPreset) => void;
}

export const InteractiveMotionFlyerCanvas: React.FC<InteractiveMotionFlyerCanvasProps> = ({
  presetId = 'praise-worship-gold',
  customHeadline,
  aspectRatio = '16:9',
  className = '',
  autoPlay = true,
  onOrderThisMotion
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedPresetId, setSelectedPresetId] = useState<string>(presetId);
  const [isPlaying, setIsPlaying] = useState<boolean>(autoPlay);
  const [isAudioActive, setIsAudioActive] = useState<boolean>(false);
  const [headlineOverride, setHeadlineOverride] = useState<string>(customHeadline || '');
  const [selectedRatio, setSelectedRatio] = useState<'1:1' | '9:16' | '16:9'>(aspectRatio);

  const activePreset = MOTION_FLYER_PRESETS.find(p => p.id === selectedPresetId) || MOTION_FLYER_PRESETS[0];
  const audioCtxRef = useRef<AudioContext | null>(null);
  const synthTimerRef = useRef<number | null>(null);

  // Sound Synth Generator for Beat simulation
  useEffect(() => {
    if (!isAudioActive || !isPlaying) {
      if (synthTimerRef.current) {
        clearInterval(synthTimerRef.current);
        synthTimerRef.current = null;
      }
      return;
    }

    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!audioCtxRef.current && AudioContextClass) {
        audioCtxRef.current = new AudioContextClass();
      }

      if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }

      const playBeat = () => {
        if (!audioCtxRef.current || audioCtxRef.current.state !== 'running') return;
        const ctx = audioCtxRef.current;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        // Synth pulse matching flyer style
        if (activePreset.themeStyle === 'neon_cyber') {
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(110, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(45, ctx.currentTime + 0.15);
        } else {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(80, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(35, ctx.currentTime + 0.25);
        }

        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.26);
      };

      synthTimerRef.current = window.setInterval(playBeat, 500); // 120 BPM pulse
    } catch (e) {
      console.log('Audio init skipped:', e);
    }

    return () => {
      if (synthTimerRef.current) {
        clearInterval(synthTimerRef.current);
        synthTimerRef.current = null;
      }
    };
  }, [isAudioActive, isPlaying, activePreset.themeStyle]);

  // Main 60FPS Canvas Motion Graphic Flyer Renderer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    // Particle system
    const particleCount = 35;
    const particles: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      alpha: number;
      color: string;
    }> = [];

    const width = canvas.width;
    const height = canvas.height;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 1.2,
        speedY: (Math.random() - 0.7) * 1.5,
        alpha: Math.random() * 0.7 + 0.3,
        color: i % 2 === 0 ? '#3B82F6' : '#F97316'
      });
    }

    const render = () => {
      if (isPlaying) {
        time += 0.025;
      }

      // Background Solid/Dark Navy Canvas
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, width, height);

      // Subtle linear grid
      ctx.strokeStyle = 'rgba(51, 65, 85, 0.3)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Render Floating Particles
      particles.forEach((p) => {
        if (isPlaying) {
          p.x += p.speedX;
          p.y += p.speedY;

          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;
        }

        ctx.save();
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Top Date / Badge Bar
      ctx.save();
      ctx.fillStyle = '#EA580C';
      ctx.beginPath();
      ctx.roundRect(width / 2 - 120, height * 0.15 - 16, 240, 32, 8);
      ctx.fill();

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 12px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(activePreset.dateBadge, width / 2, height * 0.15);
      ctx.restore();

      // Main Headline Rendering (Crisp White with Solid Blue/Orange Accent)
      const displayTitle = (headlineOverride || activePreset.title).toUpperCase();
      const words = displayTitle.split(' ');

      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const baseY = height * 0.36;
      const line1 = words.slice(0, Math.ceil(words.length / 2)).join(' ');
      const line2 = words.slice(Math.ceil(words.length / 2)).join(' ');

      // Solid text rendering
      ctx.font = '900 28px sans-serif';
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(line1, width / 2, baseY);

      if (line2) {
        ctx.font = '900 28px sans-serif';
        ctx.fillStyle = '#60A5FA';
        ctx.fillText(line2, width / 2, baseY + 36);
      }
      ctx.restore();

      // Subheadline text
      ctx.save();
      ctx.textAlign = 'center';
      ctx.fillStyle = '#CBD5E1';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText(activePreset.subheadline, width / 2, height * 0.58);
      ctx.restore();

      // Guest Speaker Badge (Solid Slate + Orange)
      const speakerY = height * 0.70;
      ctx.save();
      ctx.fillStyle = '#0F172A';
      ctx.strokeStyle = '#2563EB';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(width / 2 - 170, speakerY - 18, 340, 36, 10);
      ctx.fill();
      ctx.stroke();

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#F97316';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText(activePreset.guestSpeaker, width / 2, speakerY);
      ctx.restore();

      // Bottom Venue Address
      ctx.save();
      ctx.textAlign = 'center';
      ctx.fillStyle = '#94A3B8';
      ctx.font = 'bold 11px monospace';
      ctx.fillText(activePreset.venue, width / 2, height * 0.84);
      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying, activePreset, headlineOverride]);

  return (
    <div className={`rounded-2xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden ${className}`}>
      
      {/* Terminal Window Header (Solid Blue, Lime, White Dots) */}
      <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#d4f15d] inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-neutral-700 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-white inline-block"></span>
          </div>
          <span className="text-xs font-mono font-bold text-slate-200 ml-2">
            TERMINAL // REAL-TIME MOTION GRAPHIC ENGINE [60 FPS]
          </span>
        </div>

        {/* Aspect Ratio Switch */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
          {(['16:9', '1:1', '9:16'] as const).map((ratio) => (
            <button
              key={ratio}
              onClick={() => setSelectedRatio(ratio)}
              className={`px-2.5 py-1 rounded text-[11px] font-mono font-bold transition-colors cursor-pointer ${
                selectedRatio === ratio
                  ? 'bg-[#d4f15d] text-slate-950 font-black'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {ratio}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 sm:p-5 space-y-4">
        
        {/* Preset Selector Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {MOTION_FLYER_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => {
                setSelectedPresetId(preset.id);
                setHeadlineOverride('');
              }}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors text-left cursor-pointer border ${
                selectedPresetId === preset.id
                  ? 'bg-[#d4f15d] text-slate-950 border-[#d4f15d] font-black'
                  : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border-slate-800'
              }`}
            >
              <div className="truncate">{preset.name}</div>
            </button>
          ))}
        </div>

        {/* Main Canvas Screen */}
        <div
          className={`relative w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center ${
            selectedRatio === '9:16'
              ? 'max-w-xs mx-auto aspect-[9/16]'
              : selectedRatio === '1:1'
              ? 'max-w-md mx-auto aspect-square'
              : 'aspect-video w-full'
          }`}
        >
          <canvas
            ref={canvasRef}
            width={selectedRatio === '9:16' ? 720 : selectedRatio === '1:1' ? 800 : 960}
            height={selectedRatio === '9:16' ? 1280 : selectedRatio === '1:1' ? 800 : 540}
            className="w-full h-full object-contain"
          />

          {/* Floating Controls Overlay (Solid Slate + Lime) */}
          <div className="absolute bottom-3 inset-x-3 flex items-center justify-between gap-2 p-2 rounded-xl bg-slate-950/90 border border-slate-800">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-2 rounded-lg bg-[#d4f15d] hover:bg-[#bef264] text-slate-950 font-black transition-colors cursor-pointer"
                title={isPlaying ? 'Pause Motion' : 'Play Motion'}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              </button>

              <button
                onClick={() => setIsAudioActive(!isAudioActive)}
                className={`p-2 rounded-lg transition-colors cursor-pointer ${
                  isAudioActive
                    ? 'bg-[#d4f15d] text-slate-950 font-black'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
                title={isAudioActive ? 'Mute Motion Beat' : 'Play Synthesized Audio Beat'}
              >
                {isAudioActive ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-[11px] text-slate-300 font-mono">
              <span className="w-2 h-2 rounded-full bg-[#d4f15d]"></span>
              <span>Real-Time Motion Graphics • 60 FPS</span>
            </div>

            {onOrderThisMotion && (
              <button
                onClick={() => onOrderThisMotion(activePreset)}
                className="px-3.5 py-1.5 rounded-lg bg-[#d4f15d] hover:bg-[#bef264] text-slate-950 text-xs font-black transition-colors cursor-pointer flex items-center gap-1.5 shadow"
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>Order This Motion ($15)</span>
              </button>
            )}
          </div>
        </div>

        {/* Interactive Title Editor Terminal Dock */}
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="w-full sm:flex-1 space-y-1">
            <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#bef264]" />
              <span>Interactive Custom Title Preview (Type your event title to test live motion):</span>
            </label>
            <input
              type="text"
              value={headlineOverride}
              onChange={(e) => setHeadlineOverride(e.target.value)}
              placeholder={activePreset.title}
              className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          {headlineOverride && (
            <button
              onClick={() => setHeadlineOverride('')}
              className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors cursor-pointer self-end sm:self-auto"
            >
              Reset
            </button>
          )}
        </div>

      </div>

    </div>
  );
};
