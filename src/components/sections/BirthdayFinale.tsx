"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { SITE_CONFIG } from "@/data/content";
import { isBirthday } from "@/lib/utils";
import { staggerContainer, staggerItem } from "@/lib/animations";

export default function BirthdayFinale() {
  const sectionRef = useRef<HTMLElement>(null);
  const done = useRef(false);

  const isHerBirthday = isBirthday(SITE_CONFIG.birthdayDate);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (entry.isIntersecting && !done.current) {
          done.current = true;
          observer.disconnect();

          // Fire grand finale confetti
          const confetti = (await import("canvas-confetti")).default;
          const duration = 3000;
          const end = Date.now() + duration;

          const frame = () => {
            confetti({
              particleCount: 5,
              angle: 60,
              spread: 55,
              origin: { x: 0 },
              colors: ["#E50914", "#E91E8C", "#F5C518", "#ffffff"],
            });
            confetti({
              particleCount: 5,
              angle: 120,
              spread: 55,
              origin: { x: 1 },
              colors: ["#E50914", "#E91E8C", "#F5C518", "#ffffff"],
            });

            if (Date.now() < end) {
              requestAnimationFrame(frame);
            }
          };
          frame();
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const emojis = ["🌹", "✨", "💖", "🥂", "🌟", "💕", "🎉"];

  return (
    <section
      ref={sectionRef}
      id="finale"
      className="relative overflow-hidden bg-black px-8 py-40 text-center"
    >
      {/* ── Background Red Glow ──────────────────────────────────── */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at center, rgba(229, 9, 20, 0.08) 0%, transparent 60%)",
        }}
        aria-hidden="true"
      />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="relative z-10 mx-auto max-w-4xl"
      >
        {/* Cake Emoji */}
        <motion.span variants={staggerItem} className="mb-6 block text-7xl md:text-9xl">
          🎂
        </motion.span>

        {/* Subtitle Badge */}
        <motion.p
          variants={staggerItem}
          className="mx-auto mb-6 max-w-fit rounded-full border border-netflix-red/30 bg-netflix-red/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-netflix-red"
        >
          {isHerBirthday ? "Today is Your Special Day" : "Always Celebrating You"}
        </motion.p>

        {/* Main Title */}
        <motion.h2
          variants={staggerItem}
          className="text-gradient-red mb-8 font-display"
          style={{
            fontSize: "clamp(48px, 12vw, 96px)",
            lineHeight: 1,
            letterSpacing: "0.02em",
          }}
        >
          HAPPY BIRTHDAY
          <br />
          {SITE_CONFIG.herName.toUpperCase()}
        </motion.h2>

        {/* Romantic Under-text */}
        <motion.p
          variants={staggerItem}
          className="mx-auto max-w-lg font-serif text-lg italic leading-relaxed text-white/60"
        >
          &quot;No matter what day the calendar says, my favorite day is any day spent
          with you. I love you.&quot;
        </motion.p>

        {/* Bouncing Emojis Row */}
        <motion.div variants={staggerItem} className="mt-12 flex justify-center gap-4 text-2xl">
          {emojis.map((emoji, i) => (
            <motion.span
              key={i}
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.15,
                ease: "easeInOut",
              }}
            >
              {emoji}
            </motion.span>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
