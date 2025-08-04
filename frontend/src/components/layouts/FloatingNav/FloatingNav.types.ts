import { LucideIcon } from 'lucide-react'

export interface NavigationItem {
  id: string
  label: string
  sectionId: string
  icon: LucideIcon
  isVisible: boolean
}

export interface FloatingNavProps {
  className?: string
}

export interface NavItemStyles {
  fontSize: number
  fontWeight: number
  fontStretch: number
  opacity: number
  scale: number
}