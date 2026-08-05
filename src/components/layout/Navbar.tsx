"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { SITE_CONFIG } from "@/data/content";
import { navbarVariants } from "@/lib/animations";
import { VolumeX } from "lucide-react";

interface NavbarProps {
  musicOn: boolean;
  onMusicToggle: () => void;
}

const NAV_LINKS = [
  { label: "Home", href: "#hero" },
  { label: "Memories", href: "#memories" },
  { label: "Our Story", href: "#timeline" },
  { label: "The Letter", href: "#letter" },
];

export default function Navbar({ musicOn, onMusicToggle }: NavbarProps) {
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
      className="fixed left-0 right-0 top-0 z-nav flex h-[68px] items-center px-6 md:px-10"
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
        {/* ── Left: Logo ──────────────────────────────────── */}
        <a href="#hero" className="flex items-center gap-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/hero-logo.png"
            alt="Logo"
            className="h-8 md:h-10 w-auto object-contain filter drop-shadow-[0_0_8px_rgba(229,9,20,0.3)]"
          />
        </a>

        {/* ── Center: Nav Links (desktop only) ───────────────────── */}
        <div className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <motion.a
              key={link.href}
              href={link.href}
              whileHover={{ y: -1 }}
              className="font-body text-xs font-medium uppercase tracking-widest text-white/60 transition-colors hover:text-white"
            >
              {link.label}
            </motion.a>
          ))}
        </div>

        {/* ── Right: Actions ─────────────────────────────────────── */}
        <div className="flex items-center gap-3">
          {/* Music toggle */}
          <motion.button
            onClick={onMusicToggle}
            whileHover={{
              scale: 1.1,
              borderColor: "rgba(229,9,20,0.6)",
            }}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/30 text-sm transition-colors"
            aria-label={musicOn ? "Mute music" : "Play music"}
          >
            {musicOn ? (
              <span className="flex h-4 items-end gap-[2px]">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="eq-bar eq-bar--active"
                    style={{ animationDelay: `${i * 0.13}s` }}
                  />
                ))}
              </span>
            ) : (
              <VolumeX size={14} className="text-white/50" />
            )}
          </motion.button>

          {/* Heart link */}
          <motion.a
            href="#letter"
            whileHover={{
              scale: 1.1,
              borderColor: "rgba(229,9,20,0.6)",
            }}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/30 text-sm transition-colors"
            aria-label="Jump to love letter"
          >
            💌
          </motion.a>
        </div>
      </div>
    </motion.nav>
  );
}
