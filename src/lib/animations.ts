import { type Variants } from "framer-motion";

// ─── Generic Fade / Slide Variants ──────────────────────────────────────────

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.3 },
  },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 1, 0.5, 1] },
  },
};

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: [0.25, 1, 0.5, 1] },
  },
};

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: [0.25, 1, 0.5, 1] },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: [0.34, 1.56, 0.64, 1] },
  },
};

// ─── Intro Screen Variants ──────────────────────────────────────────────────

export const introLogoVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.6,
    filter: "blur(20px)",
  },
  visible: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 1, ease: [0.25, 1, 0.5, 1] },
  },
  glow: {
    scale: [1, 1.03, 1],
    filter: [
      "drop-shadow(0 0 20px rgba(229,9,20,0.6))",
      "drop-shadow(0 0 60px rgba(229,9,20,0.9))",
      "drop-shadow(0 0 20px rgba(229,9,20,0.6))",
    ],
    transition: { duration: 2, ease: "easeInOut", repeat: Infinity },
  },
  exit: {
    opacity: 0,
    scale: 1.4,
    filter: "blur(10px)",
    transition: { duration: 0.6, ease: "easeIn" },
  },
};

export const introScreenVariants: Variants = {
  visible: { opacity: 1 },
  exit: {
    opacity: 0,
    transition: { delay: 0.2, duration: 0.8, ease: "easeInOut" },
  },
};

// ─── Profile Select Variants ────────────────────────────────────────────────

export const profileContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

export const profileCardVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20,
    },
  },
};

// ─── Stagger (Generic) ─────────────────────────────────────────────────────

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

// ─── Hero Variants ──────────────────────────────────────────────────────────

export const heroContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.5,
    },
  },
};

export const heroTitleVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.215, 0.61, 0.355, 1] },
  },
};

// ─── Card Hover Variants ────────────────────────────────────────────────────

export const cardHoverVariants: Variants = {
  rest: {
    scale: 1,
    zIndex: 1,
    transition: { duration: 0.2, ease: "easeOut" },
  },
  hover: {
    scale: 1.08,
    y: -8,
    zIndex: 10,
    transition: { duration: 0.2, ease: "easeOut" },
  },
};

export const cardPreviewVariants: Variants = {
  rest: {
    opacity: 0,
    y: 16,
    height: 0,
    transition: { duration: 0.2 },
  },
  hover: {
    opacity: 1,
    y: 0,
    height: "auto",
    transition: { duration: 0.2, delay: 0.05 },
  },
};

// ─── Timeline Variants ──────────────────────────────────────────────────────

export const timelineItemVariants: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

// ─── Navbar Variants ────────────────────────────────────────────────────────

export const navbarVariants: Variants = {
  transparent: {
    backgroundColor: "rgba(0,0,0,0)",
    backdropFilter: "blur(0px)",
    transition: { duration: 0.3 },
  },
  solid: {
    backgroundColor: "rgba(20,20,20,0.95)",
    backdropFilter: "blur(12px)",
    transition: { duration: 0.3 },
  },
};

// ─── Stat Card Variants ─────────────────────────────────────────────────────

export const statCardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 18,
    },
  },
};
