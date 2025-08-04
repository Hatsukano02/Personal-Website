'use client'

import { cn } from '@/lib/utils'

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'accent' | 'subtle'
}

export default function GlassCard({ 
  children, 
  className = '', 
  variant = 'default' 
}: GlassCardProps) {
  const getVariantClasses = () => {
    switch (variant) {
      case 'accent':
        return 'bg-white/10 dark:bg-white/5 border-white/30 dark:border-white/20'
      case 'subtle':
        return 'bg-white/5 dark:bg-white/3 border-white/20 dark:border-white/10'
      default:
        return 'bg-white/15 dark:bg-white/8 border-white/25 dark:border-white/15'
    }
  }

  return (
    <div 
      className={cn(
        // 基础毛玻璃效果
        'backdrop-blur-md',
        // 边框和背景
        'border rounded-xl',
        // 阴影效果
        'shadow-lg shadow-black/5 dark:shadow-black/20',
        // 变体样式
        getVariantClasses(),
        // 自定义类名
        className
      )}
    >
      {children}
    </div>
  )
}