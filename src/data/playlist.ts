/**
 * playlist.ts — Ambient music for the site.
 * Replace Cloudinary URLs with your own MP3s in public/audio/playlist/ if preferred.
 */

export interface Track {
  id: string;
  title: string;
  artist: string;
  file: string;
  emoji?: string;
}

export const PLAYLIST: Track[] = [
  {
    id: "track-1",
    title: "Our Song Placeholder 1",
    artist: "Replace Me",
    file: "https://res.cloudinary.com/dadpljanb/video/upload/v1774275874/track-01_mialtt.mp3",
    emoji: "💖",
  },
  {
    id: "track-2",
    title: "Our Song Placeholder 2",
    artist: "Replace Me",
    file: "https://res.cloudinary.com/dadpljanb/video/upload/v1774275861/track-02_ulws6k.mp3",
    emoji: "💕",
  },
  {
    id: "track-3",
    title: "Our Song Placeholder 3",
    artist: "Replace Me",
    file: "https://res.cloudinary.com/dadpljanb/video/upload/v1774275862/track-03_blanab.mp3",
    emoji: "🥰",
  },
];

export const PLAYLIST_CONFIG = {
  defaultVolume: 0.25,
  autoAdvance: true,
  shuffle: false,
};
