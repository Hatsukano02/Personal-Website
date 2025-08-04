'use client'

import React, { forwardRef } from 'react'
import { cn } from '@/lib/utils/cn'
import { TypographyProps, typographyConfig } from './Typography.types'

// Helper function to get the default element for each variant
const getDefaultElement = (variant: TypographyProps['variant']): keyof React.JSX.IntrinsicElements => {
  switch (variant) {
    case 'h1':
    case 'h2':
    case 'h3':
    case 'h4':
    case 'h5':
    case 'h6':
      return variant
    case 'code':
      return 'code'
    default:
      return 'p'
  }
}

const Typography = forwardRef<HTMLElement, TypographyProps>(({
  variant,
  children,
  className,
  as,
  ...props
}, ref) => {
  const Component = as || getDefaultElement(variant)
  const classes = cn(typographyConfig[variant], className)

  return React.createElement(
    Component,
    {
      ref,
      className: classes,
      ...props
    },
    children
  )
})

Typography.displayName = 'Typography'

export default Typography