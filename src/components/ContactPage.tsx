import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Phone, 
  Mail, 
  Globe, 
  MapPin, 
  Send, 
  Check, 
  Copy, 
  CheckCircle2, 
  MessageSquare, 
  Sparkles, 
  ArrowRight, 
  Download, 
  QrCode,
  ShieldCheck,
  Zap,
  Clock,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { sound } from '../lib/soundFx';
import { RtsonLogo } from './RtsonLogo';
import { saveClientInquiry } from '../lib/cms';
import studioCreativeDeskImg from '../assets/images/studio_creative_desk_1791468122004.jpg';
import studioTeamCollabImg from '../assets/images/studio_team_collab_1792060940941.jpg';

interface ContactPageProps {
  onNavigate: (page: 'home' | 'about' | 'products' | 'retouch' | 'contact' | 'order') => void;
  onOpenAdmin?: () => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate, onOpenAdmin }) => {
  // Official Studio Contact details (Zero personal phone number exposed)
  const emailMain = 'info@rtsoncreations.co.zw';
  const websiteUrl = 'www.rtsoncreations.co.zw';
  const addressText = 'Harare, Zimbabwe • Worldwide Digital Delivery';

  // Form State
  const [fullName, setFullName] = useState<string>('');
  const [emailAddress, setEmailAddress] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [inquirySubject, setInquirySubject] = useState<string>('Website & Graphic Design Project');
  const [messageBody, setMessageBody] = useState<string>('');

  // Status feedback
  const [isCopiedEmail, setIsCopiedEmail] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  // QR Code Modal for Mobile Quick Scan
  const [isQrModalOpen, setIsQrModalOpen] = useState<boolean>(false);

  const copyToClipboard = (text: string) => {
    sound.playClick();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setIsCopiedEmail(true);
      setTimeout(() => setIsCopiedEmail(false), 2400);
    }
  };

  const handleDownloadVCard = () => {
    sound.playClick();
    const vCardData = 
`BEGIN:VCARD
VERSION:3.0
FN:R'tson Creations Studio Desk
ORG:R'tson Creations
TITLE:Design Atelier & Digital Architecture
EMAIL;TYPE=WORK,INTERNET:${emailMain}
URL:https://${websiteUrl}
ADR;TYPE=WORK:;;Harare;;;Zimbabwe
NOTE:Official contact for R'tson Creations - Website Design, Graphic Design & Digital Media.
END:VCARD`;

    const blob = new Blob([vCardData], { type: 'text/vcard;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Rtson_Creations_Studio_Contact.vcf');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Direct Submission routing to info@rtsoncreations.co.zw
  const handleSendToInfoEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() && !emailAddress.trim()) {
      alert('Please provide your name and email address.');
      return;
    }

    setIsSubmitting(true);
    sound.playClick();

    const refId = `INQ-${Math.floor(100000 + Math.random() * 900000)}`;

    try {
      await saveClientInquiry({
        id: refId,
        orderRef: refId,
        name: fullName.trim() || 'Direct Client',
        contact: emailAddress.trim() || phoneNumber.trim() || emailMain,
        clientPhone: phoneNumber.trim(),
        clientEmail: emailAddress.trim() || emailMain,
        designType: inquirySubject,
        details: messageBody.trim() || 'Client inquiry submitted to info@rtsoncreations.co.zw.',
        status: 'Pending',
        createdAt: new Date().toISOString()
      });
    } catch (err) {
      console.warn('Inquiry save notice:', err);
    } finally {
      setIsSubmitting(false);
      sound.playPop();
      setSubmittedRef(refId);

      // Launch user's email client directly composed to info@rtsoncreations.co.zw
      const emailSubject = encodeURIComponent(`[Studio Inquiry #${refId}] ${inquirySubject} - ${fullName.trim()}`);
      const emailBody = encodeURIComponent(
        `Dear R'tson Creations Studio Team,\n\n` +
        `Name: ${fullName.trim()}\n` +
        `Email: ${emailAddress.trim()}\n` +
        (phoneNumber.trim() ? `Phone/WhatsApp: ${phoneNumber.trim()}\n` : '') +
        `Subject: ${inquirySubject}\n` +
        `Reference ID: ${refId}\n\n` +
        `Project Requirements / Message:\n${messageBody.trim() || 'Hello Rtson Creations, I would like to inquire about starting a design or web project.'}\n\n` +
        `--\nDispatched from rtsoncreations.co.zw to info@rtsoncreations.co.zw`
      );
      window.location.href = `mailto:${emailMain}?subject=${emailSubject}&body=${emailBody}`;
    }
  };

  const scrollToForm = () => {
    sound.playClick();
    const el = document.getElementById('contact-form-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full min-h-screen bg-white text-slate-800 relative selection:bg-[#ff6b00] selection:text-black font-sans">
      
      {/* ========================================================================= */}
      {/* SECTION 1: HERO HEADER BANNER ("Contact Us")                               */}
      {/* Cinematic background, clean title and electric orange breadcrumb          */}
      {/* ========================================================================= */}
      <section className="relative w-full py-16 sm:py-24 md:py-28 px-4 sm:px-6 lg:px-8 bg-black overflow-hidden">
        {/* Background photo */}
        <div className="absolute inset-0 z-0">
          <img 
            src={studioTeamCollabImg} 
            alt="Studio Design Team Collaboration Background" 
            className="w-full h-full object-cover object-center grayscale contrast-110 opacity-40"
          />
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black to-transparent pointer-events-none" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-start justify-center">
          <div className="p-6 sm:p-8 rounded-3xl bg-black/75 backdrop-blur-md border border-white/15 shadow-2xl max-w-2xl">
            {/* Breadcrumb: Home / Contact Us */}
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs sm:text-sm font-medium text-zinc-300 mb-2 sm:mb-3 animate-fade-in-up">
              <button 
                type="button" 
                onClick={() => onNavigate('home')} 
                className="hover:text-[#ff6b00] transition-colors cursor-pointer"
              >
                Home
              </button>
              <span className="text-[#ff6b00] font-bold">/</span>
              <span className="text-[#ff6b00] font-semibold">Contact Us</span>
            </nav>

            {/* Heading in bold white */}
            <motion.h1 
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight drop-shadow-xl"
            >
              Contact Us
            </motion.h1>

            {/* Quote notice */}
            <div className="mt-4 pt-2 animate-fade-in-up delay-100">
              <button
                type="button"
                onClick={() => onNavigate('order')}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-[#ff6b00] text-xs font-semibold backdrop-blur-md transition-all cursor-pointer shadow-sm"
              >
                <span>Need an instant itemized price quote or place an order?</span>
                <span className="underline decoration-[#ff6b00] flex items-center gap-1 font-bold">
                  Go to Start Order <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 2: "GET IN TOUCH" DUAL COLUMN SECTION                              */}
      {/* Mirrored from sample:                                                     */}
      {/* Left: Kicker "CONTACT US", Title "Get In Touch", Description & 4 Items    */}
      {/* Right: Clean modern form with Submit Button                               */}
      {/* ========================================================================= */}
      <section id="contact-form-section" className="w-full py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-14 lg:gap-16 items-start">
          
          {/* Left Column (5 Cols on LG): Info & 4 Contact Items */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Kicker & Heading with smooth text animation */}
            <div className="space-y-2">
              <span className="text-xs sm:text-sm font-black uppercase tracking-widest text-[#ff6b00] block">
                CONTACT US
              </span>
              <motion.h2 
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight"
              >
                Get In <span className="text-[#ff6b00]">Touch</span>
              </motion.h2>
            </div>

            {/* Subtitle Description */}
            <motion.p 
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.65, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal"
            >
              We create stunning, user-friendly websites and 300 DPI pre-press graphic designs that help you stand out, connect with your audience and grow your brand online. Reach out directly or send us a message.
            </motion.p>

            {/* 4 Contact Items in 2x2 Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 pt-2">
              
              {/* Item 1: Studio Official Dispatch Email */}
              <div className="flex items-start gap-3.5 group">
                <div className="w-10 h-10 rounded-xl bg-black border border-white/10 text-[#ff6b00] flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-[#ff6b00] group-hover:text-black transition-all shadow-xs">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                    Official Info Email
                  </h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <a 
                      href={`mailto:${emailMain}`}
                      onClick={() => sound.playClick()}
                      className="text-xs text-slate-900 hover:text-[#ff6b00] font-bold transition-colors break-all lowercase font-mono"
                    >
                      {emailMain}
                    </a>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(emailMain)}
                      className="text-slate-400 hover:text-[#ff6b00] transition-colors cursor-pointer shrink-0"
                      title="Copy Email"
                    >
                      {isCopiedEmail ? <Check className="w-3.5 h-3.5 text-[#ff6b00]" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <span className="text-[10px] text-slate-500 block">Direct studio message recipient</span>
                </div>
              </div>

              {/* Item 2: Studio Working Hours */}
              <div className="flex items-start gap-3.5 group">
                <div className="w-10 h-10 rounded-xl bg-black border border-white/10 text-[#ff6b00] flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-[#ff6b00] group-hover:text-black transition-all shadow-xs">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                    Studio Desk Hours
                  </h3>
                  <p className="text-xs text-slate-600 font-medium mt-0.5 leading-snug">
                    Mon – Sat: 08:00 – 19:00 CAT
                  </p>
                  <span className="text-[10px] text-[#ff6b00] font-bold block">Rapid Response via Info Email</span>
                </div>
              </div>

              {/* Item 3: Websites */}
              <div className="flex items-start gap-3.5 group">
                <div className="w-10 h-10 rounded-xl bg-black border border-white/10 text-[#ff6b00] flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-[#ff6b00] group-hover:text-black transition-all shadow-xs">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                    Websites
                  </h3>
                  <a 
                    href={`https://${websiteUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-slate-600 hover:text-[#ff6b00] font-medium transition-colors mt-0.5 block"
                  >
                    {websiteUrl}
                  </a>
                </div>
              </div>

              {/* Item 4: Address */}
              <div className="flex items-start gap-3.5 group">
                <div className="w-10 h-10 rounded-xl bg-black border border-white/10 text-[#ff6b00] flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-[#ff6b00] group-hover:text-black transition-all shadow-xs">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                    Address
                  </h3>
                  <p className="text-xs text-slate-600 font-medium mt-0.5 leading-snug">
                    {addressText}
                  </p>
                </div>
              </div>

            </div>

            {/* Quick Actions (vCard & QR Code) */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleDownloadVCard}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer min-h-[40px]"
              >
                <Download className="w-3.5 h-3.5 text-[#ff6b00]" />
                <span>Save Studio vCard</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setIsQrModalOpen(true);
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-slate-900 text-xs font-bold transition-all cursor-pointer border border-orange-200 min-h-[40px]"
              >
                <QrCode className="w-3.5 h-3.5 text-[#ff6b00]" />
                <span>Studio Email QR Code</span>
              </button>
            </div>

          </div>

          {/* Right Column (7 Cols on LG): Mirrored Form */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-xl shadow-slate-100/60">
            
            {submittedRef ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center border border-emerald-200">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-slate-900">
                  Message Dispatched to info@rtsoncreations.co.zw!
                </h3>
                <p className="text-sm text-slate-600 max-w-md mx-auto">
                  Thank you, <strong className="text-slate-900">{fullName || 'Valued Client'}</strong>. Reference ID: <span className="font-mono text-[#4d7c0f] font-bold">{submittedRef}</span>. Your message has been routed to our official info email (info@rtsoncreations.co.zw) and recorded for our studio team.
                </p>
                <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
                  <a
                    href={`mailto:${emailMain}?subject=${encodeURIComponent(`[Inquiry #${submittedRef}] ${inquirySubject} - ${fullName}`)}`}
                    onClick={() => sound.playClick()}
                    className="px-5 py-2.5 rounded-xl bg-[#ff6b00] hover:bg-[#ff7a00] text-black font-black text-xs uppercase tracking-wider transition-colors shadow-md flex items-center gap-2 min-h-[44px]"
                  >
                    <Mail className="w-4 h-4 text-black" />
                    <span>Open in Email App</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmittedRef(null);
                      setMessageBody('');
                    }}
                    className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSendToInfoEmail} className="space-y-4 sm:space-y-5">
                
                {/* Row 1: Your Name & Your Email side by side (Matching sample) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Your Name *</label>
                    <input 
                      type="text" 
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Your Name" 
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm outline-none focus:bg-white focus:border-[#84cc16] focus:ring-1 focus:ring-[#84cc16] transition-all placeholder:text-slate-400 font-medium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Your Email *</label>
                    <input 
                      type="email" 
                      required
                      value={emailAddress}
                      onChange={(e) => setEmailAddress(e.target.value)}
                      placeholder="Your Email" 
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm outline-none focus:bg-white focus:border-[#84cc16] focus:ring-1 focus:ring-[#84cc16] transition-all placeholder:text-slate-400 font-medium"
                    />
                  </div>
                </div>

                {/* Row 2: Your Subject & Phone/WhatsApp */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Your Subject</label>
                    <input 
                      type="text" 
                      value={inquirySubject}
                      onChange={(e) => setInquirySubject(e.target.value)}
                      placeholder="Your Subject" 
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm outline-none focus:bg-white focus:border-[#84cc16] focus:ring-1 focus:ring-[#84cc16] transition-all placeholder:text-slate-400 font-medium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Your Contact Phone / WhatsApp (Optional)</label>
                    <input 
                      type="tel" 
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="e.g. +263 ... or client number" 
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm outline-none focus:bg-white focus:border-[#84cc16] focus:ring-1 focus:ring-[#84cc16] transition-all placeholder:text-slate-400 font-medium font-mono"
                    />
                  </div>
                </div>

                {/* Row 3: Your Message (textarea matching sample) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Your Message *</label>
                  <textarea 
                    required
                    rows={4}
                    value={messageBody}
                    onChange={(e) => setMessageBody(e.target.value)}
                    placeholder="Describe your design, website, or branding requirements..." 
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm outline-none focus:bg-white focus:border-[#84cc16] focus:ring-1 focus:ring-[#84cc16] transition-all placeholder:text-slate-400 font-medium resize-y"
                  />
                </div>

                {/* Submit Button (Routes directly to info@rtsoncreations.co.zw) */}
                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#ff6b00] hover:bg-[#ff7a00] active:scale-98 text-black font-black text-xs uppercase tracking-wider transition-all duration-300 shadow-md shadow-[#ff6b00]/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 min-h-[44px]"
                  >
                    <Mail className="w-4 h-4 text-black" />
                    <span>
                      {isSubmitting ? 'Sending to info email...' : 'Send Message to '}
                      {!isSubmitting && <span className="lowercase normal-case font-mono font-black text-xs">{emailMain}</span>}
                    </span>
                    <ArrowRight className="w-4 h-4 text-black" />
                  </button>

                  <a
                    href={`mailto:${emailMain}?subject=${encodeURIComponent(`[Direct Inquiry] ${inquirySubject} - ${fullName || 'Client'}`)}&body=${encodeURIComponent(messageBody || 'Hello Rtson Creations, I would like to inquire about a project.')}`}
                    onClick={() => sound.playClick()}
                    className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#181c24] hover:bg-[#1e232d] border border-white/10 active:scale-98 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer text-center min-h-[44px]"
                  >
                    <Send className="w-3.5 h-3.5 text-[#ff6b00]" />
                    <span>Open Email Client</span>
                  </a>
                </div>

              </form>
            )}

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 3: CONSULTATION BANNER ("Consult the services you need now!")      */}
      {/* Soft Slate Charcoal with Electric Orange Accents                          */}
      {/* ========================================================================= */}
      <section className="w-full py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-[#12151a] text-white relative overflow-hidden border-y border-white/10">
        
        {/* Subtle geometric background light */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#ff6b00]/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12 items-center relative z-10">
          
          {/* Left Column: Studio Creative Workstation */}
          <div className="lg:col-span-5 flex justify-center lg:justify-start">
            <div className="relative w-full max-w-md aspect-[4/5] rounded-3xl overflow-hidden border-2 border-white/10 shadow-2xl group bg-[#181c24]">
              <img 
                src={studioCreativeDeskImg} 
                alt="R'tson Creations - Creative Studio Workstation" 
                className="w-full h-full object-cover object-center grayscale contrast-110 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#12151a]/90 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-[#181c24]/90 backdrop-blur-md border border-white/10">
                <span className="text-[11px] font-mono font-bold text-[#ff6b00] uppercase tracking-widest block">
                  RTSON CREATIONS STUDIO
                </span>
                <h4 className="text-lg font-black text-white mt-0.5">
                  Harare Design Atelier
                </h4>
                <p className="text-xs text-zinc-400">
                  Direct studio craftsmanship • 300 DPI pre-press fidelity, web architecture &amp; brand identity.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Title, Description, Checkmarks & Button */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
              Consult the services you <br />
              <span className="text-[#ff6b00]">need now!</span>
            </h2>

            <p className="text-sm sm:text-base text-zinc-300 font-normal leading-relaxed max-w-xl">
              Partner directly with R'tson Creations Studio for custom website builds, high-contrast 3D church and event posters, brand identity, or motion video reels. Every project is crafted to perfection with zero agency overheads.
            </p>

            {/* 3 Checkmark Bullet Points */}
            <div className="flex flex-wrap items-center gap-6 sm:gap-8 pt-2">
              
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-[#ff6b00] text-black flex items-center justify-center text-xs font-black shrink-0">
                  ✓
                </div>
                <span className="text-sm font-bold text-white">Fast delivery</span>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-[#ff6b00] text-black flex items-center justify-center text-xs font-black shrink-0">
                  ✓
                </div>
                <span className="text-sm font-bold text-white">Competitive Price</span>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-[#ff6b00] text-black flex items-center justify-center text-xs font-black shrink-0">
                  ✓
                </div>
                <span className="text-sm font-bold text-white">Wide Delivery Area</span>
              </div>

            </div>

            {/* Contact Us Button */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={scrollToForm}
                className="px-8 py-3.5 rounded-xl bg-[#ff6b00] hover:bg-[#ff7a00] active:scale-98 text-black font-black text-xs uppercase tracking-wider transition-all duration-300 shadow-lg shadow-[#ff6b00]/25 cursor-pointer min-h-[44px]"
              >
                Contact Us
              </button>

              <a
                href={`mailto:${emailMain}?subject=${encodeURIComponent("Studio Consultation Request")}`}
                onClick={() => sound.playClick()}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#181c24] hover:bg-[#1e232d] border border-white/10 text-zinc-200 hover:text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer min-h-[44px]"
              >
                <Mail className="w-4 h-4 text-[#ff6b00]" />
                <span>Email Studio: <span className="lowercase normal-case font-mono">{emailMain}</span></span>
              </a>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 4: OFFICES / DIGITAL DESKS ("Our Offices Located All Over The World")*/}
      {/* Mirrored from sample:                                                     */}
      {/* Left: Kicker, Title, Description & 2 Dark Navy Office Cards               */}
      {/* Right: Team / Workstation Photo                                           */}
      {/* ========================================================================= */}
      <section className="w-full py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-14 lg:gap-16 items-center">
          
          {/* Left Column (7 Cols on LG): Titles & 2 Dark Navy Cards */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="space-y-2">
              <span className="text-xs sm:text-sm font-black uppercase tracking-widest text-[#ff6b00] block">
                OUR OFFICE
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                Our Offices <span className="text-[#ff6b00]">Located All</span> <br />
                Over The World
              </h2>
            </div>

            <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed max-w-xl">
              Based in Harare, Zimbabwe, with remote digital services delivered seamlessly across Southern Africa, the United Kingdom, the United States, and international ministries.
            </p>

            {/* 2 Dark Navy Office Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-3">
              
              {/* Office Card 1: Harare Head Studio */}
              <div className="p-6 rounded-2xl bg-[#141720] text-white shadow-xl border border-white/10 space-y-3.5 group hover:border-[#ff6b00]/50 transition-all text-left">
                <div className="border-b border-white/10 pb-2.5">
                  <h3 className="text-lg font-black text-[#ff6b00]">
                    Harare Studio
                  </h3>
                  <span className="text-[11px] font-mono text-zinc-400 block mt-0.5">
                    Head Office &amp; Creative Studio
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-[#ff6b00] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block text-[11px] uppercase tracking-wider font-mono">Address</strong>
                      <span className="text-zinc-300">Harare, Zimbabwe</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Mail className="w-4 h-4 text-[#ff6b00] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block text-[11px] uppercase tracking-wider font-mono">Official Info Email</strong>
                      <a href={`mailto:${emailMain}`} className="text-[#ff6b00] hover:text-[#ff7a00] transition-colors break-all lowercase font-mono font-medium">
                        {emailMain}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Clock className="w-4 h-4 text-[#ff6b00] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block text-[11px] uppercase tracking-wider font-mono">Studio Hours</strong>
                      <span className="text-zinc-300">Mon–Sat 08:00–19:00 CAT</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Office Card 2: International Client Desk */}
              <div className="p-6 rounded-2xl bg-[#141720] text-white shadow-xl border border-white/10 space-y-3.5 group hover:border-[#ff6b00]/50 transition-all text-left">
                <div className="border-b border-white/10 pb-2.5">
                  <h3 className="text-lg font-black text-[#ff6b00]">
                    International Desk
                  </h3>
                  <span className="text-[11px] font-mono text-zinc-400 block mt-0.5">
                    Worldwide Digital Delivery
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex items-start gap-2.5">
                    <Globe className="w-4 h-4 text-[#ff6b00] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block text-[11px] uppercase tracking-wider font-mono">Coverage</strong>
                      <span className="text-zinc-300">UK, USA, South Africa &amp; Diaspora</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Mail className="w-4 h-4 text-[#ff6b00] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block text-[11px] uppercase tracking-wider font-mono">Client Inquiries</strong>
                      <a href={`mailto:${emailMain}?subject=${encodeURIComponent("International Project Inquiry")}`} className="text-[#ff6b00] hover:text-[#ff7a00] transition-colors break-all lowercase font-mono font-medium">
                        {emailMain}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Send className="w-4 h-4 text-[#ff6b00] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block text-[11px] uppercase tracking-wider font-mono">Turnaround</strong>
                      <span className="text-zinc-300">12–24 Hours Express Output</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* Right Column (5 Cols on LG): Team / Workstation Photo */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md aspect-[4/5] rounded-3xl overflow-hidden border border-slate-200 shadow-2xl group">
              <img 
                src={studioCreativeDeskImg} 
                alt="R'tson Creations Creative Workstation" 
                className="w-full h-full object-cover grayscale contrast-110 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200">
                <span className="text-[11px] font-mono font-black text-[#ff6b00] uppercase tracking-widest block">
                  HIGH-PRECISION PRE-PRESS STUDIO
                </span>
                <p className="text-xs text-slate-700 font-medium mt-1">
                  Equipped for 300 DPI CMYK pre-press flyer packaging, responsive web deployment, and cinematic 60FPS motion posters.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 5: CORPORATE FOOTER (Matching the exact footer from sample)       */}
      {/* Columns: Brand & Socials, Our Services, Our Support, Contact Info         */}
      {/* ========================================================================= */}
      <footer className="w-full bg-[#12151a] text-white pt-16 sm:pt-20 pb-12 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto space-y-12">
          
          {/* 4 Main Footer Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 sm:gap-10">
            
            {/* Column 1 (4 Cols): Logo, Description & Social Icons */}
            <div className="lg:col-span-4 space-y-4">
              <div 
                onClick={() => onNavigate('home')} 
                className="cursor-pointer inline-block"
              >
                <RtsonLogo size="lg" textColor="light" showSubtitle={true} />
              </div>

              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
                We create stunning, user-friendly websites and 300 DPI pre-press graphic designs that help you stand out, connect with your audience and grow your brand online.
              </p>

              {/* Social Icons (Matching sample footer) */}
              <div className="flex items-center gap-2.5 pt-2">
                <a
                  href="https://facebook.com/rtsoncreations"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-[#ff6b00] hover:bg-[#ff7a00] text-black flex items-center justify-center text-xs font-black transition-transform hover:scale-110 shadow-sm"
                  title="Facebook @rtsoncreations"
                >
                  f
                </a>
                <a
                  href="https://instagram.com/rtsoncreations"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-[#ff6b00] hover:bg-[#ff7a00] text-black flex items-center justify-center text-xs font-black transition-transform hover:scale-110 shadow-sm"
                  title="Instagram @rtsoncreations"
                >
                  ig
                </a>
                <a
                  href="https://pinterest.com/rtsoncreations"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-[#ff6b00] hover:bg-[#ff7a00] text-black flex items-center justify-center text-xs font-black transition-transform hover:scale-110 shadow-sm"
                  title="Pinterest @rtsoncreations"
                >
                  p
                </a>
                <a
                  href={`mailto:${emailMain}`}
                  onClick={() => sound.playClick()}
                  className="w-8 h-8 rounded-full bg-[#ff6b00] hover:bg-[#ff7a00] text-black flex items-center justify-center text-xs font-black transition-transform hover:scale-110 shadow-sm"
                  title="Email Studio Desk"
                >
                  @
                </a>
              </div>
            </div>

            {/* Column 2 (3 Cols): Our Services */}
            <div className="lg:col-span-3 space-y-3">
              <h4 className="text-sm font-black uppercase tracking-wider text-white">
                Our Services
              </h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li className="flex items-center gap-2">
                  <span className="text-[#ff6b00] text-xs font-bold">✓</span>
                  <button type="button" onClick={() => onNavigate('products')} className="hover:text-white transition-colors cursor-pointer text-left">
                    Website Design &amp; Development
                  </button>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#ff6b00] text-xs font-bold">✓</span>
                  <button type="button" onClick={() => onNavigate('products')} className="hover:text-white transition-colors cursor-pointer text-left">
                    3D Church &amp; Conference Flyers
                  </button>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#ff6b00] text-xs font-bold">✓</span>
                  <button type="button" onClick={() => onNavigate('products')} className="hover:text-white transition-colors cursor-pointer text-left">
                    Corporate Brand Identity &amp; Logos
                  </button>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#ff6b00] text-xs font-bold">✓</span>
                  <button type="button" onClick={() => onNavigate('products')} className="hover:text-white transition-colors cursor-pointer text-left">
                    Motion Video Reels &amp; Posters
                  </button>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#ff6b00] text-xs font-bold">✓</span>
                  <button type="button" onClick={() => onNavigate('retouch')} className="hover:text-white transition-colors cursor-pointer text-left">
                    Photo Retouch Desk &amp; BG Removal
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3 (2 Cols): Our Support */}
            <div className="lg:col-span-2 space-y-3">
              <h4 className="text-sm font-black uppercase tracking-wider text-white">
                Our Support
              </h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li className="flex items-center gap-2">
                  <span className="text-[#ff6b00] text-xs font-bold">✓</span>
                  <a href={`mailto:${emailMain}`} className="hover:text-white transition-colors">
                    Official Info Email
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#ff6b00] text-xs font-bold">✓</span>
                  <button type="button" onClick={() => onNavigate('about')} className="hover:text-white transition-colors cursor-pointer">
                    Studio FAQs
                  </button>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#ff6b00] text-xs font-bold">✓</span>
                  <button type="button" onClick={scrollToForm} className="hover:text-white transition-colors cursor-pointer">
                    Direct Contact Form
                  </button>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#ff6b00] text-xs font-bold">✓</span>
                  <span className="text-slate-400">Terms &amp; Conditions</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#ff6b00] text-xs font-bold">✓</span>
                  <span className="text-slate-400">Privacy Policy</span>
                </li>
              </ul>
            </div>

            {/* Column 4 (3 Cols): Contact Info */}
            <div className="lg:col-span-3 space-y-3">
              <h4 className="text-sm font-black uppercase tracking-wider text-white">
                Contact Info
              </h4>

              <div className="space-y-3 text-xs text-slate-400">
                <div className="flex items-start gap-2.5">
                  <Mail className="w-4 h-4 text-[#ff6b00] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-white block font-semibold">Official Dispatch Email</span>
                    <a href={`mailto:${emailMain}`} className="text-[#ff6b00] hover:text-[#ff7a00] transition-colors break-all lowercase font-mono font-medium">
                      {emailMain}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-[#ff6b00] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-white block font-semibold">Turnaround Window</span>
                    <span>12–24 Hours Express Output</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#ff6b00] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-white block font-semibold">Address</span>
                    <span>Harare, Zimbabwe • Worldwide Delivery</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Bar matching sample */}
          <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <p>
              Copyright © 2026 R'tson Creations. All Rights Reserved. Harare, Zimbabwe.
            </p>

            <div className="flex items-center gap-4">
              {onOpenAdmin && (
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    onOpenAdmin();
                  }}
                  className="text-slate-400 hover:text-[#ff6b00] font-mono text-[11px] transition-colors cursor-pointer"
                  title="Studio Terminal"
                >
                  Admin Terminal
                </button>
              )}
              <button
                type="button"
                onClick={() => onNavigate('order')}
                className="text-[#ff6b00] hover:text-[#ff7a00] font-bold transition-colors cursor-pointer"
              >
                Start Order &amp; Quotation Desk →
              </button>
            </div>
          </div>

        </div>
      </footer>

      {/* ========================================================================= */}
      {/* QR CODE MODAL FOR MOBILE INSTANT LAUNCH                                    */}
      {/* ========================================================================= */}
      {isQrModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative max-w-sm w-full bg-[#141720] rounded-3xl p-6 text-center space-y-4 shadow-2xl border border-white/10 text-white">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <span className="text-xs font-mono font-black text-white uppercase tracking-wider">
                SCAN &amp; GET IN TOUCH
              </span>
              <button
                type="button"
                onClick={() => setIsQrModalOpen(false)}
                className="text-zinc-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-white/20 inline-block">
              <div className="w-44 h-44 mx-auto relative flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 100 100" fill="none">
                  <rect width="100" height="100" fill="#ffffff" />
                  <rect x="6" y="6" width="24" height="24" rx="4" fill="#000000" />
                  <rect x="10" y="10" width="16" height="16" rx="2" fill="#ffffff" />
                  <rect x="13" y="13" width="10" height="10" rx="1" fill="#000000" />
                  <rect x="70" y="6" width="24" height="24" rx="4" fill="#000000" />
                  <rect x="74" y="10" width="16" height="16" rx="2" fill="#ffffff" />
                  <rect x="77" y="13" width="10" height="10" rx="1" fill="#000000" />
                  <rect x="6" y="70" width="24" height="24" rx="4" fill="#000000" />
                  <rect x="10" y="74" width="16" height="16" rx="2" fill="#ffffff" />
                  <rect x="13" y="77" width="10" height="10" rx="1" fill="#000000" />
                  <rect x="36" y="8" width="8" height="8" fill="#ff6b00" />
                  <rect x="48" y="12" width="10" height="6" fill="#000000" />
                  <rect x="38" y="24" width="6" height="10" fill="#000000" />
                  <rect x="48" y="26" width="8" height="8" fill="#ff6b00" />
                  <rect x="10" y="40" width="10" height="6" fill="#000000" />
                  <rect x="24" y="44" width="6" height="8" fill="#000000" />
                  <rect x="36" y="42" width="16" height="16" rx="2" fill="#ff6b00" />
                  <rect x="58" y="46" width="8" height="8" fill="#000000" />
                  <rect x="72" y="42" width="12" height="6" fill="#000000" />
                  <rect x="88" y="46" width="6" height="12" fill="#ff6b00" />
                  <rect x="36" y="64" width="8" height="8" fill="#000000" />
                  <rect x="48" y="68" width="10" height="6" fill="#ff6b00" />
                  <rect x="62" y="64" width="6" height="12" fill="#000000" />
                  <rect x="74" y="70" width="10" height="8" fill="#000000" />
                </svg>
              </div>
            </div>

            <p className="text-xs text-zinc-400">
              Point your phone camera or click below to compose message directly to R'tson Creations Studio Desk (info@rtsoncreations.co.zw).
            </p>

            <a
              href={`mailto:${emailMain}`}
              onClick={() => sound.playClick()}
              className="w-full py-3 px-4 rounded-xl bg-[#ff6b00] hover:bg-[#ff7a00] text-black font-black text-xs uppercase block text-center shadow-md min-h-[44px]"
            >
              Send Email to <span className="lowercase normal-case font-mono">{emailMain}</span>
            </a>
          </div>
        </div>
      )}

    </div>
  );
};
