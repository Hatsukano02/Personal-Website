export type Language = "zh" | "en";

export interface LanguageOption {
  value: Language;
  label: string;
  shortLabel: string;
}

export interface LanguageControlsProps {
  className?: string;
}