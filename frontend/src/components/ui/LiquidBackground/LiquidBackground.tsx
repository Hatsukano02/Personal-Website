'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

interface LiquidBackgroundProps {
  variant?: 'primary' | 'secondary' | 'tertiary'
  className?: string
}

export default function LiquidBackground({ 
  variant = 'primary', 
  className = '' 
}: LiquidBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<gsap.core.Timeline | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const layers = container.querySelectorAll('.liquid-layer')

    // 创建GSAP时间轴
    const tl = gsap.timeline({ repeat: -1, yoyo: true })
    timelineRef.current = tl

    // 为每个液体层设置不同的动画
    layers.forEach((layer, index) => {
      const duration = 25 + index * 5 // 不同层有不同的动画时长
      const rotation = index % 2 === 0 ? 360 : -360
      const scale = 0.8 + Math.random() * 0.4
      
      tl.to(layer, {
        duration: duration,
        rotation: rotation,
        scale: scale,
        x: (Math.random() - 0.5) * 100,
        y: (Math.random() - 0.5) * 60,
        ease: "sine.inOut"
      }, index * -8) // 错开启动时间
    })

    // 噪点纹理动画
    const noiseTexture = container.querySelector('.noise-texture')
    if (noiseTexture) {
      gsap.to(noiseTexture, {
        duration: 20,
        backgroundPosition: '100px 50px, -50px 100px, 25px -75px, -100px 25px',
        repeat: -1,
        ease: "none"
      })
    }

    return () => {
      tl.kill()
    }
  }, [variant])

  const getVariantClasses = () => {
    switch (variant) {
      case 'secondary':
        return 'liquid-background--secondary'
      case 'tertiary':
        return 'liquid-background--tertiary'
      default:
        return 'liquid-background--primary'
    }
  }

  return (
    <>
      {/* SVG滤镜定义 */}
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          {/* 主液体扭曲滤镜 */}
          <filter 
            id="liquid-distortion" 
            x="-20%" 
            y="-20%" 
            width="140%" 
            height="140%"
          >
            <feTurbulence 
              type="fractalNoise" 
              baseFrequency="0.004 0.006" 
              numOctaves="2" 
              seed="2"
              result="noise"
            >
              <animate 
                attributeName="baseFrequency" 
                values="0.004 0.006;0.006 0.004;0.004 0.006" 
                dur="60s" 
                repeatCount="indefinite"
              />
            </feTurbulence>
            
            <feDisplacementMap 
              in="SourceGraphic" 
              in2="noise" 
              scale="20"
              xChannelSelector="R" 
              yChannelSelector="G"
            />
          </filter>
          
          {/* 柔和液体滤镜 */}
          <filter id="liquid-soft">
            <feGaussianBlur stdDeviation="3" result="blurred"/>
            <feColorMatrix 
              in="blurred" 
              type="matrix" 
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -2"
            />
          </filter>
          
          {/* 噪声纹理滤镜 */}
          <filter id="noise-texture">
            <feTurbulence 
              type="turbulence" 
              baseFrequency="0.9" 
              numOctaves="1" 
              result="noise"
            />
            <feColorMatrix 
              in="noise" 
              type="saturate" 
              values="0"
              result="gray-noise"
            />
            <feComponentTransfer in="gray-noise">
              <feFuncA type="discrete" tableValues="0 0.02 0.04 0.06"/>
            </feComponentTransfer>
            <feComposite 
              in2="SourceGraphic" 
              operator="multiply"
            />
          </filter>
        </defs>
      </svg>

      {/* 液体背景容器 */}
      <div 
        ref={containerRef}
        className={`liquid-background ${getVariantClasses()} ${className}`}
      >
        {/* 主要液体层 */}
        <div className="liquid-layer liquid-layer--primary"></div>
        
        {/* 次要液体层 */}
        <div className="liquid-layer liquid-layer--secondary"></div>
        
        {/* 第三液体层 */}
        <div className="liquid-layer liquid-layer--tertiary"></div>
        
        {/* 第四液体层 - 增加复杂度 */}
        <div className="liquid-layer liquid-layer--quaternary"></div>
        
        {/* 噪点纹理覆盖 */}
        <div className="noise-texture"></div>
      </div>
    </>
  )
}