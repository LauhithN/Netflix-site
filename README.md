# 🎬 Netflix Birthday — Personalised Website Template

> A cinematic, emotional, and fully interactive birthday surprise website inspired by Netflix. Built with Next.js 14, Framer Motion, GSAP, and Tailwind CSS. Deploy in minutes. Personalise in hours.

![License](https://img.shields.io/badge/license-Custom%20Template%20License-red)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-06B6D4)

---

## ✨ What This Is

A complete, production-ready website template you can use to create a personalised birthday surprise for someone you love. It looks and feels like Netflix — cinematic intro, profile picker, memory gallery, love letter, secret pages — all wrapped in a dark, emotional, premium design.

**You do not need to know how to code.** Every piece of text, every photo, every video, every song is controlled from a single config file. Change the values, deploy, and share the link.

---

## 🎯 Features

- **Cinematic Intro** — Full-screen name scrolling animation on black background
- **Netflix Profile Picker** — "Who's Watching?" with confetti on selection
- **Hero Section** — Fullscreen cinematic photo with gradient overlay (desktop + mobile)
- **Memory Gallery** — 4 rows of photo cards with clickable lightbox and swipe
- **Love Stats** — Animated counting numbers (days together, trips, etc.)
- **Interactive Timeline** — Relationship milestones with scroll-triggered SVG line draw
- **Video Section** — Custom cinematic player with progress bar and autoplay
- **Love Letter** — Word-by-word animated reveal with voice note player
- **Birthday Finale** — Confetti explosion and celebration section
- **Rolling Credits** — Movie-style end credits with custom roles
- **Secret /for-you Page** — Hidden page with 50 reasons, deep letter, private gallery, inside jokes
- **Ambient Music Player** — Custom playlist, skip/shuffle, volume control
- **Easter Eggs** — Konami code secret, phone shake surprise, cursor sparkles
- **Birthday Awareness** — Auto-detects her birthday, triggers special mode
- **Mobile Perfect** — Fully responsive, tested on iPhone Safari

---

## 🗂️ Project Structure

```
birthday-site/
├── public/
│   ├── images/
│   │   ├── hero-desktop.jpg      ← Your desktop hero photo
│   │   ├── hero-mobile.jpg       ← Your mobile hero photo
│   │   ├── hero-logo.png         ← Your custom logo (optional)
│   │   └── video-poster.jpg      ← Video section thumbnail
│   ├── videos/
│   │   └── our-story.mp4         ← Your video (optional)
│   └── audio/
│       ├── playlist/             ← Drop your MP3s here
│       │   └── .gitkeep
│       └── voice-note.mp3        ← Your recorded message (optional)
│
├── src/
│   ├── data/
│   │   ├── content.ts            ← ⭐ MAIN CONFIG — edit everything here
│   │   ├── playlist.ts           ← Music playlist config
│   │   └── for-you.ts            ← Secret /for-you page content
│   │
│   ├── components/
│   │   ├── sections/             ← Page sections (hero, gallery, timeline, etc.)
│   │   ├── layout/               ← Navbar, page transitions
│   │   └── ui/                   ← Reusable components
│   │
│   ├── lib/
│   │   ├── cloudinary.ts         ← Image CDN helpers
│   │   ├── animations.ts         ← Framer Motion variants
│   │   ├── utils.ts              ← Utility functions
│   │   └── birthday.ts           ← Birthday detection logic
│   │
│   ├── hooks/
│   │   └── index.ts              ← Custom React hooks
│   │
│   └── app/
│       ├── page.tsx              ← Main site entry point
│       ├── layout.tsx            ← Root layout + fonts + metadata
│       ├── for-you/
│       │   └── page.tsx          ← Secret page
│       └── opengraph-image.tsx   ← Auto-generated OG image
│
├── README.md                     ← This file
├── CUSTOMIZATION-GUIDE.md        ← How to personalise everything
├── LICENSE                       ← Usage terms
└── DEPLOY_CHECKLIST.md           ← Pre-launch checklist
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18 or higher
- npm or yarn
- A free [Cloudinary](https://cloudinary.com) account (for photo hosting)
- A [Vercel](https://vercel.com) account (for deployment)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/netflix-birthday-site.git
cd netflix-birthday-site
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your site.

### 5. Personalise

Open `src/data/content.ts` and replace all placeholder values with your real content. See [CUSTOMIZATION-GUIDE.md](./CUSTOMIZATION-GUIDE.md) for detailed instructions.

### 6. Deploy

```bash
# Build and verify
npm run build

# Push to GitHub (triggers auto-deploy on Vercel)
git add .
git commit -m "personalised content"
git push origin main
```

---

## ⚙️ Tech Stack

| Technology | Purpose |
|---|---|
| Next.js 14 (App Router) | Framework, routing, image optimisation |
| TypeScript | Type safety |
| Tailwind CSS v3 | Styling |
| Framer Motion | Component animations, page transitions |
| GSAP + ScrollTrigger | Scroll-driven animations, parallax |
| Howler.js | Audio playback |
| canvas-confetti | Celebration effects |
| Cloudinary | Image and video CDN |
| Day.js | Date calculations |
| Vercel | Deployment and hosting |

---

## 📋 Personalisation Overview

Everything is controlled from **three data files**:

| File | Controls |
|---|---|
| `src/data/content.ts` | Names, dates, all text, photos, video, stats, credits |
| `src/data/playlist.ts` | Music playlist — add any MP3 files |
| `src/data/for-you.ts` | Secret page — 50 reasons, private letter, inside jokes |

> See **[CUSTOMIZATION-GUIDE.md](./CUSTOMIZATION-GUIDE.md)** for the complete step-by-step guide.

---

## 📸 Adding Photos

Photos are hosted on Cloudinary (free tier). Upload your photo → copy the Public ID → paste into `content.ts`. The site auto-fetches optimised, responsive versions.

See the [Photo section in CUSTOMIZATION-GUIDE.md](./CUSTOMIZATION-GUIDE.md#photos).

---

## 🎵 Adding Music

1. Drop MP3 files into `public/audio/playlist/`
2. Add one entry per song to `src/data/playlist.ts`
3. Done — the player picks them up automatically

---

## 🔐 The Secret Page

The `/for-you` route is a hidden page not linked from the main navigation. It contains a private photo gallery, 50 reasons, a deep personal letter, and inside jokes. It is discoverable only via a barely-visible hint in the Credits section.

---

## 🌐 Deployment

The easiest way to deploy is [Vercel](https://vercel.com):

1. Push your project to a **private** GitHub repository
2. Go to [vercel.com](https://vercel.com) → New Project → Import from GitHub
3. Add environment variable: `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
4. Click Deploy
5. Done — the site is live in ~2 minutes

> **Important:** Keep your repository **private**. This is a surprise gift — she should not find the code.

---

## 📄 License

This project is licensed under the **Netflix Birthday Template License**.

- ✅ You may use this template to create personalised websites
- ✅ You may modify the content and design for personal use
- ✅ You may deploy your personalised version publicly
- ❌ You may NOT claim this template as your own original work
- ❌ You may NOT redistribute or resell this template
- ❌ You may NOT remove the license or attribution

See [LICENSE](./LICENSE) for full terms.

---

## 💙 Credits

Template designed and developed with love.
Built to make someone feel like the most special person in the world.

---

*Made with ❤️ — because some people deserve a whole cinematic universe.*
