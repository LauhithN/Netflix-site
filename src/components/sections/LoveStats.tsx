"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { LOVE_STATS } from "@/data/content";
import { staggerContainer, statCardVariants } from "@/lib/animations";
import { useLiveStats } from "@/hooks";

export default function LoveStats() {
  return (
    <section className="bg-netflix-dark px-8 py-20 md:px-16">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="mx-auto grid max-w-6xl grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6"
      >
        {LOVE_STATS.map((stat, i) => (
          <StatCard key={stat.label} stat={stat} delay={i * 0.1} />
        ))}
      </motion.div>
    </section>
  );
}

// ─── Subcomponent ───────────────────────────────────────────────────────────

function StatCard({
  stat,
  delay,
}: {
  stat: (typeof LOVE_STATS)[0];
  delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const done = useRef(false);
  const [count, setCount] = useState(0);
  const { daysTogether, hasMounted } = useLiveStats();
  
  // Resolve the target value depending on if it's the live stat
  const targetValue = stat.label === "Days Together" && hasMounted ? daysTogether : (typeof stat.value === "number" ? stat.value : 0);

  useEffect(() => {
    const el = ref.current;
    if (!el || targetValue === 0) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !done.current) {
          done.current = true;
          observer.disconnect();

          const duration = 1800; // ms
          const totalSteps = 60;
          const stepTime = duration / totalSteps;
          let current = 0;

          const interval = setInterval(() => {
            current++;
            const progress = current / totalSteps;
            const eased = 1 - Math.pow(1 - progress, 3); // cubic ease-out
            setCount(Math.round(targetValue * eased));

            if (current >= totalSteps) {
              setCount(targetValue);
              clearInterval(interval);
            }
          }, stepTime);
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [stat.value, targetValue]);

  return (
    <motion.div
      ref={ref}
      variants={statCardVariants}
      className="flex flex-col items-center justify-center rounded-lg border border-white/5 bg-surface p-4 text-center shadow-lg"
    >
      <span className="mb-2 text-2xl" aria-hidden="true">
        {stat.emoji}
      </span>
      <span className="font-display text-3xl text-netflix-red">
        {count}
        {stat.suffix}
      </span>
      <span className="mt-2 font-body text-[10px] leading-tight tracking-widest text-white/40 uppercase">
        {stat.label}
      </span>
    </motion.div>
  );
}
