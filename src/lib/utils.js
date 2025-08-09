// src/lib/utils.js
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * دالة مساعدة لدمج فئات CSS بشكل شرطي ودمج فئات Tailwind CSS بشكل ذكي.
 * @param {ClassValue[]} inputs
 * @returns {string}
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
