import { PricingPackage, AddOnOption } from '../types';

export const PRICING_PACKAGES: PricingPackage[] = [
  {
    id: 'pkg-simple',
    category: 'simple_flyer',
    name: 'Simple Business Flyer',
    basePrice: 5,
    turnaroundHours: 12,
    description: 'Ideal for corporate promos, business openings, real estate listings, discount announcements, and clean educational flyers.',
    includedFeatures: [
      'Single-sided professional design layout',
      'High-Resolution Print-Ready PDF (300 DPI)',
      'Digital PNG/JPG format for web & email',
      '2 free rounds of revisions',
      'Fast 12 to 24-hour delivery',
      'Stock image curation included'
    ]
  },
  {
    id: 'pkg-social',
    category: 'social_media',
    name: 'Social Media Promo Pack',
    basePrice: 10,
    turnaroundHours: 24,
    description: 'Matching set of digital banners, Instagram carousel slides, Facebook ad banners, or story templates for brands & influencers.',
    includedFeatures: [
      '3 matching digital graphics / story slides',
      'Optimized for IG, FB, TikTok, and WhatsApp stories',
      'High Click-Through Call to Action typography',
      'Transparent background PNG assets included',
      'Digital delivery in 24 hours'
    ]
  },
  {
    id: 'pkg-social-retainer',
    category: 'social_media',
    name: 'Monthly Content Engine Retainer',
    basePrice: 60,
    turnaroundHours: 48,
    popular: true,
    description: 'Recurring monthly social media management: 12-16 custom flyers/carousels, strategic content calendar, and reusable Canva master template library.',
    includedFeatures: [
      '12 to 16 Custom Designed Social Flyers / Carousels / Reels',
      'Monthly Strategic Content Posting Calendar & Hooks',
      'Reusable Master Canva & Figma Template Kit for in-house team',
      'Platform-Specific Layouts (IG 1:1, Story 9:16, LinkedIn/FB)',
      'High-Converting Caption Prompts & Scripture/Headline Hooks',
      'Bi-Weekly Milestone Check-Ins & Direct WhatsApp Access'
    ]
  },
  {
    id: 'pkg-church',
    category: 'church_flyer',
    name: 'Church & Ministry Flyer',
    basePrice: 10,
    turnaroundHours: 24,
    popular: true,
    description: 'Specially crafted for Sunday Worship Services, Revival Conferences, Youth Summits, Praise Nights, and Pastoral Anniversaries.',
    includedFeatures: [
      '3D glowing typography & majestic lighting effects',
      'Minister/Speaker photo cutouts & skin retouching',
      'Optimized for Instagram feed (1080x1350) + Print PDF',
      '3 free rounds of revisions',
      'Church logo & social handle integrations',
      '24-Hour express delivery standard'
    ]
  },
  {
    id: 'pkg-event',
    category: 'event_poster',
    name: 'Events & Nightlife Poster',
    basePrice: 25,
    turnaroundHours: 24,
    popular: true,
    description: 'High-energy visuals for DJ club parties, VIP lounge galas, music concerts, comedy shows, and festival announcements.',
    includedFeatures: [
      'Vibrant neon, metallic foil, & glassmorphism FX',
      'DJ & Guest artist photo cutout & color grading',
      'Sponsor logos & ticket QR code formatting',
      'Instagram Post (1:1) + Story (9:16) dimensions',
      '3 free rounds of revisions',
      'Optional Animated Motion Graphic add-on'
    ]
  },
  {
    id: 'pkg-brand-strategy',
    category: 'branding',
    name: 'Brand Strategy & Positioning Workshop',
    basePrice: 50,
    turnaroundHours: 72,
    popular: true,
    description: 'Deep discovery workshop defining brand archetype, core values, voice spectrum, positioning strategy, and audience personas before a single pixel is moved.',
    includedFeatures: [
      'Brand Archetype Discovery (Hero, Creator, Ruler, Sage, Magician)',
      'Core Brand Values, Mission & Value Proposition Matrix',
      'Audience Persona Profiles & Emotional Buying Trigger Mapping',
      'Tone-of-Voice Spectrum & Conversion Messaging Framework',
      'Visual Moodboard & High-Level Creative Direction Deck',
      'Complete Brand Strategy Playbook PDF for executive team'
    ]
  },
  {
    id: 'pkg-branding',
    category: 'branding',
    name: 'Full Brand & Complex Suite',
    basePrice: 30,
    turnaroundHours: 48,
    description: 'Complete premium visual identity solution and complex artwork for businesses, churches, and brands looking for a memorable luxury aesthetic.',
    includedFeatures: [
      '3 unique logo design concepts or complex branding artwork',
      'Full Vector Master Files (AI, SVG, EPS, PDF, PNG)',
      'Brand Color Palette & Typography Guidelines',
      'Matching Business Card & Flyer design included',
      'Social Media Profile Avatar & Header kit',
      'Unlimited revisions until 100% satisfied'
    ]
  },
  {
    id: 'pkg-brochure',
    category: 'brochure',
    name: 'Corporate & Product Brochure',
    basePrice: 20,
    turnaroundHours: 24,
    description: 'Professional bi-fold or tri-fold company brochures, product catalogs, corporate pamphlets, and event showcase booklets.',
    includedFeatures: [
      'Bi-Fold or Tri-Fold multi-page design layout',
      'High-Resolution Print-Ready PDF with bleed marks (300 DPI)',
      'Custom infographics & corporate icons included',
      'Digital interactive PDF version for email & web sharing',
      '24-Hour express delivery'
    ]
  },
  {
    id: 'pkg-packaging-print',
    category: 'brochure',
    name: 'Print Packaging & Die-Cut Prep',
    basePrice: 35,
    turnaroundHours: 48,
    popular: true,
    description: 'Full technical physical print prep: custom packaging net templates, die-cut crease lines, foil stamping layers, spot UV masks, and Pantone PMS color profiles.',
    includedFeatures: [
      'Custom Die-Cut Box / Pouch / Label Net Templates (AI, DXF)',
      'Dedicated 100% K Spot UV & Hot Foil Stamping Vector Masks',
      'Pantone (PMS) to CMYK 4-Color Profile Calibration',
      'Accurate 3mm-5mm Bleed, Crease, and Fold Safety Tolerances',
      'Pre-Press Certificate & Direct Print-Shop Handoff PDF',
      'Photorealistic 3D Packaging Render Mockup'
    ]
  },
  {
    id: 'pkg-resume',
    category: 'resume',
    name: 'Executive & Creative Resume (CV)',
    basePrice: 15,
    turnaroundHours: 12,
    description: 'ATS-compliant executive CVs, modern creative resumes, cover letter templates, and portfolio profile sheets.',
    includedFeatures: [
      'Clean ATS-Optimized typography & structural hierarchy',
      'Matching Cover Letter & References page template',
      'Editable Microsoft Word (.docx) + Print-Ready PDF',
      'Professional headshot retouching & badge formatting',
      'Fast 12-Hour turnaround'
    ]
  },
  {
    id: 'pkg-presentation',
    category: 'presentation',
    name: 'Pitch Deck & Slide Presentation',
    basePrice: 25,
    turnaroundHours: 24,
    popular: true,
    description: 'Investor pitch decks, corporate slide decks, keynote presentations, and training master slides designed to impress clients & investors.',
    includedFeatures: [
      '10 to 15 custom designed master presentation slides',
      'Editable PowerPoint (.pptx) & Google Slides export',
      'Custom data charts, infographics & icon sets',
      'High-Impact visual storytelling & branding layout',
      '24 to 48-Hour delivery'
    ]
  },
  {
    id: 'pkg-website',
    category: 'website_design',
    name: 'Corporate & Business Website',
    basePrice: 45,
    turnaroundHours: 48,
    popular: true,
    description: 'High-converting responsive modern websites for individuals, startups, companies, and organizations with fast loading speeds & SEO.',
    includedFeatures: [
      '100% Mobile & Desktop Responsive Design',
      'Modern UI/UX with smooth transitions & animations',
      'Contact Forms, WhatsApp Click-to-Chat & Maps integration',
      'SEO metadata & Social Sharing preview optimization',
      'High-speed hosting setup assistance',
      '48-Hour swift delivery'
    ]
  },
  {
    id: 'pkg-figma-to-code',
    category: 'website_design',
    name: 'Figma to Clean Responsive Frontend',
    basePrice: 55,
    turnaroundHours: 48,
    description: 'Translate Figma mockups into clean, responsive HTML5/Tailwind CSS or React components for Webflow, WordPress, or custom builds.',
    includedFeatures: [
      'Pixel-Perfect translation from Figma / XD to responsive code',
      'Clean semantic HTML5, modern Tailwind CSS or React components',
      'Optimized for Webflow, WordPress, or custom web builds',
      'Smooth micro-animations & responsive mobile breakpoints',
      'Clean asset export (optimized SVGs, WebP images, fonts)',
      'Tested on Chrome, Safari, iOS, and Android'
    ]
  },
  {
    id: 'pkg-webapp',
    category: 'web_app',
    name: 'Custom Web Application & Portal',
    basePrice: 85,
    turnaroundHours: 72,
    popular: true,
    description: 'Bespoke web applications, client dashboards, online booking systems, e-commerce storefronts, and interactive business tools.',
    includedFeatures: [
      'Interactive React / Next.js web application architecture',
      'User Authentication & Secure Database integration',
      'Real-Time data synchronization & Cloud storage',
      'Admin management dashboard & user analytics',
      'REST API / Webhook integration support',
      '3-day delivery & post-launch support'
    ]
  },
  {
    id: 'pkg-mobileapp',
    category: 'mobile_app',
    name: 'iOS & Android App UI/UX & Native',
    basePrice: 65,
    turnaroundHours: 48,
    description: 'Sleek iOS & Android mobile application designs, interactive Figma prototypes, component design systems, and cross-platform app builds.',
    includedFeatures: [
      'iOS & Android native design guideline compliance',
      'High-Fidelity interactive clickable prototype',
      'Complete Mobile Component & Icon design library',
      'Developer handoff assets & design tokens',
      'User journey flowcharts & wireframes',
      '48-Hour express delivery'
    ]
  }
];

export const ADD_ON_OPTIONS: AddOnOption[] = [
  {
    id: 'addon-express',
    label: '12-Hour Rush Express Delivery',
    price: 5,
    description: 'Jump the queue for super fast turnaround within 12 hours guaranteed.',
    iconName: 'Zap'
  },
  {
    id: 'addon-copywriting',
    label: 'Punchy Copywriting & Taglines',
    price: 5,
    description: 'Catchy event hooks, sermon titles, punchy slogans & conversion microcopy written for you.',
    iconName: 'PenTool'
  },
  {
    id: 'addon-animated',
    label: 'Animated Motion Graphic Video (.mp4)',
    price: 10,
    description: '15-second eye-catching motion flyer with sound effects for Instagram Reels & TikTok.',
    iconName: 'Video'
  },
  {
    id: 'addon-prepress',
    label: 'Spot UV, Foil & Die-Cut Print Prep',
    price: 6,
    description: '100% K vector spot UV masks, hot foil layers, die-cut crease lines & Pantone/CMYK profiles.',
    iconName: 'Printer'
  },
  {
    id: 'addon-canva-templates',
    label: 'Reusable Canva Master Template Kit',
    price: 6,
    description: 'Editable branded template library with locked fonts & colors for your internal team.',
    iconName: 'LayoutGrid'
  },
  {
    id: 'addon-source',
    label: 'Editable Source File (PSD / AI / Canva)',
    price: 3,
    description: 'Get the fully layered original source file to edit text/photos in the future.',
    iconName: 'FolderZip'
  },
  {
    id: 'addon-frontend-code',
    label: 'Figma to Clean HTML/Tailwind/React Code',
    price: 20,
    description: 'Translate your UI mockup into responsive, semantic HTML/Tailwind or React components.',
    iconName: 'Code'
  },
  {
    id: 'addon-multi-size',
    label: 'Extra Dimensions Pack (Story, Banner, Billboard)',
    price: 3,
    description: 'Re-layout your flyer design into 3 extra sizes (Story 9:16, Website Banner, Large Billboard).',
    iconName: 'Maximize2'
  },
  {
    id: 'addon-unlimited-rev',
    label: 'Unlimited Revisions Pass',
    price: 4,
    description: 'Make unlimited text/color tweaks until your vision is 100% pixel perfect.',
    iconName: 'RotateCcw'
  }
];
