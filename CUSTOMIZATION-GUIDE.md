# 🎨 Customisation Guide

> Everything you need to personalise this template. No coding experience required.

---

## 📋 Table of Contents

1. [The Golden Rule](#the-golden-rule)
2. [The Four Files](#the-four-files)
3. [Step 1 — Basic Details](#step-1--basic-details)
4. [Step 2 — The Opening Intro](#step-2--the-opening-intro)
5. [Step 3 — Hero Section](#step-3--hero-section)
6. [Step 4 — Memory Cards (16 photos)](#step-4--memory-cards-16-photos)
7. [Step 5 — Timeline Milestones](#step-5--timeline-milestones)
8. [Step 6 — Love Letter](#step-6--love-letter)
9. [Step 7 — Love Stats](#step-7--love-stats)
10. [Step 8 — Video Section](#step-8--video-section)
11. [Step 9 — Credits](#step-9--credits)
12. [Step 10 — Music Playlist](#step-10--music-playlist)
13. [Step 11 — The Secret /for-you Page](#step-11--the-secret-for-you-page)
14. [Photos — How to Add Your Own](#photos--how-to-add-your-own)
15. [Hero Background Image Sizes](#hero-background-image-sizes)
16. [Logo Slot](#logo-slot)
17. [Colours and Fonts](#colours-and-fonts)
18. [Deploying Your Changes](#deploying-your-changes)
19. [Common Questions](#common-questions)

---

## The Golden Rule

**95% of everything you want to change lives in one file:**

```
src/data/content.ts
```

Open this file, change the values, save. The site updates instantly at `localhost:3000`.

You never need to touch any component file for content changes.

---

## The Four Files

| File | What It Controls |
|---|---|
| `src/data/content.ts` | Everything — names, dates, messages, photos, video, stats, credits |
| `src/data/playlist.ts` | Music — add any songs you want |
| `src/data/for-you.ts` | The secret /for-you page |
| `public/` folder | All media files (photos, videos, audio) |

---

## Step 1 — Basic Details

Open `src/data/content.ts`. Find and update:

```typescript
export const SITE_CONFIG = {
  herName:         "anushka",           // ← Her name / nickname
  yourName:        "virat",           // ← Your name
  birthdayDate:    "1999-03-17",      // ← Her birthday (YYYY-MM-DD format)
  anniversaryDate: "2022-06-14",      // ← Your anniversary (YYYY-MM-DD)
  firstMetDate:    "2021-09-03",      // ← When you first met (YYYY-MM-DD)
  siteTitle:       "virushka — A Love Story",
  heroTagline:     "Every frame of you is my favourite scene.",
  siteDescription: "A birthday surprise made with love.",
}
```

**Date format:** Always `YYYY-MM-DD`. Example: 24th November 2000 = `"2000-11-24"`

> Changing `herName` here automatically updates it everywhere on the site — the profile screen, hero section, navbar, love letter, birthday card, and credits.

---

## Step 2 — The Opening Intro

The opening screen shows a giant text scrolling slowly across a black background.

To change what it says, open `src/components/sections/IntroScreen.tsx`:

```tsx
// Find this line and change the text:
HAPPY BIRTHDAY

// Or to show a custom message:
I MADE THIS FOR YOU
```

**Timing adjustments** (in the same file):

```tsx
// How long the scroll takes (seconds)
transition={{ duration: 5.5, ease: "linear" }}

// When fade-out starts (milliseconds after load)
setTimeout(() => setPhase("fading"), 5200)

// When the profile picker appears
setTimeout(() => onComplete(), 6000)
```

- Scroll too fast? Increase `duration` from `5.5` to `7`
- Scroll too slow? Decrease to `4`
- Intro too long? Reduce `5200` to `4000` and `6000` to `4800`

---

## Step 3 — Hero Section

In `src/data/content.ts`:

```typescript
export const HERO = {
  backgroundImage:       "/images/hero-desktop.jpg",  // ← Desktop photo
  backgroundImageMobile: "/images/hero-mobile.jpg",   // ← Mobile photo
  title:                 SITE_CONFIG.herName,          // ← Auto-uses her name
  badge:                 "An Original Love Story",     // ← Badge text (or leave as logo)
  description:           "This is a world built just for you.",  // ← Your words
  ctaPrimary:   { label: "Watch Our Story", anchor: "#video"    },
  ctaSecondary: { label: "Our Memories",    anchor: "#memories" },
  stats: [
    { value: "847",  label: "Days Together"    },  // ← Auto-calculated, just change label
    { value: "∞",    label: "Times I Love You" },
    { value: "1",    label: "Person for Me"    },
  ],
}
```

### Hero Background Photo Sizes

See [Hero Background Image Sizes](#hero-background-image-sizes) section below.

---

## Step 4 — Memory Cards (16 photos)

There are 4 rows of 4 cards = 16 cards total. Each card has:
- `title` — the memory name
- `date` — when it happened
- `image` — Cloudinary public ID (see [Photos section](#photos--how-to-add-your-own))
- `message` — your personal memory (shown when card is clicked)
- `tag` — short label shown on the card

```typescript
export const MEMORY_ROWS = [
  {
    id: "beginnings",
    title: "How It All Began",     // ← Row heading
    subtitle: "The early days ✨", // ← Row subtitle
    cards: [
      {
        id:      "m1",
        title:   "The First Day",
        date:    "September 2021",
        image:   "birthday/m1",    // ← Cloudinary public ID
        message: "Your personal memory about this moment.",
        tag:     "Chapter One",
      },
      // ... 3 more cards
    ],
  },
  // ... 3 more rows (adventures, little-moments, favourites)
]
```

**The 4 rows are:**
1. `beginnings` — "How It All Began"
2. `adventures` — "Adventures Together"
3. `little-moments` — "The Little Moments"
4. `favourites` — "My Favourite You"

---

## Step 5 — Timeline Milestones

5 milestone entries. In `content.ts`:

```typescript
export const TIMELINE_EVENTS = [
  {
    id:          "t1",
    date:        "September 3, 2021",  // ← Real date as text
    title:       "The Day We Met",     // ← Title of the milestone
    description: "Two sentences about this moment. Make them specific and real.",
    emoji:       "✨",
    isSpecial:   false,  // ← true = glowing red dot, use for your most important dates
  },
  // ... 4 more entries
]
```

---

## Step 6 — Love Letter

The letter is shown on the main site. It reveals paragraph by paragraph as she scrolls.

```typescript
export const LOVE_LETTER = {
  salutation:  "My dearest anushka,",   // ← Opening line
  paragraphs: [
    "First paragraph — how did she make you feel seen?",
    "Second paragraph — what does she mean to your daily life?",
    "Third paragraph — what do you want her to know?",
    "Fourth paragraph — the closing thought",
  ],
  closing:    "All of my love, always,",
  signature:   SITE_CONFIG.yourName,
  postscript:  "P.S. — Click the ♥ five times. I left you something. 🔮",
}
```

---

## Step 7 — Love Stats

6 numbers that count up when scrolled into view:

```typescript
export const LOVE_STATS = [
  { value: 847,  suffix: "",   label: "Days Together",   emoji: "📅" },
  { value: 12,   suffix: "+",  label: "Cities Explored", emoji: "🗺️" },
  { value: 1247, suffix: "",   label: "Photos of Us",    emoji: "📸" },
  { value: 3,    suffix: "",   label: "Trips Taken",     emoji: "✈️" },
  { value: 99,   suffix: "%",  label: "My Heart, Taken", emoji: "💖" },
  { value: 1,    suffix: "",   label: "Person for Me",   emoji: "🌟" },
]
```

> **Days Together** is auto-calculated from `firstMetDate`. You don't need to update that number manually — it changes every day.

---

## Step 8 — Video Section

```typescript
export const VIDEO_SECTION = {
  videoUrl:    "/videos/our-story.mp4",     // ← Local file OR Cloudinary URL OR YouTube URL
  posterImage: "/images/video-poster.jpg",  // ← Thumbnail shown before play
  title:       "Our Movie",
  subtitle:    "Every love story deserves its own film.",
  duration:    "3:24",       // ← Display text, not calculated
  year:        "2021 — Present",
  badge:       "Now Playing",
}
```

**Three video options:**

**Option A — Local file** (under 50MB):
Put the file in `public/videos/our-story.mp4`

**Option B — Cloudinary** (any size):
Upload at cloudinary.com → copy the full video URL → paste as `videoUrl`

**Option C — YouTube** (unlisted):
Upload to YouTube → set Unlisted → copy full URL → paste as `videoUrl`

---

## Step 9 — Credits

```typescript
export const CREDITS = {
  title: "A Love Story",
  year:  "2021 — ∞",
  roles: [
    { role: "The Love of My Life",   name: "anushka"             },
    { role: "The Luckiest Person",   name: "virat"         },
    { role: "Best Supporting Role",  name: "Her Best Friend"   },  // ← Real name
    { role: "Comedy Relief",         name: "Another Friend"    },  // ← Real name
    { role: "Executive Producer",    name: "The Universe"      },
    { role: "Made with",             name: "An Embarrassing Amount of Love" },
  ],
  finalMessage: "Happy Birthday, Kittu.\nThis was always going to be your story. 💖",
}
```

---

## Step 10 — Music Playlist

**How to add a song:**

1. Copy your MP3 file into `public/audio/playlist/`
2. Open `src/data/playlist.ts`
3. Add an entry:

```typescript
export const PLAYLIST: Track[] = [
  {
    id:     "track-1",
    title:  "Song Name",
    artist: "Artist Name",
    file:   "/audio/playlist/your-song.mp3",  // ← must match filename
    emoji:  "💖",
  },
  // Add more songs the same way
]
```

**Player settings:**

```typescript
export const PLAYLIST_CONFIG = {
  defaultVolume: 0.25,    // 0 to 1 — 0.25 = 25% volume
  autoAdvance:   true,    // play next song automatically
  shuffle:       false,   // start shuffled?
}
```

**Voice note** (optional):
Record a 15–30 second voice message on your phone saying happy birthday.
Save as `voice-note.mp3` and drop it into `public/audio/voice-note.mp3`.
It appears as a play button in the Love Letter section.

---

## Step 11 — The Secret /for-you Page

The `/for-you` page is not linked anywhere obviously. It is discoverable only via the faint hint at the bottom of the Credits section.

All content is in `src/data/for-you.ts`:

### 50 Reasons

```typescript
export const FOR_YOU_CONTENT = {
  reasons: [
    "The way you laugh so hard you start crying and then apologise for crying while still laughing",
    "How you always check if I ate",
    // ... keep going to 50
  ],
```

> **Tip:** The more specific the reason, the more powerful it lands. "Your laugh" is generic. "The way your laugh turns silent when something is really funny" is specific and devastating.

### The Deep Private Letter

```typescript
  deepLetter: {
    salutation: "My dearest Kittu,",
    paragraphs: [
      "Paragraph 1 — Who were you before you met her?",
      "Paragraph 2 — What specific moment made you realise she changed you?",
      "Paragraph 3 — Something she does that she doesn't know you've noticed",
      "Paragraph 4 — What does your future with her look like in your mind?",
      "Paragraph 5 — Why she is safe with you",
    ],
    closing: "Yours. Completely. Always.",
  },
```

### Inside Jokes

```typescript
  // Short references only — no explanation needed. She will understand.
export const INSIDE_JOKES = [
  "The Tuesday that wasn't a Tuesday.",
  "What you said at 2am.",
  "The blue jacket.",
  // up to 15
]
```

### Private Gallery (9 photos)

```typescript
  privatePhotos: [
    { id: "birthday/secret-01" },  // ← Cloudinary public IDs
    { id: "birthday/secret-02" },
    // ... up to 9
  ],
```

---

## Photos — How to Add Your Own

All photos are hosted on **Cloudinary** (free). The site uses Cloudinary's CDN to serve optimised, fast-loading images.

### Step-by-step:

1. Go to [cloudinary.com](https://cloudinary.com) → sign in → **Media Library**
2. Click **Upload** → drag your photo in
3. After upload, hover the image → click the **copy icon** → copy the **Public ID**
   (It looks like: `birthday/my-photo-name`)
4. Open `src/data/content.ts` → find the correct `image:` field → paste the public ID
5. Save → the photo updates at `localhost:3000`

### Photo slots summary:

| Slot | Field in content.ts | Count |
|---|---|---|
| Hero desktop | `HERO.backgroundImage` | 1 |
| Hero mobile | `HERO.backgroundImageMobile` | 1 |
| Memory cards — Row 1 | `MEMORY_ROWS[0].cards[0-3].image` | 4 |
| Memory cards — Row 2 | `MEMORY_ROWS[1].cards[0-3].image` | 4 |
| Memory cards — Row 3 | `MEMORY_ROWS[2].cards[0-3].image` | 4 |
| Memory cards — Row 4 | `MEMORY_ROWS[3].cards[0-3].image` | 4 |
| Video poster | `VIDEO_SECTION.posterImage` | 1 |
| Secret gallery | `FOR_YOU_CONTENT.privatePhotos` | 9 |
| **Total** | | **28 photos** |

---

## Hero Background Image Sizes

Use different images for desktop and mobile for the best visual result.

### Desktop

| Property | Value |
|---|---|
| Width | 1920 px |
| Height | 1080 px |
| Ratio | 16:9 (landscape) |
| Format | JPG |
| Max file size | Under 3MB |
| Filename | `hero-desktop.jpg` |
| Subject position | Right side of frame — left 40% goes dark for text |

### Mobile

| Property | Value |
|---|---|
| Width | 750 px |
| Height | 1334 px |
| Ratio | 9:16 (portrait) |
| Format | JPG |
| Max file size | Under 2MB |
| Filename | `hero-mobile.jpg` |
| Subject position | Top 60% of frame — bottom half goes dark for text |

> **Tip:** Use Canva or any photo editor to crop/resize. Or just upload to Cloudinary and let it handle optimisation automatically.

**File placement:** Both files go in `public/images/`

---

## Logo Slot

You can place a custom PNG logo above the hero title text (optional).

1. Create/export your logo as a transparent PNG
2. Name it `hero-logo.png`
3. Drop into `public/images/hero-logo.png`

The logo appears automatically. If the file doesn't exist, the slot is invisible — no broken image icon.

**Best specs:**
- Format: PNG with transparent background
- Height: ~100–150px
- Light/white coloured logo (shows on dark background)

---

## Colours and Fonts

### Change the red accent colour

Open `src/styles/globals.css`:

```css
:root {
  --netflix-red: #E50914;  /* Main accent — buttons, highlights, stats */
  --rose-glow:   #E91E8C;  /* Secondary — birthday card, pink accents */
  --gold-warm:   #F5C518;  /* Tertiary — gold stats */
}
```

Change any hex code to your preferred colour.

### Change fonts

Open `src/app/layout.tsx`. The three fonts are:

```typescript
// Display font — headings, hero name, opening title
const bebasNeue = Bebas_Neue({ weight: "400", subsets: ["latin"] })

// Body font — descriptions, UI labels
const inter = Inter({ subsets: ["latin"] })

// Serif font — love letter, emotional text
const playfairDisplay = Playfair_Display({ subsets: ["latin"] })
```

Replace any of these with any font from [Google Fonts](https://fonts.google.com/).

---

## Deploying Your Changes

After editing content, push to GitHub to update the live site:

```bash
# 1. Check for errors
npm run build

# 2. If build passes, push to GitHub
git add .
git commit -m "updated personal content"
git push origin main
```

Vercel picks up the push and auto-deploys in ~2 minutes. No action needed on the Vercel dashboard.

> **Keep your repo private.** It is a surprise — she should not find it before you share the link.

---

## Common Questions

**Q: Can I add more than 4 memory cards per row?**
A: Yes. Add more objects to the `cards` array in any row. The row scrolls horizontally so any number works.

**Q: Can I add more than 5 timeline entries?**
A: Yes. Add more objects to `TIMELINE_EVENTS`. The SVG line and animations adjust automatically.

**Q: Can I remove a section I don't want?**
A: Yes. Open `src/app/page.tsx` and comment out or delete the section component you want to remove (e.g., `<Timeline />` or `<VideoSection />`).

**Q: How do I change what the Konami code secret says?**
A: In `src/data/content.ts`, find: `konamiMessage: "..."` and change the text.

**Q: How do I turn off the floating petals?**
A: In `src/app/page.tsx`, change `showPetals` to always be `false`, or delete `<FloatingPetals />`.

**Q: My photo isn't showing — it shows a broken image or grey box.**
A: Check that the Cloudinary public ID is correct (no https://, just the ID like `birthday/photo-name`). Also verify your `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` environment variable is set correctly.

**Q: The video isn't playing on iPhone.**
A: Make sure the `<video>` element has `playsInline` attribute. This is already included in the template — if you changed the video URL, verify the URL points to an MP4 file, not a streaming service.

**Q: How do I share the site?**
A: After Vercel deploy, your URL looks like `your-site.vercel.app` or your custom domain. Share it with the message: *"Open this when you're alone. Headphones. 🎧"*
