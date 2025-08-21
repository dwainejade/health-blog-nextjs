// src/components/blog/BlogList.jsx
"use client";

import React, { useState, useMemo } from "react";
import BlogCard from "./BlogCard";
import SearchBar from "./SearchBar";
import CategoryFilter from "./CategoryFilter";
import { usePublicPosts } from "@/hooks/useFirebasePosts";

const BlogList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Use Firebase hook for fetching published posts
  const { posts, loading, error, hasMore, loadMore, refreshPosts } =
    usePublicPosts(10); // Load 10 posts at a time

  // Extract unique categories from posts for filtering
  const categories = useMemo(() => {
    const allCategories = posts.flatMap((post) => post.categories || []);
    const uniqueCategories = [...new Set(allCategories)];

    return [
      { id: "all", name: "All Categories" },
      ...uniqueCategories.map((cat) => ({ id: cat, name: cat })),
    ];
  }, [posts]);

  // Filter and search posts
  const filteredPosts = useMemo(() => {
    let filtered = posts;

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((post) =>
        post.categories?.includes(selectedCategory)
      );
    }

    // Filter by search term
    if (searchTerm) {
      const lowercaseSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (post) =>
          post.title?.toLowerCase().includes(lowercaseSearch) ||
          post.content?.toLowerCase().includes(lowercaseSearch) ||
          post.categories?.some((cat) =>
            cat.toLowerCase().includes(lowercaseSearch)
          ) ||
          post.tags?.some((tag) => tag.toLowerCase().includes(lowercaseSearch))
      );
    }

    return filtered;
  }, [posts, selectedCategory, searchTerm]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const handleRetry = () => {
    refreshPosts();
  };

  if (loading && posts.length === 0) {
    return (
      <div className="bg-white min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse space-y-8">
            <div className="text-center space-y-4">
              <div className="h-10 bg-gray-200 rounded w-2/3 mx-auto"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto"></div>
            </div>
            <div className="h-12 bg-gray-200 rounded max-w-md mx-auto"></div>
            <div className="flex justify-center space-x-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-8 bg-gray-200 rounded w-20"></div>
              ))}
            </div>
            <div className="space-y-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <div className="h-64 bg-gray-200 rounded-lg"></div>
                  <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && posts.length === 0) {
    return (
      <div className="bg-white min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="text-red-600 text-xl mb-4">⚠️ {error}</div>
            <p className="text-gray-600 mb-6">
              Failed to load blog posts. Please check your connection and try
              again.
            </p>
            <button
              onClick={handleRetry}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center py-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Cycles & Stages
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Evidence-based insights for a healthier, happier life
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-12 space-y-6">
          <div className="max-w-md mx-auto">
            <SearchBar onSearch={handleSearch} />
          </div>

          {categories.length > 1 && (
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
            />
          )}
        </div>

        {/* Results Count */}
        <div className="mb-8">
          <p className="text-gray-600">
            {filteredPosts.length === 0
              ? "No articles found"
              : `${filteredPosts.length} article${
                  filteredPosts.length !== 1 ? "s" : ""
                }`}
            {searchTerm && (
              <span className="ml-1">
                for "<span className="font-medium">{searchTerm}</span>"
              </span>
            )}
          </p>
        </div>

        {/* No Results */}
        {filteredPosts.length === 0 && posts.length > 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📚</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No articles found
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search terms or browsing different categories.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
              }}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* No Posts at All */}
        {posts.length === 0 && !loading && !error && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">✍️</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No posts published yet
            </h3>
            <p className="text-gray-600">Check back soon for new content!</p>
          </div>
        )}

        {/* Blog Posts */}
        {filteredPosts.length > 0 && (
          <div className="pb-12">
            {filteredPosts.map((post, index) => (
              <React.Fragment key={post.id}>
                <BlogCard
                  post={post}
                  isLast={index === filteredPosts.length - 1}
                />
                {index !== filteredPosts.length - 1 && (
                  <div className="h-1 w-full border-b border-gray-300 my-8" />
                )}
              </React.Fragment>
            ))}
          </div>
        )}

        {/* Load More Button */}
        {filteredPosts.length > 0 && hasMore && (
          <div className="text-center pb-12">
            <button
              className="bg-gray-100 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={loadMore}
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-700 inline"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Loading...
                </>
              ) : (
                "Load More Articles"
              )}
            </button>
          </div>
        )}

        {/* Error indicator for additional loads */}
        {error && posts.length > 0 && (
          <div className="text-center pb-6">
            <p className="text-red-600 text-sm">
              Error loading more posts.
              <button
                onClick={loadMore}
                className="ml-2 text-blue-600 hover:underline"
              >
                Try again
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogList;
