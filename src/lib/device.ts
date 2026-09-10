/**
 * Client-side device helpers for phone, laptop, and smart TV.
 */

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Heuristic for smart TV / large living-room browsers. */
export function isSmartTV(): boolean {
  if (typeof window === "undefined") return false;

  const ua = navigator.userAgent || "";
  const tvUa =
    /SmartTV|Smart-TV|SMART-TV|TV Safari|Web0S|WebOS|Tizen|AppleTV|BRAVIA|Viera|NetCast|HbbTV|CrKey|AFT|FireTV|GoogleTV|Android TV|MiTV|Roku/i.test(
      ua
    );

  const largeScreen =
    window.matchMedia("(min-width: 1280px) and (min-height: 720px)").matches &&
    window.matchMedia("(pointer: coarse)").matches;

  return tvUa || largeScreen;
}

/** Phones / narrow viewports (includes iPhone 15 Pro Max landscape/portrait). */
export function isMobileViewport(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(max-width: 767px)").matches;
}

export function shouldSimplifyMotion(): boolean {
  return prefersReducedMotion() || isSmartTV();
}

/** Touch-first input with no hover state — phones, tablets, TV remotes. */
export function isCoarsePointer(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(hover: none), (pointer: coarse)").matches;
}
