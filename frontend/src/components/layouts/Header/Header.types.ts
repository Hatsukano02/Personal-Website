import { ReactNode } from 'react'

export interface HeaderProps {
  variant?: 'transparent' | 'solid' | 'glass'
  showLogo?: boolean
  navigationItems?: NavigationItem[]
}

export interface NavigationItem {
  id: string
  label: string
  href: string
  icon?: ReactNode
  isActive?: boolean
}

export const headerVariants = {
  transparent: 'bg-transparent',
  solid: 'bg-light-background-primary dark:bg-dark-background-primary shadow-sm',
  glass: 'bg-white/10 backdrop-blur-md border-b border-white/20 dark:bg-black/10 dark:border-black/20'
}