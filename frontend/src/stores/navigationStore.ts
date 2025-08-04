import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface NavigationState {
  activeSection: string
  isFloatingNavVisible: boolean
  setActiveSection: (section: string) => void
  toggleNavVisibility: (visible?: boolean) => void
  updateNavVisibility: (scrollY: number, scrollDirection: 'up' | 'down' | null) => void
}

export const useNavigationStore = create<NavigationState>()(
  persist(
    (set) => ({
      activeSection: 'hero',
      isFloatingNavVisible: true,
      
      setActiveSection: (section: string) => {
        set({ activeSection: section })
      },
      
      toggleNavVisibility: (visible?: boolean) => {
        set(state => ({ 
          isFloatingNavVisible: visible !== undefined ? visible : !state.isFloatingNavVisible 
        }))
      },
      
      updateNavVisibility: (scrollY: number, scrollDirection: 'up' | 'down' | null) => {
        const shouldShow = scrollY < 100 || scrollDirection === 'up'
        set({ isFloatingNavVisible: shouldShow })
      }
    }),
    {
      name: 'navigation-storage',
      partialize: (state) => ({ 
        activeSection: state.activeSection
      })
    }
  )
)