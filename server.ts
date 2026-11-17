import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// In-memory store for client inquiries, designer portfolio updates, external auto-synced flyers, retouched photos, and Paynow payments
let savedInquiries: any[] = [];
let autoSyncedFlyers: any[] = [];
let savedPayments: any[] = [];

interface StoredRetouchedPhoto {
  id: string;
  dataUrl: string;
  mimeType: string;
  name?: string;
  specs?: any;
  createdAt: string;
}
const storedRetouchedPhotos = new Map<string, StoredRetouchedPhoto>();

// Initialize Gemini Client safely
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

// Health Check API
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// --- RETOUCHED PHOTOS CLOUD STORAGE & WHATSAPP RICH LINK PREVIEWS ---
app.post("/api/retouched/upload", (req, res) => {
  try {
    const { image, name, specs } = req.body;
    if (!image) {
      return res.status(400).json({ error: "Missing image data" });
    }

    const id = `retouch_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    const mimeType = matches ? matches[1] : "image/png";

    storedRetouchedPhotos.set(id, {
      id,
      dataUrl: image,
      mimeType,
      name: name || `photo_${Date.now()}.png`,
      specs: specs || {},
      createdAt: new Date().toISOString()
    });

    // Prune if cache gets larger than 150
    if (storedRetouchedPhotos.size > 150) {
      const oldestKeys = Array.from(storedRetouchedPhotos.keys()).slice(0, 30);
      oldestKeys.forEach(k => storedRetouchedPhotos.delete(k));
    }

    const host = req.get('host') || 'localhost:3000';
    const protocol = req.protocol === 'https' || req.get('x-forwarded-proto') === 'https' ? 'https' : 'http';
    const baseUrl = `${protocol}://${host}`;
    const directImageUrl = `${baseUrl}/api/retouched/${id}.png`;
    const viewUrl = `${baseUrl}/api/retouched/view/${id}`;

    return res.json({
      success: true,
      id,
      directImageUrl,
      viewUrl,
      message: "Retouched photo uploaded for instant sharing."
    });
  } catch (err: any) {
    console.error("Error saving retouched photo:", err);
    return res.status(500).json({ error: err.message || "Failed to save photo" });
  }
});

// Direct Image Binary Delivery
app.get("/api/retouched/:id.png", (req, res) => {
  const { id } = req.params;
  const item = storedRetouchedPhotos.get(id);
  if (!item) {
    return res.status(404).send("Photo not found or expired.");
  }

  const base64Data = item.dataUrl.replace(/^data:image\/\w+;base64,/, "");
  const imgBuffer = Buffer.from(base64Data, 'base64');

  res.setHeader("Content-Type", item.mimeType || "image/png");
  res.setHeader("Content-Disposition", `inline; filename="${item.name || `rtson-retouched-${id}.png`}"`);
  res.setHeader("Cache-Control", "public, max-age=86400");
  return res.send(imgBuffer);
});

// Rich OpenGraph Preview Page for WhatsApp Link Rendering
app.get("/api/retouched/view/:id", (req, res) => {
  const { id } = req.params;
  const item = storedRetouchedPhotos.get(id);
  if (!item) {
    return res.status(404).send("Photo expired or not found.");
  }

  const host = req.get('host') || 'localhost:3000';
  const protocol = req.protocol === 'https' || req.get('x-forwarded-proto') === 'https' ? 'https' : 'http';
  const directImageUrl = `${protocol}://${host}/api/retouched/${id}.png`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Retouched Studio Portrait — R'tson Creations</title>
  <meta property="og:title" content="Retouched Studio Portrait — R'tson Creations" />
  <meta property="og:description" content="300 DPI Pre-Press Studio Retouched Image for graphic design and flyer project." />
  <meta property="og:image" content="${directImageUrl}" />
  <meta property="og:image:type" content="image/png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="1200" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:image" content="${directImageUrl}" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin: 0; background: #030712; color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; padding: 20px; box-sizing: border-box; text-align: center; }
    .card { background: #0c1527; border: 1px solid rgba(255,255,255,0.15); border-radius: 20px; padding: 24px; max-width: 540px; width: 100%; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.8); }
    img { max-width: 100%; max-height: 60vh; border-radius: 12px; object-fit: contain; background: #000; border: 1px solid rgba(255,255,255,0.1); }
    h1 { font-size: 1.25rem; margin: 16px 0 6px; font-weight: 800; color: #fff; }
    p { font-size: 0.85rem; color: #9ca3af; margin: 0 0 20px; line-height: 1.5; }
    .btn { background: linear-gradient(135deg, #f59e0b, #ea580c); color: #000; font-weight: 800; padding: 12px 24px; border-radius: 12px; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; font-size: 0.9rem; transition: transform 0.1s ease; }
    .btn:active { transform: scale(0.98); }
  </style>
</head>
<body>
  <div class="card">
    <img src="${directImageUrl}" alt="Retouched Photo" />
    <h1>Studio Retouched Portrait (300 DPI)</h1>
    <p>Calibrated and prepared on R'tson Creations Studio Retouch Desk.</p>
    <a href="${directImageUrl}" download="rtson-retouched-${id}.png" class="btn">⬇ Download High-Res PNG (300 DPI)</a>
  </div>
</body>
</html>`;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  return res.send(html);
});

// --- EXTERNAL AUTO-SYNC INTEGRATIONS (Picsart, Lightroom, ChatGPT, Gemini) ---

// 1. Universal Webhook Endpoint for Picsart, Lightroom, ChatGPT, Gemini, Zapier, etc.
app.post("/api/integrations/webhook", (req, res) => {
  try {
    const { source, title, imageUrl, category, price, turnaroundHours, description, clientType } = req.body;

    if (!title || !imageUrl) {
      return res.status(400).json({
        error: "Missing required fields: 'title' and 'imageUrl' are required for auto-sync upload."
      });
    }

    const categoryLabels: Record<string, string> = {
      simple_flyer: 'Simple Business Flyer',
      church_flyer: 'Church Flyer',
      event_poster: 'Event & Club Poster',
      social_media: 'Social Media Design',
      branding: 'Branding & Logo'
    };

    const sourceName = source ? String(source).toUpperCase() : 'EXTERNAL_SYNC';

    const syncedFlyer = {
      id: `SYNC-${sourceName}-${Date.now().toString().slice(-6)}`,
      title,
      category: category || 'church_flyer',
      categoryLabel: categoryLabels[category] || 'Graphic Design',
      imageUrl,
      price: price ? Number(price) : 15,
      turnaroundHours: turnaroundHours ? Number(turnaroundHours) : 24,
      description: description || `Auto-uploaded from ${sourceName} integration.`,
      clientType: clientType || `${sourceName} Export`,
      tags: [sourceName.toLowerCase(), 'auto-sync', 'portfolio'],
      features: ['300 DPI Print Ready PDF', 'High Res PNG', 'Auto-Synced via API'],
      createdAt: new Date().toISOString(),
      source: sourceName
    };

    autoSyncedFlyers.unshift(syncedFlyer);

    return res.json({
      success: true,
      message: `Successfully auto-uploaded design from ${sourceName}!`,
      syncedItem: syncedFlyer
    });
  } catch (err: any) {
    console.error("Error processing webhook:", err);
    return res.status(500).json({ error: err.message || "Failed to process external webhook." });
  }
});

// 2. Picsart Specific Sync Endpoint
app.post("/api/integrations/sync/picsart", (req, res) => {
  const { title, imageUrl, price, category } = req.body;
  
  const syncedItem = {
    id: `PICSART-${Date.now().toString().slice(-6)}`,
    title: title || 'Picsart Created Design',
    category: category || 'social_media',
    categoryLabel: category === 'church_flyer' ? 'Church Flyer' : category === 'event_poster' ? 'Event & Club Poster' : 'Social Media Design',
    imageUrl: imageUrl || 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1200&q=80',
    price: price ? Number(price) : 10,
    turnaroundHours: 12,
    description: 'Edited in Picsart and auto-uploaded to website.',
    clientType: 'Picsart Mobile Studio',
    tags: ['picsart', 'mobile-edit', 'vector'],
    features: ['High Resolution PNG', 'Social Media Ready'],
    createdAt: new Date().toISOString(),
    source: 'PICSART'
  };

  autoSyncedFlyers.unshift(syncedItem);
  return res.json({ success: true, message: 'Design synced from Picsart successfully!', item: syncedItem });
});

// 3. Adobe Lightroom Specific Sync Endpoint
app.post("/api/integrations/sync/lightroom", (req, res) => {
  const { title, imageUrl, price, category } = req.body;

  const syncedItem = {
    id: `LIGHTROOM-${Date.now().toString().slice(-6)}`,
    title: title || 'Lightroom Color-Graded Portrait Poster',
    category: category || 'church_flyer',
    categoryLabel: category === 'event_poster' ? 'Event & Club Poster' : 'Church Flyer',
    imageUrl: imageUrl || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
    price: price ? Number(price) : 20,
    turnaroundHours: 24,
    description: 'Color-graded portrait and artwork synced directly from Adobe Lightroom Cloud.',
    clientType: 'Lightroom Pro Studio',
    tags: ['lightroom', 'retouched', 'portrait'],
    features: ['300 DPI Print Ready PDF', 'Pro Color Graded', 'Ultra HD JPEG'],
    createdAt: new Date().toISOString(),
    source: 'LIGHTROOM'
  };

  autoSyncedFlyers.unshift(syncedItem);
  return res.json({ success: true, message: 'Retouched artwork synced from Adobe Lightroom!', item: syncedItem });
});

// --- END OF EXTERNAL STUDIO AUTO-SYNC INTEGRATIONS ---

// Get Auto-Synced Flyers Endpoint
app.get("/api/synced-flyers", (req, res) => {
  return res.json({ success: true, syncedFlyers: autoSyncedFlyers });
});

// AI Design Brief & Headline Generator Endpoint
app.post("/api/ai/generate-brief", async (req, res) => {
  try {
    const { clientName, designCategory, eventOrBusinessName, rawDetails, targetAudience, preferredVibe } = req.body;

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(400).json({ 
        error: "Gemini API key is not configured in environment secrets. Please set GEMINI_API_KEY." 
      });
    }

    const prompt = `
You are a senior art director and graphic design strategist specializing in high-converting flyers, church conference posters, event graphics, and social media designs.
Transform the following client rough input into a structured, professional Graphic Design Brief and pricing estimate.

Client Name: ${clientName || "Valued Client"}
Design Category: ${designCategory || "Flyer Design"}
Event / Business / Title: ${eventOrBusinessName || "Special Event"}
Raw Details & Client Text: "${rawDetails || "Needs an engaging flyer design"}"
Target Audience: ${targetAudience || "General Public"}
Preferred Vibe / Atmosphere: ${preferredVibe || "Modern, Eye-catching & Professional"}

Analyze these details and produce a JSON output adhering to the requested schema.
- Provide 3 compelling headline options
- Recommend a striking color palette (primary, secondary, accent with hex colors or names)
- Detail a clear visual hierarchy and layout concept
- Highlight key missing pieces of information the client should prepare (e.g. speaker photos, address, ticket link)
- Recommend a price range and add-ons based on category (always within $5 to $30 USD range):
  Simple Flyer: $5-$10
  Church Flyer: $10-$15
  Social Media Pack: $10-$15
  Event Poster: $20-$25
  Branding & Complex Design: $25-$30
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an expert graphic design creative director. Always return crisp JSON.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestedTitle: { type: Type.STRING },
            suggestedHeadline: { type: Type.STRING },
            suggestedTagline: { type: Type.STRING },
            recommendedColorPalette: {
              type: Type.OBJECT,
              properties: {
                primary: { type: Type.STRING },
                secondary: { type: Type.STRING },
                accent: { type: Type.STRING },
                description: { type: Type.STRING }
              },
              required: ["primary", "secondary", "accent", "description"]
            },
            layoutConcept: { type: Type.STRING },
            recommendedTypographyStyle: { type: Type.STRING },
            keyInformationChecklist: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            estimatedPriceRange: {
              type: Type.OBJECT,
              properties: {
                min: { type: Type.NUMBER },
                max: { type: Type.NUMBER }
              },
              required: ["min", "max"]
            },
            recommendedAddons: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            designerNotes: { type: Type.STRING }
          },
          required: [
            "suggestedTitle",
            "suggestedHeadline",
            "suggestedTagline",
            "recommendedColorPalette",
            "layoutConcept",
            "recommendedTypographyStyle",
            "keyInformationChecklist",
            "estimatedPriceRange",
            "recommendedAddons",
            "designerNotes"
          ]
        }
      }
    });

    if (!response.text) {
      return res.status(500).json({ error: "No response text generated from Gemini AI." });
    }

    const parsedData = JSON.parse(response.text.trim());
    return res.json({ success: true, brief: parsedData });

  } catch (err: any) {
    console.error("Error generating AI brief:", err);
    return res.status(500).json({ 
      error: err.message || "Failed to generate design brief with AI." 
    });
  }
});

// Save Inquiry Endpoint
app.post("/api/inquiries", (req, res) => {
  const inquiry = req.body;
  const newInquiry = {
    ...inquiry,
    id: `INQ-${Date.now().toString().slice(-6)}`,
    createdAt: new Date().toISOString(),
    status: 'Pending'
  };
  savedInquiries.unshift(newInquiry);
  return res.json({ success: true, inquiry: newInquiry });
});

// Get Inquiries (for Designer Portal view)
app.get("/api/inquiries", (req, res) => {
  return res.json({ success: true, inquiries: savedInquiries });
});

// Get Single Inquiry
app.get("/api/inquiries/:id", (req, res) => {
  const { id } = req.params;
  const inq = savedInquiries.find(i => i.id === id || i.orderRef === id);
  if (inq) {
    return res.json({ success: true, inquiry: inq });
  }
  return res.status(404).json({ error: "Inquiry not found" });
});

// Update Inquiry Status & Negotiation Approval Endpoint
app.patch("/api/inquiries/:id/status", (req, res) => {
  const { id } = req.params;
  const { status, negotiationStatus, counterPrice, approvedPrice } = req.body;
  const inqIndex = savedInquiries.findIndex(i => i.id === id || i.orderRef === id);
  if (inqIndex !== -1) {
    savedInquiries[inqIndex] = {
      ...savedInquiries[inqIndex],
      status: status || savedInquiries[inqIndex].status,
      negotiationStatus: negotiationStatus || savedInquiries[inqIndex].negotiationStatus || (status === 'approved' ? 'approved' : undefined),
      counterPrice: counterPrice !== undefined ? counterPrice : savedInquiries[inqIndex].counterPrice,
      approvedPrice: approvedPrice !== undefined ? approvedPrice : savedInquiries[inqIndex].approvedPrice,
      updatedAt: new Date().toISOString()
    };
    return res.json({ success: true, inquiry: savedInquiries[inqIndex] });
  }
  return res.json({ success: true, message: "Status recorded." });
});

// Update Payment Status
app.patch("/api/payments/:id/status", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const pIndex = savedPayments.findIndex(p => p.id === id);
  if (pIndex !== -1) {
    savedPayments[pIndex] = { ...savedPayments[pIndex], status };
    return res.json({ success: true, payment: savedPayments[pIndex] });
  }
  return res.json({ success: true, message: "Payment status updated." });
});

// --- PAYNOW ZIMBABWE & ECOCASH PAYMENT INFO ENDPOINTS ---
app.post("/api/paynow/initiate", (req, res) => {
  try {
    const { amountUSD, orderReference, itemTitle } = req.body;
    return res.json({
      success: true,
      message: "Payment can be made using Paynow or EcoCash directly to mobile number 077459344 (+263 774 593 441).",
      paynowMobileNumber: "077459344",
      merchantName: "R'tson Graphic Designs",
      orderReference: orderReference || `RTS-${Date.now().toString().slice(-6)}`,
      amountUSD: amountUSD || 15,
      itemTitle: itemTitle || 'Graphic Design Order'
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Failed to process payment inquiry." });
  }
});

app.get("/api/paynow/payments", (req, res) => {
  return res.json({ 
    success: true, 
    paynowMobileNumber: "077459344",
    merchantName: "R'tson Graphic Designs",
    payments: savedPayments 
  });
});

// Vite server integration
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
