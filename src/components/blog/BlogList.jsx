// src/components/blog/BlogList.js
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useBlogStore } from "@/stores/blogStore";
import { useUIStore } from "@/stores/uiStore";
import { FaSearch, FaFilter, FaSort } from "react-icons/fa";

export default function BlogList() {
  const {
    posts,
    loading,
    error,
    searchQuery,
    selectedCategory,
    sortBy,
    getFilteredPosts,
    setSearchQuery,
    setSelectedCategory,
    setSortBy,
    setPosts,
    setLoading,
    setError,
  } = useBlogStore();

  const { addNotification } = useUIStore();

  const [localSearch, setLocalSearch] = useState(searchQuery);

  // Fetch posts on component mount
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/github/posts");
        if (!response.ok) throw new Error("Failed to fetch posts");

        const data = await response.json();
        setPosts(data.posts || []);

        addNotification({
          type: "success",
          message: `Loaded ${data.posts?.length || 0} posts`,
        });
      } catch (err) {
        setError(err.message);
        addNotification({
          type: "error",
          message: "Failed to load posts",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [setPosts, setLoading, setError, addNotification]);

  // Debounce search
  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearchQuery(localSearch);
    }, 300);

    return () => clearTimeout(timeout);
  }, [localSearch, setSearchQuery]);

  const filteredPosts = getFilteredPosts();

  const categories = [
    "all",
    "nutrition",
    "exercise",
    "mental-health",
    "wellness",
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">Error: {error}</div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search posts..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 items-center">
          {/* Category Filter */}
          <div className="flex items-center space-x-2">
            <FaFilter className="text-gray-400 w-4 h-4" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === "all"
                    ? "All Categories"
                    : category
                        .replace("-", " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Filter */}
          <div className="flex items-center space-x-2">
            <FaSort className="text-gray-400 w-4 h-4" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="date">Latest First</option>
              <option value="title">Title A-Z</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>

          {/* Results Count */}
          <div className="text-sm text-gray-500 ml-auto">
            {filteredPosts.length}{" "}
            {filteredPosts.length === 1 ? "post" : "posts"}
          </div>
        </div>
      </div>

      {/* Posts Grid */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">
            {posts.length === 0
              ? "No posts found"
              : "No posts match your search criteria"}
          </div>
          {searchQuery && (
            <button
              onClick={() => {
                setLocalSearch("");
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post) => (
            <BlogCard key={post.id || post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
