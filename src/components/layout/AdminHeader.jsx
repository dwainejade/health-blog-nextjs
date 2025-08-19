// src/components/layout/AdminHeader.jsx
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Login from "@/components/auth/Login";
import { FaUser, FaSignOutAlt, FaEdit } from "react-icons/fa";

const AdminHeader = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [showLogin, setShowLogin] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900">
              Your Health Blog
            </h1>
          </div>

          {/* Navigation & Auth */}
          <div className="flex items-center space-x-4">
            {isAuthenticated() ? (
              <>
                {/* Admin User Info */}
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <FaUser className="w-4 h-4" />
                    <span>Welcome, {user.name}</span>
                  </div>

                  {/* Admin Actions */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => (window.location.href = "/admin/write")}
                      className="inline-flex items-center space-x-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      <FaEdit className="w-3 h-3" />
                      <span>Write Post</span>
                    </button>

                    <button
                      onClick={logout}
                      className="inline-flex items-center space-x-1 px-3 py-2 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                    >
                      <FaSignOutAlt className="w-3 h-3" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Public User - Only show admin login if they know to look for it */}
                <button
                  onClick={() => setShowLogin(true)}
                  className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                  title="Admin Login"
                >
                  Admin
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Login Modal */}
      {showLogin && <Login onClose={() => setShowLogin(false)} />}
    </header>
  );
};

export default AdminHeader;
