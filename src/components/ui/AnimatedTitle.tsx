"use client";

import { Fragment, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";
import { shouldSimplifyMotion } from "@/lib/device";

interface AnimatedTitleProps {
  text: string;
  className?: string;
  as?: React.ElementType;
}

/**
 * Letter-by-letter reveal. Each word is wrapped so lines can only break
 * between words (no more "SO F / AR"), only this title's characters are
 * animated, the reveal runs once, and reduced-motion / TV users get static text.
 */
export function AnimatedTitle({
  text,
  className,
  as: Component = "h2",
}: AnimatedTitleProps) {
  const containerRef = useRef<HTMLElement>(null);
  const words = text.split(" ");

  useGSAP(
    () => {
      const el = containerRef.current;
      if (!el) return;
      const chars = el.querySelectorAll<HTMLElement>(".animated-char");
      if (chars.length === 0) return;

      if (shouldSimplifyMotion()) {
        gsap.set(chars, { opacity: 1, y: 0 });
        return;
      }

      gsap.registerPlugin(ScrollTrigger);
      gsap.fromTo(
        chars,
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.025,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
            once: true,
          },
        }
      );
    },
    { scope: containerRef }
  );

  return (
    <Component
      ref={containerRef}
      className={cn("overflow-hidden", className)}
      aria-label={text}
    >
      {words.map((word, wordIndex) => (
        <Fragment key={wordIndex}>
          <span className="inline-block whitespace-nowrap" aria-hidden="true">
            {Array.from(word).map((char, charIndex) => (
              <span
                key={charIndex}
                className="animated-char inline-block opacity-0 will-change-[transform,opacity]"
              >
                {char}
              </span>
            ))}
          </span>
          {/* A real space between word spans keeps normal word gaps and line-break points */}
          {wordIndex < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </Component>
  );
}
