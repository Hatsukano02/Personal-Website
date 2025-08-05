import { en } from "./en";
import { zh } from "./zh";

export const translations = {
  en,
  zh,
} as const;

export type Language = keyof typeof translations;
export type TranslationKeys = typeof en;