"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { SITE_CONFIG } from "@/data/content";
import { navbarVariants } from "@/lib/animations";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Home", href: "#hero" },
  { label: "Memories", href: "#memories" },
  { label: "Our Story", href: "#timeline" },
  { label: "The Letter", href: "#letter" },
];

// Phones / small tablets: the logo already goes home and the envelope button
// already opens the letter, so only the two remaining links are shown — this
// keeps the bar from overflowing into the button on 375–430px screens.
const COMPACT_LINKS = NAV_LINKS.filter(
  (link) => link.href !== "#hero" && link.href !== "#letter"
);

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      variants={navbarVariants}
      animate={scrolled ? "solid" : "transparent"}
      className="fixed left-0 right-0 top-0 z-nav px-safe"
      aria-label="Primary"
    >
      {/* Netflix-style scrim so links stay legible over the hero photos */}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 bg-gradient-to-b from-black/75 via-black/35 to-transparent transition-opacity duration-300",
          scrolled ? "opacity-0" : "opacity-100"
        )}
      />

      <div className="relative flex h-[calc(56px+env(safe-area-inset-top))] items-center px-4 pt-[env(safe-area-inset-top)] sm:h-[calc(68px+env(safe-area-inset-top))] sm:px-6 md:px-10">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3">
          <a
            href="#hero"
            className="tap-target flex items-center font-display text-lg tracking-[0.18em] text-netflix-red sm:text-xl md:text-2xl"
            aria-label={`${SITE_CONFIG.herName} — back to top`}
          >
            {SITE_CONFIG.herName.toUpperCase()}
          </a>

          <div className="hidden items-center gap-6 lg:flex">
            {NAV_LINKS.map((link) => (
              <motion.a
                key={link.href}
                href={link.href}
                whileHover={{ y: -1 }}
                className="tap-target flex items-center font-body text-xs font-medium uppercase tracking-widest text-white/70 transition-colors hover:text-white"
              >
                {link.label}
              </motion.a>
            ))}
          </div>

          {/* Compact nav for phone / small tablets */}
          <div className="flex min-w-0 items-center gap-1 lg:hidden">
            {COMPACT_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="tap-target flex shrink-0 items-center rounded-full px-2.5 font-body text-[11px] uppercase tracking-wider text-white/70 transition-colors hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <motion.a
              href="#letter"
              whileHover={{ scale: 1.08 }}
              className="tap-target flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white/85 transition-colors hover:border-netflix-red/60 hover:text-white"
              aria-label="Jump to the letter"
            >
              <Mail size={18} strokeWidth={1.75} aria-hidden="true" />
            </motion.a>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
