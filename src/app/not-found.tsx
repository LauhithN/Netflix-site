"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-netflix-dark text-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h1 className="font-display text-8xl text-netflix-red drop-shadow-[0_0_15px_rgba(229,9,20,0.5)]">
          404
        </h1>
        <h2 className="mt-4 font-display text-2xl tracking-widest text-white md:text-3xl">
          LOST YOUR WAY?
        </h2>
        <p className="mt-4 max-w-md font-body text-white/60">
          Sorry, we couldn&apos;t find that page. You&apos;ll find lots to explore on the home page.
        </p>
        
        <Link
          href="/"
          className="mx-auto mt-10 flex w-fit items-center gap-2 rounded bg-white px-8 py-3 font-semibold text-black transition-transform hover:scale-105"
        >
          Netflix Home
        </Link>
      </motion.div>
    </div>
  );
}
