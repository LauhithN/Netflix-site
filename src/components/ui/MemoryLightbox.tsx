"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { CloudinaryImage } from "@/components/ui/CloudinaryImage";
import { cn } from "@/lib/utils";

interface LightboxCard {
  id: string;
  title: string;
  date: string;
  image: string;
  message: string;
  tag: string;
}

interface MemoryLightboxProps {
  cards: LightboxCard[];
  initialIndex: number;
  onClose: () => void;
}

const isVideoSource = (src: string) =>
  /\.(mp4|webm|ogg)$/i.test(src) || src.includes("/video/");

const SWIPE_THRESHOLD = 50;

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? "60%" : "-60%", opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? "-60%" : "60%", opacity: 0 }),
};

export default function MemoryLightbox({
  cards,
  initialIndex,
  onClose,
}: MemoryLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [direction, setDirection] = useState(0);
  const touchStartX = useRef(0);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const card = cards[currentIndex];
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < cards.length - 1;

  // Lock page scroll and move focus into the dialog
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  const goTo = useCallback(
    (index: number) => {
      if (index < 0 || index >= cards.length || index === currentIndex) return;
      setDirection(index > currentIndex ? 1 : -1);
      setCurrentIndex(index);
    },
    [cards.length, currentIndex]
  );

  const goNext = useCallback(() => goTo(currentIndex + 1), [goTo, currentIndex]);
  const goPrev = useCallback(() => goTo(currentIndex - 1), [goTo, currentIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") goNext();
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") goPrev();
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goNext, goPrev, onClose]);

  // Swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    if (delta > SWIPE_THRESHOLD) goNext();
    if (delta < -SWIPE_THRESHOLD) goPrev();
  };

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={`${card.title} — ${currentIndex + 1} of ${cards.length}`}
      className="fixed inset-0 z-[300]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/95 backdrop-blur-md"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Column layout: bar / media (flexible) / caption / nav — nothing can overflow the viewport */}
      <div className="relative z-10 flex h-full min-h-0 flex-col pb-safe pt-safe">
        {/* Top Bar */}
        <div className="flex shrink-0 items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="rounded-full border border-netflix-red/30 bg-netflix-red/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-netflix-red">
              {card.tag}
            </span>
            <span className="font-body text-xs text-white/55">
              {currentIndex + 1} / {cards.length}
            </span>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="tap-target flex h-11 w-11 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Close"
          >
            <X size={22} aria-hidden="true" />
          </button>
        </div>

        {/* Media */}
        <div
          className="relative min-h-0 flex-1"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <AnimatePresence mode="wait" custom={direction} initial={false}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
              className="absolute inset-x-4 inset-y-2 mx-auto max-w-4xl sm:inset-x-10 md:inset-x-16"
            >
              {isVideoSource(card.image) ? (
                <video
                  key={card.image}
                  src={card.image}
                  className="h-full w-full object-contain"
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              ) : (
                <CloudinaryImage
                  src={card.image}
                  alt={card.title}
                  fill
                  sizes="(max-width: 896px) 100vw, 896px"
                  className="object-contain"
                  wrapperClassName="absolute inset-0 !bg-transparent"
                  priority
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Caption */}
        <div className="mx-auto w-full max-w-2xl shrink-0 px-6 pb-2 pt-4 text-center">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="min-h-[7rem]"
            >
              <h2 className="mb-1 font-display text-2xl tracking-wide text-white md:text-3xl">
                {card.title.toUpperCase()}
              </h2>
              <p className="mb-3 font-body text-[11px] uppercase tracking-widest text-white/55">
                {card.date}
              </p>
              <p className="mx-auto max-w-lg font-serif text-base italic leading-relaxed text-white/80 md:text-lg">
                {card.message}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Nav */}
        <div className="mx-auto flex w-full max-w-2xl shrink-0 items-center justify-between px-4 pb-4 sm:px-6">
          <button
            type="button"
            onClick={goPrev}
            disabled={!hasPrev}
            className="tap-target flex items-center gap-1 rounded-full pl-2 pr-4 text-sm text-white/70 transition-colors hover:text-white disabled:pointer-events-none disabled:opacity-25"
            aria-label="Previous memory"
          >
            <ChevronLeft size={20} aria-hidden="true" />
            Prev
          </button>

          {/* Dots */}
          <div className="flex gap-1" role="tablist" aria-label="Memories">
            {cards.map((item, i) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={i === currentIndex}
                aria-label={`Go to memory ${i + 1}`}
                onClick={() => goTo(i)}
                className="flex h-8 min-h-0 w-6 min-w-0 items-center justify-center rounded-full"
              >
                <span
                  className={cn(
                    "block h-1.5 rounded-full transition-all",
                    i === currentIndex
                      ? "w-4 bg-netflix-red"
                      : "w-1.5 bg-white/25 hover:bg-white/50"
                  )}
                />
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={goNext}
            disabled={!hasNext}
            className="tap-target flex items-center gap-1 rounded-full pl-4 pr-2 text-sm text-white/70 transition-colors hover:text-white disabled:pointer-events-none disabled:opacity-25"
            aria-label="Next memory"
          >
            Next
            <ChevronRight size={20} aria-hidden="true" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
