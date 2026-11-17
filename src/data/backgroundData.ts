import rtsonWebsitePurple from '../assets/images/rtson_website_purple.svg';
import studioCreativeDeskBg from '../assets/images/studio_creative_desk_1791468122004.jpg';
import realChurchFlyerBg from '../assets/images/real_church_flyer_1787906566871.jpg';

export interface StudioSlideBackground {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  alt: string;
  haloColor: string;
  accentColor: string;
}

export const SHARED_STUDIO_BACKGROUNDS: StudioSlideBackground[] = [
  {
    id: 'studio-mastery',
    title: 'Studio Precision & Creative Mastery',
    subtitle: 'Full-Stack Design & Digital Architecture by R\'tson Creations',
    image: studioCreativeDeskBg,
    alt: 'R\'tson Creations Studio Creative Workstation',
    haloColor: 'rgba(255, 107, 0, 0.4)',
    accentColor: '#ff6b00',
  },
  {
    id: 'rtson-website-studio',
    title: 'Professional Website & Digital Craft',
    subtitle: 'Modern Responsive Design & High-Performance Architecture',
    image: rtsonWebsitePurple,
    alt: 'Rtson Creations Professional Website Design Vector',
    haloColor: 'rgba(255, 107, 0, 0.35)',
    accentColor: '#ff8800',
  },
  {
    id: 'church-3d-flyer-mastery',
    title: '300 DPI Pre-Press Artwork & Gospel Media',
    subtitle: '3D Metallic Gold Sculpting & Express Turnaround',
    image: realChurchFlyerBg,
    alt: 'Authentic 3D Church Service Poster by Rtson Creations',
    haloColor: 'rgba(255, 107, 0, 0.35)',
    accentColor: '#ff6b00',
  }
];

export const SLIDE_INTERVAL_MS = 5000;
