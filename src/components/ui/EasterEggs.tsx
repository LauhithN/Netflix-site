"use client";

import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import confetti from "canvas-confetti";
import { useKonamiCode, useDeviceMotion, useIsMobile, useLiveStats } from "@/hooks";
import { EASTER_EGGS } from "@/data/content";

export default function EasterEggs() {
  const isMobile = useIsMobile();
  const [showKonamiModal, setShowKonamiModal] = useState(false);
  const [showShakeToast, setShowShakeToast] = useState(false);
  const { isBirthdayToday, hasMounted } = useLiveStats();
  const hasTriggeredBirthday = useRef(false);

  // ─── Automatic Birthday Confetti ──────────────────────────────────────────
  useEffect(() => {
    if (hasMounted && isBirthdayToday && !hasTriggeredBirthday.current) {
      hasTriggeredBirthday.current = true;
      
      const duration = 5000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ["#E50914", "#E91E8C", "#ffffff", "#F5C518"],
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ["#E50914", "#E91E8C", "#ffffff", "#F5C518"],
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      
      // Small delay so they actually see it after page load
      setTimeout(frame, 500);
    }
  }, [isBirthdayToday, hasMounted]);

  // ─── Konami Code ──────────────────────────────────────────────────────────
  useKonamiCode(() => {
    // Fire massive confetti
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#E50914", "#E91E8C", "#ffffff"],
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#E50914", "#E91E8C", "#ffffff"],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();

    // Show modal
    setShowKonamiModal(true);
  });

  // ─── Device Shake ─────────────────────────────────────────────────────────
  useDeviceMotion(() => {
    if (!isMobile) return;

    // Fire small heart explosion
    confetti({
      particleCount: 40,
      spread: 80,
      origin: { y: 0.6 },
      colors: ["#E91E8C", "#ffb6c1", "#ff69b4"],
      shapes: ["circle"],
      scalar: 1.2,
      zIndex: 9999,
    });

    // Show brief toast
    setShowShakeToast(true);
    setTimeout(() => setShowShakeToast(false), 4000);
  }, 18); // Sensitivity threshold

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
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="max-w-md rounded-lg border border-white/10 bg-surface p-8 text-center shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-netflix-red/20 text-4xl">
                🎮
              </div>
              <h2 className="mb-4 font-display text-2xl tracking-wide text-white">
                SECRET UNLOCKED
              </h2>
              <p className="mb-8 font-body text-white/80 leading-relaxed">
                {EASTER_EGGS.konamiMessage}
              </p>
              <button
                onClick={() => setShowKonamiModal(false)}
                className="rounded bg-netflix-red px-8 py-4 min-h-[44px] text-sm font-semibold tracking-wide text-white transition-colors hover:bg-red-700 w-full"
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
            className="pointer-events-none fixed bottom-12 left-1/2 z-[10000] -translate-x-1/2 w-[90vw] max-w-sm rounded-full border border-white/10 bg-surface/90 px-6 py-4 text-center shadow-2xl backdrop-blur-lg"
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
