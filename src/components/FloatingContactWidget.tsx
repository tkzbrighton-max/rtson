import React, { useState } from 'react';
import { MessageSquare, Mail, X, ExternalLink, Clock, Phone } from 'lucide-react';
import { sound } from '../lib/soundFx';

interface FloatingContactWidgetProps {
  onOpenOrderTracker?: () => void;
}

export const FloatingContactWidget: React.FC<FloatingContactWidgetProps> = ({ onOpenOrderTracker }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-3 sm:right-6 z-40 flex flex-col items-end">
      
      {/* Expanded Quick Contact Card in Electric Orange, Obsidian Black & White */}
      {isOpen && (
        <div 
          className="mb-3 w-[calc(100vw-1.5rem)] sm:w-80 max-w-[320px] p-3.5 sm:p-4 rounded-3xl bg-[#141720]/95 border border-[#ff6b00]/50 shadow-2xl backdrop-blur-2xl text-white space-y-3 animate-slide-in-right"
        >
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full inline-block bg-[#ff6b00] animate-pulse" />
              <span className="text-xs font-black text-white uppercase tracking-wider">
                Direct Studio Desk
              </span>
            </div>
            <button
              onClick={() => {
                sound.playClick();
                setIsOpen(false);
              }}
              className="p-1.5 rounded-xl hover:bg-[#1e232d] text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Directly message the lead designer for website projects, brand flyers, and photo retouching.
          </p>

          <div className="space-y-2 pt-1 text-xs">
            {/* Send Message to info@rtsoncreations.co.zw */}
            <a
              href="mailto:info@rtsoncreations.co.zw?subject=Studio%20Client%20Inquiry%20via%20Desk%20Widget"
              onClick={() => sound.playChime()}
              className="flex items-center justify-between p-3 rounded-2xl bg-[#1e232d] hover:bg-[#252b37] border border-white/10 hover:border-[#ff6b00] text-white backdrop-blur-md transition-all font-bold group cursor-pointer shadow-md"
              title="Send email to info@rtsoncreations.co.zw"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-[#ff6b00] text-black flex items-center justify-center shadow-xs">
                  <Mail className="w-4 h-4 text-black" />
                </div>
                <div>
                  <span className="block text-[10px] text-[#ff8800] font-bold uppercase tracking-wider">Send Client Message</span>
                  <span className="text-xs font-black text-white">info@rtsoncreations.co.zw</span>
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-[#ff6b00] group-hover:text-white transition-colors" />
            </a>

            {/* Live Order Tracker Trigger */}
            {onOpenOrderTracker && (
              <button
                onClick={() => {
                  sound.playClick();
                  setIsOpen(false);
                  onOpenOrderTracker();
                }}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-[#1e232d] hover:bg-[#252b37] border border-white/10 hover:border-[#ff6b00] text-white backdrop-blur-md transition-all font-bold group text-left cursor-pointer shadow-sm"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-xl bg-[#141720] border border-white/10 text-[#ff6b00] flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-[10px] text-[#ff8800] font-bold uppercase tracking-wider">Live Order Status</span>
                    <span className="text-xs text-white">Track Your Design Project</span>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#ff6b00] text-black font-black">Track</span>
              </button>
            )}

            {/* Email Studio Brief */}
            <a
              href="mailto:info@rtsoncreations.co.zw?subject=Project%20Brief%20and%20Assets"
              onClick={() => sound.playClick()}
              className="flex items-center justify-between p-3 rounded-2xl bg-[#1e232d] hover:bg-[#252b37] border border-white/10 hover:border-[#ff6b00] text-white backdrop-blur-md transition-colors font-medium group cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-[#141720] border border-white/10 text-[#ff6b00] flex items-center justify-center">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 uppercase tracking-wider">Direct Studio Desk</span>
                  <span className="font-mono text-[11px] text-slate-200">Rapid Response Team</span>
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-colors" />
            </a>
          </div>

          <div className="pt-2 border-t border-white/10 text-[10px] text-slate-400 flex items-center justify-between font-mono">
            <span>Response: ~15 mins</span>
            <span className="font-bold text-[#ff6b00]">Online &amp; Active</span>
          </div>
        </div>
      )}

      {/* Floating Launcher Action Button in Electric Orange, Obsidian Black & White */}
      <button
        onClick={() => {
          sound.playPop();
          setIsOpen(!isOpen);
        }}
        className="px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-full bg-[#ff6b00] hover:bg-[#ff7a00] text-black font-black text-xs shadow-xl shadow-[#ff6b00]/25 transition-all flex items-center gap-2 cursor-pointer border border-[#ff6b00] hover:scale-105 active:scale-95 min-h-[44px]"
        title="Direct Studio Desk & Info Email"
      >
        <div className="relative">
          <Mail className="w-4 h-4 text-black" />
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-black animate-ping" />
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-black" />
        </div>
        <span className="font-black tracking-wide">Studio Desk</span>
      </button>

    </div>
  );
};
