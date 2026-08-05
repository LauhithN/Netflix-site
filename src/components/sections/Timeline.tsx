"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { TIMELINE_EVENTS } from "@/data/content";
import {
  timelineItemVariants,
  staggerContainer,
  fadeInUp,
} from "@/lib/animations";
import { cn } from "@/lib/utils";
import { AnimatedTitle } from "@/components/ui/AnimatedTitle";

export default function Timeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);
      gsap.fromTo(
        lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          transformOrigin: "top",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top center",
            end: "bottom 80%",
            scrub: true,
          },
        }
      );
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="timeline"
      className="relative bg-black/40 px-8 py-24 md:px-16"
    >
      {/* ── Section Title ────────────────────────────────────────── */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
        className="mb-16 text-center"
      >
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.3em] text-netflix-red">
          Our Journey
        </p>
        <AnimatedTitle
          text="THE STORY SO FAR"
          className="font-display text-4xl tracking-wide text-white md:text-6xl"
        />
      </motion.div>

      {/* ── Timeline Container ───────────────────────────────────── */}
      <div className="relative mx-auto max-w-3xl">
        {/* Vertical Line */}
        <div 
          ref={lineRef}
          className="absolute bottom-0 left-6 top-0 w-px bg-gradient-to-b from-netflix-red via-rose-glow to-transparent md:left-[27px]" 
        />

        {/* Timeline Events */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="space-y-12"
        >
          {TIMELINE_EVENTS.map((event) => (
            <motion.div
              key={event.id}
              variants={timelineItemVariants}
              className="relative flex gap-8 pl-16 md:pl-20"
            >
              {/* Dot */}
              <div
                className={cn(
                  "absolute left-6 top-1.5 h-4 w-4 -translate-x-1/2 rounded-full border-2 md:left-[27px]",
                  event.isSpecial
                    ? "border-netflix-red bg-netflix-red shadow-[0_0_15px_rgba(229,9,20,0.6)]"
                    : "border-white/30 bg-netflix-dark"
                )}
                aria-hidden="true"
              />

              {/* Content */}
              <div className="flex flex-col">
                <span className="mb-1 font-body text-xs uppercase tracking-widest text-netflix-red">
                  {event.date}
                </span>
                <h3 className="mb-2 font-display text-xl tracking-wide text-white md:text-2xl">
                  {event.title} {event.emoji}
                </h3>
                <p className="font-body text-sm leading-relaxed text-white/60">
                  {event.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
