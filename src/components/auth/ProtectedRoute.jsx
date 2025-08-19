// src/components/auth/ProtectedRoute.jsx - Fixed for Firebase Auth
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Login from "./Login";
import { FaLock, FaEdit } from "react-icons/fa";

const ProtectedRoute = ({ children, requireRole = null }) => {
  const { isAuthenticated, isAdmin, canEdit, loading } = useAuth();
  const [showLogin, setShowLogin] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
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
            You need to be signed in to access this page. Only authorized
            authors can create and edit blog posts.
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

  // Check if user has required permissions based on requireRole
  if (requireRole) {
    let hasPermission = false;

    switch (requireRole) {
      case "admin":
        hasPermission = isAdmin();
        break;
      case "canEdit":
        hasPermission = canEdit();
        break;
      default:
        // For any other role, check if user is admin (since we only have admins now)
        hasPermission = isAdmin();
        break;
    }

    if (!hasPermission) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-6">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaLock className="w-10 h-10 text-red-600" />
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Access Denied
            </h1>

            <p className="text-gray-600 mb-8">
              You don&apos;t have permission to access this page. Contact an
              administrator if you believe this is an error.
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
  }

  // User is authenticated and has required permissions
  return children;
};

export default ProtectedRoute;
