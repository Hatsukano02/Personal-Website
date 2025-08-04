'use client'

import { cn } from '@/lib/utils/cn'
import { Typography } from '@/components/ui'
import { HeaderProps, headerVariants } from './Header.types'

const Header = ({ 
  variant = 'transparent', 
  showLogo = true, 
  navigationItems = [] 
}: HeaderProps) => {
  return (
    <header className={cn(
      'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
      headerVariants[variant]
    )}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {showLogo && (
            <div className="flex items-center">
              <Typography variant="h5" className="font-bold text-light-text-primary dark:text-dark-text-primary">
                Li Xiang
              </Typography>
            </div>
          )}
          
          {navigationItems.length > 0 && (
            <nav className="hidden md:flex items-center space-x-6">
              {navigationItems.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-lg transition-colors duration-200',
                    'hover:bg-light-background-secondary dark:hover:bg-dark-background-secondary',
                    item.isActive 
                      ? 'text-light-primary dark:text-dark-primary font-medium' 
                      : 'text-light-text-secondary dark:text-dark-text-secondary'
                  )}
                >
                  {item.icon && <span>{item.icon}</span>}
                  <span>{item.label}</span>
                </a>
              ))}
            </nav>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header