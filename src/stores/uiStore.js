// src/stores/uiStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useUIStore = create(
  persist(
    (set) => ({
      // Theme
      theme: "light", // 'light', 'dark', 'system'

      // Navigation
      isMobileMenuOpen: false,
      isSearchOpen: false,

      // Modals
      isLoginModalOpen: false,
      isImageModalOpen: false,
      isSettingsModalOpen: false,

      // Layout preferences
      sidebarCollapsed: false,
      editorLayout: "split", // 'split', 'write', 'preview'

      // Notifications
      notifications: [],

      // Actions
      setTheme: (theme) => set({ theme }),

      toggleMobileMenu: () =>
        set((state) => ({
          isMobileMenuOpen: !state.isMobileMenuOpen,
        })),

      closeMobileMenu: () => set({ isMobileMenuOpen: false }),

      toggleSearch: () =>
        set((state) => ({
          isSearchOpen: !state.isSearchOpen,
        })),

      openLoginModal: () => set({ isLoginModalOpen: true }),
      closeLoginModal: () => set({ isLoginModalOpen: false }),

      openImageModal: () => set({ isImageModalOpen: true }),
      closeImageModal: () => set({ isImageModalOpen: false }),

      openSettingsModal: () => set({ isSettingsModalOpen: true }),
      closeSettingsModal: () => set({ isSettingsModalOpen: false }),

      toggleSidebar: () =>
        set((state) => ({
          sidebarCollapsed: !state.sidebarCollapsed,
        })),

      setEditorLayout: (layout) => set({ editorLayout: layout }),

      // Notifications
      addNotification: (notification) =>
        set((state) => ({
          notifications: [
            ...state.notifications,
            {
              id: Date.now(),
              timestamp: new Date().toISOString(),
              ...notification,
            },
          ],
        })),

      removeNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        })),

      clearNotifications: () => set({ notifications: [] }),
    }),
    {
      name: "ui-storage",
      partialize: (state) => ({
        theme: state.theme,
        sidebarCollapsed: state.sidebarCollapsed,
        editorLayout: state.editorLayout,
      }),
    }
  )
);
