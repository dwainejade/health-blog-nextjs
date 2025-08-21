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
      userRole: null, // Store role from server
      serverChecked: false,

      // Actions
      setUser: async (user) => {
        set({
          user,
          isAuthenticated: !!user,
          loading: false,
        });

        // Check role with server if user exists
        if (user?.email) {
          await get().checkUserRole(user.email);
        } else {
          set({ userRole: null, serverChecked: false });
        }
      },

      // Server-side role check
      checkUserRole: async (email) => {
        try {
          const response = await fetch("/api/auth/check", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
          });

          const data = await response.json();

          set({
            userRole: data.role,
            serverChecked: true,
          });
        } catch (error) {
          console.error("Role check failed:", error);
          set({
            userRole: "user",
            serverChecked: true,
          });
        }
      },

      setLoading: (loading) => set({ loading }),

      // Check if user is authenticated
      isAuthenticated: () => {
        const { user } = get();
        return !!user;
      },

      // Check if user is admin (now secure)
      isAdmin: () => {
        const { userRole, serverChecked } = get();
        return serverChecked && userRole === "admin";
      },

      // Check if role has been verified by server
      isRoleVerified: () => {
        const { serverChecked } = get();
        return serverChecked;
      },

      logout: async () => {
        try {
          await signOut(auth);
          set({
            user: null,
            isAuthenticated: false,
            userRole: null,
            serverChecked: false,
          });
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
        // Don't persist role - always check with server
      }),
    }
  )
);
