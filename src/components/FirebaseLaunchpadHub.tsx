import React, { useState } from 'react';
import { 
  Layers, 
  FileText, 
  Presentation, 
  Share2, 
  Palette, 
  Calculator, 
  Layout, 
  Wand2, 
  PlaySquare, 
  FileCheck, 
  Search, 
  ArrowRight, 
  Clock, 
  ShieldCheck, 
  ChevronRight,
  Compass,
  CheckCircle2,
  Sliders,
  ExternalLink,
  Flame,
  Activity,
  Award
} from 'lucide-react';

export interface LaunchpadOption {
  id: string;
  title: string;
  categoryGroup: 'flyers' | 'brochures' | 'decks' | 'social' | 'branding' | 'tools';
  groupLabel: string;
  icon: React.ReactNode;
  badge: string;
  badgeColor: string;
  description: string;
  highlights: string[];
  actionLabel: string;
  turnaround: string;
  isPopular?: boolean;
  isTool?: boolean;
  onSelect: () => void;
}

interface FirebaseLaunchpadHubProps {
  onSelectCategory: (category: string, subType?: string, platform?: string) => void;
  onSelectStudioView: (viewId: string) => void;
  onOpenCalculator: () => void;
  onOpenOrderTracker: () => void;
}

export const FirebaseLaunchpadHub: React.FC<FirebaseLaunchpadHubProps> = ({
  onSelectCategory,
  onSelectStudioView,
  onOpenCalculator,
  onOpenOrderTracker
}) => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Define all direct pathways & options available on the domain
  const launchpadOptions: LaunchpadOption[] = [
    // 1. Church Flyers
    {
      id: 'church_flyers',
      title: 'Church & Gospel 3D Flyers',
      categoryGroup: 'flyers',
      groupLabel: 'Flyers & Posters',
      icon: <Layers className="w-5 h-5 text-amber-400" />,
      badge: '3D Gold & Lighting',
      badgeColor: 'from-amber-500/20 to-[#d4f15d]/20 text-amber-300 border-amber-500/30',
      description: 'High-impact 3D metallic typography, spiritual light rays, and speaker photo cutouts for conferences & revivals.',
      highlights: ['300 DPI CMYK Print PDF', 'Instagram 1:1 & Story Sizing', 'Realistic 3D Lettering'],
      actionLabel: 'Browse Church Flyers',
      turnaround: '24h Express',
      isPopular: true,
      onSelect: () => onSelectCategory('church_flyer', 'church')
    },
    // 2. Simple Business Flyers
    {
      id: 'simple_flyers',
      title: 'Business & Corporate Promos',
      categoryGroup: 'flyers',
      groupLabel: 'Flyers & Posters',
      icon: <FileText className="w-5 h-5 text-blue-400" />,
      badge: '12-24h Express',
      badgeColor: 'from-blue-500/20 to-cyan-500/20 text-blue-300 border-blue-500/30',
      description: 'Clean, modern single-sided marketing flyers, corporate sales promos, leaflets, and grand opening announcements.',
      highlights: ['A4 / US Letter Formats', 'High-Converting Hierarchy', 'Editable Source Files'],
      actionLabel: 'Browse Business Flyers',
      turnaround: '12-24h Turnaround',
      onSelect: () => onSelectCategory('simple_flyer', 'simple')
    },
    // 3. Nightclub & Event Posters
    {
      id: 'event_posters',
      title: 'Nightclub, DJ & Party Posters',
      categoryGroup: 'flyers',
      groupLabel: 'Flyers & Posters',
      icon: <Flame className="w-5 h-5 text-[#bef264]" />,
      badge: 'Neon FX & Flares',
      badgeColor: 'from-[#d4f15d]/20 to-emerald-500/20 text-[#bef264] border-[#d4f15d]/30',
      description: 'Energetic VIP nightlife posters, concert announcements, album release covers, and festival tickets.',
      highlights: ['Vibrant Neon Gradients', 'Artist Lineup Typography', 'Social Media Story Ready'],
      actionLabel: 'Browse Event Posters',
      turnaround: '24h Delivery',
      onSelect: () => onSelectCategory('event_poster', 'event_club')
    },
    // 4. Animated Motion Flyers
    {
      id: 'motion_flyers',
      title: 'Animated Motion Video Flyers',
      categoryGroup: 'flyers',
      groupLabel: 'Flyers & Posters',
      icon: <PlaySquare className="w-5 h-5 text-rose-400" />,
      badge: '60 FPS MP4 Video',
      badgeColor: 'from-rose-500/20 to-pink-500/20 text-rose-300 border-rose-500/30',
      description: 'Dynamic 15-second animated motion flyers with 3D metallic text animations and audio beat-synchronization.',
      highlights: ['1080p 60FPS Video', 'WhatsApp & Instagram Ready', 'Sound FX & Beat Sync'],
      actionLabel: 'Watch Motion Flyers',
      turnaround: '24h Delivery',
      onSelect: () => onSelectStudioView('video')
    },
    // 5. Corporate Brochures (Bi-Fold & Tri-Fold)
    {
      id: 'brochures',
      title: 'Corporate Brochures & Menus',
      categoryGroup: 'brochures',
      groupLabel: 'Brochures & Catalogs',
      icon: <Layers className="w-5 h-5 text-indigo-400" />,
      badge: '4 & 6 Panel Folds',
      badgeColor: 'from-indigo-500/20 to-blue-500/20 text-indigo-300 border-indigo-500/30',
      description: 'Bi-fold (4-panel), tri-fold (6-panel) marketing pamphlets, product catalogs, and luxury restaurant menus.',
      highlights: ['Pre-press Bleed & Crop Marks', 'Structured Grid Alignment', 'Print-Ready Vector PDF'],
      actionLabel: 'Browse Brochures',
      turnaround: '24-48h Delivery',
      isPopular: true,
      onSelect: () => onSelectCategory('brochure')
    },
    // 6. Pitch Decks & Presentations
    {
      id: 'presentations',
      title: 'Investor Pitch Decks & Slides',
      categoryGroup: 'decks',
      groupLabel: 'Decks & Presentations',
      icon: <Presentation className="w-5 h-5 text-emerald-400" />,
      badge: 'PowerPoint & Keynote',
      badgeColor: 'from-emerald-500/20 to-teal-500/20 text-emerald-300 border-emerald-500/30',
      description: '10–15 master slide decks for venture capital pitches, executive conference keynotes, and sales proposals.',
      highlights: ['Custom Data Infographics', 'Master Slide Templates', 'Editable PPTX & PDF'],
      actionLabel: 'Browse Pitch Decks',
      turnaround: '24-48h Delivery',
      onSelect: () => onSelectCategory('presentation')
    },
    // 7. Social Media Suite
    {
      id: 'social_media',
      title: 'Social Media Kits & Ads',
      categoryGroup: 'social',
      groupLabel: 'Social & Digital',
      icon: <Share2 className="w-5 h-5 text-sky-400" />,
      badge: 'IG / FB / YouTube',
      badgeColor: 'from-sky-500/20 to-blue-500/20 text-sky-300 border-sky-500/30',
      description: 'Optimized square posts (1:1), vertical stories (9:16), Facebook headers, swipe carousels, and YouTube thumbnails.',
      highlights: ['Multi-Platform Resolution', 'High CTR Visual Formats', 'Batch Campaign Kits'],
      actionLabel: 'Browse Social Suite',
      turnaround: '12-24h Turnaround',
      onSelect: () => onSelectCategory('social_media')
    },
    // 8. Vector Logos & Brand Artwork
    {
      id: 'branding_artwork',
      title: 'Vector Logos & Brand Identity',
      categoryGroup: 'branding',
      groupLabel: 'Branding & Artwork',
      icon: <Palette className="w-5 h-5 text-purple-400" />,
      badge: 'Vector Suite AI/SVG',
      badgeColor: 'from-purple-500/20 to-fuchsia-500/20 text-purple-300 border-purple-500/30',
      description: 'Full corporate brand suites, vector logos, church crests, 3D gold monograms, and master color guidelines.',
      highlights: ['Scalable Infinite Vector', 'AI, EPS, SVG, PNG Formats', 'Dark & Light Variations'],
      actionLabel: 'Browse Brand Artwork',
      turnaround: '48h Studio',
      onSelect: () => onSelectCategory('branding')
    },
    // 9. Interactive Price Calculator & Order Builder
    {
      id: 'price_calculator',
      title: 'Instant Order & Quote Builder',
      categoryGroup: 'tools',
      groupLabel: 'Studio Tools & Services',
      icon: <Calculator className="w-5 h-5 text-amber-400" />,
      badge: 'Interactive Tool',
      badgeColor: 'from-amber-500/20 to-[#d4f15d]/20 text-amber-300 border-amber-500/30',
      description: 'Configure your custom deliverables, add rush delivery, calculate live discounts, and start your order.',
      highlights: ['Real-Time Package Pricing', 'Volume Discount Slider', 'Instant Order Submission'],
      actionLabel: 'Start Order & Calculate',
      turnaround: 'Instant Quote',
      isTool: true,
      isPopular: true,
      onSelect: onOpenCalculator
    },
    // 10. Live Project & Proof Tracker
    {
      id: 'order_tracker',
      title: 'Live Project & Proof Tracker',
      categoryGroup: 'tools',
      groupLabel: 'Studio Tools & Services',
      icon: <Activity className="w-5 h-5 text-emerald-400" />,
      badge: 'Real-Time Status',
      badgeColor: 'from-emerald-500/20 to-teal-500/20 text-emerald-300 border-emerald-500/30',
      description: 'Track your active design stage from Concept to 3D Polishing, review watermarked proof drafts, and request edits.',
      highlights: ['Step-by-Step Progress Bar', 'Download Watermarked Proofs', 'Direct Revision Notes'],
      actionLabel: 'Track Active Project',
      turnaround: 'Live Cloud Sync',
      isTool: true,
      onSelect: onOpenOrderTracker
    },
    // 11. Dimensions & Pre-Press Guide
    {
      id: 'dimensions_guide',
      title: 'Print & Social Dimensions Guide',
      categoryGroup: 'tools',
      groupLabel: 'Studio Tools & Services',
      icon: <Layout className="w-5 h-5 text-blue-400" />,
      badge: '300 DPI Technical Specs',
      badgeColor: 'from-blue-500/20 to-indigo-500/20 text-blue-300 border-blue-500/30',
      description: 'Standard millimeter, inch, and pixel blueprints for A4, Letter, 4x6 flyers, bi-folds, and social media platforms.',
      highlights: ['Bleed & Safe Zone Rules', 'Aspect Ratio Comparison', 'Pre-Press Checklist'],
      actionLabel: 'View Dimensions Guide',
      turnaround: 'Studio Reference',
      isTool: true,
      onSelect: () => onSelectStudioView('dimensions')
    },
    // 12. Before/After Retouching Slider
    {
      id: 'retouching_studio',
      title: 'Photo Retouching & 3D Gold Studio',
      categoryGroup: 'tools',
      groupLabel: 'Studio Tools & Services',
      icon: <Wand2 className="w-5 h-5 text-[#bef264]" />,
      badge: 'Interactive Showcase',
      badgeColor: 'from-[#d4f15d]/20 to-emerald-500/20 text-[#bef264] border-[#d4f15d]/30',
      description: 'Drag the split-slider to inspect raw camera photos transformed into 300 DPI high-end flyer portraits and gold crests.',
      highlights: ['Skin Smoothing & Lighting', 'Complex Hair Masking', '3D Metallic Gold Shading'],
      actionLabel: 'Try Retouching Slider',
      turnaround: 'Interactive Demo',
      isTool: true,
      onSelect: () => onSelectStudioView('retouching')
    },
    // 13. Deliverables & Turnaround Matrix
    {
      id: 'package_comparison',
      title: 'Package Deliverables Matrix',
      categoryGroup: 'tools',
      groupLabel: 'Studio Tools & Services',
      icon: <FileCheck className="w-5 h-5 text-emerald-400" />,
      badge: 'Full Spec Comparison',
      badgeColor: 'from-emerald-500/20 to-teal-500/20 text-emerald-300 border-emerald-500/30',
      description: 'Side-by-side breakdown of included source files, revisions, turnaround times, and formats across all tiers.',
      highlights: ['Clear Tier Breakdown', 'Format Compatibility List', 'Revision Policy Details'],
      actionLabel: 'Compare Packages',
      turnaround: 'Studio Matrix',
      isTool: true,
      onSelect: () => onSelectStudioView('comparison')
    }
  ];

  // Filter options based on active tab and search query
  const filteredOptions = launchpadOptions.filter((opt) => {
    // Tab filter
    if (activeTab !== 'all') {
      if (activeTab === 'flyers' && opt.categoryGroup !== 'flyers') return false;
      if (activeTab === 'brochures' && opt.categoryGroup !== 'brochures') return false;
      if (activeTab === 'decks' && opt.categoryGroup !== 'decks') return false;
      if (activeTab === 'social' && opt.categoryGroup !== 'social') return false;
      if (activeTab === 'branding' && opt.categoryGroup !== 'branding') return false;
      if (activeTab === 'tools' && opt.categoryGroup !== 'tools') return false;
    }

    // Search filter
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchTitle = opt.title.toLowerCase().includes(q);
      const matchDesc = opt.description.toLowerCase().includes(q);
      const matchGroup = opt.groupLabel.toLowerCase().includes(q);
      const matchBadge = opt.badge.toLowerCase().includes(q);
      const matchHighlights = opt.highlights.some(h => h.toLowerCase().includes(q));
      return matchTitle || matchDesc || matchGroup || matchBadge || matchHighlights;
    }

    return true;
  });

  const tabList = [
    { id: 'all', label: 'All Options', count: launchpadOptions.length },
    { id: 'flyers', label: 'Flyers & Posters', count: 4 },
    { id: 'brochures', label: 'Brochures', count: 1 },
    { id: 'decks', label: 'Pitch Decks', count: 1 },
    { id: 'social', label: 'Social & Ads', count: 1 },
    { id: 'branding', label: 'Branding & Logos', count: 1 },
    { id: 'tools', label: 'Studio Tools', count: 5 },
  ];

  return (
    <div id="firebase-launchpad" className="py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#1e3a8a]/40">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#bef264] font-bold mb-1">
              <Compass className="w-4 h-4 text-[#bef264]" />
              <span>STUDIO LAUNCHPAD • DIRECT PATHWAYS</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight">
              Where would you like to start?
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl">
              Choose an option below to jump directly to whatever you need — from church flyers and pitch decks to live quote calculators and project tracking.
            </p>
          </div>

          {/* Quick Search in Options */}
          <div className="relative w-full md:w-72 shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search options, formats, tools..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#061226] border border-[#1e3a8a]/60 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-[#d4f15d] transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 hover:text-white px-1.5 py-0.5 rounded bg-[#0e2752]"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Option Tabs Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-6 scrollbar-none">
          {tabList.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-gradient-to-r from-[#1e3a8a] to-[#2563eb] text-white shadow-md shadow-blue-950/50 border border-blue-400/40'
                    : 'bg-[#071329] text-slate-300 hover:text-white hover:bg-[#0b1f42] border border-[#1e3a8a]/40'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isActive ? 'bg-white/20 text-white' : 'bg-[#050c18] text-slate-400'
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Interactive Options Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredOptions.map((option) => (
            <div
              key={option.id}
              onClick={option.onSelect}
              className="group relative rounded-2xl bg-[#07142b]/95 hover:bg-[#0b1f42] border border-[#1e3a8a]/40 hover:border-[#d4f15d]/60 p-5 transition-all duration-200 shadow-lg hover:shadow-2xl hover:shadow-black/20 flex flex-col justify-between cursor-pointer"
            >
              {/* Popular / Active Badge */}
              {option.isPopular && (
                <div className="absolute top-4 right-4 flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-[#d4f15d]/20 to-emerald-500/20 border border-[#d4f15d]/50 text-[10px] font-bold text-[#bef264] shadow-sm">
                  <Award className="w-2.5 h-2.5 text-[#bef264]" />
                  <span>Popular</span>
                </div>
              )}

              <div>
                {/* Top Row: Icon + Badge */}
                <div className="flex items-center gap-3 mb-3.5">
                  <div className="p-2.5 rounded-xl bg-[#040c1a] border border-[#1e3a8a]/60 group-hover:scale-105 group-hover:border-[#d4f15d]/50 transition-all shrink-0">
                    {option.icon}
                  </div>
                  <div className="pr-12">
                    <span className="text-[10px] font-mono text-slate-400 block uppercase tracking-wider">
                      {option.groupLabel}
                    </span>
                    <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-md border mt-0.5 ${option.badgeColor}`}>
                      {option.badge}
                    </span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-base font-black text-white group-hover:text-[#bef264] transition-colors mb-2 flex items-center gap-1.5">
                  <span>{option.title}</span>
                </h3>

                {/* Description */}
                <p className="text-slate-300 text-xs leading-relaxed mb-4">
                  {option.description}
                </p>

                {/* Highlight Checkmarks */}
                <div className="space-y-1.5 mb-5 pt-3 border-t border-[#1e3a8a]/30 text-[11px] text-slate-300 font-medium">
                  {option.highlights.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Action Footer */}
              <div className="pt-3 border-t border-[#1e3a8a]/40 flex items-center justify-between mt-auto">
                <div className="flex items-center gap-1 text-[10px] font-mono text-slate-400 font-bold">
                  <Clock className="w-3 h-3 text-[#bef264]" />
                  <span>{option.turnaround}</span>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-bold text-[#bef264] group-hover:text-white group-hover:translate-x-0.5 transition-all">
                  <span>{option.actionLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#bef264]" />
                </div>
              </div>

            </div>
          ))}
        </div>

        {filteredOptions.length === 0 && (
          <div className="text-center py-12 rounded-2xl bg-[#071329] border border-[#1e3a8a]/40 p-6">
            <Search className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-50" />
            <p className="text-sm font-bold text-slate-300">No options found matching "{searchQuery}"</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveTab('all');
              }}
              className="mt-3 px-4 py-2 rounded-xl bg-[#1e3a8a] text-white text-xs font-bold hover:bg-[#2563eb] cursor-pointer"
            >
              Reset Search & Filters
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
