"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type confettiType from "canvas-confetti";
import { useKonamiCode, useDeviceMotion, useIsMobile, useLiveStats } from "@/hooks";
import { EASTER_EGGS } from "@/data/content";
import { prefersReducedMotion } from "@/lib/device";

type Confetti = typeof confettiType;

// This component lives in the root layout, so keep canvas-confetti off the critical path
let confettiLoader: Promise<Confetti> | null = null;
const loadConfetti = () => {
  if (!confettiLoader) {
    confettiLoader = import("canvas-confetti").then((m) => m.default);
  }
  return confettiLoader;
};

/** Two side cannons firing for `durationMs`. */
function sideCannons(confetti: Confetti, durationMs: number, colors: string[]) {
  const end = Date.now() + durationMs;
  const frame = () => {
    confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors });
    confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors });
    if (Date.now() < end) requestAnimationFrame(frame);
  };
  frame();
}

export default function EasterEggs() {
  const isMobile = useIsMobile();
  const [showKonamiModal, setShowKonamiModal] = useState(false);
  const [showShakeToast, setShowShakeToast] = useState(false);
  const { isBirthdayToday, hasMounted } = useLiveStats();
  const hasTriggeredBirthday = useRef(false);

  // ─── Automatic Birthday Confetti ──────────────────────────────────────────
  useEffect(() => {
    if (!hasMounted || !isBirthdayToday || hasTriggeredBirthday.current) return;
    hasTriggeredBirthday.current = true;
    if (prefersReducedMotion()) return;

    // Small delay so they actually see it after page load
    const timer = window.setTimeout(() => {
      void loadConfetti().then((confetti) =>
        sideCannons(confetti, 5000, ["#E50914", "#E91E8C", "#ffffff", "#F5C518"])
      );
    }, 500);
    return () => window.clearTimeout(timer);
  }, [isBirthdayToday, hasMounted]);

  // ─── Konami Code ──────────────────────────────────────────────────────────
  useKonamiCode(
    useCallback(() => {
      if (!prefersReducedMotion()) {
        void loadConfetti().then((confetti) =>
          sideCannons(confetti, 3000, ["#E50914", "#E91E8C", "#ffffff"])
        );
      }
      setShowKonamiModal(true);
    }, [])
  );

  // ─── Device Shake ─────────────────────────────────────────────────────────
  useDeviceMotion(
    useCallback(() => {
      if (!isMobile) return;

      if (!prefersReducedMotion()) {
        void loadConfetti().then((confetti) =>
          confetti({
            particleCount: 40,
            spread: 80,
            origin: { y: 0.6 },
            colors: ["#E91E8C", "#ffb6c1", "#ff69b4"],
            shapes: ["circle"],
            scalar: 1.2,
            zIndex: 9999,
          })
        );
      }

      setShowShakeToast(true);
      window.setTimeout(() => setShowShakeToast(false), 4000);
    }, [isMobile]),
    18 // Sensitivity threshold
  );

  return (
    <>
      {/* ── Konami Modal ── */}
      <AnimatePresence>
        {showKonamiModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] flex items-center justify-center bg-netflix-dark/95 p-6 backdrop-blur-md"
            onClick={() => setShowKonamiModal(false)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="konami-title"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="max-w-md rounded-lg border border-white/10 bg-surface p-8 text-center shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-netflix-red/20 text-4xl" aria-hidden="true">
                🎮
              </div>
              <h2 id="konami-title" className="mb-4 font-display text-2xl tracking-wide text-white">
                SECRET UNLOCKED
              </h2>
              <p className="mb-8 font-body leading-relaxed text-white/80">
                {EASTER_EGGS.konamiMessage}
              </p>
              <button
                type="button"
                onClick={() => setShowKonamiModal(false)}
                className="w-full rounded bg-netflix-red px-8 py-4 text-sm font-semibold tracking-wide text-white transition-colors hover:bg-red-700"
              >
                CLOSE
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Shake Toast ── */}
      <AnimatePresence>
        {showShakeToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            role="status"
            className="pointer-events-none fixed bottom-[calc(3rem+env(safe-area-inset-bottom))] left-1/2 z-[10000] w-[90vw] max-w-sm -translate-x-1/2 rounded-full border border-white/10 bg-surface/90 px-6 py-4 text-center shadow-2xl backdrop-blur-lg"
          >
            <p className="font-display text-sm tracking-wide text-white">
              {EASTER_EGGS.shakeMessage}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
