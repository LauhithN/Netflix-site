"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { HERO } from "@/data/content";
import {
  heroContainerVariants,
  heroTitleVariants,
  fadeInUp,
  fadeIn,
} from "@/lib/animations";
import { useLiveStats } from "@/hooks";

export default function HeroBanner() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const { daysTogether, hasMounted } = useLiveStats();

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);
      gsap.to(bgRef.current, {
        yPercent: 20,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative flex h-screen-safe w-full items-end overflow-hidden bg-netflix-dark"
    >
      {/* ── Background Images (Responsive & Blurred) ─────────────── */}
      <div
        ref={bgRef}
        className="absolute -inset-y-[15%] inset-x-0 bg-black"
      >
        {/* Mobile Background */}
        <div 
          className="absolute inset-0 block md:hidden bg-cover bg-center blur-[4px]"
          style={{ backgroundImage: `url(${HERO.backgroundImageMobile})` }}
        />
        {/* Desktop Background */}
        <div 
          className="absolute inset-0 hidden md:block bg-cover bg-center blur-[4px]"
          style={{ backgroundImage: `url(${HERO.backgroundImageDesktop})` }}
        />
      </div>

      {/* ── Gradient Overlays ────────────────────────────────────── */}
      {/* 1. Dark gradient left to right (black -> transparent) */}
      <div className="absolute inset-0 bg-gradient-to-r from-netflix-dark/95 via-netflix-dark/50 to-transparent" />
      
      {/* 2. Subtle black vignette on corners */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-transparent to-netflix-dark/80" />
      
      {/* 3. Bottom fade to black for UI readability */}
      <div className="absolute bottom-0 h-48 w-full bg-gradient-to-t from-netflix-dark via-netflix-dark/80 to-transparent" />
      <div className="absolute bottom-0 h-40 w-full bg-section-fade-up" />

      {/* ── Content ──────────────────────────────────────────────── */}
      <motion.div
        variants={heroContainerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-2xl px-8 pb-20 md:px-16 md:pb-28"
      >
        {/* Logo Slot */}
        <motion.div
          variants={fadeIn}
          className="mb-6"
        >
          {/* LOGO SLOT — drop your PNG into public/images/hero-logo.png to activate */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/hero-logo.png"
            alt="Logo"
            onError={(e) => {
              // If PNG not uploaded yet, hide the broken image silently
              (e.target as HTMLImageElement).style.display = "none"
            }}
            style={{
              height: "clamp(40px, 8vw, 70px)",
              width: "auto",
              maxWidth: "280px",
              objectFit: "contain",
              objectPosition: "left center",
              display: "block",
              filter: "drop-shadow(0 0 12px rgba(229,9,20,0.3))",
            }}
          />
        </motion.div>

        {/* Title */}
        <motion.h1
          variants={heroTitleVariants}
          className="mb-4 font-display text-white"
          style={{
            fontSize: "clamp(64px, 14vw, 120px)",
            letterSpacing: "0.02em",
            lineHeight: 0.95,
          }}
        >
          {HERO.title.toUpperCase()}
        </motion.h1>

        {/* Description */}
        <motion.p
          variants={fadeInUp}
          className="mb-8 max-w-lg font-body text-base font-light leading-relaxed text-white/80 md:text-lg"
        >
          {HERO.description}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div variants={fadeInUp} className="mb-10 flex flex-wrap gap-3">
          <a
            href={HERO.ctaPrimary.anchor}
            className="flex items-center gap-2 rounded bg-white px-6 py-3 text-sm font-semibold text-black transition-colors hover:bg-white/90"
          >
            <span>▶</span>
            {HERO.ctaPrimary.label}
          </a>
          <a
            href={HERO.ctaSecondary.anchor}
            className="flex items-center gap-2 rounded bg-white/20 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/30"
          >
            {HERO.ctaSecondary.label}
          </a>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          variants={fadeInUp}
          className="flex flex-wrap gap-8"
        >
          {HERO.stats.map((stat) => (
            <div key={stat.label} className="flex flex-col">
              <span className="font-display text-3xl text-netflix-red">
                {stat.label === "Days Together" 
                  ? (hasMounted ? daysTogether : "...") 
                  : stat.value}
              </span>
              <span className="font-body text-xs uppercase tracking-widest text-white/50">
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* ── Scroll Indicator ─────────────────────────────────────── */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2"
      >
        <span className="text-xs uppercase tracking-widest text-white/30">
          Scroll
        </span>
        <div className="h-8 w-[1px] bg-gradient-to-b from-white/40 to-transparent" />
      </motion.div>
    </section>
  );
}
