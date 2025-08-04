import { useEffect } from 'react'
import { cn } from '@/lib/utils/cn'
import type { PageWrapperProps } from './PageWrapper.types'

const PageWrapper = ({ 
  children, 
  className,
  title,
  description 
}: PageWrapperProps) => {
  // 更新页面元数据
  useEffect(() => {
    if (title) {
      document.title = `${title} - Li Xiang`
    }
    
    if (description) {
      const metaDescription = document.querySelector('meta[name="description"]')
      if (metaDescription) {
        metaDescription.setAttribute('content', description)
      }
    }
  }, [title, description])

  return (
    <div className={cn(
      'min-h-screen bg-light-background-primary dark:bg-dark-background-primary',
      'text-light-text-primary dark:text-dark-text-primary',
      'transition-colors duration-300',
      className
    )}>
      {children}
    </div>
  )
}

export default PageWrapper