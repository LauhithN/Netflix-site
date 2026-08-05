"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";

export default function ProgressBar() {
  const [progress, setProgress] = useState(0);

  // Smooth the scroll progress using a framer-motion spring
  const smoothProgress = useSpring(progress, {
    stiffness: 120,
    damping: 25,
    mass: 0.5,
  });

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      
      // Prevent division by zero and cap between 0-100
      if (scrollHeight > 0) {
        setProgress(Math.min(100, Math.max(0, (scrollY / scrollHeight) * 100)));
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Initial calculate
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Map the smooth 0-100 spring value to a percentage string for the width property
  const width = useTransform(smoothProgress, (value) => `${value}%`);

  return (
    <div
      aria-hidden="true"
      className="fixed left-0 right-0 top-0 z-[999] h-1 bg-transparent"
    >
      <motion.div
        className="h-full origin-left"
        style={{
          width,
          background: "linear-gradient(90deg, #E50914 0%, #E91E8C 50%, #F5C518 100%)",
          boxShadow: "0 0 10px rgba(229,9,20,0.5)",
        }}
      />
    </div>
  );
}
