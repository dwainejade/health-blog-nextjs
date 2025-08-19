// src/stores/authStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      loading: true,
      isAuthenticated: false,

      // Admin emails - could also come from environment
      adminEmails: process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(",") || [],

      // Actions
      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
          loading: false,
        }),

      setLoading: (loading) => set({ loading }),

      // Check if user is authenticated
      isAuthenticated: () => {
        const { user } = get();
        return !!user;
      },

      // Check if user is admin
      isAdmin: () => {
        const { user, adminEmails } = get();
        if (!user?.email) return false;
        return adminEmails.includes(user.email);
      },

      logout: async () => {
        try {
          await signOut(auth);
          set({ user: null, isAuthenticated: false });
        } catch (error) {
          console.error("Logout error:", error);
          throw error;
        }
      },

      // Initialize auth listener
      initializeAuth: () => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          get().setUser(user);
        });
        return unsubscribe;
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
