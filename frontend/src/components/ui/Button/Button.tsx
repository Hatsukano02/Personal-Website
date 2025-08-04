'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils/cn'
import { ButtonProps } from './Button.types'
import styles from './Button.module.css'

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className,
  children,
  disabled,
  ...props
}, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        styles.button,
        styles[variant],
        styles[size],
        isLoading && styles.loading,
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <div className={styles.spinner} />
      ) : (
        leftIcon && <span>{leftIcon}</span>
      )}
      {children}
      {!isLoading && rightIcon && <span>{rightIcon}</span>}
    </button>
  )
})

Button.displayName = 'Button'

export default Button