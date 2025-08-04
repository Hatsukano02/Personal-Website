'use client'

import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { 
  Home, User, Code, Camera, PenTool, 
  Music, Film, Link, Mail, Folder 
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import type { NavigationItem, FloatingNavProps } from './FloatingNav.types'

const NAVIGATION_ITEMS: NavigationItem[] = [
  { id: 'hero', label: 'Home', sectionId: 'hero', icon: Home, isVisible: true },
  { id: 'about', label: 'About', sectionId: 'about', icon: User, isVisible: true },
  { id: 'projects', label: 'Projects', sectionId: 'projects', icon: Code, isVisible: true },
  { id: 'photography', label: 'Photos', sectionId: 'photography', icon: Camera, isVisible: true },
  { id: 'blog', label: 'Blog', sectionId: 'blog', icon: PenTool, isVisible: true },
  { id: 'music', label: 'Music', sectionId: 'music', icon: Music, isVisible: true },
  { id: 'movies', label: 'Movies', sectionId: 'movies', icon: Film, isVisible: true },
  { id: 'media', label: 'Media', sectionId: 'media', icon: Folder, isVisible: true },
  { id: 'links', label: 'Links', sectionId: 'links', icon: Link, isVisible: true },
  { id: 'contact', label: 'Contact', sectionId: 'contact', icon: Mail, isVisible: true }
]


const DESKTOP_VISIBLE_COUNT = 5
const DESKTOP_CENTER_INDEX = 2

const FloatingNav = ({ className }: FloatingNavProps) => {
  const [activeSection, setActiveSection] = useState('hero')
  const [activeSectionIndex, setActiveSectionIndex] = useState(0)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  // 移除baseContainerWidth状态，改为实时计算
  const [scale, setScale] = useState(1) // 当前缩放比例
  const navRef = useRef<HTMLElement>(null) // 导航栏引用
  const leaveTimerRef = useRef<NodeJS.Timeout | null>(null) // 离开延迟计时器

  // Intersection Observer 检测活跃section
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -80% 0px', // 只有当section在视窗中间20%-80%区域时才被认为是活跃的
      threshold: 0
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id
          const index = NAVIGATION_ITEMS.findIndex(item => item.sectionId === sectionId)
          if (index !== -1) {
            setActiveSection(sectionId)
            setActiveSectionIndex(index)
          }
        }
      })
    }, observerOptions)

    // 观察所有section
    NAVIGATION_ITEMS.forEach(item => {
      const section = document.getElementById(item.sectionId)
      if (section) {
        observer.observe(section)
      }
    })

    return () => observer.disconnect()
  }, [])

  // 余弦函数缩放计算 - 提前定义
  const getItemScale = useCallback((itemIndex: number, activeIndex: number) => {
    const distanceFromActive = Math.abs(itemIndex - activeIndex)
    const maxDistance = DESKTOP_CENTER_INDEX // 最大距离是中心位置
    
    // 使用余弦函数计算缩放值，距离活跃项越近缩放越大
    const normalizedDistance = Math.min(distanceFromActive / maxDistance, 1)
    const cosineScale = (Math.cos(normalizedDistance * Math.PI) + 1) / 2
    
    return {
      fontWeight: Math.round(400 + cosineScale * 300), // 400-700
      fontWidth: Math.round(85 + cosineScale * 15),    // 85-100
      fontSize: Math.round(14 + cosineScale * 4)       // 14-18px
    }
  }, [])

  // 计算可见范围（只显示5个项目）
  const getVisibleRange = useCallback(() => {
    const totalItems = NAVIGATION_ITEMS.length
    let startIndex = Math.max(0, activeSectionIndex - DESKTOP_CENTER_INDEX)
    let endIndex = Math.min(totalItems, startIndex + DESKTOP_VISIBLE_COUNT)
    
    // 边界处理：确保总是显示5个项目
    if (endIndex - startIndex < DESKTOP_VISIBLE_COUNT && totalItems >= DESKTOP_VISIBLE_COUNT) {
      if (startIndex === 0) {
        endIndex = DESKTOP_VISIBLE_COUNT
      } else if (endIndex === totalItems) {
        startIndex = totalItems - DESKTOP_VISIBLE_COUNT
      }
    }
    
    return { startIndex, endIndex }
  }, [activeSectionIndex])

  // 计算标准项目宽度 - 找最宽的项目作为所有项目的布局基准
  const STANDARD_ITEM_WIDTH = useMemo(() => {
    let maxWidth = 0
    NAVIGATION_ITEMS.forEach(item => {
      const textLength = item.label.length
      const standardFontSize = 14
      const estimatedTextWidth = textLength * standardFontSize * 0.6
      const iconWidth = 16
      const itemPadding = 24
      const itemWidth = iconWidth + 8 + estimatedTextWidth + itemPadding
      maxWidth = Math.max(maxWidth, itemWidth)
    })
    return maxWidth
  }, [])

  // 固定容器宽度 - 恢复统一参数，简单调整
  const GAP_SIZE = 6 // 适中的gap
  const CONTAINER_PADDING = 16 // 增加padding改善居中
  const CONTAINER_WIDTH = DESKTOP_VISIBLE_COUNT * STANDARD_ITEM_WIDTH + (DESKTOP_VISIBLE_COUNT - 1) * GAP_SIZE + CONTAINER_PADDING

  // 不再需要测量相关的useEffect，改为实时计算

  // 鼠标距离计算和响应效果
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!navRef.current) return

      const rect = navRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      
      // 计算鼠标到导航栏中心的距离 - 使用椭圆形响应区域
      const distanceX = Math.abs(e.clientX - centerX)
      const distanceY = Math.abs(e.clientY - centerY)
      
      // 椭圆形响应范围：左右350px，上下150px
      const maxDistanceX = 350
      const maxDistanceY = 150
      
      // 椭圆形判断：(x/a)² + (y/b)² < 1
      const normalizedX = distanceX / maxDistanceX
      const normalizedY = distanceY / maxDistanceY
      const ellipseDistance = normalizedX * normalizedX + normalizedY * normalizedY
      const isNear = ellipseDistance < 1
      
      // 清除之前的延迟计时器（无论状态如何变化）
      if (leaveTimerRef.current) {
        clearTimeout(leaveTimerRef.current)
        leaveTimerRef.current = null
      }
      
      if (isNear) {
        // 鼠标在范围内：立即计算并设置缩放
        const normalizedDistance = Math.max(0, Math.min(1, 1 - ellipseDistance))
        const easedDistance = 1 - Math.pow(1 - normalizedDistance, 3)
        const targetScale = 1 + easedDistance * 0.15 // 最大放大15%
        setScale(targetScale)
      } else {
        // 鼠标离开范围：设置延迟恢复
        leaveTimerRef.current = setTimeout(() => {
          setScale(1)
          leaveTimerRef.current = null
        }, 500)
      }
    }

    document.addEventListener('mousemove', handleMouseMove)
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      if (leaveTimerRef.current) {
        clearTimeout(leaveTimerRef.current)
        leaveTimerRef.current = null
      }
    }
  }, []) // 移除依赖，避免重复绑定事件

  // 清理计时器
  useEffect(() => {
    return () => {
      if (leaveTimerRef.current) {
        clearTimeout(leaveTimerRef.current)
      }
    }
  }, [])

  // 移除重复的getVisibleRange定义

  // 移除重复的getItemScale定义

  // 处理鼠标滚轮切换section
  const handleNavWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY
    const currentIndex = activeSectionIndex
    let newIndex
    
    if (delta > 0 && currentIndex < NAVIGATION_ITEMS.length - 1) {
      // 向下滚动，切换到下一个section
      newIndex = currentIndex + 1
    } else if (delta < 0 && currentIndex > 0) {
      // 向上滚动，切换到上一个section
      newIndex = currentIndex - 1
    } else {
      return
    }
    
    const section = document.getElementById(NAVIGATION_ITEMS[newIndex].sectionId)
    section?.scrollIntoView({ behavior: 'smooth' })
  }, [activeSectionIndex])

  // 处理键盘导航
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault()
        const direction = e.key === 'ArrowLeft' ? -1 : 1
        const newIndex = activeSectionIndex + direction
        
        if (newIndex >= 0 && newIndex < NAVIGATION_ITEMS.length) {
          const targetSection = document.getElementById(NAVIGATION_ITEMS[newIndex].sectionId)
          targetSection?.scrollIntoView({ behavior: 'smooth' })
        }
      }
    }

    // 添加键盘事件监听
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [activeSectionIndex])

  // 滚动偏移需要响应 activeSectionIndex 的变化
  const scrollOffset = useMemo(() => {
    const { startIndex } = getVisibleRange()
    const itemSlotWidth = STANDARD_ITEM_WIDTH + GAP_SIZE
    const offset = startIndex * itemSlotWidth
    const totalItemsWidth = NAVIGATION_ITEMS.length * itemSlotWidth - GAP_SIZE
    const maxOffset = Math.max(0, totalItemsWidth - CONTAINER_WIDTH + CONTAINER_PADDING)
    return Math.max(0, Math.min(offset, maxOffset))
  }, [activeSectionIndex])

  return (
    <nav 
      ref={navRef}
      className={cn(
        'fixed bottom-8 left-1/2 z-50',
        'bg-light-background-secondary/80 dark:bg-dark-background-secondary/80',
        'backdrop-blur-md border border-light-border-default/20 dark:border-dark-border-default/20',
        'rounded-full shadow-lg px-4 py-2',
        'nav-mouse-responsive',
        className
      )}
      style={{
        transform: `translate(-50%, 0) scale(${scale})`,
        transformOrigin: 'center bottom'
      }}>
      <div 
        className="flex items-center gap-2 overflow-hidden relative transition-all duration-500 ease-out"
        style={{ 
          width: `${CONTAINER_WIDTH}px`
        }}
        onWheel={handleNavWheel}
      >
        <div 
          ref={scrollContainerRef}
          className="flex items-center transition-transform duration-500 ease-out"
          style={{
            gap: `${GAP_SIZE}px`,
            transform: `translateX(-${scrollOffset}px)` // 基于实际测量的滚动偏移
          }}
        >
          {/* 渲染全部10个项目，通过transform实现滚动 */}
          {NAVIGATION_ITEMS.map((item, index) => {
            const Icon = item.icon
            const isActive = item.sectionId === activeSection
            const scale = getItemScale(index, activeSectionIndex)
            
            return (
              <button
                key={item.id}
                data-active={isActive}
                onClick={() => {
                  const section = document.getElementById(item.sectionId)
                  section?.scrollIntoView({ behavior: 'smooth' })
                }}
                className={cn(
                  "flex items-center gap-2 px-3 py-1 rounded-full cursor-pointer transition-all duration-300 hover:scale-105 group",
                  isActive 
                    ? "bg-light-background-tertiary/90 dark:bg-dark-background-tertiary/90" 
                    : "hover:bg-light-background-tertiary/70 dark:hover:bg-dark-background-tertiary/70"
                )}
                style={{
                  width: `${STANDARD_ITEM_WIDTH}px`, // 固定所有项目为标准宽度
                  justifyContent: 'center' // 内容居中对齐
                }}
              >
                <Icon 
                  size={16} 
                  className={cn(
                    "transition-colors duration-200",
                    isActive 
                      ? "text-light-text-primary dark:text-dark-text-primary" 
                      : "text-light-text-secondary dark:text-dark-text-secondary group-hover:text-light-text-primary dark:group-hover:text-dark-text-primary"
                  )}
                />
                <span 
                  className={cn(
                    "font-variable transition-all duration-300 ease-out whitespace-nowrap",
                    isActive 
                      ? "text-light-text-primary dark:text-dark-text-primary" 
                      : "text-light-text-secondary dark:text-dark-text-secondary group-hover:text-light-text-primary dark:group-hover:text-dark-text-primary"
                  )}
                  style={{
                    fontSize: `${scale.fontSize}px`,
                    fontVariationSettings: `"wght" ${scale.fontWeight}, "wdth" ${scale.fontWidth}`,
                  }}
                >
                  {item.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}

export default FloatingNav