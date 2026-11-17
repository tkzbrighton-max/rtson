/**
 * Image Sharing and WhatsApp Dispatch Utility for R'tson Creations Studio
 * Enables sharing actual image files via Web Share API, Clipboard API, and Cloud Link generation.
 */

// Convert Base64 Data URL to Blob
export function dataUrlToBlob(dataUrl: string): Blob {
  const parts = dataUrl.split(';base64,');
  const contentType = parts[0].split(':')[1] || 'image/png';
  const raw = window.atob(parts[1]);
  const rawLength = raw.length;
  const uInt8Array = new Uint8Array(rawLength);

  for (let i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }

  return new Blob([uInt8Array], { type: contentType });
}

// Convert Base64 Data URL to File object
export function dataUrlToFile(dataUrl: string, fileName: string): File {
  const blob = dataUrlToBlob(dataUrl);
  return new File([blob], fileName, { type: blob.type || 'image/png' });
}

// Check if current browser and OS support sharing files (Web Share Level 2)
export function canShareFiles(): boolean {
  if (typeof navigator === 'undefined' || !navigator.canShare || !navigator.share) {
    return false;
  }
  try {
    const dummyFile = new File(['dummy'], 'test.png', { type: 'image/png' });
    return navigator.canShare({ files: [dummyFile] });
  } catch (e) {
    return false;
  }
}

// Copy Image Blob directly to the system clipboard
export async function copyImageToClipboard(blob: Blob): Promise<{ success: boolean; message: string }> {
  if (typeof navigator === 'undefined' || !navigator.clipboard || !navigator.clipboard.write) {
    return { success: false, message: 'Clipboard image writing not supported on this browser.' };
  }
  try {
    // Ensure image/png type
    const pngBlob = blob.type === 'image/png' ? blob : new Blob([blob], { type: 'image/png' });
    await navigator.clipboard.write([
      new ClipboardItem({ 'image/png': pngBlob })
    ]);
    return { success: true, message: 'Retouched image copied to clipboard! Press Ctrl+V in WhatsApp to paste.' };
  } catch (err: any) {
    console.warn('Clipboard write failed:', err);
    return { success: false, message: err?.message || 'Could not copy image to clipboard.' };
  }
}

// Upload Retouched Photo to Studio Backend for rich WhatsApp preview links
export async function uploadRetouchedPhoto(
  dataUrl: string, 
  name?: string, 
  specs?: any
): Promise<{ directImageUrl: string; viewUrl: string; id: string } | null> {
  try {
    const res = await fetch('/api/retouched/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image: dataUrl,
        name: name || `retouched_${Date.now()}.png`,
        specs: specs || {}
      })
    });

    if (!res.ok) {
      throw new Error(`Upload failed with status ${res.status}`);
    }

    const data = await res.json();
    if (data && data.success) {
      return {
        directImageUrl: data.directImageUrl,
        viewUrl: data.viewUrl,
        id: data.id
      };
    }
    return null;
  } catch (e) {
    console.warn('Failed to upload retouched photo to cloud endpoint:', e);
    return null;
  }
}

// Download image file to user's device
export function downloadImageFile(dataUrl: string, fileName: string): void {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Construct standard WhatsApp wa.me URL
export function createWhatsAppChatUrl(phone: string, text: string): string {
  const cleanPhone = phone.replace(/[^\d]/g, '');
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}
