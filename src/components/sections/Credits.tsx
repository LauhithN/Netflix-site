"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { CREDITS } from "@/data/content";
import { fadeIn, staggerItem } from "@/lib/animations";

export default function Credits() {
  const router = useRouter();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleSecretNavigation = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsTransitioning(true);
    
    // Wait for the curtain to drop, then route
    setTimeout(() => {
      router.push("/for-you");
    }, 800); 
  };

  return (
    <>
      <section className="border-t border-white/5 bg-black px-8 py-24">
        <div className="mx-auto max-w-lg text-center">
          {/* ── Title Block ─────────────────────────────────────────── */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="font-display text-sm uppercase tracking-[0.4em] text-white/30">
              {CREDITS.title}
            </h2>
            <p className="mt-1 font-body text-xs text-white/20">{CREDITS.year}</p>
          </motion.div>

          {/* ── Rolling Credits List ─────────────────────────────────── */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            transition={{ staggerChildren: 0.07 }}
            className="space-y-5"
          >
            {CREDITS.roles.map((credit, i) => (
              <motion.div key={i} variants={staggerItem} className="flex flex-col">
                <span className="font-body text-[11px] uppercase tracking-[0.2em] text-white/30">
                  {credit.role}
                </span>
                <span className="font-serif text-base italic text-white/70">
                  {credit.name}
                </span>
              </motion.div>
            ))}
          </motion.div>

          {/* ── Final Message ───────────────────────────────────────── */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: 0.8, duration: 1 }}
            className="mt-16 border-t border-white/10 pt-12"
          >
            <p className="whitespace-pre-line font-serif text-base italic leading-relaxed text-white/50">
              {CREDITS.finalMessage}
            </p>
            <button
              onClick={handleSecretNavigation}
              className="mt-6 block h-8 w-full cursor-default opacity-0"
              title="Just for you"
              aria-label="Secret link"
            />
          </motion.div>
        </div>
      </section>

      {/* ── Black Curtain Overlay (Exit Transition) ───────────────── */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            initial={{ y: "-100%" }}
            animate={{ y: "0%" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} // smooth cinematic easing
            className="fixed inset-0 z-[9999] bg-[#0a0a0a]"
          />
        )}
      </AnimatePresence>
    </>
  );
}
