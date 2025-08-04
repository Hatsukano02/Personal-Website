'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { cn } from '@/lib/utils/cn'
import { SectionWrapperProps } from './SectionWrapper.types'

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const SectionWrapper = ({ 
  id, 
  className, 
  children, 
  backgroundVariant = 'transparent' 
}: SectionWrapperProps) => {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section || typeof window === 'undefined') return

    // GSAP entrance animation
    const animation = gsap.fromTo(section.children, 
      { 
        opacity: 0, 
        y: 50 
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse'
        }
      }
    )

    return () => {
      animation.kill()
    }
  }, [])

  const backgroundClasses = {
    gradient: 'bg-gradient-to-br from-light-background-primary to-light-background-secondary dark:from-dark-background-primary dark:to-dark-background-secondary',
    solid: 'bg-light-background-primary dark:bg-dark-background-primary',
    transparent: 'bg-transparent'
  }

  return (
    <section
      ref={sectionRef}
      id={id}
      className={cn(
        'min-h-screen flex items-center justify-center scroll-section relative',
        backgroundClasses[backgroundVariant],
        'noise-texture',
        className
      )}
    >
      <div className="container mx-auto px-4 py-16">
        {children}
      </div>
    </section>
  )
}

export default SectionWrapper