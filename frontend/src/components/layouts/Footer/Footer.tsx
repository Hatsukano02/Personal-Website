'use client'

import { Typography } from '@/components/ui'
import { FooterProps } from './Footer.types'

const Footer = ({ 
  socialLinks = [], 
  showCopyright = true, 
  customContent 
}: FooterProps) => {
  return (
    <footer className="bg-light-background-secondary dark:bg-dark-background-secondary border-t border-light-border dark:border-dark-border">
      <div className="container mx-auto px-4 py-8">
        {/* Social Links */}
        {socialLinks.length > 0 && (
          <div className="flex justify-center items-center space-x-6 mb-6">
            {socialLinks.map((link) => (
              <a
                key={link.platform}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-light-text-secondary dark:text-dark-text-secondary hover:text-light-primary dark:hover:text-dark-primary transition-colors duration-200"
                aria-label={`Visit ${link.displayName}`}
              >
                {link.icon}
                <span className="hidden sm:inline">{link.displayName}</span>
              </a>
            ))}
          </div>
        )}

        {/* Custom Content */}
        {customContent && (
          <div className="text-center mb-6">
            {customContent}
          </div>
        )}

        {/* Copyright */}
        {showCopyright && (
          <div className="text-center">
            <Typography 
              variant="caption" 
              className="text-light-text-muted dark:text-dark-text-muted"
            >
              © {new Date().getFullYear()} Li Xiang. All rights reserved.
            </Typography>
          </div>
        )}
      </div>
    </footer>
  )
}

export default Footer