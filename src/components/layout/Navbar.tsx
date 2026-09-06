"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { SITE_CONFIG } from "@/data/content";
import { navbarVariants } from "@/lib/animations";

const NAV_LINKS = [
  { label: "Home", href: "#hero" },
  { label: "Memories", href: "#memories" },
  { label: "Our Story", href: "#timeline" },
  { label: "The Letter", href: "#letter" },
];

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
    >
      <div className="flex h-[calc(56px+env(safe-area-inset-top))] items-center px-4 pt-[env(safe-area-inset-top)] sm:h-[calc(68px+env(safe-area-inset-top))] sm:px-6 md:px-10">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3">
          <a
            href="#hero"
            className="tap-target flex items-center font-display text-lg tracking-[0.18em] text-netflix-red sm:text-xl md:text-2xl"
          >
            {SITE_CONFIG.herName.toUpperCase()}
          </a>

          <div className="hidden items-center gap-6 lg:flex">
            {NAV_LINKS.map((link) => (
              <motion.a
                key={link.href}
                href={link.href}
                whileHover={{ y: -1 }}
                className="tap-target flex items-center font-body text-xs font-medium uppercase tracking-widest text-white/60 transition-colors hover:text-white"
              >
                {link.label}
              </motion.a>
            ))}
          </div>

          {/* Compact nav for phone / small tablets */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar lg:hidden">
            {NAV_LINKS.slice(1).map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="tap-target shrink-0 rounded-full px-2.5 py-2 font-body text-[10px] uppercase tracking-wider text-white/55 hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <motion.a
              href="#letter"
              whileHover={{
                scale: 1.08,
                borderColor: "rgba(229,9,20,0.6)",
              }}
              className="tap-target flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/40 text-sm transition-colors"
              aria-label="Jump to love letter"
            >
              💌
            </motion.a>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
