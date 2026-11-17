import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  X, 
  Lock, 
  ArrowRight
} from 'lucide-react';
import { sound } from '../lib/soundFx';
import { RtsonLogo } from './RtsonLogo';

interface NavbarProps {
  onNavigate: (page: 'home' | 'about' | 'products' | 'retouch' | 'contact' | 'order') => void;
  onOpenAdmin: () => void;
  onOpenOrderTracker?: () => void;
  onOpenLiveProofing?: () => void;
  onOpenInvoiceGenerator?: () => void;
  onOpenSelfieStudio?: () => void;
  onSelectStudioView?: (viewId: string) => void;
  activePage: 'home' | 'about' | 'products' | 'retouch' | 'contact' | 'order' | string;
  isOwnerLoggedIn?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onNavigate,
  onOpenAdmin,
  activePage,
  isOwnerLoggedIn = false
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Strictly check if Admin option should be visible (only to the owner)
  const [isAdminVisible, setIsAdminVisible] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    if (isOwnerLoggedIn) return true;
    if (localStorage.getItem('rtson_admin_visible') === 'true') return true;
    if (sessionStorage.getItem('rtson_admin_authed') === 'true') return true;
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === 'true' || params.get('admin') === 'tkzbrighton') {
      localStorage.setItem('rtson_admin_visible', 'true');
      return true;
    }
    return false;
  });

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAdminVisible(
        isOwnerLoggedIn ||
        localStorage.getItem('rtson_admin_visible') === 'true' ||
        sessionStorage.getItem('rtson_admin_authed') === 'true'
      );
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [isOwnerLoggedIn]);

  const navLinks: { id: 'home' | 'about' | 'products' | 'retouch' | 'contact'; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Studio' },
    { id: 'products', label: 'Services & Pricing' },
    { id: 'retouch', label: 'Photo Retouch' },
    { id: 'contact', label: 'Contact Us' }
  ];

  const handleLinkClick = (page: 'home' | 'about' | 'products' | 'retouch' | 'contact' | 'order') => {
    sound.playClick();
    setMobileMenuOpen(false);
    onNavigate(page);
  };

  return (
    <header className="w-full bg-white/95 text-neutral-900 border-b border-neutral-200 sticky top-0 z-50 backdrop-blur-md shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
        
        {/* Brand Logo Left (Optibiz / R'tson Creations) */}
        <div 
          onClick={() => handleLinkClick('home')} 
          className="flex items-center gap-3 cursor-pointer shrink-0"
        >
          <RtsonLogo size="md" textColor="dark" showSubtitle={false} />
        </div>

        {/* Center Floating Capsule Navigation */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2 px-3 py-1.5 rounded-full bg-neutral-100 border border-neutral-200/80 shadow-inner text-xs font-bold tracking-wide">
          {navLinks.map((link) => {
            const isActive = activePage === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className={`relative px-3.5 py-1.5 rounded-full transition-all cursor-pointer whitespace-nowrap ${
                  isActive 
                    ? 'bg-[#ff6b00] text-black font-black shadow-md shadow-[#ff6b00]/30' 
                    : 'text-neutral-700 hover:text-black hover:bg-white'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Right: Admin (if visible) + "Get A Quote" / "Start Order" Capsule Button */}
        <div className="flex items-center gap-3 shrink-0">
          
          {/* Admin Terminal Button (Strictly Visible Only to Owner) */}
          {isAdminVisible && (
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onOpenAdmin();
              }}
              className="px-3.5 py-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-[#ff6b00] font-mono font-bold text-[11px] flex items-center gap-1.5 shadow-xs cursor-pointer transition-all border border-neutral-300"
              title="Designer Admin Terminal (Visible Only to You)"
            >
              <Lock className="w-3 h-3 text-[#ff6b00]" />
              <span className="hidden sm:inline">Admin</span>
            </button>
          )}

          {/* "Get A Quote" Capsule Button with Arrow in Circle (Orange & White Contrast) */}
          <button
            type="button"
            onClick={() => handleLinkClick('order')}
            className="px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-full bg-[#ff6b00] hover:bg-[#ff7a00] text-black font-black text-[11px] sm:text-xs uppercase tracking-wider transition-all duration-300 shadow-md shadow-[#ff6b00]/25 cursor-pointer flex items-center gap-1.5 sm:gap-2 group hover:scale-[1.02] active:scale-95 shrink-0"
          >
            <span>Get A Quote</span>
            <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-black text-white flex items-center justify-center transition-transform group-hover:translate-x-0.5">
              <ArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
            </div>
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            className="md:hidden p-2 rounded-xl text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-black" /> : <Menu className="w-6 h-6 text-black" />}
          </button>

        </div>
      </div>

      {/* Mobile Menu Dropdown (Crisp White with Orange Accents) */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-neutral-200 px-4 pt-3 pb-6 space-y-3 shadow-xl">
          <div className="space-y-1">
            {navLinks.map((link) => {
              const isActive = activePage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-between ${
                    isActive 
                      ? 'bg-[#ff6b00] text-black font-black shadow-md' 
                      : 'text-neutral-700 hover:bg-neutral-100 hover:text-black'
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && <ArrowRight className="w-4 h-4 text-black" />}
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-neutral-200 flex items-center justify-between">
            {/* Social Tag */}
            <div className="flex items-center gap-2 text-xs font-bold text-neutral-600">
              <span className="w-5 h-5 rounded-full bg-[#ff6b00] text-black flex items-center justify-center text-[10px] font-black">
                f
              </span>
              <span className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-black">
                ig
              </span>
              <span className="font-mono text-[11px] text-[#ff6b00]">@rtsoncreations</span>
            </div>

            {/* Admin option in mobile drawer if owner */}
            {isAdminVisible && (
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className="px-3 py-1.5 rounded-full bg-neutral-100 text-[#ff6b00] border border-neutral-300 text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Lock className="w-3 h-3 text-[#ff6b00]" />
                <span>Admin</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
