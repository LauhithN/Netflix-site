"use client";

import { useEffect, useState, useCallback } from "react";
import { PETAL_CONFIG } from "@/data/content";
import { random } from "@/lib/utils";

interface Petal {
  id: number;
  emoji: string;
  x: number;
  size: number;
  duration: number;
  delay: number;
}

let petalIdCounter = 0;

export default function FloatingPetals() {
  const [petals, setPetals] = useState<Petal[]>([]);

  const spawnPetal = useCallback((): Petal => {
    return {
      id: ++petalIdCounter,
      emoji:
        PETAL_CONFIG.emojis[
          Math.floor(Math.random() * PETAL_CONFIG.emojis.length)
        ],
      x: random(5, 95),
      size: random(PETAL_CONFIG.minSize, PETAL_CONFIG.maxSize),
      duration: random(PETAL_CONFIG.minDuration, PETAL_CONFIG.maxDuration),
      delay: random(0, 0.5),
    };
  }, []);

  useEffect(() => {
    // Initial batch
    setPetals(Array.from({ length: PETAL_CONFIG.count }, spawnPetal));

    // Continuous spawning
    const interval = setInterval(() => {
      setPetals((prev) => [...prev.slice(-15), spawnPetal()]);
    }, 2500);

    return () => clearInterval(interval);
  }, [spawnPetal]);

  const removePetal = (id: number) => {
    setPetals((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-50 overflow-hidden"
    >
      {petals.map((petal) => (
        <span
          key={petal.id}
          className="floating-heart absolute -top-[10%] opacity-0"
          style={
            {
              left: `${petal.x}%`,
              fontSize: `${petal.size}px`,
              "--duration": `${petal.duration}s`,
              "--delay": `${petal.delay}s`,
              "--x": `${petal.x}%`,
              "--size": `${petal.size}px`,
            } as React.CSSProperties
          }
          onAnimationEnd={() => removePetal(petal.id)}
        >
          {petal.emoji}
        </span>
      ))}
    </div>
  );
}
