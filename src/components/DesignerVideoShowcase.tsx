import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Sparkles, Video, Film, CheckCircle2, RotateCcw, Maximize2, X, Trash2 } from 'lucide-react';
import { ShowcaseVideo } from '../types';
import rtsonWebsiteResponsiveImg from '../assets/images/rtson_website_responsive.svg';
import rtsonWebsitePurpleImg from '../assets/images/rtson_website_purple.svg';
import { InteractiveMotionFlyerCanvas } from './InteractiveMotionFlyerCanvas';

// No default AI stock videos. Only authentic videos uploaded by the designer will be played.
const DEFAULT_STUDIO_VIDEO = '';

interface DesignerVideoShowcaseProps {
  customVideoUrl?: string;
  videos?: ShowcaseVideo[];
  onOrderMotionFlyer?: (title: string) => void;
  onDeleteVideo?: (videoId: string) => void;
}

export const DesignerVideoShowcase: React.FC<DesignerVideoShowcaseProps> = ({
  customVideoUrl,
  videos = [],
  onOrderMotionFlyer,
  onDeleteVideo
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [activeSoftware, setActiveSoftware] = useState<'ps' | 'ai' | 'ae' | 'canva'>('ps');
  const [playerMode, setPlayerMode] = useState<'video' | 'interactive_motion'>(videos.length > 0 ? 'video' : 'interactive_motion');
  const [selectedCustomVideoUrl, setSelectedCustomVideoUrl] = useState<string | null>(null);
  const [videoFilter, setVideoFilter] = useState<'all' | 'motion_flyer' | 'speaking' | 'workstation'>('all');
  const [modalVideo, setModalVideo] = useState<ShowcaseVideo | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);

  const softwareDetails = {
    ps: {
      name: 'Adobe Photoshop 2026',
      headline: 'Pixel-Perfect Composition & 3D Church Flyer Texturing',
      badgeBg: 'bg-neutral-900 text-[#d4f15d] border-neutral-700',
      description: 'Advanced lighting grading, gold foil extrusion, portrait retouching, and 300 DPI CMYK pre-press flyer packaging.',
      features: ['Gold Metallic Textures', 'Ultra HD Cutouts', '300 DPI CMYK Export', 'Lighting Blends']
    },
    ai: {
      name: 'Adobe Illustrator Vector Engine',
      headline: 'Scalable Brand Logos & Complex Geometric Badges',
      badgeBg: 'bg-[#d4f15d] text-slate-950 font-black border-[#d4f15d]/40',
      description: 'Mathematical bezier vector curves, infinite scaling without pixelation, monochrome variants, and SVG export.',
      features: ['Infinite Scalability', 'Pantone Color Matching', 'Vector Monograms', 'Clean SVG Output']
    },
    ae: {
      name: 'Adobe After Effects 2026',
      headline: '3D Kinetic Motion Graphics & Animated Church Video Posters',
      badgeBg: 'bg-neutral-900 text-[#d4f15d] border-neutral-700',
      description: 'Volumetric light beams, metallic 3D text rotation, beat-synced particle equalizers, and 60FPS high-definition MP4 output.',
      features: ['Kinetic 3D Typography', 'Audio Equalizer Pulses', '60FPS MP4 Master Export', 'Social Story Formats']
    },
    canva: {
      name: 'Canva Pro & Figma Ecosystem',
      headline: 'Editable Client Templates & Multi-Platform Kits',
      badgeBg: 'bg-slate-800 text-white border-slate-700',
      description: 'Drag-and-drop editable templates for churches and event organizers to quickly update dates on mobile.',
      features: ['Mobile Editable Links', 'IG/TikTok Formats', 'Brand Kit Sync', 'Easy Client Handover']
    }
  };

  const getYouTubeEmbedUrl = (url: string): string | null => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}?autoplay=1&mute=1&loop=1&playlist=${match[2]}` : null;
  };

  const resolveWorkingVideoUrl = (rawUrl?: string): string => {
    return (rawUrl || '').trim();
  };

  const activeVideoUrl = resolveWorkingVideoUrl(selectedCustomVideoUrl || customVideoUrl || (videos.length > 0 ? videos[0].videoUrl : ''));
  const embedUrl = activeVideoUrl ? getYouTubeEmbedUrl(activeVideoUrl) : null;
  const selectedVideoObj = videos.find(v => v.videoUrl === (selectedCustomVideoUrl || activeVideoUrl));

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(e => console.log('Video play error:', e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const playVideoInMainPlayer = (vid: ShowcaseVideo) => {
    setSelectedCustomVideoUrl(vid.videoUrl);
    setPlayerMode('video');
    const el = document.getElementById('designer-workflow-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const currentSw = softwareDetails[activeSoftware];

  const filteredVideos = videos.filter(v => {
    if (videoFilter === 'all') return true;
    return v.type === videoFilter;
  });

  return (
    <section id="designer-workflow-section" className="py-16 bg-slate-950 border-t border-slate-800 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-neutral-900 border border-[#d4f15d]/40 text-slate-200 text-xs font-bold shadow-sm">
            <Video className="w-3.5 h-3.5 text-[#d4f15d]" />
            <span>Studio Video Showcase & Motion Reels</span>
            <span className="w-2 h-2 rounded-full bg-[#d4f15d] inline-block"></span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Action Motion Graphics & Video Showcase
          </h2>

          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto">
            Experience our dynamic motion graphic flyers, 3D typography speed arts, and studio speaking reels. Switch between live motion simulation and high-definition video playback below.
          </p>

          {/* Mode Switcher Tabs */}
          <div className="inline-flex items-center p-1.5 rounded-xl bg-neutral-900 border border-neutral-800 shadow-lg gap-2 mt-2">
            <button
              onClick={() => setPlayerMode('video')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-2 ${
                playerMode === 'video'
                  ? 'bg-[#d4f15d] text-slate-950 font-black shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              <span>Studio Video Streams</span>
            </button>

            <button
              onClick={() => setPlayerMode('interactive_motion')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-2 ${
                playerMode === 'interactive_motion'
                  ? 'bg-[#d4f15d] text-slate-950 font-black shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-slate-950" />
              <span>Live 60FPS Motion Flyer Engine</span>
            </button>
          </div>
        </div>

        {/* Software Selector Tabs in Lime, Black & White */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {[
            { id: 'ps', label: 'Adobe Photoshop', icon: 'Ps', color: 'border-neutral-700 bg-neutral-900 text-[#d4f15d]' },
            { id: 'ai', label: 'Adobe Illustrator', icon: 'Ai', color: 'border-[#d4f15d]/40 bg-[#d4f15d]/20 text-[#d4f15d]' },
            { id: 'ae', label: 'Adobe After Effects', icon: 'Ae', color: 'border-neutral-700 bg-neutral-900 text-[#d4f15d]' },
            { id: 'canva', label: 'Canva / Figma', icon: 'Cv', color: 'border-neutral-800 bg-black text-slate-200' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSoftware(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
                activeSoftware === tab.id
                  ? 'bg-neutral-800 border-[#d4f15d] text-white'
                  : 'bg-black border-neutral-800 text-slate-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <span className={`w-5 h-5 rounded flex items-center justify-center font-black text-[10px] ${tab.color}`}>
                {tab.icon}
              </span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Top Featured Player Container */}
        {playerMode === 'interactive_motion' ? (
          <div className="max-w-5xl mx-auto">
            <InteractiveMotionFlyerCanvas
              onOrderThisMotion={(preset) => {
                if (onOrderMotionFlyer) {
                  onOrderMotionFlyer(preset.title);
                } else {
                  const targetEl = document.getElementById('pricing-calculator-section');
                  if (targetEl) targetEl.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            />
          </div>
        ) : (
          <div className="relative w-full max-w-5xl mx-auto rounded-2xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden">
            
            {/* Top Terminal Window Bar */}
            <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#d4f15d] inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-neutral-700 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-white inline-block"></span>
                <span className="text-xs font-bold text-slate-300 font-mono ml-2 hidden sm:inline">
                  {selectedVideoObj ? `NOW PLAYING: ${selectedVideoObj.title}` : `R'tson Creations • Main Studio Video Feed`}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {selectedVideoObj && (
                  <button
                    onClick={() => setModalVideo(selectedVideoObj)}
                    className="px-2.5 py-1 rounded-lg bg-neutral-900 text-[#d4f15d] border border-neutral-700 hover:border-[#d4f15d] text-[10px] font-bold transition-colors cursor-pointer flex items-center gap-1"
                    title="Play video in full screen modal"
                  >
                    <Maximize2 className="w-3 h-3" />
                    <span>Fullscreen</span>
                  </button>
                )}
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${currentSw.badgeBg}`}>
                  {currentSw.name}
                </span>
              </div>
            </div>

            {/* Main Video Screen Content */}
            <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden">
              {!activeVideoUrl && !embedUrl ? (
                <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center">
                    <Video className="w-8 h-8 text-[#d4f15d]" />
                  </div>
                  <div className="space-y-1 max-w-md">
                    <h3 className="text-base font-bold text-white">No Custom Videos Uploaded Yet</h3>
                    <p className="text-xs text-slate-400">
                      Upload your authentic speed-art recordings, 3D motion flyers, or client commercials in the Designer Admin Suite to feature them here.
                    </p>
                  </div>
                  <button
                    onClick={() => setPlayerMode('interactive_motion')}
                    className="px-4 py-2 rounded-xl bg-[#d4f15d] hover:bg-[#bef264] text-slate-950 font-black text-xs shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Launch Interactive Motion Studio</span>
                  </button>
                </div>
              ) : embedUrl ? (
                <iframe
                  key={embedUrl}
                  src={embedUrl}
                  title="Studio Showcase Video"
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  ref={videoRef}
                  key={activeVideoUrl}
                  poster={rtsonWebsiteResponsiveImg}
                  autoPlay
                  loop
                  controls
                  muted={isMuted}
                  playsInline
                  preload="auto"
                  className="w-full h-full object-contain bg-black"
                >
                  <source src={activeVideoUrl} type={activeVideoUrl.startsWith('data:video/webm') ? 'video/webm' : 'video/mp4'} />
                  <source src={activeVideoUrl} />
                  <p className="text-xs text-slate-400 p-4 text-center">
                    Video stream ready.
                  </p>
                </video>
              )}

              {/* Speaking Designer Talking Avatar Badge */}
              <div className="absolute top-4 left-4 z-20 flex items-center gap-3 p-2.5 rounded-xl bg-neutral-950/90 border border-neutral-800 shadow-md">
                <div className="w-10 h-10 rounded-lg bg-[#d4f15d] p-0.5 overflow-hidden">
                  <img
                    src={rtsonWebsiteResponsiveImg}
                    alt="R'tson - Lead Graphic Designer"
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover rounded-[6px]"
                  />
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white">R'tson Creations</span>
                    <span className="text-[9px] font-black bg-[#d4f15d] text-slate-950 px-1.5 py-0.2 rounded">Studio</span>
                  </div>
                  <span className="text-[10px] text-slate-400 block font-medium">
                    Graphic Design &amp; Advertising
                  </span>
                </div>
              </div>

              {/* Video Playbar HUD Controls Bar */}
              <div className="absolute bottom-0 inset-x-0 p-3 z-20 bg-slate-950/90 flex items-center justify-between gap-4 border-t border-slate-800">
                
                <div className="flex items-center gap-3">
                  <button
                    onClick={togglePlay}
                    className="p-2 rounded-lg bg-[#d4f15d] hover:bg-[#bef264] text-slate-950 transition-colors cursor-pointer shadow"
                    title={isPlaying ? 'Pause Motion' : 'Play Motion'}
                  >
                    {isPlaying ? <Pause className="w-4 h-4 fill-slate-950" /> : <Play className="w-4 h-4 fill-slate-950" />}
                  </button>

                  <button
                    onClick={toggleMute}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition-colors cursor-pointer"
                    title={isMuted ? 'Unmute Ambient Sound' : 'Mute Ambient Sound'}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>

                  {selectedCustomVideoUrl && (
                    <button
                      onClick={() => setSelectedCustomVideoUrl(null)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-200 border border-slate-700 text-xs font-bold hover:bg-slate-700 transition-colors cursor-pointer"
                      title="Reset to default video feed"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-[#d4f15d]" />
                      <span>Reset Feed</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black text-slate-950 bg-[#d4f15d] px-2.5 py-1 rounded">
                    1080p 60FPS HD Stream
                  </span>
                </div>

              </div>

            </div>

            {/* Software Info Breakdown Card Below Video */}
            <div className="p-6 bg-slate-900 border-t border-slate-800 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-8 space-y-2">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded border inline-block ${currentSw.badgeBg}`}>
                  {currentSw.name}
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-white">
                  {currentSw.headline}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {currentSw.description}
                </p>
              </div>

              <div className="md:col-span-4 space-y-2 bg-slate-950 p-4 rounded-xl border border-slate-800">
                <span className="text-[10px] font-bold uppercase text-[#d4f15d] block mb-1">Guaranteed Output Specs</span>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {currentSw.features.map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#d4f15d] shrink-0" />
                      <span className="text-[11px]">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>
        )}

        {/* Dynamic Showcase Motion Graphic Videos Grid */}
        {videos && videos.length > 0 && (
          <div className="max-w-6xl mx-auto space-y-6 pt-6 border-t border-slate-800">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#d4f15d] text-slate-950 shadow-xs">
                  <Film className="w-5 h-5 text-slate-950" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    <span>Action Motion Graphics &amp; Video Collection</span>
                    <span className="text-[10px] font-mono px-2.5 py-0.5 rounded bg-[#d4f15d] text-slate-950 font-black">
                      {videos.length} Videos Available
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Play every motion graphic flyer, design speed art, and video reel directly on its dedicated standalone player below.
                  </p>
                </div>
              </div>

              {/* Video Type Filter Tabs */}
              <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-bold">
                {[
                  { id: 'all', label: 'All Videos' },
                  { id: 'motion_flyer', label: 'Motion Flyers' },
                  { id: 'speaking', label: 'Studio Reel' },
                  { id: 'workstation', label: 'Speed Art' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setVideoFilter(f.id as any)}
                    className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      videoFilter === f.id
                        ? 'bg-[#d4f15d] text-slate-950 font-black'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Video Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVideos.map((vid) => {
                const resolvedUrl = resolveWorkingVideoUrl(vid.videoUrl);
                const isSelected = (selectedCustomVideoUrl === vid.videoUrl) || (activeVideoUrl === resolvedUrl && playerMode === 'video');
                const isYouTube = !!getYouTubeEmbedUrl(resolvedUrl);

                return (
                  <div
                    key={vid.id}
                    className={`p-4 rounded-xl border transition-colors space-y-3 relative flex flex-col justify-between ${
                      isSelected
                        ? 'bg-slate-900 border-[#d4f15d] shadow-md'
                        : 'bg-slate-900 border-slate-800 hover:border-[#d4f15d]'
                    }`}
                  >
                    <div className="space-y-3">
                      {/* Header bar on card */}
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                          vid.type === 'motion_flyer' 
                            ? 'bg-[#d4f15d] text-slate-950 font-black'
                            : vid.type === 'speaking' 
                            ? 'bg-neutral-800 text-[#d4f15d]'
                            : 'bg-slate-800 text-slate-300'
                        }`}>
                          {vid.type === 'motion_flyer' ? 'Motion Graphic Flyer' : vid.type === 'speaking' ? 'Studio Reel' : 'Workstation Speed Art'}
                        </span>

                        {onDeleteVideo && (
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Delete video "${vid.title}" from studio video feed?`)) {
                                if (selectedCustomVideoUrl === vid.videoUrl) {
                                  setSelectedCustomVideoUrl(null);
                                }
                                onDeleteVideo(vid.id);
                              }
                            }}
                            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-red-600 transition-colors cursor-pointer"
                            title="Delete Video"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      {/* Direct Standalone Video Player Element right on the card */}
                      <div className="relative aspect-video rounded-lg overflow-hidden bg-black border border-slate-800">
                        {isYouTube ? (
                          <iframe
                            src={getYouTubeEmbedUrl(resolvedUrl)!}
                            title={vid.title}
                            className="w-full h-full border-0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        ) : (
                          <video
                            key={resolvedUrl}
                            controls
                            muted
                            playsInline
                            preload="metadata"
                            poster={rtsonWebsitePurpleImg}
                            className="w-full h-full object-contain bg-black"
                          >
                            <source src={resolvedUrl} type={resolvedUrl.startsWith('data:video/webm') ? 'video/webm' : 'video/mp4'} />
                            <source src={resolvedUrl} />
                            <p className="text-[10px] text-slate-400 p-2 text-center">
                              Video stream ready. Click play to watch.
                            </p>
                          </video>
                        )}

                        <div className="absolute top-2 right-2 z-10 pointer-events-none">
                          <span className="text-[9px] font-mono font-bold bg-slate-950 text-blue-400 px-2 py-0.5 rounded border border-slate-800">
                            60FPS HD
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <h4 className="text-xs font-bold text-white line-clamp-1">
                          {vid.title}
                        </h4>
                        {vid.description && (
                          <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                            {vid.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Action buttons below the video */}
                    <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-800 mt-3">
                      <button
                        type="button"
                        onClick={() => setModalVideo(vid)}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                        title="Watch in full screen popup lightbox"
                      >
                        <Maximize2 className="w-3.5 h-3.5 text-blue-400" />
                        <span>Fullscreen</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => playVideoInMainPlayer(vid)}
                        className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${
                          isSelected
                            ? 'bg-[#d4f15d] text-slate-950 font-black border-[#d4f15d]'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                        }`}
                        title="Stream this video in the top studio header"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>{isSelected ? 'Main Active' : 'Set as Main'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Video Lightbox Modal Popup */}
        {modalVideo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/95 overflow-y-auto">
            <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-auto space-y-4 p-4 sm:p-6">
              
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[#d4f15d] text-slate-950">
                    <Video className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#d4f15d] block">
                      R'tson Studio Video Reel
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-white">
                      {modalVideo.title}
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => setModalVideo(null)}
                  className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Video Player Display */}
              <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black border border-slate-800 flex items-center justify-center">
                {getYouTubeEmbedUrl(resolveWorkingVideoUrl(modalVideo.videoUrl)) ? (
                  <iframe
                    src={getYouTubeEmbedUrl(resolveWorkingVideoUrl(modalVideo.videoUrl))!}
                    title={modalVideo.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video
                    key={resolveWorkingVideoUrl(modalVideo.videoUrl)}
                    controls
                    autoPlay
                    muted
                    playsInline
                    preload="auto"
                    loop
                    className="w-full h-full object-contain bg-black"
                  >
                    <source src={resolveWorkingVideoUrl(modalVideo.videoUrl)} type={modalVideo.videoUrl.startsWith('data:video/webm') ? 'video/webm' : 'video/mp4'} />
                    <source src={resolveWorkingVideoUrl(modalVideo.videoUrl)} />
                    <p className="text-xs text-slate-400 p-4 text-center">
                      Loading video playback in lightbox...
                    </p>
                  </video>
                )}
              </div>

              {/* Description & Action Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-slate-800">
                <div className="space-y-1 text-left w-full sm:w-auto">
                  <p className="text-xs text-slate-300 font-medium">
                    {modalVideo.description || 'Motion graphic flyer and studio video reel.'}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-[#d4f15d] border border-slate-800">
                      Category: {modalVideo.category.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-blue-400 border border-slate-800">
                      Format: MP4 High Definition
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => {
                      const vidToPlay = modalVideo;
                      setModalVideo(null);
                      playVideoInMainPlayer(vidToPlay);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-[#d4f15d] hover:bg-[#bef264] text-slate-950 font-black text-xs transition-colors cursor-pointer flex items-center gap-1.5 shadow"
                  >
                    <Play className="w-4 h-4 fill-slate-950" />
                    <span>Play In Header Feed</span>
                  </button>

                  <button
                    onClick={() => setModalVideo(null)}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
};
