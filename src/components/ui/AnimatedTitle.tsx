"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";

// Register ScrollTrigger
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface AnimatedTitleProps {
  text: string;
  className?: string;
  as?: React.ElementType;
}

export function AnimatedTitle({
  text,
  className,
  as: Component = "h2",
}: AnimatedTitleProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Split text into characters, preserving spaces
  const chars = text.split("").map((char, index) => {
    if (char === " ") {
      return (
        <span key={index} className="inline-block whitespace-pre">
          {" "}
        </span>
      );
    }
    return (
      <span
        key={index}
        className="inline-block opacity-0 translate-y-4 will-change-[transform,opacity] animated-char"
      >
        {char}
      </span>
    );
  });

  useGSAP(
    () => {
      const charElements = gsap.utils.toArray<HTMLElement>(".animated-char");

      if (charElements.length === 0) return;

      gsap.to(charElements, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.03,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%", // Start animating when the top of the element hits 85% of the viewport height
          toggleActions: "play none none reverse", // Play forward when entering, reverse when leaving
        },
      });
    },
    { scope: containerRef }
  );

  return (
    <Component
      ref={containerRef}
      className={cn("overflow-hidden", className)}
      aria-label={text}
    >
      {chars}
    </Component>
  );
}
