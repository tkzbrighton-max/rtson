import React, { useState } from 'react';
import { 
  Search, 
  ChevronDown, 
  Filter, 
  Layers, 
  BookOpen, 
  Presentation, 
  Share2, 
  Palette, 
  Layout, 
  SlidersHorizontal,
  X,
  Check
} from 'lucide-react';
import { DesignCategory } from '../types';
import { MENU_DATA } from '../data/menuData';

interface CategoryFilterBarProps {
  selectedCategory: string;
  selectedSubType?: string;
  selectedPlatform?: string;
  onSelectCategoryAndType: (cat: string, subType?: string, platform?: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  categoryCounts: Record<string, number>;
  totalCount: number;
  filteredCount: number;
  onResetFilters: () => void;
}

export const CategoryFilterBar: React.FC<CategoryFilterBarProps> = ({
  selectedCategory,
  selectedSubType,
  selectedPlatform,
  onSelectCategoryAndType,
  searchQuery,
  onSearchChange,
  categoryCounts,
  totalCount,
  filteredCount,
  onResetFilters
}) => {
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState<boolean>(false);
  const [typeDropdownOpen, setTypeDropdownOpen] = useState<boolean>(false);
  const [platformDropdownOpen, setPlatformDropdownOpen] = useState<boolean>(false);

  const categories = [
    { id: 'all', label: 'All Artwork & Styles', icon: Layers, tag: 'All' },
    { id: 'church_flyer', label: 'Church & Gospel Flyers', icon: Layers, tag: 'Church' },
    { id: 'simple_flyer', label: 'Simple Business Flyers', icon: Layers, tag: 'Business' },
    { id: 'event_poster', label: 'Event & Nightclub Posters', icon: Layers, tag: 'Events' },
    { id: 'brochure', label: 'Brochures & Catalogs', icon: BookOpen, tag: 'Brochure' },
    { id: 'presentation', label: 'Presentations & Pitch Decks', icon: Presentation, tag: 'Pitch Deck' },
    { id: 'social_media', label: 'Social Media (IG, FB, YT)', icon: Share2, tag: 'Social' },
    { id: 'branding', label: 'Logos & Vector Branding', icon: Palette, tag: 'Brand' },
    { id: 'resume', label: 'Executive Resumes (CV)', icon: Layout, tag: 'Resume' },
  ];

  // Specific Sub-Types available across categories (clean without emojis)
  const allSubTypes = [
    { id: '', label: 'All Design Types / Formats', category: 'all' },
    // Flyers
    { id: 'church', label: 'Church & Worship 3D Flyers', category: 'church_flyer' },
    { id: 'simple', label: 'Simple Business & Promo Flyers', category: 'simple_flyer' },
    { id: 'event_club', label: 'Nightclub, DJ & Party Posters', category: 'event_poster' },
    { id: 'motion_flyer', label: 'Animated Motion Video Flyers', category: 'event_poster' },
    // Brochures
    { id: 'bi_fold', label: 'Bi-Fold Corporate Brochures (4-Panel)', category: 'brochure' },
    { id: 'tri_fold', label: 'Tri-Fold Marketing Brochures (6-Panel)', category: 'brochure' },
    { id: 'booklet', label: 'Multi-Page Profile & Catalog Booklet', category: 'brochure' },
    { id: 'gate_fold', label: 'Gate-Fold & Restaurant Menus', category: 'brochure' },
    // Presentations
    { id: 'pitch_deck', label: 'Startup Investor Pitch Decks (15-Slide)', category: 'presentation' },
    { id: 'keynote', label: 'Corporate Keynote & Board Decks', category: 'presentation' },
    { id: 'training', label: 'Training & Educational Slide Decks', category: 'presentation' },
    { id: 'sales_deck', label: 'Sales & Proposal Pitch Decks', category: 'presentation' },
    // Social Media
    { id: 'instagram_post', label: 'Instagram Square Posts (1080x1080)', category: 'social_media' },
    { id: 'instagram_story', label: 'Instagram Stories & Reel Covers (9:16)', category: 'social_media' },
    { id: 'facebook_banner', label: 'Facebook Banners & Event Covers (820x312)', category: 'social_media' },
    { id: 'facebook_ad', label: 'Facebook Feed Ads (1200x628)', category: 'social_media' },
    { id: 'carousel', label: 'Multi-Slide Educational Carousels', category: 'social_media' },
    { id: 'youtube_thumbnail', label: 'YouTube Thumbnails & Banners', category: 'social_media' },
    // Artwork & Branding
    { id: 'logo_branding', label: 'Vector Logo & Brand Identity Suites', category: 'branding' },
    { id: 'retouching', label: 'Photo Retouching & Pre-Press Cutouts', category: 'branding' },
    { id: '3d_typography', label: '3D Gold & Metallic Lettering', category: 'branding' },
    { id: 'crest_badge', label: 'Official Crests, Badges & Seals', category: 'branding' },
  ];

  // Platforms
  const platforms = [
    { id: '', label: 'All Platforms / Media' },
    { id: 'instagram', label: 'Instagram (Square & Stories)' },
    { id: 'facebook', label: 'Facebook (Banners & Ads)' },
    { id: 'youtube', label: 'YouTube (Thumbnails & Art)' },
    { id: 'print', label: 'Print Press (300 DPI High-Res)' },
  ];

  const currentCategoryObj = categories.find(c => c.id === selectedCategory) || categories[0];
  const currentSubTypeObj = allSubTypes.find(t => t.id === (selectedSubType || '')) || allSubTypes[0];
  const currentPlatformObj = platforms.find(p => p.id === (selectedPlatform || '')) || platforms[0];

  const hasActiveFilters = selectedCategory !== 'all' || !!selectedSubType || !!selectedPlatform || searchQuery.trim() !== '';

  return (
    <div id="category-filter-section" className="bg-black/95 backdrop-blur-md py-3.5 border-b border-neutral-800 sticky top-16 sm:top-20 z-30 shadow-lg text-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Controls Container */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          
          {/* Dropdown Selectors Group */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            
            {/* 1. Category Dropdown Menu */}
            <div className="relative">
              <button
                onClick={() => {
                  setCategoryDropdownOpen(!categoryDropdownOpen);
                  setTypeDropdownOpen(false);
                  setPlatformDropdownOpen(false);
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border shadow-sm ${
                  selectedCategory !== 'all'
                    ? 'bg-[#d4f15d] text-slate-950 border-[#d4f15d] font-black shadow-md'
                    : 'bg-neutral-900 text-slate-200 hover:bg-neutral-800 border-neutral-700 hover:border-[#d4f15d]/60'
                }`}
              >
                <Filter className="w-3.5 h-3.5 text-[#d4f15d]" />
                <span className="max-w-[150px] truncate">{currentCategoryObj.label}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${categoryDropdownOpen ? 'rotate-180 text-[#d4f15d]' : ''}`} />
              </button>

              {categoryDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-neutral-950 border border-neutral-800 rounded-2xl p-2 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="text-[10px] font-bold text-[#bef264] uppercase tracking-wider px-3 py-1.5 border-b border-neutral-800 mb-1">
                    Select Design Category
                  </div>
                  <div className="max-h-64 overflow-y-auto space-y-1">
                    {categories.map((cat) => {
                      const count = categoryCounts[cat.id] || 0;
                      const isSelected = selectedCategory === cat.id;

                      return (
                        <button
                          key={cat.id}
                          onClick={() => {
                            onSelectCategoryAndType(cat.id, undefined, selectedPlatform);
                            setCategoryDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-[#d4f15d] text-slate-950 font-black'
                              : 'text-slate-300 hover:bg-neutral-900 hover:text-[#d4f15d]'
                          }`}
                        >
                          <span className="truncate">{cat.label}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-black text-[#bef264] font-mono ml-2 border border-neutral-800">
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* 2. Type / Format Sub-Filter Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setTypeDropdownOpen(!typeDropdownOpen);
                  setCategoryDropdownOpen(false);
                  setPlatformDropdownOpen(false);
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border shadow-sm ${
                  selectedSubType
                    ? 'bg-[#d4f15d] text-slate-950 border-[#d4f15d] font-black shadow-md'
                    : 'bg-neutral-900 text-slate-200 hover:bg-neutral-800 border-neutral-700 hover:border-[#d4f15d]/60'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#d4f15d]" />
                <span className="max-w-[160px] truncate">{currentSubTypeObj.label}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${typeDropdownOpen ? 'rotate-180 text-[#d4f15d]' : ''}`} />
              </button>

              {typeDropdownOpen && (
                <div className="absolute top-full left-0 sm:left-auto mt-2 w-72 sm:w-80 bg-neutral-950 border border-neutral-800 rounded-2xl p-2 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="text-[10px] font-bold text-[#bef264] uppercase tracking-wider px-3 py-1.5 border-b border-neutral-800 mb-1 flex items-center justify-between">
                    <span>Filter By Specific Type</span>
                    <span className="text-white">All Formats</span>
                  </div>
                  <div className="max-h-72 overflow-y-auto space-y-1">
                    {allSubTypes.map((sub) => {
                      const isSelected = (selectedSubType || '') === sub.id;

                      return (
                        <button
                          key={sub.id}
                          onClick={() => {
                            const newCategory = sub.category !== 'all' ? sub.category : selectedCategory;
                            onSelectCategoryAndType(newCategory, sub.id || undefined, selectedPlatform);
                            setTypeDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-[#d4f15d] text-slate-950 font-black'
                              : 'text-slate-300 hover:bg-neutral-900 hover:text-[#d4f15d]'
                          }`}
                        >
                          <span className="truncate pr-2">{sub.label}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* 3. Platform Filter Dropdown (Instagram, Facebook, YouTube, Print) */}
            <div className="relative">
              <button
                onClick={() => {
                  setPlatformDropdownOpen(!platformDropdownOpen);
                  setCategoryDropdownOpen(false);
                  setTypeDropdownOpen(false);
                }}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border shadow-sm ${
                  selectedPlatform
                    ? 'bg-[#d4f15d] text-slate-950 border-[#d4f15d] font-black'
                    : 'bg-neutral-900 text-slate-300 hover:bg-neutral-800 border-neutral-700 hover:border-[#d4f15d]/60'
                }`}
              >
                <Share2 className="w-3.5 h-3.5 text-[#d4f15d]" />
                <span className="max-w-[120px] truncate">{currentPlatformObj.label}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${platformDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {platformDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-neutral-950 border border-neutral-800 rounded-2xl p-2 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="text-[10px] font-bold text-[#bef264] uppercase tracking-wider px-3 py-1.5 border-b border-neutral-800 mb-1">
                    Select Target Platform
                  </div>
                  <div className="space-y-1">
                    {platforms.map((plat) => {
                      const isSelected = (selectedPlatform || '') === plat.id;

                      return (
                        <button
                          key={plat.id}
                          onClick={() => {
                            onSelectCategoryAndType(selectedCategory, selectedSubType, plat.id || undefined);
                            setPlatformDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-[#d4f15d] text-slate-950 font-black'
                              : 'text-slate-300 hover:bg-neutral-900 hover:text-[#d4f15d]'
                          }`}
                        >
                          <span>{plat.label}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Search Box with Clear & Results Badge */}
          <div className="flex items-center gap-2 w-full lg:w-auto min-w-[260px] lg:min-w-[320px]">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#d4f15d] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search style (e.g. Facebook cover, 3D Gold, Bi-fold)..."
                className="w-full pl-10 pr-8 py-2 bg-neutral-900 border border-neutral-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#d4f15d] focus:ring-1 focus:ring-[#d4f15d]/50 transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs font-bold p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Results Count Badge */}
            <div className="px-2.5 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-[11px] font-mono font-bold text-slate-300 shrink-0">
              <span className="text-[#d4f15d]">{filteredCount}</span>/{totalCount}
            </div>
          </div>

        </div>

        {/* Active Filter Chips Bar (Shown when active filters exist) */}
        {hasActiveFilters && (
          <div className="mt-3 pt-2.5 border-t border-neutral-800 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold text-slate-400">Active Filters:</span>

            {selectedCategory !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#d4f15d]/20 border border-[#d4f15d]/40 text-[#bef264] text-xs font-bold">
                Category: {currentCategoryObj.label}
                <button 
                  onClick={() => onSelectCategoryAndType('all', selectedSubType, selectedPlatform)}
                  className="hover:text-white ml-1 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedSubType && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#d4f15d] text-slate-950 border border-[#bef264] text-xs font-black shadow-xs">
                Type: {currentSubTypeObj.label}
                <button 
                  onClick={() => onSelectCategoryAndType(selectedCategory, undefined, selectedPlatform)}
                  className="hover:text-slate-700 ml-1 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedPlatform && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-neutral-900 border border-neutral-700 text-[#bef264] text-xs font-bold">
                Platform: {currentPlatformObj.label}
                <button 
                  onClick={() => onSelectCategoryAndType(selectedCategory, selectedSubType, undefined)}
                  className="hover:text-white ml-1 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {searchQuery.trim() !== '' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-neutral-900 border border-neutral-700 text-slate-300 text-xs font-bold">
                Search: "{searchQuery}"
                <button 
                  onClick={() => onSearchChange('')}
                  className="hover:text-white ml-1 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            <button
              onClick={onResetFilters}
              className="text-[11px] font-bold text-[#d4f15d] hover:text-[#bef264] underline cursor-pointer ml-auto"
            >
              Reset All Filters
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
