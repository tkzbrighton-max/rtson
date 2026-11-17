import { 
  doc, 
  setDoc, 
  getDoc, 
  onSnapshot, 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { PortfolioItem, ShowcaseVideo } from '../types';
import { storeLocalVideoBlob, getLocalVideoBlobUrl, deleteLocalVideoBlob } from './videoStorage';


export interface SiteConfigData {
  heroImageUrl?: string;
  designerCutoutUrl?: string;
  homeBgMode?: 'light_cream' | 'dark_obsidian' | 'custom_image';
  heroHeadline?: string;
  heroSubheadline?: string;
  picsartUrl?: string;
  githubRepoUrl?: string;
  updatedAt?: string;
}

const SITE_CONFIG_PATH = 'site_config';
const MAIN_CONFIG_DOC = 'main';

// --- Site Config (Hero Image & Assets) ---

export function subscribeToSiteConfig(onData: (data: SiteConfigData | null) => void) {
  const docRef = doc(db, SITE_CONFIG_PATH, MAIN_CONFIG_DOC);
  return onSnapshot(
    docRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data() as SiteConfigData;
        if (data.heroImageUrl) {
          localStorage.setItem('rtson_hero_bg_image', data.heroImageUrl);
        }
        if (data.designerCutoutUrl) {
          localStorage.setItem('rtson_designer_cutout', data.designerCutoutUrl);
        }
        onData(data);
      } else {
        onData(null);
      }
    },
    (error) => {
      console.warn('Site config snapshot warning:', error);
      // Fallback to local storage if firestore read fails
      const localHero = localStorage.getItem('rtson_hero_bg_image');
      const localCutout = localStorage.getItem('rtson_designer_cutout');
      if (localHero || localCutout) {
        onData({
          heroImageUrl: localHero || undefined,
          designerCutoutUrl: localCutout || undefined
        });
      } else {
        onData(null);
      }
    }
  );
}

export async function saveSiteHeroImage(imageUrl: string): Promise<void> {
  localStorage.setItem('rtson_hero_bg_image', imageUrl);
  const docRef = doc(db, SITE_CONFIG_PATH, MAIN_CONFIG_DOC);
  try {
    await setDoc(docRef, {
      heroImageUrl: imageUrl,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `${SITE_CONFIG_PATH}/${MAIN_CONFIG_DOC}`);
  }
}

export async function resetSiteHeroImage(): Promise<void> {
  localStorage.removeItem('rtson_hero_bg_image');
  const docRef = doc(db, SITE_CONFIG_PATH, MAIN_CONFIG_DOC);
  try {
    await setDoc(docRef, {
      heroImageUrl: '',
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `${SITE_CONFIG_PATH}/${MAIN_CONFIG_DOC}`);
  }
}

export async function saveDesignerCutout(cutoutUrl: string): Promise<void> {
  localStorage.setItem('rtson_designer_cutout', cutoutUrl);
  const docRef = doc(db, SITE_CONFIG_PATH, MAIN_CONFIG_DOC);
  try {
    await setDoc(docRef, {
      designerCutoutUrl: cutoutUrl,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `${SITE_CONFIG_PATH}/${MAIN_CONFIG_DOC}`);
  }
}

export async function resetDesignerCutout(): Promise<void> {
  localStorage.removeItem('rtson_designer_cutout');
  const docRef = doc(db, SITE_CONFIG_PATH, MAIN_CONFIG_DOC);
  try {
    await setDoc(docRef, {
      designerCutoutUrl: '',
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `${SITE_CONFIG_PATH}/${MAIN_CONFIG_DOC}`);
  }
}

// --- Dynamic Portfolio Items ---

export function subscribeToPortfolioItems(onData: (items: PortfolioItem[]) => void) {
  const colRef = collection(db, 'portfolio_items');
  return onSnapshot(
    colRef,
    (snapshot) => {
      if (!snapshot.empty) {
        const items: PortfolioItem[] = [];
        snapshot.forEach((docSnap) => {
          items.push({ id: docSnap.id, ...docSnap.data() } as PortfolioItem);
        });
        onData(items);
      } else {
        onData([]);
      }
    },
    (error) => {
      console.warn('Portfolio items snapshot warning:', error);
      onData([]);
    }
  );
}

export async function savePortfolioItem(item: Omit<PortfolioItem, 'id'> & { id?: string }): Promise<string> {
  try {
    if (item.id && item.id.length > 5 && !item.id.startsWith('flyer-')) {
      const docRef = doc(db, 'portfolio_items', item.id);
      await setDoc(docRef, item, { merge: true });
      return item.id;
    } else {
      const colRef = collection(db, 'portfolio_items');
      const docRef = await addDoc(colRef, item);
      return docRef.id;
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, 'portfolio_items');
    return '';
  }
}

export async function updatePortfolioItemImage(itemId: string, newImageUrl: string): Promise<void> {
  try {
    const docRef = doc(db, 'portfolio_items', itemId);
    await updateDoc(docRef, { imageUrl: newImageUrl });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `portfolio_items/${itemId}`);
  }
}

export async function deletePortfolioItem(itemId: string): Promise<void> {
  try {
    const docRef = doc(db, 'portfolio_items', itemId);
    await deleteDoc(docRef);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `portfolio_items/${itemId}`);
  }
}

// --- Dynamic Showcase Videos with Local IndexedDB Vault & Cloud Streaming Support ---

export function subscribeToShowcaseVideos(onData: (videos: ShowcaseVideo[]) => void) {
  const colRef = collection(db, 'showcase_videos');
  return onSnapshot(
    colRef,
    async (snapshot) => {
      try {
        if (!snapshot.empty) {
          const rawVideos: ShowcaseVideo[] = [];
          snapshot.forEach((docSnap) => {
            rawVideos.push({ id: docSnap.id, ...docSnap.data() } as ShowcaseVideo);
          });

          // Hydrate any IndexedDB stored local video blobs for high-speed offline & uncompressed streaming
          const hydratedVideos: ShowcaseVideo[] = await Promise.all(
            rawVideos.map(async (v) => {
              try {
                if (v.videoUrl && (v.videoUrl.startsWith('indexeddb://') || v.videoUrl.startsWith('blob:'))) {
                  const localBlobUrl = await getLocalVideoBlobUrl(v.id);
                  if (localBlobUrl) {
                    return { ...v, videoUrl: localBlobUrl };
                  }
                }
              } catch (e) {
                console.warn('Error reading local video blob:', e);
              }
              return v;
            })
          );

          onData(hydratedVideos);
        } else {
          onData([]);
        }
      } catch (err) {
        console.warn('Error processing showcase videos snapshot:', err);
        onData([]);
      }
    },
    (error) => {
      console.warn('Showcase videos snapshot warning:', error);
      onData([]);
    }
  );
}

export async function saveShowcaseVideo(video: ShowcaseVideo): Promise<string> {
  try {
    const colRef = collection(db, 'showcase_videos');
    
    // Check if the videoUrl is a local blob URL or huge base64 payload (such as Gemini video export)
    // Firestore has a strict 1MB document limit.
    let payloadToSave: ShowcaseVideo = { ...video };

    if (payloadToSave.videoUrl && (payloadToSave.videoUrl.startsWith('blob:') || payloadToSave.videoUrl.length > 500000)) {
      // If it's a huge base64 string or blob, we preserve the metadata in Firestore with an indexeddb pointer
      payloadToSave.videoUrl = `indexeddb://${video.id}`;
    }

    const docRef = await addDoc(colRef, payloadToSave);
    return docRef.id;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, 'showcase_videos');
    return '';
  }
}

export async function deleteShowcaseVideo(videoId: string): Promise<void> {
  try {
    // Delete local IndexedDB blob if any
    await deleteLocalVideoBlob(videoId);
    const docRef = doc(db, 'showcase_videos', videoId);
    await deleteDoc(docRef);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `showcase_videos/${videoId}`);
  }
}

import { AttachedOrderPhoto } from '../types';

// --- Client Inquiries & Orders ---
export interface ClientInquiryRecord {
  id?: string;
  orderRef?: string;
  name: string;
  contact: string;
  clientEmail?: string;
  clientPhone?: string;
  designType: string;
  details: string;
  standardPrice?: number;
  proposedPrice?: number;
  agreedPrice?: number;
  negotiationStatus?: 'pending_approval' | 'approved' | 'countered' | 'declined';
  negotiationNote?: string;
  counterPrice?: number;
  attachedPhotos?: AttachedOrderPhoto[];
  createdAt: string;
  status?: string;
}

export async function saveClientInquiry(inquiry: ClientInquiryRecord): Promise<string> {
  const localRef = inquiry.orderRef || `RC-${Math.floor(100000 + Math.random() * 900000)}`;

  // Save complete order details with negotiation status to LocalStorage for immediate proofing/tracking
  try {
    const existingOrders = JSON.parse(localStorage.getItem('rtson_client_orders') || '[]');
    const newOrderEntry = {
      ...inquiry,
      id: localRef,
      orderRef: localRef,
      standardPrice: inquiry.standardPrice || inquiry.agreedPrice || 0,
      proposedPrice: inquiry.proposedPrice || inquiry.agreedPrice || 0,
      negotiationStatus: inquiry.negotiationStatus || 'pending_approval',
      negotiationNote: inquiry.negotiationNote || '',
      status: inquiry.status || 'pending',
      createdAt: inquiry.createdAt || new Date().toISOString()
    };
    localStorage.setItem('rtson_client_orders', JSON.stringify([newOrderEntry, ...existingOrders.slice(0, 30)]));
  } catch (lsErr) {
    console.warn('LocalStorage save warning:', lsErr);
  }

  // Construct structured photo summary for Firestore project details
  let photoSummaryText = '';
  if (inquiry.attachedPhotos && inquiry.attachedPhotos.length > 0) {
    photoSummaryText = `\n\n[ATTACHED PHOTOS (${inquiry.attachedPhotos.length})]:\n` +
      inquiry.attachedPhotos.map((p, idx) => 
        `#${idx + 1}: ${p.name} (${p.sizeFormatted}) - Role: ${p.roleLabel}${p.instructions ? ` - Notes: "${p.instructions}"` : ''}${p.retouchRequested ? ' [Studio Retouching Requested]' : ''}`
      ).join('\n');
  }

  const enrichedDetails = (inquiry.details + photoSummaryText).slice(0, 4900);

  try {
    const colRef = collection(db, 'inquiries');
    const docRef = await addDoc(colRef, {
      clientName: (inquiry.name || 'Studio Client').slice(0, 100),
      clientPhone: (inquiry.contact || inquiry.clientPhone || inquiry.clientEmail || 'WhatsApp Direct').slice(0, 50),
      selectedStyleCategory: (inquiry.designType || 'church_flyer').slice(0, 100),
      projectDetails: enrichedDetails,
      totalEstimate: inquiry.proposedPrice || inquiry.agreedPrice || inquiry.standardPrice || 0,
      standardPrice: inquiry.standardPrice || 0,
      proposedPrice: inquiry.proposedPrice || 0,
      negotiationStatus: inquiry.negotiationStatus || 'pending_approval',
      negotiationNote: (inquiry.negotiationNote || '').slice(0, 500),
      createdAt: inquiry.createdAt || new Date().toISOString(),
      status: 'pending'
    });
    return docRef.id;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, 'inquiries');
    return localRef;
  }
}

export function updateLocalInquiryNegotiation(
  orderRef: string, 
  status: 'approved' | 'countered' | 'declined', 
  counterPrice?: number,
  approvedPrice?: number
): boolean {
  try {
    const existingOrders = JSON.parse(localStorage.getItem('rtson_client_orders') || '[]');
    const updated = existingOrders.map((ord: ClientInquiryRecord) => {
      if (ord.orderRef === orderRef || ord.id === orderRef) {
        return {
          ...ord,
          negotiationStatus: status,
          counterPrice: counterPrice !== undefined ? counterPrice : ord.counterPrice,
          agreedPrice: approvedPrice !== undefined ? approvedPrice : (status === 'approved' ? (ord.proposedPrice || ord.agreedPrice) : ord.agreedPrice)
        };
      }
      return ord;
    });
    localStorage.setItem('rtson_client_orders', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
    return true;
  } catch (e) {
    console.warn('Update local order notice:', e);
    return false;
  }
}

// --- Helper: Convert Image File to High-Fidelity Data URL (Preserves exact pixels & PNG transparency) ---

export function uploadImageAsDataUrl(file: File, maxWidth = 2560, quality = 0.95): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Selected file is not an image.'));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.onload = (e) => {
      const rawDataUrl = e.target?.result as string;
      // If the uploaded flyer image is under 2MB, preserve the exact raw uncompressed binary file data URL
      // This guarantees zero compression artifacts, zero color distortion, and 100% PNG transparency preservation!
      if (file.size <= 2 * 1024 * 1024) {
        resolve(rawDataUrl);
        return;
      }

      // For larger files (e.g. 10MB+ camera RAW exports), perform smooth high-resolution scaling
      const img = new Image();
      img.onerror = () => resolve(rawDataUrl);
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(rawDataUrl);
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        const mimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        const dataUrl = canvas.toDataURL(mimeType, quality);
        resolve(dataUrl);
      };
      img.src = rawDataUrl;
    };
    reader.readAsDataURL(file);
  });
}

// --- Helper: Convert & Store Video File (Supports MP4, WebM, MOV, MKV, Gemini AI Videos) ---

export async function uploadVideoFile(
  file: File, 
  id: string = `vid-${Date.now()}`
): Promise<{ videoUrl: string; isLocalBlob: boolean; sizeMb: string; fileName: string }> {
  // Validate file: accept any video mime type OR video file extensions
  const isVideoExt = /\.(mp4|webm|mov|mkv|avi|m4v|ts|flv)$/i.test(file.name);
  const isVideoMime = file.type.startsWith('video/') || file.type === 'application/octet-stream';
  
  if (!isVideoExt && !isVideoMime && file.type !== '') {
    throw new Error(`The selected file "${file.name}" is not a recognized video format. Please upload an MP4, WebM, or MOV video.`);
  }

  const sizeMb = (file.size / (1024 * 1024)).toFixed(1);

  // Store in IndexedDB vault for persistent, high-speed, local playback without Firestore 1MB limits
  const objectUrl = await storeLocalVideoBlob(id, file, file.name);

  return {
    videoUrl: objectUrl,
    isLocalBlob: true,
    sizeMb,
    fileName: file.name
  };
}

export function uploadVideoAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const isVideoExt = /\.(mp4|webm|mov|mkv|avi|m4v|ts|flv)$/i.test(file.name);
    const isVideoMime = file.type.startsWith('video/') || file.type === 'application/octet-stream';

    if (!isVideoExt && !isVideoMime && file.type !== '') {
      reject(new Error('Selected file is not a valid video file (.mp4, .webm, .mov).'));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read video file'));
    reader.onload = (e) => {
      if (e.target?.result) {
        resolve(e.target.result as string);
      } else {
        reject(new Error('Video file result is empty'));
      }
    };
    reader.readAsDataURL(file);
  });
}

// --- Helper: Verified Graphic Design Advertising Showcase Videos ---
export const VERIFIED_FALLBACK_VIDEOS = [
  "https://vjs.zencdn.net/v/oceans.mp4",
  "https://media.w3.org/2010/05/sintel/trailer_hd.mp4",
  "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4"
];

export function resolveWorkingVideoUrl(url?: string | null, fallbackIndex = 0): string {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return VERIFIED_FALLBACK_VIDEOS[fallbackIndex % VERIFIED_FALLBACK_VIDEOS.length];
  }
  // Always return user uploaded video URL, blob:, data:, youtube, or link directly untouched!
  return url.trim();
}

// --- Helper: Extract YouTube, Vimeo, Google Drive, or Cloud Embed URL ---
export function getYouTubeEmbedUrl(url: string): string | null {
  if (!url) return null;
  const cleanUrl = url.trim();

  // YouTube Shorts or Watch URL
  const ytMatch = cleanUrl.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (ytMatch && ytMatch[1]) {
    return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&mute=1&playsinline=1&rel=0&modestbranding=1`;
  }

  // Vimeo
  const vimeoMatch = cleanUrl.match(/vimeo\.com\/(?:video\/)?([0-9]+)/);
  if (vimeoMatch && vimeoMatch[1]) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1&muted=1&playsinline=1`;
  }

  // Google Drive (e.g. Gemini AI video shared link)
  const gdriveMatch = cleanUrl.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (gdriveMatch && gdriveMatch[1]) {
    return `https://drive.google.com/file/d/${gdriveMatch[1]}/preview`;
  }

  return null;
}

// --- Helper: Direct URL Stream Formatter (Dropbox, Google Cloud, Direct MP4) ---
export function formatDirectVideoUrl(url: string): string {
  if (!url) return '';
  let formatted = url.trim();

  // Dropbox share links: switch dl=0 to dl=1 or raw=1
  if (formatted.includes('dropbox.com')) {
    formatted = formatted.replace(/[?&]dl=0/, '?raw=1').replace(/[?&]dl=1/, '?raw=1');
  }

  return formatted;
}



