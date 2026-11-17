# R'tson Graphic Designs & Creations Studio

A high-converting, professional Graphic Design Studio web application built with **React 19**, **Vite**, **Tailwind CSS**, and **Firebase Firestore**.

- **Official Website**: [https://rtsoncreations.co.zw](https://rtsoncreations.co.zw)
- **Vercel Deployment**: [https://rtson.vercel.app](https://rtson.vercel.app)
- **Repository**: [https://github.com/tkzbrighton-max/rtson](https://github.com/tkzbrighton-max/rtson)

---

## 🚀 Features

- **Dynamic Portfolio & Video Showcase**: Interactive responsive showcase supporting direct MP4 / WebM video playback and YouTube integration.
- **Client Design Brief AI Generator**: Integrated design brief estimation and art-direction guidance.
- **Firebase Firestore Live Synchronization**: Real-time sync for portfolio flyers, videos, client reviews, and inquiries.
- **Integrated Admin Portal**: Comprehensive management suite for live flyer uploads, pricing updates, and video reels.
- **Instant Vercel & Multi-Cloud Compatibility**: Configured with `vercel.json` for single-click deployment and automated SSL certificates.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide React, Motion
- **Database & Auth**: Firebase Firestore
- **Build Tool**: Vite
- **Deployment**: Vercel / Node.js

---

## 📦 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run in Development
```bash
npm run dev
```

### 3. Build for Production
```bash
npm run build
```

---

## 🌐 Custom Domain Setup on Vercel (`rtsoncreations.co.zw`)

To connect **`https://rtsoncreations.co.zw`** to your Vercel deployment (`rtson.vercel.app`):

1. **In Vercel Dashboard**:
   - Go to your project (`rtson`) → **Settings** → **Domains**.
   - Type **`rtsoncreations.co.zw`** and click **Add**.
   - Vercel will also suggest adding **`www.rtsoncreations.co.zw`** (select redirect to `rtsoncreations.co.zw`).

2. **At your Domain Registrar / DNS Provider** (where `rtsoncreations.co.zw` is registered):
   - **For Apex Domain (`rtsoncreations.co.zw`)**:
     - Type: `A`
     - Name: `@` (or leave blank)
     - Value: `76.76.21.21`
   - **For Subdomain (`www.rtsoncreations.co.zw`)**:
     - Type: `CNAME`
     - Name: `www`
     - Value: `cname.vercel-dns.com`

3. **Automatic SSL/TLS**:
   - Once DNS propagates (usually 5–30 minutes), Vercel automatically generates a free Let's Encrypt SSL certificate and activates `https://rtsoncreations.co.zw`.

