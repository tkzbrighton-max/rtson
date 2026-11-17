export interface MenuItemType {
  id: string;
  label: string;
  category: string;
  subType?: string;
  platform?: 'instagram' | 'facebook' | 'youtube' | 'print' | 'general';
  description: string;
  badge?: string;
  iconName?: string;
  priceHint?: string;
}

export interface MenuGroup {
  id: string;
  label: string;
  icon: string;
  category: string;
  description: string;
  items: MenuItemType[];
}

export const MENU_DATA: MenuGroup[] = [
  {
    id: 'flyers',
    label: 'Flyers',
    icon: 'Layers',
    category: 'simple_flyer',
    description: 'Print & digital flyers with 3D typography',
    items: [
      {
        id: 'all_flyers',
        label: 'All Flyers',
        category: 'simple_flyer',
        description: 'Browse all flyer styles',
        badge: 'Popular'
      },
      {
        id: 'church_flyers',
        label: 'Church & Gospel 3D',
        category: 'church_flyer',
        subType: 'church',
        description: 'Sunday services, conferences & revivals',
        badge: '3D Gold'
      },
      {
        id: 'simple_flyers',
        label: 'Business & Promo',
        category: 'simple_flyer',
        subType: 'simple',
        description: 'A4/Letter promos & corporate sales',
        badge: '12h Express'
      },
      {
        id: 'event_posters',
        label: 'Nightclub & DJ Events',
        category: 'event_poster',
        subType: 'event_club',
        description: 'VIP parties, festivals & ticket promos',
        badge: 'Neon Glow'
      },
      {
        id: 'motion_flyers',
        label: 'Animated Motion Video',
        category: 'event_poster',
        subType: 'motion_flyer',
        description: '15s MP4 video flyer with beat sync',
        badge: '60 FPS'
      }
    ]
  },
  {
    id: 'brochures',
    label: 'Brochures',
    icon: 'BookOpen',
    category: 'brochure',
    description: 'Corporate pamphlets & product catalogs',
    items: [
      {
        id: 'all_brochures',
        label: 'All Brochures',
        category: 'brochure',
        description: 'All corporate & marketing layouts'
      },
      {
        id: 'bi_fold_brochure',
        label: 'Bi-Fold (4-Panel)',
        category: 'brochure',
        subType: 'bi_fold',
        description: 'Executive company profiles',
        badge: '4-Panel'
      },
      {
        id: 'tri_fold_brochure',
        label: 'Tri-Fold (6-Panel)',
        category: 'brochure',
        subType: 'tri_fold',
        description: 'Standard marketing pamphlets',
        badge: 'Popular'
      },
      {
        id: 'company_profile_booklet',
        label: 'Catalog & Profile Booklet',
        category: 'brochure',
        subType: 'booklet',
        description: '8 to 16 page reports & catalogs',
        badge: 'Multi-Page'
      },
      {
        id: 'gate_fold_menu',
        label: 'Restaurant & Event Menus',
        category: 'brochure',
        subType: 'gate_fold',
        description: 'Food menus & luxury programs',
        badge: 'Custom Fold'
      },
      {
        id: 'packaging_die_cut_prep',
        label: 'Packaging & Die-Cut Prep',
        category: 'brochure',
        subType: 'packaging_print',
        description: 'Spot UV masks, foil stamping layers & Pantone PMS calibration',
        badge: 'Pre-Press'
      }
    ]
  },
  {
    id: 'presentations',
    label: 'Decks',
    icon: 'Presentation',
    category: 'presentation',
    description: 'Pitch decks, keynotes & training slides',
    items: [
      {
        id: 'all_presentations',
        label: 'All Slide Decks',
        category: 'presentation',
        description: 'PowerPoint, Keynote & Google Slides'
      },
      {
        id: 'investor_pitch_deck',
        label: 'Investor Pitch Decks',
        category: 'presentation',
        subType: 'pitch_deck',
        description: '10-15 high-converting investor slides',
        badge: 'Investor'
      },
      {
        id: 'corporate_keynote',
        label: 'Corporate Keynotes',
        category: 'presentation',
        subType: 'keynote',
        description: 'Executive conference & board slides',
        badge: 'Executive'
      },
      {
        id: 'training_deck',
        label: 'Training & Course Slides',
        category: 'presentation',
        subType: 'training',
        description: 'Workshops & interactive lesson decks',
        badge: 'Workshop'
      },
      {
        id: 'sales_proposal_deck',
        label: 'Sales Proposals',
        category: 'presentation',
        subType: 'sales_deck',
        description: 'B2B proposals & client pitch slides',
        badge: 'Commercial'
      }
    ]
  },
  {
    id: 'social_media',
    label: 'Social Media',
    icon: 'Share2',
    category: 'social_media',
    description: 'Graphics for Instagram, Facebook & YouTube',
    items: [
      {
        id: 'all_social',
        label: 'All Social Graphics',
        category: 'social_media',
        description: 'Complete digital social suite'
      },
      {
        id: 'instagram_posts',
        label: 'Instagram Posts (1:1)',
        category: 'social_media',
        subType: 'instagram_post',
        platform: 'instagram',
        description: '1080x1080 square promos & quotes',
        badge: '1:1 Square'
      },
      {
        id: 'instagram_stories',
        label: 'Stories & Reels (9:16)',
        category: 'social_media',
        subType: 'instagram_story',
        platform: 'instagram',
        description: '1080x1920 vertical stories & covers',
        badge: '9:16 Story'
      },
      {
        id: 'facebook_banners',
        label: 'Facebook Banners (820x312)',
        category: 'social_media',
        subType: 'facebook_banner',
        platform: 'facebook',
        description: 'Page headers & group covers',
        badge: 'FB Cover'
      },
      {
        id: 'facebook_ads',
        label: 'Meta Feed Ads (1200x628)',
        category: 'social_media',
        subType: 'facebook_ad',
        platform: 'facebook',
        description: 'High-CTR sponsored ads',
        badge: 'Meta Ads'
      },
      {
        id: 'carousels',
        label: 'Swipe Carousels (3-5 Slides)',
        category: 'social_media',
        subType: 'carousel',
        platform: 'instagram',
        description: 'Seamless swipe slides for IG',
        badge: 'Carousel'
      },
      {
        id: 'youtube_thumbnails',
        label: 'YouTube Thumbnails',
        category: 'social_media',
        subType: 'youtube_thumbnail',
        platform: 'youtube',
        description: '1280x720 click-boosting covers',
        badge: 'High CTR'
      },
      {
        id: 'social_retainer_engine',
        label: 'Monthly Content Retainer',
        category: 'social_media',
        subType: 'social_retainer',
        platform: 'general',
        description: '12-16 posts/reels, monthly content calendar & Canva kit',
        badge: 'Retainer'
      }
    ]
  },
  {
    id: 'artwork',
    label: 'Artwork',
    icon: 'Palette',
    category: 'branding',
    description: 'Vector logos, 3D typography & retouching',
    items: [
      {
        id: 'all_artwork',
        label: 'All Artwork & Logos',
        category: 'branding',
        description: 'Vector suites & 3D lettering'
      },
      {
        id: 'brand_strategy_workshop',
        label: 'Brand Strategy Workshop',
        category: 'branding',
        subType: 'brand_strategy',
        description: 'Archetype discovery, core values & brand voice spectrum',
        badge: 'Workshop'
      },
      {
        id: 'vector_logos',
        label: 'Vector Logo Suite',
        category: 'branding',
        subType: 'logo_branding',
        description: 'Vector AI/SVG files & guidelines',
        badge: 'Full Suite'
      },
      {
        id: 'photo_retouching',
        label: 'Photo Retouching & Cutouts',
        category: 'branding',
        subType: 'retouching',
        description: '300 DPI skin smoothing & masking',
        badge: '300 DPI'
      },
      {
        id: 'gold_typography',
        label: '3D Gold Typography',
        category: 'branding',
        subType: '3d_typography',
        description: 'Metallic gold & chrome lettering',
        badge: '3D Custom'
      },
      {
        id: 'vector_crests',
        label: 'Crests & Badges',
        category: 'branding',
        subType: 'crest_badge',
        description: 'Church crests & corporate seals',
        badge: 'Vector Crest'
      }
    ]
  },
  {
    id: 'web_apps',
    label: 'Web & Apps',
    icon: 'Globe',
    category: 'website_design',
    description: 'Modern websites, web applications & mobile UI/UX',
    items: [
      {
        id: 'all_web_apps',
        label: 'All Web & Apps',
        category: 'website_design',
        description: 'Websites, web portals & mobile apps',
        badge: 'Full Stack'
      },
      {
        id: 'business_websites',
        label: 'Business & Brand Websites',
        category: 'website_design',
        subType: 'website',
        description: 'High-converting responsive landing pages & portals',
        badge: 'Responsive'
      },
      {
        id: 'web_applications',
        label: 'Custom Web Applications',
        category: 'web_app',
        subType: 'web_app',
        description: 'Dashboards, SaaS portals & booking systems',
        badge: 'React/Next'
      },
      {
        id: 'mobile_app_design',
        label: 'iOS & Android Mobile Apps',
        category: 'mobile_app',
        subType: 'mobile_app',
        description: 'Figma UI/UX prototypes & mobile applications',
        badge: 'iOS/Android'
      },
      {
        id: 'ecommerce_stores',
        label: 'E-Commerce Storefronts',
        category: 'web_app',
        subType: 'ecommerce',
        description: 'Online shops with payment gateway integration',
        badge: 'Storefront'
      },
      {
        id: 'figma_to_frontend',
        label: 'Figma to Clean Frontend Code',
        category: 'website_design',
        subType: 'figma_to_code',
        description: 'Translate UI mockups into responsive HTML/Tailwind/React',
        badge: 'Code Handoff'
      }
    ]
  }
];

export interface StudioToolItem {
  id: string;
  label: string;
  description: string;
  iconName: string;
  action: 'dimensions' | 'retouching' | 'video' | 'calculator' | 'comparison' | 'reviews' | 'order_tracker';
}

export const STUDIO_TOOLS: StudioToolItem[] = [
  {
    id: 'tool-calculator',
    label: 'Price Calculator',
    description: 'Custom quotes & package discounts',
    iconName: 'Calculator',
    action: 'calculator'
  },
  {
    id: 'tool-dimensions',
    label: 'Dimensions Guide',
    description: 'Print bleeds & aspect ratios',
    iconName: 'Layout',
    action: 'dimensions'
  },
  {
    id: 'tool-retouching',
    label: 'Retouching Slider',
    description: 'Before & after photo comparison',
    iconName: 'Wand2',
    action: 'retouching'
  },
  {
    id: 'tool-video',
    label: 'Video & Speed-Arts',
    description: 'Motion flyers & creation workflows',
    iconName: 'PlaySquare',
    action: 'video'
  },
  {
    id: 'tool-comparison',
    label: 'Package Matrix',
    description: 'Side-by-side deliverables & specs',
    iconName: 'FileCheck',
    action: 'comparison'
  },
  {
    id: 'tool-reviews',
    label: 'Client Reviews',
    description: '500+ verified ratings & feedback',
    iconName: 'Award',
    action: 'reviews'
  },
  {
    id: 'tool-tracker',
    label: 'Track Order',
    description: 'Live order milestones & proofs',
    iconName: 'Clock',
    action: 'order_tracker'
  }
];
