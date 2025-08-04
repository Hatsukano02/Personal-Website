'use client'

import { useState, useEffect, useRef } from 'react'

export interface ScrollState {
  scrollY: number
  scrollDirection: 'up' | 'down' | null
  activeSection: string
  isScrolling: boolean
}

export interface UseScrollOptions {
  throttle?: number
  threshold?: number
  sections?: string[]
}

export const useScroll = (options: UseScrollOptions = {}): ScrollState => {
  const { throttle = 16, sections = [] } = options
  
  const [scrollState, setScrollState] = useState<ScrollState>({
    scrollY: 0,
    scrollDirection: null,
    activeSection: '',
    isScrolling: false
  })

  const lastScrollY = useRef(0)
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    let ticking = false

    const updateScrollState = () => {
      const currentScrollY = window.scrollY
      const direction = currentScrollY > lastScrollY.current ? 'down' : 'up'
      
      // Find active section
      let activeSection = ''
      if (sections.length > 0) {
        for (const sectionId of sections) {
          const element = document.getElementById(sectionId)
          if (element) {
            const rect = element.getBoundingClientRect()
            if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
              activeSection = sectionId
              break
            }
          }
        }
      }

      setScrollState(prev => {
        // Only update if values have changed
        if (
          prev.scrollY !== currentScrollY ||
          prev.scrollDirection !== direction ||
          prev.activeSection !== activeSection ||
          prev.isScrolling !== true
        ) {
          return {
            scrollY: currentScrollY,
            scrollDirection: direction,
            activeSection,
            isScrolling: true
          }
        }
        return prev
      })

      lastScrollY.current = currentScrollY
      ticking = false

      // Clear scrolling state after inactivity
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
      scrollTimeoutRef.current = setTimeout(() => {
        setScrollState(prev => ({ ...prev, isScrolling: false }))
      }, 150)
    }

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollState)
        ticking = true
      }
    }

    // Throttled scroll handler
    let lastCallTime = 0
    const throttledHandler = () => {
      const now = Date.now()
      if (now - lastCallTime >= throttle) {
        handleScroll()
        lastCallTime = now
      }
    }

    window.addEventListener('scroll', throttledHandler, { passive: true })
    
    // Don't call updateScrollState on initial mount to avoid infinite loop
    
    return () => {
      window.removeEventListener('scroll', throttledHandler)
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [throttle, sections])

  return scrollState
}