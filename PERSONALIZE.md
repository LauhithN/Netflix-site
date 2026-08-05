# Personalize this birthday site

Edit these before the surprise night:

## 1. Names & dates — `src/data/content.ts`

```ts
herName: "Her",          // ← change
yourName: "Lauhith",     // ← change if needed
birthdayDate: "2000-01-01", // YYYY-MM-DD
```

Also update timeline text, love letter paragraphs, and profile labels in the same file.

## 2. Photos

Replace Cloudinary URLs in:
- `PROFILES[].image`
- `HERO.backgroundImage*`
- `MEMORY_ROWS` card `image` fields
- `src/data/for-you.ts` → `SECRET_GALLERY`

Or upload to your own Cloudinary and paste full HTTPS URLs (already supported).

Set `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` in Vercel if you switch to public-ID style helpers.

## 3. Birthday video

Replace:

```
public/videos/our-story.mp4
public/images/video-poster.jpg
```

Use H.264 + AAC, 16:9, ~1 minute (your CapCut export).

## 4. Music — `src/data/playlist.ts`

Swap track URLs for songs that matter to you (or drop MP3s in `public/audio/playlist/`).

## 5. Secret page — `src/data/for-you.ts`

Edit the 50 reasons and private letter.
