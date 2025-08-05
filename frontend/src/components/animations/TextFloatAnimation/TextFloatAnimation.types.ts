export type TextFloatPreset = 'quick' | 'grand' | 'typewriter';

export interface TextFloatAnimationProps {
  text: string;
  preset?: TextFloatPreset;
  className?: string;
  onComplete?: () => void;
  autoStart?: boolean;
  triggerOnVisible?: boolean;
}

export interface PresetConfig {
  duration: number;
  charDelay: number;
  distance: number;
  blurStart: number;
  easing: string;
}

export interface PresetConfigs {
  quick: PresetConfig;
  grand: PresetConfig;
  typewriter: PresetConfig;
}