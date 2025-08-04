'use client'

import { useState, useEffect } from 'react'

export interface ThemeConfig {
  mode: 'light' | 'dark' | 'auto'
  effectiveTheme: 'light' | 'dark'
  systemPreference: 'light' | 'dark'
}

export interface UseThemeReturn {
  theme: 'light' | 'dark' | 'auto'
  effectiveTheme: 'light' | 'dark'
  setTheme: (mode: 'light' | 'dark' | 'auto') => void
  toggleTheme: () => void
}

export const useTheme = (): UseThemeReturn => {
  const [theme, setThemeState] = useState<ThemeConfig>({
    mode: 'auto',
    effectiveTheme: 'light',
    systemPreference: 'light'
  })

  // Detect system preference
  useEffect(() => {
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const systemPreference = mediaQuery.matches ? 'dark' : 'light'
    
    setThemeState(prev => ({
      ...prev,
      systemPreference
    }))

    const handleSystemChange = (e: MediaQueryListEvent) => {
      const newSystemPreference = e.matches ? 'dark' : 'light'
      setThemeState(prev => ({
        ...prev,
        systemPreference: newSystemPreference,
        effectiveTheme: prev.mode === 'auto' ? newSystemPreference : prev.effectiveTheme
      }))
    }

    mediaQuery.addEventListener('change', handleSystemChange)
    return () => mediaQuery.removeEventListener('change', handleSystemChange)
  }, [])

  // Load saved theme from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return

    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'auto' | null
    if (savedTheme) {
      setThemeState(prev => ({
        ...prev,
        mode: savedTheme,
        effectiveTheme: savedTheme === 'auto' ? prev.systemPreference : savedTheme
      }))
    }
  }, [])

  // Apply theme to document
  useEffect(() => {
    if (typeof window === 'undefined') return

    const root = document.documentElement
    if (theme.effectiveTheme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [theme.effectiveTheme])

  const setTheme = (mode: 'light' | 'dark' | 'auto') => {
    if (typeof window === 'undefined') return

    const effectiveTheme = mode === 'auto' ? theme.systemPreference : mode
    
    setThemeState(prev => ({
      ...prev,
      mode,
      effectiveTheme
    }))

    localStorage.setItem('theme', mode)
  }

  const toggleTheme = () => {
    const nextMode = theme.mode === 'light' ? 'dark' : theme.mode === 'dark' ? 'auto' : 'light'
    setTheme(nextMode)
  }

  return {
    theme: theme.mode,
    effectiveTheme: theme.effectiveTheme,
    setTheme,
    toggleTheme
  }
}