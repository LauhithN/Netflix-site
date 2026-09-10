"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Play } from "lucide-react";
import { HERO, SITE_CONFIG } from "@/data/content";
import {
  heroContainerVariants,
  heroTitleVariants,
  fadeInUp,
  fadeIn,
} from "@/lib/animations";
import { useLiveStats } from "@/hooks";
import { shouldSimplifyMotion } from "@/lib/device";

const COLLAGE_TILTS = ["-rotate-1", "rotate-[0.5deg]", "rotate-1"];

export default function HeroBanner() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const { daysTogether, hasMounted } = useLiveStats();
  const [simplify, setSimplify] = useState(false);

  useEffect(() => {
    setSimplify(shouldSimplifyMotion());
  }, []);

  useGSAP(
    () => {
      if (simplify || !bgRef.current) return;
      gsap.registerPlugin(ScrollTrigger);
      gsap.to(bgRef.current, {
        yPercent: 12,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    },
    { scope: sectionRef, dependencies: [simplify] }
  );

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative flex h-screen-safe w-full items-end overflow-hidden bg-netflix-dark"
    >
      {/* ── Background: 3 polaroids on top, main photo on bottom ──── */}
      <div ref={bgRef} className="absolute inset-0 bg-netflix-dark will-change-transform">
        {/* Top row — starts below the navbar so links never sit on a photo */}
        <div className="absolute inset-x-0 top-[var(--nav-height)] z-[1] flex h-[24%] items-stretch gap-1.5 px-2 sm:h-[28%] sm:gap-2 sm:px-3 md:h-[34%] md:gap-3 md:px-6 lg:h-[38%]">
          {HERO.collage.map((src, i) => (
            <div
              key={src}
              className={`relative min-w-0 flex-1 rounded-sm bg-white p-0.5 shadow-[0_10px_30px_rgba(0,0,0,0.45)] sm:p-1 md:p-1.5 ${COLLAGE_TILTS[i % COLLAGE_TILTS.length]}`}
            >
              <div className="relative h-full w-full overflow-hidden">
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="33vw"
                  priority={i === 0}
                  className="object-cover"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom — main hero photo (optimised + preloaded: it's the LCP element) */}
        <div className="absolute inset-x-0 bottom-0 z-0 h-[78%] sm:h-[74%] md:h-[66%] lg:h-[62%]">
          <Image
            src={HERO.backgroundImageDesktop}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-[center_20%] md:object-[center_30%]"
          />
        </div>
      </div>

      {/* ── Gradient Overlays ────────────────────────────────────── */}
      <div className="absolute inset-0 z-[2] bg-gradient-to-r from-netflix-dark/95 via-netflix-dark/55 to-transparent md:via-netflix-dark/40" />
      <div className="absolute inset-x-0 top-0 z-[2] h-24 bg-gradient-to-b from-netflix-dark/70 to-transparent md:h-28" />
      <div className="absolute bottom-0 z-[2] h-56 w-full bg-gradient-to-t from-netflix-dark via-netflix-dark/90 to-transparent md:h-48" />

      {/* ── Content ──────────────────────────────────────────────── */}
      <motion.div
        variants={heroContainerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-2xl px-5 pb-[max(5rem,calc(1.5rem+env(safe-area-inset-bottom)))] pt-24 sm:px-8 sm:pb-24 md:px-16 md:pb-28"
      >
        <motion.div variants={fadeIn} className="mb-3 sm:mb-5">
          <p className="font-body text-[11px] font-medium uppercase tracking-[0.4em] text-netflix-red sm:text-xs">
            A Birthday Original
          </p>
        </motion.div>

        <motion.h1
          variants={heroTitleVariants}
          className="mb-3 font-display text-white sm:mb-4"
          style={{
            fontSize: "clamp(48px, 12vw, 120px)",
            letterSpacing: "0.02em",
            lineHeight: 0.95,
          }}
        >
          {HERO.title.toUpperCase()}
        </motion.h1>

        <motion.p
          variants={fadeInUp}
          className="mb-6 max-w-lg font-body text-sm font-light leading-relaxed text-white/85 sm:mb-8 sm:text-base md:text-lg"
        >
          {HERO.description}
        </motion.p>

        <motion.div
          variants={fadeInUp}
          className="mb-8 flex flex-wrap gap-3 sm:mb-10"
        >
          <a
            href={HERO.ctaPrimary.anchor}
            className="tap-target flex items-center justify-center gap-2 rounded bg-white px-5 py-3 text-sm font-semibold text-black transition-colors hover:bg-white/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:px-6"
          >
            <Play size={16} fill="currentColor" aria-hidden="true" />
            {HERO.ctaPrimary.label}
          </a>
          <a
            href={HERO.ctaSecondary.anchor}
            className="tap-target flex items-center justify-center gap-2 rounded bg-white/20 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:px-6"
          >
            {HERO.ctaSecondary.label}
          </a>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          className="flex flex-wrap gap-6 sm:gap-8"
        >
          {HERO.stats.map((stat) => (
            <div key={stat.label} className="flex flex-col">
              <span className="font-display text-2xl text-netflix-red sm:text-3xl">
                {stat.label === "Days Together"
                  ? hasMounted
                    ? daysTogether
                    : "..."
                  : stat.value}
              </span>
              <span className="font-body text-[10px] uppercase tracking-widest text-white/60 sm:text-xs">
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div>
      </motion.div>

      <motion.div
        animate={simplify ? undefined : { y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[max(1rem,env(safe-area-inset-bottom))] left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 sm:flex"
        aria-hidden="true"
      >
        <span className="text-xs uppercase tracking-widest text-white/40">
          Scroll
        </span>
        <div className="h-8 w-[1px] bg-gradient-to-b from-white/40 to-transparent" />
      </motion.div>
    </section>
  );
}
