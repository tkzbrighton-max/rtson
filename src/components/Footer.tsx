import React, { useState, useEffect } from 'react';
import { 
  PhoneCall, 
  Mail, 
  MessageSquare, 
  MapPin,
  Clock, 
  Lock, 
  Printer
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { sound } from '../lib/soundFx';
import { RtsonLogo } from './RtsonLogo';

interface FooterProps {
  onSelectCategory: (cat: string) => void;
  onOpenCalculator: () => void;
  onNavigate?: (page: 'home' | 'about' | 'products' | 'retouch' | 'contact' | 'order') => void;
  onOpenIntegrations?: () => void;
  onOpenAdmin?: () => void;
  onReplaySplash?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onOpenCalculator,
  onNavigate,
  onOpenIntegrations,
  onOpenAdmin,
  onReplaySplash
}) => {
  const { theme } = useTheme();

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

  return (
    <footer id="app-footer" className="relative z-10 bg-[#12151a] text-slate-300 border-t border-white/10 pt-14 pb-0 overflow-hidden shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 space-y-12">
        
        {/* Top Studio Grid: Bio, Service Directory & Direct Contact */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Brand & Studio Mission */}
          <div className="md:col-span-5 space-y-4">
            <RtsonLogo size="lg" textColor="light" showSubtitle={true} />

            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Professional full-stack software and graphic design studio specializing in Corporate Websites, Custom Web Apps, Mobile UI/UX, 3D Church Posters, Brand Identities, and Pre-Press Print Art.
            </p>

            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300 pt-1">
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#181c24] border border-white/10 text-[11px] text-zinc-300">
                <Clock className="w-3.5 h-3.5 text-[#ff6b00]" /> Dedicated Craftsmanship
              </span>
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#181c24] border border-white/10 text-[11px] text-zinc-300">
                <Printer className="w-3.5 h-3.5 text-[#ff6b00]" /> 300 DPI Pre-Press Ready
              </span>
            </div>
          </div>

          {/* Product & Service Directory */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff6b00]"></span>
              Studio Catalogue
            </h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li>
                <button
                  onClick={() => onSelectCategory('all')}
                  className="hover:text-[#ff6b00] transition-colors cursor-pointer text-left"
                >
                  All Showcase Artwork
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('church_flyer')}
                  className="hover:text-[#ff6b00] transition-colors cursor-pointer text-left text-zinc-300"
                >
                  Church & Ministry 3D Flyers
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('website_design')}
                  className="hover:text-[#ff6b00] transition-colors cursor-pointer text-left"
                >
                  Websites & Landing Pages
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('web_app')}
                  className="hover:text-[#ff6b00] transition-colors cursor-pointer text-left"
                >
                  Custom Web Applications
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('mobile_app')}
                  className="hover:text-[#ff6b00] transition-colors cursor-pointer text-left"
                >
                  Mobile App UI/UX
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('branding')}
                  className="hover:text-[#ff6b00] transition-colors cursor-pointer text-left"
                >
                  Vector Logos & Branding
                </button>
              </li>
            </ul>
          </div>

          {/* Direct WhatsApp & Studio Channels */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff6b00]"></span>
              Direct Communication Desk
            </h4>
            
            <div className="space-y-2 text-xs">
              <a
                href="mailto:info@rtsoncreations.co.zw?subject=Studio%20Inquiry%20from%20Footer"
                onClick={() => sound.playChime()}
                className="flex items-center gap-2.5 p-3 rounded-xl bg-[#ff6b00] hover:bg-[#ff7a00] text-black font-black transition-all cursor-pointer shadow-md shadow-[#ff6b00]/20 min-h-[44px]"
              >
                <Mail className="w-4 h-4 text-black shrink-0" />
                <span className="lowercase font-mono text-xs font-black">info@rtsoncreations.co.zw</span>
              </a>

              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-zinc-300">
                <MapPin className="w-4 h-4 text-[#ff6b00] shrink-0" />
                <span>Harare, Zimbabwe • Worldwide Delivery</span>
              </div>
            </div>

            {onNavigate && (
              <div className="flex flex-col sm:flex-row gap-2 pt-1">
                <button
                  onClick={() => onNavigate('contact')}
                  className="flex-1 text-center py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer bg-neutral-900 border border-neutral-700 text-white hover:border-[#ff6b00] hover:text-[#ff6b00] min-h-[44px]"
                >
                  Contact Us
                </button>
                <button
                  onClick={() => onNavigate('order')}
                  className="flex-1 text-center py-2.5 px-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer bg-[#ff6b00] hover:bg-[#ff7a00] text-black shadow-sm min-h-[44px]"
                >
                  Start Order
                </button>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Bottom Layer: Pure White Background Bar with Copyright & Studio Links */}
      <div className="w-full bg-white text-slate-900 border-t border-slate-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="text-slate-900 font-bold tracking-tight">
            © {new Date().getFullYear()} R'tson Creations. All Rights Reserved. Graphic Design & Full-Stack Studio.
          </div>

          <div className="flex flex-wrap items-center gap-4 text-slate-700 font-semibold">
            {onReplaySplash && (
              <button
                type="button"
                onClick={onReplaySplash}
                className="hover:text-black transition-colors cursor-pointer text-[11px]"
              >
                Replay Intro
              </button>
            )}
            <button
              type="button"
              onClick={onOpenCalculator}
              className="hover:text-black transition-colors cursor-pointer text-[11px]"
            >
              Order Calculator
            </button>
            {onOpenIntegrations && (
              <button
                type="button"
                onClick={onOpenIntegrations}
                className="hover:text-black transition-colors cursor-pointer text-[11px]"
              >
                Integrations
              </button>
            )}
            {isAdminVisible && onOpenAdmin && (
              <button
                type="button"
                onClick={onOpenAdmin}
                className="flex items-center gap-1 text-slate-700 hover:text-black transition-colors cursor-pointer text-[11px]"
                title="Designer Admin Portal (Owner Only)"
              >
                <Lock className="w-3.5 h-3.5 text-slate-800" />
                <span>Designer Admin</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
