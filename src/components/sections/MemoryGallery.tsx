"use client";

import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { MEMORY_ROWS } from "@/data/content";
import { AnimatedTitle } from "@/components/ui/AnimatedTitle";
import { CloudinaryImage } from "@/components/ui/CloudinaryImage";
import { shouldSimplifyMotion } from "@/lib/device";
import dynamic from "next/dynamic";

const MemoryLightbox = dynamic(() => import("@/components/ui/MemoryLightbox"), {
  ssr: false,
});

interface MemoryGalleryProps {
  onLightboxToggle?: (isOpen: boolean) => void;
}

export default function MemoryGallery({ onLightboxToggle }: MemoryGalleryProps) {
  return (
    <section id="memories" className="relative bg-netflix-dark py-8">
      {/* ── Top Fade Overlay ─────────────────────────────────────── */}
      <div className="pointer-events-none absolute top-0 h-20 w-full bg-section-fade-down" />

      {/* ── Memory Rows ──────────────────────────────────────────── */}
      <div className="flex flex-col gap-12 pt-8">
        {MEMORY_ROWS.map((row) => (
          <MemoryRow key={row.id} row={row} onLightboxToggle={onLightboxToggle} />
        ))}
      </div>
    </section>
  );
}

// ─── Subcomponents ──────────────────────────────────────────────────────────

function MemoryRow({
  row,
  onLightboxToggle,
}: {
  row: (typeof MEMORY_ROWS)[0];
  onLightboxToggle?: (isOpen: boolean) => void;
}) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const handleOpenLightbox = (idx: number) => {
    setLightboxIndex(idx);
    onLightboxToggle?.(true);
  };

  const handleCloseLightbox = () => {
    setLightboxIndex(null);
    onLightboxToggle?.(false);
  };

  useGSAP(
    () => {
      if (shouldSimplifyMotion()) return;

      gsap.registerPlugin(ScrollTrigger);

      const cards = gsap.utils.toArray(".memory-card-wrap");
      if (cards.length === 0) return;

      gsap.fromTo(
        cards,
        { x: 100, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: rowRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    },
    { scope: rowRef }
  );

  return (
    <div className="w-full" ref={rowRef}>
      {/* Row Header */}
      <div className="mb-3 px-5 md:px-12">
        <AnimatedTitle
          text={row.title.toUpperCase()}
          className="font-display text-xl tracking-wide text-white sm:text-2xl md:text-3xl"
        />
        <p className="mt-1 font-body text-[10px] uppercase tracking-widest text-white/40 sm:text-xs">
          {row.subtitle}
        </p>
      </div>

      {/* Scrolling Row */}
      <div className="scroll-row flex gap-3 pb-4">
        {row.cards.map((card, idx) => (
          <div key={card.id} className="shrink-0 memory-card-wrap">
            <MemoryCard
              card={card}
              onClick={() => handleOpenLightbox(idx)}
            />
          </div>
        ))}
      </div>

      <AnimatePresence>
        {lightboxIndex !== null && (
          <MemoryLightbox
            cards={row.cards}
            initialIndex={lightboxIndex}
            onClose={handleCloseLightbox}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function MemoryCard({
  card,
  onClick,
}: {
  card: (typeof MEMORY_ROWS)[0]["cards"][0];
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const isVideo = card.image.match(/\.(mp4|webm|ogg)$/i) || card.image.includes("/video/");
  // Where the cover-crop centers vertically, so faces stay inside the 16:9 preview
  const focus = (card as { focus?: string }).focus ?? "50% 30%";
  return (
    <motion.div
      className="memory-card relative w-[15.5rem] cursor-pointer overflow-hidden rounded-md bg-surface sm:w-64 md:w-72 tv:w-80"
      style={{ aspectRatio: "16/9" }}
      animate={
        hovered
          ? { scale: 1.08, y: -8, zIndex: 10 }
          : { scale: 1, y: 0, zIndex: 1 }
      }
      transition={{ duration: 0.2, ease: [0.25, 1, 0.5, 1] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onTap={() => setHovered((prev) => !prev)}
      onClick={onClick}
      role="button"
      aria-label={`View ${card.title}`}
    >
      {/* Background Media Wrapper */}
      {isVideo ? (
        <video
          src={card.image}
          className="absolute inset-0 z-0 h-full w-full object-cover"
          style={{ objectPosition: focus }}
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
          className="object-cover"
          style={{ objectPosition: focus }}
          wrapperClassName="absolute inset-0 z-0"
          sizes="(max-width: 768px) 14rem, 16rem"
        />
      )}

      {/* Default Overlay */}
      <div className="absolute inset-0 bg-card-overlay" />

      {/* Tag Badge */}
      <div className="absolute left-2 top-2 rounded-sm bg-netflix-red px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
        {card.tag}
      </div>

      {/* Bottom Info (Always visible) */}
      <div className="absolute bottom-0 p-3 w-full">
        <h3 className="font-display text-lg text-white truncate">{card.title}</h3>
        <p className="font-body text-xs text-white/50">{card.date}</p>
      </div>

      {/* Hover Panel */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 flex flex-col justify-end bg-black/80 p-4 backdrop-blur-sm"
          >
            <h4 className="mb-1 font-display text-base text-white">
              {card.title}
            </h4>
            <p className="mb-3 line-clamp-4 font-body text-xs leading-relaxed text-white/80">
              {card.message}
            </p>

            {/* Action Row */}
            <div className="flex items-center gap-3 mt-1">
              <button 
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-base text-black transition-transform hover:scale-110 shadow-lg"
                aria-label="Play Video"
                onClick={(e) => {
                  e.stopPropagation();
                  onClick();
                }}
              >
                ▶
              </button>
              <button 
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/40 text-lg text-white transition-colors hover:border-white bg-black/50"
                aria-label="Add to List"
                onClick={(e) => e.stopPropagation()}
              >
                +
              </button>
              <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-netflix-red ml-2">
                {isVideo ? "Play Review" : "View Photo"}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
