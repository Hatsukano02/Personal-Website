import { ReactNode } from 'react'

export interface TypographyProps {
  variant: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body' | 'caption' | 'code'
  children: ReactNode
  className?: string
  as?: keyof React.JSX.IntrinsicElements
}

export const typographyConfig = {
  h1: 'text-4xl md:text-6xl font-bold tracking-tight',
  h2: 'text-3xl md:text-5xl font-bold tracking-tight',
  h3: 'text-2xl md:text-4xl font-semibold',
  h4: 'text-xl md:text-2xl font-semibold',
  h5: 'text-lg md:text-xl font-medium',
  h6: 'text-base md:text-lg font-medium',
  body: 'text-base leading-relaxed',
  caption: 'text-sm text-light-text-muted dark:text-dark-text-muted',
  code: 'font-mono text-sm bg-light-background-tertiary dark:bg-dark-background-tertiary px-2 py-1 rounded'
}