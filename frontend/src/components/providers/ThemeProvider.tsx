'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark' | 'auto'
type EffectiveTheme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  effectiveTheme: EffectiveTheme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('auto')
  const [effectiveTheme, setEffectiveTheme] = useState<EffectiveTheme>('light')
  const [mounted, setMounted] = useState(false)

  // 初始化主题
  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem('theme') as Theme
    if (stored) {
      setTheme(stored)
      if (stored !== 'auto') {
        setEffectiveTheme(stored as EffectiveTheme)
      } else {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
        setEffectiveTheme(systemTheme)
      }
    } else {
      // 默认跟随系统
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      setEffectiveTheme(systemTheme)
    }
  }, [])

  // 监听系统主题变化
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent) => {
      if (theme === 'auto') {
        setEffectiveTheme(e.matches ? 'dark' : 'light')
      }
    }
    
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theme])

  useEffect(() => {
    // Apply theme to document
    const root = document.documentElement
    if (effectiveTheme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [effectiveTheme])

  const handleSetTheme = (newTheme: Theme) => {
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    
    if (newTheme !== 'auto') {
      setEffectiveTheme(newTheme)
    } else {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      setEffectiveTheme(systemTheme)
    }
  }

  // 避免服务端渲染问题
  if (!mounted) {
    return <>{children}</>
  }

  return (
    <ThemeContext.Provider value={{ theme, effectiveTheme, setTheme: handleSetTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}