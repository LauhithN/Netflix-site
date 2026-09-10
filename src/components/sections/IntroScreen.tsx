"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { SITE_CONFIG } from "@/data/content";
import { useCoarsePointer } from "@/hooks";

interface IntroScreenProps {
  onComplete: () => void;
}

export default function IntroScreen({ onComplete }: IntroScreenProps) {
  const [isZooming, setIsZooming] = useState(false);
  const coarse = useCoarsePointer();

  const handleClick = () => {
    if (isZooming) return;
    setIsZooming(true);

    try {
      const audio = new Audio(SITE_CONFIG.introSoundUrl);
      audio.play().catch(() => {});
    } catch {
      // ignore
    }

    setTimeout(() => {
      onComplete();
    }, 1200);
  };

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex cursor-pointer flex-col items-center justify-center overflow-hidden bg-black px-safe pb-safe pt-safe"
      onClick={handleClick}
      animate={{ opacity: isZooming ? 0 : 1 }}
      transition={{ duration: 0.4, delay: 0.8 }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") handleClick();
      }}
      aria-label="Enter"
    >
      <motion.div
        animate={
          isZooming ? { scale: 30, opacity: 0 } : { scale: 1, opacity: 1 }
        }
        transition={{
          duration: isZooming ? 1.2 : 2,
          ease: isZooming ? "easeIn" : "easeOut",
        }}
        initial={{ scale: 0.8, opacity: 0 }}
        className="relative flex flex-col items-center justify-center gap-3 px-6 text-center"
      >
        <p className="font-body text-xs uppercase tracking-[0.4em] text-netflix-red md:text-sm">
          A birthday original
        </p>
        <h1 className="font-display text-5xl tracking-[0.12em] text-white drop-shadow-[0_0_24px_rgba(229,9,20,0.55)] md:text-7xl lg:text-8xl">
          {SITE_CONFIG.herName.toUpperCase()}
        </h1>
        <p className="font-serif text-sm italic text-white/65 md:text-base">
          {SITE_CONFIG.heroTagline}
        </p>
      </motion.div>

      {!isZooming && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-[max(4rem,calc(3rem+env(safe-area-inset-bottom)))] text-center font-body text-xs uppercase tracking-widest text-white/60 md:text-sm"
        >
          {coarse ? "Tap to enter" : "Click to enter"}
        </motion.p>
      )}
    </motion.div>
  );
}
