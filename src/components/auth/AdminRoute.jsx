// src/components/auth/AdminRoute.jsx
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Login from "./Login";
import { FaLock, FaShieldAlt } from "react-icons/fa";

const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
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
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaLock className="w-10 h-10 text-blue-600" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Admin Access Required
          </h1>

          <p className="text-gray-600 mb-8">
            This area is restricted to authorized administrators only. Please
            sign in with your admin credentials to continue.
          </p>

          <button
            onClick={() => setShowLogin(true)}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <FaShieldAlt className="w-4 h-4" />
            <span>Sign In as Admin</span>
          </button>
        </div>

        {showLogin && <Login onClose={() => setShowLogin(false)} />}
      </div>
    );
  }

  // Check if user has admin role
  if (!isAdmin()) {
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
            You don't have administrator privileges. Contact the system
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

  // User is authenticated and has admin privileges
  return children;
};

export default AdminRoute;
