import { ReactNode } from 'react'

export interface FooterProps {
  socialLinks?: SocialLink[]
  showCopyright?: boolean
  customContent?: ReactNode
}

export interface SocialLink {
  platform: string
  url: string
  icon: ReactNode
  displayName: string
}