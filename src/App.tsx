import React, { useState, useMemo, useEffect } from 'react';
import { INITIAL_PORTFOLIO_ITEMS } from './data/portfolioData';
import { PRICING_PACKAGES, ADD_ON_OPTIONS } from './data/pricingData';
import { INITIAL_SHOWCASE_VIDEOS } from './data/videoData';
import { PortfolioItem, PricingPackage, AddOnOption, ShowcaseVideo } from './types';
import { testConnection, auth } from './lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { 
  subscribeToSiteConfig, 
  subscribeToPortfolioItems, 
  subscribeToShowcaseVideos, 
  saveSiteHeroImage, 
  resetSiteHeroImage,
  saveDesignerCutout,
  resetDesignerCutout,
  savePortfolioItem,
  deletePortfolioItem,
  saveShowcaseVideo,
  deleteShowcaseVideo,
  resolveWorkingVideoUrl,
  SiteConfigData
} from './lib/cms';
import {
  getLocalCachedFlyers,
  getAllStoredCustomFlyers,
  persistCustomFlyer,
  deleteStoredCustomFlyer
} from './lib/flyerStorage';

import { Navbar } from './components/Navbar';
import { HomePage } from './components/HomePage';
import { AboutPage } from './components/AboutPage';
import { ProductsPage } from './components/ProductsPage';
import { RetouchDeskPage } from './components/RetouchDeskPage';
import { ContactPage } from './components/ContactPage';
import { StartOrderPage } from './components/StartOrderPage';
import { LightboxModal } from './components/LightboxModal';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { DesignerAdminModal } from './components/DesignerAdminModal';
import { LiveProofingPortalModal } from './components/LiveProofingPortalModal';
import { InvoiceQuoteGeneratorModal } from './components/InvoiceQuoteGeneratorModal';
import { PhotorealisticMockupViewer } from './components/PhotorealisticMockupViewer';
import { PhoneApprovalModal } from './components/PhoneApprovalModal';
import { Footer } from './components/Footer';
import { SplashScreen } from './components/SplashScreen';
import { SelfieStudioCaptureModal } from './components/SelfieStudioCaptureModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { FloatingContactWidget } from './components/FloatingContactWidget';
import { ThemeProvider } from './context/ThemeContext';
import { ThemeSelectorModal } from './components/ThemeSelectorModal';
import { PageTransitionLoader } from './components/PageTransitionLoader';
import realChurchFlyerImg from './assets/images/real_church_flyer_1787906566871.jpg';

export default function App() {
  return (
    <ThemeProvider>
      <MainAppContent />
    </ThemeProvider>
  );
}

function MainAppContent() {
  // Splash Screen Intro State (plays once per session or on manual replay, snappy and fast)
  const [showSplash, setShowSplash] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return !sessionStorage.getItem('rtson_splash_passed');
    }
    return false;
  });

  // Active Primary Page: 'home' | 'about' | 'products' | 'retouch' | 'contact' | 'order'
  const [activePage, setActivePage] = useState<'home' | 'about' | 'products' | 'retouch' | 'contact' | 'order'>('home');

  // State for Portfolio Items & Dynamic CMS data (starting clean from zero as requested)
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>(() => {
    const cached = getLocalCachedFlyers();
    // Filter out all old stubborn demo flyers (Pastor Chris, RCCG, SDA, mock flyers)
    const realUploads = (cached || []).filter(item => 
      !item.id.includes('rccg') &&
      !item.id.includes('sda') &&
      !item.id.includes('chris') &&
      !item.id.startsWith('flyer-')
    );
    return realUploads;
  });
  const [pricingPackages, setPricingPackages] = useState<PricingPackage[]>(PRICING_PACKAGES);
  const [addOnOptions, setAddOnOptions] = useState<AddOnOption[]>(ADD_ON_OPTIONS);
  const [showcaseVideos, setShowcaseVideos] = useState<ShowcaseVideo[]>(INITIAL_SHOWCASE_VIDEOS);
  const [siteConfig, setSiteConfig] = useState<SiteConfigData | null>(null);

  // Active Hero Background Image state for instantaneous 0ms visual updates
  const [customHeroImageUrl, setCustomHeroImageUrl] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('rtson_hero_bg_image') || '';
    }
    return '';
  });

  const [customCutoutUrl, setCustomCutoutUrl] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('rtson_designer_cutout') || '';
    }
    return '';
  });

  // Automatically detect Brighton's login to unlock the Admin Terminal
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user && user.email) {
        const emailLower = user.email.toLowerCase().trim();
        if (emailLower === 'tkzbrighton@gmail.com' || emailLower === 'info@rtsoncreations.co.zw') {
          localStorage.setItem('rtson_admin_visible', 'true');
          sessionStorage.setItem('rtson_admin_authed', 'true');
          sessionStorage.setItem('rtson_admin_email', emailLower);
          window.dispatchEvent(new Event('storage'));
        }
      }
    });
    return () => unsub();
  }, []);

  const handleSaveHeroImage = async (url: string) => {
    setCustomHeroImageUrl(url);
    await saveSiteHeroImage(url);
  };

  const handleResetHeroImage = async () => {
    setCustomHeroImageUrl('');
    await resetSiteHeroImage();
  };

  const handleSaveCutoutImage = async (url: string) => {
    setCustomCutoutUrl(url);
    await saveDesignerCutout(url);
  };

  const handleResetCutoutImage = async () => {
    setCustomCutoutUrl('');
    await resetDesignerCutout();
  };

  // Transferred Retouched Photo from Desk
  const [transferredRetouchImage, setTransferredRetouchImage] = useState<string | null>(null);
  const [transferredRetouchSummary, setTransferredRetouchSummary] = useState<string>('');

  // Modal States
  const [lightboxItem, setLightboxItem] = useState<PortfolioItem | null>(null);
  const [isOrderTrackerOpen, setIsOrderTrackerOpen] = useState<boolean>(false);
  const [isLiveProofingOpen, setIsLiveProofingOpen] = useState<boolean>(false);
  const [isInvoiceGeneratorOpen, setIsInvoiceGeneratorOpen] = useState<boolean>(false);
  const [isSelfieStudioGlobalOpen, setIsSelfieStudioGlobalOpen] = useState<boolean>(false);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [adminMode, setAdminMode] = useState<'inquiries' | 'add_design' | 'upload_video' | 'change_prices' | 'manage_flyers' | 'integrations' | 'cms_assets'>('inquiries');
  
  // 3D Mockup Viewer Modal State for QR Code Links & Client Access
  const [isMockupViewerOpen, setIsMockupViewerOpen] = useState<boolean>(false);
  const [mockupViewerData, setMockupViewerData] = useState<{
    imageUrl: string;
    title: string;
    categoryLabel?: string;
  }>({
    imageUrl: realChurchFlyerImg,
    title: '3D Photorealistic Design Mockup',
    categoryLabel: 'Pre-Press Artwork'
  });

  // Order Pre-populated Selection
  const [selectedItemForOrder, setSelectedItemForOrder] = useState<PortfolioItem | null>(null);
  const [selectedCategoryForOrder, setSelectedCategoryForOrder] = useState<string>('church_flyer');
  const [selectedProposedPriceForOrder, setSelectedProposedPriceForOrder] = useState<number | null>(null);

  // Studio Director Mobile Phone Approval State (Triggered when director opens approval link on phone)
  const [globalPhoneApproval, setGlobalPhoneApproval] = useState<{
    isOpen: boolean;
    quoteRef: string;
    clientName?: string;
    clientPhone?: string;
    standardPrice: number;
    proposedPrice: number;
    flyerTitle?: string;
    clientNote?: string;
  }>({
    isOpen: false,
    quoteRef: '',
    standardPrice: 20,
    proposedPrice: 20
  });

  // Auto-detect ?approve_quote=... on mobile phone WhatsApp tap
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const approveQuote = params.get('approve_quote');
      if (approveQuote) {
        const price = parseFloat(params.get('price') || '15') || 15;
        const std = parseFloat(params.get('std') || String(price)) || price;
        const client = params.get('client') || 'Client';
        const flyer = params.get('flyer') || 'Flyer Project';
        setGlobalPhoneApproval({
          isOpen: true,
          quoteRef: approveQuote,
          clientName: client,
          clientPhone: 'WhatsApp Direct',
          standardPrice: std,
          proposedPrice: price,
          flyerTitle: flyer
        });
      }
    }
  }, []);

  // Firestore Real-Time Subscriptions & IndexedDB Initializer
  useEffect(() => {
    testConnection();

    // Load full IndexedDB stored flyers (filtering out any old demo flyers)
    getAllStoredCustomFlyers().then((stored) => {
      if (stored && stored.length > 0) {
        const cleaned = stored.filter(item => 
          !item.id.includes('rccg') &&
          !item.id.includes('sda') &&
          !item.id.includes('chris') &&
          !item.id.startsWith('flyer-')
        );
        setPortfolioItems(cleaned);
      }
    }).catch(console.error);

    const unsubConfig = subscribeToSiteConfig((config) => {
      setSiteConfig(config);
    });

    const unsubPortfolio = subscribeToPortfolioItems((items) => {
      if (items && items.length > 0) {
        const cleaned = items.filter(item => 
          !item.id.includes('rccg') &&
          !item.id.includes('sda') &&
          !item.id.includes('chris') &&
          !item.id.startsWith('flyer-')
        );
        setPortfolioItems(cleaned);
      }
    });

    const unsubVideos = subscribeToShowcaseVideos((videos) => {
      if (videos && videos.length > 0) {
        setShowcaseVideos(videos);
      }
    });

    return () => {
      unsubConfig();
      unsubPortfolio();
      unsubVideos();
    };
  }, []);

  // Handle URL Search Parameters for Direct QR Code Scans (Mockup, Proofing, Tracker)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const view = searchParams.get('view');
      const order = searchParams.get('order');
      const title = searchParams.get('title');

      if (view === 'mockup' || searchParams.has('mockup')) {
        setMockupViewerData({
          imageUrl: realChurchFlyerImg,
          title: title ? decodeURIComponent(title) : (order ? `Order #${order} Finalized Mockup` : '3D Photorealistic Design Mockup'),
          categoryLabel: order ? `Order #${order}` : 'Pre-Press Artwork'
        });
        setIsMockupViewerOpen(true);
      } else if (view === 'proofing' || searchParams.has('proofing')) {
        setIsLiveProofingOpen(true);
      } else if (view === 'tracker' || searchParams.has('tracker')) {
        setIsOrderTrackerOpen(true);
      } else if (view === 'contact' || searchParams.has('contact')) {
        setActivePage('contact');
      }
    } catch (e) {
      console.warn('URL params parsing failed:', e);
    }
  }, []);

  // Page Transition State presenting Flyer Information and soft loading bar
  const [isPageTransitioning, setIsPageTransitioning] = useState<boolean>(false);
  const [targetPage, setTargetPage] = useState<'home' | 'about' | 'products' | 'retouch' | 'contact' | 'order'>('home');

  // Navigation Handler with Soft Loading Transition presenting Flyer information
  const handleNavigate = (page: 'home' | 'about' | 'products' | 'retouch' | 'contact' | 'order') => {
    if (page === activePage) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setTargetPage(page);
    setIsPageTransitioning(true);
  };

  const handleSelectProductForOrder = (item: PortfolioItem) => {
    setSelectedItemForOrder(item);
    setSelectedCategoryForOrder(item.category);
    handleNavigate('order');
  };

  const handleNavigateToOrderCustom = (category?: string, prefilledTitle?: string, customAmount?: number) => {
    if (category) setSelectedCategoryForOrder(category);
    if (customAmount) setSelectedProposedPriceForOrder(customAmount);
    setSelectedItemForOrder(null);
    handleNavigate('order');
  };

  const handleTransferRetouchToOrder = (imageDataUrl: string, summary: string) => {
    setTransferredRetouchImage(imageDataUrl);
    setTransferredRetouchSummary(summary);
    handleNavigate('order');
  };

  return (
    <div className="min-h-screen bg-[#12151a] font-sans text-white selection:bg-[#ff6b00] selection:text-black relative flex flex-col justify-between">
      
      {/* Brand Splash Screen */}
      {showSplash && (
        <SplashScreen
          onFinish={() => {
            if (typeof window !== 'undefined') {
              sessionStorage.setItem('rtson_splash_passed', 'true');
            }
            setShowSplash(false);
          }}
          minDurationMs={3000}
        />
      )}

      {/* Page Transition Loading Mechanism: Clean kinetic iris with single simple phrase */}
      {isPageTransitioning && (
        <PageTransitionLoader
          targetPage={targetPage}
          durationMs={500}
          onComplete={() => {
            setActivePage(targetPage);
            setIsPageTransitioning(false);
            window.scrollTo({ top: 0, behavior: 'instant' });
          }}
        />
      )}

      {/* Official Top Navigation Bar at the top as requested by user */}
      <Navbar
        onNavigate={handleNavigate}
        onOpenAdmin={() => {
          setAdminMode('inquiries');
          setIsAdminOpen(true);
        }}
        activePage={activePage}
      />

      {/* ========================================================================= */}
      {/* MAIN VIEW: PRESENTED AS 5 CLEAN DISTINCT PAGES                            */}
      {/* ========================================================================= */}
      <main id="main-content" className="flex-1 w-full pb-28 sm:pb-32">
        
        {/* 1. HOME PAGE: Redesigned according to flyer with custom backgrounds and cutout support */}
        {activePage === 'home' && (
          <HomePage
            onNavigate={handleNavigate}
            onNavigateToOrder={handleNavigateToOrderCustom}
            onOpenAdmin={() => {
              setAdminMode('cms_assets');
              setIsAdminOpen(true);
            }}
            customHeroImageUrl={customHeroImageUrl || siteConfig?.heroImageUrl || (typeof window !== 'undefined' ? localStorage.getItem('rtson_hero_bg_image') || undefined : undefined)}
            customCutoutUrl={customCutoutUrl || siteConfig?.designerCutoutUrl || (typeof window !== 'undefined' ? localStorage.getItem('rtson_designer_cutout') || undefined : undefined)}
            portfolioItems={portfolioItems}
          />
        )}

        {/* 2. ABOUT PAGE: Complete description of the platform, standards, capabilities & workflow */}
        {activePage === 'about' && (
          <AboutPage
            onNavigate={handleNavigate}
          />
        )}

        {/* 3. PRODUCTS PAGE: All available design products, specifications & Motion Video Showcases */}
        {activePage === 'products' && (
          <ProductsPage
            portfolioItems={portfolioItems}
            showcaseVideos={showcaseVideos}
            onSelectDesignForOrder={handleSelectProductForOrder}
            onPreviewItem={(item) => setLightboxItem(item)}
            onNavigateToOrder={handleNavigateToOrderCustom}
          />
        )}

        {/* 4. RETOUCH & REMOVE BG DESK: Interactive workbench to remove backgrounds, change clothes, fine-tune & send to WhatsApp */}
        {activePage === 'retouch' && (
          <RetouchDeskPage
            onNavigate={handleNavigate}
            onTransferToOrder={handleTransferRetouchToOrder}
          />
        )}

        {/* 5. CONTACT US PAGE: Mirrored from the uploaded template kit sample */}
        {activePage === 'contact' && (
          <ContactPage
            onNavigate={handleNavigate}
            onOpenAdmin={() => {
              setAdminMode('inquiries');
              setIsAdminOpen(true);
            }}
          />
        )}

        {/* 6. START ORDER PAGE: Configure design, calculate resultant price, and send to WhatsApp or Order Desk */}
        {activePage === 'order' && (
          <StartOrderPage
            initialItem={selectedItemForOrder}
            initialCategory={selectedCategoryForOrder}
            initialProposedPrice={selectedProposedPriceForOrder}
            initialRetouchedImage={transferredRetouchImage}
            initialRetouchedSummary={transferredRetouchSummary}
            onNavigateToRetouchDesk={() => handleNavigate('retouch')}
            onOpenLiveProofing={() => setIsLiveProofingOpen(true)}
            onOpenInvoiceGenerator={() => setIsInvoiceGeneratorOpen(true)}
            onOpenOrderTracker={() => setIsOrderTrackerOpen(true)}
            onOpenSelfieStudio={() => setIsSelfieStudioGlobalOpen(true)}
            onOpenMockupViewer={(imageUrl, title) => {
              setMockupViewerData({
                imageUrl: imageUrl || realChurchFlyerImg,
                title: title || 'Finalized Design Mockup',
                categoryLabel: 'Pre-Press Artwork'
              });
              setIsMockupViewerOpen(true);
            }}
            onOrderCompleted={() => {
              // Can show completion feedback
            }}
          />
        )}

      </main>

      {/* Footer (Rendered on all interior pages; ContactPage features its own mirrored corporate footer from the sample kit) */}
      {activePage !== 'contact' && (
        <Footer
          onSelectCategory={(cat) => {
            setSelectedCategoryForOrder(cat);
            handleNavigate('products');
          }}
          onOpenCalculator={() => handleNavigate('order')}
          onNavigate={handleNavigate}
          onOpenIntegrations={() => {
            setAdminMode('integrations');
            setIsAdminOpen(true);
          }}
          onOpenAdmin={() => {
            setAdminMode('inquiries');
            setIsAdminOpen(true);
          }}
          onReplaySplash={() => setShowSplash(true)}
        />
      )}

      {/* Lightbox High-Res Zoom Modal */}
      <LightboxModal
        item={lightboxItem}
        onClose={() => setLightboxItem(null)}
        onOrderThisStyle={handleSelectProductForOrder}
      />

      {/* Live Order Status & Design Tracker Modal */}
      <OrderTrackerModal
        isOpen={isOrderTrackerOpen}
        onClose={() => setIsOrderTrackerOpen(false)}
      />

      {/* Live Client Proofing & Revision Portal */}
      <LiveProofingPortalModal
        isOpen={isLiveProofingOpen}
        onClose={() => setIsLiveProofingOpen(false)}
      />

      {/* Instant Itemized Quote & Invoice Generator */}
      <InvoiceQuoteGeneratorModal
        isOpen={isInvoiceGeneratorOpen}
        onClose={() => setIsInvoiceGeneratorOpen(false)}
      />

      {/* 3D Photorealistic Mockup Viewer (Accessible via QR Code Scans & Start Order) */}
      <PhotorealisticMockupViewer
        flyerImageUrl={mockupViewerData.imageUrl}
        flyerTitle={mockupViewerData.title}
        categoryLabel={mockupViewerData.categoryLabel || '300 DPI Pre-Press Artwork'}
        isOpen={isMockupViewerOpen}
        onClose={() => setIsMockupViewerOpen(false)}
        onOrderThisStyle={() => {
          setIsMockupViewerOpen(false);
          setActivePage('order');
        }}
      />

      {/* Designer / Admin Management Portal (Accessible to Brighton via triple-click or footer) */}
      <DesignerAdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        portfolioItems={portfolioItems}
        onAddNewPortfolioItem={(newItem) => {
          setPortfolioItems(prev => [newItem, ...prev.filter(p => p.id !== newItem.id)]);
          persistCustomFlyer(newItem);
          savePortfolioItem(newItem);
        }}
        onUpdatePortfolioItem={(updatedItem) => {
          setPortfolioItems(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
          persistCustomFlyer(updatedItem);
          savePortfolioItem(updatedItem);
        }}
        onDeletePortfolioItem={(itemId) => {
          setPortfolioItems(prev => prev.filter(item => item.id !== itemId));
          deleteStoredCustomFlyer(itemId);
          deletePortfolioItem(itemId);
        }}
        pricingPackages={pricingPackages}
        onUpdatePackagePrice={(pkgId, newPrice) => {
          setPricingPackages(prev => prev.map(p => p.id === pkgId ? { ...p, basePrice: newPrice } : p));
        }}
        addOnOptions={addOnOptions}
        onUpdateAddOnPrice={(addOnId, newPrice) => {
          setAddOnOptions(prev => prev.map(a => a.id === addOnId ? { ...a, price: newPrice } : a));
        }}
        showcaseVideos={showcaseVideos}
        onAddVideo={(newVideo) => {
          setShowcaseVideos(prev => [newVideo, ...prev]);
          saveShowcaseVideo(newVideo);
        }}
        onDeleteVideo={(videoId) => {
          setShowcaseVideos(prev => prev.filter(v => v.id !== videoId));
          deleteShowcaseVideo(videoId);
        }}
        openMode={adminMode}
        customHeroImageUrl={customHeroImageUrl || siteConfig?.heroImageUrl || (typeof window !== 'undefined' ? localStorage.getItem('rtson_hero_bg_image') || undefined : undefined)}
        onSaveHeroImage={handleSaveHeroImage}
        onResetHeroImage={handleResetHeroImage}
        customCutoutUrl={customCutoutUrl || siteConfig?.designerCutoutUrl || (typeof window !== 'undefined' ? localStorage.getItem('rtson_designer_cutout') || undefined : undefined)}
        onSaveCutoutImage={handleSaveCutoutImage}
        onResetCutoutImage={handleResetCutoutImage}
      />

      {/* Theme Selection Modal */}
      <ThemeSelectorModal />

      {/* Global Studio Director Phone Approval Modal (for 1-tap phone review) */}
      <PhoneApprovalModal
        isOpen={globalPhoneApproval.isOpen}
        onClose={() => setGlobalPhoneApproval(prev => ({ ...prev, isOpen: false }))}
        quoteRef={globalPhoneApproval.quoteRef}
        clientName={globalPhoneApproval.clientName}
        clientPhone={globalPhoneApproval.clientPhone}
        standardPrice={globalPhoneApproval.standardPrice}
        proposedPrice={globalPhoneApproval.proposedPrice}
        flyerTitle={globalPhoneApproval.flyerTitle}
        clientNote={globalPhoneApproval.clientNote}
        onApproved={() => {
          setActivePage('order');
        }}
        onNavigateToOrder={() => {
          setActivePage('order');
        }}
      />

      {/* Global Studio Selfie Camera Modal */}
      <SelfieStudioCaptureModal
        isOpen={isSelfieStudioGlobalOpen}
        onClose={() => setIsSelfieStudioGlobalOpen(false)}
        onPhotoCaptured={(dataUrl, summary) => {
          setTransferredRetouchImage(dataUrl);
          setTransferredRetouchSummary(summary || 'Studio Live Selfie captured with calibrated lighting');
          setActivePage('order');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onSendToRetouchDesk={(dataUrl) => {
          setTransferredRetouchImage(dataUrl);
          setTransferredRetouchSummary('Studio Live Selfie portrait loaded into Retouch Desk');
          setActivePage('retouch');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onSendToStartOrder={(dataUrl, summary) => {
          setTransferredRetouchImage(dataUrl);
          setTransferredRetouchSummary(summary || 'Studio Live Selfie portrait for flyer design');
          setActivePage('order');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Floating Direct WhatsApp & Studio Inquiry Widget (Shown on interior pages, excluded from home page) */}
      {activePage !== 'home' && (
        <FloatingContactWidget
          onOpenOrderTracker={() => setIsOrderTrackerOpen(true)}
        />
      )}

      {/* Universal Floating Studio Navigation Dock (Mobile, Tablet & Desktop) */}
      <MobileBottomNav
        activePage={activePage}
        onNavigate={handleNavigate}
        onOpenAdmin={() => {
          setAdminMode('cms_assets');
          setIsAdminOpen(true);
        }}
      />

    </div>
  );
}
