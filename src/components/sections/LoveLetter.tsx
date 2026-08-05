"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LOVE_LETTER } from "@/data/content";
import { fadeInUp, fadeIn } from "@/lib/animations";

export default function LoveLetter() {
  const [heartClicks, setHeartClicks] = useState(0);
  const [secretRevealed, setSecretRevealed] = useState(false);

  const handleHeartClick = async () => {
    if (secretRevealed) return;

    const next = heartClicks + 1;
    setHeartClicks(next);

    if (next >= 5) {
      setSecretRevealed(true);
      const confetti = (await import("canvas-confetti")).default;
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#E91E8C", "#F5C518", "#FF6B9D", "#fff"],
      });
    }
  };

  return (
    <section
      id="letter"
      className="relative overflow-hidden bg-netflix-dark px-8 py-28 md:px-16"
    >
      {/* ── Background Glow ──────────────────────────────────────── */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at center, rgba(233, 30, 140, 0.06) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      {/* ── Letter Content ───────────────────────────────────────── */}
      <div className="relative mx-auto max-w-2xl">
        <motion.p
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-8 text-center text-xs font-medium uppercase tracking-[0.3em] text-rose-glow"
        >
          A Letter For You
        </motion.p>

        <motion.p
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-8 font-serif text-lg italic text-white/70"
        >
          {LOVE_LETTER.salutation}
        </motion.p>

        <div className="space-y-6">
          {LOVE_LETTER.paragraphs.map((p, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
              className="font-serif text-lg leading-relaxed text-white/80 md:text-xl"
            >
              {p}
            </motion.p>
          ))}
        </div>

        {/* Closing */}
        <div className="mt-12 text-right">
          <motion.p
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-2 font-serif text-lg italic text-white/60"
          >
            {LOVE_LETTER.closing}
          </motion.p>
          <motion.p
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="font-display text-3xl tracking-widest text-white"
          >
            {LOVE_LETTER.signature}
          </motion.p>
        </div>

        {/* ── P.S. Section / Interactive Secret ──────────────────── */}
        <div className="mt-10 border-t border-white/10 pt-8 text-center">
          <motion.p
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-4 font-body text-sm italic text-white/30"
          >
            {LOVE_LETTER.postscript}
          </motion.p>

          <motion.button
            onClick={handleHeartClick}
            disabled={secretRevealed}
            animate={
              heartClicks > 0 && !secretRevealed
                ? { scale: [1, 1.3, 1] }
                : { scale: 1 }
            }
            transition={{ duration: 0.3 }}
            className="text-4xl outline-none"
            aria-label="Unlock secret message"
          >
            {heartClicks >= 5 ? "💖" : "🤍"}
          </motion.button>

          {/* Clicks remaining hint */}
          <AnimatePresence>
            {heartClicks > 0 && heartClicks < 5 && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mx-auto mt-2 text-xs italic text-rose-glow/60"
              >
                {5 - heartClicks} more...
              </motion.p>
            )}
          </AnimatePresence>

          {/* Secret Message Reveal */}
          <AnimatePresence>
            {secretRevealed && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  delay: 0.2,
                }}
                className="mx-auto mt-6 max-w-md rounded-lg border border-rose-glow/30 bg-rose-glow/5 p-6 shadow-[0_0_30px_rgba(233,30,140,0.1)]"
              >
                <div className="mb-3 text-2xl">🔮</div>
                <p className="mb-6 font-serif italic font-light leading-relaxed text-rose-glow/90">
                  &quot;In any lifetime, in any universe, I would find you and
                  choose you again. You are my greatest adventure.&quot;
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.location.href = "/for-you"}
                  className="rounded-full bg-rose-glow/20 px-6 py-2 text-xs font-bold uppercase tracking-widest text-rose-glow border border-rose-glow/30 transition-all hover:bg-rose-glow/40 shadow-lg"
                >
                  Enter Your Secret Space
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
