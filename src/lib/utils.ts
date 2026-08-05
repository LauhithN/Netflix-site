import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import dayjs from "dayjs";

/**
 * Merge Tailwind classes — prevents conflicting utilities.
 * @example cn("px-4 py-2", isActive && "bg-netflix-red", className)
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Promise-based setTimeout wrapper.
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Clamp a number between min and max.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Random number in range [min, max).
 */
export function random(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

/**
 * Format a date string to "Month Day, Year" using en-IN locale.
 * @example formatDate("2024-04-17") → "April 17, 2024"
 */
export function formatDate(dateString: string): string {
  return dayjs(dateString).toDate().toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Calculate the number of days between two dates.
 * Defaults to today if date2 is omitted.
 */
export function daysBetween(date1: string, date2?: string): number {
  const d1 = dayjs(date1);
  const d2 = date2 ? dayjs(date2) : dayjs();
  return Math.abs(d2.diff(d1, "day"));
}

/**
 * Check if today matches the month+day of a given birthday string.
 */
export function isBirthday(birthdayDate: string): boolean {
  const today = dayjs();
  const bday = dayjs(birthdayDate);
  return today.month() === bday.month() && today.date() === bday.date();
}

/**
 * Map a value from one range to another.
 * @example mapRange(50, 0, 100, 0, 1) → 0.5
 */
export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}
