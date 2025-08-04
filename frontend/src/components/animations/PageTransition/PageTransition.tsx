'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils/cn'
import type { PageTransitionProps } from './PageTransition.types'

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20
  },
  in: {
    opacity: 1,
    y: 0
  },
  out: {
    opacity: 0,
    y: -20
  }
}

const pageTransition = {
  type: 'tween' as const,
  ease: 'anticipate' as const,
  duration: 0.4
}

const PageTransition = ({ 
  children, 
  className,
  duration = 0.4,
  delay = 0 
}: PageTransitionProps) => {
  const pathname = usePathname()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={{
          ...pageTransition,
          duration,
          delay
        }}
        className={cn('page-transition-wrapper', className)}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

export default PageTransition