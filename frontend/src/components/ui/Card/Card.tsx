'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils/cn'
import { CardProps } from './Card.types'
import styles from './Card.module.css'

const Card = forwardRef<HTMLDivElement, CardProps>(({
  variant = 'default',
  children,
  className,
  onClick,
  isInteractive = false,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        styles.card,
        styles[variant],
        (isInteractive || onClick) && styles.interactive,
        className
      )}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      {...props}
    >
      {children}
    </div>
  )
})

Card.displayName = 'Card'

export default Card