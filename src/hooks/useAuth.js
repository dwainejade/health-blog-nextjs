// src/hooks/useAuth.js
"use client";

import { useAuthStore } from "@/stores/authStore";

export function useAuth() {
  const {
    user,
    isAuthenticated,
    loading,
    isAdmin,
    logout,
    setUser,
    setLoading,
  } = useAuthStore();

  return {
    user,
    isAuthenticated,
    loading,
    isAdmin,
    logout,
    setUser,
    setLoading,
  };
}
