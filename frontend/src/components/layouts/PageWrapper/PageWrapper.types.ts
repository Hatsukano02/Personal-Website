import { ReactNode } from 'react'

export interface PageWrapperProps {
  children: ReactNode
  className?: string
  title?: string
  description?: string
}