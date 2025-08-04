export type ThemeMode = 'light' | 'dark' | 'auto'

export interface ThemeControlsProps {
  className?: string
}

export interface ThemeOption {
  value: ThemeMode
  label: string
  icon: React.ReactNode
}