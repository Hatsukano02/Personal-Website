import { ReactNode } from 'react'

export interface ScrollTriggerProps {
  children: ReactNode
  className?: string
  animation?: 'fadeIn' | 'slideUp' | 'slideLeft' | 'slideRight' | 'scale' | 'rotate'
  duration?: number
  delay?: number
  start?: string
  end?: string
  markers?: boolean
  scrub?: boolean | number
  pin?: boolean
  onEnter?: () => void
  onLeave?: () => void
  onEnterBack?: () => void
  onLeaveBack?: () => void
}