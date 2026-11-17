// Image Processing and Computer Vision Utility Suite for R'tson Creations Studio Desk

export interface RgbColor {
  r: number;
  g: number;
  b: number;
}

export interface HslColor {
  h: number; // 0 - 360
  s: number; // 0 - 100
  l: number; // 0 - 100
}

export interface Point {
  x: number;
  y: number;
}

// Convert RGB (0-255) to HSL (0-360, 0-100, 0-100)
export function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }
  return [h * 360, s * 100, l * 100];
}

// Convert HSL (0-360, 0-100, 0-100) to RGB (0-255)
export function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  h /= 360;
  s /= 100;
  l /= 100;
  let r: number, g: number, b: number;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

// Multi-space Skin & Facial Feature Detection (Valid for all ethnic skin tones)
export function checkIsSkinOrFace(
  r: number,
  g: number,
  b: number,
  x: number,
  y: number,
  width: number,
  height: number,
  h: number,
  s: number,
  l: number
): boolean {
  // YCbCr Chromaticity
  const Y = 0.299 * r + 0.587 * g + 0.114 * b;
  const Cb = 128 - 0.168736 * r - 0.331264 * g + 0.5 * b;
  const Cr = 128 + 0.5 * r - 0.418688 * g - 0.081312 * b;
  const isYCbCrSkin = Cb >= 73 && Cb <= 140 && Cr >= 125 && Cr <= 185 && Cr > Cb;

  // Normalized RGB
  const sum = r + g + b + 0.001;
  const nr = r / sum;
  const ng = g / sum;
  const isNormRgbSkin = nr >= 0.32 && ng <= 0.43 && nr > ng && nr - ng >= 0.015;

  // Melanin rich warm tones (Common in African and tan complexions)
  const isMelaninTone = r > g && g > b && r - b >= 8 && r >= 20 && l >= 8 && l <= 90;

  // HSV Hue
  const isHsvSkin = ((h >= 0 && h <= 52) || (h >= 330 && h <= 360)) && s >= 10 && l >= 10 && l <= 90;

  const isGeneralSkin = isYCbCrSkin || (isNormRgbSkin && isHsvSkin) || isMelaninTone;

  // Facial Anatomical Zone (Upper 60% center of portrait)
  const isUpperHeadZone = y < height * 0.60;
  const isCentralHeadZone = isUpperHeadZone && x > width * 0.12 && x < width * 0.88;

  if (isCentralHeadZone) {
    // Lips & Mouth
    const isLipTone = r > g * 1.15 && r > b * 1.15 && ((h >= 320 && h <= 360) || (h >= 0 && h <= 30));
    // Hair, Eyebrows, Beard
    const isDarkHairOrBeard = l < 28 || (s < 25 && l < 42);
    // Sclera & Teeth
    const isTeethOrEyeWhite = l > 60 && s < 25;

    if (isLipTone || isDarkHairOrBeard || isTeethOrEyeWhite || isGeneralSkin) {
      return true;
    }
  }

  return isGeneralSkin;
}

// Check if pixel belongs to common foreground objects (microphones, books, instruments, jewelry)
export function checkIsProtectedObject(
  r: number,
  g: number,
  b: number,
  x: number,
  y: number,
  width: number,
  height: number,
  h: number,
  s: number,
  l: number
): boolean {
  // Metallic gold / silver jewelry, chains, watches
  const isMetallicGold = (h >= 35 && h <= 58 && s >= 50 && l >= 35 && l <= 85);
  const isMetallicSilver = (s <= 15 && l >= 40 && l <= 90);

  // Microphones & tech items (high contrast dark grays, steel grilles)
  const isMicrophoneOrTech = (s <= 18 && l >= 12 && l <= 50 && y > height * 0.20);

  // Crisp white collars / shirts / cuffs / papers
  const isCrispWhiteItem = (s <= 18 && l >= 80);

  return isMetallicGold || isMetallicSilver || isMicrophoneOrTech || isCrispWhiteItem;
}

// Optimized, High-Precision Multi-Point & Perimeter Flood Fill Exterior Background Map
export function computeExteriorBackgroundMap(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  tolerance: number
): Uint8Array {
  const isBgMap = new Uint8Array(width * height);
  const visited = new Uint8Array(width * height);
  
  // Use Int32Array queue for maximum memory speed
  const queue = new Int32Array(width * height);
  let queueHead = 0;
  let queueTail = 0;

  // Sample comprehensive perimeter boundary seeds (Top, Bottom, Left, Right edges)
  const seedColors: [number, number, number][] = [];
  const stepX = Math.max(1, Math.floor(width / 24));
  const stepY = Math.max(1, Math.floor(height / 24));

  // Top and Bottom borders
  for (let x = 0; x < width; x += stepX) {
    // Top
    const topIdx = x * 4;
    seedColors.push([data[topIdx], data[topIdx + 1], data[topIdx + 2]]);
    if (visited[x] === 0) {
      visited[x] = 1;
      isBgMap[x] = 1;
      queue[queueTail++] = x;
    }
    // Bottom
    const bottomPixel = (height - 1) * width + x;
    const botIdx = bottomPixel * 4;
    seedColors.push([data[botIdx], data[botIdx + 1], data[botIdx + 2]]);
    if (visited[bottomPixel] === 0) {
      visited[bottomPixel] = 1;
      isBgMap[bottomPixel] = 1;
      queue[queueTail++] = bottomPixel;
    }
  }

  // Left and Right borders
  for (let y = 0; y < height; y += stepY) {
    // Left
    const leftPixel = y * width;
    const leftIdx = leftPixel * 4;
    seedColors.push([data[leftIdx], data[leftIdx + 1], data[leftIdx + 2]]);
    if (visited[leftPixel] === 0) {
      visited[leftPixel] = 1;
      isBgMap[leftPixel] = 1;
      queue[queueTail++] = leftPixel;
    }
    // Right
    const rightPixel = y * width + (width - 1);
    const rightIdx = rightPixel * 4;
    seedColors.push([data[rightIdx], data[rightIdx + 1], data[rightIdx + 2]]);
    if (visited[rightPixel] === 0) {
      visited[rightPixel] = 1;
      isBgMap[rightPixel] = 1;
      queue[queueTail++] = rightPixel;
    }
  }

  const effectiveTol = Math.max(12, tolerance * 1.5);
  const thresholdSq = effectiveTol * effectiveTol;
  const parentThresholdSq = thresholdSq * 0.75;

  // Fast BFS flood-fill from all exterior edges
  while (queueHead < queueTail) {
    const curr = queue[queueHead++];
    const cx = curr % width;
    const cy = (curr / width) | 0;
    const curr4 = curr * 4;
    const cr = data[curr4];
    const cg = data[curr4 + 1];
    const cb = data[curr4 + 2];

    const left = cx > 0 ? curr - 1 : -1;
    const right = cx < width - 1 ? curr + 1 : -1;
    const up = cy > 0 ? curr - width : -1;
    const down = cy < height - 1 ? curr + width : -1;

    const neighbors = [left, right, up, down];

    for (let n = 0; n < 4; n++) {
      const nIdx = neighbors[n];
      if (nIdx === -1 || visited[nIdx] === 1) continue;

      const n4 = nIdx * 4;
      const nr = data[n4];
      const ng = data[n4 + 1];
      const nb = data[n4 + 2];

      const nx = nIdx % width;
      const ny = (nIdx / width) | 0;

      // Distance to immediate parent
      const dr = nr - cr;
      const dg = ng - cg;
      const db = nb - cb;
      const distToParentSq = dr * dr + dg * dg + db * db;

      // Fast check against sample perimeter seeds
      let minSeedDistSq = 999999;
      for (let s = 0; s < seedColors.length; s += 2) {
        const sc = seedColors[s];
        const sdr = nr - sc[0];
        const sdg = ng - sc[1];
        const sdb = nb - sc[2];
        const sDist = sdr * sdr + sdg * sdg + sdb * sdb;
        if (sDist < minSeedDistSq) minSeedDistSq = sDist;
        if (sDist < parentThresholdSq) break; // early exit
      }

      // Check if pixel is central subject skin / face
      const [h, s, l] = rgbToHsl(nr, ng, nb);
      const isSkin = checkIsSkinOrFace(nr, ng, nb, nx, ny, width, height, h, s, l);
      const isProtected = checkIsProtectedObject(nr, ng, nb, nx, ny, width, height, h, s, l);

      // Stop flood fill if encountering protected skin or object
      if (isSkin || isProtected) {
        visited[nIdx] = 1;
        continue;
      }

      if (distToParentSq < parentThresholdSq || minSeedDistSq < thresholdSq) {
        visited[nIdx] = 1;
        isBgMap[nIdx] = 1;
        queue[queueTail++] = nIdx;
      } else {
        visited[nIdx] = 1;
      }
    }
  }

  return isBgMap;
}

// Magic Wand Flood Fill at Click Point
export function magicWandFloodErase(
  sourceData: Uint8ClampedArray,
  width: number,
  height: number,
  startX: number,
  startY: number,
  tolerance: number,
  targetMaskData: Uint8ClampedArray
): void {
  startX = Math.floor(Math.max(0, Math.min(width - 1, startX)));
  startY = Math.floor(Math.max(0, Math.min(height - 1, startY)));

  const startIdx = (startY * width + startX) * 4;
  const targetR = sourceData[startIdx];
  const targetG = sourceData[startIdx + 1];
  const targetB = sourceData[startIdx + 2];

  const thresholdSq = Math.pow(Math.max(10, tolerance * 1.4), 2);
  const visited = new Uint8Array(width * height);
  const queue = new Int32Array(width * height);
  let queueHead = 0;
  let queueTail = 0;

  const startPixel = startY * width + startX;
  visited[startPixel] = 1;
  queue[queueTail++] = startPixel;

  while (queueHead < queueTail) {
    const curr = queue[queueHead++];
    const cx = curr % width;
    const cy = (curr / width) | 0;
    const curr4 = curr * 4;

    // Erase in mask (Red > 128 indicates erase in manual mask)
    targetMaskData[curr4] = 255;
    targetMaskData[curr4 + 1] = 0;
    targetMaskData[curr4 + 2] = 0;
    targetMaskData[curr4 + 3] = 255;

    const left = cx > 0 ? curr - 1 : -1;
    const right = cx < width - 1 ? curr + 1 : -1;
    const up = cy > 0 ? curr - width : -1;
    const down = cy < height - 1 ? curr + width : -1;

    const neighbors = [left, right, up, down];

    for (let n = 0; n < 4; n++) {
      const nIdx = neighbors[n];
      if (nIdx === -1 || visited[nIdx] === 1) continue;

      const n4 = nIdx * 4;
      const nr = sourceData[n4];
      const ng = sourceData[n4 + 1];
      const nb = sourceData[n4 + 2];

      const dr = nr - targetR;
      const dg = ng - targetG;
      const db = nb - targetB;
      const distSq = dr * dr + dg * dg + db * db;

      if (distSq <= thresholdSq) {
        visited[nIdx] = 1;
        queue[queueTail++] = nIdx;
      } else {
        visited[nIdx] = 1;
      }
    }
  }
}

// Ultra-fast zero-freeze image compressor using ObjectURL and async hardware decoding
export async function fastCompressImageFile(file: File, maxDimension = 1400): Promise<string> {
  return new Promise((resolve, reject) => {
    // 1. Instant Object URL creation (0.1ms vs 2000ms FileReader DataURL)
    const blobUrl = URL.createObjectURL(file);
    const img = new Image();
    
    img.onload = async () => {
      try {
        if ('decode' in img) {
          try {
            await img.decode();
          } catch {}
        }

        const { naturalWidth: width, naturalHeight: height } = img;
        
        let targetWidth = width;
        let targetHeight = height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            targetHeight = Math.round((height * maxDimension) / width);
            targetWidth = maxDimension;
          } else {
            targetWidth = Math.round((width * maxDimension) / height);
            targetHeight = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext('2d', { alpha: true });
        
        if (!ctx) {
          URL.revokeObjectURL(blobUrl);
          resolve(blobUrl);
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

        // Keep transparency if PNG, else JPEG for maximum speed
        const isPng = file.type === 'image/png' || file.name.toLowerCase().endsWith('.png');
        const outputFormat = isPng ? 'image/png' : 'image/jpeg';
        const quality = isPng ? 1.0 : 0.92;

        const dataUrl = canvas.toDataURL(outputFormat, quality);
        URL.revokeObjectURL(blobUrl);
        resolve(dataUrl);
      } catch (err) {
        URL.revokeObjectURL(blobUrl);
        // Fallback to reading data url
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(blobUrl);
      // Fallback
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    };

    img.src = blobUrl;
  });
}

// -------------------------------------------------------------
// FILTER PRESET COLOR MAPPINGS
// -------------------------------------------------------------
export type FilterPresetId =
  | 'natural'
  | 'cinematic_warm'
  | 'noir_bw'
  | 'teal_orange'
  | 'vintage_film'
  | 'crisp_hdr'
  | 'gold_luxury'
  | 'cool_studio';

export interface FilterPreset {
  id: FilterPresetId;
  label: string;
  description: string;
}

export const FILTER_PRESETS: FilterPreset[] = [
  { id: 'natural', label: 'Natural Studio', description: 'Original color balance and studio illumination' },
  { id: 'cinematic_warm', label: 'Cinematic Warm', description: 'Rich golden-hour glow with lifted warm shadows' },
  { id: 'noir_bw', label: 'Noir Monochrome', description: 'Dynamic high-contrast monochrome with deep blacks' },
  { id: 'teal_orange', label: 'Teal & Orange', description: 'Blockbuster Hollywood split-toning' },
  { id: 'vintage_film', label: 'Vintage Matte', description: 'Classic analog film look with muted highlights' },
  { id: 'crisp_hdr', label: 'Crisp HDR', description: 'Ultra-vibrant punchy contrast for commercial posters' },
  { id: 'gold_luxury', label: '3D Gold Luxury', description: 'Luminous royal gold overtone for church & gala flyers' },
  { id: 'cool_studio', label: 'Cool Daylight', description: 'Clean crisp blue daylight tone for corporate artwork' }
];

export function applyFilterPreset(
  r: number,
  g: number,
  b: number,
  preset: FilterPresetId,
  strength: number = 100
): [number, number, number] {
  if (preset === 'natural' || strength <= 0) {
    return [r, g, b];
  }

  const factor = Math.max(0, Math.min(1, strength / 100));
  let fr = r;
  let fg = g;
  let fb = b;

  switch (preset) {
    case 'cinematic_warm': {
      fr = r * 1.12 + 10;
      fg = g * 1.04 + 4;
      fb = b * 0.88 - 6;
      break;
    }
    case 'noir_bw': {
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;
      const contrastLum = ((lum - 128) * 1.35) + 128;
      fr = contrastLum;
      fg = contrastLum;
      fb = contrastLum;
      break;
    }
    case 'teal_orange': {
      const lum = (r + g + b) / 3;
      if (lum > 128) {
        // Highlights toward orange/gold
        fr = r * 1.15;
        fg = g * 1.02;
        fb = b * 0.82;
      } else {
        // Shadows toward teal
        fr = r * 0.82;
        fg = g * 1.05 + 8;
        fb = b * 1.22 + 14;
      }
      break;
    }
    case 'vintage_film': {
      fr = r * 0.95 + 24;
      fg = g * 0.92 + 18;
      fb = b * 0.84 + 14;
      break;
    }
    case 'crisp_hdr': {
      const avg = (r + g + b) / 3;
      fr = r + (r - avg) * 0.35 + 6;
      fg = g + (g - avg) * 0.35 + 6;
      fb = b + (b - avg) * 0.35 + 6;
      break;
    }
    case 'gold_luxury': {
      fr = r * 1.18 + 18;
      fg = g * 1.08 + 12;
      fb = b * 0.72;
      break;
    }
    case 'cool_studio': {
      fr = r * 0.88;
      fg = g * 0.98 + 4;
      fb = b * 1.16 + 12;
      break;
    }
  }

  // Blend with original according to strength
  const outR = Math.min(255, Math.max(0, Math.round(r * (1 - factor) + fr * factor)));
  const outG = Math.min(255, Math.max(0, Math.round(g * (1 - factor) + fg * factor)));
  const outB = Math.min(255, Math.max(0, Math.round(b * (1 - factor) + fb * factor)));

  return [outR, outG, outB];
}

// -------------------------------------------------------------
// ADVANCED CLARITY, SHARPENING & DETAIL CALIBRATION
// -------------------------------------------------------------
export interface DetailAdjustSettings {
  sharpness: number;      // 0 to 100
  clarity: number;        // 0 to 100
  smoothSkin: number;     // 0 to 100
  highlights: number;     // -100 to 100 (recover / boost)
  shadows: number;        // -100 to 100 (lift / crush)
  temperature: number;    // -50 to 50 (cool <-> warm)
  tint: number;           // -50 to 50 (green <-> magenta)
}

// Apply fast high-pass kernel sharpening
export function applySharpeningKernel(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  strength: number
): void {
  if (strength <= 0) return;

  const factor = (strength / 100) * 0.55; // Controlled sharpening strength
  const original = new Uint8ClampedArray(data);

  for (let y = 1; y < height - 1; y++) {
    const rowOffset = y * width;
    for (let x = 1; x < width - 1; x++) {
      const idx = (rowOffset + x) * 4;
      if (data[idx + 3] === 0) continue; // Skip transparent

      const top = ((y - 1) * width + x) * 4;
      const bottom = ((y + 1) * width + x) * 4;
      const left = (rowOffset + (x - 1)) * 4;
      const right = (rowOffset + (x + 1)) * 4;

      for (let c = 0; c < 3; c++) {
        const centerVal = original[idx + c];
        const laplacian = (
          centerVal * 5 -
          original[top + c] -
          original[bottom + c] -
          original[left + c] -
          original[right + c]
        );

        const sharpened = centerVal * (1 - factor) + laplacian * factor;
        data[idx + c] = Math.min(255, Math.max(0, sharpened));
      }
    }
  }
}

// Apply Film Grain noise over canvas context
export function applyFilmGrain(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  intensity: number
): void {
  if (intensity <= 0) return;
  const grainCanvas = document.createElement('canvas');
  const grainSize = Math.max(64, Math.min(256, Math.floor(width / 4)));
  grainCanvas.width = grainSize;
  grainCanvas.height = grainSize;
  const gCtx = grainCanvas.getContext('2d');
  if (!gCtx) return;

  const gImgData = gCtx.createImageData(grainSize, grainSize);
  const gData = gImgData.data;
  const alpha = Math.min(255, Math.floor((intensity / 100) * 45));

  for (let i = 0; i < gData.length; i += 4) {
    const noise = (Math.random() * 255) | 0;
    gData[i] = noise;
    gData[i + 1] = noise;
    gData[i + 2] = noise;
    gData[i + 3] = alpha;
  }
  gCtx.putImageData(gImgData, 0, 0);

  ctx.save();
  ctx.globalCompositeOperation = 'overlay';
  ctx.fillStyle = ctx.createPattern(grainCanvas, 'repeat') || 'transparent';
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
}

// Apply Halation / Lens Bloom over canvas
export function applyHalation(
  ctx: CanvasRenderingContext2D,
  sourceCanvas: HTMLCanvasElement,
  width: number,
  height: number,
  intensity: number
): void {
  if (intensity <= 0) return;
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  ctx.filter = `blur(${Math.max(4, Math.floor((intensity / 100) * 18))}px)`;
  ctx.globalAlpha = Math.min(0.65, (intensity / 100) * 0.5);
  ctx.drawImage(sourceCanvas, 0, 0, width, height);
  ctx.restore();
}


