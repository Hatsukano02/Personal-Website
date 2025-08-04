'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger as GSAPScrollTrigger } from 'gsap/ScrollTrigger'
import { cn } from '@/lib/utils/cn'
import type { ScrollTriggerProps } from './ScrollTrigger.types'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(GSAPScrollTrigger)
}

const animationPresets = {
  fadeIn: {
    from: { opacity: 0 },
    to: { opacity: 1 }
  },
  slideUp: {
    from: { y: 50, opacity: 0 },
    to: { y: 0, opacity: 1 }
  },
  slideLeft: {
    from: { x: 50, opacity: 0 },
    to: { x: 0, opacity: 1 }
  },
  slideRight: {
    from: { x: -50, opacity: 0 },
    to: { x: 0, opacity: 1 }
  },
  scale: {
    from: { scale: 0.8, opacity: 0 },
    to: { scale: 1, opacity: 1 }
  },
  rotate: {
    from: { rotation: 15, opacity: 0 },
    to: { rotation: 0, opacity: 1 }
  }
}

const ScrollTrigger = ({
  children,
  className,
  animation = 'fadeIn',
  duration = 1,
  delay = 0,
  start = 'top 80%',
  end = 'bottom 20%',
  markers = false,
  scrub = false,
  pin = false,
  onEnter,
  onLeave,
  onEnterBack,
  onLeaveBack
}: ScrollTriggerProps) => {
  const elementRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<gsap.core.Tween | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined' || !elementRef.current) return

    const element = elementRef.current
    const preset = animationPresets[animation]

    // 设置初始状态
    gsap.set(element, preset.from)

    // 创建动画
    animationRef.current = gsap.to(element, {
      ...preset.to,
      duration,
      delay,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: element,
        start,
        end,
        markers,
        scrub,
        pin,
        onEnter,
        onLeave,
        onEnterBack,
        onLeaveBack
      }
    })

    return () => {
      if (animationRef.current) {
        animationRef.current.kill()
      }
      GSAPScrollTrigger.getAll().forEach(st => {
        if (st.trigger === element) {
          st.kill()
        }
      })
    }
  }, [animation, duration, delay, start, end, markers, scrub, pin, onEnter, onLeave, onEnterBack, onLeaveBack])

  return (
    <div ref={elementRef} className={cn('scroll-trigger-element', className)}>
      {children}
    </div>
  )
}

export default ScrollTrigger