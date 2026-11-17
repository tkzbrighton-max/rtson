import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Info, 
  Layers, 
  Wand2, 
  ShoppingBag, 
  Lock,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { sound } from '../lib/soundFx';
import { RtsonLogo } from './RtsonLogo';

interface MobileBottomNavProps {
  activePage: 'home' | 'about' | 'products' | 'retouch' | 'contact' | 'order' | string;
  onNavigate: (page: 'home' | 'about' | 'products' | 'retouch' | 'contact' | 'order') => void;
  onOpenAdmin?: () => void;
  isOwnerLoggedIn?: boolean;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activePage,
  onNavigate,
  onOpenAdmin,
  isOwnerLoggedIn = false
}) => {
  // Check if Admin terminal should be visible to Brighton
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

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'about', label: 'About', icon: Info },
    { id: 'products', label: 'Services', icon: Layers },
    { id: 'retouch', label: 'Retouch', icon: Wand2 },
    { id: 'contact', label: 'Contact', icon: MessageSquare },
    { id: 'order', label: 'Order', icon: ShoppingBag, isOrder: true }
  ];

  return (
    <nav 
      id="studio-dock-nav" 
      aria-label="Studio Navigation"
      className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none pb-[env(safe-area-inset-bottom)] sm:pb-4"
    >
      <div className="max-w-5xl mx-auto px-2 sm:px-4 flex items-center justify-center">
        
        {/* Floating Navigation Dock: Clean White theme with Orange #ff6b00 & Dark Charcoal contrast */}
        <div className="pointer-events-auto w-full sm:w-auto flex items-center justify-between sm:justify-center gap-1 sm:gap-3 px-2 sm:px-4 py-1.5 sm:py-2 rounded-2xl sm:rounded-full bg-white/95 backdrop-blur-xl border border-neutral-200/90 shadow-[0_8px_30px_rgba(0,0,0,0.12),0_0_15px_rgba(255,107,0,0.12)]">
          
          {/* Brand Logo (Visible on Tablet & Desktop) */}
          <div 
            onClick={() => {
              sound.playClick();
              onNavigate('home');
            }}
            className="hidden md:flex items-center pr-3 border-r border-neutral-200 cursor-pointer transition-transform hover:scale-105"
            title="Rtson Creations Home"
          >
            <RtsonLogo size="sm" textColor="dark" showSubtitle={false} />
          </div>

          {/* Core Navigation Items */}
          <div className="grid grid-cols-6 sm:flex sm:items-center gap-0.5 sm:gap-2 flex-1 sm:flex-initial">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;

              if (item.isOrder) {
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      sound.playClick();
                      onNavigate(item.id as any);
                    }}
                    className="min-h-[44px] flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-full bg-[#ff6b00] hover:bg-[#ff7a00] text-black font-black text-xs transition-all shadow-md shadow-[#ff6b00]/30 hover:scale-105 active:scale-95 cursor-pointer touch-manipulation"
                  >
                    <Icon className="w-4 h-4 text-black" />
                    <span className="text-[10px] sm:text-xs tracking-wide uppercase font-black text-black">
                      {item.label}
                    </span>
                  </button>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    sound.playClick();
                    onNavigate(item.id as any);
                  }}
                  className={`min-h-[44px] flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3.5 py-1.5 sm:py-2 rounded-xl sm:rounded-full text-xs font-bold transition-all cursor-pointer touch-manipulation ${
                    isActive 
                      ? 'bg-neutral-100 border border-[#ff6b00] text-[#ff6b00] shadow-xs' 
                      : 'text-neutral-700 hover:text-black hover:bg-neutral-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#ff6b00]' : 'text-neutral-500'}`} />
                  <span className={`text-[10px] sm:text-xs tracking-tight ${isActive ? 'font-black text-[#ff6b00]' : 'font-semibold'}`}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Admin Terminal Button for Brighton (Visible when unlocked) */}
          {isAdminVisible && onOpenAdmin && (
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onOpenAdmin();
              }}
              className="hidden lg:flex items-center gap-1.5 ml-2 pl-3 border-l border-neutral-200 px-3 py-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 text-[#ff6b00] hover:text-black font-mono text-[11px] font-bold transition-all cursor-pointer"
              title="Designer Admin Terminal"
            >
              <Lock className="w-3 h-3 text-[#ff6b00]" />
              <span>Admin</span>
            </button>
          )}

        </div>

      </div>
    </nav>
  );
};
