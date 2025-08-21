// src/components/auth/ProtectedRoute.jsx
"use client";

import React, { useState, useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";
import Login from "./Login";
import { FaLock, FaEdit, FaSpinner } from "react-icons/fa";

const ProtectedRoute = ({ children, requireRole = null }) => {
  const { user, loading, isAuthenticated, isAdmin, isRoleVerified } =
    useAuthStore();
  const [showLogin, setShowLogin] = useState(false);

  // Show loading while Firebase auth or role check is pending
  if (loading || (user && !isRoleVerified())) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin h-12 w-12 text-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600">
            {loading ? "Loading..." : "Verifying permissions..."}
          </p>
        </div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!isAuthenticated()) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaLock className="w-10 h-10 text-blue-600" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Authentication Required
          </h1>

          <p className="text-gray-600 mb-8">
            You need to be signed in to access this page. Only authorized users
            can access this content.
          </p>

          <button
            onClick={() => setShowLogin(true)}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <FaEdit className="w-4 h-4" />
            <span>Sign In to Continue</span>
          </button>
        </div>

        {showLogin && <Login onClose={() => setShowLogin(false)} />}
      </div>
    );
  }

  // Check admin role requirement
  if (requireRole === "admin" && !isAdmin()) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaLock className="w-10 h-10 text-red-600" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Admin Access Required
          </h1>

          <p className="text-gray-600 mb-8">
            You don't have administrator privileges required to access this
            page.
          </p>

          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
