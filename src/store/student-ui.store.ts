import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface StudentUiState {
  sidebarCollapsed: boolean
  rightsideMenuCollapsed: boolean
  toggleSidebar: () => void
  toggleRightsideMenu: () => void
  setSidebarCollapsed: (value: boolean) => void
  setRightsideMenuCollapsed: (value: boolean) => void
}

export const useStudentUiStore = create<StudentUiState>()(
  persist(
    (set) => ({
      // Default state
      sidebarCollapsed: false,
      rightsideMenuCollapsed: false,

      // Actions
      toggleSidebar: () => set((state) => ({ 
        sidebarCollapsed: !state.sidebarCollapsed 
      })),
      toggleRightsideMenu: () => set((state) => ({ 
        rightsideMenuCollapsed: !state.rightsideMenuCollapsed 
      })),
      setSidebarCollapsed: (value) => set({ 
        sidebarCollapsed: value 
      }),
      setRightsideMenuCollapsed: (value) => set({ 
        rightsideMenuCollapsed: value 
      }),
    }),
    { name: 'student-ui-store' },
  ),
)
