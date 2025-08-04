import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Theme = 'light' | 'dark' | 'auto'
type EffectiveTheme = 'light' | 'dark'

interface ThemeState {
  theme: Theme
  effectiveTheme: EffectiveTheme
  systemPreference: EffectiveTheme
  setTheme: (theme: Theme) => void
  setSystemPreference: (preference: EffectiveTheme) => void
  toggleTheme: () => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'auto',
      effectiveTheme: 'light',
      systemPreference: 'light',
      
      setTheme: (theme: Theme) => {
        const { systemPreference } = get()
        const effectiveTheme = theme === 'auto' ? systemPreference : theme
        set({ theme, effectiveTheme })
      },
      
      setSystemPreference: (preference: EffectiveTheme) => {
        const { theme } = get()
        const effectiveTheme = theme === 'auto' ? preference : get().effectiveTheme
        set({ systemPreference: preference, effectiveTheme })
      },
      
      toggleTheme: () => {
        const { theme } = get()
        const nextTheme = theme === 'light' ? 'dark' : theme === 'dark' ? 'auto' : 'light'
        get().setTheme(nextTheme)
      }
    }),
    {
      name: 'theme-storage',
      partialize: (state) => ({ theme: state.theme })
    }
  )
)