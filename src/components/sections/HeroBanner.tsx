"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { HERO, SITE_CONFIG } from "@/data/content";
import {
  heroContainerVariants,
  heroTitleVariants,
  fadeInUp,
  fadeIn,
} from "@/lib/animations";
import { useLiveStats } from "@/hooks";
import { shouldSimplifyMotion } from "@/lib/device";

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
      {/* ── Background: 3 side-by-side on top, main photo on bottom ─ */}
      <div ref={bgRef} className="absolute inset-0 bg-netflix-dark will-change-transform">
        {/* Top row — three photos side by side */}
        <div className="absolute inset-x-0 top-0 z-[1] flex h-[26%] items-stretch gap-1.5 px-2 pt-[max(0.5rem,env(safe-area-inset-top))] sm:h-[30%] sm:gap-2 sm:px-3 md:h-[38%] md:gap-3 md:px-6 md:pt-5 lg:h-[42%]">
          {HERO.collage.map((src, i) => {
            const tilts = ["-rotate-1", "rotate-[0.5deg]", "rotate-1"];
            return (
              <div
                key={src}
                className={`relative min-w-0 flex-1 overflow-hidden rounded-sm bg-white p-0.5 shadow-[0_10px_30px_rgba(0,0,0,0.45)] sm:p-1 md:p-1.5 ${tilts[i]}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt=""
                  className="h-full w-full object-cover"
                  loading={i === 0 ? "eager" : "lazy"}
                  decoding="async"
                />
              </div>
            );
          })}
        </div>

        {/* Bottom — main hero photo */}
        <div
          className="absolute inset-x-0 bottom-0 z-0 h-[78%] bg-cover bg-[center_20%] sm:h-[74%] md:h-[66%] md:bg-[center_30%] lg:h-[62%]"
          style={{ backgroundImage: `url(${HERO.backgroundImageDesktop})` }}
        />
      </div>

      {/* ── Gradient Overlays ────────────────────────────────────── */}
      <div className="absolute inset-0 z-[2] bg-gradient-to-r from-netflix-dark/95 via-netflix-dark/55 to-transparent md:via-netflix-dark/40" />
      <div className="absolute inset-x-0 top-0 z-[2] h-20 bg-gradient-to-b from-netflix-dark/60 to-transparent md:h-24" />
      <div className="absolute bottom-0 z-[2] h-56 w-full bg-gradient-to-t from-netflix-dark via-netflix-dark/90 to-transparent md:h-48" />

      {/* ── Content ──────────────────────────────────────────────── */}
      <motion.div
        variants={heroContainerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-2xl px-5 pb-[max(5rem,calc(1.5rem+env(safe-area-inset-bottom)))] pt-24 sm:px-8 sm:pb-24 md:px-16 md:pb-28"
      >
        <motion.div variants={fadeIn} className="mb-3 sm:mb-6">
          <p className="font-display text-xl tracking-[0.2em] text-netflix-red sm:text-2xl md:text-3xl">
            {SITE_CONFIG.herName.toUpperCase()}
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
          className="mb-6 max-w-lg font-body text-sm font-light leading-relaxed text-white/80 sm:mb-8 sm:text-base md:text-lg"
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
            <span aria-hidden>▶</span>
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
              <span className="font-body text-[10px] uppercase tracking-widest text-white/50 sm:text-xs">
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
      >
        <span className="text-xs uppercase tracking-widest text-white/30">
          Scroll
        </span>
        <div className="h-8 w-[1px] bg-gradient-to-b from-white/40 to-transparent" />
      </motion.div>
    </section>
  );
}
