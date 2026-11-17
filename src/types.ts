export interface ShowcaseVideo {
  id: string;
  title: string;
  videoUrl: string;
  category: string;
  description: string;
  type: 'workstation' | 'speaking' | 'motion_flyer' | 'tutorial';
  addedAt: string;
}

export type DesignCategory = 
  | 'all'
  | 'simple_flyer'
  | 'church_flyer'
  | 'event_poster'
  | 'social_media'
  | 'branding'
  | 'brochure'
  | 'resume'
  | 'presentation'
  | 'website_design'
  | 'web_app'
  | 'mobile_app';

export interface PortfolioItem {
  id: string;
  title: string;
  category: DesignCategory;
  categoryLabel: string;
  imageUrl: string;
  price: number;
  turnaroundHours: number;
  description: string;
  tags: string[];
  clientType: string;
  featured?: boolean;
  aspectRatio?: '3:4' | '1:1' | '16:9';
  dimensionsLabel?: string;
  features: string[];
  subType?: string;
  platform?: 'instagram' | 'facebook' | 'youtube' | 'print' | 'general';
}

export interface PricingPackage {
  id: string;
  category: DesignCategory;
  name: string;
  basePrice: number;
  turnaroundHours: number;
  popular?: boolean;
  description: string;
  includedFeatures: string[];
}

export interface AddOnOption {
  id: string;
  label: string;
  price: number;
  description: string;
  iconName: string;
}

export interface HomeSlide {
  id: string;
  tag: string;
  category: string;
  meaning: string;
  iconKey: 'design' | 'code' | 'retouch';
  prefix: string;
  highlight: string;
  description: string;
  color: string;
  haloColor: string;
  accentBorder: string;
  buttonColor: string;
  image: string;
  alt: string;
}

export interface AttachedOrderPhoto {
  id: string;
  name: string;
  dataUrl: string; // Base64 data URL with full fidelity preview
  sizeBytes: number;
  sizeFormatted: string; // e.g. "1.8 MB"
  type: string; // e.g. "image/jpeg"
  role: 'main_speaker' | 'guest_minister' | 'host' | 'artist' | 'logo' | 'qr_code' | 'reference' | 'background' | 'studio_selfie' | 'other';
  roleLabel: string; // e.g. "Main Speaker / Minister"
  instructions?: string; // Custom notes e.g. "Cut out background, enhance lighting"
  retouchRequested?: boolean; // Complimentary Studio Background Removal & Tone Calibration
  dimensions?: { width: number; height: number };
  uploadedAt: string;
  qrMetadata?: {
    linkUrl: string;
    calloutText: string;
    category: string;
  };
}

export interface QRCodeCustomization {
  url: string;
  calloutText: string;
  category: 'mockup' | 'assets' | 'proofing' | 'tracker' | 'tickets' | 'rsvp' | 'livestream' | 'location' | 'whatsapp' | 'giving' | 'social' | 'custom';
  fgColor: string;
  bgColor: string;
  themePreset: 'gold_navy' | 'monochrome' | 'electric_neon' | 'emerald_luxury' | 'ruby_champagne' | 'custom';
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
  includeMargin: boolean;
  centerIconType?: 'eye' | 'download' | 'shield' | 'clock' | 'smartphone' | 'cross' | 'ticket' | 'youtube' | 'whatsapp' | 'location' | 'globe' | 'music' | 'dollar' | 'custom' | 'none';
  customLogoUrl?: string;
  frameStyle: 'banner_top' | 'banner_bottom' | 'minimal_card' | 'plain';
}

export interface DesignInquiry {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  selectedStyleCategory: DesignCategory;
  specificItemTitle?: string;
  projectDetails: string;
  preferredColors?: string;
  deadlineDate?: string;
  selectedAddOns: string[];
  totalEstimate: number;
  status: 'Pending' | 'In Progress' | 'Completed';
  createdAt: string;
  aiBriefGenerated?: boolean;
  attachedPhotos?: AttachedOrderPhoto[];
}

export interface AIBriefRequest {
  clientName: string;
  designCategory: string;
  eventOrBusinessName: string;
  rawDetails: string;
  targetAudience?: string;
  preferredVibe?: string;
}

export interface AIBriefResponse {
  suggestedTitle: string;
  suggestedHeadline: string;
  suggestedTagline: string;
  recommendedColorPalette: {
    primary: string;
    secondary: string;
    accent: string;
    description: string;
  };
  layoutConcept: string;
  recommendedTypographyStyle: string;
  keyInformationChecklist: string[];
  estimatedPriceRange: {
    min: number;
    max: number;
  };
  recommendedAddons: string[];
  designerNotes: string;
}
