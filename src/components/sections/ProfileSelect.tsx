"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { PROFILES, SITE_CONFIG, PROFILE_STREAMING_BADGE } from "@/data/content";
import { getBirthdayStatus, getAge } from "@/lib/birthday";
import {
  profileContainerVariants,
  profileCardVariants,
  fadeIn,
} from "@/lib/animations";
import { sleep } from "@/lib/utils";
import { isSmartTV } from "@/lib/device";

interface ProfileSelectProps {
  onSelect: () => void;
}

const CONFETTI_COLORS = ["#E50914", "#E91E8C", "#F5C518", "#FF6B9D", "#fff"];

export default function ProfileSelect({ onSelect }: ProfileSelectProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [isExiting, setIsExiting] = useState(false);
  const [status, setStatus] = useState<"today" | "future" | "past" | null>(null);
  const [tvMode, setTvMode] = useState(false);

  useEffect(() => {
    setStatus(getBirthdayStatus());
    setTvMode(isSmartTV());
  }, []);

  const handleSelect = async (profileId: string) => {
    if (selected) return;
    setSelected(profileId);

    const profile = PROFILES.find((p) => p.id === profileId);

    if (profile?.isMain && !tvMode) {
      const confetti = (await import("canvas-confetti")).default;

      confetti({
        particleCount: 120,
        spread: 80,
        origin: { x: 0.5, y: 0.6 },
        colors: CONFETTI_COLORS,
      });

      setTimeout(() => {
        confetti({
          particleCount: 60,
          spread: 50,
          origin: { x: 0.3, y: 0.5 },
          colors: CONFETTI_COLORS,
        });
      }, 300);

      setTimeout(() => {
        confetti({
          particleCount: 60,
          spread: 50,
          origin: { x: 0.7, y: 0.5 },
          colors: CONFETTI_COLORS,
        });
      }, 600);
    }

    await sleep(tvMode ? 900 : 1800);
    setIsExiting(true);
    await sleep(600);
    onSelect();
  };

  const avatarSize = tvMode
    ? "h-40 w-40 md:h-44 md:w-44"
    : "h-28 w-28 md:h-32 md:w-32";

  return (
    <AnimatePresence>
      {!isExiting ? (
        <motion.div
          key="profile-select"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-intro flex flex-col items-center justify-center bg-netflix-dark px-4"
        >
          {status === "today" && (
            <motion.div
              className="mb-10 mx-4 max-w-sm text-center"
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
              style={{
                background: "rgba(229, 9, 20, 0.08)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1px solid rgba(229, 9, 20, 0.25)",
                borderRadius: "16px",
                padding: "20px 24px",
              }}
            >
              <p style={{ fontSize: 32, marginBottom: 8 }}>🎂</p>
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(18px, 5vw, 26px)",
                  color: "#ffffff",
                  letterSpacing: "0.08em",
                  marginBottom: 6,
                }}
              >
                HAPPY BIRTHDAY, {SITE_CONFIG.herName.toUpperCase()}!
              </p>
              <p
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: 13,
                  color: "rgba(255,255,255,0.5)",
                  fontStyle: "italic",
                  lineHeight: 1.6,
                }}
              >
                You&apos;re {getAge()} today and more loved than ever.
              </p>
            </motion.div>
          )}

          {status !== "today" && status !== null && (
            <motion.div
              className="mb-8 mx-4 max-w-sm text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              style={{
                background: "rgba(255,255,255,0.04)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "12px",
                padding: "14px 22px",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 11,
                  color: "rgba(255,255,255,0.55)",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  marginBottom: 6,
                }}
              >
                {PROFILE_STREAMING_BADGE.headline}
              </p>
              <p
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: 12,
                  color: "rgba(255,255,255,0.35)",
                  fontStyle: "italic",
                  letterSpacing: "0.04em",
                }}
              >
                {PROFILE_STREAMING_BADGE.subline}
              </p>
            </motion.div>
          )}

          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
            className="mb-12 font-display text-3xl tracking-widest text-white md:text-5xl"
          >
            WHO&apos;S WATCHING?
          </motion.h2>

          <motion.div
            variants={profileContainerVariants}
            initial="hidden"
            animate="visible"
            className={`flex flex-wrap items-center justify-center ${tvMode ? "gap-10 md:gap-14" : "gap-6 md:gap-8"}`}
          >
            {PROFILES.map((profile) => {
              const isSelected = selected === profile.id;
              const image = "image" in profile ? profile.image : undefined;

              return (
                <motion.button
                  key={profile.id}
                  variants={profileCardVariants}
                  onClick={() => handleSelect(profile.id)}
                  disabled={!!selected}
                  className="group flex min-h-[44px] flex-col items-center gap-3 focus:outline-none focus-visible:ring-4 focus-visible:ring-netflix-red/60 focus-visible:ring-offset-4 focus-visible:ring-offset-netflix-dark rounded-md"
                  whileHover={!selected ? { scale: 1.05 } : undefined}
                  whileTap={!selected ? { scale: 0.97 } : undefined}
                  tabIndex={0}
                >
                  <motion.div
                    className={`relative flex items-center justify-center overflow-hidden rounded-md ${avatarSize}`}
                    style={{
                      background: `linear-gradient(135deg, ${profile.color}33, ${profile.color}11)`,
                      border: `3px solid ${profile.color}70`,
                    }}
                    animate={
                      isSelected
                        ? {
                            borderColor: profile.color,
                            boxShadow: `0 0 30px ${profile.color}60, 0 0 60px ${profile.color}30`,
                            scale: 1.05,
                          }
                        : {}
                    }
                    transition={{ duration: 0.3 }}
                  >
                    {image ? (
                      <Image
                        src={image}
                        alt={profile.name}
                        fill
                        className="object-cover"
                        sizes="176px"
                        priority
                      />
                    ) : (
                      <span className="text-6xl">{profile.emoji}</span>
                    )}

                    <motion.div
                      className="absolute inset-0"
                      style={{ backgroundColor: `${profile.color}26` }}
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  </motion.div>

                  <motion.span
                    className={`font-medium uppercase tracking-widest ${tvMode ? "text-base md:text-lg" : "text-sm"}`}
                    animate={{
                      color: isSelected ? profile.color : "rgba(255,255,255,0.5)",
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {profile.name}
                  </motion.span>

                  <AnimatePresence>
                    {isSelected && (
                      <motion.span
                        initial={{ opacity: 0, y: 6, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: "auto" }}
                        exit={{ opacity: 0, y: -4, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="text-xs tracking-wider"
                        style={{ color: `${profile.color}cc` }}
                      >
                        {profile.hint}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              );
            })}
          </motion.div>

          <motion.p
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            transition={{ delay: 1 }}
            className="mt-16 text-xs uppercase tracking-widest text-white/20 md:text-sm"
          >
            Choose your profile to continue
          </motion.p>
        </motion.div>
      ) : (
        <motion.div
          key="profile-exit"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-intro bg-netflix-dark"
        />
      )}
    </AnimatePresence>
  );
}
