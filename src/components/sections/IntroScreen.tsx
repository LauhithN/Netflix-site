"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { SITE_CONFIG } from "@/data/content"

interface IntroScreenProps {
  onComplete: () => void
}

export default function IntroScreen({ onComplete }: IntroScreenProps) {
  const [isZooming, setIsZooming] = useState(false)

  const handleClick = () => {
    if (isZooming) return;
    setIsZooming(true);

    // Play sound on click
    try {
      const audio = new Audio(SITE_CONFIG.introSoundUrl);
      audio.play().catch(e => console.log("Audio playback deferred or failed:", e));
    } catch (e) {
      console.log(e);
    }

    // Call onComplete after the zoom animation duration
    setTimeout(() => {
      onComplete();
    }, 1200);
  }

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-black overflow-hidden flex flex-col items-center justify-center cursor-pointer"
      onClick={handleClick}
      animate={{ opacity: isZooming ? 0 : 1 }}
      transition={{ duration: 0.4, delay: 0.8 }} // Fade out the bg at the end of the zoom
    >
      <motion.div
        animate={
          isZooming 
            ? { scale: 30, opacity: 0 } 
            : { scale: 1, opacity: 1 }
        }
        transition={{ 
          duration: isZooming ? 1.2 : 2, 
          ease: isZooming ? "easeIn" : "easeOut" 
        }}
        initial={{ scale: 0.8, opacity: 0 }}
        className="relative flex items-center justify-center"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/hero-logo.png"
          alt="Logo"
          className="h-20 md:h-32 w-auto object-contain filter drop-shadow-[0_0_20px_rgba(229,9,20,0.6)]"
        />
      </motion.div>

      {/* Helper text underneath, fades out instantly on click */}
      {!isZooming && (
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-20 text-white/40 text-xs tracking-widest uppercase font-body text-center"
        >
          Click to enter
        </motion.p>
      )}
    </motion.div>
  )
}
