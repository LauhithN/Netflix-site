/**
 * content.ts — Single source of truth for ALL personal content.
 *
 * TODO: Replace HER_NAME / YOUR_NAME / dates / photos with your real ones.
 * See PERSONALIZE.md in the project root.
 */

// ─── Site Configuration ─────────────────────────────────────────────────────
export const SITE_CONFIG = {
  herName: "Her",
  yourName: "Lauhith",
  birthdayDate: "2002-08-09",
  anniversaryDate: "2024-01-01",
  firstMetDate: "2023-01-01",

  siteTitle: "Her — A Love Story",
  heroTagline: "Every frame of you is my favourite scene.",
  siteDescription: "A birthday surprise made just for you.",
  siteURL: "https://netflix-birthday-site.vercel.app",
  ogImage: "/images/video-poster.jpg",
  introSoundUrl: "/audio/intro-sound.mp3",
};

/** Profile-select “Now Streaming” badge */
export const PROFILE_STREAMING_BADGE = {
  headline: "Now Streaming · 24 seasons of her",
  subline: "8766 episodes and counting",
};

// ─── Profile Selection (Who's Watching) ─────────────────────────────────────
export const PROFILES = [
  {
    id: "her",
    name: SITE_CONFIG.herName,
    emoji: "💖",
    image: "/images/profiles/her.jpg",
    color: "#E91E8C",
    hint: "This one is for you",
    isMain: true,
  },
  {
    id: "us",
    name: "Us",
    emoji: "💑",
    image: "/images/profiles/us.jpg",
    color: "#E50914",
    hint: "Our story",
    isMain: false,
  },
];

// ─── Hero Banner ────────────────────────────────────────────────────────────
export const HERO = {
  backgroundImageMobile: "/images/hero/main.jpg",
  backgroundImageDesktop: "/images/hero/main.jpg",
  collage: [
    "/images/hero/collage-1.jpg",
    "/images/hero/collage-2.jpg",
    "/images/hero/collage-3.jpg",
  ],
  title: SITE_CONFIG.herName,
  description: "This is a world built just for you.",
  ctaPrimary: { label: "Watch Our Story", anchor: "#video" },
  ctaSecondary: { label: "Our Memories", anchor: "#memories" },
  stats: [
    { value: "LIVE", label: "Days Together" },
    { value: "∞", label: "Times I love you" },
    { value: "1", label: "Person for me" },
  ],
};

// ─── Memory Gallery Rows ────────────────────────────────────────────────────
export const MEMORY_ROWS = [
  {
    id: "top-picks",
    title: "Top Picks for Her",
    subtitle: "The ones that still stop me mid-scroll",
    cards: [
      {
        id: "pick-1",
        title: "Favourite Smile",
        date: "Always",
        image: "/images/profiles/favourite-smile.jpg",
        message: "This smile. This exact one. I replay it more than any movie.",
        tag: "Top Pick",
      },
      {
        id: "pick-2",
        title: "Soft Light",
        date: "Golden hour",
        image: "/images/profiles/soft-light.jpg",
        message: "You make ordinary light look cinematic.",
        tag: "Glow",
      },
      {
        id: "pick-3",
        title: "That Look",
        date: "Unfiltered",
        image:
          "https://res.cloudinary.com/dadpljanb/image/upload/v1774541584/54446_guqhlh.jpg",
        message: "The look that makes the whole room quieter.",
        tag: "Favourite",
      },
      {
        id: "pick-4",
        title: "Main Character",
        date: "Every day",
        image:
          "https://res.cloudinary.com/dadpljanb/image/upload/v1774541584/54466_usqdbv.jpg",
        message: "If this were Netflix, you'd be the featured title.",
        tag: "Featured",
      },
    ],
  },
  {
    id: "memories",
    title: "Memories",
    subtitle: "Little scenes from our life together",
    cards: [
      {
        id: "mem-1",
        title: "Quiet Joy",
        date: "A regular Tuesday",
        image:
          "https://res.cloudinary.com/dadpljanb/image/upload/v1774541583/54454_yszfba.jpg",
        message: "Nothing special on paper. Everything special in person.",
        tag: "Memory",
      },
      {
        id: "mem-2",
        title: "Details",
        date: "Close up",
        image:
          "https://res.cloudinary.com/dadpljanb/image/upload/v1774541584/54449_sdp77a.jpg",
        message: "I notice you in the small things first.",
        tag: "Detail",
      },
      {
        id: "mem-3",
        title: "Wallpaper",
        date: "Saved forever",
        image:
          "https://res.cloudinary.com/dadpljanb/image/upload/v1774541584/54455_tei2lm.jpg",
        message: "This one lives on my lock screen and in my head.",
        tag: "Keep",
      },
      {
        id: "mem-4",
        title: "Soft Night",
        date: "After dark",
        image:
          "https://res.cloudinary.com/dadpljanb/image/upload/v1774541585/54467_uhifn8.jpg",
        message: "Evenings with you feel like the credits never need to roll.",
        tag: "Night",
      },
    ],
  },
  {
    id: "trips",
    title: "Trips",
    subtitle: "Places we went — and places we still will",
    cards: [
      {
        id: "trip-1",
        title: "First Adventure",
        date: "Out there",
        image: "/images/profiles/adventure.jpg",
        message: "Wherever we go, you make it feel like home.",
        tag: "Trip",
      },
      {
        id: "trip-2",
        title: "City Lights",
        date: "Night walk",
        image: "/images/profiles/city-lights.jpg",
        message: "Crowded streets, just us in the middle of them.",
        tag: "City",
      },
      {
        id: "trip-3",
        title: "Road Mode",
        date: "On the way",
        image: "/images/profiles/road-mode.jpg",
        message: "Playlists, windows down, your laugh louder than the engine.",
        tag: "Drive",
      },
      {
        id: "trip-4",
        title: "Next Destination",
        date: "Soon",
        image: "/images/profiles/next-destination.jpg",
        message: "Still writing the itinerary — starring you.",
        tag: "Soon",
      },
    ],
  },
  {
    id: "us",
    title: "Us",
    subtitle: "Our own little universe",
    cards: [
      {
        id: "us-1",
        title: "Together",
        date: "Best set",
        image:
          "https://res.cloudinary.com/dadpljanb/image/upload/v1774541586/54447_pvunsi.jpg",
        message: "Matching energy. Matching chaos. Matching hearts.",
        tag: "Us",
      },
      {
        id: "us-2",
        title: "Happy Time",
        date: "Captured",
        image:
          "https://res.cloudinary.com/dadpljanb/image/upload/v1774541586/54451_ffgbza.jpg",
        message: "Proof that the best scenes are unrehearsed.",
        tag: "Joy",
      },
      {
        id: "us-3",
        title: "Side by Side",
        date: "Always",
        image:
          "https://res.cloudinary.com/dadpljanb/image/upload/v1774541586/54462_smfvao.jpg",
        message: "My favourite co-star in every timeline.",
        tag: "Pair",
      },
      {
        id: "us-4",
        title: "Only You",
        date: "End scene",
        image:
          "https://res.cloudinary.com/dadpljanb/image/upload/v1774541586/54453_yilznv.jpg",
        message: "Every version of you — I choose them all.",
        tag: "Forever",
      },
    ],
  },
];

// ─── Timeline Events ────────────────────────────────────────────────────────
export const TIMELINE_EVENTS = [
  {
    id: "tl-1",
    date: "Chapter One",
    title: "The Day We Met",
    description:
      "I didn't know it yet, but that day split my life into before you and after you.",
    emoji: "💫",
    isSpecial: false,
  },
  {
    id: "tl-2",
    date: "Early Days",
    title: "Learning Your World",
    description:
      "Little texts. Longer talks. Suddenly ordinary days had a favourite person.",
    emoji: "✨",
    isSpecial: false,
  },
  {
    id: "tl-3",
    date: "Somewhere Along the Way",
    title: "I Fell Harder",
    description:
      "Not all at once — in a hundred quiet moments that added up to forever.",
    emoji: "💘",
    isSpecial: false,
  },
  {
    id: "tl-4",
    date: "This Year",
    title: "Building Us",
    description:
      "Trips, inside jokes, hard days, soft nights — and choosing each other again.",
    emoji: "🗺️",
    isSpecial: false,
  },
  {
    id: "tl-5",
    date: "Today",
    title: `Today — ${SITE_CONFIG.herName}'s Birthday`,
    description: `Happy Birthday, ${SITE_CONFIG.herName}. Today the world celebrates the best thing that ever happened to me.`,
    emoji: "🎂",
    isSpecial: true,
  },
];

// ─── Video Section ──────────────────────────────────────────────────────────
export const VIDEO_SECTION = {
  title: "Our Story in Motion",
  subtitle: `A love letter to ${SITE_CONFIG.herName}, frame by frame.`,
  videoUrl: "/videos/our-story.mp4",
  posterImage: "/images/video-poster.jpg",
  duration: "1:00",
  year: "Now Playing",
  badge: "Birthday Original",
};

// ─── Love Letter ────────────────────────────────────────────────────────────
export const LOVE_LETTER = {
  salutation: `My dearest ${SITE_CONFIG.herName},`,
  paragraphs: [
    `Before you, love felt like something other people got to describe. Then you showed up and every song, every soft scene, every late-night thought suddenly had a face — yours.`,
    `I love the way you laugh when you think nobody is watching, the way you care for people without keeping score, and the way you make an ordinary Tuesday feel like an event worth dressing up for.`,
    `There are a thousand versions of the future I've imagined, and you are in every single one — not as a cameo, not as a footnote, but as the whole story.`,
    `So today, on your birthday, this isn't just a website. It's a promise: more mornings with your name first on my mind, more evenings with your hand in mine, and more days making sure you never forget how loved you are.`,
  ],
  closing: "All of my love, always,",
  signature: SITE_CONFIG.yourName,
  postscript: "P.S. — Click the ♥ five times. I left you something. 🔮",
};

// ─── Love Stats ─────────────────────────────────────────────────────────────
export const LOVE_STATS = [
  { value: 365, suffix: "+", label: "Days Together", emoji: "🗓️" },
  { value: 100, suffix: "+", label: "Memories Shared", emoji: "🌍" },
  { value: 200, suffix: "+", label: "Photos of Us", emoji: "📸" },
  { value: 12, suffix: "", label: "Adventures", emoji: "✈️" },
  { value: 100, suffix: "%", label: "Heart Taken", emoji: "💘" },
  { value: 1, suffix: "", label: "Person for Me", emoji: "👑" },
];

// ─── Credits ────────────────────────────────────────────────────────────────
export const CREDITS = {
  title: "A Perfect Story",
  year: "Then — ∞",
  roles: [
    { role: "Lead Actress & Star of My Life", name: SITE_CONFIG.herName },
    { role: "Director & Hopelessly in Love", name: SITE_CONFIG.yourName },
    { role: "Screenplay", name: "Late Night Conversations" },
    { role: "Cinematography", name: "Stolen Glances & Candid Photos" },
    { role: "Original Soundtrack", name: "Our Playlist on Loop" },
    { role: "Special Effects", name: "Butterflies, Every Single Day" },
  ],
  finalMessage: `${SITE_CONFIG.herName}, you are not just a story — you are my whole book 💖`,
};

// ─── Floating Petals Config ─────────────────────────────────────────────────
export const PETAL_CONFIG = {
  emojis: ["🌸", "✨", "💕", "🌺", "💫"],
  count: 15,
  minSize: 12,
  maxSize: 22,
  minDuration: 4,
  maxDuration: 8,
};

// ─── Easter Eggs ────────────────────────────────────────────────────────────
export const EASTER_EGGS = {
  konamiMessage:
    "You found the secret! A perfect combination for a perfect person. 💖",
  shakeMessage: "You shook the world! Just like you shook mine. ✨",
};
