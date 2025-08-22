"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useUIStore } from "@/stores/uiStore";
import Login from "@/components/auth/Login";
import {
  FaUser,
  FaSignOutAlt,
  FaEdit,
  FaCog,
  FaFileAlt,
  FaHome,
  FaInfoCircle,
  FaChevronDown,
  FaPen,
  FaUserCircle,
} from "react-icons/fa";

const Header = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const {
    isLoginModalOpen,
    openLoginModal,
    closeLoginModal,
    isMobileMenuOpen,
    toggleMobileMenu,
    closeMobileMenu,
  } = useUIStore();

  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showContentDropdown, setShowContentDropdown] = useState(false);
  const pathname = usePathname();

  // Refs for dropdown click outside detection
  const profileDropdownRef = useRef(null);
  const contentDropdownRef = useRef(null);

  const isActive = (path) => pathname === path;

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setShowProfileDropdown(false);
      }
      if (
        contentDropdownRef.current &&
        !contentDropdownRef.current.contains(event.target)
      ) {
        setShowContentDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    closeMobileMenu();
  }, [pathname, closeMobileMenu]);

  const handleLogout = async () => {
    await logout();
    setShowProfileDropdown(false);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">HB</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">
                Cycles & Stages
              </h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive("/")
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <FaHome className="w-4 h-4" />
              <span>Home</span>
            </Link>

            <Link
              href="/about"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive("/about")
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <FaInfoCircle className="w-4 h-4" />
              <span>About</span>
            </Link>

            {/* Admin Navigation */}
            {isAuthenticated && isAdmin && (
              <>
                <div className="h-6 w-px bg-gray-300"></div>
                <div className="relative" ref={contentDropdownRef}>
                  <button
                    onClick={() => setShowContentDropdown(!showContentDropdown)}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      pathname.includes("/admin/write") ||
                      pathname.includes("/admin/drafts")
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <FaPen className="w-4 h-4" />
                    <span>Content</span>
                    <FaChevronDown
                      className={`w-3 h-3 transition-transform ${
                        showContentDropdown ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {showContentDropdown && (
                    <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                      <Link
                        href="/admin/create-post"
                        onClick={() => setShowContentDropdown(false)}
                        className={`flex items-center space-x-2 px-4 py-2 text-sm transition-colors ${
                          isActive("/admin/create-post")
                            ? "bg-blue-50 text-blue-700"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <FaEdit className="w-4 h-4" />
                        <span>Create New Post</span>
                      </Link>

                      <Link
                        href="/admin/manage-posts"
                        onClick={() => setShowContentDropdown(false)}
                        className={`flex items-center space-x-2 px-4 py-2 text-sm transition-colors ${
                          isActive("/admin/manage-posts")
                            ? "bg-blue-50 text-blue-700"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <FaFileAlt className="w-4 h-4" />
                        <span>Manage Drafts</span>
                      </Link>
                    </div>
                  )}
                </div>
              </>
            )}
          </nav>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative" ref={profileDropdownRef}>
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                >
                  <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center">
                    <FaUserCircle className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="hidden sm:block">
                    {user?.displayName || user?.email}
                  </span>
                  <FaChevronDown
                    className={`w-3 h-3 transition-transform ${
                      showProfileDropdown ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {showProfileDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">
                        {user?.displayName || user?.email}
                      </p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                      {isAdmin && (
                        <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full mt-1">
                          Administrator
                        </span>
                      )}
                    </div>

                    <Link
                      href="/admin"
                      onClick={() => setShowProfileDropdown(false)}
                      className={`flex items-center space-x-2 px-4 py-2 text-sm transition-colors ${
                        isActive("/admin")
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <FaCog className="w-4 h-4" />
                      <span>Dashboard</span>
                    </Link>

                    <div className="border-t border-gray-100 my-1"></div>

                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <FaSignOutAlt className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={openLoginModal}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                title="Admin Login"
              >
                Admin
              </button>
            )}

            {/* Mobile menu button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-2">
              <Link
                href="/"
                onClick={closeMobileMenu}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive("/")
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <FaHome className="w-4 h-4" />
                <span>Home</span>
              </Link>

              <Link
                href="/about"
                onClick={closeMobileMenu}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive("/about")
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <FaInfoCircle className="w-4 h-4" />
                <span>About</span>
              </Link>

              {isAuthenticated && isAdmin && (
                <>
                  <div className="border-t border-gray-200 my-2"></div>
                  <Link
                    href="/admin/write"
                    onClick={closeMobileMenu}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive("/admin/write")
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <FaEdit className="w-4 h-4" />
                    <span>Write</span>
                  </Link>

                  <Link
                    href="/admin/drafts"
                    onClick={closeMobileMenu}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive("/admin/drafts")
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <FaFileAlt className="w-4 h-4" />
                    <span>Drafts</span>
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>

      {/* Login Modal */}
      {isLoginModalOpen && <Login onClose={closeLoginModal} />}
    </header>
  );
};

export default Header;
