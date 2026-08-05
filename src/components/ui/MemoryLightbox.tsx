"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback, useRef } from "react";
import { CloudinaryImage } from "@/components/ui/CloudinaryImage";
import { X, ChevronLeft, ChevronRight, MessageSquare, Calendar, Tag } from "lucide-react";

interface MemoryLightboxProps {
  cards: Array<{
    id: string;
    title: string;
    date: string;
    image: string;
    message: string;
    tag: string;
  }>;
  initialIndex: number;
  onClose: () => void;
}

export default function MemoryLightbox({
  cards,
  initialIndex,
  onClose,
}: MemoryLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [direction, setDirection] = useState(0);
  const touchStartX = useRef(0);

  // Block body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const goNext = useCallback(() => {
    if (currentIndex < cards.length - 1) {
      setDirection(1);
      setCurrentIndex((i) => i + 1);
    }
  }, [currentIndex, cards.length]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex((i) => i - 1);
    }
  }, [currentIndex]);

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") goNext();
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") goPrev();
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goNext, goPrev, onClose]);

  // Swipe Support
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    if (delta > 50) goNext(); // Swipe left (next)
    if (delta < -50) goPrev(); // Swipe right (prev)
  };

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? "-100%" : "100%",
      opacity: 0,
    }),
  };

  return (
    <motion.div
      className="fixed inset-0 z-[300] flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/95 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Main Content */}
      <div className="relative z-10 flex h-full flex-col">
        {/* Top Bar */}
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center">
            <span className="rounded-full border border-[#E50914]/30 bg-[#E50914]/15 px-3 py-1 text-[10px] uppercase tracking-widest text-[#E50914]">
              {cards[currentIndex].tag}
            </span>
            <span className="ml-3 text-xs text-white/30">
              {currentIndex + 1} / {cards.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="cursor-pointer border-none bg-transparent text-2xl text-white/50 transition-colors hover:text-white"
            aria-label="Close lightbox"
          >
            ✕
          </button>
        </div>

        {/* Image Area - Purely Silent & Looping */}
        <div
          className="relative flex flex-1 items-center justify-center overflow-hidden px-4 md:px-16"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
              className="mx-auto w-full max-w-2xl"
            >
              <div
                className="relative w-full overflow-hidden rounded-xl shadow-2xl shadow-black/50"
                style={{ height: "60vh" }}
              >
                {cards[currentIndex].image.match(/\.(mp4|webm|ogg)$/i) ||
                cards[currentIndex].image.includes("/video/") ? (
                  <video
                    key={cards[currentIndex].image}
                    src={cards[currentIndex].image}
                    className="h-full w-full object-contain"
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                ) : (
                  <CloudinaryImage
                    src={cards[currentIndex].image}
                    alt={cards[currentIndex].title}
                    fill
                    className="object-contain"
                    wrapperClassName="absolute inset-0 !bg-transparent"
                    priority
                  />
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Content Below Image */}
        <div className="mx-auto w-full max-w-2xl px-6 pb-6 text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, delay: 0.1 }}
            >
              <h2 className="mb-1 font-display text-2xl tracking-wide text-white md:text-3xl">
                {cards[currentIndex].title.toUpperCase()}
              </h2>
              <p className="mb-4 font-body text-xs uppercase tracking-widest text-white/40">
                {cards[currentIndex].date}
              </p>
              <p className="mx-auto max-w-lg font-serif text-base font-light italic leading-relaxed text-white/70 md:text-lg">
                {cards[currentIndex].message}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Nav */}
        <div className="mx-auto flex w-full max-w-2xl items-center justify-between px-6 pb-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={goPrev}
            disabled={currentIndex === 0}
            className="flex cursor-pointer items-center gap-2 border-none bg-transparent text-sm text-white/50 transition-colors hover:text-white disabled:pointer-events-none disabled:opacity-20"
          >
            ← Prev
          </motion.button>

          {/* Dots */}
          <div className="flex gap-2">
            {cards.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => {
                  setDirection(i > currentIndex ? 1 : -1);
                  setCurrentIndex(i);
                }}
                className="flex cursor-pointer items-center justify-center rounded-full border-none bg-transparent p-1 focus:outline-none"
              >
                <div
                  className={`rounded-full transition-all ${
                    i === currentIndex
                      ? "h-1.5 w-4 bg-[#E50914]"
                      : "h-1.5 w-1.5 bg-white/20 hover:bg-white/40"
                  }`}
                />
              </button>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={goNext}
            disabled={currentIndex === cards.length - 1}
            className="flex cursor-pointer items-center gap-2 border-none bg-transparent text-sm text-white/50 transition-colors hover:text-white disabled:pointer-events-none disabled:opacity-20"
          >
            Next →
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
