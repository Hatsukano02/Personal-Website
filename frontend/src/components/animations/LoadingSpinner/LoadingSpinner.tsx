import { motion } from 'framer-motion'
import { cn } from '@/lib/utils/cn'
import type { LoadingSpinnerProps } from './LoadingSpinner.types'

const sizeClasses = {
  sm: 'w-6 h-6',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16'
}

const colorClasses = {
  primary: 'text-light-primary dark:text-dark-primary',
  secondary: 'text-light-text-secondary dark:text-dark-text-secondary',
  white: 'text-white'
}

const LoadingSpinner = ({ 
  size = 'md', 
  color = 'primary',
  className,
  fullScreen = false
}: LoadingSpinnerProps) => {
  const spinnerContent = (
    <motion.div
      className={cn(
        'relative',
        sizeClasses[size],
        colorClasses[color],
        className
      )}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: 'linear'
      }}
    >
      <svg
        className="w-full h-full"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </motion.div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-light-background-primary/80 dark:bg-dark-background-primary/80 backdrop-blur-sm z-50">
        {spinnerContent}
      </div>
    )
  }

  return spinnerContent
}

export default LoadingSpinner