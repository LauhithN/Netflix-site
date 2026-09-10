"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";

import IntroScreen from "@/components/sections/IntroScreen";
import ProfileSelect from "@/components/sections/ProfileSelect";
import HeroBanner from "@/components/sections/HeroBanner";
import Navbar from "@/components/layout/Navbar";
import FloatingPetals from "@/components/ui/FloatingPetals";
import ProgressBar from "@/components/ui/ProgressBar";
import { shouldSimplifyMotion } from "@/lib/device";

/** Remembered per tab so returning from /for-you doesn't replay the intro + profile picker. */
const ENTERED_KEY = "birthday-site:entered";

const LoaderFallback = () => (
  <div
    className="flex min-h-[40vh] w-full items-center justify-center"
    aria-hidden="true"
  >
    <div className="h-10 w-10 animate-spin rounded-full border-4 border-netflix-red/20 border-t-netflix-red" />
  </div>
);

const MemoryGallery = dynamic(() => import("@/components/sections/MemoryGallery"), { loading: LoaderFallback, ssr: false });
const LoveStats = dynamic(() => import("@/components/sections/LoveStats"), { ssr: false });
const Timeline = dynamic(() => import("@/components/sections/Timeline"), { loading: LoaderFallback, ssr: false });
const VideoSection = dynamic(() => import("@/components/sections/VideoSection"), { loading: LoaderFallback, ssr: false });
const LoveLetter = dynamic(() => import("@/components/sections/LoveLetter"), { loading: LoaderFallback, ssr: false });
const BirthdayFinale = dynamic(() => import("@/components/sections/BirthdayFinale"), { ssr: false });
const Credits = dynamic(() => import("@/components/sections/Credits"), { ssr: false });

/** Warm the lazy section chunks while the profile picker is up, so the main page appears without spinners. */
function preloadSections() {
  void Promise.all([
    import("@/components/sections/MemoryGallery"),
    import("@/components/sections/LoveStats"),
    import("@/components/sections/Timeline"),
    import("@/components/sections/VideoSection"),
    import("@/components/sections/LoveLetter"),
    import("@/components/sections/BirthdayFinale"),
    import("@/components/sections/Credits"),
    import("@/components/ui/MemoryLightbox"),
  ]).catch(() => {
    /* chunks will load on demand instead */
  });
}

type AppState = "intro" | "profile" | "main";

export default function HomePage() {
  const [appState, setAppState] = useState<AppState>("intro");
  const [isMounted, setIsMounted] = useState(false);
  const [showPetals, setShowPetals] = useState(false);

  // Hydration guard + session restore: skip the intro when coming back in the
  // same tab, or when deep-linked to a section (e.g. /#timeline).
  useEffect(() => {
    let entered = false;
    try {
      entered = window.sessionStorage.getItem(ENTERED_KEY) === "1";
    } catch {
      // storage unavailable (private mode) — just replay the intro
    }
    if (entered || window.location.hash.length > 1) setAppState("main");
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (appState === "profile") {
      const timer = window.setTimeout(preloadSections, 250);
      return () => window.clearTimeout(timer);
    }
    if (appState === "main") {
      try {
        window.sessionStorage.setItem(ENTERED_KEY, "1");
      } catch {
        // ignore
      }
    }
  }, [appState]);

  // Deep links: sections load lazily, so retry briefly until the target exists
  useEffect(() => {
    if (appState !== "main") return;
    const id = window.location.hash.slice(1);
    if (!id) return;

    let attempts = 0;
    let timer = 0;
    const tryScroll = () => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
      if (attempts++ < 25) timer = window.setTimeout(tryScroll, 200);
    };
    tryScroll();
    return () => window.clearTimeout(timer);
  }, [appState]);

  // Show petals 3s after entering main state (skip on TV / reduced motion)
  useEffect(() => {
    if (appState !== "main") return;
    if (shouldSimplifyMotion()) return;

    const timer = setTimeout(() => {
      setShowPetals(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, [appState]);

  // Black placeholder until mounted so there's no #141414 → black flash before the intro
  if (!isMounted) return <div className="fixed inset-0 bg-black" aria-hidden="true" />;

  return (
    <>
      {/* Floating petals overlay */}
      {showPetals && <FloatingPetals />}

      {/* Persistent UI — only in main state */}
      {appState === "main" && <ProgressBar />}

      {/* ── Intro Screen ────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {appState === "intro" && (
          <IntroScreen
            key="intro"
            onComplete={() => setAppState("profile")}
          />
        )}
      </AnimatePresence>

      {/* ── Profile Select ──────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {appState === "profile" && (
          <ProfileSelect
            key="profile"
            onSelect={() => setAppState("main")}
          />
        )}
      </AnimatePresence>

      {/* ── Main Content ────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {appState === "main" && (
          <motion.main
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative min-h-screen bg-netflix-dark"
          >
            <Navbar />
            <HeroBanner />
            <MemoryGallery />
            <LoveStats />
            <Timeline />
            <VideoSection />
            <LoveLetter />
            <BirthdayFinale />
            <Credits />
          </motion.main>
        )}
      </AnimatePresence>
    </>
  );
}
