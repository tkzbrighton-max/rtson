import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Search, 
  ChevronRight, 
  ChevronDown, 
  Layers, 
  BookOpen, 
  Presentation, 
  Share2, 
  Palette, 
  Layout, 
  Calculator, 
  Wand2, 
  PlaySquare, 
  FileCheck, 
  Clock, 
  MessageSquare, 
  Mail,
  Lock, 
  PenTool,
  CheckCircle2,
  Zap,
  ArrowRight,
  SlidersHorizontal,
  Award
} from 'lucide-react';
import { MENU_DATA, STUDIO_TOOLS, MenuItemType, MenuGroup } from '../data/menuData';
import { RtsonLogo } from './RtsonLogo';

interface StudioDrawerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  activeView: string;
  activeCategory: string;
  activeSubType?: string;
  onSelectPortfolioCategory: (category: string, subType?: string, platform?: string) => void;
  onSelectStudioView: (viewId: string) => void;
  onOpenOrderTracker: () => void;
  onOpenAdmin: () => void;
}

export const StudioDrawerMenu: React.FC<StudioDrawerMenuProps> = ({
  isOpen,
  onClose,
  activeView,
  activeCategory,
  activeSubType,
  onSelectPortfolioCategory,
  onSelectStudioView,
  onOpenOrderTracker,
  onOpenAdmin
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedGroup, setExpandedGroup] = useState<string | null>('flyers');
  const drawerRef = useRef<HTMLDivElement>(null);

  const [isAdminVisible, setIsAdminVisible] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('rtson_admin_visible') === 'true' || 
           sessionStorage.getItem('rtson_admin_authed') === 'true';
  });

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAdminVisible(
        localStorage.getItem('rtson_admin_visible') === 'true' ||
        sessionStorage.getItem('rtson_admin_authed') === 'true'
      );
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const getGroupIcon = (iconName: string) => {
    switch (iconName) {
      case 'Layers': return <Layers className="w-4 h-4 text-[#d4f15d]" />;
      case 'BookOpen': return <BookOpen className="w-4 h-4 text-blue-400" />;
      case 'Presentation': return <Presentation className="w-4 h-4 text-amber-400" />;
      case 'Share2': return <Share2 className="w-4 h-4 text-sky-400" />;
      case 'Palette': return <Palette className="w-4 h-4 text-[#d4f15d]" />;
      case 'Layout': return <Layout className="w-4 h-4 text-purple-400" />;
      default: return <PenTool className="w-4 h-4 text-[#d4f15d]" />;
    }
  };

  const getToolIcon = (iconName: string) => {
    switch (iconName) {
      case 'Calculator': return <Calculator className="w-4 h-4 text-amber-400" />;
      case 'Layout': return <Layout className="w-4 h-4 text-blue-400" />;
      case 'Wand2': return <Wand2 className="w-4 h-4 text-[#d4f15d]" />;
      case 'PlaySquare': return <PlaySquare className="w-4 h-4 text-rose-400" />;
      case 'FileCheck': return <FileCheck className="w-4 h-4 text-emerald-400" />;
      case 'Award': return <Award className="w-4 h-4 text-yellow-400" />;
      case 'Clock': return <Clock className="w-4 h-4 text-blue-400" />;
      default: return <PenTool className="w-4 h-4 text-[#d4f15d]" />;
    }
  };

  const handleCategoryItemClick = (item: MenuItemType) => {
    onSelectPortfolioCategory(item.category, item.subType, item.platform);
    onClose();
  };

  const handleToolViewClick = (toolAction: string) => {
    if (toolAction === 'order_tracker') {
      onClose();
      onOpenOrderTracker();
      return;
    }
    onSelectStudioView(toolAction);
    onClose();
  };

  // Filtered menu items if search query is typed
  const filteredGroups = MENU_DATA.map(group => {
    if (!searchQuery.trim()) return group;
    const matchesGroup = group.label.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         group.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchedItems = group.items.filter(item => 
      item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.badge && item.badge.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    if (matchesGroup || matchedItems.length > 0) {
      return {
        ...group,
        items: matchedItems.length > 0 ? matchedItems : group.items
      };
    }
    return null;
  }).filter(Boolean) as MenuGroup[];

  return (
    <div className="fixed inset-0 z-50 flex">
      
      {/* Backdrop overlay */}
      <div 
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Slide-in Top-Left Drawer */}
      <div 
        ref={drawerRef}
        className="relative w-full max-w-md sm:max-w-lg bg-[#061021] border-r border-[#1e3a8a]/50 text-white shadow-2xl shadow-black flex flex-col h-full z-10 animate-in slide-in-from-left duration-250"
      >
        
        {/* Drawer Header with Brand & Close Button */}
        <div className="p-4 sm:p-5 border-b border-[#1e3a8a]/40 bg-gradient-to-r from-[#091b38] via-[#0b2246] to-[#1c0d06] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <RtsonLogo size="sm" textColor="light" showSubtitle={true} />
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#091834] hover:bg-[#0e244d] border border-[#1e3a8a]/50 text-slate-300 hover:text-white transition-colors cursor-pointer"
            aria-label="Close Navigation Menu"
          >
            <X className="w-5 h-5 text-[#d4f15d]" />
          </button>
        </div>

        {/* Search inside Menu */}
        <div className="p-3 sm:p-4 border-b border-[#1e3a8a]/30 bg-[#050d1a]">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search design style, size, or tool..."
              className="w-full pl-10 pr-4 py-2 bg-[#091834] border border-[#1e3a8a]/50 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#d4f15d] transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs font-bold"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Scrollable Navigation Options Body */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-5">
          
          {/* Quick All Designs Trigger */}
          <div>
            <button
              onClick={() => {
                onSelectPortfolioCategory('all');
                onClose();
              }}
              className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                activeView === 'portfolio' && activeCategory === 'all' && !activeSubType
                  ? 'bg-gradient-to-r from-[#1e3a8a] via-[#2563eb] to-[#1e3a8a] border-blue-400 text-white shadow-lg'
                  : 'bg-[#091834] hover:bg-[#0e244d] border-[#1e3a8a]/50 text-slate-200 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#071329] border border-blue-500/40 flex items-center justify-center">
                  <Layers className="w-4 h-4 text-[#d4f15d]" />
                </div>
                <div>
                  <div className="text-xs font-black uppercase tracking-wider">All Artwork Portfolio</div>
                  <div className="text-[10px] text-slate-300">View complete gallery across all design types</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#d4f15d]" />
            </button>
          </div>

          {/* Section 1: Design Categories & Sub-Types (Guides what displays) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-[#d4f15d]" />
                Design Style Categories
              </span>
              <span className="text-[10px] font-bold text-[#d4f15d]">Click to Display</span>
            </div>

            <div className="space-y-1.5">
              {filteredGroups.map((group) => {
                const isGroupExpanded = expandedGroup === group.id || searchQuery.trim() !== '';
                const isGroupActive = activeView === 'portfolio' && (activeCategory === group.category || 
                  (group.id === 'flyers' && (activeCategory === 'church_flyer' || activeCategory === 'simple_flyer' || activeCategory === 'event_poster')));

                return (
                  <div 
                    key={group.id} 
                    className="rounded-2xl bg-[#08152e] border border-[#1e3a8a]/40 overflow-hidden transition-all"
                  >
                    {/* Group Accordion Header */}
                    <button
                      onClick={() => setExpandedGroup(isGroupExpanded && searchQuery.trim() === '' ? null : group.id)}
                      className={`w-full p-3 flex items-center justify-between text-left transition-colors cursor-pointer ${
                        isGroupActive
                          ? 'bg-[#0d2654] text-[#d4f15d] font-black'
                          : 'hover:bg-[#0c1f44] text-slate-200 font-bold'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="p-1.5 rounded-lg bg-[#061226] border border-[#1e3a8a]/40 shrink-0">
                          {getGroupIcon(group.icon)}
                        </div>
                        <div className="min-w-0">
                          <span className="text-xs truncate block">{group.label}</span>
                          <span className="text-[10px] text-slate-400 block font-normal truncate">{group.description}</span>
                        </div>
                      </div>
                      <ChevronDown className={`w-4 h-4 shrink-0 transition-transform text-slate-400 ${isGroupExpanded ? 'rotate-180 text-[#d4f15d]' : ''}`} />
                    </button>

                    {/* Sub-Items List */}
                    {isGroupExpanded && (
                      <div className="p-2 space-y-1 bg-[#050e1f] border-t border-[#1e3a8a]/30">
                        {group.items.map((item) => {
                          const isItemActive = activeView === 'portfolio' && activeCategory === item.category && activeSubType === item.subType;

                          return (
                            <button
                              key={item.id}
                              onClick={() => handleCategoryItemClick(item)}
                              className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-start justify-between group cursor-pointer border ${
                                isItemActive
                                  ? 'bg-gradient-to-r from-[#0d2754] to-[#1c3870] border-[#d4f15d]/50 text-white font-bold'
                                  : 'hover:bg-[#091b3b] border-transparent hover:border-[#1e3a8a]/40 text-slate-300 hover:text-white'
                              }`}
                            >
                              <div className="min-w-0 pr-2">
                                <div className="flex items-center gap-2">
                                  <span className="truncate group-hover:text-[#d4f15d] transition-colors">
                                    {item.label}
                                  </span>
                                  {item.badge && (
                                    <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-[#0a1f42] text-[#d4f15d] border border-[#d4f15d]/40 shrink-0">
                                      {item.badge}
                                    </span>
                                  )}
                                </div>
                                <p className="text-[10px] text-slate-400 truncate mt-0.5">
                                  {item.description}
                                </p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: Studio Tools & Pages (Direct Page Display) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Wand2 className="w-3.5 h-3.5 text-[#d4f15d]" />
                Studio Pages & Tools
              </span>
              <span className="text-[10px] font-bold text-blue-400">Direct View</span>
            </div>

            <div className="grid grid-cols-1 gap-1.5">
              {STUDIO_TOOLS.map((tool) => {
                const isToolActive = activeView === tool.action;

                return (
                  <button
                    key={tool.id}
                    onClick={() => handleToolViewClick(tool.action)}
                    className={`w-full p-2.5 rounded-xl text-left transition-all flex items-center gap-3 border cursor-pointer ${
                      isToolActive
                        ? 'bg-gradient-to-r from-[#1e3a8a] to-[#2563eb] border-blue-400 text-white font-bold shadow-md'
                        : 'bg-[#08152e] hover:bg-[#0c1f44] border-[#1e3a8a]/40 text-slate-200 hover:text-white'
                    }`}
                  >
                    <div className="p-2 rounded-lg bg-[#061226] border border-[#1e3a8a]/50 shrink-0">
                      {getToolIcon(tool.iconName)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold truncate flex items-center justify-between">
                        <span>{tool.label}</span>
                        {isToolActive && (
                          <span className="text-[9px] bg-white/20 px-1.5 py-0.5 rounded font-black">Active</span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">
                        {tool.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Direct Actions & Communication */}
          <div className="p-3 rounded-2xl bg-[#071733] border border-[#1e3a8a]/40 space-y-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block px-1">
              Direct Contact & Studio Portals
            </span>

            <div className="grid grid-cols-2 gap-2">
              <a
                href="mailto:info@rtsoncreations.co.zw?subject=Studio%20Inquiry%20from%20Drawer%20Menu"
                className="p-2.5 rounded-xl bg-[#d4f15d] hover:bg-[#bef264] text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-md transition-all"
                title="Send message to info@rtsoncreations.co.zw"
              >
                <Mail className="w-3.5 h-3.5 text-slate-950" />
                <span>Email Info Desk</span>
              </a>

              {isAdminVisible && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenAdmin();
                  }}
                  className="p-2.5 rounded-xl bg-gradient-to-r from-slate-900 to-[#0d2248] border border-[#d4f15d]/60 text-[#d4f15d] hover:text-white font-black text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
                  title="Designer Admin (Owner Only)"
                >
                  <Lock className="w-3.5 h-3.5 text-[#d4f15d]" />
                  <span>Designer Admin</span>
                </button>
              )}
            </div>
          </div>

        </div>

        {/* Drawer Footer with Quick Info Desk */}
        <div className="p-3 bg-[#040a14] border-t border-[#1e3a8a]/40 flex items-center justify-between text-[11px] text-slate-400">
          <span>Harare, Zimbabwe • Worldwide</span>
          <a
            href="mailto:info@rtsoncreations.co.zw"
            className="text-[#d4f15d] hover:text-[#bef264] font-bold flex items-center gap-1 cursor-pointer"
            title="Email info@rtsoncreations.co.zw"
          >
            <Mail className="w-3 h-3" />
            <span>info@rtsoncreations.co.zw</span>
          </a>
        </div>

      </div>
    </div>
  );
};
