"use client";

import {
  useEffect,
  useRef,
  useState,
  useCallback,
  type RefObject,
} from "react";

// ─── useCountUp ─────────────────────────────────────────────────────────────
/**
 * Animate a number from 0 → target when the element enters the viewport.
 * Fires only once. Uses 60 discrete steps over `duration` ms.
 */
export function useCountUp(
  target: number,
  duration: number = 1800
): { ref: RefObject<HTMLDivElement | null>; count: number } {
  const ref = useRef<HTMLDivElement | null>(null);
  const [count, setCount] = useState(0);
  const done = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !done.current) {
          done.current = true;
          observer.disconnect();

          const totalSteps = 60;
          const stepTime = duration / totalSteps;
          let current = 0;

          const interval = setInterval(() => {
            current++;
            const progress = current / totalSteps;
            // ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(target * eased));

            if (current >= totalSteps) {
              setCount(target);
              clearInterval(interval);
            }
          }, stepTime);
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return { ref, count };
}

// ─── useKonamiCode ──────────────────────────────────────────────────────────
/**
 * Listens for the Konami Code: ↑↑↓↓←→←→BA
 * Calls `callback` when the full sequence is entered.
 */
const KONAMI_SEQUENCE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

export function useKonamiCode(callback: () => void): void {
  const index = useRef(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const expected = KONAMI_SEQUENCE[index.current];
      if (e.key.toLowerCase() === expected.toLowerCase()) {
        index.current++;
        if (index.current === KONAMI_SEQUENCE.length) {
          callback();
          index.current = 0;
        }
      } else {
        index.current = 0;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [callback]);
}

// ─── useScrollProgress ──────────────────────────────────────────────────────
/**
 * Returns a 0–1 value representing the current scroll position of the page.
 */
export function useScrollProgress(): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? scrollTop / docHeight : 0);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // initial value
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return progress;
}

// ─── useIsMobile ────────────────────────────────────────────────────────────
/**
 * Returns true if the viewport width is below 768px.
 * Updates on resize.
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const check = () => setIsMobile(window.innerWidth < 768);
    check(); // initial

    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return isMobile;
}

// ─── useInView ──────────────────────────────────────────────────────────────
/**
 * Returns { ref, inView } using IntersectionObserver.
 * Defaults to threshold 0.2.
 */
interface UseInViewOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export function useInView(
  options: UseInViewOptions = {}
): { ref: RefObject<HTMLDivElement | null>; inView: boolean } {
  const { threshold = 0.2, rootMargin = "0px", triggerOnce = true } = options;
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (triggerOnce) observer.unobserve(el);
        } else if (!triggerOnce) {
          setInView(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, triggerOnce]);

  return { ref, inView };
}

// ─── useDeviceMotion ────────────────────────────────────────────────────────
/**
 * Detects device shaking via DeviceMotionEvent.
 * Calls `callback` when acceleration exceeds `threshold` (default 15).
 * Debounces to avoid rapid re-fires (1 second cooldown).
 */
export function useDeviceMotion(
  callback: () => void,
  threshold: number = 15
): void {
  const lastShake = useRef(0);
  const stableCallback = useCallback(callback, [callback]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("DeviceMotionEvent" in window)) return;

    const handleMotion = (e: DeviceMotionEvent) => {
      const acc = e.accelerationIncludingGravity;
      if (!acc) return;

      const total = Math.sqrt(
        (acc.x ?? 0) ** 2 + (acc.y ?? 0) ** 2 + (acc.z ?? 0) ** 2
      );

      const now = Date.now();
      if (total > threshold && now - lastShake.current > 1000) {
        lastShake.current = now;
        stableCallback();
      }
    };

    window.addEventListener("devicemotion", handleMotion);
    return () => window.removeEventListener("devicemotion", handleMotion);
  }, [threshold, stableCallback]);
}

export { useLiveStats } from "./useLiveStats";
