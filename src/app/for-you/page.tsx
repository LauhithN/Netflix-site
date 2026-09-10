"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowLeft, Heart } from "lucide-react";
import { SECRET_GALLERY, FIFTY_REASONS, SECRET_LETTER } from "@/data/for-you";
import { fadeInUp, staggerContainer, staggerItem } from "@/lib/animations";

const CURTAIN_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function ForYouPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { scrollYProgress } = useScroll({ target: containerRef });
  const [isExiting, setIsExiting] = useState(false);
  const [showBack, setShowBack] = useState(true);
  const { scrollY } = useScroll();

  // Floating Back pill: tuck away while reading downwards, return on scroll up
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? latest;
    setShowBack(latest < 80 || latest < previous);
  });

  // The header fades out as the reader scrolls into the reasons
  const opacityHero = useTransform(scrollYProgress, [0, 0.1], [1, 0]);

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);
  }, []);

  /** Drop the curtain, then route. The home page restores its main view (no intro replay). */
  const leaveTo = (href: string) => {
    if (isExiting) return;
    setIsExiting(true);
    window.setTimeout(() => router.push(href), 800);
  };

  return (
    <>
      <div
        ref={containerRef}
        className="relative min-h-screen overflow-x-hidden bg-[#0a0a0a] text-white/90 selection:bg-rose-glow/30"
      >
        {/* ── Ambient Background Grain & Glow ─────────────────────────── */}
        <div className="bg-noise pointer-events-none fixed inset-0 z-0 opacity-20 mix-blend-overlay" aria-hidden="true" />
        <div className="pointer-events-none fixed left-0 top-0 z-0 h-[80vh] w-full max-w-2xl -translate-x-1/2 -translate-y-1/4 rounded-full bg-rose-glow/10 blur-[120px]" aria-hidden="true" />
        <div className="pointer-events-none fixed bottom-0 right-0 z-0 h-[80vh] w-full max-w-2xl translate-x-1/3 translate-y-1/3 rounded-full bg-rose-glow/5 blur-[120px]" aria-hidden="true" />

        {/* ── Back (always reachable on a long page) ──────────────────── */}
        <motion.button
          type="button"
          onClick={() => leaveTo("/")}
          animate={{ y: showBack ? 0 : -72, opacity: showBack ? 1 : 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          tabIndex={showBack ? 0 : -1}
          className="fixed left-4 top-[calc(1rem+env(safe-area-inset-top))] z-50 flex h-11 items-center gap-2 rounded-full border border-white/10 bg-black/40 pl-3 pr-4 font-body text-[11px] uppercase tracking-[0.2em] text-white/70 backdrop-blur-md transition-colors hover:border-white/25 hover:text-white"
          aria-label="Back to the main site"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Back
        </motion.button>

        <main className="relative z-10 mx-auto max-w-4xl px-6 pb-32 pt-32 sm:px-12 md:pb-48 md:pt-48">

          {/* ── Hero ────────────────────────────────────────────────── */}
          <motion.header
            style={{ opacity: opacityHero }}
            className="mb-32 text-center md:mb-56"
          >
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.8 }}
              className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-full bg-white/5 backdrop-blur-sm"
              aria-hidden="true"
            >
              <Heart className="text-rose-glow" size={24} fill="currentColor" />
            </motion.div>

            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.1, duration: 1, ease: "easeOut" }}
              className="font-serif text-5xl italic tracking-wide text-white/90 md:text-7xl"
            >
              Just For You
            </motion.h1>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.4, duration: 1, ease: "easeOut" }}
              className="mt-6 font-body text-sm font-light uppercase tracking-[0.2em] text-white/55"
            >
              The things I don&apos;t say loud enough
            </motion.p>
          </motion.header>

          {/* ── The 50 Reasons ──────────────────────────────────────── */}
          <section className="mb-40">
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="mb-16 text-center"
            >
              <h2 className="font-serif text-3xl italic text-white/85">Fifty Reasons Why</h2>
              <div className="mx-auto mt-6 h-px w-24 bg-gradient-to-r from-transparent via-rose-glow/40 to-transparent" aria-hidden="true" />
            </motion.div>

            {/* Two-column masonry so the list reads as a wall of notes rather than a form */}
            <div className="columns-1 gap-6 sm:columns-2 md:gap-8">
              {FIFTY_REASONS.map((reason, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: (i % 5) * 0.1 }}
                  className="mb-6 break-inside-avoid rounded-2xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-sm transition-colors hover:bg-white/[0.04]"
                >
                  <p className="font-body text-sm leading-relaxed text-white/80">
                    <span className="mr-2 font-serif italic text-rose-glow/70">{reason.split(".")[0]}.</span>
                    {reason.substring(reason.indexOf(".") + 1).trim()}
                  </p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ── Private Gallery ─────────────────────────────────────── */}
          <section className="mb-40">
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="mb-16 text-center"
            >
              <h2 className="font-serif text-3xl italic text-white/85">Moments In Between</h2>
              <div className="mx-auto mt-6 h-px w-24 bg-gradient-to-r from-transparent via-rose-glow/40 to-transparent" aria-hidden="true" />
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-6"
            >
              {SECRET_GALLERY.map((img, i) => (
                <motion.div
                  key={img.id}
                  variants={staggerItem}
                  className={`group relative aspect-[3/4] overflow-hidden rounded-xl bg-white/5 ${
                    i === 0 || i === 3 || i === 6 ? "aspect-square sm:col-span-2 md:col-span-1 md:row-span-2 md:aspect-auto" : ""
                  }`}
                >
                  <Image
                    src={img.url}
                    alt={img.caption}
                    fill
                    loading="lazy"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 group-hover:opacity-80"
                  />

                  {/* Caption: revealed on hover with a mouse, always visible on touch screens */}
                  <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/85 via-black/25 to-transparent p-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 [@media(hover:none)]:opacity-100">
                    <p className="translate-y-3 font-serif text-base italic text-white/90 transition-transform duration-300 group-hover:translate-y-0 [@media(hover:none)]:translate-y-0 md:text-lg">
                      &ldquo;{img.caption}&rdquo;
                    </p>
                    {img.date ? (
                      <p className="mt-2 translate-y-3 font-body text-[11px] uppercase tracking-widest text-white/60 transition-transform delay-75 duration-300 group-hover:translate-y-0 [@media(hover:none)]:translate-y-0">
                        {img.date}
                      </p>
                    ) : null}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </section>

          {/* ── The Letter ──────────────────────────────────────────── */}
          <section className="mx-auto max-w-2xl">
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="relative rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 shadow-2xl backdrop-blur-md sm:p-16"
            >
              {/* Corner accents */}
              <div className="absolute left-8 top-8 h-px w-12 bg-rose-glow/25" aria-hidden="true" />
              <div className="absolute left-8 top-8 h-12 w-px bg-rose-glow/25" aria-hidden="true" />
              <div className="absolute bottom-8 right-8 h-px w-12 bg-rose-glow/25" aria-hidden="true" />
              <div className="absolute bottom-8 right-8 h-12 w-px bg-rose-glow/25" aria-hidden="true" />

              <h2 className="mb-12 font-serif text-2xl italic text-white/90">
                {SECRET_LETTER.title}
              </h2>

              <div className="space-y-8 font-serif text-lg leading-[1.8] tracking-wide text-white/80">
                {SECRET_LETTER.paragraphs.map((p, i) => (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.8, delay: i * 0.15 }}
                  >
                    {p}
                  </motion.p>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 1, duration: 1 }}
                className="mt-16 text-right"
              >
                <p className="font-serif text-lg italic text-white/70">
                  {SECRET_LETTER.signoff}
                </p>
                <p className="mt-4 font-display text-3xl tracking-widest text-white/90">
                  {SECRET_LETTER.signature}
                </p>
              </motion.div>
            </motion.div>
          </section>

          {/* ── Footer Link Back ────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-32 text-center"
          >
            <button
              type="button"
              onClick={() => leaveTo("/#timeline")}
              className="group inline-flex items-center gap-2 font-display text-sm uppercase tracking-[0.2em] text-white/55 transition-colors hover:text-white/90"
            >
              <span className="transition-transform duration-300 group-hover:-translate-x-1" aria-hidden="true">←</span>
              Return to Timeline
            </button>
          </motion.div>

        </main>
      </div>

      {/* ── Cinematic Entry/Exit Curtain ──────────────────────────── */}
      {/* 1. On Mount: slides UP to reveal the page */}
      <motion.div
        initial={{ y: "0%" }}
        animate={{ y: "-100%" }}
        transition={{ duration: 1.2, ease: CURTAIN_EASE, delay: 0.2 }}
        className="pointer-events-none fixed inset-0 z-[9999] bg-[#0a0a0a]"
        aria-hidden="true"
      />

      {/* 2. On Exit: slides DOWN to cover the page */}
      <AnimatePresence>
        {isExiting && (
          <motion.div
            initial={{ y: "-100%" }}
            animate={{ y: "0%" }}
            transition={{ duration: 0.8, ease: CURTAIN_EASE }}
            className="pointer-events-auto fixed inset-0 z-[9999] bg-netflix-dark"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>
    </>
  );
}
