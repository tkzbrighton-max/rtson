import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Plus, UserCheck, CheckCircle2, Clock, DollarSign, Image as ImageIcon, 
  Tag, Trash2, ExternalLink, RefreshCw, Upload, Video, Film, Edit3, 
  Save, Sliders, MessageSquare, Zap, Folder, Maximize2, RotateCcw, 
  AlertCircle, Sparkles, Play, Link, Share2, Globe, Bot, Layers, Copy, FileCheck,
  Lock, Unlock, Key, Eye, EyeOff, ShieldAlert, KeyRound, ShieldCheck,
  CreditCard, Smartphone, LogIn, LogOut, Check, ArrowRight
} from 'lucide-react';
import { PortfolioItem, DesignCategory, PricingPackage, AddOnOption, ShowcaseVideo } from '../types';
import { auth, googleProvider } from '../lib/firebase';
import { signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { uploadImageAsDataUrl, uploadVideoFile, uploadVideoAsDataUrl, getYouTubeEmbedUrl, resolveWorkingVideoUrl, formatDirectVideoUrl, updateLocalInquiryNegotiation } from '../lib/cms';
import { sound } from '../lib/soundFx';

import realChurchFlyerImg from '../assets/images/real_church_flyer_1787906566871.jpg';
import realEventFlyerImg from '../assets/images/real_event_flyer_1787906580291.jpg';
import sdaCampMeetingImg from '../assets/images/sda_camp_meeting_flyer_1785486978976.jpg';
import realBusinessFlyerImg from '../assets/images/real_business_flyer_1787906598188.jpg';

import studioCreativeDeskImg from '../assets/images/studio_creative_desk_1791468122004.jpg';

// Authorized Studio Designing Email Credentials
const AUTHORIZED_DESIGNER_EMAILS = [
  'info@rtsoncreations.co.zw',
  'tkzbrighton@gmail.com'
];

interface DesignerAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  portfolioItems: PortfolioItem[];
  onAddNewPortfolioItem: (newItem: PortfolioItem) => void;
  onUpdatePortfolioItem?: (updatedItem: PortfolioItem) => void;
  onDeletePortfolioItem?: (itemId: string) => void;
  pricingPackages: PricingPackage[];
  onUpdatePackagePrice: (packageId: string, newPrice: number) => void;
  addOnOptions: AddOnOption[];
  onUpdateAddOnPrice: (addOnId: string, newPrice: number) => void;
  showcaseVideos: ShowcaseVideo[];
  onAddVideo: (newVideo: ShowcaseVideo) => void;
  onDeleteVideo: (videoId: string) => void;
  openMode?: 'inquiries' | 'add_design' | 'upload_video' | 'change_prices' | 'manage_flyers' | 'integrations' | 'cms_assets';
  customHeroImageUrl?: string;
  onSaveHeroImage?: (imageUrl: string) => Promise<void>;
  onResetHeroImage?: () => Promise<void>;
  customCutoutUrl?: string;
  onSaveCutoutImage?: (cutoutUrl: string) => Promise<void>;
  onResetCutoutImage?: () => Promise<void>;
}

export const DesignerAdminModal: React.FC<DesignerAdminModalProps> = ({
  isOpen,
  onClose,
  portfolioItems = [],
  onAddNewPortfolioItem,
  onUpdatePortfolioItem,
  onDeletePortfolioItem,
  pricingPackages = [],
  onUpdatePackagePrice,
  addOnOptions = [],
  onUpdateAddOnPrice,
  showcaseVideos = [],
  onAddVideo,
  onDeleteVideo,
  openMode = 'inquiries',
  customHeroImageUrl,
  onSaveHeroImage,
  onResetHeroImage,
  customCutoutUrl,
  onSaveCutoutImage,
  onResetCutoutImage
}) => {
  const [activeTab, setActiveTab] = useState<'inquiries' | 'payments' | 'manage_flyers' | 'upload_video' | 'change_prices' | 'integrations' | 'cms_assets'>(
    openMode === 'add_design' ? 'manage_flyers' : openMode === 'upload_video' ? 'upload_video' : openMode === 'change_prices' ? 'change_prices' : openMode === 'integrations' ? 'integrations' : openMode === 'cms_assets' ? 'cms_assets' : 'inquiries'
  );

  // --- Firebase Auth & Studio Admin State (Directly Unlocked as requested) ---
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [isSigningInGoogle, setIsSigningInGoogle] = useState(false);

  // Directly authenticated without gate or password lock
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setFirebaseUser(user);
      } else {
        setFirebaseUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleGoogleSignIn = async () => {
    setIsSigningInGoogle(true);
    setPasswordError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const emailLower = (result.user.email || '').toLowerCase().trim();
      if (AUTHORIZED_DESIGNER_EMAILS.includes(emailLower)) {
        setFirebaseUser(result.user);
        setIsAuthenticated(true);
        sessionStorage.setItem('rtson_admin_authed', 'true');
        sessionStorage.setItem('rtson_admin_email', emailLower);
        showNotification(`Welcome back Brighton (${result.user.email})! Studio Admin Unlocked.`);
      } else {
        await signOut(auth);
        setFirebaseUser(null);
        setIsAuthenticated(false);
        sessionStorage.removeItem('rtson_admin_authed');
        sessionStorage.removeItem('rtson_admin_email');
        setPasswordError(`Access Denied: "${result.user.email}" is not authorized. Only the studio designing email (info@rtsoncreations.co.zw) can access this portal.`);
      }
    } catch (err: any) {
      console.error('Google Auth Error:', err);
      setPasswordError(err.message || 'Firebase Auth Sign-In failed');
    } finally {
      setIsSigningInGoogle(false);
    }
  };

  // CMS State for Hero Background Image
  const [heroImageInput, setHeroImageInput] = useState<string>(customHeroImageUrl || '');
  const [isSavingHero, setIsSavingHero] = useState(false);

  const [cutoutImageInput, setCutoutImageInput] = useState<string>(customCutoutUrl || '');
  const [isSavingCutout, setIsSavingCutout] = useState(false);
  const heroFileInputRef = useRef<HTMLInputElement>(null);
  const cutoutFileInputRef = useRef<HTMLInputElement>(null);

  const [isAdminVisibleSetting, setIsAdminVisibleSetting] = useState<boolean>(() => {
    return localStorage.getItem('rtson_admin_visible') === 'true';
  });

  useEffect(() => {
    if (customCutoutUrl) {
      setCutoutImageInput(customCutoutUrl);
    }
  }, [customCutoutUrl]);

  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Custom owner password in localStorage, fallback to default 'admin123'
  const [currentPassword, setCurrentPassword] = useState<string>(() => {
    return localStorage.getItem('rtson_admin_pwd') || 'admin123';
  });

  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');

  const [inquiries, setInquiries] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [isLoadingInquiries, setIsLoadingInquiries] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // --- External Integrations & Auto-Sync State ---
  const [syncedFeed, setSyncedFeed] = useState<any[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [copiedWebhook, setCopiedWebhook] = useState(false);

  // GitHub Repository State
  const [githubRepoUrl, setGithubRepoUrl] = useState<string>(() => {
    return localStorage.getItem('rtson_github_repo') || 'https://github.com/tkzbrighton-max/rtson';
  });
  const [githubBranch, setGithubBranch] = useState<string>('main');
  const [isGithubConnected, setIsGithubConnected] = useState<boolean>(() => {
    return localStorage.getItem('rtson_github_connected') !== 'false';
  });

  // Picsart State
  const [picsartProfileUrl, setPicsartProfileUrl] = useState<string>(() => {
    return localStorage.getItem('rtson_picsart_url') || 'https://picsart.com/u/rtsoncreations';
  });
  // Pinterest State
  const [pinterestProfileUrl, setPinterestProfileUrl] = useState<string>(() => {
    return localStorage.getItem('rtson_pinterest_url') || 'https://pinterest.com/rtsoncreations';
  });
  const [picsartTitle, setPicsartTitle] = useState('Picsart Vector Church Flyer');
  const [picsartImageUrl, setPicsartImageUrl] = useState(sdaCampMeetingImg);

  // Lightroom State
  const [lightroomTitle, setLightroomTitle] = useState('Lightroom Color-Graded Speaker Poster');
  const [lightroomImageUrl, setLightroomImageUrl] = useState(realChurchFlyerImg);

  // --- Flyer Upload Form State ---
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<DesignCategory>('church_flyer');
  const [imageUrl, setImageUrl] = useState('');
  const [price, setPrice] = useState<number>(10);
  const [turnaroundHours, setTurnaroundHours] = useState<number>(24);
  const [description, setDescription] = useState('');
  const [clientType, setClientType] = useState('Studio Client');
  const [tags, setTags] = useState('church, flyer, 3d typography');
  const [features, setFeatures] = useState('Print Ready PDF (300 DPI)\nHigh Res PNG\n2 Free Revisions');
  const [isImageDragging, setIsImageDragging] = useState(false);

  // Edit flyer inline price map state
  const [editingFlyerPrices, setEditingFlyerPrices] = useState<Record<string, number>>({});

  // --- Edit Selected Flyer Picture & Details State ---
  const [editingFlyerId, setEditingFlyerId] = useState<string | null>(null);
  const [editFormTitle, setEditFormTitle] = useState('');
  const [editFormImageUrl, setEditFormImageUrl] = useState('');
  const [editFormPrice, setEditFormPrice] = useState<number>(10);
  const [editFormCategory, setEditFormCategory] = useState<DesignCategory>('church_flyer');
  const [editFormTurnaround, setEditFormTurnaround] = useState<number>(24);
  const [editFormDescription, setEditFormDescription] = useState('');
  const [editFormClientType, setEditFormClientType] = useState('');
  const [isEditImageDragging, setIsEditImageDragging] = useState(false);

  // --- Video Upload Form State (Gemini AI Video & Motion Clips) ---
  const [videoTitle, setVideoTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoCategory, setVideoCategory] = useState<DesignCategory>('church_flyer');
  const [videoDesc, setVideoDesc] = useState('');
  const [videoType, setVideoType] = useState<'motion_flyer' | 'speaking' | 'workstation' | 'tutorial'>('motion_flyer');
  const [isVideoDragging, setIsVideoDragging] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [uploadedVideoId, setUploadedVideoId] = useState<string | null>(null);
  const [uploadedVideoInfo, setUploadedVideoInfo] = useState<{ fileName: string; sizeMb: string } | null>(null);
  const [copiedAiPrompt, setCopiedAiPrompt] = useState<string | null>(null);

  const videoFileInputRef = useRef<HTMLInputElement>(null);
  const flyerFileInputRef = useRef<HTMLInputElement>(null);

  // Pricing Editor States
  const [pkgPrices, setPkgPrices] = useState<Record<string, number>>({});
  const [addOnPricesState, setAddOnPricesState] = useState<Record<string, number>>({});

  useEffect(() => {
    const pMap: Record<string, number> = {};
    pricingPackages.forEach(p => { pMap[p.id] = p.basePrice; });
    setPkgPrices(pMap);

    const aMap: Record<string, number> = {};
    addOnOptions.forEach(a => { aMap[a.id] = a.price; });
    setAddOnPricesState(aMap);
  }, [pricingPackages, addOnOptions]);

  // Load inquiries, payments, and synced feed
  useEffect(() => {
    if (isOpen && isAuthenticated) {
      fetchInquiries();
      fetchPayments();
      fetchSyncedFeed();
    }
  }, [isOpen, isAuthenticated]);

  const fetchInquiries = async () => {
    setIsLoadingInquiries(true);
    try {
      const res = await fetch('/api/inquiries');
      const data = await res.json();
      const serverList = data.success ? (data.inquiries || []) : [];

      let localList: any[] = [];
      try {
        localList = JSON.parse(localStorage.getItem('rtson_client_orders') || '[]');
      } catch (e) {}

      // Merge server + local orders by id / orderRef
      const combined = [...serverList];
      localList.forEach(loc => {
        const match = combined.find(c => c.id === loc.id || c.orderRef === loc.orderRef || (c.orderRef && c.orderRef === loc.id));
        if (!match) {
          combined.push(loc);
        } else {
          if (loc.negotiationStatus && loc.negotiationStatus !== 'pending_approval') {
            match.negotiationStatus = loc.negotiationStatus;
            match.status = loc.status || match.status;
          }
        }
      });

      setInquiries(combined);
    } catch (err) {
      console.error('Failed to fetch inquiries:', err);
      try {
        const localList = JSON.parse(localStorage.getItem('rtson_client_orders') || '[]');
        setInquiries(localList);
      } catch (e) {}
    } finally {
      setIsLoadingInquiries(false);
    }
  };

  const fetchPayments = async () => {
    try {
      const res = await fetch('/api/payments');
      const data = await res.json();
      if (data.success) {
        setPayments(data.payments || []);
      }
    } catch (err) {
      console.error('Failed to fetch payments:', err);
    }
  };

  const fetchSyncedFeed = async () => {
    try {
      const res = await fetch('/api/synced-flyers');
      const data = await res.json();
      if (data.success) {
        setSyncedFeed(data.syncedFlyers || []);
      }
    } catch (err) {
      console.error('Failed to fetch synced feed:', err);
    }
  };

  const showNotification = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  // --- External Integrations Handlers ---
  const handleSyncPicsart = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch('/api/integrations/sync/picsart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: picsartTitle,
          imageUrl: picsartImageUrl,
          price: 10,
          category: 'church_flyer'
        })
      });
      const data = await res.json();
      if (data.success && data.item) {
        onAddNewPortfolioItem(data.item);
        fetchSyncedFeed();
        showNotification('Artwork auto-uploaded from Picsart to website!');
      }
    } catch (err) {
      alert('Picsart auto-upload failed.');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSyncLightroom = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch('/api/integrations/sync/lightroom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: lightroomTitle,
          imageUrl: lightroomImageUrl,
          price: 20,
          category: 'church_flyer'
        })
      });
      const data = await res.json();
      if (data.success && data.item) {
        onAddNewPortfolioItem(data.item);
        fetchSyncedFeed();
        showNotification('Retouched photo auto-uploaded from Adobe Lightroom to website!');
      }
    } catch (err) {
      alert('Lightroom auto-upload failed.');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleUpdateInquiryStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/inquiries/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (data.success) {
        setInquiries(prev => prev.map(inq => (inq.id === id || inq.orderRef === id) ? { ...inq, status } : inq));
        showNotification(`Order status updated to: ${status.replace('_', ' ')}`);
      }
    } catch (err) {
      alert('Failed to update inquiry status.');
    }
  };

  const handleApproveProposal = async (inq: any) => {
    sound.playSuccess();
    const id = inq.orderRef || inq.id;
    const priceToApprove = inq.proposedPrice || inq.estimatedPrice || inq.standardPrice || 15;
    try {
      await fetch(`/api/inquiries/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'approved',
          negotiationStatus: 'approved',
          approvedPrice: priceToApprove
        })
      });
    } catch (e) {
      console.warn('Status patch notice:', e);
    }

    updateLocalInquiryNegotiation(id, 'approved', undefined, priceToApprove);
    setInquiries(prev => prev.map(item => (item.id === inq.id || item.orderRef === inq.orderRef) ? {
      ...item,
      status: 'approved',
      negotiationStatus: 'approved',
      approvedPrice: priceToApprove
    } : item));
    showNotification(`Approved proposed price of $${priceToApprove}.00 USD for ${inq.clientName || inq.name || 'Client'}!`);

    // Prepare WhatsApp confirmation back to client
    const cleanPhone = (inq.clientPhone || inq.contact || '').replace(/[^0-9]/g, '');
    if (cleanPhone.length > 5) {
      const text = `Hello ${inq.clientName || inq.name || 'there'}! Takudzwa Brighton here from R'tson Creations Studio Desk (info@rtsoncreations.co.zw). Your proposed quotation price of $${priceToApprove}.00 USD for quotation ${id} has been APPROVED! You can now download your approved PDF or proceed with design commencement.`;
      window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`, '_blank');
    }
  };

  const handleUpdatePaymentStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/payments/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (data.success) {
        setPayments(prev => prev.map(p => p.id === id ? { ...p, status } : p));
        showNotification(`Payment marked as: ${status}`);
      }
    } catch (err) {
      alert('Failed to update payment status.');
    }
  };

  const handleDeletePayment = async (id: string) => {
    if (!confirm('Remove this payment notification record?')) return;
    try {
      const res = await fetch(`/api/payments/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setPayments(prev => prev.filter(p => p.id !== id));
        showNotification('Payment record removed.');
      }
    } catch (err) {
      alert('Failed to delete payment.');
    }
  };

  // --- Handlers for Flyer Image Uploading ---
  const handleImageFileUpload = async (file: File) => {
    try {
      const base64 = await uploadImageAsDataUrl(file);
      setImageUrl(base64);
      if (!title) {
        const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ");
        setTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
      }
      showNotification(`Artwork image "${file.name}" loaded ready for publishing.`);
    } catch (err: any) {
      alert(err.message || 'Error processing image file');
    }
  };

  const handleAddFlyerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !imageUrl) {
      alert('Please fill in a title and upload or paste an artwork image URL.');
      return;
    }

    const categoryLabels: Record<DesignCategory, string> = {
      all: 'All Categories',
      website_design: 'Website & Landing Page',
      web_app: 'Custom Web Application',
      mobile_app: 'Mobile App UI/UX',
      simple_flyer: 'Simple Flyer',
      church_flyer: 'Church Flyer',
      event_poster: 'Event & Club Poster',
      social_media: 'Social Media Design',
      branding: 'Branding & Logo',
      brochure: 'Corporate Brochure',
      resume: 'Executive Resume',
      presentation: 'Presentation Deck'
    };

    const newItem: PortfolioItem = {
      id: `design-${Date.now()}`,
      title,
      category,
      categoryLabel: categoryLabels[category] || 'Graphic Design',
      imageUrl,
      price: Number(price),
      turnaroundHours: Number(turnaroundHours),
      description: description || 'High-impact professional artwork created by lead graphic designer R\'tson.',
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      clientType: clientType || 'Studio Client',
      featured: true,
      aspectRatio: category === 'social_media' ? '1:1' : '3:4',
      dimensionsLabel: 'High Resolution 300 DPI PDF & PNG',
      features: features.split('\n').map(f => f.trim()).filter(Boolean)
    };

    onAddNewPortfolioItem(newItem);
    showNotification(`Published new flyer "${title}" to website portfolio!`);
    
    // Reset form
    setTitle('');
    setImageUrl('');
    setDescription('');
  };

  const handleSaveFlyerPrice = (item: PortfolioItem) => {
    const newPrice = editingFlyerPrices[item.id];
    if (newPrice !== undefined && onUpdatePortfolioItem) {
      onUpdatePortfolioItem({
        ...item,
        price: Number(newPrice)
      });
      showNotification(`Price updated for "${item.title}" to $${newPrice} USD!`);
    }
  };

  // --- Handlers for Editing Flyer Picture & Details ---
  const startEditingFlyer = (item: PortfolioItem) => {
    setEditingFlyerId(item.id);
    setEditFormTitle(item.title);
    setEditFormImageUrl(item.imageUrl);
    setEditFormPrice(item.price);
    setEditFormCategory(item.category);
    setEditFormTurnaround(item.turnaroundHours);
    setEditFormDescription(item.description || '');
    setEditFormClientType(item.clientType || '');
  };

  const handleEditImageFileUpload = async (file: File) => {
    try {
      const base64 = await uploadImageAsDataUrl(file);
      setEditFormImageUrl(base64);
      showNotification(`Loaded new image for "${file.name}"`);
    } catch (err: any) {
      alert(err.message || 'Error processing image file');
    }
  };

  const handleSaveFlyerDetails = (item: PortfolioItem) => {
    if (!editFormTitle || !editFormImageUrl) {
      alert('Please enter a title and select/paste an artwork picture URL.');
      return;
    }

    const categoryLabels: Record<string, string> = {
      simple_flyer: 'Simple Flyer',
      church_flyer: 'Church Flyer',
      event_poster: 'Event & Club Poster',
      social_media: 'Social Media Design',
      branding: 'Branding & Logo',
      brochure: 'Corporate Brochure',
      resume: 'Executive Resume',
      presentation: 'Presentation Deck'
    };

    const updated: PortfolioItem = {
      ...item,
      title: editFormTitle,
      imageUrl: editFormImageUrl,
      price: Number(editFormPrice),
      category: editFormCategory,
      categoryLabel: categoryLabels[editFormCategory] || 'Graphic Design',
      turnaroundHours: Number(editFormTurnaround),
      description: editFormDescription,
      clientType: editFormClientType
    };

    if (onUpdatePortfolioItem) {
      onUpdatePortfolioItem(updated);
      showNotification(`Updated picture & details for "${editFormTitle}"!`);
    }
    setEditingFlyerId(null);
  };

  // --- Robust Handlers for Video Uploading (MP4, WebM, MOV, Drive & YouTube) ---
  const handleVideoFileUpload = async (file: File) => {
    setIsVideoLoading(true);
    try {
      const newVideoId = `vid-${Date.now()}`;
      setUploadedVideoId(newVideoId);
      const result = await uploadVideoFile(file, newVideoId);
      setVideoUrl(result.videoUrl);
      setUploadedVideoInfo({ fileName: result.fileName, sizeMb: result.sizeMb });
      
      if (!videoTitle) {
        const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ");
        const formattedTitle = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
        setVideoTitle(`${formattedTitle} — Graphic Design Motion Ad`);
      }
      showNotification(`Video "${file.name}" (${result.sizeMb} MB) ready for publishing!`);
    } catch (err: any) {
      console.error('Video upload failed:', err);
      alert('Could not process video file: ' + (err.message || 'Error reading file'));
    } finally {
      setIsVideoLoading(false);
    }
  };

  const handleAddVideoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoTitle || !videoUrl) {
      alert('Please enter a video title and choose a video file, paste a video link, or YouTube URL.');
      return;
    }

    const formattedUrl = formatDirectVideoUrl(videoUrl);
    const finalVideoId = uploadedVideoId || `vid-${Date.now()}`;

    const newVideo: ShowcaseVideo = {
      id: finalVideoId,
      title: videoTitle,
      videoUrl: formattedUrl,
      category: videoCategory,
      description: videoDesc || 'R\'tson Studio Graphic Design Advertising Video',
      type: videoType,
      addedAt: new Date().toISOString().split('T')[0]
    };

    onAddVideo(newVideo);
    showNotification(`Published new Graphic Design video "${videoTitle}"!`);

    setVideoTitle('');
    setVideoUrl('');
    setVideoDesc('');
    setUploadedVideoId(null);
    setUploadedVideoInfo(null);
  };

  // --- Handlers for Changing Prices ---
  const handleSaveAllPackagePrices = () => {
    Object.entries(pkgPrices).forEach(([pkgId, newPrice]) => {
      onUpdatePackagePrice(pkgId, Number(newPrice));
    });
    Object.entries(addOnPricesState).forEach(([addOnId, newPrice]) => {
      onUpdateAddOnPrice(addOnId, Number(newPrice));
    });
    showNotification('Saved all package and add-on price updates across website!');
  };

  // --- Password Auth Handlers ---
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === currentPassword) {
      setIsAuthenticated(true);
      sessionStorage.setItem('rtson_admin_authed', 'true');
      setPasswordError(null);
      setPasswordInput('');
    } else {
      setPasswordError('Incorrect owner password. Access denied.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('rtson_admin_authed');
    setPasswordInput('');
    setPasswordError(null);
  };

  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPasswordInput || newPasswordInput.trim().length < 4) {
      alert('New password must be at least 4 characters long.');
      return;
    }
    if (newPasswordInput !== confirmPasswordInput) {
      alert('Passwords do not match. Please re-enter.');
      return;
    }
    const cleanPwd = newPasswordInput.trim();
    setCurrentPassword(cleanPwd);
    localStorage.setItem('rtson_admin_pwd', cleanPwd);
    setIsChangingPassword(false);
    setNewPasswordInput('');
    setConfirmPasswordInput('');
    showNotification('Owner password updated successfully!');
  };

  if (!isOpen) return null;

  return (
    <div id="designer-admin-modal" className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-slate-950/90 backdrop-blur-md overflow-y-auto">
      
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[94vh] sm:max-h-[88vh]">
        
        {/* Terminal Header Bar */}
        <div className="p-3.5 sm:p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between flex-wrap gap-2.5 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex items-center gap-1 shrink-0">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#d4f15d] inline-block"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-white inline-block"></span>
            </div>
            <div className="min-w-0">
              <h2 className="text-xs sm:text-base font-black text-white flex items-center gap-1.5 font-mono flex-wrap truncate">
                <span className="truncate">STUDIO ADMIN CMS</span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-600 text-white">
                  ONLINE
                </span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 font-mono">
                  <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span className="truncate max-w-[140px] sm:max-w-none">{firebaseUser?.email || 'info@rtsoncreations.co.zw'}</span>
                </span>
              </h2>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Upload new flyers, motion graphic videos, update live pricing, and manage client orders.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchInquiries}
              title="Refresh Client Orders"
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Change Password Drawer */}
        {isChangingPassword && (
          <div className="p-4 bg-slate-950 border-b border-[#d4f15d]/30 space-y-3 shrink-0">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold text-[#bef264] flex items-center gap-2">
                <KeyRound className="w-4 h-4" />
                Update Owner Secret Password
              </h3>
              <button
                onClick={() => setIsChangingPassword(false)}
                className="text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleChangePasswordSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">New Password</label>
                <input
                  type="password"
                  value={newPasswordInput}
                  onChange={(e) => setNewPasswordInput(e.target.value)}
                  placeholder="At least 4 characters"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white font-mono focus:outline-none focus:border-[#d4f15d]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">Re-enter New Password</label>
                <input
                  type="password"
                  value={confirmPasswordInput}
                  onChange={(e) => setConfirmPasswordInput(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white font-mono focus:outline-none focus:border-[#d4f15d]"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-2 px-4 rounded-lg bg-[#d4f15d] hover:bg-[#bef264] text-slate-950 font-black text-xs transition-colors cursor-pointer shadow flex items-center justify-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Save Password</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Success Banner Notification */}
        {successMsg && (
          <div className="px-6 py-2 bg-blue-600 text-white text-xs font-bold flex items-center gap-2 shrink-0">
            <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Tab Navigation (Horizontal Scroll on Mobile) */}
        <div className="flex items-center border-b border-slate-800 bg-slate-950 px-3 sm:px-6 pt-2 gap-1.5 sm:gap-2 shrink-0 overflow-x-auto scrollbar-none whitespace-nowrap">
          
          <button
            onClick={() => setActiveTab('inquiries')}
            className={`pb-2.5 px-3 sm:px-4 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'inquiries'
                ? 'border-[#d4f15d] text-[#bef264]'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Orders</span>
            <span className="px-1.5 py-0.5 rounded-full bg-slate-800 text-slate-200 text-[10px]">
              {inquiries.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('payments')}
            className={`pb-2.5 px-3 sm:px-4 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'payments'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>EcoCash & Paynow</span>
            <span className="px-1.5 py-0.5 rounded-full bg-slate-800 text-slate-200 text-[10px] font-mono">
              {payments.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('manage_flyers')}
            className={`pb-2.5 px-3 sm:px-4 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'manage_flyers'
                ? 'border-[#d4f15d] text-[#bef264]'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Flyers ({portfolioItems.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('upload_video')}
            className={`pb-2.5 px-3 sm:px-4 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'upload_video'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Videos ({showcaseVideos.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('change_prices')}
            className={`pb-2.5 px-3 sm:px-4 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'change_prices'
                ? 'border-[#d4f15d] text-[#bef264]'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Prices</span>
          </button>

          <button
            onClick={() => setActiveTab('cms_assets')}
            className={`pb-2.5 px-3 sm:px-4 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'cms_assets'
                ? 'border-[#d4f15d] text-[#bef264]'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5 text-[#bef264]" />
            <span>Home Photo &amp; Image</span>
          </button>

          <button
            onClick={() => setActiveTab('integrations')}
            className={`pb-2.5 px-3 sm:px-4 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'integrations'
                ? 'border-[#d4f15d] text-[#bef264]'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-[#bef264]" />
            <span>Sync</span>
          </button>

        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* TAB 1: CLIENT ORDERS & INQUIRIES */}
          {activeTab === 'inquiries' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="text-sm font-extrabold text-white">Client Briefs & Inquiries ({inquiries.length})</h3>
                <button
                  onClick={fetchInquiries}
                  className="text-xs text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" /> Refresh List
                </button>
              </div>

              {isLoadingInquiries ? (
                <div className="py-12 text-center text-xs text-slate-400">Loading client inquiries...</div>
              ) : inquiries.length === 0 ? (
                <div className="p-8 text-center rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <MessageSquare className="w-8 h-8 text-slate-600 mx-auto" />
                  <p className="text-xs font-bold text-slate-300">No Inquiries Submitted Yet</p>
                  <p className="text-[11px] text-slate-500">When visitors order flyers or request project quotes, their details will appear here.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {inquiries.map((inq) => (
                    <div
                      key={inq.id || inq.orderRef}
                      className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white block">{inq.clientName || inq.name || 'Client'}</span>
                            <span className="text-[10px] font-mono text-[#bef264] bg-[#d4f15d]/10 px-1.5 py-0.5 rounded border border-[#d4f15d]/20">
                              {inq.orderRef || inq.id}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400">{inq.clientPhone || inq.contact} • {inq.clientEmail || 'Direct Client'}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="text-right">
                            <span className="text-[10px] font-mono text-slate-400 block">Proposed Price</span>
                            <span className="text-xs font-black px-2 py-0.5 rounded bg-[#d4f15d] text-slate-950 font-mono">
                              ${inq.proposedPrice || inq.agreedPrice || inq.estimatedPrice || inq.standardPrice || 15} USD
                            </span>
                          </div>

                          <select
                            value={inq.status || 'new'}
                            onChange={(e) => handleUpdateInquiryStatus(inq.id || inq.orderRef, e.target.value)}
                            className="text-xs bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-slate-200 focus:outline-none focus:border-blue-500"
                          >
                            <option value="new">New</option>
                            <option value="approved">Approved</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>
                      </div>

                      {/* Pricing & Negotiation Breakdown */}
                      <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="text-slate-400 text-[11px]">Design Scope:</span>
                            <strong className="text-white font-bold">{inq.designType || inq.categoryLabel || inq.category || 'Flyer Project'}</strong>
                          </div>
                          {inq.negotiationNote && (
                            <p className="text-[11px] text-[#bef264] italic">
                              Note: "{inq.negotiationNote}"
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          {inq.negotiationStatus === 'approved' ? (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
                              ✓ Approved Price: ${inq.approvedPrice || inq.proposedPrice || inq.agreedPrice || 15} USD
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleApproveProposal(inq)}
                              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-transform active:scale-95 cursor-pointer"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Approve Proposed (${inq.proposedPrice || inq.estimatedPrice || inq.standardPrice || 15})</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {inq.details && !inq.briefDetails && (
                        <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300 font-mono leading-relaxed whitespace-pre-line max-h-32 overflow-y-auto">
                          {inq.details}
                        </div>
                      )}

                      {inq.briefDetails && (
                        <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 font-mono leading-relaxed">
                          {inq.briefDetails}
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[10px] text-slate-500">Submitted: {new Date(inq.createdAt || Date.now()).toLocaleString()}</span>
                        {(inq.clientPhone || inq.contact) && (
                          <a
                            href={`https://wa.me/${(inq.clientPhone || inq.contact || '').replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(inq.clientName || inq.name || 'there')},%20this%20is%20Takudzwa%20Brighton%20from%20R'tson%20Creations%20regarding%20quotation%20${encodeURIComponent(inq.orderRef || inq.id)}.`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors flex items-center gap-1"
                          >
                            <span>WhatsApp Reply</span>
                            <ArrowRight className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PAYMENTS (ECOCASH & PAYNOW) */}
          {activeTab === 'payments' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="text-sm font-extrabold text-white">EcoCash & Paynow Payment Notifications ({payments.length})</h3>
                <button
                  onClick={fetchPayments}
                  className="text-xs text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" /> Refresh Payments
                </button>
              </div>

              {payments.length === 0 ? (
                <div className="p-8 text-center rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <CreditCard className="w-8 h-8 text-slate-600 mx-auto" />
                  <p className="text-xs font-bold text-slate-300">No Payment Submissions Yet</p>
                  <p className="text-[11px] text-slate-500">When clients click "I Have Paid with EcoCash" and submit their reference code, it will be listed here.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {payments.map((p) => (
                    <div
                      key={p.id}
                      className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">{p.clientName}</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-600/20 text-blue-300 border border-blue-500/30">
                            {p.method?.toUpperCase() || 'ECOCASH'}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${p.status === 'verified' ? 'bg-blue-600 text-white' : 'bg-[#d4f15d]/20 text-[#bef264] border border-[#d4f15d]/30'}`}>
                            {p.status || 'pending'}
                          </span>
                        </div>

                        <p className="text-xs text-slate-300">
                          Ref Code: <span className="font-mono font-bold text-[#bef264]">{p.reference || p.transactionRef || 'N/A'}</span> • Amount: <span className="font-bold text-white">${p.amount} USD</span>
                        </p>
                        <p className="text-[10px] text-slate-500">Client Phone: {p.clientPhone} • {new Date(p.createdAt).toLocaleString()}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        {p.status !== 'verified' && (
                          <button
                            onClick={() => handleUpdatePaymentStatus(p.id, 'verified')}
                            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer"
                          >
                            Mark Verified
                          </button>
                        )}
                        <button
                          onClick={() => handleDeletePayment(p.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-900 transition-colors cursor-pointer"
                          title="Delete Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: UPLOAD & MANAGE FLYERS */}
          {activeTab === 'manage_flyers' && (
            <div className="space-y-8">
              
              {/* Add New Flyer Box */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                  <Plus className="w-4 h-4 text-[#bef264]" />
                  <h3 className="text-sm font-extrabold text-white">Upload New Flyer / Artwork to Website</h3>
                </div>

                <form onSubmit={handleAddFlyerSubmit} className="space-y-4">
                  
                  {/* File Upload Box */}
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Flyer Image (Upload Picture or Drag & Drop)</label>
                    <div
                      onDragOver={(e) => { e.preventDefault(); setIsImageDragging(true); }}
                      onDragLeave={() => setIsImageDragging(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsImageDragging(false);
                        const file = e.dataTransfer.files?.[0];
                        if (file) handleImageFileUpload(file);
                      }}
                      className={`relative border-2 border-dashed rounded-xl p-5 text-center transition-colors cursor-pointer ${
                        isImageDragging ? 'border-[#d4f15d] bg-[#d4f15d]/10' : 'border-slate-800 bg-slate-900 hover:border-slate-700'
                      }`}
                    >
                      <input
                        ref={flyerFileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageFileUpload(file);
                        }}
                        className="hidden"
                      />

                      {imageUrl ? (
                        <div className="flex flex-col items-center gap-2">
                          <img
                            src={imageUrl}
                            alt="Preview"
                            loading="lazy"
                            decoding="async"
                            referrerPolicy="no-referrer"
                            className="w-24 h-32 object-cover rounded-lg border border-[#d4f15d]/50 shadow"
                          />
                          <button
                            type="button"
                            onClick={() => flyerFileInputRef.current?.click()}
                            className="text-[11px] text-[#bef264] font-bold hover:underline cursor-pointer"
                          >
                            Click to Replace Picture
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Upload className="w-7 h-7 text-[#bef264] mx-auto" />
                          <p className="text-xs font-bold text-slate-200">Click to Browse Flyer Image or Drag File Here</p>
                          <p className="text-[10px] text-slate-400">Supports PNG, JPG, WebP (Optimized for instant 300 DPI web viewing)</p>
                          <button
                            type="button"
                            onClick={() => flyerFileInputRef.current?.click()}
                            className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors cursor-pointer border border-slate-700"
                          >
                            Browse Image File
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-400 block mb-1">OR Paste Image URL Directly</label>
                    <input
                      type="text"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://... or upload original file above"
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#d4f15d]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">Flyer Title *</label>
                      <input
                        type="text"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. 3D Gold Praise & Worship Night"
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#d4f15d]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">Category</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as DesignCategory)}
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#d4f15d]"
                      >
                        <option value="website_design">Website & Landing Page</option>
                        <option value="web_app">Custom Web App</option>
                        <option value="mobile_app">Mobile App UI/UX</option>
                        <option value="church_flyer">Church Flyer</option>
                        <option value="event_poster">Event & Club Poster</option>
                        <option value="simple_flyer">Simple Flyer</option>
                        <option value="social_media">Social Media Design</option>
                        <option value="brochure">Corporate Brochure</option>
                        <option value="resume">Executive Resume</option>
                        <option value="presentation">Presentation Deck</option>
                        <option value="branding">Branding & Logo</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">Price ($ USD)</label>
                      <input
                        type="number"
                        min={1}
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white font-bold focus:outline-none focus:border-[#d4f15d]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">Turnaround (Hours)</label>
                      <input
                        type="number"
                        value={turnaroundHours}
                        onChange={(e) => setTurnaroundHours(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#d4f15d]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Description</label>
                    <textarea
                      rows={2}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="High resolution artwork with 3D gold text and speaker retouching..."
                      className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#d4f15d]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 px-4 rounded-xl bg-[#d4f15d] hover:bg-[#bef264] text-slate-950 font-black text-xs transition-colors cursor-pointer flex items-center justify-center gap-2 shadow"
                  >
                    <Upload className="w-4 h-4" />
                    <span>+ Publish Flyer To Website Live</span>
                  </button>
                </form>
              </div>

              {/* Flyer List & Price Editor */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h3 className="text-sm font-extrabold text-white">Live Website Flyer Portfolio ({portfolioItems.length})</h3>
                  <span className="text-[11px] text-slate-400">Click "Edit Pic" to change artwork or price</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {portfolioItems.map((item) => {
                    const isEditingThis = editingFlyerId === item.id;

                    if (isEditingThis) {
                      return (
                        <div
                          key={item.id}
                          className="sm:col-span-2 p-4 rounded-xl bg-slate-950 border-2 border-[#d4f15d]/60 shadow-xl space-y-4"
                        >
                          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                            <span className="text-xs font-bold text-[#bef264] flex items-center gap-1.5">
                              <Edit3 className="w-4 h-4" />
                              Edit Flyer: {item.title}
                            </span>
                            <button
                              onClick={() => setEditingFlyerId(null)}
                              className="text-slate-400 hover:text-white p-1 cursor-pointer"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <label className="text-[11px] font-bold text-slate-300 block">Flyer Image</label>
                              <div
                                onDragOver={(e) => { e.preventDefault(); setIsEditImageDragging(true); }}
                                onDragLeave={() => setIsEditImageDragging(false)}
                                onDrop={(e) => {
                                  e.preventDefault();
                                  setIsEditImageDragging(false);
                                  const file = e.dataTransfer.files?.[0];
                                  if (file) handleEditImageFileUpload(file);
                                }}
                                className={`relative border-2 border-dashed rounded-xl p-3 text-center transition-colors cursor-pointer ${
                                  isEditImageDragging ? 'border-[#d4f15d] bg-[#d4f15d]/10' : 'border-slate-800 bg-slate-900 hover:border-slate-700'
                                }`}
                              >
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleEditImageFileUpload(file);
                                  }}
                                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                />
                                {editFormImageUrl ? (
                                  <div className="flex flex-col items-center gap-1.5">
                                    <img
                                      src={editFormImageUrl}
                                      alt="Preview"
                                      loading="lazy"
                                      decoding="async"
                                      referrerPolicy="no-referrer"
                                      className="w-20 h-28 object-cover rounded-lg border border-[#d4f15d]/50"
                                    />
                                    <span className="text-[10px] text-[#bef264] font-bold">Click to Replace Pic</span>
                                  </div>
                                ) : (
                                  <div className="py-4 space-y-1">
                                    <Upload className="w-5 h-5 text-[#bef264] mx-auto" />
                                    <span className="text-[11px] text-slate-300 font-bold block">Upload New Pic</span>
                                  </div>
                                )}
                              </div>

                              <input
                                type="text"
                                value={editFormImageUrl}
                                onChange={(e) => setEditFormImageUrl(e.target.value)}
                                placeholder="Paste Image URL"
                                className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-[11px] text-white focus:outline-none focus:border-[#d4f15d]"
                              />
                            </div>

                            <div className="md:col-span-2 space-y-3">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                  <label className="text-[11px] font-bold text-slate-400 block mb-1">Flyer Title</label>
                                  <input
                                    type="text"
                                    value={editFormTitle}
                                    onChange={(e) => setEditFormTitle(e.target.value)}
                                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-[#d4f15d]"
                                  />
                                </div>

                                <div>
                                  <label className="text-[11px] font-bold text-slate-400 block mb-1">Price ($ USD)</label>
                                  <input
                                    type="number"
                                    min={1}
                                    value={editFormPrice}
                                    onChange={(e) => setEditFormPrice(Number(e.target.value))}
                                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white font-bold focus:outline-none focus:border-[#d4f15d]"
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="text-[11px] font-bold text-slate-400 block mb-1">Description</label>
                                <textarea
                                  rows={2}
                                  value={editFormDescription}
                                  onChange={(e) => setEditFormDescription(e.target.value)}
                                  className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-[#d4f15d]"
                                />
                              </div>

                              <div className="flex items-center justify-end gap-2 pt-1">
                                <button
                                  type="button"
                                  onClick={() => setEditingFlyerId(null)}
                                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white text-xs font-bold cursor-pointer"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleSaveFlyerDetails(item)}
                                  className="px-4 py-1.5 rounded-lg bg-[#d4f15d] hover:bg-[#bef264] text-slate-950 font-black text-xs shadow flex items-center gap-1.5 cursor-pointer"
                                >
                                  <Save className="w-3.5 h-3.5" />
                                  <span>Save Changes</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={item.id}
                        className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex gap-3 items-center"
                      >
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          loading="lazy"
                          decoding="async"
                          referrerPolicy="no-referrer"
                          className="w-16 h-20 object-cover rounded-lg border border-slate-800 shrink-0"
                        />

                        <div className="flex-1 min-w-0 space-y-1">
                          <span className="text-[10px] font-bold text-[#bef264] uppercase tracking-wider block">
                            {item.categoryLabel}
                          </span>
                          <h4 className="text-xs font-bold text-white truncate">{item.title}</h4>
                          
                          <div className="flex items-center gap-2 pt-1">
                            <span className="text-[11px] text-slate-400 font-bold">$</span>
                            <input
                              type="number"
                              value={editingFlyerPrices[item.id] ?? item.price}
                              onChange={(e) => {
                                setEditingFlyerPrices({
                                  ...editingFlyerPrices,
                                  [item.id]: Number(e.target.value)
                                });
                              }}
                              className="w-14 px-1.5 py-0.5 bg-slate-900 border border-slate-700 rounded text-xs font-bold text-white focus:outline-none focus:border-[#d4f15d]"
                            />
                            <button
                              onClick={() => handleSaveFlyerPrice(item)}
                              title="Quick Save Price"
                              className="px-2 py-0.5 rounded bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold transition-colors cursor-pointer"
                            >
                              Save $
                            </button>

                            <button
                              onClick={() => startEditingFlyer(item)}
                              title="Edit Picture & Details"
                              className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold border border-slate-700 transition-colors cursor-pointer flex items-center gap-1"
                            >
                              <Edit3 className="w-3 h-3 text-[#bef264]" />
                              <span>Edit Pic</span>
                            </button>
                          </div>
                        </div>

                        {onDeletePortfolioItem && (
                          <button
                            onClick={() => {
                              if (confirm(`Remove "${item.title}" from website?`)) {
                                onDeletePortfolioItem(item.id);
                                showNotification(`Deleted "${item.title}"`);
                              }
                            }}
                            className="p-2 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-900 transition-colors cursor-pointer"
                            title="Delete Flyer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* TAB 4: UPLOAD & MANAGE VIDEOS */}
          {activeTab === 'upload_video' && (
            <div className="space-y-8">
              
              {/* Motion Graphic Specs & Video Concepts */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-blue-500/40 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-blue-400" />
                    <div>
                      <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                        <span>Motion Graphics Studio & Video Advertising Formats</span>
                        <span className="text-[10px] font-mono font-bold bg-blue-600 text-white px-2 py-0.5 rounded-full">
                          60FPS Ready
                        </span>
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        Upload completed motion flyers, speed art recordings, and studio commercials directly to your client feed.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-300 block">
                    Supported Motion Graphic Concepts & Specifications:
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    {[
                      {
                        title: "3D Gold Church Mega Summit Motion Ad",
                        prompt: "3D metallic gold extruded typography 'HOLY GHOST SUMMIT 2026', glowing volumetric godrays, crystal floating crosses, speaker portrait zoom with anamorphic lens flares, high-impact church advertising flyer, 4k 60fps"
                      },
                      {
                        title: "Neon Afrobeats & DJ Concert Motion Poster",
                        prompt: "High-energy neon club flyer motion ad, kinetic 3D typography 'ALL-NIGHT AFROBEATS FESTIVAL', chromatic laser sweeps, audio equalizer bass vibration waves, smoke haze and spark bursts, 4k"
                      },
                      {
                        title: "Corporate Brand Summit & Masterclass Commercial",
                        prompt: "Ultra-sleek corporate advertising video, navy blue and gold 3D geometry, minimalist Apple-style typography 'GLOBAL LEADERSHIP MASTERCLASS', vector logo reveal, smooth cinematic orbit camera, 60fps"
                      },
                      {
                        title: "Photoshop Speed Art & Retouching Spot",
                        prompt: "Graphic designer workstation speed art time-lapse, pen tool bezier masking on speaker portrait, frequency separation skin retouching, split-screen before and after transformation ad spot"
                      }
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-blue-500/40 transition-colors space-y-1.5"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-slate-200">{item.title}</span>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(item.prompt);
                              setCopiedAiPrompt(item.title);
                              setTimeout(() => setCopiedAiPrompt(null), 2500);
                              showNotification(`Copied concept: "${item.title}"`);
                            }}
                            className="px-2 py-1 rounded bg-[#d4f15d] hover:bg-[#bef264] text-slate-950 font-black text-[10px] transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <Copy className="w-3 h-3" />
                            <span>{copiedAiPrompt === item.title ? 'Copied' : 'Copy Concept'}</span>
                          </button>
                        </div>
                        <p className="text-[10px] text-slate-400 font-mono line-clamp-2 leading-relaxed bg-slate-950 p-1.5 rounded border border-slate-800">
                          {item.prompt}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Upload Video Box */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                  <Film className="w-4 h-4 text-blue-400" />
                  <h3 className="text-sm font-extrabold text-white">
                    Upload Studio Video / Motion Graphic Reel
                  </h3>
                </div>

                <form onSubmit={handleAddVideoSubmit} className="space-y-4">
                  
                  {/* File Drag & Drop Box */}
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      Upload Video File (MP4, WebM, MOV, MKV of any size)
                    </label>
                    <div
                      onDragOver={(e) => { e.preventDefault(); setIsVideoDragging(true); }}
                      onDragLeave={() => setIsVideoDragging(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsVideoDragging(false);
                        const file = e.dataTransfer.files?.[0];
                        if (file) handleVideoFileUpload(file);
                      }}
                      className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer ${
                        isVideoDragging ? 'border-blue-400 bg-blue-500/10' : 'border-slate-800 bg-slate-900 hover:border-slate-700'
                      }`}
                    >
                      <input
                        ref={videoFileInputRef}
                        type="file"
                        accept="video/*,.mp4,.webm,.mov,.mkv,.avi,.m4v,.ts,video/mp4,video/webm,video/quicktime"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleVideoFileUpload(file);
                        }}
                        className="hidden"
                      />

                      {isVideoLoading ? (
                        <div className="py-6 space-y-2 text-center">
                          <RefreshCw className="w-8 h-8 text-blue-400 mx-auto animate-spin" />
                          <p className="text-xs font-bold text-blue-300">Processing Video File...</p>
                          <p className="text-[10px] text-slate-400">Storing in local video vault for high-speed streaming without caps</p>
                        </div>
                      ) : videoUrl ? (
                        <div className="flex flex-col items-center gap-2">
                          {getYouTubeEmbedUrl(videoUrl) ? (
                            <iframe
                              src={getYouTubeEmbedUrl(videoUrl)!}
                              className="w-56 aspect-video rounded-lg border border-blue-500/50 shadow"
                              allow="autoplay; encrypted-media"
                              allowFullScreen
                            />
                          ) : (
                            <video
                              key={videoUrl}
                              controls
                              playsInline
                              preload="auto"
                              className="w-56 aspect-video rounded-lg border border-blue-500/50 shadow object-contain bg-black"
                            >
                              <source src={videoUrl} type={videoUrl.startsWith('data:video/webm') ? 'video/webm' : 'video/mp4'} />
                              <source src={videoUrl} />
                            </video>
                          )}
                          <span className="text-[11px] text-white font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                            <span>
                              Video Ready {uploadedVideoInfo ? `(${uploadedVideoInfo.fileName} • ${uploadedVideoInfo.sizeMb} MB)` : ''}
                            </span>
                          </span>
                          <button
                            type="button"
                            onClick={() => videoFileInputRef.current?.click()}
                            className="text-[10px] text-blue-400 font-bold hover:underline cursor-pointer"
                          >
                            Click to Browse & Replace Video
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Video className="w-8 h-8 text-blue-400 mx-auto" />
                          <p className="text-xs font-bold text-white">
                            Click to Browse Video File or Drag Motion Video Here
                          </p>
                          <p className="text-[10px] text-slate-400">
                            Supports HD MP4, WebM, MOV, or Video Direct Links
                          </p>
                          <button
                            type="button"
                            onClick={() => videoFileInputRef.current?.click()}
                            className="px-4 py-1.5 rounded-lg bg-[#d4f15d] hover:bg-[#bef264] text-slate-950 font-black text-xs transition-colors cursor-pointer"
                          >
                            Browse Video File
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Video URL Input */}
                  <div>
                    <label className="text-xs font-bold text-slate-400 block mb-1">
                      OR Paste Video Stream / YouTube / Google Drive Link:
                    </label>
                    <input
                      type="text"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      placeholder="e.g. https://www.youtube.com/watch?v=... or Google Drive link or direct .mp4"
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">Video Title *</label>
                      <input
                        type="text"
                        required
                        value={videoTitle}
                        onChange={(e) => setVideoTitle(e.target.value)}
                        placeholder="e.g. 3D Gold Church Flyer Motion Ad"
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">Video Type / Category</label>
                      <select
                        value={videoType}
                        onChange={(e) => setVideoType(e.target.value as any)}
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                      >
                        <option value="motion_flyer">Animated Graphic Design Motion Flyer</option>
                        <option value="workstation">Photoshop Workstation Speed Art</option>
                        <option value="speaking">Graphic Design Studio Promo Reel</option>
                        <option value="tutorial">Graphic Design Masterclass Tutorial</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Description</label>
                    <input
                      type="text"
                      value={videoDesc}
                      onChange={(e) => setVideoDesc(e.target.value)}
                      placeholder="e.g. 15-second high impact graphic design advertising motion flyer for church summit..."
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 px-4 rounded-xl bg-[#d4f15d] hover:bg-[#bef264] text-slate-950 font-black text-xs transition-colors cursor-pointer flex items-center justify-center gap-2 shadow"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Publish Graphic Design Video To Showcase</span>
                  </button>

                </form>
              </div>

              {/* Videos Inventory List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                    <span>Graphic Design Video Collection ({showcaseVideos.length})</span>
                  </h3>
                  {showcaseVideos.length > 0 && (
                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete ALL ${showcaseVideos.length} showcase videos?`)) {
                          showcaseVideos.forEach(v => onDeleteVideo(v.id));
                          showNotification('Cleared all studio showcase videos!');
                        }
                      }}
                      className="text-xs font-bold text-rose-400 hover:text-rose-300 px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500/20 transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete All</span>
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  {showcaseVideos.length === 0 ? (
                    <div className="p-8 text-center rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                      <Film className="w-8 h-8 text-slate-600 mx-auto" />
                      <p className="text-xs font-bold text-slate-400">No Custom Videos Uploaded Yet</p>
                      <p className="text-[11px] text-slate-500">Upload Gemini video files (.mp4) or video links using the form above.</p>
                    </div>
                  ) : (
                    showcaseVideos.map((vid) => {
                      const adminResolvedUrl = resolveWorkingVideoUrl(vid.videoUrl);
                      const ytEmbed = getYouTubeEmbedUrl(adminResolvedUrl);
                      return (
                        <div
                          key={vid.id}
                          className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4"
                        >
                          <div className="flex items-center gap-3 w-full sm:w-auto">
                            {ytEmbed ? (
                              <iframe
                                src={ytEmbed}
                                className="w-24 aspect-video rounded-lg bg-black border border-slate-800"
                              />
                            ) : (
                              <video
                                key={adminResolvedUrl}
                                controls
                                muted
                                playsInline
                                preload="metadata"
                                className="w-24 aspect-video rounded-lg object-contain bg-black border border-slate-800"
                              >
                                <source src={adminResolvedUrl} type={adminResolvedUrl.startsWith('data:video/webm') ? 'video/webm' : 'video/mp4'} />
                                <source src={adminResolvedUrl} />
                              </video>
                            )}
                            <div>
                              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block">
                                {vid.type.replace('_', ' ')}
                              </span>
                              <h4 className="text-xs font-bold text-white">{vid.title}</h4>
                              <p className="text-[10px] text-slate-400">{vid.description}</p>
                            </div>
                          </div>

                          <button
                            onClick={() => {
                              if (confirm(`Delete video "${vid.title}"?`)) {
                                onDeleteVideo(vid.id);
                                showNotification(`Deleted video "${vid.title}"`);
                              }
                            }}
                            className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer"
                            title="Delete Video"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

            </div>
          )}

          {/* TAB 5: CHANGE PRICES */}
          {activeTab === 'change_prices' && (
            <div className="space-y-8">
              
              <div className="p-4 rounded-xl bg-slate-950 border border-[#d4f15d]/40 text-slate-200 text-xs space-y-1">
                <p className="font-bold flex items-center gap-2 text-[#bef264]">
                  <DollarSign className="w-4 h-4" />
                  <span>Live Price List Editor</span>
                </p>
                <p className="text-[11px] text-slate-400">
                  Changing package or add-on prices here instantly updates the Pricing Calculator, Package Comparison Table, and Order Modals across the entire application.
                </p>
              </div>

              {/* Package Base Prices Grid */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h3 className="text-sm font-extrabold text-white">Package Tier Base Prices</h3>
                  <span className="text-[11px] text-slate-400">USD Standard Rates</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {pricingPackages.map((pkg) => (
                    <div
                      key={pkg.id}
                      className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-white">{pkg.name}</h4>
                        <span className="text-[10px] text-[#bef264] font-mono font-bold uppercase">{pkg.category}</span>
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <label className="text-xs text-slate-400 font-bold">Price ($ USD):</label>
                        <input
                          type="number"
                          min={1}
                          value={pkgPrices[pkg.id] ?? pkg.basePrice}
                          onChange={(e) => {
                            setPkgPrices({
                              ...pkgPrices,
                              [pkg.id]: Number(e.target.value)
                            });
                          }}
                          className="w-24 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs font-bold text-white focus:outline-none focus:border-[#d4f15d] font-mono"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add-On Service Prices Grid */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h3 className="text-sm font-extrabold text-white">Add-On Service Option Rates</h3>
                  <span className="text-[11px] text-slate-400">USD Extra Charges</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {addOnOptions.map((addon) => (
                    <div
                      key={addon.id}
                      className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2"
                    >
                      <h4 className="text-xs font-bold text-slate-200">{addon.label}</h4>
                      
                      <div className="flex items-center gap-2 pt-1">
                        <label className="text-xs text-slate-400 font-bold">Rate ($ USD):</label>
                        <input
                          type="number"
                          min={0}
                          value={addOnPricesState[addon.id] ?? addon.price}
                          onChange={(e) => {
                            setAddOnPricesState({
                              ...addOnPricesState,
                              [addon.id]: Number(e.target.value)
                            });
                          }}
                          className="w-24 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs font-bold text-white focus:outline-none focus:border-[#d4f15d] font-mono"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Save Prices Button */}
              <button
                onClick={handleSaveAllPackagePrices}
                className="w-full py-3.5 px-6 rounded-xl bg-[#d4f15d] hover:bg-[#bef264] text-slate-950 font-black text-xs transition-colors cursor-pointer flex items-center justify-center gap-2 shadow"
              >
                <Save className="w-4 h-4" />
                <span>Save All Live Price Changes</span>
              </button>

            </div>
          )}

          {/* TAB 6: HOME PAGE BACKGROUNDS & ADMIN SECURITY */}
          {activeTab === 'cms_assets' && (
            <div className="space-y-6">
              
              {/* Header Banner */}
              <div className="p-4 rounded-xl bg-slate-950 border border-[#d4f15d]/40 space-y-2">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-[#d4f15d]" />
                  <h3 className="text-sm font-extrabold text-white">Home Page Featured Photo &amp; Image Editor</h3>
                </div>
                <p className="text-xs text-slate-400">
                  Manage the image displayed directly on the Home Page hero section without artificial frames or borders, fitting cleanly into the website layout.
                </p>
              </div>

              {/* 1. HERO FEATURED IMAGE SECTION */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-[#d4f15d]" />
                    <span>Home Page Featured Hero Photo (Studio Portfolio)</span>
                  </h4>
                  {heroImageInput ? (
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">● Active Custom Image</span>
                  ) : (
                    <span className="text-[10px] font-mono text-[#d4f15d] font-bold">● Default Uploaded Photo (Studio Portfolio)</span>
                  )}
                </div>

                {/* Upload or Enter URL */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  <div className="md:col-span-8 space-y-2">
                    <label className="text-xs font-bold text-slate-300 block">Image URL or Uploaded Data</label>
                    <input
                      type="text"
                      value={heroImageInput}
                      onChange={(e) => setHeroImageInput(e.target.value)}
                      placeholder="Paste image URL (https://...) or choose file below"
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#d4f15d] font-mono"
                    />

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => heroFileInputRef.current?.click()}
                        className="px-3.5 py-1.5 rounded-lg bg-[#d4f15d]/15 hover:bg-[#d4f15d]/25 border border-[#d4f15d]/40 text-[#d4f15d] text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <Upload className="w-3.5 h-3.5 text-[#d4f15d]" />
                        <span>Upload from Computer / Device</span>
                      </button>
                      <input
                        ref={heroFileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const reader = new FileReader();
                          reader.onload = () => {
                            if (typeof reader.result === 'string') {
                              setHeroImageInput(reader.result);
                              showNotification('Image loaded into preview. Click "Save Home Page Photo" below.');
                            }
                          };
                          reader.readAsDataURL(file);
                        }}
                      />
                    </div>
                  </div>

                  {/* Thumbnail Preview */}
                  <div className="md:col-span-4 flex flex-col items-center justify-center p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 font-bold mb-1.5">Live Preview</span>
                    <img 
                      src={heroImageInput || studioCreativeDeskImg} 
                      alt="Hero preview" 
                      className="w-full h-28 object-contain rounded-lg border border-slate-700 bg-black/40"
                    />
                  </div>
                </div>

                {/* Quick Studio Presets */}
                <div className="space-y-1.5 pt-2 border-t border-slate-800">
                  <span className="text-[11px] font-bold text-slate-400">Authentic Studio Photo Presets:</span>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { label: 'Studio Creative Desk', url: studioCreativeDeskImg },
                      { label: '3D Church Poster Artwork', url: realChurchFlyerImg },
                      { label: 'Event Master Flyer', url: realEventFlyerImg },
                      { label: 'SDA Camp Meeting Poster', url: sdaCampMeetingImg },
                      { label: 'Business Brand Flyer', url: realBusinessFlyerImg }
                    ].map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setHeroImageInput(preset.url);
                          sound.playClick();
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium border cursor-pointer transition-all ${
                          (heroImageInput === preset.url || (!heroImageInput && preset.url === studioCreativeDeskImg))
                            ? 'bg-[#d4f15d]/20 text-[#d4f15d] border-[#d4f15d] font-bold'
                            : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-600'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Save & Reset Actions */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={async () => {
                      if (!onSaveHeroImage) return;
                      setIsSavingHero(true);
                      try {
                        await onSaveHeroImage(heroImageInput || studioCreativeDeskImg);
                        showNotification('Saved Home Page Hero Image successfully!');
                      } catch (e) {
                        alert('Failed to save Home Page image.');
                      } finally {
                        setIsSavingHero(false);
                      }
                    }}
                    disabled={isSavingHero}
                    className="px-4 py-2 rounded-xl bg-[#d4f15d] hover:bg-[#bef264] text-slate-950 font-black text-xs transition-colors cursor-pointer shadow-md flex items-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{isSavingHero ? 'Saving Image...' : 'Save Home Page Photo'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={async () => {
                      if (!onResetHeroImage) return;
                      await onResetHeroImage();
                      setHeroImageInput('');
                      showNotification('Reset to default Studio Desk photo.');
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors cursor-pointer border border-slate-700"
                  >
                    Reset to Default Studio Photo
                  </button>
                </div>
              </div>

              {/* 2. DESIGNER CUTOUT PORTRAIT SECTION */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-[#d4f15d]" />
                    <span>Designer Cutout Portrait (Centered Over Giant Headline)</span>
                  </h4>
                  {cutoutImageInput && (
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">● Custom Cutout</span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  <div className="md:col-span-8 space-y-2">
                    <label className="text-xs font-bold text-slate-300 block">Cutout Image URL or PNG File</label>
                    <input
                      type="text"
                      value={cutoutImageInput}
                      onChange={(e) => setCutoutImageInput(e.target.value)}
                      placeholder="Paste transparent PNG cutout URL or choose file below"
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#d4f15d] font-mono"
                    />

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => cutoutFileInputRef.current?.click()}
                        className="px-3.5 py-1.5 rounded-lg bg-[#d4f15d]/15 hover:bg-[#d4f15d]/25 border border-[#d4f15d]/40 text-[#d4f15d] text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <Upload className="w-3.5 h-3.5 text-[#d4f15d]" />
                        <span>Upload Custom Cutout (PNG with transparent background)</span>
                      </button>
                      <input
                        ref={cutoutFileInputRef}
                        type="file"
                        accept="image/png,image/webp,image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const reader = new FileReader();
                          reader.onload = () => {
                            if (typeof reader.result === 'string') {
                              setCutoutImageInput(reader.result);
                              showNotification('Cutout loaded into preview. Click "Save Cutout Portrait".');
                            }
                          };
                          reader.readAsDataURL(file);
                        }}
                      />
                    </div>
                  </div>

                  {/* Thumbnail Preview */}
                  <div className="md:col-span-4 flex flex-col items-center justify-center p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 font-bold mb-1.5">Cutout Preview</span>
                    <img 
                      src={cutoutImageInput || studioCreativeDeskImg} 
                      alt="Cutout portrait preview" 
                      className="w-full h-24 object-contain rounded-lg border border-slate-700 bg-black/40 shadow-md"
                    />
                  </div>
                </div>

                {/* Quick Presets for Portrait / Cutout */}
                <div className="space-y-1.5 pt-2 border-t border-slate-800">
                  <span className="text-[11px] font-bold text-slate-400">Hero Image / Artwork Presets:</span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setCutoutImageInput(studioCreativeDeskImg);
                        sound.playClick();
                      }}
                      className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#d4f15d]/15 text-[#d4f15d] border border-[#d4f15d] hover:bg-[#d4f15d]/25 cursor-pointer"
                    >
                      Studio Creative Desk (Workstation)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setCutoutImageInput(realChurchFlyerImg);
                        sound.playClick();
                      }}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-600 cursor-pointer"
                    >
                      3D Church Artwork
                    </button>
                  </div>
                </div>

                {/* Save Cutout */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={async () => {
                      if (!onSaveCutoutImage) return;
                      setIsSavingCutout(true);
                      try {
                        await onSaveCutoutImage(cutoutImageInput);
                        showNotification('Saved live Designer Cutout Portrait!');
                      } catch (e) {
                        alert('Failed to save cutout portrait.');
                      } finally {
                        setIsSavingCutout(false);
                      }
                    }}
                    disabled={isSavingCutout}
                    className="px-4 py-2 rounded-xl bg-[#d4f15d] hover:bg-[#bef264] text-slate-950 font-black text-xs transition-colors cursor-pointer shadow-md flex items-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{isSavingCutout ? 'Saving Cutout...' : 'Save Cutout Portrait'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={async () => {
                      if (!onResetCutoutImage) return;
                      await onResetCutoutImage();
                      setCutoutImageInput('');
                      showNotification('Reset Cutout to default artist portrait.');
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors cursor-pointer border border-slate-700"
                  >
                    Reset Cutout
                  </button>
                </div>
              </div>

              {/* 3. ADMIN BUTTON VISIBILITY CONTROLS (ONLY VISIBLE TO OWNER) */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-[#d4f15d]" />
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                      Admin Option Visibility (Privacy Protection)
                    </h4>
                  </div>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                    isAdminVisibleSetting ? 'bg-[#d4f15d]/20 text-[#d4f15d] border border-[#d4f15d]/40' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {isAdminVisibleSetting ? '● Visible Only to You' : '○ Hidden from Everyone'}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  As requested, the <strong>"Admin"</strong> button is hidden from clients and casual visitors. It is displayed <strong>only to you</strong> when your browser is authenticated or unlocked.
                </p>

                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                  <div>
                    <div className="text-xs font-bold text-white">Show Admin Button in Navbar &amp; Footer</div>
                    <div className="text-[11px] text-slate-400">Controls whether the Admin button appears on your browser.</div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      const next = !isAdminVisibleSetting;
                      setIsAdminVisibleSetting(next);
                      if (next) {
                        localStorage.setItem('rtson_admin_visible', 'true');
                        showNotification('Admin button set to Visible on your browser.');
                      } else {
                        localStorage.removeItem('rtson_admin_visible');
                        showNotification('Admin button hidden.');
                      }
                      window.dispatchEvent(new Event('storage'));
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                      isAdminVisibleSetting
                        ? 'bg-[#d4f15d] text-slate-950 font-black shadow-md'
                        : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
                    }`}
                  >
                    {isAdminVisibleSetting ? '✓ Visible to Me' : 'Hidden'}
                  </button>
                </div>

                {/* Secret Owner Access Instructions Box */}
                <div className="p-3.5 rounded-xl bg-[#d4f15d]/5 border border-[#d4f15d]/30 space-y-1.5 text-xs text-slate-300">
                  <div className="font-bold flex items-center gap-1.5 text-[#d4f15d]">
                    <Key className="w-3.5 h-3.5" />
                    <span>How you can always open this Admin Terminal anytime:</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-300">
                    <li><strong>Keyboard Shortcut:</strong> Press <kbd className="px-1.5 py-0.5 rounded bg-black border border-slate-700 text-white font-mono">Ctrl + Shift + A</kbd> (or <kbd className="px-1.5 py-0.5 rounded bg-black border border-slate-700 text-white font-mono">Cmd + Shift + A</kbd>) anywhere on the site.</li>
                    <li><strong>Triple-Click:</strong> Triple-click the <strong>R'tson Studio Logo</strong> on the top navigation bar.</li>
                    <li><strong>URL Shortcut:</strong> Add <code className="text-[#d4f15d] font-mono">?admin=true</code> to the website address in your browser.</li>
                    <li><strong>Google Login:</strong> Sign in with <code className="text-[#ff6b00] font-mono">info@rtsoncreations.co.zw</code> or your authorized administrator account.</li>
                  </ul>
                </div>
              </div>

            </div>
          )}

          {/* TAB 7: AUTO-SYNC INTEGRATIONS (Picsart, Gemini, GitHub) */}
          {activeTab === 'integrations' && (
            <div className="space-y-6">
              
              {/* Universal Webhook Banner */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-blue-500/40 text-blue-400">
                      <Zap className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                        Live Website Auto-Upload & Integration Hub
                        <span className="px-2 py-0.5 rounded-full bg-[#d4f15d] text-slate-950 text-[10px] font-mono font-black">
                          API ACTIVE
                        </span>
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Link Picsart, Adobe Lightroom, and design toolchains so completed artwork uploads directly to your website portfolio automatically.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      const webhookUrl = `${window.location.origin}/api/integrations/webhook`;
                      navigator.clipboard.writeText(webhookUrl);
                      setCopiedWebhook(true);
                      setTimeout(() => setCopiedWebhook(false), 3000);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#d4f15d] hover:bg-[#bef264] text-slate-950 font-black text-xs transition-colors cursor-pointer shadow shrink-0"
                  >
                    {copiedWebhook ? <FileCheck className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedWebhook ? 'Copied' : 'Copy Webhook'}</span>
                  </button>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 font-mono text-[11px] text-slate-300 flex items-center justify-between overflow-x-auto">
                  <span className="text-blue-400 truncate mr-2">
                    POST {window.location.origin}/api/integrations/webhook
                  </span>
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest shrink-0">
                    Format: JSON {"{ source, title, imageUrl, price }"}
                  </span>
                </div>
              </div>

              {/* Grid of Connected Platforms */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* 1. Picsart Creator Profile Link Card */}
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-white font-black text-xs font-mono">
                        Pa
                      </div>
                      <div>
                        <h4 className="text-xs font-extrabold text-white">Picsart Creator Profile Link</h4>
                        <span className="text-[10px] text-blue-400 font-mono font-bold">● Active on Website</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400">
                    Link your official PicsArt profile (@rtsoncreations) directly to your website header and footer.
                  </p>

                  <div className="space-y-2.5">
                    <div>
                      <label className="text-[11px] font-bold text-slate-300 block mb-1">Picsart Profile URL</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={picsartProfileUrl}
                          onChange={(e) => {
                            setPicsartProfileUrl(e.target.value);
                            localStorage.setItem('rtson_picsart_url', e.target.value);
                          }}
                          placeholder="https://picsart.com/u/rtsoncreations"
                          className="flex-1 px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white font-mono focus:outline-none focus:border-[#d4f15d]"
                        />
                        <a
                          href={picsartProfileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3.5 py-2 rounded-lg bg-[#d4f15d] hover:bg-[#bef264] text-slate-950 font-black text-xs transition-colors cursor-pointer shrink-0 flex items-center gap-1"
                        >
                          <span>Open</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Pinterest Profile Link Card */}
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-white font-black text-xs font-mono">
                        P
                      </div>
                      <div>
                        <h4 className="text-xs font-extrabold text-white">Pinterest Portfolio Link</h4>
                        <span className="text-[10px] text-blue-400 font-mono font-bold">● Active on Website</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400">
                    Link your official Pinterest board gallery (@rtsoncreations / R'tson) across your website footer and contact drawers.
                  </p>

                  <div className="space-y-2.5">
                    <div>
                      <label className="text-[11px] font-bold text-slate-300 block mb-1">Pinterest Profile URL</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={pinterestProfileUrl}
                          onChange={(e) => {
                            setPinterestProfileUrl(e.target.value);
                            localStorage.setItem('rtson_pinterest_url', e.target.value);
                          }}
                          placeholder="https://pinterest.com/rtsoncreations"
                          className="flex-1 px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white font-mono focus:outline-none focus:border-[#d4f15d]"
                        />
                        <a
                          href={pinterestProfileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3.5 py-2 rounded-lg bg-[#d4f15d] hover:bg-[#bef264] text-slate-950 font-black text-xs transition-colors cursor-pointer shrink-0 flex items-center gap-1"
                        >
                          <span>Open</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. GitHub Repository Card */}
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-white font-black text-xs">
                        <Globe className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-extrabold text-white">GitHub Repository Sync</h4>
                        <span className={`text-[10px] font-mono font-bold ${isGithubConnected ? 'text-blue-400' : 'text-[#d4f15d]'}`}>
                          {isGithubConnected ? '● Connected' : '○ Not Linked'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <div>
                      <label className="text-[11px] font-bold text-slate-300 block mb-1">GitHub Repo URL</label>
                      <input
                        type="text"
                        value={githubRepoUrl}
                        onChange={(e) => setGithubRepoUrl(e.target.value)}
                        placeholder="https://github.com/username/repository"
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white font-mono focus:outline-none focus:border-[#d4f15d]"
                      />
                    </div>

                    <button
                      onClick={() => {
                        localStorage.setItem('rtson_github_repo', githubRepoUrl);
                        localStorage.setItem('rtson_github_connected', 'true');
                        setIsGithubConnected(true);
                        setSuccessMsg('GitHub Repository linked successfully!');
                        setTimeout(() => setSuccessMsg(null), 4000);
                      }}
                      className="w-full py-2 px-3 rounded-lg bg-[#d4f15d] hover:bg-[#bef264] text-slate-950 font-black text-xs transition-colors cursor-pointer"
                    >
                      {isGithubConnected ? 'Update Link' : 'Connect Repo'}
                    </button>
                  </div>
                </div>

              </div>

              {/* Live Synced History */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h3 className="text-xs font-extrabold text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#d4f15d]" />
                    Live Auto-Synced Upload History ({syncedFeed.length})
                  </h3>
                  <button
                    onClick={fetchSyncedFeed}
                    className="text-[11px] text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" /> Refresh Feed
                  </button>
                </div>

                {syncedFeed.length === 0 ? (
                  <div className="py-6 text-center text-xs text-slate-500">
                    No auto-synced items yet. Click any test button above or post to the Webhook URL.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {syncedFeed.map((item, idx) => (
                      <div
                        key={item.id || idx}
                        className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex gap-3 items-center"
                      >
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          loading="lazy"
                          decoding="async"
                          referrerPolicy="no-referrer"
                          className="w-14 h-18 object-cover rounded-lg border border-slate-700 shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#d4f15d]/15 text-[#d4f15d] border border-[#d4f15d]/30 font-bold">
                            {item.source || 'EXTERNAL'}
                          </span>
                          <h5 className="text-xs font-bold text-white truncate mt-1">{item.title}</h5>
                          <span className="text-[10px] text-white font-mono font-bold">${item.price} USD</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
