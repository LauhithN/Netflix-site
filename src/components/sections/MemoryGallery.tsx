"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import dynamic from "next/dynamic";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { MEMORY_ROWS } from "@/data/content";
import { AnimatedTitle } from "@/components/ui/AnimatedTitle";
import { CloudinaryImage } from "@/components/ui/CloudinaryImage";
import { shouldSimplifyMotion } from "@/lib/device";
import { cn } from "@/lib/utils";

const MemoryLightbox = dynamic(() => import("@/components/ui/MemoryLightbox"), {
  ssr: false,
});

type MemoryRowData = (typeof MEMORY_ROWS)[number];
type MemoryCardData = MemoryRowData["cards"][number] & { focus?: string };

const isVideoSource = (src: string) =>
  /\.(mp4|webm|ogg)$/i.test(src) || src.includes("/video/");

interface MemoryGalleryProps {
  onLightboxToggle?: (isOpen: boolean) => void;
}

export default function MemoryGallery({ onLightboxToggle }: MemoryGalleryProps) {
  return (
    <section id="memories" className="relative bg-netflix-dark py-8">
      <div className="flex flex-col gap-10 pt-8 md:gap-12">
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
  row: MemoryRowData;
  onLightboxToggle?: (isOpen: boolean) => void;
}) {
  const rowRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [canScroll, setCanScroll] = useState({ left: false, right: false });

  const handleOpenLightbox = (idx: number) => {
    setLightboxIndex(idx);
    onLightboxToggle?.(true);
  };

  const handleCloseLightbox = () => {
    setLightboxIndex(null);
    onLightboxToggle?.(false);
  };

  // Track whether the row overflows so the desktop arrows only appear when useful
  const updateScrollState = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setCanScroll({ left: el.scrollLeft > 4, right: el.scrollLeft < max - 4 });
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener("scroll", updateScrollState, { passive: true });
    const observer = new ResizeObserver(updateScrollState);
    observer.observe(el);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      observer.disconnect();
    };
  }, [updateScrollState]);

  const scrollByPage = (direction: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.85, behavior: "smooth" });
  };

  useGSAP(
    () => {
      // Scoped to this row — a global selector would animate every row at once
      const cards = rowRef.current?.querySelectorAll<HTMLElement>(".memory-card-wrap");
      if (!cards || cards.length === 0 || shouldSimplifyMotion()) return;

      gsap.registerPlugin(ScrollTrigger);
      gsap.fromTo(
        cards,
        { x: 60, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: rowRef.current,
            start: "top 88%",
            once: true,
          },
        }
      );
      // Sections load lazily; recalculate trigger positions once this one is in
      requestAnimationFrame(() => ScrollTrigger.refresh());
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
        <p className="mt-1 font-body text-[11px] uppercase tracking-widest text-white/55 sm:text-xs">
          {row.subtitle}
        </p>
      </div>

      {/* Scrolling Row */}
      <div className="relative">
        <div ref={scrollerRef} className="scroll-row">
          {row.cards.map((card, idx) => (
            <div key={card.id} className="memory-card-wrap shrink-0">
              <MemoryCard card={card} onOpen={() => handleOpenLightbox(idx)} />
            </div>
          ))}
        </div>

        <RowArrow direction="left" visible={canScroll.left} onClick={() => scrollByPage(-1)} />
        <RowArrow direction="right" visible={canScroll.right} onClick={() => scrollByPage(1)} />
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

/** Netflix-style edge arrows for mouse users (rows are swipeable on touch). */
function RowArrow({
  direction,
  visible,
  onClick,
}: {
  direction: "left" | "right";
  visible: boolean;
  onClick: () => void;
}) {
  const Icon = direction === "left" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      tabIndex={visible ? 0 : -1}
      aria-label={direction === "left" ? "Scroll row left" : "Scroll row right"}
      className={cn(
        "absolute bottom-6 top-4 z-20 hidden w-12 items-center justify-center text-white/80 transition-opacity duration-200 hover:text-white [@media(hover:hover)]:flex",
        direction === "left"
          ? "left-0 bg-gradient-to-r from-netflix-dark/95 to-transparent"
          : "right-0 bg-gradient-to-l from-netflix-dark/95 to-transparent",
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      )}
    >
      <Icon size={32} strokeWidth={1.5} aria-hidden="true" />
    </button>
  );
}

function MemoryCard({
  card,
  onOpen,
}: {
  card: MemoryCardData;
  onOpen: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const isVideo = isVideoSource(card.image);
  // Where the cover-crop centres vertically, so faces stay inside the 16:9 preview
  const focus = card.focus ?? "50% 30%";

  return (
    <motion.div
      className="memory-card relative w-[16.5rem] cursor-pointer overflow-hidden rounded-md bg-surface sm:w-64 md:w-72 lg:w-80 tv:w-96"
      style={{ aspectRatio: "16 / 9" }}
      animate={
        hovered
          ? { scale: 1.08, y: -8, zIndex: 10 }
          : { scale: 1, y: 0, zIndex: 1 }
      }
      transition={{ duration: 0.2, ease: [0.25, 1, 0.5, 1] }}
      // Framer hover gestures are mouse-only, so a tap on touch devices opens the lightbox directly
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setHovered(false);
      }}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`View ${card.title}`}
    >
      {/* Background Media */}
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
          sizes="(max-width: 640px) 16.5rem, (max-width: 1024px) 18rem, 20rem"
        />
      )}

      {/* Default Overlay */}
      <div className="absolute inset-0 bg-card-overlay" aria-hidden="true" />

      {/* Tag Badge */}
      <div className="absolute left-2 top-2 rounded-sm bg-netflix-red px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
        {card.tag}
      </div>

      {/* Bottom Info (always visible) */}
      <div className="absolute bottom-0 w-full p-3">
        <h3 className="truncate font-display text-lg text-white">{card.title}</h3>
        <p className="font-body text-xs text-white/65">{card.date}</p>
      </div>

      {/* Hover / focus panel */}
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
            <p className="mb-3 line-clamp-4 font-body text-xs leading-relaxed text-white/85">
              {card.message}
            </p>

            <div className="mt-1 flex items-center gap-3">
              <button
                type="button"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-black shadow-lg transition-transform hover:scale-110"
                aria-label={isVideo ? "Play clip" : "View photo"}
                onClick={(e) => {
                  e.stopPropagation();
                  onOpen();
                }}
              >
                <Play size={18} fill="currentColor" className="ml-0.5" aria-hidden="true" />
              </button>
              <span className="text-[11px] font-semibold uppercase tracking-widest text-netflix-red">
                {isVideo ? "Play clip" : "View photo"}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
