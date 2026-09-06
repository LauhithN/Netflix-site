"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

import IntroScreen from "@/components/sections/IntroScreen";
import ProfileSelect from "@/components/sections/ProfileSelect";
import HeroBanner from "@/components/sections/HeroBanner";
import Navbar from "@/components/layout/Navbar";
import FloatingPetals from "@/components/ui/FloatingPetals";
import ProgressBar from "@/components/ui/ProgressBar";
import dynamic from "next/dynamic";
import { shouldSimplifyMotion } from "@/lib/device";

const LoaderFallback = () => (
  <div className="h-screen w-full bg-netflix-dark animate-pulse flex items-center justify-center">
    <div className="w-12 h-12 rounded-full border-4 border-netflix-red/20 border-t-netflix-red animate-spin" />
  </div>
);

const MemoryGallery = dynamic(() => import("@/components/sections/MemoryGallery"), { loading: LoaderFallback, ssr: false });
const LoveStats = dynamic(() => import("@/components/sections/LoveStats"), { ssr: false });
const Timeline = dynamic(() => import("@/components/sections/Timeline"), { loading: LoaderFallback, ssr: false });
const VideoSection = dynamic(() => import("@/components/sections/VideoSection"), { loading: LoaderFallback, ssr: false });
const LoveLetter = dynamic(() => import("@/components/sections/LoveLetter"), { loading: LoaderFallback, ssr: false });
const BirthdayFinale = dynamic(() => import("@/components/sections/BirthdayFinale"), { ssr: false });
const Credits = dynamic(() => import("@/components/sections/Credits"), { ssr: false });

type AppState = "intro" | "profile" | "main";

export default function HomePage() {
  const [appState, setAppState] = useState<AppState>("intro");
  const [isMounted, setIsMounted] = useState(false);
  const [showPetals, setShowPetals] = useState(false);

  // Hydration guard
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Show petals 3s after entering main state (skip on TV / reduced motion)
  useEffect(() => {
    if (appState !== "main") return;
    if (shouldSimplifyMotion()) return;

    const timer = setTimeout(() => {
      setShowPetals(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, [appState]);

  if (!isMounted) return null;

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
            className="relative bg-netflix-dark min-h-screen"
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
