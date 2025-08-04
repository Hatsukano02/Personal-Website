import { ReactNode } from 'react'

export interface CardProps {
  variant?: 'default' | 'hover' | 'featured' | 'glass'
  children: ReactNode
  className?: string
  onClick?: () => void
  isInteractive?: boolean
}