import { ReactNode } from 'react'

export interface SectionWrapperProps {
  id: string
  className?: string
  children: ReactNode
  backgroundVariant?: 'gradient' | 'solid' | 'transparent'
}