import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        netflix: {
          red: "#E50914",
          dark: "#141414",
        },
        rose: {
          glow: "#E91E8C",
        },
        gold: {
          warm: "#F5C518",
        },
        surface: {
          DEFAULT: "#1A1A1A",
          hover: "#242424",
        },
      },
      fontFamily: {
        display: ["var(--font-bebas)"],
        body: ["var(--font-inter)"],
        serif: ["var(--font-playfair)"],
      },
      backgroundImage: {
        "hero-gradient":
          "linear-gradient(to right, rgba(20,20,20,0.95), transparent)",
        "card-overlay":
          "linear-gradient(to top, rgba(0,0,0,0.9), transparent)",
        "section-fade-up":
          "linear-gradient(to top, #141414, transparent)",
      },
      zIndex: {
        intro: "100",
        nav: "80",
        overlay: "70",
      },
      screens: {
        tv: "1920px",
      },
    },
  },
  plugins: [],
};

export default config;
