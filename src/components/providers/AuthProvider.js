// src/components/providers/AuthProvider.js
"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";

export default function AuthProvider({ children }) {
  const { loading, initializeAuth } = useAuthStore();

  useEffect(() => {
    const unsubscribe = initializeAuth();
    return unsubscribe;
  }, [initializeAuth]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return <>{children}</>;
}
